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
    workstreamId: "W1", status: "Not Started", dueDate: "2026-08-01", owner: "A",
    stages: [{ id: "S1", status: "Not Started", dueDate: "", completedDate: "" }]
  }]
};
const unchanged = apply(base, {
  workstreams: [{ workstream_id: "W1", status: null, due_date: null, owner: null, status_set: false, due_date_set: false, owner_set: false, version: 1 }]
});
if (unchanged.workstreams[0].dueDate !== "2026-08-01") fail("Null overlay replaced static DDL.");
const updated = apply(base, {
  workstreams: [{ workstream_id: "W1", status: "In Progress", due_date: null, owner: "B", status_set: true, due_date_set: true, owner_set: true, version: 2 }],
  stages: [{ workstream_id: "W1", stage_id: "S1", status: "Completed", due_date: "2026-08-03", owner: "B", completed_date: "2026-08-02", status_set: true, due_date_set: true, owner_set: true, completed_date_set: true, version: 2 }]
});
if (updated.workstreams[0].status !== "In Progress" || updated.workstreams[0].dueDate !== "" || updated.workstreams[0].owner !== "B") fail("Workstream overlay merge failed.");
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
const configExample = read("config.example.js");
if (/service_role\s*[:=]\s*["'][^"']+/i.test(configExample)) fail("Example config contains a service role value.");
const collaboration = read("assets/collaboration.js");
for (const required of ["redirect_to=${encodeURIComponent(redirectTo)}", "PRODUCTION_REDIRECT_URL", "LOCAL_REDIRECT_URL", "authRedirectUrl", "consumeAuthCallback", "AUTH_RETURN_EVENT_KEY"]) {
  if (!collaboration.includes(required)) fail(`Collaboration Auth redirect support is missing ${required}.`);
}
if (collaboration.includes("email_redirect_to")) fail("OTP redirect target must be sent as a URL query parameter, not in the JSON body.");
if (!collaboration.includes('rpc("get_public_dashboard_updates"')) fail("Anonymous public Overlay read is not wired into the client.");
if (!app.includes('href="${escapeHtml(item.filePath)}" download')) fail("Public PDF download action is not wired into the client.");
if (!app.includes("canEditCurrentEvent") || !app.includes("renderWorkstreams();\n        renderFinalDocuments")) fail("Edit controls are not gated and refreshed by the current event role.");

console.log("Collaboration checks passed: syntax, safe public Overlay merge, Auth redirect markers, public PDF download UI, RLS markers, and config safety.");
