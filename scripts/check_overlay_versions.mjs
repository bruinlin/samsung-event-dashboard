import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (file) => fs.readFileSync(new URL(file, root), "utf8");
const elements = new Map();
function element() {
  return {
    value: "", textContent: "", innerHTML: "", dataset: {}, open: false,
    classList: { toggle() {} },
    replaceChildren() { this.value = ""; },
    appendChild(child) { if (child.selected) this.value = child.value; },
    closest() { return null; },
    reset() {},
    showModal() { this.open = true; },
    close() { this.open = false; }
  };
}
const byId = (id) => {
  if (!elements.has(id)) elements.set(id, element());
  return elements.get(id);
};
const calls = [];
const notices = [];
let serverVersion = 2;
const context = vm.createContext({
  window: { DASHBOARD_CONFIG: { supabaseUrl: "https://test.supabase.co", supabasePublishableKey: "test-only" } },
  document: { getElementById: byId, createElement: element },
  structuredClone, console, setTimeout, clearTimeout,
  // Every request is intercepted; no credentials or production connection are used.
  fetch: async (url, options) => {
    const body = JSON.parse(options.body);
    if (url.endsWith("/get_my_dashboard_access")) {
      return { ok: true, text: async () => JSON.stringify({ event_roles: { ICCAD_2026: "editor" } }) };
    }
    assert.match(url, /\/update_(workstream|stage)_overlay$/);
    calls.push({ url, body });
    const conflict = body.p_expected_version !== serverVersion;
    if (!conflict) serverVersion++;
    return {
      ok: !conflict, status: conflict ? 409 : 200,
      text: async () => JSON.stringify(conflict ? { code: "40001", message: "COLLAB_CONFLICT" } : {})
    };
  }
});

// Expose private consumers only in this VM, without expanding the production API.
const collabSource = read("assets/collaboration.js");
const collabAnchor = "__test: { applyPublicUpdates, effectiveRole, progressForSave }";
assert.ok(collabSource.includes(collabAnchor));
vm.runInContext(collabSource.replace(collabAnchor,
  "__test: { applyPublicUpdates, effectiveRole, progressForSave, state, saveEdit }"), context);
const appSource = read("assets/app.js");
assert.ok(appSource.includes("  init();\n})();"));
vm.runInContext(read("assets/workflow-state.js"), context);
vm.runInContext(appSource.replace("  init();\n})();",
  "  window.__appTest = { state, resolveEditContext, latestCollaborationUpdate, renderHero };\n})();"), context);
vm.runInContext(read("data/ICCAD_2026.js"), context);
const base = context.window.EVENT_DATASETS.ICCAD_2026;
const original = JSON.stringify(base);
const collab = context.window.DashboardCollab;
const app = context.window.__appTest;
const apply = collab.__test.applyPublicUpdates;
const target = base.workstreams.find((item) => item.workstreamId === "ICCAD26-WS-01");
const staged = base.workstreams.find((item) => item.stages?.length);
assert.ok(target && staged);
const stage = staged.stages[0];
const seeded = {
  workstreams: [{ workstream_id: target.workstreamId, version: 2, updated_at: "2099-01-01T00:00:00Z", updated_by_name: "Member",
    status_set: false, progress_set: false, due_date_set: false, owner_set: false, latest_update_set: false, next_action_set: false }],
  stages: [{ workstream_id: staged.workstreamId, stage_id: stage.id, version: 2, updated_at: "2099-01-02T00:00:00Z", updated_by_name: "Member",
    status_set: false, due_date_set: false, owner_set: false, completed_date_set: false }]
};
let overlay = seeded;
app.state.eventId = base.event.eventId;
function reload() { app.state.data = apply(base, overlay); }
reload();
collab.__test.state.session = { access_token: "test-only", refresh_token: "test-only", expires_at: Date.now() / 1000 + 3600 };
collab.__test.state.hooks = {
  resolveEditContext: app.resolveEditContext,
  reloadCurrentEvent: reload,
  showToast: (message) => notices.push(message)
};
const workstreamIdentity = { eventId: base.event.eventId, workstreamId: target.workstreamId, entityType: "workstream" };
const stageIdentity = { eventId: base.event.eventId, workstreamId: staged.workstreamId, stageId: stage.id, entityType: "stage" };

