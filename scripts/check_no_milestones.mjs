import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targets = [
  "index.html", "event_data.js", "README.md", "assets/app.js", "assets/style.css", "assets/collaboration.js",
  "data/OCTS_2026.js", "data/ODX_2026.js", "data/ICCAD_2026.js", "supabase/README.md", "supabase/seed_dashboard.sql",
  "supabase/migrations/001_collaboration_v1.sql", "supabase/migrations/002_public_dashboard_overlay_v1.sql",
  "supabase/migrations/003_collaboration_v1_6_status_and_notes.sql", "supabase/migrations/004_progress_and_private_documents.sql",
  "supabase/migrations/005_odx_process_only.sql", "scripts/check_collaboration.mjs", "scripts/check_005_process_only.mjs"
];
// Check deprecated model identifiers, not ordinary prose such as a contract-signing milestone.
const deprecatedModelReference = /(?:\bmilestones?\s*:|["']milestones?["']\s*:|\bcalendarType\s*:\s*["']milestone|\bcalendar_type\s*=\s*["']milestone)/i;
const failures = [];

for (const relativePath of targets) {
  const content = fs.readFileSync(path.join(root, relativePath), "utf8");
  if (deprecatedModelReference.test(content)) failures.push(`${relativePath}: found a deprecated milestone model reference.`);
}

for (const eventId of ["OCTS_2026", "ODX_2026", "ICCAD_2026"]) {
  const dataPath = path.join(root, "data", `${eventId}.js`);
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(dataPath, "utf8"), context, { filename: dataPath });
  if (Object.prototype.hasOwnProperty.call(context.window.EVENT_DATASETS?.[eventId] || {}, "milestones")) failures.push(`${eventId}: deprecated milestones data property exists.`);
}

if (failures.length) {
  console.error(`Process-Only check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("Process-Only check passed: no runtime, data, documentation, SQL or production-check milestone references.");
