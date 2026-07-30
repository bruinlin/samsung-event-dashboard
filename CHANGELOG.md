# Changelog

## 1.6.2-web - 2026-07-30

- Restored anonymous and authenticated read-only access to the Dashboard Overlay through the narrowly scoped `get_public_dashboard_updates` RPC. It returns only Status, DDL, Owner, Completed Date, update metadata, version and the corresponding set flags; it does not expose email, UUID, membership, credentials or Storage object paths.
- Kept direct business-table RLS, private Storage and all edit RPC authorization unchanged: only approved event Editors and approved Admins can write.
- Returned approved repository PDFs to direct public download actions. The static event files remain the public baseline if Supabase is unavailable.

## 1.6.1-web - 2026-07-30

- Added an HTTP-only Supabase email redirect target and safe Magic Link callback session restoration for local collaboration testing.
- Added the dependency-free `scripts/local-auth-server.mjs` test server on `http://localhost:3000/`; `file://` remains supported only for offline public viewing.

## 1.6.0-web - 2026-07-29

- Tightened the pending collaboration migration to require an approved profile plus activity membership (or approved Admin) before reading any collaboration overlay, Realtime change, document mapping or Private Storage file. Anonymous collaboration reads are revoked.
- Renamed the authenticated overlay RPC to `get_dashboard_updates`, revoked browser execution of all `dashboard_private` helpers, and kept private-helper authorization inside controlled SECURITY DEFINER RPCs.
- Added optional Supabase invite-only email OTP with Guest, Viewer, Editor and Admin access states while keeping public static viewing available when Supabase is missing or unavailable.
- Added field-level Workstream and Stage overlays, activity membership, RLS-enforced updates, version conflict protection, update metadata, Change History and authenticated Realtime refresh without replacing complete event JSON payloads.
- Added in-page Status, DDL and Owner editing for authorized members. Parent task Status and Progress remain derived from Stage records.
- Replaced direct document actions with authenticated Private Storage signed-URL requests and documented the four existing OCTS PDFs that remain public until migration is verified.
- Added idempotent database/seed SQL, safe configuration templates, OTP/Redirect/Storage setup instructions, hash navigation synchronization and local collaboration checks.

## 1.5.2-web - 2026-07-29

- Moved confirmed Participation information from the ODX and ICCAD Event Overview cards into their Hero metadata rows, using the same inline treatment as OCTS Hero metadata.
- Condensed the shared Booth Presentation / Main Forum Keynote card into compact presenter, schedule, status and topic rows, and rebalanced the two-card Overview layout. OCTS participation content and event facts remain unchanged.
- This is a local Working revision pending user review; no commit, push or deployment was performed.

## 1.5.1-web - 2026-07-29

- Corrected ICCAD 2026 to use the same six-section ODX/OCTS dashboard structure: Event Overview, Project Calendar, Workstream Progress, Sessions & Speakers, Attention Needed, and Documents & Deliverables.
- Replaced the ICCAD-specific overview, process table and operational module cards with the standard three-card Overview, shared Calendar and 12 practical ODX-style workstreams. Unconfirmed Final DDL and stage DDL fields are intentionally empty rather than removed.
- Configured the shared Overview renderer to allow an event-specific presentation label. ICCAD now displays Booth Presentation / 展台演讲 while ODX and OCTS retain Main Forum Keynote / 主论坛演讲.
- Added optional Hero website links for ICCAD, ODX and OCTS. No existing event facts, workstreams, dates, speakers, booth information, statuses or results were changed.
- This is a local Working revision pending user review; no commit, push or deployment was performed.

## 1.5.0-web - 2026-07-29

- Added ICCAD 2026 as an independent selectable event dataset with confirmed Sponsor + Booth participation, 56 sqm booth, booth location C009-010 / C019-020 / C029-030, Keynote marked Not Applicable, and Booth Presentation marked Under Discussion.
- Added an ICCAD project-process view with nine workstreams and 69 initial tasks using Owner, Status, Progress, Dependency, Next Action, Risk, Notes and File Link fields; all unconfirmed values remain `TBD`.
- Added ICCAD-specific overview and operational module cards for participation, booth, Booth Presentation, demos, engagement, budget/procurement, onsite operation and post-event results without changing the homepage layout.
- Disabled Project Calendar, task/stage DDLs, overdue states and deadline-derived attention only for ICCAD; existing ODX and OCTS calendar and DDL behavior remains enabled.
- Verified ICCAD desktop and mobile responsive layouts, event switching and filters, and confirmed no browser console errors. This remains a local Working version pending user review; no commit, push or deployment was performed.

