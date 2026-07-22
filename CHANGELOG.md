# Changelog

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
