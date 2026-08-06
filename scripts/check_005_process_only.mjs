import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migration = fs.readFileSync(path.join(root, "supabase", "migrations", "005_odx_process_only.sql"), "utf8");
const required = [
  "insert into public.workstream_updates", "insert into public.stage_updates", "on conflict (event_id, workstream_id) do nothing",
  "on conflict (event_id, workstream_id, stage_id) do nothing", "ODX26-WS-10", "ODX26-WS-11", "ODX26-WS-12", "ODX26-WS-13",
  "report-draft", "final-report", "2026-08-06", "2026-08-14", "2026-08-25", "2026-08-31", "2026-09-03"
];
const prohibited = [/\bupdate\s+public\./i, /\bdelete\s+from\b/i, /\balter\s+table\b/i, /\bcreate\s+table\b/i, /\bgrant\b/i, /\brevoke\b/i, /\bcreate\s+function\b/i, /\bstatus_set\b/i, /\bprogress_set\b/i, /\bupdated_by\b/i];
const failures = required.filter((entry) => !migration.includes(entry)).map((entry) => `Missing required SQL fragment: ${entry}.`);
for (const expression of prohibited) if (expression.test(migration)) failures.push(`Forbidden migration operation: ${expression}.`);
if (failures.length) {
  console.error(`005 migration check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("005 migration check passed: inserts new ODX baseline rows only and leaves existing overlays unchanged.");
