# Samsung Semiconductor Event Dashboard

Repository: `samsung-event-dashboard`

Framework-free Event Dashboard for Samsung Semiconductor Marcom. The event selector currently includes OCTS 2026, ODX 2026 and ICCAD 2026. Public viewing continues to use local JavaScript data with no server, package installation, CDN, or online font. An optional Supabase collaboration layer adds invited-member login, field-level updates, Realtime refresh and private downloads; when it is unavailable, the Dashboard remains local and read-only.

## Run locally

From the repository root:

```powershell
python -m http.server 8080
```

Open `http://localhost:8080/`. Directly opening `index.html` also works because event data is provided by JavaScript files rather than fetched JSON.

When the URL has no event hash, the Dashboard opens the nearest upcoming event that is not `Completed`; if none remain, it opens the newest completed event. A valid event hash such as `#OCTS_2026`, `#ODX_2026` or `#ICCAD_2026` always takes priority. For deadline-enabled events, the Calendar initially opens the month containing the nearest uncompleted task or stage DDL; it falls back to the event month, then the current month.

Project Calendar opens in `2 Weeks` view for every screen size. It shows the current 14-day period in two week groups and lists the next five filtered, unfinished items under Later Deadlines. Use Previous, Today, and Next to move by 14 days; select `Month` for the full month grid. Calendar filters are collapsed by default and continue to apply to both views.

Documents & Deliverables sits directly below Attention Needed in the side column. File names and status remain public. Download actions require an authenticated Viewer, Editor or Admin and obtain a short-lived private Storage URL; Guest users are prompted to sign in. The four legacy OCTS repository files remain directly public until private migration is tested and their later removal is explicitly approved.

## Access and collaboration

- Guest: public Dashboard, filters, Calendar, Attention Needed and print; no editing or controlled downloads.
- Viewer: Guest access plus controlled downloads for assigned events.
- Editor: Viewer access plus Status, Task Final DDL, Stage DDL and Owner editing for assigned events.
- Admin: Editor access across all registered events.

The static activity files remain the reviewed public baseline. Supabase stores only field-level overrides, their version, updater and update time. A null/unset database field never replaces the static value. Workstream and Stage updates are saved separately; tasks with Stages continue to calculate parent Status and Progress in the browser.

Copy `config.example.js` to ignored `config.js` to enable collaboration. Run `supabase/migrations/001_collaboration_v1.sql` and `supabase/seed_dashboard.sql`, then follow `supabase/README.md` for OTP, membership, Storage and deployment setup. Never use a `service_role` key in browser code.

## Update event data

- `event_data.js` is the root event registry. Add each new event here and point `dataFile` to its local data file.
- `data/OCTS_2026.js` contains the OCTS 2026 event details, workstreams, milestones, sessions, result metrics, and document references.
- `data/ODX_2026.js` contains the independent ODX 2026 record. Update this file for ODX progress; do not copy or overwrite OCTS workstreams.
- `data/ICCAD_2026.js` contains the independent ICCAD 2026 event. It uses the same Calendar, workstream, session, Attention Needed and final-document schema as ODX and OCTS; leave unconfirmed task and stage DDLs as empty strings and do not invent dates.
- Hero displays optional `event.themeCN` and `event.themeEN` below the event name. When `event.dateEnd` differs from `dateStart`, Hero displays the confirmed event date range. Event Overview groups sponsorship and participation fields, `keynote` details, and Booth/product fields; add optional `keynote.date` only when the specific presentation date is confirmed. Keep unconfirmed values as `TBD` or empty; do not add an English theme unless it is confirmed.
- `data/OCTS_2026.js` also contains `finalDocuments`, which controls the unified Documents & Deliverables list, file metadata, category filters, download links, and status-only records.
- Keep the data structure consistent with the existing event file. Use only the supported status values documented at the top of the data file.
- Each workstream belongs to one of three categories: `business-commercial`, `event-operations-content`, or `social-pr-reporting`. Add `categoryId`, `categoryNameCN`, and `categoryNameEN` to every new workstream.
- Use `stages` and `currentStageId` only for tasks that have meaningful multi-step tracking. Stage status values are `Not Started`, `In Progress`, `Pending Review`, `Completed`, and `Blocked`; the dashboard calculates task status and progress from completed stages. Simple tasks keep their existing `status` and `progress` fields.
- `workstreams[].dueDate` is the task Final DDL. Each `stages[]` entry may have its own `dueDate` for the planned stage DDL; `completedDate` is only the actual completion date. Leave an unconfirmed DDL as an empty string so the dashboard can show `Missing DDL` rather than an invented date.
- Update `meta.lastUpdated`, `meta.updatedBy`, and `CHANGELOG.md` with every meaningful revision.
- Do not put contract values, quotation values, credentials, personal data, or non-public source documents in the repository.

