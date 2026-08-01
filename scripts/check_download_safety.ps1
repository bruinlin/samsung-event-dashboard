param(
    [string]$EventId = "OCTS_2026",
    [string]$PythonPath = ""
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$downloadRoot = Join-Path $repoRoot ("downloads\" + $EventId)
$dataFile = Join-Path $repoRoot ("data\" + $EventId + ".js")
$allowlistFile = Join-Path $PSScriptRoot "download_safety_allowlist.json"
$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()
$information = [System.Collections.Generic.List[string]]::new()

function To-RelativePath([string]$Path) {
    $rootUri = [Uri]::new($repoRoot.TrimEnd("\") + "\")
    $fileUri = [Uri]::new((Resolve-Path -LiteralPath $Path).Path)
    return [Uri]::UnescapeDataString($rootUri.MakeRelativeUri($fileUri).ToString())
}

if (-not (Test-Path -LiteralPath $downloadRoot -PathType Container)) {
    throw "Download directory not found: downloads/$EventId"
}
if (-not (Test-Path -LiteralPath $dataFile -PathType Leaf)) {
    throw "Event data file not found: data/$EventId.js"
}

$allowlist = Get-Content -LiteralPath $allowlistFile -Raw -Encoding utf8 | ConvertFrom-Json
$allowByPath = @{}
foreach ($entry in $allowlist.files) { $allowByPath[$entry.path] = $entry }

$dataText = Get-Content -LiteralPath $dataFile -Raw -Encoding utf8
$registeredPaths = [regex]::Matches($dataText, 'filePath\s*:\s*"([^"]+)"') |
    ForEach-Object { $_.Groups[1].Value } |
    Sort-Object -Unique

foreach ($registeredPath in $registeredPaths) {
    if ($registeredPath -match '^(?:[A-Za-z]:[\\/]|file:|https?://|/)' -or $registeredPath -match '(?:^|/)\.\.(?:/|$)') {
        $errors.Add("Unsafe or non-relative registered path: $registeredPath")
        continue
    }
    if (-not (Test-Path -LiteralPath (Join-Path $repoRoot $registeredPath) -PathType Leaf)) {
        $errors.Add("Registered file does not exist: $registeredPath")
    }
}

$downloadFiles = Get-ChildItem -LiteralPath $downloadRoot -Recurse -File |
    Where-Object { $_.Name -ne ".gitkeep" }
$relativeFiles = $downloadFiles | ForEach-Object { To-RelativePath $_.FullName }

foreach ($relativeFile in $relativeFiles) {
    if ($registeredPaths -notcontains $relativeFile) {
        $errors.Add("Download file is not registered in finalDocuments: $relativeFile")
    }
}

$riskyNamePattern = '(?i)(contract|quotation|payment|reimbursement|invoice|bank|budget|draft|working|review|confidential|internal[ _-]*only)'
$pythonExecutable = $null
if ($PythonPath) {
    if (Test-Path -LiteralPath $PythonPath -PathType Leaf) { $pythonExecutable = $PythonPath }
} else {
    $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
    if ($pythonCommand) { $pythonExecutable = $pythonCommand.Source }
}
if (-not $pythonExecutable -and $downloadFiles.Count -gt 0) {
    $errors.Add("Python is unavailable; PDF content cannot be checked reliably.")
}
$pdfInspector = Join-Path $PSScriptRoot "check_pdf_content.py"

foreach ($file in $downloadFiles) {
        $relativePath = To-RelativePath $file.FullName
        if ($relativePath -match $riskyNamePattern) {
            $errors.Add("Risk keyword in download filename/path: $relativePath")
        }

        $extension = $file.Extension.ToLowerInvariant()
        if ($extension -ne ".pdf") {
            $errors.Add("Unsupported automated content inspection for $relativePath; manual review is required before publication.")
            continue
        }
        if (-not $pythonExecutable) { continue }
        $inspectionJson = & $pythonExecutable $pdfInspector $file.FullName
        if ($LASTEXITCODE -ne 0 -or -not $inspectionJson) {
            $errors.Add("Unable to inspect PDF content: $relativePath")
            continue
        }
        try { $inspection = $inspectionJson | ConvertFrom-Json }
        catch {
            $errors.Add("Invalid PDF inspection result: $relativePath")
            continue
        }
        $hash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
        $entry = $allowByPath[$relativePath]
        $matchesApprovedHash = $entry -and $entry.sha256 -eq $hash
        foreach ($finding in $inspection.errors) {
            if ($matchesApprovedHash -and @($entry.allowedInspectionErrors) -contains $finding) {
                $information.Add("${relativePath}: reviewed, hash-bound inspection exception: $finding")
            } else {
                $errors.Add("${relativePath}: $finding")
            }
        }

        if ($inspection.currencyFindings -gt 0) {
            if ($matchesApprovedHash -and $entry.allowedFinding -eq "public-market-size-currency") {
                $information.Add("${relativePath}: $($inspection.currencyFindings) currency-like value(s) match the reviewed public market-data allowlist.")
            } elseif ($matchesApprovedHash -and $entry.allowedCurrencyFinding -eq $true) {
                $information.Add("${relativePath}: $($inspection.currencyFindings) reviewed, hash-bound currency inspection exception.")
            } else {
                $errors.Add("${relativePath}: currency-like values require manual context review and a matching hash allowlist entry.")
            }
        }
}

Write-Host "Downloads safety scan"
Write-Host "  Event: $EventId"
Write-Host "  Registered files: $($registeredPaths.Count)"
Write-Host "  Files in download directory: $($downloadFiles.Count)"
Write-Host "  Total bytes: $(($downloadFiles | Measure-Object Length -Sum).Sum)"
foreach ($item in $information) { Write-Host "  INFO: $item" }
foreach ($item in $warnings) { Write-Warning $item }
foreach ($item in $errors) { Write-Error $item -ErrorAction Continue }

if ($errors.Count -gt 0) {
    Write-Host "RESULT: FAIL ($($errors.Count) issue(s))"
    exit 1
}

Write-Host "RESULT: PASS"
