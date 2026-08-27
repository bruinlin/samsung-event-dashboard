import fs from "node:fs";
import vm from "node:vm";

const root = new URL("..", import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), "utf8");
const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const app = read("assets/app.js");
const collaboration = read("assets/collaboration.js");
const odxSource = read("data/ODX_2026.js");
const octsSource = read("data/OCTS_2026.js");
const documentRenderer = app.slice(app.indexOf("function renderFinalDocuments"), app.indexOf("function resolveEditContext"));

expect(!/renderResourceLinks\(resourceLinks\);[\s\S]*?return;/.test(documentRenderer), "Document renderer must not return before rendering PDF records.");
expect(documentRenderer.includes("renderResourceLinks(resourceLinks);") && documentRenderer.includes("const documents = eventDocuments(data);"), "Resource links and document records must render together.");
for (const forbidden of ["create_document_upload", "finalize_document_upload", "uploadDocument", "get_public_event_documents", "document-upload"]) {
  expect(!app.includes(forbidden) && !collaboration.includes(forbidden), `Browser upload code remains: ${forbidden}`);
}
expect(app.includes('if (/^\\d{4}-\\d{2}-\\d{2}$/.test(String(value || ""))) return "";'), "Static YYYY-MM-DD values must bypass timestamp rendering.");
expect(collaboration.includes("get_document_file"), "Existing controlled private document lookup is missing.");
expect(collaboration.includes("/storage/v1/object/sign/"), "Existing short-lived signed document URL flow is missing.");
expect(octsSource.includes('id: "OCTS-DOC-001"') && octsSource.includes('id: "OCTS-DOC-004"'), "Legacy OCTS controlled document metadata is missing.");

const sandbox = { window: { EVENT_DATASETS: {} } };
vm.createContext(sandbox);
vm.runInContext(odxSource, sandbox, { filename: "ODX_2026.js" });
const odx = sandbox.window.EVENT_DATASETS.ODX_2026;
const ws06 = odx.workstreams.find((item) => item.workstreamId === "ODX26-WS-06");
expect(Boolean(ws06), "ODX WS06 is missing.");
expect((odxSource.match(/latestUpdate:/g) || []).length === odx.workstreams.length, "A workstream has duplicate latestUpdate properties.");
expect(ws06?.latestUpdate?.includes("Booth Design V5") && ws06?.latestUpdate?.includes("Physical / technology showcase"), "ODX WS06 latest update did not preserve both confirmed updates.");

if (failures.length) {
  console.error("Private document delivery checks failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log("Private document delivery checks passed.");