// Exercise the actual refresh -> resolver -> dialog -> save path for both entity types.
for (const identity of [workstreamIdentity, stageIdentity]) {
  serverVersion = 2;
  await collab.requestEdit(identity);
  await collab.__test.saveEdit();
  assert.equal(calls.at(-1).body.p_expected_version, 2, `${identity.entityType}: must send the seeded row's actual version`);
  assert.equal(byId("edit-error").textContent, "", `${identity.entityType}: current version must save without a false conflict`);
  assert.equal(byId("edit-dialog").open, false);
  assert.equal(serverVersion, 3);
}

reload();
assert.equal(JSON.stringify(base), original, "Merging must not mutate the static dataset");
const withoutMetadata = JSON.parse(JSON.stringify(app.state.data));
for (const item of withoutMetadata.workstreams) {
  delete item._collaboration;
  for (const entry of item.stages || []) delete entry._collaboration;
}
assert.equal(JSON.stringify(withoutMetadata), original, "Unset fields must preserve all static data");
assert.equal(app.latestCollaborationUpdate(app.state.data), null);
app.renderHero(base);
const baselineHero = byId("hero-updated").innerHTML;
app.renderHero(app.state.data);
assert.equal(byId("hero-updated").innerHTML, baselineHero, "Seeded timestamps must not appear as user updates");
for (const identity of [workstreamIdentity, stageIdentity]) {
  await collab.requestEdit(identity);
  assert.equal(byId("edit-meta").textContent, "Local baseline · Version 2");
  const metadata = app.resolveEditContext(identity).collaboration;
  assert.equal(metadata.version, 2);
  assert.ok(!metadata.updatedAt && !metadata.updatedBy);
}

// A real concurrent write after opening the dialog must still reject the save.
for (const identity of [workstreamIdentity, stageIdentity]) {
  await collab.requestEdit(identity);
  serverVersion = 3;
  await collab.__test.saveEdit();
  assert.equal(calls.at(-1).body.p_expected_version, 2);
  assert.match(byId("edit-error").textContent, /数据已被其他用户修改/);
  assert.equal(byId("edit-dialog").open, true);
  assert.equal(serverVersion, 3);
}

// Real overrides retain attribution, explicit empty values, flags and latest-update ordering.
const live = structuredClone(seeded);
Object.assign(live.workstreams[0], { version: 4, latest_update_set: true, latest_update: "", updated_at: "2026-11-07T01:00:00Z", updated_by_name: "Test editor" });
Object.assign(live.stages[0], { version: 5, completed_date_set: true, completed_date: "", updated_at: "2026-11-07T02:00:00Z", updated_by_name: "Stage editor" });
overlay = live;
reload();
assert.equal(app.resolveEditContext(workstreamIdentity).latestUpdate, "");
assert.equal(app.resolveEditContext(workstreamIdentity).collaboration.latestUpdateSet, true);
assert.equal(app.resolveEditContext(workstreamIdentity).collaboration.version, 4);
assert.equal(app.resolveEditContext(stageIdentity).collaboration.version, 5);
assert.equal(app.latestCollaborationUpdate(app.state.data).updatedBy, "Stage editor");
app.renderHero(app.state.data);
assert.match(byId("hero-updated").innerHTML, /Live updated.*Stage editor/s);
await collab.requestEdit(stageIdentity);
assert.equal(byId("edit-meta").textContent, "Version 5 · 2026-11-07T02:00:00Z · Stage editor");
const mixed = apply(base, { workstreams: live.workstreams, stages: seeded.stages });
assert.equal(app.latestCollaborationUpdate(mixed).updatedBy, "Test editor", "Newer seed timestamps must not hide real updates");

// Missing overlay rows retain the existing version-1 fallback.
overlay = { workstreams: [], stages: [] };
reload();
for (const identity of [workstreamIdentity, stageIdentity]) assert.equal(app.resolveEditContext(identity).collaboration.version, 1);
assert.equal(notices.filter((message) => message === "保存成功，页面已更新。").length, 2);
console.log("Overlay version checks passed: workstream/stage saves, baseline display, real updates, missing rows and stale conflicts.");
