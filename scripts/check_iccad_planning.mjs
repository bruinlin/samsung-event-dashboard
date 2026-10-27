import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const parse = (source, key) => {
  const context = { window: {} };
  vm.runInNewContext(source, context);
  return JSON.parse(JSON.stringify(context.window[key]));
};
const data = parse(read("data/ICCAD_2026.js"), "EVENT_DATASETS").ICCAD_2026;
const context = { window: {} };
vm.runInNewContext(read("assets/workflow-state.js"), context);
const workflow = context.window.DashboardWorkflow;
const prefix = "ICCAD26-WS-";
const workstream = (id) => data.workstreams.find((item) => item.workstreamId === prefix + id);
const notes = (item) => `${item.latestUpdate}\n${item.nextAction}`;
const internalLabel = "建议内部截止，按展期及往年经验倒排，待确认";
const unknownLabel = "进度待核；0%为原始基线，不代表确认未启动";
const estimateLabel = "规划估算，非实际工时完成率";

// The reviewed 2026-10-27 plan is a deliberate snapshot, not a formula for
// inferring actual completion from dates, exhibit counts, or received videos.
const expectedTasks = [
  ["01", "In Progress", 80, "2026-10-30"],
  ["02", "In Progress", 10, "2026-11-18"],
  ["03", "Completed", 100, ""],
  ["04", "In Progress", 40, "2026-11-18"],
  ["05", "In Progress", 15, "2026-11-20"],
  ["06", "In Progress", 0, "2026-10-30"],
  ["07", "Planning", 0, "2026-10-29"],
  ["08", "Planning", 0, "2026-10-30"],
  ["09", "Planning", 0, "2026-11-12"],
  ["10", "Planning", 0, "2026-11-16"],
  ["11", "Planning", 0, "2026-10-30"],
  ["12", "Planning", 0, "2026-11-27"]
];
const expectedStages = {
  "02": [
    ["presenter-confirmation", "In Progress", "2026-10-30"],
    ["topic-confirmation", "Planning", "2026-10-30"],
    ["initial-draft", "Planning", "2026-11-06"],
    ["internal-review", "Planning", "2026-11-12"],
    ["final-approval", "Planning", "2026-11-13"],
    ["rehearsal", "Planning", "2026-11-18"]
  ],
  "04": [
    ["design-brief", "Completed", ""],
    ["initial-design", "Completed", ""],
    ["review-revision", "In Progress", "2026-10-29"],
    ["final-artwork", "Planning", "2026-10-30"],
    ["onsite-completion", "Planning", "2026-11-18"]
  ],
  "05": [
    ["participants-confirmation", "In Progress", "2026-10-31"],
    ["onsite-readiness", "Planning", "2026-11-18"],
    ["event-execution", "Planning", "2026-11-20"]
  ],
  "10": [
    ["planning-draft", "Planning", "2026-10-30"],
    ["draft", "Planning", "2026-11-12"],
    ["publish", "Planning", "2026-11-16"]
  ],
  "12": [
    ["data-collection", "Planning", "2026-11-23"],
    ["report-draft", "Planning", "2026-11-25"],
    ["final-report", "Planning", "2026-11-27"]
  ]
};

