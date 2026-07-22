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
- Keep the data structure consistent with the existing event file. Use only the supported status values documented at the top of the data file.
- Update `meta.lastUpdated`, `meta.updatedBy`, and `CHANGELOG.md` with every meaningful revision.
- Do not put contract values, quotation values, credentials, personal data, or non-public source documents in the repository.

## Add another event

1. Copy `data/OCTS_2026.js` to a new file such as `data/NEW_EVENT_2026.js`.
2. Change its event ID and replace the data with verified information.
3. Register the new event in `event_data.js` with a relative `dataFile` path.
4. Open the dashboard, switch events, test all filters, and update `CHANGELOG.md`.

## Publish updates to GitHub

```powershell
git add index.html event_data.js assets data README.md CHANGELOG.md VERSION_INDEX.md .gitignore
git commit -m "Update event dashboard"
git push origin main
```

Review `git status` before committing. The backup folder and legacy Supabase helper files are intentionally ignored.

## Cloudflare Pages settings

Create a Pages project using **Connect to Git** and use these exact settings:

- Repository: `bruinlin/samsung-event-dashboard`
- Production branch: `main`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `.`
- Root directory: leave blank

This project does not use Workers or Wrangler. Do not add `wrangler.toml` or `wrangler.jsonc` for this deployment.

## Supabase status and security

Supabase is not enabled in this release. Local JavaScript data remains the runtime fallback. If Supabase is introduced later, use only a public anonymous key with Row Level Security and keep the local files as a fallback. Never expose a `service_role` key, access token, password, private contract, quotation amount, or confidential source material in front-end code or Git history.

## Roll back

Use Git history to identify the last stable commit, then revert it with a new commit. Do not force-push or rewrite shared `main` history. A pre-deployment local backup is also retained outside Git in `_backup_before_web_deploy`.
