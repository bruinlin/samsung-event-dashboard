# Supabase Collaboration Setup

This folder enables the optional multi-user layer without replacing the public static event files. Public Dashboard viewing and public Overlay reads remain available without sign-in; controlled PDFs require approved, event-authorized member access.

## 1. Database and browser configuration

1. Run `migrations/001_collaboration_v1.sql`, followed by `migrations/002_public_dashboard_overlay_v1.sql`, `migrations/003_collaboration_v1_6_status_and_notes.sql`, `migrations/004_progress_and_private_documents.sql`, `migrations/005_odx_process_only.sql`, `migrations/006_social_workflow_stages.sql`, and `migrations/007_private_document_versions_and_uploads.sql`.
2. Run `seed_dashboard.sql` only when the database is not already seeded.
3. Confirm that the `event-files` bucket remains **Private**.
4. Keep the tracked browser `config.js` limited to the Supabase Project URL, Publishable Key and other browser-safe settings.

Never put a service-role key, Secret Key, database password, SMTP password, user password, access token, or refresh token in the repository or browser configuration.

## 2. Create members and assign roles locally

Do not enable public registration. Create invited members only with the local administrator script so passwords and the service-role value never enter browser code or Git:

```powershell
Copy-Item .env.admin.example .env.admin.local
# Fill the two values in .env.admin.local locally. Do not commit this file.
node scripts/manage-auth-users.mjs create
```

The script asks for the email and temporary password in the terminal without echoing the password. It creates the user with `email_confirm = true`, updates `profiles.is_approved`, and can assign a `viewer` or `editor` role for one registered event, a comma-separated set, or dynamically resolved `all` registered events. Every ID is validated before writes. Use these commands for later maintenance:

```powershell
node scripts/manage-auth-users.mjs reset-password
node scripts/manage-auth-users.mjs set-approval
node scripts/manage-auth-users.mjs assign-role
```

The script intentionally cannot grant Admin. Retain that higher-privilege operation in the controlled Supabase administrative process. Do not put role data in user-editable `raw_user_meta_data`; authorization is enforced by RLS and database functions.

## 3. Configure invite-only email-and-password sign-in

1. In **Authentication → Providers → Email**, keep Email and password sign-in enabled.
2. Do not enable public registration, anonymous access, or automatic Dashboard membership.
3. The Dashboard sends an email-and-password sign-in request only after a user submits the member sign-in form. It has no public registration or Forgot Password entry and never sends a password by email.
4. A signed-in user may change only their own password from the Dashboard header, using their current session.
5. Keep the production Site URL and Redirect URL as `https://bruinlin.github.io/samsung-event-dashboard/`. Keep `http://localhost:3000/` only as an additional local Redirect URL for the retained, inactive Magic Link implementation.

Legacy Magic Link code and callback support remain inactive for a future SMTP-enabled rollout. Do not enable or test that UI without reviewing the email provider, rate limits and templates.

A valid Auth user starts with `is_approved = false`. Public Dashboard data and the public Overlay are available without login; an unapproved or unassigned login remains read-only. Realtime collaboration, private document mapping and Private Storage file access remain restricted until an administrator approves the profile and assigns activity access (or approves it as an Admin).

## 4. Controlled PDFs and versions

The active Dashboard does not use repository-hosted PDFs. Upload the reviewed OCTS copies to the private `event-files` bucket using `node scripts/migrate-private-documents.mjs`, which checks the mappings, nonzero object sizes, PDF MIME types and signed-link generation. It uses these stable object keys:

- `OCTS_2026/OCTS_2026_Main_Forum_Keynote_CN_Final.pdf`
- `OCTS_2026/OCTS_2026_Main_Forum_Keynote_EN_Final.pdf`
- `OCTS_2026/OCTS_2026_Main_Forum_Speech_Script_Final.pdf`
- `OCTS_2026/OCTS_2026_Post_Event_Report_Final.pdf`

Only an approved Viewer, Editor or Admin with event access can call `get_document_file`, obtain a short-lived URL and download a mapped file. Viewer can Preview and Download; Editor/Admin can also create a new private PDF version through the Dashboard. The browser first creates a pending metadata record through an authorized RPC, uploads to a generated private object path, then finalizes only after the server verifies PDF MIME type and size. Existing OCTS mappings remain compatible.

Preview is a working or review version. Final is an approved or archive version. Both remain private; neither creates a permanent public URL. New versions always receive a distinct document ID and object path, so earlier versions are not overwritten.

## 5. Deployment configuration

`config.js` is tracked so branch-based GitHub Pages receives it without a build step. It contains only the Project URL, Publishable Key and browser-safe settings. The Publishable Key is not a server secret, but RLS must be active before it is exposed. Never deploy a service-role key, Secret Key, database password, access token or refresh token.

## 6. Acceptance checks

- Guest can open static activity data and the public collaboration Overlay, but cannot query direct collaboration tables, member data, private document mappings or Private Storage.
- Wrong credentials fail sign-in without creating a session.
- Signed-in unapproved users and approved non-members have the same read-only public Dashboard access and cannot edit.
- Viewer can receive assigned-event Realtime changes but cannot edit.
- Editor can edit only assigned events.
- Admin can edit all events.
- A signed-in user can change their own password; the prior password then fails.
- Stage edits recalculate parent status only. Workstream Progress is a manually maintained whole-number field; Planning locks it to 0%, Completed locks it to 100%, and Stage completion remains reference-only.
- A stale version produces a conflict and never silently overwrites.
- `change_history`, `updated_at`, `updated_by`, and `version` are updated.
- A second authenticated page receives Postgres Changes and refreshes the event.
- When Supabase is unavailable, the page clearly remains public, local and read-only.
- Workstream and Stage status values are limited to `Planning`, `In Progress`, `Under Review`, `Completed`, and `Blocked`. Workstream overlays also support plain-text `Latest Update` and `Next Action` values (500 characters each); an explicitly saved empty value clears the static baseline for that field.
