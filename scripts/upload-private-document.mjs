/*
 * Trusted local-only private PDF uploader.
 * Requires .env.admin.local; never run it in a browser or commit its environment file.
 * Add the safe document card to data/<EVENT_ID>.js first, then run this script.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";
import vm from "node:vm";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const envPath = resolve(root, ".env.admin.local");
const MAX_PDF_BYTES = 52428800;
const args = new Map(process.argv.slice(2).map((value) => {
  const [key, ...rest] = value.replace(/^--/, "").split("=");
  return [key, rest.join("=")];
}));

function fail(message) { throw new Error(message); }

function readEnv() {
  if (!existsSync(envPath)) fail("Missing .env.admin.local.");
  const values = {};
  for (const raw of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index > 0) values[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  const url = String(values.SUPABASE_URL || "").replace(/\/$/, "");
  const serviceKey = String(values.SUPABASE_SERVICE_ROLE_KEY || "");
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url) || !serviceKey || serviceKey.includes("YOUR_")) {
    fail("Local Supabase administrator configuration is incomplete.");
  }
  return { url, serviceKey };
}

function readRegisteredEvents() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(readFileSync(resolve(root, "event_data.js"), "utf8"), context, { filename: "event_data.js" });
  return context.window.EVENT_INDEX?.events || [];
}

function readEventDataset(event) {
  const context = { window: { EVENT_DATASETS: {} } };
  vm.createContext(context);
  const file = String(event.dataFile || "").split("?")[0];
  vm.runInContext(readFileSync(resolve(root, file), "utf8"), context, { filename: file });
  return context.window.EVENT_DATASETS?.[event.dataKey] || null;
}

function encodedPath(value) {
  return String(value).split("/").map(encodeURIComponent).join("/");
}

function makeApi({ url, serviceKey }) {
  return async (path, options = {}) => {
    const response = await fetch(`${url}${path}`, {
      ...options,
      signal: AbortSignal.timeout(30000),
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, ...(options.headers || {}) }
    });
    const text = await response.text();
    let payload = null;
    try { payload = text ? JSON.parse(text) : null; } catch { /* Do not print raw private responses. */ }
    if (!response.ok) {
      const code = String(payload?.code || "").trim();
      const message = String(payload?.message || payload?.msg || "Request failed.").replace(/[\r\n]+/g, " ").slice(0, 240);
      fail(`HTTP ${response.status}${code ? ` ${code}` : ""}: ${message}`);
    }
    return payload;
  };
}

async function privateObjectExists({ url, serviceKey }, objectPath) {
  const separator = objectPath.lastIndexOf("/");
  const folderPrefix = separator >= 0 ? objectPath.slice(0, separator + 1) : "";
  const targetName = basename(objectPath);
  const response = await fetch(`${url}/storage/v1/object/list/event-files`, {
    method: "POST",
    signal: AbortSignal.timeout(30000),
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: folderPrefix, limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } })
  });
  const text = await response.text();
  let payload = null;
  try { payload = text ? JSON.parse(text) : null; } catch { /* Do not print raw private responses. */ }
  if (!response.ok) fail(`Private object existence check failed (HTTP ${response.status}).`);
  return Array.isArray(payload) && payload.some((item) => item?.name === targetName || item?.name === objectPath);
}

async function privateObjectMatches({ url, serviceKey }, objectPath, localBytes) {
  const response = await fetch(`${url}/storage/v1/object/event-files/${encodedPath(objectPath)}`, {
    method: "GET",
    signal: AbortSignal.timeout(30000),
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
  });
  if (!response.ok) fail(`Private object content verification failed (HTTP ${response.status}).`);
  const remoteBytes = Buffer.from(await response.arrayBuffer());
  const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
  return remoteBytes.length === localBytes.length && hash(remoteBytes) === hash(localBytes);
}

