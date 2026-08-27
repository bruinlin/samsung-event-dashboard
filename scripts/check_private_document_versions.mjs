import fs from "node:fs";
import vm from "node:vm";

const root = new URL("..", import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), "utf8");
const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const migration = read("supabase/migrations/007_private_document_versions_and_uploads.sql");
const app = read("assets/app.js");
const collaboration = read("assets/collaboration.js");
const odxSource = read("data/ODX_2026.js");

for (const required of [
  "create or replace function public.get_public_event_documents",
  "create or replace function public.create_document_upload",
  "create or replace function public.finalize_document_upload",
  "create or replace function public.get_document_file",
  "create policy event_file_member_download",
  "create policy event_file_editor_upload",
  "revoke all on public.document_files from public, anon, authenticated",
  "grant execute on function public.get_public_event_documents(text) to anon, authenticated",
  "grant execute on function public.create_document_upload",
  "allowed_mime_types = array['application/pdf']"
]) expect(migration.includes(required), `Migration missing: ${required}`);

expect(!/jsonb_build_object\([\s\S]*?'object_path'/.test(migration.slice(
  migration.indexOf("create or replace function public.get_public_event_documents"),
  migration.indexOf("create or replace function public.create_document_upload")
)), "Public document metadata must not expose object_path.");
expect(!/jsonb_build_object\([\s\S]*?'bucket_id'/.test(migration.slice(
  migration.indexOf("create or replace function public.get_public_event_documents"),
  migration.indexOf("create or replace function public.create_document_upload")
)), "Public document metadata must not expose bucket_id.");
expect(!/jsonb_build_object\([\s\S]*?'uploaded_by'/.test(migration.slice(
  migration.indexOf("create or replace function public.get_public_event_documents"),
  migration.indexOf("create or replace function public.create_document_upload")
)), "Public document metadata must not expose uploader identity.");
const documentRenderer = app.slice(app.indexOf("function renderFinalDocuments"), app.indexOf("function openDocumentUpload"));
expect(!/renderResourceLinks\(resourceLinks\);[\s\S]*?return;/.test(documentRenderer), "Document renderer must not return before rendering PDF records.");
expect(documentRenderer.includes("renderResourceLinks(resourceLinks);") && documentRenderer.includes("const documents = eventDocuments(data);"), "Resource links and document records must render together.");
expect(collaboration.includes('"x-upsert": "false"'), "Uploads must not overwrite an existing private object.");
expect(collaboration.includes("get_public_event_documents"), "Runtime document metadata RPC is not connected.");
expect(collaboration.includes("create_document_upload"), "Upload creation RPC is not connected.");
expect(collaboration.includes("finalize_document_upload"), "Upload finalization RPC is not connected.");

const sandbox = { window: { EVENT_DATASETS: {} } };
vm.createContext(sandbox);
vm.runInContext(odxSource, sandbox, { filename: "ODX_2026.js" });
const odx = sandbox.window.EVENT_DATASETS.ODX_2026;
const ws06 = odx.workstreams.find((item) => item.workstreamId === "ODX26-WS-06");
expect(Boolean(ws06), "ODX WS06 is missing.");
expect((odxSource.match(/latestUpdate:/g) || []).length === odx.workstreams.length, "A workstream has duplicate latestUpdate properties.");
expect(ws06?.latestUpdate?.includes("Booth Design V5") && ws06?.latestUpdate?.includes("Physical / technology showcase"), "ODX WS06 latest update did not preserve both confirmed updates.");

if (failures.length) {
  console.error("Private document version checks failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log("Private document version checks passed.");
