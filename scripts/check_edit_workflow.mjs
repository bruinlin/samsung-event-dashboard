import fs from "node:fs";
import vm from "node:vm";

const root = new URL("..", import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), "utf8");
const fail = (message) => { throw new Error(message); };

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
vm.runInContext(read("assets/collaboration.js"), context, { filename: "assets/collaboration.js" });

const { progressForSave } = context.window.DashboardCollab.__test;
for (const [status, input, expected] of [
  ["Planning", "70", 0],
  ["Completed", "20", 100],
  ["In Progress", "60", 60],
  ["Under Review", "35", 35],
  ["Blocked", "0", 0]
]) {
  if (progressForSave(status, input) !== expected) fail(`${status} progress invariant failed.`);
}
let rejected = false;
try { progressForSave("In Progress", "not-a-number"); } catch { rejected = true; }
if (!rejected) fail("Editable progress accepts an invalid value.");

const collaboration = read("assets/collaboration.js");
for (const required of ["resetEditDialog", "hydrateEditDialog", "await state.hooks.reloadCurrentEvent", "state.hooks.resolveEditContext?.(identity)", "state.editContext = null"]) {
  if (!collaboration.includes(required)) fail(`Stale-edit safeguard missing: ${required}`);
}
const app = read("assets/app.js");
for (const required of ["function resolveEditContext(identity)", "workstreamId: stageEditButton.dataset.workstreamId", "workstreamId: workstreamEditButton.dataset.editWorkstream", "if (status === \"Completed\") return 100;"]) {
  if (!app.includes(required)) fail(`Current-entity resolver or derived progress safeguard missing: ${required}`);
}

console.log("Edit workflow checks passed: progress invariants, identity refresh path and stale-field reset markers.");
