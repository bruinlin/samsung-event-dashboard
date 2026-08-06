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
const report = [];
const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
const unique = (values, label) => {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length) failures.push(`Duplicate ${label}: ${[...new Set(duplicates)].join(", ")}`);
};
const derivedStatus = (workstream) => {
  const stages = Array.isArray(workstream.stages) ? workstream.stages : [];
  if (!stages.length) return workstream.status;
  if (stages.some((stage) => stage.status === "Blocked")) return "Blocked";
  const current = stages.find((stage) => stage.id === workstream.currentStageId) || stages.find((stage) => stage.status !== "Completed") || stages.at(-1);
  if (current?.status === "Under Review" || stages.some((stage) => stage.status === "Under Review")) return "Under Review";
  const completeCount = stages.filter((stage) => stage.status === "Completed").length;
  if (completeCount === stages.length) return "Completed";
  if (completeCount === 0 && stages.every((stage) => stage.status === "Planning")) return "Planning";
  return "In Progress";
};
const addDays = (date, days) => {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
};

if (!data) failures.push("ODX_2026 dataset was not registered.");
const event = data?.event || {};
if (!validDate(event.dateStart) || !validDate(event.dateEnd) || event.dateEnd < event.dateStart) failures.push("Event date range is invalid.");
for (let date = event.dateStart; validDate(date) && date <= event.dateEnd; date = addDays(date, 1)) report.push(`${date}\tevent\t${event.shortName} · Event Day\tevent.dateStart/dateEnd`);

const workstreams = data?.workstreams || [];
unique(workstreams.map((item) => item.workstreamId), "workstreamId");
unique((data?.milestones || []).map((item) => item.milestoneId), "milestoneId");
unique((data?.sessions || []).map((item) => item.sessionId), "sessionId");
const allStageIds = [];

for (const item of workstreams) {
  if (item.dueDate && !validDate(item.dueDate)) failures.push(`${item.workstreamId}: invalid Task Final DDL.`);
  if (item.status === "Planning" && Number(item.progress) !== 0) failures.push(`${item.workstreamId}: Planning must have 0 progress.`);
  if (item.status === "Completed" && Number(item.progress) !== 100) failures.push(`${item.workstreamId}: Completed must have 100 progress.`);
  if (validDate(item.dueDate)) report.push(`${item.dueDate}\ttask\t${item.nameEN} · Final DDL\tworkstreams[].dueDate`);
  const stages = Array.isArray(item.stages) ? item.stages : [];
  if (stages.length && !stages.some((stage) => stage.id === item.currentStageId)) failures.push(`${item.workstreamId}: currentStageId is invalid.`);
  if (stages.length && derivedStatus(item) !== item.status) failures.push(`${item.workstreamId}: status does not match its stages.`);
  let previous = "";
  let lastStageDate = "";
  for (const stage of stages) {
    allStageIds.push(stage.id);
    if (stage.dueDate && !validDate(stage.dueDate)) failures.push(`${item.workstreamId}/${stage.id}: invalid Stage DDL.`);
    if (stage.status === "Completed" && !validDate(stage.completedDate)) failures.push(`${item.workstreamId}/${stage.id}: completed Stage needs completedDate.`);
    if (validDate(stage.dueDate)) {
      if (previous && stage.dueDate < previous) failures.push(`${item.workstreamId}: Stage DDL sequence is out of order.`);
      previous = stage.dueDate;
      lastStageDate = stage.dueDate;
      report.push(`${stage.dueDate}\tstage\t${item.nameEN} · ${stage.nameEN}\tworkstreams[].stages[].dueDate`);
    }
  }
  if (validDate(item.dueDate) && lastStageDate && item.dueDate < lastStageDate) failures.push(`${item.workstreamId}: Task Final DDL precedes its last Stage DDL.`);
}
unique(allStageIds, "stage id");

const expectedMilestones = new Set(["ODX26-M-01", "ODX26-M-03", "ODX26-M-06", "ODX26-M-08", "ODX26-M-10"]);
const actualMilestones = data?.milestones || [];
for (const milestone of actualMilestones) {
  if (!validDate(milestone.date)) failures.push(`${milestone.milestoneId}: invalid Milestone date.`);
  if (!expectedMilestones.has(milestone.milestoneId)) failures.push(`${milestone.milestoneId}: duplicate or unreviewed ODX Milestone remains.`);
  report.push(`${milestone.date}\tmilestone\t${milestone.titleEN}\tmilestones[]`);
}
if (actualMilestones.length !== expectedMilestones.size) failures.push("ODX independent Milestone set is incomplete or contains duplicates.");

const calendarKeys = report.map((line) => line.split("\t").slice(0, 3).join("\t"));
unique(calendarKeys, "derived Calendar item");
report.sort((a, b) => a.localeCompare(b));
console.log("ODX Calendar derivation");
console.log("Date\tType\tItem\tSource");
console.log(report.join("\n"));
if (failures.length) {
  console.error(`\nODX data quality failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`\nODX data quality passed: ${workstreams.length} workstreams, ${allStageIds.length} stages, ${actualMilestones.length} independent milestones.`);
