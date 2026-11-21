import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
const read = (name) => fs.readFileSync(new URL("../" + name, import.meta.url), "utf8");
const context = vm.createContext({ window: { DASHBOARD_CONFIG: {} }, structuredClone, console });
function load(path) { vm.runInContext(read(path), context); }
load("assets/workflow-state.js");
load("assets/collaboration.js");
load("data/ICCAD_2026.js");
const app = read("assets/app.js").replace("  init();\n})();", "  window.closeoutTest = { workstreamStatus, workstreamDisplayStatus, workstreamRows, categorySummary, buildCalendarItems, buildAttentionItems };\n})();");
vm.runInContext(app, context);
const { closeoutTest: view, DashboardCollab: collab, EVENT_DATASETS: { ICCAD_2026: data } } = context.window;
assert.equal(data.keynote.labelEN, "Booth Presentation");
assert.equal(data.keynote.speaker, "Simon Hu");
assert.equal(data.keynote.topicEN, "Samsung Foundry: Innovative All-in-One");
assert.equal(data.keynote.date, "2026-11-19");
assert.equal(data.keynote.time, "14:40–15:00 (Beijing time / 北京时间)");
assert.match(data.workstreams[1].latestUpdate, /14:40–15:00（北京时间）/);
assert.match(data.workstreams[1].latestUpdate, /Simon Hu/);
assert.match(data.workstreams[1].remarks, /Innovative All-in-One/);
assert.equal(data.sessions.length, 1);
assert.equal(data.sessions[0].type, data.keynote.labelEN);
assert.equal(data.sessions[0].format, "Invitation-only / 定向邀请");
for (const key of ["speaker", "date", "time", "topicEN", "topicCN", "status"]) assert.equal(data.sessions[0][key], data.keynote[key]);
assert.equal(data.workstreams.length, 13);
assert.equal(new Set(data.workstreams.map((x) => x.workstreamId)).size, 13);
const pr = data.workstreams[10], survey = data.workstreams[12];
assert.equal(pr.nameEN, "PR & Media");
assert.equal(view.workstreamDisplayStatus(pr), "No Need");
assert.equal(pr.progress, null);
assert.equal(survey.nameEN, "Post-event Survey");
assert.equal(view.workstreamStatus(survey), "Planning");
assert.equal(survey.progress, 0);
assert.equal(survey.dueDate, "");
assert.match(view.workstreamRows(survey), /Read-only/);
for (const x of data.workstreams.filter((x) => x !== pr && x !== survey)) {
  assert.equal(view.workstreamStatus(x), "Completed");
  assert.equal(x.progress, 100);
  assert.equal(x.actualCompletionDate, "");
  for (const s of x.stages || []) assert.equal(s.completedDate, "");
}
assert.equal(data.workstreams.flatMap((x) => x.stages || []).filter((s) => s.status === "Completed").length, 20);
assert.equal(view.categorySummary(data.workstreams).total, 12);
assert.equal(view.categorySummary(data.workstreams).completed, 11);
assert.equal(view.buildCalendarItems(data).some((x) => x.workstreamId === pr.workstreamId), false);
assert.equal(view.buildAttentionItems(data).map((x) => x.workstreamId).join(","), survey.workstreamId);

const overlay = { workstreams: [
  { workstream_id: data.workstreams[0].workstreamId, status_set: true, status: "In Progress", progress_set: true, progress: 5, owner_set: true, owner: "Existing owner", next_action_set: true, next_action: "Old", updated_at: "2026-11-01T00:00:00Z", version: 8 },
  { workstream_id: pr.workstreamId, status_set: true, status: "Planning", progress_set: true, progress: 0, updated_at: "2026-12-01T00:00:00Z" },
], stages: [{ workstream_id: data.workstreams[1].workstreamId, stage_id: data.workstreams[1].stages[0].id, status_set: true, status: "Blocked", completed_date_set: true, completed_date: "2026-11-19", updated_at: "2026-11-01T00:00:00Z" }] };
const merge = collab.__test.applyPublicUpdates;
const fixed = merge(data, overlay);
assert.equal(fixed.workstreams[0].status, "Completed");
assert.equal(fixed.workstreams[0].progress, 100);
assert.equal(fixed.workstreams[0].nextAction, "");
assert.equal(fixed.workstreams[0].owner, "Existing owner");
assert.equal(fixed.workstreams[0]._collaboration.version, 8);
assert.equal(view.workstreamDisplayStatus(fixed.workstreams[10]), "No Need");
assert.equal(fixed.workstreams[1].stages[0].status, "Completed");
assert.equal(fixed.workstreams[1].stages[0].completedDate, "2026-11-19");
overlay.workstreams[0].updated_at = "2026-12-01T00:00:00Z";
assert.equal(merge(data, overlay).workstreams[0].progress, 5);
assert.equal(merge({ event: { eventId: "ODX_2026" }, workstreams: [data.workstreams[0]] }, { workstreams: [{...overlay.workstreams[0], updated_at:"2026-11-01T00:00:00Z"}] }).workstreams[0].progress, 5);
const git = (...args) => execFileSync("git", args, { cwd: new URL("../", import.meta.url), encoding: "utf8" });
const base = "32cc418089126a42a90e96ad081ad9af23fba2c3";
for (const p of ["data/OCTS_2026.js", "data/ODX_2026.js", "supabase/seed_dashboard.sql", "config.js"]) assert.equal(read(p), git("show", base+":"+p), p);
console.log("ICCAD closeout: 11 completed workstreams / 20 stages, PR excluded, one pending Survey, stale overlay and unaffected events verified.");
