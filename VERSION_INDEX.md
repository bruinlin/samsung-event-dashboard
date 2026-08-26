# Version Index

| Version | Date | Primary Deliverable | Lifecycle Status | Purpose |
|---|---|---|---|---|
| 1.8.8-web | 2026-08-26 | `data/ODX_2026.js` + `assets/app.js` | Working | Refreshes the confirmed ODX technical program, shared On-site Forum session, physical/technology showcase, recorded system demos, PR/KOL information and compatible Overview/Session rendering. |
| 1.7.0-web | 2026-08-01 | `004_progress_and_private_documents.sql` + collaboration assets | Working | Adds controlled Workstream Progress overlays, multi-event local role assignment, and private authorized document delivery. |
| 1.6.7-web | 2026-07-30 | `index.html` + `event_data.js` | Working | Refreshes event-data cache keys for the canonical-status GitHub Pages rollout. |
| 1.6.6-web | 2026-07-30 | `supabase/migrations/003_collaboration_v1_6_status_and_notes.sql` + collaboration assets | Working | Standardizes the five-status model and adds audited Workstream Latest Update / Next Action overlays. |
| 1.6.5-web | 2026-07-30 | `assets/collaboration.js` + `scripts/manage-auth-users.mjs` | Working | Uses administrator-created email-and-password member sign-in, self-service session-based password changes, and Git-ignored local user management. |
| 1.6.4-web | 2026-07-30 | `assets/collaboration.js` | Working | Uses a fixed production or localhost Auth redirect URL in the Supabase OTP request query string. |
| 1.6.3-web | 2026-07-30 | `assets/app.js` | Working | Hides editing controls from public and read-only users while retaining database-enforced Editor/Admin authorization. |
| 1.6.2-web | 2026-07-30 | `supabase/migrations/002_public_dashboard_overlay_v1.sql` + collaboration assets | Working | Restores public Dashboard Overlay reads and public approved-PDF downloads while retaining approved Editor/Admin-only writes. |
| 1.6.1-web | 2026-07-30 | `assets/collaboration.js` + `scripts/local-auth-server.mjs` | Working | Adds safe local HTTP Auth callback testing and Magic Link session restoration without changing production deployment. |
| 1.6.0-web | 2026-07-29 | `index.html` + `assets/` + `supabase/` | Working | Adds optional approved-member login, field-level collaborative editing, RLS, authorized Realtime refresh and private-download preparation while retaining public static fallback. |
| 1.5.2-web | 2026-07-29 | `index.html` + `assets/` + `data/ODX_2026.js` + `data/ICCAD_2026.js` | Working | Moves ODX and ICCAD Participation into the Hero metadata and condenses the shared presentation Overview card. |
| 1.5.1-web | 2026-07-29 | `index.html` + `assets/` + `data/ICCAD_2026.js` | Working | Corrects ICCAD to the shared ODX/OCTS page structure, restores Calendar and DDL support, and adds optional official-website Hero links. |
| 1.5.0-web | 2026-07-29 | `index.html` + `assets/` + `event_data.js` + `data/ICCAD_2026.js` | Working | Adds the independent ICCAD 2026 dashboard, ICCAD-only no-DDL process mode, and responsive module cards pending user review. |
| 1.1.2-web | 2026-07-22 | `index.html` + `data/OCTS_2026.js` + `downloads/OCTS_2026/reports/` | Working | Merges file areas and retains reviewed downloads plus the user-approved Final Report PDF. |
| 1.1.1-web | 2026-07-22 | `index.html` + `downloads/OCTS_2026/` | Working | Final three-file GitHub Pages download release for OCTS 2026. |
| 1.1.0-web | 2026-07-22 | `index.html` + `downloads/OCTS_2026/` | Working | Adds reviewed OCTS 2026 Final Deliverables and public download paths. |
| 1.0.0-web | 2026-07-22 | `index.html` | Working | Static deployment candidate for GitHub and Cloudflare Pages. |

`Working` does not mean Approved Final. The local source dashboard remains unchanged in `00_SYSTEM/Event_Dashboard`.
