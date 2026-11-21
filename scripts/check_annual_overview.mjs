import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const window = {};
const context = vm.createContext({ window });
for (const path of ["event_data.js", "data/OVERVIEW_2026.js", "assets/annual-overview.js"]) {
  vm.runInContext(fs.readFileSync(new URL("../" + path, import.meta.url), "utf8"), context);
}
const cards = window.ANNUAL_OVERVIEW_2026;
const registry = window.EVENT_INDEX.events;
const overview = window.DashboardAnnualOverview;
assert.equal(overview.routeId, "OVERVIEW_2026");
assert.deepEqual(Array.from(cards, (card) => card.code), ["CFMS", "OCTS", "ODX", "GMIF", "ICCAD", "AUTO", "CIIE"]);
const html = overview.markup(cards, registry);
assert.deepEqual([...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]), ["OCTS_2026", "ODX_2026", "ICCAD_2026"]);
assert.equal((html.match(/活动信息 \/ Info only/g) || []).length, 4);
assert.match(html, /14:40–15:00/);
assert.match(html, /注册人数，非实到人数/);
assert.match(html, /全展累计进场人次/);
assert.match(html, /未见公开到场人数/);
const blocked = overview.markup([{ code: "CFMS", title: "<img>", eventRouteId: "CFMS_2026" }, { code: "Odd", eventRouteId: '"><img>' }], registry);
assert.doesNotMatch(blocked, /href|<img>/);
assert.match(blocked, /&lt;img&gt;/);
console.log("Annual overview: 7 cards, 3 registered detail links, scoped metrics, and escaped text.");

// Boot the actual navigation controller with test DOM elements; stub only the detail renderer.
const source = fs.readFileSync(new URL("../assets/app.js", import.meta.url), "utf8");
const routeHarness = source
  .replace(/  function renderDashboard\(\) \{[\s\S]*?\n  function bindEvents\(\)/, `  function renderDashboard() {
    if (!state.data) return;
    $("annual-overview").hidden = true;
    $("event-detail").hidden = false;
    document.title = state.eventId;
  }
  function bindEvents()`)
  .replace(/  function bindEvents\(\) \{[\s\S]*?\n  async function init\(\)/, "  function bindEvents() {}\n  async function init()")
  .replace("  init();\n})();", "  window.startForTest = init;\n})();");
const elements = new Map();
const eventHandlers = {};
let focused = "";
window.location = { pathname: "/", search: "", hash: "#OVERVIEW_2026" };
window.history = {
  replaceState(a, b, url) { window.location.hash = url.slice(url.indexOf("#")); },
  pushState(a, b, url) { window.location.hash = url.slice(url.indexOf("#")); },
};
window.addEventListener = (event, fn) => { eventHandlers[event] = fn; };
window.DashboardCollab = {
  async init() {},
  subscribe() {},
  setActiveEvent() {},
  async refreshAccess() {},
};
window.EVENT_DATASETS = Object.fromEntries(registry.map(({ eventId, dataKey }) => [dataKey, { event: { eventId, dateStart: "2026-01-01" }, workstreams: [] }]));
context.document = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, { setAttribute() {}, focus() { focused = id; } });
    return elements.get(id);
  }
};
vm.runInContext(routeHarness, context);
await window.startForTest();
assert.match(context.document.title, /^2026 Event Overview/);
assert.equal(context.document.getElementById("event-detail").hidden, true);
for (const eventId of ["OCTS_2026", "ODX_2026", "ICCAD_2026"]) {
  window.location.hash = "#" + eventId;
  await eventHandlers.hashchange();
  assert.equal(context.document.title, eventId);
  assert.equal(context.document.getElementById("event-detail").hidden, false);
  assert.equal(focused, "event-title");
  window.location.hash = "#OVERVIEW_2026";
  await eventHandlers.hashchange();
  assert.equal(focused, "annual-title");
}
// A delayed detail load cannot replace the overview if the user has navigated back.
let finishLoad;
window.DashboardCollab.mergeEventData = (data) => new Promise((done) => { finishLoad = () => done(data); });
window.location.hash = "#OCTS_2026";
const pending = eventHandlers.hashchange();
window.location.hash = "#OVERVIEW_2026";
await eventHandlers.hashchange();
finishLoad();
await pending;
assert.match(context.document.title, /^2026 Event Overview/);
console.log("Annual overview routes: direct entry, all detail links, return focus, and late-response navigation guard.");
