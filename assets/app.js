(function () {
  "use strict";

  const VALID_STATUSES = [
    "Not Started", "In Progress", "Internal Review", "HQ Review",
    "Pending Approval", "Pending Review", "Confirmed", "In Production", "Completed",
    "Blocked", "Needs Update", "Not Applicable"
  ];

  const STATUS_STYLE = {
    "Not Started": ["Not Started", "grey"],
    "In Progress": ["In Progress", "blue"],
    "Internal Review": ["Internal Review", "purple"],
    "HQ Review": ["HQ Review", "purple"],
    "Pending Approval": ["Pending Approval", "amber"],
    "Pending Review": ["Pending Review", "amber"],
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
    "Pending Review": "待复审",
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

  const CALENDAR_CATEGORIES = [
    { id: "all", label: "All Categories" },
    { id: "business-commercial", label: "Business & Commercial" },
    { id: "event-operations-content", label: "Event Operations & Content" },
    { id: "social-pr-reporting", label: "Social, PR & Reporting" }
  ];

  const CALENDAR_TYPES = [
    { id: "task", label: "Task DDL" },
    { id: "stage", label: "Stage DDL" },
    { id: "milestone", label: "Milestone" }
  ];

  const state = {
    data: null,
    eventId: "",
    quickFilter: "all",
    status: "all",
    owner: "all",
    hideCompleted: false,
    documentCategory: "all",
    collapsedCategories: new Set(),
    calendarView: "fortnight",
    calendarMonth: null,
    calendarFortnightStart: "",
    calendarFiltersOpen: false,
    calendarLaterExpanded: false,
    calendarCategory: "all",
    calendarOwner: "all",
    calendarActiveOnly: true,
    calendarIncludeCompleted: false,
    calendarTypes: new Set(CALENDAR_TYPES.map((item) => item.id)),
    calendarSelectedDate: "",
    calendarItems: [],
    calendarValidationSignature: "",
    attentionItems: []
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

  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
    const [year, month, day] = String(value).split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  function formatDeadline(value) {
    if (!value) return "Missing DDL";
    return isValidDate(value) ? formatDate(value) : "Invalid DDL";
  }

  function dateFromIso(value) {
    const [year, month, day] = String(value).split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function isoFromDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function todayIso() {
    const now = new Date();
    return isoFromDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  function addDays(isoDate, days) {
    const date = dateFromIso(isoDate);
    date.setDate(date.getDate() + days);
    return isoFromDate(date);
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

  function eventCountdown(dateStart) {
    if (!isValidDate(dateStart)) return "TBD";
    const days = Math.round((dateFromIso(dateStart) - dateFromIso(todayIso())) / 86400000);
    if (days > 0) return `${days} days / ${days} 天`;
    if (days === 0) return "Event Day / 活动日";
    return `Event started ${Math.abs(days)} days ago / 活动已开始 ${Math.abs(days)} 天`;
  }

  function safeExternalHref(value) {
    const href = String(value || "").trim();
    return /^https:\/\//i.test(href) ? href : "";
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

  function cloneEventData(data) {
    return typeof structuredClone === "function"
      ? structuredClone(data)
      : JSON.parse(JSON.stringify(data));
  }

  async function mergeCollaborativeData(baseData) {
    return window.DashboardCollab?.mergeEventData
      ? window.DashboardCollab.mergeEventData(baseData)
      : cloneEventData(baseData);
  }

  async function reloadCurrentEvent() {
    const registry = window.EVENT_INDEX?.events || [];
    const item = registry.find((event) => event.eventId === state.eventId);
    const source = item ? window.EVENT_DATASETS?.[item.dataKey] : null;
    if (!source) return;
    state.data = await mergeCollaborativeData(cloneEventData(source));
    renderDashboard();
  }

  async function loadEvent(eventId, { historyMode = "push" } = {}) {
    const registry = window.EVENT_INDEX?.events || [];
    const item = registry.find((event) => event.eventId === eventId);
    if (!item) throw new Error(`活动未登记：${eventId}`);

    window.EVENT_DATASETS = window.EVENT_DATASETS || {};
    if (!window.EVENT_DATASETS[item.dataKey]) await loadScript(item.dataFile);

    const source = window.EVENT_DATASETS[item.dataKey];
    if (!source) throw new Error(`数据文件未注册 window.EVENT_DATASETS.${item.dataKey}`);
    const data = await mergeCollaborativeData(cloneEventData(source));

    state.data = data;
    state.eventId = eventId;
    state.quickFilter = "all";
    state.status = "all";
    state.owner = "all";
    state.hideCompleted = false;
    state.documentCategory = "all";
    state.collapsedCategories = new Set();
    state.calendarView = "fortnight";
    state.calendarMonth = defaultCalendarMonth(data);
    state.calendarFortnightStart = todayIso();
    state.calendarFiltersOpen = false;
    state.calendarLaterExpanded = false;
    state.calendarCategory = "all";
    state.calendarOwner = "all";
    state.calendarActiveOnly = true;
    state.calendarIncludeCompleted = false;
    state.calendarTypes = new Set(CALENDAR_TYPES.map((item) => item.id));
    state.calendarSelectedDate = "";
    state.calendarItems = [];
    state.calendarValidationSignature = "";
    if (window.location.hash !== `#${eventId}`) {
      const nextUrl = `${window.location.pathname}${window.location.search}#${eventId}`;
      if (historyMode === "replace") window.history.replaceState(null, "", nextUrl);
      else if (historyMode === "push") window.history.pushState(null, "", nextUrl);
    }
    renderDashboard();
    window.DashboardCollab?.subscribe?.(eventId);
  }

  function stagesFor(item) {
    return Array.isArray(item.stages) && item.stages.length ? item.stages : [];
  }

  function defaultCalendarMonth(data) {
    const deadlines = [];
    (data.workstreams || []).forEach((item) => {
      if (isCompletedStatus(workstreamStatus(item))) return;
      if (isValidDate(item.dueDate)) deadlines.push(item.dueDate);
      stagesFor(item).forEach((stage) => {
        if (stage.status !== "Completed" && isValidDate(stage.dueDate)) deadlines.push(stage.dueDate);
      });
    });
    const fallback = isValidDate(data.event?.dateStart) ? data.event.dateStart : todayIso();
    const selected = deadlines.sort((a, b) => a.localeCompare(b))[0] || fallback;
    const date = dateFromIso(selected);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function defaultEventId(events) {
    const dated = events.filter((event) => isValidDate(event.dateStart));
    const incomplete = dated.filter((event) => event.overallStatus !== "Completed");
    const today = todayIso();
    const upcoming = incomplete.filter((event) => event.dateStart >= today).sort((a, b) => a.dateStart.localeCompare(b.dateStart));
    if (upcoming.length) return upcoming[0].eventId;
    if (incomplete.length) return [...incomplete].sort((a, b) => b.dateStart.localeCompare(a.dateStart))[0].eventId;
    if (dated.length) return [...dated].sort((a, b) => b.dateStart.localeCompare(a.dateStart))[0].eventId;
    return events[0]?.eventId || "";
  }

  function currentStageFor(item) {
    const stages = stagesFor(item);
    if (!stages.length) return null;
    const configured = stages.find((stage) => stage.id === item.currentStageId);
    if (configured) return configured;
    return stages.find((stage) => stage.status !== "Completed") || stages[stages.length - 1];
  }

  function workstreamStatus(item) {
    const stages = stagesFor(item);
    if (!stages.length) return item.status;
    if (stages.some((stage) => stage.status === "Blocked")) return "Blocked";
    const currentStage = currentStageFor(item);
    if (currentStage?.status === "Pending Review" || stages.some((stage) => stage.status === "Pending Review")) return "Pending Review";
    const completed = stages.filter((stage) => stage.status === "Completed").length;
    if (completed === stages.length) return "Completed";
    if (completed === 0 && stages.every((stage) => stage.status === "Not Started")) return "Not Started";
    return "In Progress";
  }

  function workstreamProgress(item) {
    const stages = stagesFor(item);
    if (!stages.length) return item.progress;
    return Math.round((stages.filter((stage) => stage.status === "Completed").length / stages.length) * 100);
  }

  function assessedWorkstreams(workstreams) {
    return workstreams.filter((item) =>
      workstreamStatus(item) !== "Not Applicable" &&
      workstreamStatus(item) !== "Needs Update"
    );
  }

  function participationSummary(event) {
    const forms = Array.isArray(event.participationForms)
      ? event.participationForms.filter(Boolean)
      : String(event.participationForms || "").split(/[·/]/).map((item) => item.trim()).filter(Boolean);
    return [String(event.sponsorshipLevel || "").trim(), forms.join(" · ")].filter(Boolean).join(" · ");
  }

  function renderHero(data) {
    const event = data.event;
    const eventDate = isValidDate(event.dateEnd) && event.dateEnd !== event.dateStart
      ? `${event.dateStart} – ${event.dateEnd}`
      : (isValidDate(event.dateStart) ? event.dateStart : formatDate(event.dateStart));
    document.title = `${event.shortName} · Samsung Event Dashboard`;
    $("event-title").textContent = event.nameCN;
    $("event-subtitle").textContent = `${event.nameEN} · ${event.eventId}`;
    const themeCN = String(event.themeCN || "").trim();
    const themeEN = String(event.themeEN || "").trim();
    const website = safeExternalHref(event.officialWebsite);
    const participation = event.showParticipationInHero ? participationSummary(event) : "";
    $("hero-theme").hidden = !themeCN && !themeEN;
    $("hero-theme").innerHTML = `${themeCN ? `<b>${safeText(themeCN)}</b>` : ""}${themeEN ? `<small>${safeText(themeEN)}</small>` : ""}`;
    $("hero-meta").innerHTML = [
      `<span>日期 <b>${eventDate}</b></span>`,
      `<span>地点 <b>${safeText(event.city)} · ${safeText(event.venue)}</b></span>`,
      event.eventType ? `<span>类型 <b>${safeText(event.eventType)}</b></span>` : "",
      participation ? `<span class="hero-participation"><span class="hero-meta-label">Participation / 参与方式</span><b>${safeText(participation)}</b></span>` : "",
      event.showEventCountdown ? `<span>Event Countdown <b>${safeText(eventCountdown(event.dateStart))}</b></span>` : "",
      website ? `<span><a href="${escapeHtml(website)}" target="_blank" rel="noopener noreferrer">Official Website / 官方网站</a></span>` : ""
    ].filter(Boolean).join("");
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

  function renderOverview(data) {
    const event = data.event;
    const keynote = data.keynote || {};
    const topicCN = String(keynote.topicCN || "").trim();
    const topicEN = String(keynote.topicEN || "").trim();
    const topicENMarkup = topicEN && (topicEN !== topicCN || keynote.showFieldLabels) ? `<div class="overview-topic-en"><span>English Topic</span>${safeText(topicEN)}</div>` : "";
    const keynoteDate = isValidDate(keynote.date) ? keynote.date : "";
    const keynoteTime = String(keynote.time || "").trim().replace(/-/g, "–");
    const keynoteSchedule = [keynoteDate, keynoteTime].filter(Boolean).join(" · ");
    const boothParts = [event.boothArea, event.boothNumber ? `Booth No. ${event.boothNumber}` : ""].filter(Boolean);
    const products = Array.isArray(event.showcasedProducts) ? event.showcasedProducts.filter(Boolean).join(" · ") : String(event.showcasedProducts || "").trim();
    const presentationLabelEN = String(keynote.labelEN || "Main Forum Keynote").trim();
    const presentationLabelCN = String(keynote.labelCN || "主论坛演讲").trim();
    const presenterMarkup = keynote.showFieldLabels
      ? `<span><small>Presenter</small><b>${safeText(keynote.speaker)}</b></span>`
      : (keynote.speaker ? `<b>${safeText(keynote.speaker)}</b>` : "");
    const titleMarkup = keynote.showFieldLabels
      ? `<span><small>Title / Department</small><b>${safeText(keynote.title)}</b></span>`
      : (keynote.title ? `<span>${safeText(keynote.title)}</span>` : "");
    const scheduleMarkup = keynoteSchedule
      ? (keynote.showFieldLabels ? `<span><small>Presentation Time</small><b>${safeText(keynoteSchedule)}</b></span>` : `<time>${safeText(keynoteSchedule)}</time>`)
      : "";
    const statusMarkup = keynote.showStatus ? `<span><small>Status</small>${statusBadge(keynote.status)}</span>` : "";
    const groups = [
      (keynote.speaker || keynote.title || keynoteSchedule || topicCN || topicEN || keynote.showStatus) ? `<article class="overview-group keynote-group">
        <h3>${safeText(presentationLabelEN)} <span>/ ${safeText(presentationLabelCN)}</span></h3>
        ${(presenterMarkup || titleMarkup) ? `<div class="presentation-profile">${presenterMarkup}${titleMarkup}</div>` : ""}
        ${(scheduleMarkup || statusMarkup) ? `<div class="presentation-meta">${scheduleMarkup}${statusMarkup}</div>` : ""}
        ${(topicCN || topicEN) ? `<div class="overview-topic"><span>中文主题</span><strong>${safeText(topicCN || topicEN)}</strong>${topicENMarkup}</div>` : ""}
      </article>` : "",
      (boothParts.length || products) ? `<article class="overview-group booth-group">
        <h3>Booth &amp; Products <span>/ 展位与展品</span></h3>
        ${boothParts.length ? `<div class="overview-detail"><span>Booth</span><b>${safeText(boothParts.join(" · "))}</b></div>` : ""}
        ${products ? `<div class="overview-detail"><span>Showcased Products</span><b>${safeText(products)}</b></div>` : ""}
      </article>` : ""
    ].filter(Boolean);
    $("overview-grid").innerHTML = `<div class="overview-groups overview-count-${groups.length}">${groups.join("")}</div>`;
  }

  function renderControls(data) {
    const registry = window.EVENT_INDEX?.events || [];
    $("event-select").innerHTML = registry.map((item) =>
      `<option value="${escapeHtml(item.eventId)}" ${item.eventId === state.eventId ? "selected" : ""}>${safeText(item.label)}</option>`
    ).join("");

    const usedStatuses = VALID_STATUSES.filter((status) => data.workstreams.some((item) => workstreamStatus(item) === status));
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
      const derivedStatus = workstreamStatus(item);
      const status = VALID_STATUSES.includes(derivedStatus) ? derivedStatus : "Needs Update";
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
    const status = workstreamStatus(item);
    if (state.quickFilter === "completed") return status === "Completed";
    if (state.quickFilter === "in_progress") {
      return !["Completed", "Needs Update", "Not Applicable"].includes(status);
    }
    if (state.quickFilter === "needs_update") return status === "Needs Update";
    if (state.quickFilter === "confirmed") return status === "Confirmed";
    return true;
  }

  function filteredWorkstreams() {
    return state.data.workstreams.filter((item) => {
      if (!matchesQuickFilter(item)) return false;
      if (state.status !== "all" && workstreamStatus(item) !== state.status) return false;
      if (state.owner !== "all" && (item.owner || "待补充") !== state.owner) return false;
      if (state.hideCompleted && workstreamStatus(item) === "Completed") return false;
      return true;
    });
  }

  function progressCell(item) {
    const status = workstreamStatus(item);
    const progress = workstreamProgress(item);
    if (progress === null || progress === undefined || status === "Needs Update" || status === "Not Applicable") {
      return `<span class="progress-value">—</span><div class="muted">不计入 0%</div>`;
    }
    const value = Math.max(0, Math.min(100, Number(progress)));
    return `<span class="progress-value">${value}%</span><div class="progress-track"><span style="width:${value}%"></span></div>`;
  }

  function categoryFor(item) {
    return {
      id: item.categoryId || "uncategorized",
      nameCN: item.categoryNameCN || "未分类",
      nameEN: item.categoryNameEN || "Uncategorized"
    };
  }

  function categorySummary(items) {
    const assessed = assessedWorkstreams(items);
    const completed = assessed.filter((item) => workstreamStatus(item) === "Completed").length;
    const completion = assessed.length ? Math.round((completed / assessed.length) * 100) : 0;
    const statuses = items.map(workstreamStatus);
    let status = "In Progress";
    if (statuses.length && statuses.every((value) => value === "Completed")) status = "Completed";
    else if (statuses.includes("Blocked")) status = "Blocked";
    else if (statuses.includes("Pending Review")) status = "Pending Review";
    else if (statuses.length && statuses.every((value) => value === "Not Started")) status = "Not Started";
    else if (statuses.length && statuses.every((value) => ["Needs Update", "Not Applicable"].includes(value))) status = "Needs Update";
    return { completed, total: items.length, completion, status };
  }

  function existingOwnerOptions() {
    const owners = new Set();
    (state.data?.workstreams || []).forEach((item) => {
      if (item.owner) owners.add(item.owner);
      stagesFor(item).forEach((stage) => { if (stage.owner) owners.add(stage.owner); });
    });
    return [...owners].sort((a, b) => a.localeCompare(b, "zh-CN"));
  }

  function stageTracker(item) {
    const stages = stagesFor(item);
    if (!stages.length) return "";
    return `
      <div class="stage-tracker" aria-label="${safeText(item.nameCN)} 阶段进度">
        ${stages.map((stage) => {
          const isCurrent = stage.id === currentStageFor(item)?.id;
          const stageStatus = stage.status || "Not Started";
          const symbol = stageStatus === "Completed" ? "✓" : isCurrent ? "●" : "○";
          return `<div class="stage-item ${escapeHtml(stageStatus.toLowerCase().replaceAll(" ", "-"))} ${isCurrent ? "current" : ""}">
            <span class="stage-symbol" aria-hidden="true">${symbol}</span>
            <div class="stage-copy">
              <b>${safeText(stage.nameEN)}</b>
              <span>${safeText(stage.nameCN)}</span>
              <div class="stage-meta">
                <span>Status: <b>${safeText(stageStatus)}</b></span>
                <span>DDL: <b>${formatDeadline(stage.dueDate)}</b></span>
                ${stage.owner ? `<span>Owner: <b>${safeText(stage.owner)}</b></span>` : ""}
                ${stage.completedDate ? `<span>Completed: <b>${formatDate(stage.completedDate)}</b></span>` : stageStatus === "Completed" ? `<span>Completed: <b>Missing Date</b></span>` : ""}
              </div>
            </div>
            <button class="edit-button stage-edit-button no-print" type="button" data-edit-stage="${escapeHtml(stage.id)}" data-workstream-id="${escapeHtml(item.workstreamId)}">Edit</button>
          </div>`;
        }).join("")}
      </div>`;
  }

  function workstreamRows(item) {
    const id = escapeHtml(item.workstreamId);
    const detail = String(item.remarks ?? item.comments ?? "").trim();
    const stages = stagesFor(item);
    const hasExpandableContent = detail || stages.length;
    const currentStage = currentStageFor(item);
    const completedStages = stages.filter((stage) => stage.status === "Completed").length;
    const currentStageMarkup = currentStage
      ? `<div class="current-stage">
          <span>Current Stage</span><b>${safeText(currentStage.nameEN)} / ${safeText(currentStage.nameCN)}</b>
          <span>Stage Status</span><b>${safeText(currentStage.status || "Not Started")}</b>
          <span>Stage DDL</span><b>${formatDeadline(currentStage.dueDate)}</b>
          <span>Progress</span><b>${completedStages} / ${stages.length} completed · ${workstreamProgress(item)}%</b>
          <span>Final DDL</span><b>${formatDeadline(item.dueDate)}</b>
        </div>`
      : "";
    const detailButton = hasExpandableContent
      ? `<button class="detail-button" type="button" data-detail-id="${id}" aria-expanded="false" aria-label="展开 ${safeText(item.nameCN)} ${stages.length ? "阶段" : "详情"}">＋</button>`
      : "";
    const editButton = `<button class="edit-button" type="button" data-edit-workstream="${id}">Edit</button>`;
    const detailRow = hasExpandableContent
      ? `<tr class="detail-row" data-detail-row="${id}" hidden>
          <td colspan="7">
            <div class="detail-panel">
              ${stageTracker(item)}
              ${detail ? `<div class="detail-item"><div class="detail-label">Remarks / Comments</div><div class="detail-value">${escapeHtml(detail)}</div></div>` : ""}
            </div>
          </td>
        </tr>`
      : "";
    return `
        <tr class="data-row" id="workstream-${id}" data-workstream-id="${id}">
        <td data-label="Task">
          <div class="workstream-name">${safeText(item.nameCN)}</div>
          <div class="workstream-en">${safeText(item.nameEN)}</div>
          <div class="workstream-id">${id}</div>
        </td>
        <td data-label="Status">${statusBadge(workstreamStatus(item))}${currentStageMarkup}</td>
        <td data-label="Progress">${progressCell(item)}</td>
        <td data-label="Owner / Final DDL">
          ${item.owner ? `<div class="date-stack"><span>${safeText(item.owner)}</span></div>` : ""}
          <div class="date-stack" style="margin-top:7px"><b>Final DDL / 最终截止</b><span>${formatDeadline(item.dueDate)}</span></div>
        </td>
        <td data-label="Latest Update">${safeText(item.latestUpdate)}</td>
        <td data-label="Next Action">${safeText(item.nextAction)}</td>
        <td class="no-print" data-label="Actions"><div class="row-actions">${editButton}${detailButton}</div></td>
      </tr>
      ${detailRow}`;
  }

  function renderWorkstreams() {
    const rows = filteredWorkstreams();
    const groups = new Map();
    rows.forEach((item) => {
      const category = categoryFor(item);
      if (!groups.has(category.id)) groups.set(category.id, { category, items: [] });
      groups.get(category.id).items.push(item);
    });
    $("workstream-empty").hidden = rows.length !== 0;
    $("workstream-body").innerHTML = [...groups.values()].map(({ category, items }) => {
      const allCategoryItems = state.data.workstreams.filter((item) => categoryFor(item).id === category.id);
      const summary = categorySummary(allCategoryItems);
      const collapsed = state.collapsedCategories.has(category.id);
      return `
        <tr class="category-row ${collapsed ? "is-collapsed" : ""}">
          <td colspan="7">
            <button class="category-toggle" type="button" data-category-id="${escapeHtml(category.id)}" aria-expanded="${String(!collapsed)}">
              <span class="category-toggle-icon" aria-hidden="true">${collapsed ? "＋" : "−"}</span>
              <span class="category-name"><b>${safeText(category.nameCN)}</b><small>${safeText(category.nameEN)}</small></span>
              <span class="category-summary"><b>${summary.completion}%</b><small>${summary.completed}/${summary.total} completed</small></span>
              ${statusBadge(summary.status)}
            </button>
          </td>
        </tr>
        ${collapsed ? "" : items.map(workstreamRows).join("")}`;
    }).join("");
  }

  function calendarItemId(item) {
    return [item.type, item.date, item.eventId, item.workstreamId || item.milestoneId || "event", item.stageId || ""].join(":");
  }

  function isCompletedStatus(status) {
    return status === "Completed" || status === "Not Applicable";
  }

  function validateDeadlines(data) {
    const issues = [];
    const missing = [];
    let completedWithoutDate = 0;
    (data.workstreams || []).forEach((item) => {
      const status = workstreamStatus(item);
      if (item.dueDate && !isValidDate(item.dueDate)) issues.push(`${item.workstreamId}: Task Final DDL is invalid`);
      if (!item.dueDate && !isCompletedStatus(status)) missing.push({ type: "task", categoryId: categoryFor(item).id, owner: item.owner || "", workstreamId: item.workstreamId });
      const stages = stagesFor(item);
      let previousStageDate = "";
      let lastStageDate = "";
      stages.forEach((stage) => {
        if (stage.dueDate && !isValidDate(stage.dueDate)) issues.push(`${item.workstreamId}/${stage.id}: Stage DDL is invalid`);
        if (isValidDate(stage.dueDate)) {
          if (previousStageDate && stage.dueDate < previousStageDate) issues.push(`${item.workstreamId}: Stage DDL sequence is out of order`);
          previousStageDate = stage.dueDate;
          lastStageDate = stage.dueDate;
        }
        if (!stage.dueDate && stage.status !== "Completed") missing.push({ type: "stage", categoryId: categoryFor(item).id, owner: item.owner || "", workstreamId: item.workstreamId, stageId: stage.id });
        if (stage.status === "Completed" && !stage.completedDate) completedWithoutDate += 1;
      });
      if (isValidDate(item.dueDate) && lastStageDate && item.dueDate < lastStageDate) issues.push(`${item.workstreamId}: Task Final DDL is earlier than its last Stage DDL`);
    });
    return { issues, missing, completedWithoutDate };
  }

  function buildCalendarItems(data) {
    const items = [];
    const event = data.event || {};
    const start = isValidDate(event.dateStart) ? event.dateStart : "";
    const end = isValidDate(event.dateEnd) ? event.dateEnd : start;
    if (start) {
      for (let date = start; date <= end; date = addDays(date, 1)) {
        items.push({
          type: "event",
          date,
          eventId: event.eventId,
          status: event.overallStatus || "Not Started",
          titleEN: `${event.shortName} · Event Day`,
          titleCN: event.nameCN || event.shortName,
          owner: "",
          categoryId: "",
          categoryNameEN: ""
        });
      }
    }
    (data.milestones || []).forEach((milestone) => {
      if (!isValidDate(milestone.date)) return;
      items.push({
        type: "milestone",
        date: milestone.date,
        eventId: event.eventId,
        milestoneId: milestone.milestoneId,
        status: milestone.status || "Not Started",
        titleEN: "Milestone",
        titleCN: milestone.titleCN || "Milestone",
        owner: "",
        categoryId: "",
        categoryNameEN: ""
      });
    });
    (data.workstreams || []).forEach((item) => {
      const category = categoryFor(item);
      const status = workstreamStatus(item);
      if (isValidDate(item.dueDate)) {
        items.push({
          type: "task",
          date: item.dueDate,
          eventId: event.eventId,
          workstreamId: item.workstreamId,
          status,
          titleEN: `${item.nameEN} · Final DDL`,
          titleCN: `${item.nameCN} · 最终截止`,
          taskNameEN: item.nameEN,
          owner: item.owner || "",
          categoryId: category.id,
          categoryNameEN: category.nameEN
        });
      }
      stagesFor(item).forEach((stage) => {
        if (!isValidDate(stage.dueDate)) return;
        items.push({
          type: "stage",
          date: stage.dueDate,
          eventId: event.eventId,
          workstreamId: item.workstreamId,
          stageId: stage.id,
          status: stage.status || "Not Started",
          titleEN: `${item.nameEN} · ${stage.nameEN}`,
          titleCN: stage.nameCN || stage.nameEN,
          taskNameEN: item.nameEN,
          owner: item.owner || "",
          categoryId: category.id,
          categoryNameEN: category.nameEN
        });
      });
    });
    return items.map((item) => ({ ...item, id: calendarItemId(item) }));
  }

  function calendarBaseFilter(items) {
    return items.filter((item) => {
      if (item.type !== "event" && !state.calendarTypes.has(item.type)) return false;
      if (state.calendarCategory !== "all" && item.categoryId && item.categoryId !== state.calendarCategory) return false;
      if (state.calendarOwner !== "all" && item.owner && item.owner !== state.calendarOwner) return false;
      return true;
    });
  }

  function calendarVisibleItems() {
    return calendarBaseFilter(state.calendarItems).filter((item) => {
      if (!state.calendarIncludeCompleted && isCompletedStatus(item.status)) return false;
      if (state.calendarActiveOnly && item.status === "Not Applicable") return false;
      return true;
    });
  }

  function calendarMissingItems() {
    const missing = state.calendarValidation?.missing || [];
    return missing.filter((item) => {
      if (!state.calendarTypes.has(item.type)) return false;
      if (state.calendarCategory !== "all" && item.categoryId !== state.calendarCategory) return false;
      if (state.calendarOwner !== "all" && item.owner !== state.calendarOwner) return false;
      const workstream = state.data.workstreams.find((entry) => entry.workstreamId === item.workstreamId);
      return state.calendarIncludeCompleted || !isCompletedStatus(workstreamStatus(workstream));
    });
  }

  function calendarItemLabel(item, compact = false) {
    const typeLabel = item.type === "task" ? "Task Final DDL" : item.type === "stage" ? "Stage DDL" : item.type === "milestone" ? "Milestone" : "Event Day";
    if (compact) return `<b>${safeText(item.titleEN)}</b>`;
    return `
      <div class="calendar-item-copy">
        <b>${safeText(item.titleEN)}</b>
        <span>${safeText(item.titleCN)}</span>
        <small>${safeText(typeLabel)}${item.categoryNameEN ? ` · ${safeText(item.categoryNameEN)}` : ""}${item.owner ? ` · ${safeText(item.owner)}` : ""}</small>
      </div>
      ${statusBadge(item.status)}`;
  }

  function calendarItemButton(item, compact = false) {
    return `<button type="button" class="calendar-item ${escapeHtml(item.type)} ${compact ? "compact" : ""}" data-calendar-item-id="${escapeHtml(item.id)}">${calendarItemLabel(item, compact)}</button>`;
  }

  function renderCalendarControls(data) {
    $("calendar-category-filters").innerHTML = CALENDAR_CATEGORIES.map((item) =>
      `<button type="button" class="filter-chip ${item.id === state.calendarCategory ? "active" : ""}" data-calendar-category="${escapeHtml(item.id)}">${safeText(item.label)}</button>`
    ).join("");
    const owners = [...new Set((data.workstreams || []).map((item) => item.owner).filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-CN"));
    $("calendar-owner-select").innerHTML = `<option value="all">All Owners</option>` + owners.map((owner) =>
      `<option value="${escapeHtml(owner)}" ${owner === state.calendarOwner ? "selected" : ""}>${safeText(owner)}</option>`
    ).join("");
    $("calendar-active-only").checked = state.calendarActiveOnly;
    $("calendar-include-completed").checked = state.calendarIncludeCompleted;
    $("calendar-type-filters").innerHTML = CALENDAR_TYPES.map((item) =>
      `<button type="button" class="filter-chip ${state.calendarTypes.has(item.id) ? "active" : ""}" data-calendar-type="${escapeHtml(item.id)}">${safeText(item.label)}</button>`
    ).join("");
    $("calendar-filter-panel").hidden = !state.calendarFiltersOpen;
    $("calendar-filters-toggle").setAttribute("aria-expanded", String(state.calendarFiltersOpen));
    $("calendar-content").dataset.view = state.calendarView;
    $("project-calendar").querySelectorAll("button[data-calendar-view]").forEach((button) => {
      button.classList.toggle("active", button.dataset.calendarView === state.calendarView);
    });
  }

  function renderCalendarStats(scopedItems) {
    const today = todayIso();
    const nextWeek = addDays(today, 7);
    const activeItems = scopedItems.filter((item) => !isCompletedStatus(item.status));
    const overdue = activeItems.filter((item) => item.date < today).length;
    const dueToday = activeItems.filter((item) => item.date === today).length;
    const nextSeven = activeItems.filter((item) => item.date > today && item.date <= nextWeek).length;
    const missing = calendarMissingItems().length;
    $("calendar-stats").innerHTML = [
      ["Overdue", overdue, "red"],
      ["Due Today", dueToday, "blue"],
      ["Next 7 Days", nextSeven, "blue"],
      ["Missing DDL", missing, "grey"]
    ].map(([label, value, className]) => `<div class="calendar-stat ${className}"><span>${label}</span><b>${value}</b></div>`).join("");
  }

  function renderMonthView(items) {
    const month = state.calendarMonth || new Date();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const first = new Date(year, monthIndex, 1);
    const gridStart = new Date(year, monthIndex, 1 - first.getDay());
    const days = Array.from({ length: 42 }, (_, index) => {
      const day = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
      const date = isoFromDate(day);
      const dayItems = items.filter((item) => item.date === date);
      const visibleItems = dayItems.slice(0, 2);
      const isCurrentMonth = day.getMonth() === monthIndex;
      const isToday = date === todayIso();
      return `<article class="calendar-day ${isCurrentMonth ? "" : "other-month"} ${isToday ? "today" : ""} ${dayItems.some((item) => !isCompletedStatus(item.status) && item.date < todayIso()) ? "overdue" : ""}">
        <div class="calendar-day-number">${day.getDate()}</div>
        <div class="calendar-day-items">${visibleItems.map((item) => calendarItemButton(item, true)).join("")}</div>
        ${dayItems.length > 2 ? `<button type="button" class="calendar-more" data-calendar-date="${date}">+ ${dayItems.length - 2} more</button>` : ""}
      </article>`;
    }).join("");
    $("calendar-month-label").textContent = `${year}.${String(monthIndex + 1).padStart(2, "0")}`;
    return `<div class="calendar-month"><div class="calendar-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div><div class="calendar-days">${days}</div></div>`;
  }

  function renderFortnightWeek(items, start, weekNumber) {
    const end = addDays(start, 6);
    const dayItems = items.filter((item) => item.date >= start && item.date <= end).sort((a, b) => a.date.localeCompare(b.date) || a.titleEN.localeCompare(b.titleEN));
    const grouped = new Map();
    dayItems.forEach((item) => {
      if (!grouped.has(item.date)) grouped.set(item.date, []);
      grouped.get(item.date).push(item);
    });
    const rows = [...grouped.entries()].map(([date, entries]) => `
      <article class="calendar-fortnight-day">
        <time>${formatDate(date)}</time>
        <div class="calendar-fortnight-items">${entries.map((item) => calendarItemButton(item)).join("")}</div>
      </article>`).join("");
    return `<section class="calendar-week-group">
      <h3>Week ${weekNumber}</h3>
      ${rows || `<p class="calendar-empty-week">No scheduled DDLs / 暂无已填写DDL</p>`}
    </section>`;
  }

  function renderLaterDeadlines(items, until) {
    const later = items
      .filter((item) => item.date > until && !isCompletedStatus(item.status))
      .sort((a, b) => a.date.localeCompare(b.date) || a.titleEN.localeCompare(b.titleEN));
    const shown = state.calendarLaterExpanded ? later : later.slice(0, 5);
    const toggle = later.length > 5
      ? `<button type="button" class="calendar-later-toggle" data-calendar-later-toggle>${state.calendarLaterExpanded ? "Show Less / 收起" : "Show All / 展开全部"}</button>`
      : "";
    return `<section class="calendar-later-deadlines">
      <div class="calendar-later-heading"><h3>Later Deadlines</h3><span>后续截止事项</span></div>
      ${shown.length ? `<div class="calendar-later-list">${shown.map((item) => `<article class="calendar-later-item"><time>${formatDate(item.date)}</time>${calendarItemButton(item)}</article>`).join("")}</div>` : `<p class="calendar-empty-week">No later scheduled DDLs / 暂无后续已填写DDL</p>`}
      ${toggle}
    </section>`;
  }

  function renderFortnightView(items) {
    const start = state.calendarFortnightStart || todayIso();
    const secondWeek = addDays(start, 7);
    const until = addDays(start, 13);
    $("calendar-month-label").textContent = `${formatDate(start)} — ${formatDate(until)}`;
    return `<div class="calendar-fortnight">
      <div class="calendar-fortnight-weeks">
        ${renderFortnightWeek(items, start, 1)}
        ${renderFortnightWeek(items, secondWeek, 2)}
      </div>
      ${renderLaterDeadlines(items, until)}
    </div>`;
  }

  function renderCalendarDayDetail(items) {
    const date = state.calendarSelectedDate;
    const panel = $("calendar-day-detail");
    if (!date) { panel.hidden = true; panel.innerHTML = ""; return; }
    const dayItems = items.filter((item) => item.date === date);
    panel.hidden = false;
    panel.innerHTML = `<div class="calendar-day-detail-heading"><b>${formatDate(date)}</b><button type="button" class="detail-button" data-calendar-day-close aria-label="关闭当天事项">−</button></div>${dayItems.map((item) => calendarItemButton(item)).join("") || `<div class="empty-state">当天没有符合筛选条件的事项。</div>`}`;
  }

  function renderCalendar(data) {
    state.calendarValidation = validateDeadlines(data);
    state.calendarItems = buildCalendarItems(data);
    const signature = JSON.stringify({ issues: state.calendarValidation.issues, completedWithoutDate: state.calendarValidation.completedWithoutDate });
    if (signature !== state.calendarValidationSignature && (state.calendarValidation.issues.length || state.calendarValidation.completedWithoutDate)) {
      console.warn("Calendar deadline validation:", state.calendarValidation);
    }
    state.calendarValidationSignature = signature;
    renderCalendarControls(data);
    const scopedItems = calendarBaseFilter(state.calendarItems);
    const visibleItems = calendarVisibleItems();
    renderCalendarStats(scopedItems);
    const reminder = state.calendarValidation;
    $("calendar-validation").hidden = reminder.issues.length === 0 && reminder.completedWithoutDate === 0;
    $("calendar-validation").textContent = [
      reminder.issues.length ? `${reminder.issues.length} 个DDL数据校验提醒` : "",
      reminder.completedWithoutDate ? `${reminder.completedWithoutDate} 个已完成阶段未记录实际完成日期` : ""
    ].filter(Boolean).join(" · ");
    $("calendar-content").innerHTML = state.calendarView === "month" ? renderMonthView(visibleItems) : renderFortnightView(visibleItems);
    renderCalendarDayDetail(visibleItems);
  }

  function focusCalendarItem(item) {
    if (item.workstreamId) {
      const workstream = state.data.workstreams.find((entry) => entry.workstreamId === item.workstreamId);
      if (!workstream) return;
      state.collapsedCategories.delete(categoryFor(workstream).id);
      renderWorkstreams();
      window.requestAnimationFrame(() => {
        const target = document.querySelector(`[data-workstream-id="${CSS.escape(item.workstreamId)}"]`);
        if (!target) return;
        if (item.stageId) {
          const detail = document.querySelector(`[data-detail-row="${CSS.escape(item.workstreamId)}"]`);
          const button = document.querySelector(`button[data-detail-id="${CSS.escape(item.workstreamId)}"]`);
          if (detail?.hidden) { detail.hidden = false; button?.setAttribute("aria-expanded", "true"); if (button) button.textContent = "−"; }
        }
        target.classList.add("calendar-target");
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => target.classList.remove("calendar-target"), 2200);
      });
    } else if (item.milestoneId) {
      const target = document.querySelector(`[data-milestone-id="${CSS.escape(item.milestoneId)}"]`);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      document.querySelector(".hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function attentionReason(status, dueDate) {
    const today = todayIso();
    if (status === "Blocked") return { priority: 1, label: "Blocked" };
    if (isValidDate(dueDate) && dueDate < today) return { priority: 2, label: "Overdue" };
    if (isValidDate(dueDate) && dueDate === today) return { priority: 3, label: "Due Today" };
    if (isValidDate(dueDate) && dueDate <= addDays(today, 3)) return { priority: 4, label: "Due Soon" };
    if (status === "Pending Review") return { priority: 5, label: "Pending Review" };
    if (!dueDate) return { priority: 6, label: "Missing DDL" };
    return null;
  }

  function buildAttentionItems(data) {
    const attention = [];
    (data.workstreams || []).forEach((item) => {
      const candidates = [];
      stagesFor(item).forEach((stage) => {
        if (isCompletedStatus(stage.status)) return;
        const reason = attentionReason(stage.status || "Not Started", stage.dueDate);
        if (reason) candidates.push({
          ...reason,
          id: `attention:${item.workstreamId}:${stage.id}`,
          workstreamId: item.workstreamId,
          stageId: stage.id,
          titleEN: `${item.nameEN} · ${stage.nameEN}`,
          titleCN: stage.nameCN || stage.nameEN,
          dueDate: stage.dueDate || "",
          owner: item.owner || "",
          status: stage.status || "Not Started"
        });
      });
      const taskStatus = workstreamStatus(item);
      if (!isCompletedStatus(taskStatus)) {
        const reason = attentionReason(taskStatus, item.dueDate);
        if (reason) candidates.push({
          ...reason,
          id: `attention:${item.workstreamId}:task`,
          workstreamId: item.workstreamId,
          titleEN: item.nameEN,
          titleCN: item.nameCN,
          dueDate: item.dueDate || "",
          owner: item.owner || "",
          status: taskStatus
        });
      }
      candidates.sort((a, b) => a.priority - b.priority || Number(Boolean(b.stageId)) - Number(Boolean(a.stageId)));
      if (candidates[0]) attention.push(candidates[0]);
    });
    return attention.sort((a, b) => a.priority - b.priority || (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31") || a.titleEN.localeCompare(b.titleEN)).slice(0, 5);
  }

  function renderAttentionNeeded(data) {
    const items = buildAttentionItems(data);
    state.attentionItems = items;
    $("attention-list").innerHTML = items.length
      ? items.map((item) => `
          <button type="button" class="attention-item" data-attention-id="${escapeHtml(item.id)}">
            <div class="attention-copy">
              <b>${safeText(item.titleEN)}</b>
              <span>${safeText(item.titleCN)}</span>
              <small>${safeText(item.reasonLabel || item.label)} · ${formatDeadline(item.dueDate)}</small>
              <small>${safeText(item.owner || "Unassigned")} · ${safeText(item.status)}</small>
            </div>
            ${statusBadge(item.status)}
          </button>`).join("")
      : `<div class="attention-empty"><b>No immediate attention required.</b><span>当前没有需要特别关注的事项。</span></div>`;
  }

  function renderSessions(data) {
    $("sessions-grid").innerHTML = (data.sessions || []).map((session) => `
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
        <div class="timeline-item" data-milestone-id="${escapeHtml(item.milestoneId || "")}">
          <span class="timeline-dot ${dotClass}"></span>
          <div class="timeline-date">${formatDate(item.date)}</div>
          <div class="timeline-title">${safeText(item.titleCN)}</div>
          ${statusBadge(item.status)}
          ${item.comments || item.remarks ? `<div class="timeline-note">${safeText(item.comments || item.remarks, "")}</div>` : ""}
        </div>`;
    }).join("");
  }

  function renderFinalDocuments(data) {
    const documents = Array.isArray(data.finalDocuments) ? data.finalDocuments : [];
    const filtered = state.documentCategory === "all"
      ? documents
      : documents.filter((item) => item.category === state.documentCategory);
    const downloadableCount = documents.filter((item) => item.downloadable === true && item.status === "Available").length;

    $("final-document-filters").innerHTML = FINAL_DOCUMENT_CATEGORIES.map((item) =>
      `<button type="button" class="filter-chip ${item.id === state.documentCategory ? "active" : ""}" data-document-category="${escapeHtml(item.id)}">${safeText(item.label)}</button>`
    ).join("");

    $("final-document-stats").innerHTML = `<span>${safeText(documents.length)} Files · ${safeText(downloadableCount)} Downloads</span>`;

    $("final-document-empty").hidden = filtered.length !== 0;
    $("final-document-list").innerHTML = filtered.map((item) => {
      const canRequestDownload = item.downloadable === true && item.status === "Available" && item.id;
      const role = window.DashboardCollab?.effectiveRole?.(data.event.eventId) || "guest";
      const actionLabel = role === "guest" ? "Sign in to download / 登录下载" : "Download / 下载";
      const fileName = `<div class="final-document-name">${safeText(item.nameZh)}</div>`;
      const action = canRequestDownload
        ? `<button class="download-button" type="button" data-download-document-id="${escapeHtml(item.id)}">${actionLabel}</button>`
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
    $("project-calendar").hidden = false;
    $("workstream-title").textContent = "Workstream Progress";
    $("workstream-column-label").textContent = "工作模块";
    $("owner-column-label").textContent = "负责人 / Final DDL";
    $("update-column-label").textContent = "最新进展";
    $("sessions-title").textContent = "Sessions & Speakers";
    $("sessions-subtitle").textContent = "主论坛、分论坛与领奖环节";
    $("sessions-section").hidden = false;
    document.querySelector(".attention-panel .panel-heading p").textContent = "需要关注 · 自动根据当前任务、阶段与 DDL 派生";
    renderHero(data);
    renderOverview(data);
    renderControls(data);
    renderStatusCounts(data);
    renderCalendar(data);
    renderWorkstreams();
    renderSessions(data);
    renderAttentionNeeded(data);
    renderFinalDocuments(data);
    $("footer-event-id").textContent = `${data.event.eventId} · Schema ${data.meta.schemaVersion}`;
  }

  function bindEvents() {
    $("event-select").addEventListener("change", async (event) => {
      try { await loadEvent(event.target.value, { historyMode: "push" }); }
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

    $("project-calendar").addEventListener("click", (event) => {
      const viewButton = event.target.closest("button[data-calendar-view]");
      if (viewButton) { state.calendarView = viewButton.dataset.calendarView; renderCalendar(state.data); return; }
      if (event.target.closest("button[data-calendar-later-toggle]")) {
        state.calendarLaterExpanded = !state.calendarLaterExpanded;
        renderCalendar(state.data);
        return;
      }
      const categoryButton = event.target.closest("button[data-calendar-category]");
      if (categoryButton) { state.calendarCategory = categoryButton.dataset.calendarCategory; state.calendarSelectedDate = ""; renderCalendar(state.data); return; }
      const typeButton = event.target.closest("button[data-calendar-type]");
      if (typeButton) {
        const type = typeButton.dataset.calendarType;
        if (state.calendarTypes.has(type)) state.calendarTypes.delete(type); else state.calendarTypes.add(type);
        state.calendarSelectedDate = "";
        renderCalendar(state.data);
        return;
      }
      const itemButton = event.target.closest("button[data-calendar-item-id]");
      if (itemButton) {
        const item = state.calendarItems.find((entry) => entry.id === itemButton.dataset.calendarItemId);
        if (item) focusCalendarItem(item);
        return;
      }
      const moreButton = event.target.closest("button[data-calendar-date]");
      if (moreButton) { state.calendarSelectedDate = moreButton.dataset.calendarDate; renderCalendar(state.data); return; }
      if (event.target.closest("button[data-calendar-day-close]")) { state.calendarSelectedDate = ""; renderCalendar(state.data); }
    });

    $("attention-list").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-attention-id]");
      if (!button) return;
      const item = state.attentionItems.find((entry) => entry.id === button.dataset.attentionId);
      if (item) focusCalendarItem(item);
    });

    $("calendar-filters-toggle").addEventListener("click", () => { state.calendarFiltersOpen = !state.calendarFiltersOpen; renderCalendar(state.data); });
    $("calendar-prev").addEventListener("click", () => {
      if (state.calendarView === "month") state.calendarMonth = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() - 1, 1);
      else state.calendarFortnightStart = addDays(state.calendarFortnightStart || todayIso(), -14);
      renderCalendar(state.data);
    });
    $("calendar-next").addEventListener("click", () => {
      if (state.calendarView === "month") state.calendarMonth = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() + 1, 1);
      else state.calendarFortnightStart = addDays(state.calendarFortnightStart || todayIso(), 14);
      renderCalendar(state.data);
    });
    $("calendar-today").addEventListener("click", () => {
      const now = new Date();
      state.calendarMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      state.calendarFortnightStart = todayIso();
      state.calendarSelectedDate = "";
      renderCalendar(state.data);
    });
    $("calendar-owner-select").addEventListener("change", (event) => { state.calendarOwner = event.target.value; state.calendarSelectedDate = ""; renderCalendar(state.data); });
    $("calendar-active-only").addEventListener("change", (event) => { state.calendarActiveOnly = event.target.checked; renderCalendar(state.data); });
    $("calendar-include-completed").addEventListener("change", (event) => { state.calendarIncludeCompleted = event.target.checked; renderCalendar(state.data); });

    $("final-document-filters").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-document-category]");
      if (!button) return;
      state.documentCategory = button.dataset.documentCategory;
      renderFinalDocuments(state.data);
    });

    $("final-document-list").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-download-document-id]");
      if (!button) return;
      const item = (state.data.finalDocuments || []).find((entry) => entry.id === button.dataset.downloadDocumentId);
      if (!item) return;
      window.DashboardCollab?.requestDownload?.(state.eventId, {
        id: item.id,
        fileName: String(item.filePath || "").split("/").pop() || item.nameEn || item.nameZh
      });
    });

    $("workstream-body").addEventListener("click", (event) => {
      const stageEditButton = event.target.closest("button[data-edit-stage]");
      if (stageEditButton) {
        const item = state.data.workstreams.find((entry) => entry.workstreamId === stageEditButton.dataset.workstreamId);
        const stage = item?.stages?.find((entry) => entry.id === stageEditButton.dataset.editStage);
        if (item && stage) {
          window.DashboardCollab?.requestEdit?.({
            entityType: "stage",
            eventId: state.eventId,
            workstreamId: item.workstreamId,
            stageId: stage.id,
            workstreamName: `${item.nameEN} / ${item.nameCN}`,
            stageName: `${stage.nameEN} / ${stage.nameCN}`,
            status: stage.status || "Not Started",
            dueDate: stage.dueDate || "",
            owner: stage.owner || item.owner || "",
            ownerOptions: existingOwnerOptions(),
            collaboration: stage._collaboration || { version: 1 }
          });
        }
        return;
      }
      const workstreamEditButton = event.target.closest("button[data-edit-workstream]");
      if (workstreamEditButton) {
        const item = state.data.workstreams.find((entry) => entry.workstreamId === workstreamEditButton.dataset.editWorkstream);
        if (item) {
          window.DashboardCollab?.requestEdit?.({
            entityType: "workstream",
            eventId: state.eventId,
            workstreamId: item.workstreamId,
            workstreamName: `${item.nameEN} / ${item.nameCN}`,
            status: workstreamStatus(item) || "Not Started",
            dueDate: item.dueDate || "",
            owner: item.owner || "",
            ownerOptions: existingOwnerOptions(),
            hasStages: stagesFor(item).length > 0,
            collaboration: item._collaboration || { version: 1 }
          });
        }
        return;
      }
      const categoryButton = event.target.closest("button[data-category-id]");
      if (categoryButton) {
        const categoryId = categoryButton.dataset.categoryId;
        if (state.collapsedCategories.has(categoryId)) state.collapsedCategories.delete(categoryId);
        else state.collapsedCategories.add(categoryId);
        renderWorkstreams();
        return;
      }
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
    await window.DashboardCollab?.init?.({
      showToast,
      reloadCurrentEvent,
      refreshAccessUi: () => { if (state.data) renderFinalDocuments(state.data); }
    });
    bindEvents();
    const hashId = window.location.hash.replace(/^#/, "");
    const hasValidHash = registry.events.some((item) => item.eventId === hashId);
    const initial = hasValidHash ? hashId : defaultEventId(registry.events);
    try { await loadEvent(initial, { historyMode: hasValidHash ? "none" : "replace" }); }
    catch (error) {
      console.error(error);
      showToast(error.message);
    }
    window.addEventListener("hashchange", async () => {
      const nextId = window.location.hash.replace(/^#/, "");
      if (nextId === state.eventId || !registry.events.some((item) => item.eventId === nextId)) return;
      try { await loadEvent(nextId, { historyMode: "none" }); }
      catch (error) { showToast(error.message); }
    });
  }

  init();
})();
