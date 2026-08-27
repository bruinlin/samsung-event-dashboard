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

Documents & Deliverables sits directly below Attention Needed in the side column. Events with `resourceLinks` display those external cards alongside—not instead of—private PDF Documents. Safe document metadata may be visible publicly, but Preview and Download actions require an authenticated Viewer, Editor or Admin with event access and obtain a short-lived private Storage URL. No Storage object path is exposed to public viewers.

## Access and collaboration

- Public Viewer: can anonymously view the full public Dashboard and public Overlay; cannot download controlled files or edit.
- Viewer: can download controlled files for assigned events; cannot edit.
- Editor: can download and edit assigned events.
- Admin: can access and edit all registered events.

The static activity files remain the reviewed public baseline. Supabase stores only field-level overrides, their version, updater and update time. The public read-only RPC returns no email, UUID, membership, credential or Storage-object data. A null/unset database field never replaces the static value. Workstream and Stage updates are saved separately: Stage status remains derived, while Workstream Progress is manually maintained. Planning always saves as 0%, Completed always saves as 100%, and the other three statuses accept whole-number values from 0 to 100. Stage completion is displayed as a reference only.

The tracked production `config.js` contains only the Supabase Project URL and browser-safe Publishable Key, so GitHub Pages can load the public Overlay without a build step. Never add a `service_role` key, Secret Key, database password, access token or refresh token to it. Member sign-in uses the Supabase password grant; the legacy Magic Link code remains inactive for a future SMTP-enabled rollout. Run migrations `001` through `007` in order; run `supabase/seed_dashboard.sql` only when the database has not already been seeded. Follow `supabase/README.md` for member management, Storage and deployment setup.

### Local member management

Create `.env.admin.local` from `.env.admin.example` and keep its Supabase service-role value on the local machine only. It is ignored by Git. Use the local interactive script; it never prints passwords or the key:

```powershell
node scripts/manage-auth-users.mjs create
node scripts/manage-auth-users.mjs reset-password
node scripts/manage-auth-users.mjs set-approval
node scripts/manage-auth-users.mjs assign-role
```

`create` confirms the email in Auth, creates the trigger-backed Profile, optionally approves it, and can assign one Viewer or Editor role across one event ID, a comma-separated list, or `all` registered events. The script validates every requested ID before writing anything. It does not create Admins; set an Admin only through the controlled Supabase administrative process. A logged-in user can change only their own password from the Dashboard header. There is no self-registration or public password-reset entry.

## Update event data

- `event_data.js` is the root event registry. Add each new event here and point `dataFile` to its local data file.
- `data/OCTS_2026.js` contains the OCTS 2026 event details, workstreams, sessions, result metrics, and document references.
- `data/ODX_2026.js` contains the independent ODX 2026 record. Update this file for ODX progress; do not copy or overwrite OCTS workstreams.
- `data/ICCAD_2026.js` contains the independent ICCAD 2026 event. It uses the same Calendar, workstream, session, Attention Needed and final-document schema as ODX and OCTS; leave unconfirmed task and stage DDLs as empty strings and do not invent dates.
- Hero displays optional `event.themeCN` and `event.themeEN` below the event name. When `event.dateEnd` differs from `dateStart`, Hero displays the confirmed event date range. Event Overview groups sponsorship and participation fields, `keynote` details, and Booth/product fields; add optional `keynote.date` only when the specific presentation date is confirmed. Keep unconfirmed values as `TBD` or empty; do not add an English theme unless it is confirmed.
- `data/OCTS_2026.js` contains the legacy `finalDocuments` baseline. The unified Documents & Deliverables list can also show runtime Supabase Preview / Final versions; keep private object paths and signed URLs out of all `data/*.js` files.
- Keep the data structure consistent with the existing event file. Use only the supported status values documented at the top of the data file.
- Each workstream belongs to one of three categories: `business-commercial`, `event-operations-content`, or `social-pr-reporting`. Add `categoryId`, `categoryNameCN`, and `categoryNameEN` to every new workstream.
- Use `stages` and `currentStageId` only for tasks that have meaningful multi-step tracking. Workstream and Stage statuses use one five-status model: `Planning`, `In Progress`, `Under Review`, `Completed`, and `Blocked`. Do not add legacy labels such as `Not Started`, `Confirmed`, or `Pending Review`.
- `workstreams[].dueDate` is the task Final DDL. Each `stages[]` entry may have its own `dueDate` for the planned stage DDL; `completedDate` is only the actual completion date. Leave an unconfirmed DDL as an empty string so the dashboard can show `Missing DDL` rather than an invented date. `latestUpdate` and `nextAction` are plain-text fields; they may contain line breaks and should remain concise.
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

