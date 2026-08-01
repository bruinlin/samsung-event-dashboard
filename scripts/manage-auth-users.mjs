/*
 * Local-only Supabase member administration.
 *
 * Setup (never commit the real values):
 *   Copy .env.admin.example to .env.admin.local
 *   Fill SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY locally.
 *
 * Usage:
 *   node scripts/manage-auth-users.mjs create
 *   node scripts/manage-auth-users.mjs reset-password
 *   node scripts/manage-auth-users.mjs set-approval
 *   node scripts/manage-auth-users.mjs assign-role
 *
 * Email addresses and passwords are entered interactively. Password input is
 * not echoed and neither credentials nor API responses are printed.
 */
import { existsSync, readFileSync } from "node:fs";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const root = new URL("../", import.meta.url);
const envPath = new URL(".env.admin.local", root);
const action = process.argv[2] || "";
const actions = new Set(["create", "reset-password", "set-approval", "assign-role"]);

function fail(message) { throw new Error(message); }

function readLocalEnv() {
  if (!existsSync(envPath)) fail("Missing .env.admin.local. Copy .env.admin.example and fill it locally.");
  const values = {};
  for (const rawLine of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    values[key] = value;
  }
  const url = String(values.SUPABASE_URL || "").replace(/\/$/, "");
  const serviceKey = String(values.SUPABASE_SERVICE_ROLE_KEY || "");
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) fail("SUPABASE_URL is invalid.");
  if (!serviceKey || serviceKey.includes("YOUR_")) fail("SUPABASE_SERVICE_ROLE_KEY is missing.");
  return { url, serviceKey };
}

function createPrompt() {
  return readline.createInterface({ input: stdin, output: stdout });
}

async function promptEmail(rl) {
  const email = (await rl.question("Email: ")).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("Enter a valid email address.");
  return email;
}

async function promptYesNo(rl, label) {
  const answer = (await rl.question(`${label} [y/N]: `)).trim().toLowerCase();
  return answer === "y" || answer === "yes";
}

async function promptHidden(label) {
  if (!stdin.isTTY) fail("Password entry requires an interactive terminal.");
  return new Promise((resolve, reject) => {
    let value = "";
    const wasRaw = stdin.isRaw;
    stdout.write(label);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    const cleanup = () => {
      stdin.off("data", onData);
      stdin.setRawMode(Boolean(wasRaw));
      stdout.write("\n");
    };
    const onData = (key) => {
      if (key === "\u0003") {
        cleanup();
        reject(new Error("Cancelled."));
      } else if (key === "\r" || key === "\n") {
        cleanup();
        resolve(value);
      } else if (key === "\u007f" || key === "\b") {
        value = value.slice(0, -1);
      } else {
        value += key;
      }
    };
    stdin.on("data", onData);
  });
}

