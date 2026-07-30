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
const configExample = read("config.example.js");
if (/service_role\s*[:=]\s*["'][^"']+/i.test(configExample)) fail("Example config contains a service role value.");
const collaboration = read("assets/collaboration.js");
for (const required of ["email_redirect_to", "authRedirectUrl", "consumeAuthCallback", "AUTH_RETURN_EVENT_KEY"]) {
  if (!collaboration.includes(required)) fail(`Collaboration Auth redirect support is missing ${required}.`);
}

console.log("Collaboration checks passed: syntax, safe overlay merge, Auth redirect markers, hash sync, protected download UI, RLS markers, and config safety.");
