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
const expectedProcesses = [
  ["ODX26-WS-10", "Gifts", "Completed", 100, "TBD", "2026-08-06"],
  ["ODX26-WS-11", "Product Information & Assets", "Completed", 100, "TBD", "2026-08-14"],
  ["ODX26-WS-12", "Event Agenda & Personnel Details", "Completed", 100, "TBD", "2026-08-25"],
  ["ODX26-WS-13", "Post-event Report", "Completed", 100, "TBD", "2026-09-03"]
];
const expectedWorkstreamStates = [
  ["ODX26-WS-01", "Completed", 100],
  ["ODX26-WS-02", "Completed", 100],
  ["ODX26-WS-03", "Completed", 100],
  ["ODX26-WS-04", "Completed", 100],
  ["ODX26-WS-05", "Completed", 100],
  ["ODX26-WS-06", "Completed", 100],
  ["ODX26-WS-07", "Completed", 100],
  ["ODX26-WS-08", "Completed", 100],
  ["ODX26-WS-09", "Completed", 100],
  ["ODX26-WS-10", "Completed", 100],
  ["ODX26-WS-11", "Completed", 100],
  ["ODX26-WS-12", "Completed", 100],
  ["ODX26-WS-13", "Completed", 100]
];

assert(Boolean(data), "ODX_2026 dataset was not registered.");
assert(!Object.prototype.hasOwnProperty.call(data || {}, "milestones"), "ODX must not define a milestones data property.");
const event = data?.event || {};
assert(validDate(event.dateStart) && validDate(event.dateEnd) && event.dateEnd >= event.dateStart, "Event date range is invalid.");
assert(data?.meta?.lastUpdated === "2026-09-09" && event.overallStatus === "Completed" && event.reportStatus === "Completed", "ODX final close-out status is incorrect.");
assert(JSON.stringify(event.showcasedProducts) === JSON.stringify(["PM1763", "BM1773", "CMM-D"]), "Physical / technology showcase is incorrect.");
assert(JSON.stringify(event.systemDemoVideos) === JSON.stringify(["FDP", "NVMe Large Atomic", "CXL"]), "Final System Demo Videos are incorrect.");
assert(event.demoFormat === "Pre-recorded video playback / 预录视频播放", "Demo format is incorrect.");
assert(!event.participationForms?.includes("Hero Live Demo / Hero Live 演示") && event.participationForms?.includes("System Demo Videos / 系统 Demo 视频"), "Participation Forms must use System Demo Videos, not Hero Live Demo.");
assert(event.organizer === "ODCC / Open Data Center Committee" && event.eventScale === "8,000㎡ Exhibition Area · 5,726 Event Visitors (+201.8% YoY)" && event.currentSummary?.includes("1,752 visitors (+20% YoY)") && event.currentSummary?.includes("zNAND-O remained Keynote-only"), "Final event summary is incorrect.");
const boothWorkstreams = (data?.workstreams || []).filter((item) => ["ODX26-WS-06", "ODX26-WS-11"].includes(item.workstreamId));
assert(!/zNAND-O/i.test(JSON.stringify([event.showcasedProducts, ...boothWorkstreams])), "zNAND-O must not be a Booth showcase item.");
assert(data?.keynote?.status === "Completed", "Keynote status must be Completed.");
assert(data?.keynote?.topicEN === "Beyond the Memory Wall: Rearchitecting the Data Path for Agentic AI" && data?.keynote?.topicCN === "突破内存墙：重构面向智能体 AI 的数据通路", "Final Keynote topics are incorrect.");
assert(JSON.stringify(event.resultMetrics?.map((item) => item.label)) === JSON.stringify([
  "Booth Visitors / 展位访问",
  "On-site Forum Attendees / 现场论坛参与人次",
  "New Followers / 新增粉丝",
  "PR Article Coverage / PR文章覆盖数量"
]), "ODX Hero KPI cards must contain only the four final event results.");

const workstreams = data?.workstreams || [];
assert(workstreams.length === 13, `Expected 13 workstreams, found ${workstreams.length}.`);
const ids = workstreams.map((item) => item.workstreamId);
assert(new Set(ids).size === ids.length, "Duplicate workstream ID found.");
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
assert(stageCount === 10, `Expected 10 stages, found ${stageCount}.`);
assert(workstreams.every((item) => item.status === "Completed" && Number(item.progress) === 100), "All 13 ODX Workstreams must be Completed at 100%.");
assert(workstreams.flatMap((item) => item.stages || []).every((stage) => stage.status === "Completed"), "All registered ODX stages must be Completed.");

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
assert(report?.currentStageId === "final-report", "ODX26-WS-13: current stage must be final-report.");
assert(report?.stages?.length === 2, "ODX26-WS-13: expected two report stages.");
assert(report?.stages?.[0]?.id === "report-draft" && report?.stages?.[0]?.status === "Completed" && report?.stages?.[0]?.dueDate === "2026-08-31", "ODX26-WS-13: Report Draft is incorrect.");
assert(report?.stages?.[1]?.id === "final-report" && report?.stages?.[1]?.status === "Completed" && report?.stages?.[1]?.dueDate === "2026-09-03", "ODX26-WS-13: Final Report is incorrect.");

const keynote = workstreams.find((item) => item.workstreamId === "ODX26-WS-03");
assert(keynote?.currentStageId === "final-approval", "ODX26-WS-03: current stage must be final-approval.");
assert(keynote?.stages?.length === 5 && keynote.stages.every((stage) => stage.status === "Completed" && stage.completedDate === ""), "ODX26-WS-03: all Keynote stages must be Completed without inferred completion dates.");

