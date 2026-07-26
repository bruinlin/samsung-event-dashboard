# Samsung Semiconductor Event Dashboard

Repository: `samsung-event-dashboard`

Framework-free static Event Dashboard for Samsung Semiconductor Marcom. The current sample event is OCTS 2026. All runtime assets are stored in this repository; no server-side application, package installation, CDN, online font, or external API is required.

## Run locally

From the repository root:

```powershell
python -m http.server 8080
```

Open `http://localhost:8080/`. Directly opening `index.html` also works because event data is provided by JavaScript files rather than fetched JSON.

When the URL has no event hash, the Dashboard opens the nearest upcoming event that is not `Completed`; if none remain, it opens the newest completed event. A valid event hash such as `#OCTS_2026` or `#ODX_2026` always takes priority. The Calendar initially opens the month containing the nearest uncompleted task or stage DDL; it falls back to the event month, then the current month.

Project Calendar opens in `2 Weeks` view for every screen size. It shows the current 14-day period in two week groups and lists the next five filtered, unfinished items under Later Deadlines. Use Previous, Today, and Next to move by 14 days; select `Month` for the full month grid. Calendar filters are collapsed by default and continue to apply to both views.

## Update event data

- `event_data.js` is the root event registry. Add each new event here and point `dataFile` to its local data file.
- `data/OCTS_2026.js` contains the OCTS 2026 event details, workstreams, milestones, sessions, result metrics, and document references.
- `data/ODX_2026.js` contains the independent ODX 2026 record. Update this file for ODX progress; do not copy or overwrite OCTS workstreams.
- Hero displays optional `event.themeCN` and `event.themeEN` below the event name. Event Overview groups sponsorship and participation fields, `keynote` details, and Booth/product fields. Keep unconfirmed values as `TBD` or empty; do not add an English theme unless it is confirmed.
- `data/OCTS_2026.js` also contains `finalDocuments`, which controls the unified Documents & Deliverables list, file metadata, category filters, download links, and status-only records.
- Keep the data structure consistent with the existing event file. Use only the supported status values documented at the top of the data file.
- Each workstream belongs to one of three categories: `business-commercial`, `event-operations-content`, or `social-pr-reporting`. Add `categoryId`, `categoryNameCN`, and `categoryNameEN` to every new workstream.
- Use `stages` and `currentStageId` only for tasks that have meaningful multi-step tracking. Stage status values are `Not Started`, `In Progress`, `Pending Review`, `Completed`, and `Blocked`; the dashboard calculates task status and progress from completed stages. Simple tasks keep their existing `status` and `progress` fields.
- `workstreams[].dueDate` is the task Final DDL. Each `stages[]` entry may have its own `dueDate` for the planned stage DDL; `completedDate` is only the actual completion date. Leave an unconfirmed DDL as an empty string so the dashboard can show `Missing DDL` rather than an invented date.
- Update `meta.lastUpdated`, `meta.updatedBy`, and `CHANGELOG.md` with every meaningful revision.
- Do not put contract values, quotation values, credentials, personal data, or non-public source documents in the repository.

## Update task stages and DDL

The Dashboard is read-only. Update `data/<EVENT_ID>.js` directly, or ask Codex to make the same controlled data-file change. Do not try to edit the browser page: changes there are not saved.

Start the Initial Draft:

```js
{
  id: "initial-draft",
  status: "In Progress",
  dueDate: "2026-08-05",
  completedDate: ""
}

currentStageId: "initial-draft"
```

Complete it and move to First Washing:

```js
// Initial Draft
status: "Completed"
completedDate: "2026-08-05"

// First Washing
status: "In Progress"
dueDate: "2026-08-12"

currentStageId: "first-washing"
```

After a task has `stages`, do not manually set a conflicting task `status` or `progress`: the Dashboard calculates both from the stage records. Calendar entries are generated from task Final DDLs, stage DDLs, milestones, and event dates; do not add a separate calendar data array. Use `milestones` only for independent cross-task decision points. Do not duplicate Event Day, ordinary task Final DDLs, or stage DDLs as milestones because the Calendar already derives those entries.

## Maintain Documents & Deliverables

1. Confirm that the source is an approved Final file and is suitable for public or cross-team sharing.
2. Inspect the file content, properties, comments/notes, contacts, amounts, local paths, private links, and embedded content before copying it.
3. Put the verified copy in `downloads/<EVENT_ID>/presentations`, `reports`, `photos`, or `other`.
4. Add or update its record in `data/<EVENT_ID>.js` under `finalDocuments`. Use a repository-relative `filePath` only for an approved public download. For an archived or controlled document, omit `filePath` and set `downloadable: false` so the Dashboard shows its status only. If a reviewed file needs a narrowly scoped scan exception, record its exact SHA-256 and the precise allowed finding in `scripts/download_safety_allowlist.json`; never create a broad exception.
5. Keep an existing public filename when replacing a file so old links do not break. If the filename changes, update `filePath` at the same time.
6. Run `scripts/check_download_safety.ps1`, test each local download URL, then commit and push.

The safety script uses Python with `pypdf` to inspect PDF text, metadata, annotations and embedded content, and fails closed when reliable inspection is unavailable. If Python is not on `PATH`, pass its executable with `-PythonPath`. Non-PDF formats are reported as requiring manual review before publication. Historical and working versions belong in the internal archive, not the public download directory.

GitHub Pages is the acceptance target for Final-file downloads. The current Cloudflare Workers Static Assets service has a 25 MiB individual-file limit, so larger PDFs may remain unavailable from the Cloudflare hostname even though the Dashboard page itself is online. Do not compress, split, or alter an Approved Final merely to meet that limit.

## Add another event

1. Copy the event data file that is closest to the new event. Use `data/ODX_2026.js` as the minimal upcoming-event pattern; do not copy completed historical workstreams from OCTS unless they are actually needed.
2. Change its event ID and replace the data with verified information.
3. Register the new event in `event_data.js` with a relative `dataFile` path, `dateStart`, and `overallStatus` so default activity selection can work without relying on list order.
4. Open the dashboard, switch events, test all filters, and update `CHANGELOG.md`.

## Publish updates to GitHub

```powershell
git add index.html event_data.js assets data downloads scripts README.md CHANGELOG.md VERSION_INDEX.md .gitignore
git commit -m "Update event dashboard"
git push origin main
```

Review `git status` before committing. The backup folder and legacy Supabase helper files are intentionally ignored.

## Deployment

The `main` branch is currently published through GitHub Pages and the existing Cloudflare Workers deployment. Final files use the same repository-relative paths on both hosts. Do not add Worker download logic or change the current Cloudflare deployment method merely to force downloads; PDF preview behavior is browser-dependent and expected.

## Supabase status and security

Supabase is not enabled in this release. Local JavaScript data remains the runtime fallback. If Supabase is introduced later, use only a public anonymous key with Row Level Security and keep the local files as a fallback. Never expose a `service_role` key, access token, password, private contract, quotation amount, or confidential source material in front-end code or Git history.

## Roll back

Use Git history to identify the last stable commit, then revert it with a new commit. Do not force-push or rewrite shared `main` history. A pre-deployment local backup is also retained outside Git in `_backup_before_web_deploy`.
