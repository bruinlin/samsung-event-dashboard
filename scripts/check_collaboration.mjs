import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), "utf8");
const fail = (message) => { throw new Error(message); };

for (const file of ["assets/app.js", "assets/collaboration.js", "event_data.js", "data/OCTS_2026.js", "data/ODX_2026.js", "data/ICCAD_2026.js"]) {
  new vm.Script(read(file), { filename: file });
}

const context = {
  window: { DASHBOARD_CONFIG: {} },
  document: { getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  console,
  structuredClone,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval
};
vm.createContext(context);
vm.runInContext(read("assets/collaboration.js"), context);
const apply = context.window.DashboardCollab.__test.applyPublicUpdates;
const base = {
  event: { eventId: "TEST" },
  workstreams: [{
    workstreamId: "W1", status: "Planning", dueDate: "2026-08-01", owner: "A", latestUpdate: "Baseline update", nextAction: "Baseline action",
    stages: [{ id: "S1", status: "Planning", dueDate: "", completedDate: "" }]
  }]
};
const unchanged = apply(base, {
  workstreams: [{ workstream_id: "W1", status: null, due_date: null, owner: null, latest_update: null, next_action: null, status_set: false, due_date_set: false, owner_set: false, latest_update_set: false, next_action_set: false, version: 1 }]
});
if (unchanged.workstreams[0].dueDate !== "2026-08-01") fail("Null overlay replaced static DDL.");
const updated = apply(base, {
  workstreams: [{ workstream_id: "W1", status: "In Progress", due_date: null, owner: "B", latest_update: "Line one\nLine two", next_action: "", status_set: true, due_date_set: true, owner_set: true, latest_update_set: true, next_action_set: true, version: 2 }],
  stages: [{ workstream_id: "W1", stage_id: "S1", status: "Completed", due_date: "2026-08-03", owner: "B", completed_date: "2026-08-02", status_set: true, due_date_set: true, owner_set: true, completed_date_set: true, version: 2 }]
});
if (updated.workstreams[0].status !== "In Progress" || updated.workstreams[0].dueDate !== "" || updated.workstreams[0].owner !== "B") fail("Workstream overlay merge failed.");
if (updated.workstreams[0].latestUpdate !== "Line one\nLine two" || updated.workstreams[0].nextAction !== "") fail("Workstream note overlay merge failed.");
if (updated.workstreams[0].stages[0].status !== "Completed" || updated.workstreams[0].stages[0].completedDate !== "2026-08-02") fail("Stage overlay merge failed.");

const app = read("assets/app.js");
if (!app.includes('window.addEventListener("hashchange"')) fail("Hash navigation listener is missing.");
if (/href="\$\{escapeHtml\(href\)\}"/.test(app)) fail("Legacy direct document href is still rendered.");
const migration = read("supabase/migrations/001_collaboration_v1.sql");
for (const required of ["enable row level security", "COLLAB_CONFLICT", "change_history", "event_file_member_download", "get_dashboard_updates", "is_approved"]) {
  if (!migration.toLowerCase().includes(required.toLowerCase())) fail(`Migration is missing ${required}.`);
}
for (const forbidden of [
  "grant execute on function public.get_dashboard_updates(text) to anon",
  "grant select on public.dashboard_events to anon",
  "dashboard_private.can_download(event_id, auth.uid())"
]) {
  if (migration.toLowerCase().includes(forbidden.toLowerCase())) fail(`Migration retains forbidden anonymous or private-helper access: ${forbidden}`);
}
const publicOverlayMigration = read("supabase/migrations/002_public_dashboard_overlay_v1.sql");
for (const required of ["get_public_dashboard_updates", "grant execute on function public.get_public_dashboard_updates(text) to anon, authenticated", "updated_by_name", "completed_date_set"]) {
  if (!publicOverlayMigration.toLowerCase().includes(required.toLowerCase())) fail(`Public Overlay migration is missing ${required}.`);
}
for (const forbidden of ["email", "user_id", "event_members", "object_path"]) {
  if (publicOverlayMigration.toLowerCase().includes(`'${forbidden}'`)) fail(`Public Overlay returns a forbidden field: ${forbidden}.`);
}
const v16Migration = read("supabase/migrations/003_collaboration_v1_6_status_and_notes.sql");
for (const required of ["latest_update", "next_action", "latest_update_set", "next_action_set", "Under Review", "update_stage_overlay", "COLLAB_CONFLICT", "grant execute on function public.get_public_dashboard_updates(text) to anon, authenticated"]) {
  if (!v16Migration.toLowerCase().includes(required.toLowerCase())) fail(`V1.6.6 migration is missing ${required}.`);
}
for (const forbidden of ["grant execute on function public.update_workstream_overlay(text,text,bigint,text,date,text,text,text,boolean,boolean,boolean,boolean,boolean) to anon", "not applicable' then"]) {
  if (v16Migration.toLowerCase().includes(forbidden.toLowerCase())) fail(`V1.6.6 migration has an unsafe grant or silent Not Applicable conversion: ${forbidden}.`);
}
const configExample = read("config.example.js");
if (/service_role\s*[:=]\s*["'][^"']+/i.test(configExample)) fail("Example config contains a service role value.");
const collaboration = read("assets/collaboration.js");
for (const required of ["redirect_to=${encodeURIComponent(redirectTo)}", "PRODUCTION_REDIRECT_URL", "LOCAL_REDIRECT_URL", "authRedirectUrl", "consumeAuthCallback", "AUTH_RETURN_EVENT_KEY"]) {
  if (!collaboration.includes(required)) fail(`Collaboration Auth redirect support is missing ${required}.`);
}
if (collaboration.includes("email_redirect_to")) fail("OTP redirect target must be sent as a URL query parameter, not in the JSON body.");
for (const required of ["signInWithPassword", "grant_type=password", "auth-password-form", "change-password-button", "/auth/v1/user"]) {
  if (!collaboration.includes(required)) fail(`Password sign-in or self-service password update is missing ${required}.`);
}
for (const required of ["edit-latest-update", "edit-next-action", "p_latest_update", "p_next_action"]) {
  if (!collaboration.includes(required)) fail(`Editable Workstream note support is missing ${required}.`);
}
const html = read("index.html");
for (const required of ["auth-password-form", "auth-magic-link-legacy", "change-password-button", "password-form", "edit-latest-update", "edit-next-action"]) {
  if (!html.includes(required)) fail(`Password sign-in UI is missing ${required}.`);
}
const userManager = read("scripts/manage-auth-users.mjs");
for (const required of ["SUPABASE_SERVICE_ROLE_KEY", "email_confirm: true", "set-approval", "assign-role", "promptHidden"]) {
  if (!userManager.includes(required)) fail(`Local member-management script is missing ${required}.`);
}
if (/console\.log\(\s*(password|serviceKey|localConfig)/i.test(userManager)) fail("Local member-management script may log sensitive values.");
const config = read("config.js");
if (/service_role|sb_secret|SUPABASE_SERVICE_ROLE_KEY|database_password/i.test(config)) fail("Browser config contains a secret or service role value.");
if (!collaboration.includes('rpc("get_public_dashboard_updates"')) fail("Anonymous public Overlay read is not wired into the client.");
if (!app.includes('href="${escapeHtml(item.filePath)}" download')) fail("Public PDF download action is not wired into the client.");
if (!app.includes("canEditCurrentEvent") || !/renderWorkstreams\(\);\s+renderFinalDocuments/.test(app)) fail("Edit controls are not gated and refreshed by the current event role.");

const canonicalStatuses = new Set(["Planning", "In Progress", "Under Review", "Completed", "Blocked"]);
for (const file of ["data/OCTS_2026.js", "data/ODX_2026.js", "data/ICCAD_2026.js"]) {
  const dataContext = { window: {} };
  vm.createContext(dataContext);
  vm.runInContext(read(file), dataContext, { filename: file });
  const dataset = Object.values(dataContext.window.EVENT_DATASETS || {})[0];
  for (const entry of [...(dataset?.workstreams || []), ...(dataset?.milestones || []), ...(dataset?.sessions || [])]) {
    if (entry.status && !canonicalStatuses.has(entry.status)) fail(`${file} retains unsupported status ${entry.status}.`);
  }
  for (const workstream of dataset?.workstreams || []) {
    for (const stage of workstream.stages || []) {
      if (stage.status && !canonicalStatuses.has(stage.status)) fail(`${file} retains unsupported Stage status ${stage.status}.`);
    }
  }
}

console.log("Collaboration checks passed: syntax, canonical statuses, safe public Overlay merge, Auth redirect markers, editable notes, public PDF download UI, RLS markers, and config safety.");