## Update task stages and DDL

The static baseline is maintained in `data/<EVENT_ID>.js`. With Supabase configured, an authorized Editor or Admin can also update the supported collaborative fields from the browser; those changes are stored as overlays and do not rewrite the static event file.

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

1. Confirm that the source is an approved Final file and is suitable for the intended member audience.
2. Inspect the file content, properties, comments/notes, contacts, amounts, local paths, private links, and embedded content before upload.
3. Upload a controlled file to the private `event-files` bucket; do not add a new protected file to the public `downloads/` tree.
4. Add or update its public status record in `data/<EVENT_ID>.js` under `finalDocuments`, using a stable `id`. Register the bucket/object mapping in `document_files`; do not place the private URL or object path in the public data file. For a status-only document, set `downloadable: false`.
5. Treat the existing OCTS repository copies as a separate legacy-public migration. Run `scripts/check_download_safety.ps1` whenever one of those public copies changes.
6. Test Guest denial, Viewer download and signed-URL expiry before requesting approval to remove a legacy public copy. Removing the latest copy does not remove it from Git history.

The safety script uses Python with `pypdf` to inspect PDF text, metadata, annotations and embedded content, and fails closed when reliable inspection is unavailable. If Python is not on `PATH`, pass its executable with `-PythonPath`. Non-PDF formats are reported as requiring manual review before publication. Historical and working versions belong in the internal archive, not the public download directory.

GitHub Pages remains the Dashboard deployment target. Controlled downloads come from Supabase Private Storage, not GitHub Pages or Cloudflare. The existing repository PDFs are legacy-public files only; do not compress, split, or alter an Approved Final merely to meet a hosting limit.

## Add another event

1. Copy the event data file that is closest to the new event. Use `data/ODX_2026.js` as the minimal upcoming-event pattern; do not copy completed historical workstreams from OCTS unless they are actually needed.
2. Change its event ID and replace the data with verified information.
3. Register the new event in `event_data.js` with a relative `dataFile` path, `dateStart`, and `overallStatus` so default activity selection can work without relying on list order.
4. Open the dashboard, switch events, test all filters, and update `CHANGELOG.md`.

## Publish updates to GitHub

```powershell
git add index.html event_data.js assets data downloads scripts supabase config.example.js README.md CHANGELOG.md VERSION_INDEX.md .gitignore
git commit -m "Update event dashboard"
git push origin main
```

Review `git status` before committing. The backup folder and legacy Supabase helper files are intentionally ignored.

## Deployment

The `main` branch is currently published through GitHub Pages and the existing Cloudflare Workers deployment. Final files use the same repository-relative paths on both hosts. Do not add Worker download logic or change the current Cloudflare deployment method merely to force downloads; PDF preview behavior is browser-dependent and expected.

## Supabase status and security

The collaboration code and SQL are included, but the live project remains inactive until `config.js`, database migrations, invited users and private Storage objects are configured. Local JavaScript data is always the public fallback. The browser may contain only the Supabase Project URL and Publishable Key; Row Level Security and database functions enforce authorization. Never expose a `service_role` key, access token, refresh token, password, private contract, quotation amount, or confidential source material in front-end code or Git history.

## Roll back

Use Git history to identify the last stable commit, then revert it with a new commit. Do not force-push or rewrite shared `main` history. A pre-deployment local backup is also retained outside Git in `_backup_before_web_deploy`.
