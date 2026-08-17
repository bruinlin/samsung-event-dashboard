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
const expectedExistingFingerprint = "5e8191d1e235bcbd47df6cbfb13e9c7cf7136dfa1702369069c6f32c4580d4f3";
const expectedProcesses = [
  ["ODX26-WS-10", "Gifts", "In Progress", 80, "TBD", "2026-08-06"],
  ["ODX26-WS-11", "Product Information & Assets", "In Progress", 20, "TBD", "2026-08-14"],
  ["ODX26-WS-12", "Event Agenda & Personnel Details", "In Progress", 50, "TBD", "2026-08-25"],
  ["ODX26-WS-13", "Post-event Report", "Planning", 0, "TBD", "2026-09-03"]
];
const expectedWorkstreamStates = [
  ["ODX26-WS-01", "In Progress", 80],
  ["ODX26-WS-02", "Completed", 100],
  ["ODX26-WS-03", "In Progress", 30],
  ["ODX26-WS-04", "In Progress", 90],
  ["ODX26-WS-05", "In Progress", 60],
  ["ODX26-WS-06", "In Progress", 60],
  ["ODX26-WS-07", "In Progress", 20],
  ["ODX26-WS-08", "Planning", 0],
  ["ODX26-WS-09", "In Progress", 40],
  ["ODX26-WS-10", "In Progress", 80],
  ["ODX26-WS-11", "In Progress", 20],
  ["ODX26-WS-12", "In Progress", 50],
  ["ODX26-WS-13", "Planning", 0]
];

assert(Boolean(data), "ODX_2026 dataset was not registered.");
assert(!Object.prototype.hasOwnProperty.call(data || {}, "milestones"), "ODX must not define a milestones data property.");
const event = data?.event || {};
assert(validDate(event.dateStart) && validDate(event.dateEnd) && event.dateEnd >= event.dateStart, "Event date range is invalid.");
assert(event.showcasedProducts === "TBD", "Showcased Products must remain TBD.");
assert(event.currentSummary === "2026 ODX 计划于 2026 年 9 月 2 日至 4 日在北京国家会议中心二期举行。三星将以钻石赞助参与主论坛、分论坛及 Booth；分论坛、展出产品、展位号和详细议程等信息待确认。", "Current Summary changed unexpectedly.");
assert(data?.keynote?.status === "In Progress", "Keynote status must be In Progress.");
assert(data?.keynote?.topicEN === "TBD" && data?.keynote?.topicCN === "TBD", "Formal Keynote topics must remain TBD.");

const workstreams = data?.workstreams || [];
assert(workstreams.length === 13, `Expected 13 workstreams, found ${workstreams.length}.`);
const ids = workstreams.map((item) => item.workstreamId);
assert(new Set(ids).size === ids.length, "Duplicate workstream ID found.");
const existingFingerprint = crypto.createHash("sha256").update(JSON.stringify(workstreams.slice(0, 9))).digest("hex");
assert(existingFingerprint === expectedExistingFingerprint, "ODX26-WS-01 through ODX26-WS-09 changed unexpectedly.");

for (const [id, status, progress] of expectedWorkstreamStates) {
  const item = workstreams.find((entry) => entry.workstreamId === id);
  assert(Boolean(item), `${id}: missing.`);
  if (item) assert(item.status === status && Number(item.progress) === progress, `${id}: status or progress is incorrect.`);
}

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
  assert(item.status === status && Number(item.progress) === progress, `${id}: status or progress is incorrect.`);
  assert(item.owner === owner, `${id}: owner must remain TBD.`);
  assert(item.dueDate === dueDate, `${id}: incorrect Task Final DDL.`);
}

const report = workstreams.find((item) => item.workstreamId === "ODX26-WS-13");
assert(report?.currentStageId === "report-draft", "ODX26-WS-13: current stage must be report-draft.");
assert(report?.stages?.length === 2, "ODX26-WS-13: expected two report stages.");
assert(report?.stages?.[0]?.id === "report-draft" && report?.stages?.[0]?.status === "Planning" && report?.stages?.[0]?.dueDate === "2026-08-31", "ODX26-WS-13: Report Draft is incorrect.");
assert(report?.stages?.[1]?.id === "final-report" && report?.stages?.[1]?.status === "Planning" && report?.stages?.[1]?.dueDate === "2026-09-03", "ODX26-WS-13: Final Report is incorrect.");

const keynote = workstreams.find((item) => item.workstreamId === "ODX26-WS-03");
assert(keynote?.currentStageId === "first-washing", "ODX26-WS-03: current stage must be first-washing.");
assert(keynote?.stages?.[0]?.id === "initial-draft" && keynote?.stages?.[0]?.status === "Completed" && keynote?.stages?.[0]?.completedDate === "", "ODX26-WS-03: Initial Draft status is incorrect.");
assert(keynote?.stages?.[1]?.id === "first-washing" && keynote?.stages?.[1]?.status === "In Progress", "ODX26-WS-03: First Washing status is incorrect.");
assert(keynote?.stages?.slice(2).every((stage) => stage.status === "Planning"), "ODX26-WS-03: later stages must remain Planning.");

const social = workstreams.find((item) => item.workstreamId === "ODX26-WS-07");
assert(social?.currentStageId === "planning-draft" && social?.stages?.[0]?.status === "In Progress" && social?.stages?.[0]?.completedDate === "", "ODX26-WS-07: Planning Draft status is incorrect.");

const sessions = data?.sessions || [];
const breakout = sessions.find((session) => session.sessionId === "ODX-SESSION-01");
const onsiteForum = sessions.find((session) => session.sessionId === "ODX-ONSITE-01");
assert(breakout?.speaker === "何兴" && breakout?.date === "2026-09-04" && breakout?.time === "TBD" && breakout?.topicCN === "解耦·共享·增效：CXL内存池化的场景验证", "Breakout Session changed unexpectedly.");
assert(onsiteForum?.speaker === "Michael Feng" && onsiteForum?.date === "2026-09-03" && onsiteForum?.topicCN === "关于Server SSD在KV Cache Offloading场景下，应用FDP后所产生的效果", "On-site Tech Forum changed unexpectedly.");
assert(JSON.stringify(onsiteForum?.subTopics || []) === JSON.stringify(["CXL Memory Pooling", "MoE offloading Project", "MySQL+QLC project", "KV Cache with Seemless FDP", "AiSIO"]), "On-site Tech Forum subtopics changed unexpectedly.");

if (failures.length) {
  console.error(`ODX data quality failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("ODX data quality passed: 13 workstreams, 8 stages, Process-Only model.");
