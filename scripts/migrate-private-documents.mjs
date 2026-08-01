/*
 * Uploads the four reviewed OCTS PDFs to the private event-files bucket.
 * Reads the service-role value only from the Git-ignored .env.admin.local file.
 * It never prints credentials, headers, signed URLs, or raw API responses.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const envPath = resolve(root, ".env.admin.local");
const files = [
  ["OCTS-DOC-001", "downloads/OCTS_2026/presentations/OCTS_2026_Main_Forum_Keynote_CN_Final.pdf"],
  ["OCTS-DOC-002", "downloads/OCTS_2026/presentations/OCTS_2026_Main_Forum_Keynote_EN_Final.pdf"],
  ["OCTS-DOC-003", "downloads/OCTS_2026/presentations/OCTS_2026_Main_Forum_Speech_Script_Final.pdf"],
  ["OCTS-DOC-004", "downloads/OCTS_2026/reports/OCTS_2026_Post_Event_Report_Final.pdf"]
].map(([documentId, relativePath]) => ({
  documentId,
  localPath: resolve(root, relativePath),
  fileName: basename(relativePath),
  objectPath: `OCTS_2026/${basename(relativePath)}`
}));

function readEnv() {
  if (!existsSync(envPath)) throw new Error("Missing .env.admin.local.");
  const values = {};
  for (const raw of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index > 0) values[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  const url = String(values.SUPABASE_URL || "").replace(/\/$/, "");
  const serviceKey = String(values.SUPABASE_SERVICE_ROLE_KEY || "");
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url) || !serviceKey || serviceKey.includes("YOUR_")) throw new Error("Local Supabase administrator configuration is incomplete.");
  return { url, serviceKey };
}

function encodedPath(path) { return path.split("/").map(encodeURIComponent).join("/"); }

function makeApi({ url, serviceKey }) {
  return async (path, options = {}) => {
    const response = await fetch(`${url}${path}`, {
      ...options,
      signal: AbortSignal.timeout(30000),
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, ...(options.headers || {}) }
    });
    const text = await response.text();
    let payload = null;
    try { payload = text ? JSON.parse(text) : null; } catch { /* Never print raw responses. */ }
    if (!response.ok) {
      const code = String(payload?.code || "").trim();
      const message = String(payload?.message || payload?.msg || "Request failed.").trim().replace(/[\r\n]+/g, " ").slice(0, 240);
      throw new Error(`HTTP ${response.status}${code ? ` ${code}` : ""}: ${message}`);
    }
    return { response, payload };
  };
}

async function main() {
  const api = makeApi(readEnv());
  for (const file of files) {
    if (!existsSync(file.localPath)) throw new Error(`Source PDF is missing: ${file.fileName}`);
    if (statSync(file.localPath).size < 1) throw new Error(`Source PDF is empty: ${file.fileName}`);
  }

  const mappings = await api("/rest/v1/document_files?event_id=eq.OCTS_2026&select=document_id,bucket_id,object_path,file_name&order=document_id.asc");
  const mappingById = new Map((mappings.payload || []).map((row) => [row.document_id, row]));

  for (const file of files) {
    const mapping = mappingById.get(file.documentId);
    if (!mapping || mapping.bucket_id !== "event-files" || mapping.object_path !== file.objectPath || mapping.file_name !== file.fileName) {
      throw new Error(`Document mapping does not match the private object definition for ${file.documentId}.`);
    }
    const bytes = readFileSync(file.localPath);
    await api(`/storage/v1/object/event-files/${encodedPath(file.objectPath)}`, {
      method: "POST",
      headers: { "Content-Type": "application/pdf", "x-upsert": "true" },
      body: bytes
    });
  }

  const listed = await api("/storage/v1/object/list/event-files", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: "OCTS_2026", limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } })
  });
  const objectByName = new Map((listed.payload || []).map((object) => [object.name, object]));
  const results = [];
  for (const file of files) {
    const object = objectByName.get(file.fileName);
    const metadata = object?.metadata || {};
    const size = Number(metadata.size || metadata.contentLength || 0);
    const mime = String(metadata.mimetype || "").toLowerCase();
    if (size < 1 || mime !== "application/pdf") throw new Error(`Private object verification failed for ${file.fileName}.`);
    const signed = await api(`/storage/v1/object/sign/event-files/${encodedPath(file.objectPath)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 300 })
    });
    const signedPath = signed.payload?.signedURL || signed.payload?.signedUrl || signed.payload?.signed_url;
    if (!signedPath) throw new Error(`Signed URL generation failed for ${file.fileName}.`);
    results.push({ fileName: file.fileName, bytes: size, mime, signedForSeconds: 300 });
  }
  console.log(JSON.stringify({ uploaded: results.length, files: results }, null, 2));
}

main().catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : "Private document migration failed."}`);
  process.exitCode = 1;
});
