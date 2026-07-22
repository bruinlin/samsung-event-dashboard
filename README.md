# Samsung Semiconductor Event Dashboard

Repository: `samsung-event-dashboard`

Framework-free static Event Dashboard for Samsung Semiconductor Marcom. The current sample event is OCTS 2026. All runtime assets are stored in this repository; no server-side application, package installation, CDN, online font, or external API is required.

## Run locally

From the repository root:

```powershell
python -m http.server 8080
```

Open `http://localhost:8080/`. Directly opening `index.html` also works because event data is provided by JavaScript files rather than fetched JSON.

## Update event data

- `event_data.js` is the root event registry. Add each new event here and point `dataFile` to its local data file.
- `data/OCTS_2026.js` contains the OCTS 2026 event details, workstreams, milestones, sessions, result metrics, and document references.
- `data/OCTS_2026.js` also contains `finalDocuments`, which controls the Final Deliverables list, file metadata, category filters, and download links.
- Keep the data structure consistent with the existing event file. Use only the supported status values documented at the top of the data file.
- Update `meta.lastUpdated`, `meta.updatedBy`, and `CHANGELOG.md` with every meaningful revision.
- Do not put contract values, quotation values, credentials, personal data, or non-public source documents in the repository.

## Add or replace Final Deliverables

1. Confirm that the source is an approved Final file and is suitable for public or cross-team sharing.
2. Inspect the file content, properties, comments/notes, contacts, amounts, local paths, private links, and embedded content before copying it.
3. Put the verified copy in `downloads/<EVENT_ID>/presentations`, `reports`, `photos`, or `other`.
4. Add or update its record in `data/<EVENT_ID>.js` under `finalDocuments`. Use a repository-relative `filePath` only.
5. Keep an existing public filename when replacing a file so old links do not break. If the filename changes, update `filePath` at the same time.
6. Run `scripts/check_download_safety.ps1`, test each local download URL, then commit and push.

The safety script uses Python with `pypdf` to inspect PDF text, metadata, annotations and embedded content, and fails closed when reliable inspection is unavailable. If Python is not on `PATH`, pass its executable with `-PythonPath`. Non-PDF formats are reported as requiring manual review before publication. Historical and working versions belong in the internal archive, not the public download directory.

GitHub Pages is the acceptance target for Final-file downloads. The current Cloudflare Workers Static Assets service has a 25 MiB individual-file limit, so larger PDFs may remain unavailable from the Cloudflare hostname even though the Dashboard page itself is online. Do not compress, split, or alter an Approved Final merely to meet that limit.

## Add another event

1. Copy `data/OCTS_2026.js` to a new file such as `data/NEW_EVENT_2026.js`.
2. Change its event ID and replace the data with verified information.
3. Register the new event in `event_data.js` with a relative `dataFile` path.
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
