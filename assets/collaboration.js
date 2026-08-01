(function () {
  "use strict";

  const SESSION_KEY = "samsung-event-dashboard.supabase-session.v1";
  const AUTH_RETURN_EVENT_KEY = "samsung-event-dashboard.auth-return-event.v1";
  const PRODUCTION_REDIRECT_URL = "https://bruinlin.github.io/samsung-event-dashboard/";
  const LOCAL_REDIRECT_URL = "http://localhost:3000/";
  const WORKSTREAM_STATUSES = ["Planning", "In Progress", "Under Review", "Completed", "Blocked"];
  const STAGE_STATUSES = ["Planning", "In Progress", "Under Review", "Completed", "Blocked"];
  const config = window.DASHBOARD_CONFIG || {};
  const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(String(config.supabaseUrl || "")) &&
    Boolean(config.supabasePublishableKey) &&
    !String(config.supabaseUrl).includes("YOUR_PROJECT") &&
    !String(config.supabasePublishableKey).includes("YOUR_SUPABASE");

  const state = {
    configured,
    connection: configured ? "connecting" : "local",
    session: null,
    access: { globalRole: "", eventRoles: {} },
    activeEventId: "",
    hooks: {},
    pendingAction: null,
    realtime: null,
    realtimeTimer: null,
    realtimeHeartbeat: null,
    editContext: null
  };

  const byId = (id) => document.getElementById(id);
  const cloneData = (value) => typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

  function notify(message) {
    if (typeof state.hooks.showToast === "function") state.hooks.showToast(message);
  }

  function baseHeaders(authenticated = false) {
    const token = authenticated && state.session?.access_token
      ? state.session.access_token
      : config.supabasePublishableKey;
    return {
      apikey: config.supabasePublishableKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }

  async function request(path, options = {}, authenticated = false) {
    if (!configured) throw new Error("Supabase connection is not configured.");
    if (authenticated) await ensureFreshSession();
    const response = await fetch(`${String(config.supabaseUrl).replace(/\/$/, "")}${path}`, {
      ...options,
      headers: { ...baseHeaders(authenticated), ...(options.headers || {}) }
    });
    const text = await response.text();
    let payload = null;
    try { payload = text ? JSON.parse(text) : null; }
    catch { payload = text; }
    if (!response.ok) {
      const message = payload?.message || payload?.msg || payload?.error_description || payload?.error || `Request failed (${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      error.code = payload?.code || "";
      throw error;
    }
    return payload;
  }

  function rpc(name, body, authenticated = false) {
    return request(`/rest/v1/rpc/${encodeURIComponent(name)}`, {
      method: "POST",
      body: JSON.stringify(body || {})
    }, authenticated);
  }

  function saveSession(session) {
    state.session = session || null;
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }

  function restoreSession() {
    try {
      const stored = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (stored?.access_token && stored?.refresh_token) state.session = stored;
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  function authRedirectUrl() {
    const origin = String(window.location.origin || "");
    if (origin === "https://bruinlin.github.io") return PRODUCTION_REDIRECT_URL;
    if (origin === "http://localhost:3000") return LOCAL_REDIRECT_URL;
    throw new Error("Open the Dashboard through the production URL or http://localhost:3000 before requesting an email sign-in link.");
  }

  function rememberReturnEvent() {
    const hash = String(window.location.hash || "");
    if (/^#[A-Za-z0-9_-]+$/.test(hash)) sessionStorage.setItem(AUTH_RETURN_EVENT_KEY, hash);
    else sessionStorage.removeItem(AUTH_RETURN_EVENT_KEY);
  }

  function consumeAuthCallback() {
    const fragment = new URLSearchParams(String(window.location.hash || "").replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search || "");
    const error = fragment.get("error_description") || query.get("error_description") || "";
    const accessToken = fragment.get("access_token");
    const refreshToken = fragment.get("refresh_token");
    const returnHash = sessionStorage.getItem(AUTH_RETURN_EVENT_KEY) || "";

    if (accessToken && refreshToken) {
      saveSession(normalizeSession({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: fragment.get("expires_in"),
        token_type: fragment.get("token_type")
      }));
      sessionStorage.removeItem(AUTH_RETURN_EVENT_KEY);
      window.history.replaceState(null, "", `${window.location.pathname}${returnHash}`);
      return { success: true, error: "" };
    }
    if (error) {
      window.history.replaceState(null, "", `${window.location.pathname}${returnHash}`);
      return { success: false, error };
    }
    return { success: false, error: "" };
  }

  async function ensureFreshSession() {
    if (!state.session?.refresh_token) throw new Error("Please sign in first.");
    const expiresAt = Number(state.session.expires_at || 0) * 1000;
    if (expiresAt && expiresAt - Date.now() > 60000) return state.session;
    const refreshed = await request("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      body: JSON.stringify({ refresh_token: state.session.refresh_token })
    }, false);
    const session = normalizeSession(refreshed);
    saveSession(session);
    return session;
  }

  function normalizeSession(payload) {
    const expiresIn = Number(payload?.expires_in || 3600);
    return {
      access_token: payload?.access_token || "",
      refresh_token: payload?.refresh_token || "",
      token_type: payload?.token_type || "bearer",
      expires_at: payload?.expires_at || Math.floor(Date.now() / 1000) + expiresIn,
      user: payload?.user || state.session?.user || null
    };
  }

  async function loadAccess() {
    if (!state.session?.access_token) {
      state.access = { globalRole: "", eventRoles: {} };
      renderAccess();
      return state.access;
    }
    try {
      const result = await rpc("get_my_dashboard_access", {}, true);
      state.access = {
        globalRole: result?.global_role || "",
        eventRoles: result?.event_roles || {}
      };
    } catch (error) {
      if (error.status === 401) saveSession(null);
      state.access = { globalRole: "", eventRoles: {} };
    }
    renderAccess();
    return state.access;
  }

  function effectiveRole(eventId) {
    if (!state.session) return "guest";
    if (state.access.globalRole === "admin") return "admin";
    return state.access.eventRoles?.[eventId] || "authenticated";
  }

  function canDownload(eventId) {
    return ["viewer", "editor", "admin"].includes(effectiveRole(eventId));
  }

  function canEdit(eventId) {
    return ["editor", "admin"].includes(effectiveRole(eventId));
  }

  function renderAccess() {
    const role = effectiveRole(state.activeEventId);
    const authState = byId("auth-state");
    const authButton = byId("auth-button");
    const passwordButton = byId("change-password-button");
    const mode = byId("collaboration-mode");
    if (!authState || !authButton || !mode) return;
    const email = state.session?.user?.email || "";
    authState.textContent = role === "guest" ? "Public viewer" : role === "authenticated" ? "Read only" : role;
    authState.dataset.role = role;
    authButton.textContent = state.session ? "Sign out" : "Sign in";
    authButton.dataset.authAction = state.session ? "sign-out" : "sign-in";
    if (passwordButton) passwordButton.hidden = !state.session;
    mode.textContent = !configured
      ? "Local data · Read only"
      : state.connection === "online"
        ? `Live collaboration${email ? ` · ${email}` : ""}`
        : state.connection === "degraded"
          ? "Local data · Save unavailable"
          : "Connecting…";
    mode.dataset.connection = state.connection;
    if (!configured) mode.textContent = "Public baseline · Read only";
    else if (state.connection === "online") mode.textContent = `Live dashboard${email ? ` · ${email}` : ""}`;
    else if (state.connection === "degraded") mode.textContent = "Public baseline · Overlay unavailable";
  }

  function refreshAccessUi() {
    if (typeof state.hooks.refreshAccessUi === "function") state.hooks.refreshAccessUi();
  }

  function applyPublicUpdates(baseData, overlay) {
    const data = cloneData(baseData);
    const workstreams = new Map((data.workstreams || []).map((item) => [item.workstreamId, item]));
    (overlay?.workstreams || []).forEach((row) => {
      const item = workstreams.get(row.workstream_id);
      if (!item) return;
      if (row.status_set) item.status = row.status;
      if (row.progress_set) item.progress = Math.max(0, Math.min(100, Math.trunc(Number(row.progress)) || 0));
      if (row.due_date_set) item.dueDate = row.due_date || "";
      if (row.owner_set) item.owner = row.owner || "";
      if (row.latest_update_set) item.latestUpdate = row.latest_update || "";
      if (row.next_action_set) item.nextAction = row.next_action || "";
      item._collaboration = {
        version: Number(row.version || 1),
        updatedAt: row.updated_at || "",
        updatedBy: row.updated_by_name || "",
        latestUpdateSet: Boolean(row.latest_update_set),
        nextActionSet: Boolean(row.next_action_set),
        progressSet: Boolean(row.progress_set)
      };
    });
    (overlay?.stages || []).forEach((row) => {
      const item = workstreams.get(row.workstream_id);
      const stage = item?.stages?.find((entry) => entry.id === row.stage_id);
      if (!stage) return;
      if (row.status_set) stage.status = row.status;
      if (row.due_date_set) stage.dueDate = row.due_date || "";
      if (row.owner_set) stage.owner = row.owner || "";
      if (row.completed_date_set) stage.completedDate = row.completed_date || "";
      stage._collaboration = {
        version: Number(row.version || 1),
        updatedAt: row.updated_at || "",
        updatedBy: row.updated_by_name || ""
      };
    });
    return data;
  }

  async function mergeEventData(baseData) {
    if (!configured) {
      state.connection = "local";
      renderAccess();
      return cloneData(baseData);
    }
    try {
      const overlay = await rpc("get_public_dashboard_updates", { p_event_id: baseData.event.eventId }, false);
      state.connection = "online";
      renderAccess();
      return applyPublicUpdates(baseData, overlay || {});
    } catch (error) {
      console.warn("Collaborative updates unavailable; using local read-only data.", error.message);
      state.connection = "degraded";
      renderAccess();
      return cloneData(baseData);
    }
  }

  function openAuthDialog(message = "") {
    const dialog = byId("auth-dialog");
    if (!dialog) return;
    byId("auth-error").textContent = message;
    byId("auth-password-step").hidden = false;
    byId("auth-magic-link-legacy").hidden = true;
    if (!configured) byId("auth-error").textContent = "Supabase尚未配置，当前只能以Guest只读方式使用。";
    dialog.showModal();
  }

  function closeDialog(dialog) {
    if (dialog?.open) dialog.close();
  }

  async function sendOtp(email) {
    rememberReturnEvent();
    if (!configured) throw new Error("Supabase尚未配置。");
    const redirectTo = authRedirectUrl();
    await request(`/auth/v1/otp?redirect_to=${encodeURIComponent(redirectTo)}`, {
      method: "POST",
      body: JSON.stringify({
        email,
        create_user: false
      })
    }, false);
  }

  async function verifyOtp(email, token) {
    const payload = await request("/auth/v1/verify", {
      method: "POST",
      body: JSON.stringify({ email, token, type: "email" })
    }, false);
    await completeSignIn(payload, "登录成功。权限已更新。");
  }

  async function signInWithPassword(email, password) {
    if (!configured) throw new Error("Supabase尚未配置。");
    const payload = await request("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }, false);
    await completeSignIn(payload, "登录成功。权限已更新。");
  }

  async function completeSignIn(payload, message) {
    saveSession(normalizeSession(payload));
    await loadAccess();
    state.connection = "online";
    renderAccess();
    refreshAccessUi();
    closeDialog(byId("auth-dialog"));
    notify(message);
    await runPendingAction();
    if (state.activeEventId) subscribe(state.activeEventId);
  }

  function openPasswordDialog() {
    if (!state.session) {
      openAuthDialog("请先登录后修改密码。");
      return;
    }
    byId("password-error").textContent = "";
    byId("new-password").value = "";
    byId("confirm-password").value = "";
    byId("password-dialog").showModal();
  }

  async function updatePassword(newPassword, confirmedPassword) {
    if (!state.session) throw new Error("请先登录。");
    if (!newPassword) throw new Error("请输入新密码。");
    if (newPassword !== confirmedPassword) throw new Error("两次输入的新密码不一致。");
    await request("/auth/v1/user", {
      method: "PUT",
      body: JSON.stringify({ password: newPassword })
    }, true);
    closeDialog(byId("password-dialog"));
    notify("密码已更新。旧密码已失效。");
  }

  async function signOut() {
    try {
      if (configured && state.session?.access_token) {
        await request("/auth/v1/logout", { method: "POST" }, true);
      }
    } catch (error) {
      console.warn("Remote sign-out did not complete.", error.message);
    }
    saveSession(null);
    state.access = { globalRole: "", eventRoles: {} };
    state.pendingAction = null;
    stopRealtime();
    closeDialog(byId("password-dialog"));
    renderAccess();
    refreshAccessUi();
    notify("已退出登录。当前为Guest只读模式。");
  }

  async function runPendingAction() {
    const pending = state.pendingAction;
    state.pendingAction = null;
    if (!pending) return;
    if (pending.kind === "edit") requestEdit(pending.context);
    if (pending.kind === "download") requestDownload(pending.eventId, pending.document);
  }

  function requireRole(kind, eventId, pending) {
    if (!state.session) {
      state.pendingAction = pending;
      openAuthDialog(kind === "download" ? "请先登录后下载受控文件。" : "请先登录后编辑项目数据。");
      return false;
    }
    if (kind === "download" && !canDownload(eventId)) {
      notify("当前账号未列入该活动成员名单，不能下载文件。");
      return false;
    }
    if (kind === "edit" && !canEdit(eventId)) {
      notify(effectiveRole(eventId) === "viewer" ? "Viewer仅可查看和下载，不能编辑。" : "当前账号没有该活动的编辑权限。");
      return false;
    }
    return true;
  }

  function fillSelect(select, values, current) {
    select.replaceChildren();
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      option.selected = value === current;
      select.appendChild(option);
    });
  }

  function normalizeProgress(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) ? Math.max(0, Math.min(100, parsed)) : 0;
  }

  function syncProgressControl(status) {
    const input = byId("edit-progress");
    const note = byId("edit-progress-note");
    if (!input || input.closest("[hidden]")) return;
    if (status === "Planning") {
      input.value = "0";
      input.disabled = true;
      note.textContent = "Planning is always 0%.";
    } else if (status === "Completed") {
      input.value = "100";
      input.disabled = true;
      note.textContent = "Completed is always 100%.";
    } else {
      input.disabled = false;
      input.value = String(normalizeProgress(input.value));
      note.textContent = "Enter an integer from 0 to 100.";
    }
  }

  function requestEdit(context) {
    if (!requireRole("edit", context.eventId, { kind: "edit", context })) return;
    state.editContext = context;
    const dialog = byId("edit-dialog");
    const isStage = context.entityType === "stage";
    const statusLocked = context.entityType === "workstream" && context.hasStages;
    byId("edit-dialog-title").textContent = isStage ? "Edit Stage / 编辑阶段" : "Edit Workstream / 编辑任务";
    byId("edit-entity-name").textContent = [context.workstreamName, context.stageName].filter(Boolean).join(" · ");
    fillSelect(byId("edit-status"), isStage ? STAGE_STATUSES : WORKSTREAM_STATUSES, context.status || "Planning");
    byId("edit-status").disabled = statusLocked;
    byId("edit-status-note").hidden = !statusLocked;
    byId("edit-progress-field").hidden = isStage;
    if (!isStage) {
      byId("edit-progress").value = String(normalizeProgress(context.progress));
      syncProgressControl(context.status || "Planning");
    }
    byId("edit-ddl").value = context.dueDate || "";
    byId("edit-owner").value = context.owner || "";
    byId("edit-latest-update-field").hidden = isStage;
    byId("edit-next-action-field").hidden = isStage;
    if (!isStage) {
      byId("edit-latest-update").value = context.latestUpdate || "";
      byId("edit-next-action").value = context.nextAction || "";
    }
    const ownerList = byId("owner-options");
    ownerList.replaceChildren();
    (context.ownerOptions || []).forEach((owner) => {
      const option = document.createElement("option");
      option.value = owner;
      ownerList.appendChild(option);
    });
    const meta = context.collaboration || {};
    byId("edit-meta").textContent = meta.updatedAt
      ? `Version ${meta.version || 1} · ${meta.updatedAt}${meta.updatedBy ? ` · ${meta.updatedBy}` : ""}`
      : `Local baseline · Version ${meta.version || 1}`;
    byId("edit-error").textContent = "";
    dialog.showModal();
  }

  async function saveEdit() {
    const context = state.editContext;
    if (!context || !canEdit(context.eventId)) return;
    const saveButton = byId("edit-save");
    const errorBox = byId("edit-error");
    saveButton.disabled = true;
    saveButton.textContent = "Saving…";
    errorBox.textContent = "";
    const status = byId("edit-status").value;
    const progressInput = byId("edit-progress");
    const rawProgress = context.entityType === "workstream" ? progressInput.value.trim() : "0";
    if (context.entityType === "workstream" && !/^\d+$/.test(rawProgress)) {
      setEditError("Progress must be a whole number from 0 to 100.");
      return;
    }
    const progress = context.entityType === "workstream" ? normalizeProgress(rawProgress) : 0;
    const dueDate = byId("edit-ddl").value.trim();
    const owner = byId("edit-owner").value.trim();
    const latestUpdate = context.entityType === "workstream" ? byId("edit-latest-update").value.trim() : "";
    const nextAction = context.entityType === "workstream" ? byId("edit-next-action").value.trim() : "";
    try {
      if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) throw new Error("DDL必须使用YYYY-MM-DD格式。");
      const common = {
        p_event_id: context.eventId,
        p_workstream_id: context.workstreamId,
        p_expected_version: Number(context.collaboration?.version || 1),
        p_status: status,
        p_due_date: dueDate || null,
        p_owner: owner || null,
        p_status_set: !(context.entityType === "workstream" && context.hasStages),
        p_due_date_set: true,
        p_owner_set: true
      };
      if (context.entityType === "stage") {
        await rpc("update_stage_overlay", { ...common, p_stage_id: context.stageId }, true);
      } else {
        await rpc("update_workstream_overlay", {
          ...common,
          p_progress: progress,
          p_latest_update: latestUpdate,
          p_next_action: nextAction,
          p_progress_set: true,
          p_latest_update_set: true,
          p_next_action_set: true
        }, true);
      }
      closeDialog(byId("edit-dialog"));
      notify("保存成功，页面已更新。");
      if (typeof state.hooks.reloadCurrentEvent === "function") await state.hooks.reloadCurrentEvent();
    } catch (error) {
      const conflict = error.code === "40001" || /COLLAB_CONFLICT|conflict/i.test(error.message);
      errorBox.textContent = conflict
        ? "数据已被其他用户修改。请关闭窗口、刷新后重新确认。"
        : `保存失败：${error.message}`;
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = "Save / 保存";
    }
  }

  async function requestDownload(eventId, documentRecord) {
    if (!requireRole("download", eventId, { kind: "download", eventId, document: documentRecord })) return;
    if (!configured) {
      notify("Supabase Private Storage尚未配置，受控下载不可用。");
      return;
    }
    try {
      const file = await rpc("get_document_file", {
        p_event_id: eventId,
        p_document_id: documentRecord.id
      }, true);
      if (!file?.bucket_id || !file?.object_path) throw new Error("该文件尚未迁移到Private Storage。");
      const encodedPath = file.object_path.split("/").map(encodeURIComponent).join("/");
      const signed = await request(`/storage/v1/object/sign/${encodeURIComponent(file.bucket_id)}/${encodedPath}`, {
        method: "POST",
        body: JSON.stringify({ expiresIn: Number(config.signedUrlExpiresIn || 300) })
      }, true);
      const path = signed?.signedURL || signed?.signedUrl || signed?.signed_url;
      if (!path) throw new Error("未能生成下载链接。");
      const projectUrl = String(config.supabaseUrl).replace(/\/$/, "");
      const href = /^https?:\/\//i.test(path)
        ? path
        : path.startsWith("/storage/v1/")
          ? `${projectUrl}${path}`
          : `${projectUrl}/storage/v1${path.startsWith("/") ? path : `/${path}`}`;
      const anchor = window.document.createElement("a");
      anchor.href = href;
      anchor.rel = "noopener";
      anchor.target = "_blank";
      anchor.download = documentRecord.fileName || file.file_name || "";
      window.document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      notify(`已生成${Number(config.signedUrlExpiresIn || 300) / 60}分钟有效的下载链接。`);
    } catch (error) {
      notify(`下载失败：${error.message}`);
    }
  }

  function stopRealtime() {
    if (state.realtimeHeartbeat) window.clearInterval(state.realtimeHeartbeat);
    if (state.realtimeTimer) window.clearTimeout(state.realtimeTimer);
    state.realtimeHeartbeat = null;
    state.realtimeTimer = null;
    if (state.realtime) {
      state.realtime.onclose = null;
      state.realtime.close();
    }
    state.realtime = null;
  }

  function scheduleRealtimeRefresh() {
    window.clearTimeout(state.realtimeTimer);
    state.realtimeTimer = window.setTimeout(() => {
      if (typeof state.hooks.reloadCurrentEvent === "function") state.hooks.reloadCurrentEvent();
    }, 350);
  }

  async function subscribe(eventId) {
    stopRealtime();
    state.activeEventId = eventId;
    renderAccess();
    if (!configured || config.enableRealtime === false || !state.session?.access_token || !canDownload(eventId)) return;
    try { await ensureFreshSession(); }
    catch { return; }
    if (state.activeEventId !== eventId) return;
    const base = String(config.supabaseUrl).replace(/^http/i, "ws").replace(/\/$/, "");
    const socket = new WebSocket(`${base}/realtime/v1/websocket?apikey=${encodeURIComponent(config.supabasePublishableKey)}&vsn=2.0.0`);
    state.realtime = socket;
    let ref = 1;
    const topic = `realtime:dashboard-${eventId}`;
    socket.addEventListener("open", () => {
      socket.send(JSON.stringify([String(ref), String(ref++), topic, "phx_join", {
        config: {
          broadcast: { ack: false, self: false },
          presence: { enabled: false },
          postgres_changes: [
            { event: "*", schema: "public", table: "workstream_updates", filter: `event_id=eq.${eventId}` },
            { event: "*", schema: "public", table: "stage_updates", filter: `event_id=eq.${eventId}` }
          ],
          private: false
        },
        access_token: state.session.access_token
      }]));
      state.realtimeHeartbeat = window.setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify([null, String(ref++), "phoenix", "heartbeat", {}]));
      }, 25000);
    });
    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message?.[3] === "postgres_changes") scheduleRealtimeRefresh();
      } catch { /* Ignore non-JSON protocol noise. */ }
    });
    socket.addEventListener("close", () => {
      if (state.session && state.activeEventId === eventId) {
        state.realtimeTimer = window.setTimeout(() => subscribe(eventId), 5000);
      }
    });
    socket.addEventListener("error", () => {
      console.warn("Realtime unavailable; REST saves remain available and the channel will reconnect.");
    });
  }

  function bindUi() {
    byId("auth-button")?.addEventListener("click", () => {
      if (state.session) signOut();
      else openAuthDialog();
    });
    byId("auth-close")?.addEventListener("click", () => closeDialog(byId("auth-dialog")));
    byId("change-password-button")?.addEventListener("click", openPasswordDialog);
    byId("password-close")?.addEventListener("click", () => closeDialog(byId("password-dialog")));
    byId("password-cancel")?.addEventListener("click", () => closeDialog(byId("password-dialog")));
    byId("edit-cancel")?.addEventListener("click", () => closeDialog(byId("edit-dialog")));
    byId("auth-password-form")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = byId("auth-email").value.trim();
      const password = byId("auth-password").value;
      const submit = byId("auth-sign-in-password");
      byId("auth-error").textContent = "";
      submit.disabled = true;
      submit.textContent = "Signing in…";
      try {
        await signInWithPassword(email, password);
      } catch (error) {
        byId("auth-error").textContent = error.status === 400 || /invalid login credentials/i.test(error.message)
          ? "Invalid email or password."
          : "Sign-in is unavailable. Please try again.";
      } finally {
        submit.disabled = false;
        submit.textContent = "Sign in / 登录";
      }
    });
    byId("password-form")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submit = byId("password-save");
      submit.disabled = true;
      submit.textContent = "Updating…";
      byId("password-error").textContent = "";
      try {
        await updatePassword(byId("new-password").value, byId("confirm-password").value);
      } catch (error) {
        byId("password-error").textContent = error.message;
      } finally {
        submit.disabled = false;
        submit.textContent = "Update Password / 更新密码";
      }
    });
    byId("auth-otp-form")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submit = byId("auth-verify-otp");
      submit.disabled = true;
      submit.textContent = "Verifying…";
      byId("auth-error").textContent = "";
      try {
        await verifyOtp(byId("auth-email").value.trim(), byId("auth-otp").value.trim());
      } catch (error) {
        byId("auth-error").textContent = error.message;
      } finally {
        submit.disabled = false;
        submit.textContent = "Verify / 登录";
      }
    });
    byId("edit-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      saveEdit();
    });
    byId("edit-status")?.addEventListener("change", () => {
      if (state.editContext?.entityType === "workstream") syncProgressControl(byId("edit-status").value);
    });
  }

  async function init(hooks = {}) {
    state.hooks = hooks;
    bindUi();
    const authCallback = consumeAuthCallback();
    restoreSession();
    if (configured && state.session) {
      try {
        await ensureFreshSession();
        await loadAccess();
        state.connection = "online";
      } catch {
        saveSession(null);
        state.access = { globalRole: "", eventRoles: {} };
        state.connection = "degraded";
      }
    }
    renderAccess();
    if (authCallback.success) {
      notify("Signed in through email link. Access has been refreshed.");
      refreshAccessUi();
    } else if (authCallback.error) {
      openAuthDialog(authCallback.error);
    }
    return { configured, authenticated: Boolean(state.session) };
  }

  window.DashboardCollab = {
    init,
    mergeEventData,
    requestEdit,
    requestDownload,
    subscribe,
    effectiveRole,
    canEdit,
    canDownload,
    getState: () => ({
      configured: state.configured,
      connection: state.connection,
      authenticated: Boolean(state.session),
      role: effectiveRole(state.activeEventId),
      activeEventId: state.activeEventId
    }),
    __test: { applyPublicUpdates, effectiveRole }
  };
})();