function createApi({ url, serviceKey }) {
  return async (path, options = {}) => {
    const response = await fetch(`${url}${path}`, {
      ...options,
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
    const text = await response.text();
    let payload = null;
    try { payload = text ? JSON.parse(text) : null; } catch { /* Do not print raw API responses. */ }
    if (!response.ok) {
      const code = String(payload?.code || "").trim();
      const message = String(payload?.message || payload?.msg || "Request failed.").trim().replace(/[\r\n]+/g, " ").slice(0, 240);
      const error = new Error(`HTTP ${response.status}${code ? ` ${code}` : ""}: ${message}`);
      error.status = response.status;
      error.code = code;
      throw error;
    }
    return payload;
  };
}

async function findUser(api, email) {
  for (let page = 1; page <= 10; page += 1) {
    const payload = await api(`/auth/v1/admin/users?page=${page}&per_page=1000`);
    const users = Array.isArray(payload) ? payload : payload?.users || [];
    const match = users.find((user) => String(user.email || "").toLowerCase() === email);
    if (match) return match;
    if (users.length < 1000) break;
  }
  return null;
}

async function setApproval(api, userId, approved) {
  await api(`/rest/v1/profiles?user_id=eq.${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ is_approved: approved, updated_at: new Date().toISOString() })
  });
}

async function promptEventRole(rl, api, userId) {
  const events = await api("/rest/v1/dashboard_events?select=event_id&order=event_id.asc");
  const allowedIds = new Set((events || []).map((event) => event.event_id));
  const requested = (await rl.question(`Event IDs (single, comma-separated, or all; available: ${[...allowedIds].join(", ")}): `)).trim();
  const eventIds = requested.toLowerCase() === "all"
    ? [...allowedIds]
    : [...new Set(requested.split(",").map((value) => value.trim()).filter(Boolean))];
  if (!eventIds.length) fail("Enter at least one Event ID or all.");
  const invalid = eventIds.filter((eventId) => !allowedIds.has(eventId));
  if (invalid.length) fail(`Event ID is not registered: ${invalid.join(", ")}. No roles were changed.`);
  const role = (await rl.question("Role (viewer/editor): ")).trim().toLowerCase();
  if (!new Set(["viewer", "editor"]).has(role)) fail("Role must be viewer or editor.");
  await api("/rest/v1/event_members?on_conflict=event_id,user_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(eventIds.map((eventId) => ({ event_id: eventId, user_id: userId, role })))
  });
  console.log(`Assigned ${role} to ${eventIds.length} event${eventIds.length === 1 ? "" : "s"}:`);
  eventIds.sort((a, b) => a.localeCompare(b)).forEach((eventId) => console.log(`- ${eventId}`));
}

async function createUser(rl, api) {
  const email = await promptEmail(rl);
  const password = await promptHidden("Temporary password: ");
  const confirmed = await promptHidden("Confirm temporary password: ");
  if (!password) fail("Password cannot be empty.");
  if (password !== confirmed) fail("Passwords do not match.");
  const created = await api("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({ email, password, email_confirm: true })
  });
  const userId = created?.id || created?.user?.id;
  if (!userId) fail("User was created but no user ID was returned. Check Supabase Auth Users before retrying.");
  const approved = await promptYesNo(rl, "Approve this user now?");
  await setApproval(api, userId, approved);
  if (approved && await promptYesNo(rl, "Assign an event Viewer or Editor role now?")) {
    await promptEventRole(rl, api, userId);
  }
  console.log("User setup completed.");
}

async function withExistingUser(rl, api, callback) {
  const email = await promptEmail(rl);
  const user = await findUser(api, email);
  if (!user?.id) fail("No matching Auth user was found.");
  await callback(user);
  console.log("Update completed.");
}

async function resetPassword(rl, api) {
  await withExistingUser(rl, api, async (user) => {
    const password = await promptHidden("New temporary password: ");
    const confirmed = await promptHidden("Confirm new temporary password: ");
    if (!password) fail("Password cannot be empty.");
    if (password !== confirmed) fail("Passwords do not match.");
    await api(`/auth/v1/admin/users/${encodeURIComponent(user.id)}`, {
      method: "PUT",
      body: JSON.stringify({ password, email_confirm: true })
    });
  });
}

async function updateApproval(rl, api) {
  await withExistingUser(rl, api, async (user) => {
    const approved = await promptYesNo(rl, "Approve this user?");
    await setApproval(api, user.id, approved);
  });
}

async function assignRole(rl, api) {
  await withExistingUser(rl, api, async (user) => promptEventRole(rl, api, user.id));
}

if (!actions.has(action)) {
  console.log("Usage: node scripts/manage-auth-users.mjs <create|reset-password|set-approval|assign-role>");
  process.exitCode = action ? 1 : 0;
}

if (actions.has(action)) {
  const localConfig = readLocalEnv();
  const rl = createPrompt();
  try {
    const api = createApi(localConfig);
    if (action === "create") await createUser(rl, api);
    if (action === "reset-password") await resetPassword(rl, api);
    if (action === "set-approval") await updateApproval(rl, api);
    if (action === "assign-role") await assignRole(rl, api);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : "Local user-management task failed."}`);
    process.exitCode = 1;
  } finally {
    rl.close();
    await new Promise((resolve) => setImmediate(resolve));
  }
}
