# Supabase Collaboration Setup

This folder enables the optional multi-user layer without replacing the static event files. Until every step below is complete, the public Dashboard continues to use local read-only data.

## 1. Create and initialize the project

1. Create a Supabase project in the intended tenant and region.
2. In SQL Editor, run `migrations/001_collaboration_v1.sql`, then `migrations/002_public_dashboard_overlay_v1.sql`.
3. Run `seed_dashboard.sql` only when the database has not already been seeded.
4. Confirm that the `event-files` bucket exists and is **Private**.
5. The production `config.js` is tracked only because it contains the Project URL and browser-safe Publishable Key. Keep its scope limited to those browser-safe values and optional non-secret client settings.

Never use a `service_role` key, database password, SMTP password, user password, personal access token, or refresh token in the repository or browser configuration.

## 2. Invite users and assign roles

Use Authentication → Users in Supabase Dashboard to invite each user. The Auth trigger creates or refreshes the matching `profiles` row.

For a Viewer or Editor, copy the invited user's UUID from Auth and run a row insert in Table Editor or SQL Editor:

```sql
insert into public.event_members (event_id, user_id, role)
values ('ODX_2026', '<AUTH_USER_UUID>', 'editor')
on conflict (event_id, user_id) do update set role = excluded.role;
```

Valid member roles are `viewer` and `editor`. A matching profile must also be approved before the membership becomes effective:

```sql
update public.profiles
set is_approved = true, display_name = 'Display Name', updated_at = now()
where user_id = '<AUTH_USER_UUID>';
```

To grant global Admin access:

```sql
update public.profiles
set is_approved = true, is_admin = true, display_name = 'Display Name', updated_at = now()
where user_id = '<AUTH_USER_UUID>';
```

Do not put role data in user-editable `raw_user_meta_data`. Authorization is enforced by RLS and database functions.

## 3. Configure invite-only email OTP

1. Authentication → Providers → Email: keep email enabled.
2. Do not enable anonymous access or automatic Dashboard membership.
3. Authentication → Email Templates → Magic Link: use `{{ .Token }}` in the template so the user receives an OTP code instead of relying on a magic link.
4. Authentication → URL Configuration:
   - Production Site URL: `https://bruinlin.github.io/samsung-event-dashboard/`.
   - Production Redirect URL: `https://bruinlin.github.io/samsung-event-dashboard/`.
   - Keep `http://localhost:3000/` as an additional local Redirect URL only.
   - The browser sends the exact redirect target through `POST /auth/v1/otp?redirect_to=...`; set the Magic Link email button to `<a href="{{ .ConfirmationURL }}">Sign in</a>`, never `{{ .SiteURL }}`.
5. Configure approved SMTP settings in Supabase Dashboard. SMTP credentials must remain in Supabase and must not be copied into this repository.

The client requests OTP with user creation disabled. A valid Auth user starts with `is_approved = false`. Public Dashboard data and the public Overlay are available without login; an unapproved or unassigned login remains read-only. Realtime collaboration, private document mapping and Private Storage file access remain restricted until an administrator approves the profile and assigns activity access (or approves it as an Admin).

## 4. Public files and optional controlled files

The following files are intentionally public through GitHub Pages and Git history:

- `downloads/OCTS_2026/presentations/OCTS_2026_Main_Forum_Keynote_CN_Final.pdf`
- `downloads/OCTS_2026/presentations/OCTS_2026_Main_Forum_Keynote_EN_Final.pdf`
- `downloads/OCTS_2026/presentations/OCTS_2026_Main_Forum_Speech_Script_Final.pdf`
- `downloads/OCTS_2026/reports/OCTS_2026_Post_Event_Report_Final.pdf`

If a later use case needs a separate controlled copy, upload it to the private `event-files` bucket using the object keys seeded in `document_files`:

- `OCTS_2026/OCTS-DOC-001.pdf`
- `OCTS_2026/OCTS-DOC-002.pdf`
- `OCTS_2026/OCTS-DOC-003.pdf`
- `OCTS_2026/OCTS-DOC-004.pdf`

Do not replace a public Dashboard download with a controlled copy unless the publication model changes and is explicitly approved. Removing a public file from the latest commit does not remove it from existing Git history.

## 5. Deploy configuration

`config.js` is tracked so the current branch-based GitHub Pages deployment receives it without a build step. It contains only the Project URL, Publishable Key and browser-safe settings. The Publishable Key is not a server secret, but RLS must be active before it is exposed. Never deploy `service_role`, Secret Key, database password, access token or refresh token.

## 6. Acceptance checks

- Guest can open static activity data, the public collaboration Overlay and approved repository PDFs; it cannot query direct collaboration tables, member data, private document mappings or Private Storage.
- Signed-in unapproved users and approved non-members have the same read-only public Dashboard access and cannot edit.
- Viewer can receive assigned-event Realtime changes but cannot edit.
- Editor can edit only assigned events.
- Admin can edit all events.
- Stage edits recalculate parent status/progress in the existing client logic.
- A stale version produces a conflict and never silently overwrites.
- `change_history`, `updated_at`, `updated_by`, and `version` are updated.
- A second authenticated page receives Postgres Changes and refreshes the event.
- When Supabase is unavailable, the page clearly remains local and read-only.