## 1.4.7-web - 2026-07-29

- Updated ODX 2026 to the confirmed September 2–4 event date range and recorded the Main Forum Keynote date as September 3, while retaining its confirmed 10:30–10:45 time.
- Updated the supplied ODX task and stage DDLs and added concise date-grouped ODX timeline milestones for the specified gift, agenda, product, PR and report checkpoints.
- Hero now displays confirmed multi-day event ranges, and Event Overview displays an optional confirmed keynote date alongside its time.

## 1.4.6-web - 2026-07-26

- Moved Documents & Deliverables from the main column to directly below Attention Needed in the side column, without changing document data or download behavior.
- Condensed side-column document records into a compact list with a single file/download summary, compact category filters, metadata and full-width download actions.
- Elevated Event Overview with a restrained Samsung blue-grey panel treatment, stronger heading hierarchy and a wider Keynote group while retaining its compact three-group content model.

## 1.4.5-web - 2026-07-26

- Removed the duplicated top Metric Cards row for Event Status, Workstream Completion, Main Speaker, Location and Report Status.
- Moved the optional event theme into the Hero primary information, where it updates or hides with the selected event.
- Kept Event Overview focused on Participation, Main Forum Keynote, and Booth & Products only.

## 1.4.4-web - 2026-07-26

- Simplified Event Overview into Event Theme, Participation, Main Forum Keynote, and Booth & Products groups, removing repeated date, location, event type, detailed agenda and current summary display.
- Added the confirmed ODX Chinese event theme and Main Forum Keynote time. The ODX keynote topic remains the single existing `TBD` value until a confirmed topic is available.
- Improved responsive Overview density with a compact theme strip, three adaptive desktop groups and a single-column mobile layout.

## 1.4.3-web - 2026-07-26

- Removed the duplicate ODX 2026 Event Day milestone; the existing event date continues to generate the single Calendar Event Day entry.
- Replaced the right-column Key Milestones display with Attention Needed, derived from existing task and stage status, DDL and owner fields. It shows at most one highest-priority concern per workstream and reuses Calendar task-focus behavior.
- Documented that milestones are reserved for independent cross-task decision points and must not duplicate Event Day, task Final DDLs or stage DDLs.

## 1.4.2-web - 2026-07-26

- Made the compact Two-Week Agenda the default Calendar view on desktop and mobile, with Previous, Today and Next navigation in 14-day increments.
- Added two vertical week groups that omit empty dates, a filtered Later Deadlines list with five-item default and Show All / Show Less control, and a collapsed Calendar filter panel.
- Kept Month View as an on-demand full-month overview while reducing day-card height, limiting cards to two items and increasing compact item text size.
- Condensed Calendar reminder statistics and increased agenda item text and touch-target sizing without changing event data, DDLs, document delivery logic or task linkage.

## 1.4.1-web - 2026-07-26

- Added confirmed ODX 2026 task and stage DDLs, including completed Speaker Confirmation and the Social Communication planning-draft stage. Unconfirmed Keynote second revision, PR / Media, Onsite Operation and Social task-final DDLs remain blank.
- Changed no-hash activity selection to use registered event dates and overall status: the nearest upcoming non-completed activity opens by default, while valid activity hashes remain authoritative.
- Changed the Calendar initial month to the nearest uncompleted task or stage DDL, with event-date and current-month fallbacks.
- Refreshed the changed runtime resource version parameters to `1.4.1`.

## 1.4.0-web - 2026-07-26

