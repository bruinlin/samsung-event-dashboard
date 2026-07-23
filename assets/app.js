(function () {
  "use strict";

  const VALID_STATUSES = [
    "Not Started", "In Progress", "Internal Review", "HQ Review",
    "Pending Approval", "Confirmed", "In Production", "Completed",
    "Blocked", "Needs Update", "Not Applicable"
  ];

  const STATUS_STYLE = {
    "Not Started": ["Not Started", "grey"],
    "In Progress": ["In Progress", "blue"],
    "Internal Review": ["Internal Review", "purple"],
    "HQ Review": ["HQ Review", "purple"],
    "Pending Approval": ["Pending Approval", "amber"],
    "Confirmed": ["Confirmed", "blue"],
    "In Production": ["In Production", "blue"],
    "Completed": ["Completed", "green"],
    "Blocked": ["Blocked", "red"],
    "Needs Update": ["Needs Update", "grey"],
    "Not Applicable": ["Not Applicable", "grey"]
  };

  const STATUS_COUNT_LABELS = {
    "Not Started": "未开始",
    "In Progress": "进行中",
    "Internal Review": "内部审核",
    "HQ Review": "总部审核",
    "Pending Approval": "待批准",
    "Confirmed": "已确认",
    "In Production": "制作中",
    "Completed": "已完成",
    "Blocked": "被阻塞",
    "Needs Update": "待补充",
    "Not Applicable": "不适用"
  };

  const DOCUMENT_STYLE = {
    Confirmed: ["Confirmed", "green"],
    "Needs Update": ["Needs Update", "grey"]
  };

  const QUICK_FILTERS = [
    { id: "all", label: "全部模块" },
    { id: "completed", label: "已完成" },
    { id: "in_progress", label: "进行中" },
    { id: "needs_update", label: "待补充" },
    { id: "confirmed", label: "已确认" }
  ];

  const FINAL_DOCUMENT_CATEGORIES = [
    { id: "all", label: "All / 全部" },
    { id: "Presentation", label: "Presentation / 演讲材料" },
    { id: "Report", label: "Report / 报告" },
    { id: "Photos", label: "Photos / 照片" },
    { id: "Other", label: "Other / 其他" }
  ];

  const state = {
    data: null,
    eventId: "",
    quickFilter: "all",
    status: "all",
    owner: "all",
    hideCompleted: false,
    documentCategory: "all"
  };

  const $ = (id) => document.getElementById(id);

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(value) {
    if (!value) return "待补充";
    const parts = String(value).split("-");
    if (parts.length !== 3) return escapeHtml(value);
    return `${parts[0]}.${parts[1]}.${parts[2]}`;
  }

  function badge(label, className) {
    return `<span class="badge ${escapeHtml(className)}">${escapeHtml(label)}</span>`;
  }

  function statusBadge(value) {
    const item = STATUS_STYLE[value] || [value || "待补充", "grey"];
    return badge(item[0], item[1]);
  }

  function safeText(value, fallback = "待补充") {
    const clean = String(value ?? "").trim();
    return escapeHtml(clean || fallback);
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 3600);
  }

  function loadScript(file) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = file;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`无法读取活动数据文件：${file}`));
      document.head.appendChild(script);
    });
  }

  async function loadEvent(eventId) {
    const registry = window.EVENT_INDEX?.events || [];
    const item = registry.find((event) => event.eventId === eventId);
    if (!item) throw new Error(`活动未登记：${eventId}`);

    window.EVENT_DATASETS = window.EVENT_DATASETS || {};
    if (!window.EVENT_DATASETS[item.dataKey]) await loadScript(item.dataFile);

    const data = window.EVENT_DATASETS[item.dataKey];
    if (!data) throw new Error(`数据文件未注册 window.EVENT_DATASETS.${item.dataKey}`);

    state.data = data;
    state.eventId = eventId;
    state.quickFilter = "all";
    state.status = "all";
    state.owner = "all";
    state.hideCompleted = false;
    state.documentCategory = "all";
    window.location.hash = eventId;
    renderDashboard();
  }

  function assessedWorkstreams(workstreams) {
    return workstreams.filter((item) =>
      item.status !== "Not Applicable" &&
      item.status !== "Needs Update"
    );
  }

  function metrics(data) {
    const workstreams = data.workstreams || [];
    const assessed = assessedWorkstreams(workstreams);
    const completed = assessed.filter((item) => item.status === "Completed").length;
    const workstreamCompletion = assessed.length ? Math.round((completed / assessed.length) * 100) : 0;

    return { assessed: assessed.length, completed, workstreamCompletion };
  }

  function renderHero(data) {
    const event = data.event;
    document.title = `${event.shortName} · Samsung Event Dashboard`;
    $("event-title").textContent = event.nameCN;
    $("event-subtitle").textContent = `${event.nameEN} · ${event.eventId}`;
    $("hero-meta").innerHTML = [
      `<span>日期 <b>${formatDate(event.dateStart)}</b></span>`,
      `<span>地点 <b>${safeText(event.city)} · ${safeText(event.venue)}</b></span>`,
      `<span>类型 <b>${safeText(event.eventType)}</b></span>`
    ].join("");
    $("hero-status").innerHTML = statusBadge(event.overallStatus);
    $("hero-updated").innerHTML = `Last updated <b>${formatDate(data.meta.lastUpdated)}</b><br>Updated by <b>${safeText(data.meta.updatedBy)}</b>`;

    const resultMetrics = event.overallStatus === "Completed" && Array.isArray(event.resultMetrics)
      ? event.resultMetrics
      : [];
    $("hero-results").hidden = resultMetrics.length === 0;
    $("hero-results").innerHTML = resultMetrics.map((item) => `
      <div class="hero-result-item">
        <div class="hero-result-label">${safeText(item.label)}</div>
        <div class="hero-result-value">${safeText(item.value)}</div>
        ${item.note ? `<div class="hero-result-note">${safeText(item.note, "")}</div>` : ""}
      </div>
    `).join("");
  }

  function renderMetrics(data) {
    const m = metrics(data);
    const cards = [
      ["Event Status", STATUS_STYLE[data.event.overallStatus]?.[0] || data.event.overallStatus, "活动执行状态"],
      ["Workstream Completion", `${m.workstreamCompletion}%`, `${m.completed}/${m.assessed} 个可评估模块完成`],
      ["Main Speaker", data.keynote.speaker.split("/")[0].trim(), "Main Forum"],
      ["Location", data.event.city, data.event.venue],
      ["Report Status", data.event.reportStatus, data.event.nextMilestone]
    ];
    $("metric-grid").innerHTML = cards.map((card) => `
      <article class="metric-card">
        <div class="metric-label">${safeText(card[0])}</div>
        <div class="metric-value">${safeText(card[1])}</div>
        <div class="metric-note">${safeText(card[2])}</div>
      </article>
    `).join("");
  }

  function renderOverview(data) {
    const event = data.event;
    const keynote = data.keynote;
    const theme = [event.themeCN, event.themeEN].filter(Boolean).join(" / ");
    const items = [
      ["Date / 日期", formatDate(event.dateStart)],
      ["Location / 地点", `${event.city} · ${event.venue}`],
      ["Event Type / 类型", event.eventType],
      ...(theme ? [["Event Theme / 大会主题", theme]] : []),
      ["Main Speaker / 主讲人", keynote.speaker],
      ["Speaker Title / 职务", keynote.title],
      ["English Topic / 英文主题", keynote.topicEN],
      ["Chinese Topic / 中文主题", keynote.topicCN],
      ["Showcased Products / 展出产品", Array.isArray(event.showcasedProducts) ? event.showcasedProducts.join(" / ") : event.showcasedProducts]
    ];
    $("overview-grid").innerHTML = items.map((item) => `
      <div class="overview-item">
        <div class="overview-key">${safeText(item[0])}</div>
        <div class="overview-value">${safeText(item[1])}</div>
      </div>
    `).join("");
    $("current-summary").textContent = event.currentSummary;
  }

  function renderControls(data) {
    const registry = window.EVENT_INDEX?.events || [];
    $("event-select").innerHTML = registry.map((item) =>
      `<option value="${escapeHtml(item.eventId)}" ${item.eventId === state.eventId ? "selected" : ""}>${safeText(item.label)}</option>`
    ).join("");

    const usedStatuses = VALID_STATUSES.filter((status) => data.workstreams.some((item) => item.status === status));
    $("status-select").innerHTML = `<option value="all">全部状态</option>` + usedStatuses.map((status) =>
      `<option value="${escapeHtml(status)}">${escapeHtml(status)}</option>`
    ).join("");

    const owners = [...new Set(data.workstreams.map((item) => item.owner || "待补充"))].sort((a, b) => a.localeCompare(b, "zh-CN"));
    $("owner-select").innerHTML = `<option value="all">全部负责人</option>` + owners.map((owner) =>
      `<option value="${escapeHtml(owner)}">${safeText(owner)}</option>`
    ).join("");

    $("hide-completed").checked = false;
    $("quick-filters").innerHTML = QUICK_FILTERS.map((item) =>
      `<button type="button" class="filter-chip ${item.id === state.quickFilter ? "active" : ""}" data-filter="${item.id}">${item.label}</button>`
    ).join("");
  }

  function renderStatusCounts(data) {
    const counts = (data.workstreams || []).reduce((result, item) => {
      const status = VALID_STATUSES.includes(item.status) ? item.status : "Needs Update";
      result[status] = (result[status] || 0) + 1;
      return result;
    }, {});

    const statuses = Object.keys(counts).sort((a, b) => {
      const countDifference = counts[b] - counts[a];
      return countDifference || VALID_STATUSES.indexOf(a) - VALID_STATUSES.indexOf(b);
    });

    $("status-counts").innerHTML = statuses.map((status) => {
      const styleClass = STATUS_STYLE[status]?.[1] || "grey";
      return `
        <div class="status-count-item ${escapeHtml(styleClass)}">
          <span class="status-count-number">${counts[status]}</span>
          <span class="status-count-copy">
            <b>${safeText(STATUS_COUNT_LABELS[status] || status)}</b>
            <small>${escapeHtml(status)}</small>
          </span>
        </div>`;
    }).join("");
  }

  function matchesQuickFilter(item) {
    if (state.quickFilter === "all") return true;
    if (state.quickFilter === "completed") return item.status === "Completed";
    if (state.quickFilter === "in_progress") {
      return !["Completed", "Needs Update", "Not Applicable"].includes(item.status);
    }
    if (state.quickFilter === "needs_update") return item.status === "Needs Update";
    if (state.quickFilter === "confirmed") return item.status === "Confirmed";
    return true;
  }

  function filteredWorkstreams() {
    return state.data.workstreams.filter((item) => {
      if (!matchesQuickFilter(item)) return false;
      if (state.status !== "all" && item.status !== state.status) return false;
      if (state.owner !== "all" && (item.owner || "待补充") !== state.owner) return false;
      if (state.hideCompleted && item.status === "Completed") return false;
      return true;
    });
  }

  function progressCell(item) {
    if (item.progress === null || item.progress === undefined || item.status === "Needs Update" || item.status === "Not Applicable") {
      return `<span class="progress-value">—</span><div class="muted">不计入 0%</div>`;
    }
    const value = Math.max(0, Math.min(100, Number(item.progress)));
    return `<span class="progress-value">${value}%</span><div class="progress-track"><span style="width:${value}%"></span></div>`;
  }

  function renderWorkstreams() {
    const rows = filteredWorkstreams();
    $("workstream-empty").hidden = rows.length !== 0;
    $("workstream-body").innerHTML = rows.map((item) => {
      const id = escapeHtml(item.workstreamId);
      const detail = String(item.remarks ?? item.comments ?? "").trim();
      const detailButton = detail
        ? `<button class="detail-button" type="button" data-detail-id="${id}" aria-expanded="false" aria-label="查看 ${safeText(item.nameCN)} 详情">＋</button>`
        : "";
      const detailRow = detail
        ? `<tr class="detail-row" data-detail-row="${id}" hidden>
            <td colspan="7">
              <div class="detail-panel">
                <div class="detail-item"><div class="detail-label">Remarks / Comments</div><div class="detail-value">${escapeHtml(detail)}</div></div>
              </div>
            </td>
          </tr>`
        : "";
      return `
        <tr class="data-row">
          <td>
            <div class="workstream-name">${safeText(item.nameCN)}</div>
            <div class="workstream-en">${safeText(item.nameEN)}</div>
            <div class="workstream-id">${id}</div>
          </td>
          <td>${statusBadge(item.status)}</td>
          <td>${progressCell(item)}</td>
          <td>
            <div class="date-stack"><span>${safeText(item.owner)}</span></div>
            <div class="date-stack" style="margin-top:7px"><b>截止</b><span>${formatDate(item.dueDate)}</span></div>
          </td>
          <td>${safeText(item.latestUpdate)}</td>
          <td>${safeText(item.nextAction)}</td>
          <td class="no-print">${detailButton}</td>
        </tr>
        ${detailRow}`;
    }).join("");
  }

  function renderSessions(data) {
    $("sessions-grid").innerHTML = data.sessions.map((session) => `
      <article class="session-card">
        <div class="session-top">
          <div>
            <div class="session-type">${safeText(session.type)} · ${safeText(session.time)}</div>
            <div class="session-speaker">${safeText(session.speaker)}</div>
            <div class="session-role">${safeText(session.role)}</div>
          </div>
          ${statusBadge(session.status)}
        </div>
        <div class="session-topic"><b>${safeText(session.topicEN)}</b><br>${safeText(session.topicCN)}</div>
        ${session.comments || session.remarks ? `<div class="session-note">${safeText(session.comments || session.remarks, "")}</div>` : ""}
      </article>
    `).join("");
  }

  function renderMilestones(data) {
    const milestones = [...data.milestones].sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
    $("timeline").innerHTML = milestones.map((item) => {
      const dotClass = item.status === "Needs Update" ? "grey" : "";
      return `
        <div class="timeline-item">
          <span class="timeline-dot ${dotClass}"></span>
          <div class="timeline-date">${formatDate(item.date)}</div>
          <div class="timeline-title">${safeText(item.titleCN)}</div>
          ${statusBadge(item.status)}
          ${item.comments || item.remarks ? `<div class="timeline-note">${safeText(item.comments || item.remarks, "")}</div>` : ""}
        </div>`;
    }).join("");
  }

  function finalDocumentHref(item) {
    const path = String(item.filePath || "").trim();
    const isSafeRelativePath = path &&
      !/^[a-z][a-z0-9+.-]*:/i.test(path) &&
      !path.startsWith("/") &&
      !path.includes("\\") &&
      !/(^|\/)\.\.(\/|$)/.test(path);
    return item.downloadable === true && item.status === "Available" && isSafeRelativePath ? path : "";
  }

  function renderFinalDocuments(data) {
    const documents = Array.isArray(data.finalDocuments) ? data.finalDocuments : [];
    const filtered = state.documentCategory === "all"
      ? documents
      : documents.filter((item) => item.category === state.documentCategory);
    const presentationCount = documents.filter((item) => item.category === "Presentation").length;
    const reportCount = documents.filter((item) => item.category === "Report").length;
    const downloadableCount = documents.filter((item) => finalDocumentHref(item)).length;

    $("final-document-filters").innerHTML = FINAL_DOCUMENT_CATEGORIES.map((item) =>
      `<button type="button" class="filter-chip ${item.id === state.documentCategory ? "active" : ""}" data-document-category="${escapeHtml(item.id)}">${safeText(item.label)}</button>`
    ).join("");

    $("final-document-stats").innerHTML = [
      ["File Records", documents.length],
      ["Downloads", downloadableCount],
      ["Presentations", presentationCount],
      ["Reports", reportCount]
    ].map(([label, value]) => `
      <div class="final-stat">
        <span>${safeText(label)}</span>
        <b>${safeText(value)}</b>
      </div>`).join("");

    $("final-document-empty").hidden = filtered.length !== 0;
    $("final-document-list").innerHTML = filtered.map((item) => {
      const href = finalDocumentHref(item);
      const fileName = href
        ? `<a class="final-document-name" href="${escapeHtml(href)}" download target="_blank" rel="noopener">${safeText(item.nameZh)}</a>`
        : `<div class="final-document-name">${safeText(item.nameZh)}</div>`;
      const action = href
        ? `<a class="download-button" href="${escapeHtml(href)}" download target="_blank" rel="noopener">Download / 下载</a>`
        : `<span class="download-button unavailable" aria-disabled="true">Status only / 仅状态</span>`;
      return `
        <article class="final-document-card">
          <div class="final-document-content">
            <div class="final-document-labels">
              ${badge(item.category, "blue")}
              ${badge(item.version, "grey")}
              ${badge(item.status, item.status === "Available" ? "green" : "grey")}
            </div>
            ${fileName}
            <div class="final-document-name-en">${safeText(item.nameEn)}</div>
            <div class="final-document-meta">
              <span>${safeText(item.subcategory)}</span>
              <span>${formatDate(item.finalDate)}</span>
              <span>${safeText(item.format)}</span>
              <span>${safeText(item.fileSize)}</span>
            </div>
            <p class="final-document-description">${safeText(item.descriptionZh)} · ${safeText(item.descriptionEn)}</p>
            ${item.speaker ? `<div class="final-document-speaker">Speaker: ${safeText(item.speaker)}</div>` : ""}
          </div>
          <div class="final-document-action">${action}</div>
        </article>`;
    }).join("");
  }

  function renderDashboard() {
    const data = state.data;
    renderHero(data);
    renderMetrics(data);
    renderOverview(data);
    renderControls(data);
    renderStatusCounts(data);
    renderWorkstreams();
    renderSessions(data);
    renderMilestones(data);
    renderFinalDocuments(data);
    $("footer-event-id").textContent = `${data.event.eventId} · Schema ${data.meta.schemaVersion}`;
  }

  function bindEvents() {
    $("event-select").addEventListener("change", async (event) => {
      try { await loadEvent(event.target.value); }
      catch (error) { showToast(error.message); }
    });

    $("status-select").addEventListener("change", (event) => {
      state.status = event.target.value;
      renderWorkstreams();
    });

    $("owner-select").addEventListener("change", (event) => {
      state.owner = event.target.value;
      renderWorkstreams();
    });

    $("hide-completed").addEventListener("change", (event) => {
      state.hideCompleted = event.target.checked;
      renderWorkstreams();
    });

    $("quick-filters").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      state.quickFilter = button.dataset.filter;
      $("quick-filters").querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
      renderWorkstreams();
    });

    $("final-document-filters").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-document-category]");
      if (!button) return;
      state.documentCategory = button.dataset.documentCategory;
      renderFinalDocuments(state.data);
    });

    $("workstream-body").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-detail-id]");
      if (!button) return;
      const row = document.querySelector(`[data-detail-row="${CSS.escape(button.dataset.detailId)}"]`);
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      button.textContent = expanded ? "＋" : "−";
      row.hidden = expanded;
    });

    $("print-button").addEventListener("click", () => window.print());
  }

  async function init() {
    const registry = window.EVENT_INDEX;
    if (!registry?.events?.length) {
      showToast("event_index.js 中没有登记活动。");
      return;
    }
    bindEvents();
    const hashId = window.location.hash.replace(/^#/, "");
    const initial = registry.events.some((item) => item.eventId === hashId) ? hashId : registry.defaultEventId;
    try { await loadEvent(initial); }
    catch (error) {
      console.error(error);
      showToast(error.message);
    }
  }

  init();
})();