After a task has `stages`, do not manually set a conflicting task `status`: the Dashboard derives parent Status from the stage records. Workstream Progress remains a separate, manually maintained task value and Stage completion is shown as a reference.

For the Social Communication workflow, retain the stable `planning-draft` stage ID and use its three ordered stages as `Planning Draft → Content Draft → Publish`. Parent completion is derived only when every stage is completed. A past, incomplete Task or Stage DDL is displayed as `Overdue` across the Workstream, Calendar and drill-down views; it is a calculated warning, not a new persisted status. Leave unconfirmed Draft or Publish DDLs blank.

## Process-Only model

Every executable item must be a Workstream or a Stage. The Calendar is derived only from Event Day, Task Final DDL, and Stage DDL; do not create a separate calendar data array or standalone deadline records.

- Create a Workstream when an item has an owner, status, progress, or an action that needs ongoing management.
- Create a Stage when the item is a managed step within an existing Workstream.
- Use Event Day only for the confirmed event date range.
- Do not duplicate a Task Final DDL or Stage DDL as another dated item.

## Maintain Documents & Deliverables

1. Preview is a private working or review PDF; Final is a private approved/archive PDF. Neither lifecycle is uploaded to GitHub or a public Storage bucket.
2. Editors and Admins use `Upload PDF / 上传 PDF` in the Dashboard. Select a PDF, enter the document name, category, version and lifecycle; a new version receives its own private object and never silently overwrites an older version.
3. Viewer can Preview and Download assigned-event files; Editor/Admin can Preview, Download and upload. Public and unapproved viewers can see only the safe metadata and cannot obtain a signed URL.
4. Inspect any source for sensitive content, comments/notes, contacts, amounts, local paths, private links and embedded content before uploading. Keep only safe metadata in the public document list; do not add `filePath`, a Storage object path or an external private link to event data.
5. Legacy OCTS Final mappings remain managed by `document_files`; use `node scripts/migrate-private-documents.mjs` only for those fixed legacy mappings. New Preview/Final versions use the browser flow after migration `007` is applied.
6. Run `scripts/check_download_safety.ps1` after a controlled-download change. Removing the latest copy does not remove an earlier public Git history copy.

The safety script uses Python with `pypdf` to inspect PDF text, metadata, annotations and embedded content, and fails closed when reliable inspection is unavailable. If Python is not on `PATH`, pass its executable with `-PythonPath`. Non-PDF formats are reported as requiring manual review before publication. Historical and working versions belong in the internal archive, not the public download directory.

GitHub Pages remains the Dashboard deployment target. It never hosts an active downloadable PDF; the private `event-files` bucket supplies short-lived authorized links at request time. Do not compress, split, or alter an Approved Final merely to meet a hosting limit.

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

The `main` branch is published through GitHub Pages. Controlled PDFs are not served from repository-relative paths: eligible Viewer, Editor and Admin accounts receive short-lived signed links from the private `event-files` Bucket. Do not add a public static-file fallback for controlled downloads.

## Supabase status and security

Local JavaScript data is always the public baseline. The public Overlay RPC makes only Status, Progress, DDL, Owner, Completed Date, Updated At, Updated By, version and corresponding `*_set` flags readable to anonymous and authenticated viewers; editing still requires an approved event Editor or approved Admin. The browser may contain only the Supabase Project URL and Publishable Key. Never expose a `service_role` key, access token, refresh token, password, private contract, quotation amount, confidential source material, or a private Storage path in front-end code or Git history.

## Roll back

Use Git history to identify the last stable commit, then revert it with a new commit. Do not force-push or rewrite shared `main` history. A pre-deployment local backup is also retained outside Git in `_backup_before_web_deploy`.