- Added Project Calendar with derived Month View and Upcoming 14 Days view. Calendar entries are generated only from event dates, milestones, task Final DDLs and stage DDLs.
- Added Calendar category, owner, active/completed and item-type filters, deadline reminder statistics, daily overflow details and task/stage navigation from calendar entries.
- Standardized `workstreams[].dueDate` as Final DDL and added optional `stages[].dueDate` fields. Blank dates remain blank and display as Missing DDL; no historical or future dates were inferred.
- Expanded stage-task summaries with Current Stage, Stage Status, Stage DDL, stage progress and Final DDL. Stage trackers now show status, DDL and actual completion date separately.
- Added DDL validation for date format, stage order and task-versus-final-stage deadlines, plus visible reminders for completed stages that lack actual completion dates.

## 1.3.0-web - 2026-07-26

- Grouped Workstream Progress into Business & Commercial, Event Operations & Content, and Social, PR & Reporting, with compact per-category completion summaries and collapse controls.
- Added optional stage tracking. Tasks with `stages` now calculate their visible status and progress from the stage records; simple tasks continue to use their existing status and progress fields.
- Added five-stage Keynote tracking and selective completed-stage records for OCTS Keynote, Booth Design, Social Communication, and Post-event Report; all OCTS workstreams remain Completed at 100%.
- Restructured ODX around currently managed tasks only, normalized its invalid `Progressing` values to `In Progress`, and retained existing known progress values without adding unverified dates or milestones.
- Reworked the Workstream module for 390px screens so task entries become compact cards without horizontal page overflow. Documents & Deliverables logic and downloads are unchanged.

## 1.2.1-web - 2026-07-23

- Updated the independent ODX 2026 event record with confirmed event details, sponsorship level, participation format, Booth area and Main Forum speaker information.
- Reset all 15 ODX 2026 workstreams to Not Started at 0% while retaining the OCTS owner mapping and leaving dates, completion dates and remarks empty.
- Added conditional Event Overview fields for sponsorship, participation form, Booth area, Booth number and detailed agenda; these fields appear only when event data supplies them.

## 1.2.0-web - 2026-07-23

- Marked all 15 OCTS 2026 workstreams and all recorded milestones as Completed; Workstream Completion now evaluates to 100%.
- Added ODX 2026 to the event selector with confirmed date and theme, and marked unconfirmed event information as pending completion.
- Added conditional Event Theme / 大会主题 rendering in Event Overview without changing Keynote topic fields.

## 1.1.2-web - 2026-07-22

- Merged the former Key Documents and Final Deliverables areas into one Documents & Deliverables module.
- Streamlined the visible file list to the three reviewed downloadable Main Forum files and the user-approved Final Post-event Report PDF.
- Removed Breakout, commercial, design, operations and other non-essential document entries from the dashboard view; their project progress remains in Workstream Progress.
- Kept the review exception for the Final Post-event Report narrowly bound to its exact SHA-256 in the download safety allowlist.

## 1.1.1-web - 2026-07-22

- Added the reviewed Final Main Forum speech script alongside the Chinese and English Final Keynote PDFs.
- Confirmed GitHub Pages as the acceptance target for downloadable Final files; Cloudflare download parity is not required for files above its static-asset limit.
- Refreshed static asset version parameters so browsers load the final three-file registry.

## 1.1.0-web - 2026-07-22

- Added the OCTS 2026 Final Deliverables module with category filters and file statistics.
- Published the reviewed Chinese and English Final Main Forum Keynote PDFs and Final speech script under repository-relative download paths.
- Set GitHub Pages as the Final-file download acceptance target; 30+ MiB Keynote PDFs exceed the current Cloudflare Workers static-asset limit.
- Added download inventory, file existence, path, hash-aware content, metadata and sensitive-value safety checks.
- Added responsive Final Deliverables cards and documented the future Final-file maintenance workflow.
- Added static asset version parameters so deployed browsers refresh the updated dashboard and event data together.

## 1.0.0-web - 2026-07-22

- Prepared the existing Samsung Event Dashboard as a framework-free static website for GitHub and Cloudflare Pages.
- Preserved the existing visual design, responsive layout, workstream logic and OCTS 2026 data.
- Added the missing `assets` and `data` runtime files required by `index.html`.
- Added root-level `event_data.js` as the event registry used by the static deployment.
- Kept Supabase integration disabled; the release uses local JavaScript data only.
- Excluded local backups, legacy deployment helpers, generated SQL and secrets from Git.
- Fixed narrow-screen containment so the workstream table scrolls inside its panel instead of widening the page.