const social = workstreams.find((item) => item.workstreamId === "ODX26-WS-07");
assert(social?.workflow === "social-publication", "ODX26-WS-07: Social workflow marker is missing.");
assert(social?.currentStageId === "publish" && social?.stages?.every((stage) => stage.status === "Completed" && stage.completedDate === ""), "ODX26-WS-07: all Social stages must be Completed.");
assert(JSON.stringify(social?.stages?.map((stage) => stage.id) || []) === JSON.stringify(["planning-draft", "draft", "publish"]), "ODX26-WS-07: expected Planning, Draft and Publish stages.");
assert(social?.stages?.[1]?.dueDate === "" && social?.stages?.[2]?.dueDate === "", "ODX26-WS-07: Draft/Publish DDLs must remain blank.");

const sessions = data?.sessions || [];
const award = sessions.find((session) => session.sessionId === "ODX-AWARD-01");
const breakout = sessions.find((session) => session.sessionId === "ODX-SESSION-01");
const onsiteForum = sessions.find((session) => session.sessionId === "ODX-ONSITE-01");
assert(!sessions.some((session) => session.sessionId === "ODX-ONSITE-02"), "On-site Tech Forum must be a single shared Session Card.");
assert(award?.type === "ODX Opening Ceremony / Award Ceremony" && award?.speaker === "Kevin Yoon" && award?.date === "2026-09-02" && award?.time === "09:50-10:10" && award?.status === "Completed" && JSON.stringify(award?.awards) === JSON.stringify([
  { category: "2026 ODX Industry Leader / 领军人物", recipient: "Kevin Yoon" },
  { category: "2026 ODX Breakthrough Project / 突破项目", recipient: "PM1763 PCIe Gen6 SSD" },
  { category: "2026 ODX Pioneer Enterprise / 先锋企业", recipient: "Samsung Semiconductor" }
]), "Final Award Ceremony information is incorrect.");
assert(breakout?.type === "Official Breakout Session / 官方分论坛" && breakout?.speaker === "Dou Kun / 豆坤" && breakout?.role === "Senior Project Manager, Samsung Semiconductor (China)" && breakout?.date === "2026-09-04" && breakout?.time === "15:20-15:40" && breakout?.status === "Completed" && breakout?.topicCN === "解耦·共享·增效：CXL 内存池化的场景验证", "Final Official Breakout Session information is incorrect.");
assert(onsiteForum?.type === "On-site Tech Forum / 现场技术论坛" && onsiteForum?.date === "2026-09-03" && onsiteForum?.time === "15:00-16:00" && onsiteForum?.duration === "60 min" && onsiteForum?.status === "Completed" && onsiteForum?.format === "Technical Forum / 技术论坛", "Final On-site Tech Forum information is incorrect.");
assert(JSON.stringify(onsiteForum?.overallTopics) === JSON.stringify(["CXL / KV Cache", "MoE Offloading", "FDP SSD", "QLC Atomic Write", "AiSIO"]), "Final On-site Tech Forum topics are incorrect.");
assert(onsiteForum?.participants?.length === 2, "On-site Tech Forum must contain two participants.");
const heXing = onsiteForum?.participants?.[0];
const michaelFeng = onsiteForum?.participants?.[1];
assert(heXing?.speaker === "何兴" && heXing?.role === "Technical Director of the Storage Solution Department, Samsung R&D Institute Xi'an" && heXing?.topicEN === "CXL Optimized KV Cache Solution" && heXing?.topicCN === "CXL 优化的 KV Cache 解决方案", "何兴 On-site participant information is incorrect.");
assert(JSON.stringify(heXing?.subTopics || []) === JSON.stringify(["Samsung CMM-D based Memory Pooling", "CXL Switch based KV Cache Solution", "CXL Memory Pooling performance benefit"]), "何兴 On-site subtopics are incorrect.");
assert(michaelFeng?.speaker === "Michael Feng" && michaelFeng?.speakerCN === "冯方" && michaelFeng?.role === "Director of Memory Strategic Planning, Samsung Semiconductor" && michaelFeng?.topicEN === "Feeding Storage to Accelerators: AiSIO" && michaelFeng?.topicCN === "", "Michael Feng On-site participant information is incorrect.");
assert(!JSON.stringify(data).includes("Micheal Feng"), "Incorrect Michael Feng spelling found.");
assert(data?.keynote?.speaker === "Jay Hyun" && data?.keynote?.speakerCN === "玄在雄" && data?.keynote?.title === "CVP, NAND Product Planning, Samsung Electronics" && data?.keynote?.titleCN === "三星电子副总裁兼NAND闪存规划与赋能事业部负责人", "Main Forum speaker information is incorrect.");
assert(workstreams.find((item) => item.workstreamId === "ODX26-WS-09")?.latestUpdate?.includes("15:00–16:00") && workstreams.find((item) => item.workstreamId === "ODX26-WS-09")?.latestUpdate?.includes("seven attendees"), "ODX26-WS-09 final On-site update is incorrect.");
const socialUpdate = workstreams.find((item) => item.workstreamId === "ODX26-WS-07");
const prUpdate = workstreams.find((item) => item.workstreamId === "ODX26-WS-08");
assert(socialUpdate?.latestUpdate?.includes("+333 followers") && socialUpdate?.remarks?.includes("completed"), "ODX26-WS-07 final Social information is incorrect.");
assert(prUpdate?.latestUpdate?.includes("64 same-day media coverage") && prUpdate?.remarks?.includes("TMTPost"), "ODX26-WS-08 final PR information is incorrect.");
assert((data.resourceLinks || []).length === 18 && (data.resourceLinks || []).every((item) => /^https:\/\//.test(item.url) && item.status === "Published"), "Final PR, KOL and Social links are incomplete.");

if (failures.length) {
  console.error(`ODX data quality failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("ODX final close-out data quality passed: 13 workstreams, 10 stages, Process-Only model.");