async function main() {
  const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (name, label, fallback = "") => {
    const provided = String(args.get(name) || "").trim();
    if (provided) return provided;
    const suffix = fallback ? ` [${fallback}]` : "";
    const answer = (await prompt.question(`${label}${suffix}: `)).trim();
    return answer || fallback;
  };
  try {
    const events = readRegisteredEvents();
    const eventId = await ask("event-id", `Event ID (${events.map((event) => event.eventId).join(", ")})`);
    const event = events.find((item) => item.eventId === eventId);
    if (!event) fail("Event ID is not registered.");
    const sourcePath = resolve(root, await ask("file", "Local PDF path"));
    const documentId = await ask("document-id", "Document ID");
    const logicalDocumentId = await ask("logical-document-id", "Logical document ID", documentId);
    const nameCN = await ask("name-cn", "Chinese display name");
    const nameEN = await ask("name-en", "English display name");
    const category = await ask("category", "Category");
    const subcategory = await ask("subcategory", "Subcategory", "");
    const version = await ask("version", "Version label");
    const lifecycle = await ask("lifecycle", "Lifecycle (Preview or Final)", "Preview");
    prompt.close();

    if (!/^[A-Za-z0-9_-]{1,160}$/.test(documentId) || !/^[A-Za-z0-9_-]{1,160}$/.test(logicalDocumentId)) fail("Document IDs may contain only letters, digits, underscores and hyphens.");
    if (!/^(Preview|Final)$/.test(lifecycle)) fail("Lifecycle must be Preview or Final.");
    if (!nameCN || !category || !version) fail("Chinese name, category and version are required.");
    if (!existsSync(sourcePath) || !/\.pdf$/i.test(sourcePath)) fail("Local file must be an existing .pdf file.");
    const size = statSync(sourcePath).size;
    if (size < 1 || size > MAX_PDF_BYTES) fail("PDF size must be greater than 0 and no more than 50 MB.");
    const pdfBytes = readFileSync(sourcePath);
    if (pdfBytes.subarray(0, 5).toString("ascii") !== "%PDF-") fail("The selected file does not have a valid PDF signature.");

    const dataset = readEventDataset(event);
    const safeRecord = (dataset?.finalDocuments || []).find((item) => item.id === documentId);
    if (!safeRecord) fail(`Add a safe finalDocuments record with id ${documentId} to ${event.dataFile.split("?")[0]} before uploading.`);
    const recordLifecycle = safeRecord.lifecycle || (String(safeRecord.version || "").toLowerCase().includes("final") ? "Final" : "Preview");
    if (safeRecord.logicalDocumentId && safeRecord.logicalDocumentId !== logicalDocumentId) fail("logicalDocumentId must match the public-safe metadata record.");
    if (safeRecord.nameZh !== nameCN || String(safeRecord.nameEn || "") !== nameEN || safeRecord.category !== category || String(safeRecord.subcategory || "") !== subcategory || safeRecord.version !== version || recordLifecycle !== lifecycle) {
      fail("Prompted metadata must exactly match the public-safe finalDocuments record.");
    }
    if (safeRecord.fileSizeBytes !== size || safeRecord.downloadable !== true) {
      fail("The public-safe finalDocuments record must contain the exact fileSizeBytes and downloadable: true before upload.");
    }

    const objectPath = `${eventId}/${documentId}.pdf`;
    const localConfig = readEnv();
    const api = makeApi(localConfig);
    const existingDocument = await api(`/rest/v1/document_files?event_id=eq.${encodeURIComponent(eventId)}&document_id=eq.${encodeURIComponent(documentId)}&select=document_id`);
    if (Array.isArray(existingDocument) && existingDocument.length) fail("Document ID already exists; use a new version ID.");
    const existingPath = await api(`/rest/v1/document_files?bucket_id=eq.event-files&object_path=eq.${encodeURIComponent(objectPath)}&select=document_id`);
    if (Array.isArray(existingPath) && existingPath.length) fail("Private object path is already registered; use a new document ID.");
    const existingObject = await privateObjectExists(localConfig, objectPath);
    const resumeExisting = args.get("resume-existing") === "true";
    if (existingObject && !resumeExisting) fail("Private object path already exists; use a new document ID.");
    if (existingObject && resumeExisting && !(await privateObjectMatches(localConfig, objectPath, pdfBytes))) {
      fail("Existing private object does not match the selected PDF; it was not registered.");
    }

    if (!existingObject) {
      await api(`/storage/v1/object/event-files/${encodedPath(objectPath)}`, {
        method: "POST",
        headers: { "Content-Type": "application/pdf", "x-upsert": "false" },
        body: pdfBytes
      });
      if (!(await privateObjectExists(localConfig, objectPath))) fail("Private object verification failed after upload.");
      if (!(await privateObjectMatches(localConfig, objectPath, pdfBytes))) fail("Private object content verification failed after upload.");
    }
    await api("/rest/v1/document_files", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ event_id: eventId, document_id: documentId, bucket_id: "event-files", object_path: objectPath, file_name: basename(sourcePath) })
    });
    const signed = await api(`/storage/v1/object/sign/event-files/${encodedPath(objectPath)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 300 })
    });
    if (!(signed?.signedURL || signed?.signedUrl || signed?.signed_url)) fail("Signed URL verification failed.");
    console.log(JSON.stringify({ uploaded: true, eventId, documentId, logicalDocumentId, lifecycle, bytes: size, signedForSeconds: 300 }, null, 2));
  } finally {
    prompt.close();
  }
}

main().catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : "Private document upload failed."}`);
  process.exitCode = 1;
});
