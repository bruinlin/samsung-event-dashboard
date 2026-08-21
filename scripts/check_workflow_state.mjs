import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(read("assets/workflow-state.js"), context, { filename: "assets/workflow-state.js" });
const workflow = context.window.DashboardWorkflow;
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const clone = (value) => JSON.parse(JSON.stringify(value));

const social = {
  workstreamId: "ODX26-WS-07",
  status: "In Progress",
  currentStageId: "planning-draft",
  stages: [
    { id: "planning-draft", status: "In Progress", dueDate: "2026-08-19" },
    { id: "draft", status: "Planning", dueDate: "" },
    { id: "publish", status: "Planning", dueDate: "" }
  ]
};

assert(workflow.workstreamStatus(social) === "In Progress", "Social baseline must remain In Progress.");
assert(workflow.displayWorkstreamStatus(social, "2026-08-18") === "In Progress", "A future Planning DDL must not be overdue.");

const draftCompleted = clone(social);
draftCompleted.stages[0].status = "Completed";
draftCompleted.stages[0].completedDate = "2026-08-19";
draftCompleted.currentStageId = "draft";
assert(workflow.workstreamStatus(draftCompleted) === "In Progress", "Completing Planning while Draft/Publish remain incomplete must keep parent In Progress.");
assert(workflow.currentStageFor(draftCompleted).id === "draft", "Current stage must move to the first incomplete stage.");

const publishOverdue = clone(draftCompleted);
publishOverdue.stages[1].status = "Completed";
publishOverdue.stages[1].completedDate = "2026-08-20";
publishOverdue.stages[2].status = "In Progress";
publishOverdue.stages[2].dueDate = "2026-08-20";
publishOverdue.currentStageId = "publish";
assert(workflow.workstreamStatus(publishOverdue) === "In Progress", "An overdue Publish stage must retain the canonical parent status In Progress.");
assert(workflow.displayWorkstreamStatus(publishOverdue, "2026-08-21") === "Overdue", "An overdue Publish stage must display as Overdue.");
assert(workflow.displayStageStatus(publishOverdue.stages[2], "2026-08-21") === "Overdue", "Calendar stage status must use the same overdue calculation.");
assert(workflow.overdueDeadlineFor(publishOverdue, "2026-08-21")?.id === "publish", "Overdue detail must identify the exact Publish stage.");

const allCompleted = clone(publishOverdue);
allCompleted.stages[2].status = "Completed";
allCompleted.stages[2].completedDate = "2026-08-21";
assert(workflow.workstreamStatus(allCompleted) === "Completed", "Parent must complete only after every workflow stage is completed.");
assert(workflow.displayWorkstreamStatus(allCompleted, "2026-08-21") === "Completed", "Completed parent must not display as Overdue.");

const legacy = {
  workstreamId: "LEGACY",
  status: "In Progress",
  currentStageId: "review",
  stages: [
    { id: "draft", status: "Completed", dueDate: "2026-08-10" },
    { id: "review", status: "In Progress", dueDate: "" }
  ]
};
assert(workflow.workstreamStatus(legacy) === "In Progress", "Existing staged workstreams must remain compatible.");
assert(workflow.workstreamStatus({ status: "Planning", stages: [] }) === "Planning", "Existing non-staged records must remain compatible.");

if (failures.length) {
  console.error(`Workflow state check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("Workflow state check passed: derived parent, overdue display, exact stage and legacy compatibility.");
