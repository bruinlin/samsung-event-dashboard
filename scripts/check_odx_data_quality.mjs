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
  ["ODX26-WS-13", "Post-event Report", "Planning", 0, "TBD", "2026-09-03"]
];
const expectedWorkstreamStates = [
  ["ODX26-WS-01", "Completed", 100],
  ["ODX26-WS-02", "Completed", 100],
  ["ODX26-WS-03", "Completed", 100],
  ["ODX26-WS-04", "Completed", 100],
  ["ODX26-WS-05", "In Progress", 60],
  ["ODX26-WS-06", "Completed", 100],
  ["ODX26-WS-07", "In Progress", 20],
  ["ODX26-WS-08", "Planning", 0],
  ["ODX26-WS-09", "Completed", 100],
  ["ODX26-WS-10", "Completed", 100],
  ["ODX26-WS-11", "Completed", 100],
  ["ODX26-WS-12", "Completed", 100],
  ["ODX26-WS-13", "Planning", 0]
];

assert(Boolean(data), "ODX_2026 dataset was not registered.");
assert(!Object.prototype.hasOwnProperty.call(data || {}, "milestones"), "ODX must not define a milestones data property.");
const event = data?.event || {};
assert(validDate(event.dateStart) && validDate(event.dateEnd) && event.dateEnd >= event.dateStart, "Event date range is invalid.");
assert(JSON.stringify(event.showcasedProducts) === JSON.stringify(["PM1763", "BM1773", "CMM-D"]), "Physical / technology showcase is incorrect.");
assert(JSON.stringify(event.systemDemoVideos) === JSON.stringify(["CXL Memory Pooling", "MoE Offloading Project", "MySQL + QLC Project", "KV Cache with Seamless FDP"]), "System Demo Videos are incorrect.");
assert(event.demoFormat === "Pre-recorded video playback / 预录视频播放", "Demo format is incorrect.");
assert(!event.participationForms?.includes("Hero Live Demo / Hero Live 演示") && event.participationForms?.includes("System Demo Videos / 系统 Demo 视频"), "Participation Forms must use System Demo Videos, not Hero Live Demo.");
assert(event.organizer === "ODCC / Open Data Center Committee" && event.eventScale === "25 Keynotes · 184 Sessions · 3-day event" && event.currentSummary?.includes("Booth B9") && event.currentSummary?.includes("zNAND-O 仅作为 Main Forum Keynote") && event.currentSummary?.includes("KV Cache with Seamless FDP"), "Current Summary is missing confirmed ODX facts.");
const boothWorkstreams = (data?.workstreams || []).filter((item) => ["ODX26-WS-06", "ODX26-WS-11"].includes(item.workstreamId));
assert(!/zNAND-O/i.test(JSON.stringify([event.showcasedProducts, ...boothWorkstreams])), "zNAND-O must not be a Booth showcase item.");
assert(data?.keynote?.status === "In Progress", "Keynote status must be In Progress.");
assert(data?.keynote?.topicEN === "Beyond the Memory Wall: Rearchitecting the Data Path for Agentic AI" && data?.keynote?.topicCN === "突破内存墙：重构智能体 AI 数据路径", "Formal Keynote topics are incorrect.");

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
assert(keynote?.currentStageId === "final-approval", "ODX26-WS-03: current stage must be final-approval.");
assert(keynote?.stages?.length === 5 && keynote.stages.every((stage) => stage.status === "Completed" && stage.completedDate === ""), "ODX26-WS-03: all Keynote stages must be Completed without inferred completion dates.");

const social = workstreams.find((item) => item.workstreamId === "ODX26-WS-07");
assert(social?.workflow === "social-publication", "ODX26-WS-07: Social workflow marker is missing.");
assert(social?.currentStageId === "planning-draft" && social?.stages?.[0]?.status === "In Progress" && social?.stages?.[0]?.completedDate === "", "ODX26-WS-07: Planning Draft status is incorrect.");
assert(JSON.stringify(social?.stages?.map((stage) => stage.id) || []) === JSON.stringify(["planning-draft", "draft", "publish"]), "ODX26-WS-07: expected Planning, Draft and Publish stages.");
assert(social?.stages?.[1]?.status === "Planning" && social?.stages?.[1]?.dueDate === "" && social?.stages?.[2]?.status === "Planning" && social?.stages?.[2]?.dueDate === "", "ODX26-WS-07: unconfirmed Draft/Publish DDLs must remain blank.");