assert.equal(data.workstreams.length, 12);
assert.equal(new Set(data.workstreams.map((item) => item.workstreamId)).size, 12);
assert.equal(data.event.dateStart, "2026-11-19");
assert.equal(data.event.dateEnd, "2026-11-20");
assert.equal(data.event.boothArea, "54㎡");
assert.equal(data.event.showcasedProducts, "2.3D Cube-E、3D IC Cube-T/H、2nm GAA Wafer、All-in-one Heterogeneous、The Evolution of Transistors");
for (const [id, status, progress, dueDate] of expectedTasks) {
  const item = workstream(id);
  assert(item, `${id}: missing workstream`);
  assert.equal(workflow.workstreamStatus(item), status, `${id}: derived status`);
  if (item.status) assert.equal(item.status, status, `${id}: conflicting stored status`);
  assert.equal(item.progress, progress, `${id}: planning progress`);
  assert.equal(item.dueDate, dueDate, `${id}: final DDL`);
  assert(Number.isInteger(item.progress) && item.progress >= 0 && item.progress <= 100);
  assert.equal(item.owner, "TBD", `${id}: do not infer an owner`);
  assert.equal(item.actualCompletionDate, "", `${id}: do not infer completion date`);
  if (dueDate) {
    assert(workflow.validDate(dueDate), `${id}: valid final DDL`);
    assert(notes(item).includes(internalLabel), `${id}: visible internal deadline label`);
  }
  const stages = item.stages || [];
  assert.deepEqual(stages.map((stage) => [stage.id, stage.status, stage.dueDate]), expectedStages[id] || [], `${id}: approved stage plan`);
  assert.equal(new Set(stages.map((stage) => stage.id)).size, stages.length);
  let lastDate = "";
  for (const stage of stages) {
    assert.equal(stage.completedDate, "", `${id}/${stage.id}: no invented completion date`);
    assert.equal(stage.owner, undefined, `${id}/${stage.id}: no invented stage owner`);
    if (stage.dueDate) {
      assert(workflow.validDate(stage.dueDate), `${id}/${stage.id}: valid DDL`);
      assert(stage.dueDate >= "2026-10-27", `${id}/${stage.id}: no invented past DDL`);
      assert(stage.dueDate >= lastDate, `${id}: stage dates must be ordered`);
      lastDate = stage.dueDate;
    }
    if (stage.status === "Completed") assert.equal(stage.dueDate, "", `${id}/${stage.id}: no inferred past deadline`);
  }
  if (lastDate) assert(dueDate >= lastDate, `${id}: final DDL precedes last stage`);
  if (stages.length) {
    assert(stages.some((stage) => stage.id === item.currentStageId));
    assert.equal(workflow.currentStageFor(item).id, item.currentStageId);
  }
}
for (const id of ["01", "02", "04", "05"]) assert(notes(workstream(id)).includes(estimateLabel), `${id}: estimate disclosure`);
for (const id of ["06", "07", "08", "09", "10", "11", "12"]) {
  assert(notes(workstream(id)).includes(unknownLabel), `${id}: unknown progress disclosure`);
  assert.notEqual(workflow.workstreamStatus(workstream(id)), "Completed");
}
assert(notes(workstream("01")).includes("10/31参会统计表为已核实执行截止"));
assert(notes(workstream("05")).includes("10/31参会统计表为已核实执行截止"));
assert(notes(workstream("05")).includes("除10/31人员统计外"));
assert(notes(workstream("03")).includes("100%仅指清单确认，不代表实物制作、到场或展示就绪"));
assert(notes(workstream("03")).includes("HPC 内容保留，Auto 内容缩减；本次 ICCAD 取消展品运输"));
assert(notes(workstream("04")).includes("大屏已收到2条视频，可播放，现场播放链路待测"));
assert(notes(workstream("05")).includes("计划租赁约60㎡会议室，U型摆放，容纳约18人，尚待落实租赁"));
assert(notes(workstream("05")).includes("取消ICCAD展品运输不取消礼品物料配送、搭建或回收"));
assert(notes(workstream("09")).includes("实际付款期限以合同为准"));
assert(notes(workstream("10")).includes("仅在有发布需求时适用，未获批则取消计划"));
assert.deepEqual(data.workstreams.filter((item) => workflow.workstreamStatus(item) === "Completed").map((item) => item.workstreamId), [prefix + "03"]);
assert.equal(data.workstreams.flatMap((item) => item.stages || []).filter((stage) => stage.status === "Completed").length, 2);

// Optional change-scope check uses a caller-supplied pre-change commit. It
// avoids pinning unrelated events forever when this planning snapshot evolves.
const baselineFlag = process.argv.indexOf("--baseline");
if (baselineFlag !== -1) {
  const baseline = process.argv[baselineFlag + 1];
  assert(/^[a-f0-9]{40}$/.test(baseline || ""), "Supply a full baseline commit SHA");
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" });
  const before = parse(git("show", `${baseline}:data/ICCAD_2026.js`), "EVENT_DATASETS").ICCAD_2026;
  for (const key of ["event", "keynote", "sessions", "finalDocuments"]) assert.deepEqual(data[key], before[key], `${key}: preserve existing facts`);
  for (const previous of before.workstreams) {
    const current = data.workstreams.find((item) => item.workstreamId === previous.workstreamId);
    for (const key of ["owner", "actualCompletionDate", "nameCN", "nameEN", "categoryId", "categoryNameCN", "categoryNameEN"]) assert.deepEqual(current[key], previous[key], `${previous.workstreamId}/${key}: preservation`);
    for (const stage of previous.stages || []) {
      const currentStage = current.stages.find((entry) => entry.id === stage.id);
      assert(currentStage, `${previous.workstreamId}/${stage.id}: preserve existing stage`);
      for (const key of ["owner", "completedDate"]) assert.deepEqual(currentStage[key], stage[key], `${stage.id}/${key}: preservation`);
    }
  }
  const allowed = new Set(["data/ICCAD_2026.js", "event_data.js", "index.html", "CHANGELOG.md", "scripts/check_iccad_planning.mjs"]);
  for (const file of git("diff", "--name-only", baseline).trim().split("\n").filter(Boolean)) assert(allowed.has(file), `${file}: unrelated tracked file changed`);
  const registry = parse(read("event_data.js"), "EVENT_INDEX");
  const previousRegistry = parse(git("show", `${baseline}:event_data.js`), "EVENT_INDEX");
  registry.events.find((event) => event.eventId === "ICCAD_2026").dataFile = previousRegistry.events.find((event) => event.eventId === "ICCAD_2026").dataFile;
  assert.deepEqual(registry, previousRegistry, "Preserve all other registry data");
  assert.equal(read("index.html").replace(/event_data\.js\?v=[\d.]+/, "event_data.js?v=BASELINE"), git("show", `${baseline}:index.html`).replace(/event_data\.js\?v=[\d.]+/, "event_data.js?v=BASELINE"), "Only the registry cache key may change in HTML");
  console.log("ICCAD change-scope checks passed: unrelated files, event facts, owners and actual completion dates preserved.");
}
console.log("ICCAD planning checks passed: 12 workstreams, 20 stages, ordered DDLs, derived states, completion scope and visible estimate/deadline disclosures.");
