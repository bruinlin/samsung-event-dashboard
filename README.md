# Samsung Semiconductor Event Dashboard

Repository: `samsung-event-dashboard`

Framework-free Event Dashboard for Samsung Semiconductor Marcom. The event selector currently includes OCTS 2026, ODX 2026 and ICCAD 2026. Public viewing continues to use local JavaScript data with no server, package installation, CDN, or online font. An optional Supabase collaboration layer adds administrator-created email-and-password member login, field-level updates, Realtime refresh and private downloads; when it is unavailable, the Dashboard remains local and read-only.

## Run locally

From the repository root:

```powershell
node scripts/local-auth-server.mjs
```

Open `http://localhost:3000/` for Supabase Auth testing. Directly opening `index.html` also works for offline public viewing, but `file://` cannot receive a Supabase email-link callback.

When the URL has no event hash, the Dashboard opens the nearest upcoming event that is not `Completed`; if none remain, it opens the newest completed event. A valid event hash such as `#OCTS_2026`, `#ODX_2026` or `#ICCAD_2026` always takes priority. For deadline-enabled events, the Calendar initially opens the month containing the nearest uncompleted task or stage DDL; it falls back to the event month, then the current month.

Project Calendar opens in `2 Weeks` view for every screen size. It shows the current 14-day period in two week groups and lists the next five filtered, unfinished items under Later Deadlines. Use Previous, Today, and Next to move by 14 days; select `Month` for the full month grid. Calendar filters are collapsed by default and continue to apply to both views.

Documents & Deliverables sits directly below Attention Needed in the side column. File names and status remain public. Download actions require an authenticated Viewer, Editor or Admin and obtain a short-lived private Storage URL; Guest users are prompted to sign in. The four legacy OCTS repository files remain directly public until private migration is tested and their later removal is explicitly approved.

## Access and collaboration

- Public viewer (anonymous or signed in without an approved assignment): full public Dashboard baseline, public status overlays and repository-hosted approved PDFs; no editing.
- Viewer: the same public access plus authorized Realtime refresh for assigned events; no editing.
- Editor: Viewer access plus Status, Task Final DDL, Stage DDL and Owner editing for assigned events.
- Admin: Editor access across all registered events.

The static activity files remain the reviewed public baseline. Supabase stores only field-level overrides, their version, updater and update time. `002_public_dashboard_overlay_v1.sql` exposes those display fields through one anonymous read-only RPC; it returns no email, UUID, membership, credential or Storage-object data. A null/unset database field never replaces the static value. Workstream and Stage updates are saved separately; tasks with Stages continue to calculate parent Status and Progress in the browser.

The tracked production `config.js` contains only the Supabase Project URL and browser-safe Publishable Key, so GitHub Pages can load the public Overlay without a build step. Never add a `service_role` key, Secret Key, database password, access token or refresh token to it. Member sign-in uses the Supabase password grant; the legacy Magic Link code remains inactive for a future SMTP-enabled rollout. Run `supabase/migrations/001_collaboration_v1.sql`, then `supabase/migrations/002_public_dashboard_overlay_v1.sql`; run `supabase/seed_dashboard.sql` only when the database has not already been seeded. Follow `supabase/README.md` for member management, Storage and deployment setup.

### Local member management

Create `.env.admin.local` from `.env.admin.example` and keep its Supabase service-role value on the local machine only. It is ignored by Git. Use the local interactive script; it never prints passwords or the key:

```powershell
node scripts/manage-auth-users.mjs create
node scripts/manage-auth-users.mjs reset-password
node scripts/manage-auth-users.mjs set-approval
node scripts/manage-auth-users.mjs assign-role
```

`create` confirms the email in Auth, creates the trigger-backed Profile, optionally approves it, and can assign one Viewer or Editor event role. The script does not create Admins; set an Admin only through the controlled Supabase administrative process. A logged-in user can change only their own password from the Dashboard header. There is no self-registration or public password-reset entry.

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

1. Confirm that the source is an approved Final file and is suitable for public release.
2. Inspect the file content, properties, comments/notes, contacts, amounts, local paths, private links, and embedded content before upload.
3. For an approved public PDF, put the reviewed copy in `downloads/` and use its repository-relative `filePath` in `finalDocuments`. Do not put a private Storage path there.
4. For a status-only record, set `downloadable: false`. Keep private or unapproved source documents out of this repository.
5. Run `scripts/check_download_safety.ps1` whenever a public PDF changes. Removing the latest copy does not remove it from Git history.

The safety script uses Python with `pypdf` to inspect PDF text, metadata, annotations and embedded content, and fails closed when reliable inspection is unavailable. If Python is not on `PATH`, pass its executable with `-PythonPath`. Non-PDF formats are reported as requiring manual review before publication. Historical and working versions belong in the internal archive, not the public download directory.

GitHub Pages remains the Dashboard deployment target. Public downloads use repository-relative `downloads/` paths. The private `event-files` bucket remains available for a future controlled-file workflow, but it is not used by the public download buttons. Do not compress, split, or alter an Approved Final merely to meet a hosting limit.

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

The collaboration code and SQL are included, but the live project remains inactive until `config.js` and database migrations are configured. Local JavaScript data is always the public baseline. The public Overlay RPC makes only Status, DDL, Owner, Completed Date, Updated At, Updated By, version and corresponding `*_set` flags readable to anonymous and authenticated viewers; editing still requires an approved event Editor or approved Admin. The browser may contain only the Supabase Project URL and Publishable Key. Never expose a `service_role` key, access token, refresh token, password, private contract, quotation amount, or confidential source material in front-end code or Git history.

## Roll back

Use Git history to identify the last stable commit, then revert it with a new commit. Do not force-push or rewrite shared `main` history. A pre-deployment local backup is also retained outside Git in `_backup_before_web_deploy`.
