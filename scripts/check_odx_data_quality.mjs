import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "data", "ODX_2026.js");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(dataPath, "utf8"), context, { filename: dataPath });

const data = context.window.EVENT_DATASETS?.ODX_2026;
const failures = [];
const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
const assert = (condition, message) => { if (!condition) failures.push(message); };
const expectedExistingFingerprint = "25ba65edc9c7a2701e75bff0ece3bb7e20ea2a7141398cf2bd68e279b1aa2d60";
const expectedProcesses = [
  ["ODX26-WS-10", "Gifts", "Planning", 0, "TBD", "2026-08-06"],
  ["ODX26-WS-11", "Product Information & Assets", "Planning", 0, "TBD", "2026-08-14"],
  ["ODX26-WS-12", "Event Agenda & Personnel Details", "Planning", 0, "TBD", "2026-08-25"],
  ["ODX26-WS-13", "Post-event Report", "Planning", 0, "TBD", "2026-09-03"]
];

assert(Boolean(data), "ODX_2026 dataset was not registered.");
assert(!Object.prototype.hasOwnProperty.call(data || {}, "milestones"), "ODX must not define a milestones data property.");
const event = data?.event || {};
assert(validDate(event.dateStart) && validDate(event.dateEnd) && event.dateEnd >= event.dateStart, "Event date range is invalid.");

const workstreams = data?.workstreams || [];
assert(workstreams.length === 13, `Expected 13 workstreams, found ${workstreams.length}.`);
const ids = workstreams.map((item) => item.workstreamId);
assert(new Set(ids).size === ids.length, "Duplicate workstream ID found.");
const existingFingerprint = crypto.createHash("sha256").update(JSON.stringify(workstreams.slice(0, 9))).digest("hex");
assert(existingFingerprint === expectedExistingFingerprint, "ODX26-WS-01 through ODX26-WS-09 changed unexpectedly.");

let stageCount = 0;
for (const item of workstreams) {
  assert(!item.dueDate || validDate(item.dueDate), `${item.workstreamId}: invalid Task Final DDL.`);
  assert(!(item.status === "Planning" && Number(item.progress) !== 0), `${item.workstreamId}: Planning must have 0 progress.`);
  const stages = Array.isArray(item.stages) ? item.stages : [];
  stageCount += stages.length;
  assert(!stages.length || stages.some((stage) => stage.id === item.currentStageId), `${item.workstreamId}: currentStageId is invalid.`);
  assert(new Set(stages.map((stage) => stage.id)).size === stages.length, `${item.workstreamId}: duplicate stage ID found.`);
  let previousDate = "";
  let latestDate = "";
  for (const stage of stages) {
    assert(!stage.dueDate || validDate(stage.dueDate), `${item.workstreamId}/${stage.id}: invalid Stage DDL.`);
    if (validDate(stage.dueDate)) {
      assert(!previousDate || stage.dueDate >= previousDate, `${item.workstreamId}: Stage DDL sequence is out of order.`);
      previousDate = stage.dueDate;
      latestDate = stage.dueDate;
    }
  }
  assert(!(validDate(item.dueDate) && latestDate && item.dueDate < latestDate), `${item.workstreamId}: Task Final DDL precedes its last Stage DDL.`);
}
assert(stageCount === 8, `Expected 8 stages, found ${stageCount}.`);

for (const [id, nameEN, status, progress, owner, dueDate] of expectedProcesses) {
  const item = workstreams.find((entry) => entry.workstreamId === id);
  assert(Boolean(item), `${id}: missing.`);
  if (!item) continue;
  assert(item.nameEN === nameEN, `${id}: incorrect English name.`);
  assert(item.status === status && Number(item.progress) === progress, `${id}: must be Planning at 0%.`);
  assert(item.owner === owner, `${id}: owner must remain TBD.`);
  assert(item.dueDate === dueDate, `${id}: incorrect Task Final DDL.`);
}

const report = workstreams.find((item) => item.workstreamId === "ODX26-WS-13");
assert(report?.currentStageId === "report-draft", "ODX26-WS-13: current stage must be report-draft.");
assert(report?.stages?.length === 2, "ODX26-WS-13: expected two report stages.");
assert(report?.stages?.[0]?.id === "report-draft" && report?.stages?.[0]?.status === "Planning" && report?.stages?.[0]?.dueDate === "2026-08-31", "ODX26-WS-13: Report Draft is incorrect.");
assert(report?.stages?.[1]?.id === "final-report" && report?.stages?.[1]?.status === "Planning" && report?.stages?.[1]?.dueDate === "2026-09-03", "ODX26-WS-13: Final Report is incorrect.");

if (failures.length) {
  console.error(`ODX data quality failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("ODX data quality passed: 13 workstreams, 8 stages, Process-Only model.");
