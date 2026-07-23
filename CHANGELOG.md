# Changelog

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