const sessions = data?.sessions || [];
const award = sessions.find((session) => session.sessionId === "ODX-AWARD-01");
const breakout = sessions.find((session) => session.sessionId === "ODX-SESSION-01");
const onsiteForum = sessions.find((session) => session.sessionId === "ODX-ONSITE-01");
assert(!sessions.some((session) => session.sessionId === "ODX-ONSITE-02"), "On-site Tech Forum must be a single shared Session Card.");
assert(award?.type === "ODX Opening Ceremony / Award Ceremony" && award?.speaker === "Kevin Yoon" && award?.date === "2026-09-02" && award?.time === "TBD" && award?.topicEN === "TBD" && award?.topicCN === "TBD" && JSON.stringify(award?.awards) === JSON.stringify([
  { category: "Annual Leading Figure", recipient: "CVP Kevin Yoon" },
  { category: "Annual Breakthrough Project", recipient: "PM1763 PCIe Gen6 SSD" },
  { category: "Annual Pioneer Enterprise", recipient: "Shanghai Samsung Semiconductor" }
]) && award?.remarks?.includes("three confirmed awards") && award?.remarks?.includes("timing remains TBD"), "Award Ceremony information is incorrect.");
assert(breakout?.type === "Official Breakout Session / 官方分论坛" && breakout?.speaker === "豆坤" && breakout?.role === "三星（中国）半导体有限公司高级项目经理" && breakout?.date === "2026-09-04" && breakout?.time === "15:40-16:00" && breakout?.topicCN === "解耦·共享·增效：CXL 内存池化的场景验证", "Official Breakout Session information is incorrect.");
assert(onsiteForum?.type === "On-site Tech Forum / 现场技术论坛" && onsiteForum?.date === "2026-09-03" && onsiteForum?.time === "15:00-15:30" && onsiteForum?.duration === "30 min" && onsiteForum?.format?.includes("TBD") && onsiteForum?.format?.includes("Possible dialogue format"), "Shared On-site Tech Forum information is incorrect.");
assert(JSON.stringify(onsiteForum?.overallTopics) === JSON.stringify(["CXL Memory Pooling", "MoE Offloading Project", "MySQL + QLC Project", "KV Cache with Seamless FDP", "AiSIO"]), "On-site Tech Forum overall topics are incorrect.");
assert(onsiteForum?.participants?.length === 2, "On-site Tech Forum must contain two participants.");
const heXing = onsiteForum?.participants?.[0];
const michealFeng = onsiteForum?.participants?.[1];
assert(heXing?.speaker === "何兴" && heXing?.role === "西安三星电子研究所 存储解决方案部技术总监" && heXing?.topicEN === "CXL Optimized KV Cache Solution" && heXing?.topicCN === "CXL 优化的 KV Cache 解决方案", "何兴 On-site participant information is incorrect.");
assert(JSON.stringify(heXing?.subTopics || []) === JSON.stringify(["Samsung CMM-D based Memory Pooling", "CXL Switch based KV Cache Solution", "CXL Memory Pooling performance benefit"]), "何兴 On-site subtopics are incorrect.");
assert(michealFeng?.speaker === "Micheal Feng" && michealFeng?.speakerCN === "冯方" && michealFeng?.role === "三星半导体 Memory 战略规划总监" && michealFeng?.topicEN === "Feeding Storage to Accelerators: AiSIO" && michealFeng?.topicCN === "TBD", "Micheal Feng On-site participant information is incorrect.");
assert(!JSON.stringify(data).includes("Michael Feng"), "Incorrect Michael Feng spelling found.");
assert(data?.keynote?.speaker === "Jay Hyun" && data?.keynote?.speakerCN === "玄在雄" && data?.keynote?.title === "CVP, NAND Product Planning, Samsung Electronics" && data?.keynote?.titleCN === "三星电子副总裁兼NAND闪存规划与赋能事业部负责人", "Main Forum speaker information is incorrect.");
assert(workstreams.find((item) => item.workstreamId === "ODX26-WS-09")?.latestUpdate === "On-site Tech Forum is scheduled for Sep. 3, 15:00–15:30 (30 minutes), with 何兴 and Micheal Feng / 冯方 confirmed. The final format may be a technical dialogue and remains TBD. 何兴 will cover CXL Optimized KV Cache Solution; Micheal Feng will cover AiSIO. Booth system demos are pre-recorded video playback and align with the On-site presentation content by 何兴.", "ODX26-WS-09 On-site update is incorrect.");
const socialUpdate = workstreams.find((item) => item.workstreamId === "ODX26-WS-07");
const prUpdate = workstreams.find((item) => item.workstreamId === "ODX26-WS-08");
assert(socialUpdate?.latestUpdate === "KOL booth exploration with 智能纪元AGI is confirmed for ODX 2026." && socialUpdate?.remarks?.includes("Booth Exploration / 探展"), "ODX26-WS-07 KOL information is incorrect.");
assert(prUpdate?.latestUpdate === "Onsite PR interview by TMTPost / 钛媒体 with Micheal Feng / 冯方 is confirmed." && prUpdate?.remarks?.includes("Confirmed PR: TMTPost / 钛媒体 × Micheal Feng / 冯方"), "ODX26-WS-08 PR information is incorrect.");

if (failures.length) {
  console.error(`ODX data quality failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("ODX data quality passed: 13 workstreams, 10 stages, Process-Only model.");
