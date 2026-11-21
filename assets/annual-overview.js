(function () {
  "use strict";

  const ROUTE_ID = "OVERVIEW_2026";
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  function cardMarkup(card, registered) {
    const id = `annual-card-${String(card.code).toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    const route = typeof card.eventRouteId === "string" && /^[A-Z0-9_]+$/.test(card.eventRouteId)
      && registered.has(card.eventRouteId) ? card.eventRouteId : "";
    const details = [
      card.date ? ["日期 / Date", card.date] : null,
      card.venue ? ["地点 / Venue", card.venue] : null,
      card.theme ? ["活动主题 / Event Theme", card.theme] : null
    ].filter(Boolean);
    const talks = (card.talks || []).filter((talk) => talk.speaker || talk.title || talk.when);
    const metrics = (card.metrics || []).filter((metric) => metric.label && metric.value != null && metric.value !== "");
    const content = `
      <div class="annual-card-main">
        <span class="annual-card-code">${escape(card.code)}</span>
        <h2 id="${id}">${escape(card.title || card.code)}</h2>
        ${details.length ? `<dl class="annual-card-details">${details.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join("")}</dl>` : ""}
        ${talks.length ? `<div class="annual-card-talks"><h3>演讲人及题目 / Speaker &amp; Talk</h3><ul>${talks.map(({ speaker, title, when }) => `<li>${speaker ? `<b>${escape(speaker)}</b>` : ""}${title ? `<span>${escape(title)}</span>` : ""}${when ? `<small>${escape(when)}</small>` : ""}</li>`).join("")}</ul></div>` : ""}
        ${metrics.length ? `<dl class="annual-card-metrics">${metrics.map(({ label, value, note }) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}${note ? `<small>${escape(note)}</small>` : ""}</dd></div>`).join("")}</dl>` : ""}
        ${card.note ? `<p class="annual-card-note">${escape(card.note)}</p>` : ""}
      </div>
      <div class="annual-card-footer">${route ? '查看活动看板 / Open dashboard <span aria-hidden="true">↗</span>' : "活动信息 / Info only"}</div>`;
    return `<article class="annual-card${route ? " annual-card-linked" : ""}" aria-labelledby="${id}">${route
      ? `<a href="#${route}" aria-label="${escape(card.code)} · 查看活动看板 / Open dashboard">${content}</a>` : content}</article>`;
  }

  function markup(cards, registry = []) {
    const registered = new Set(registry.map(({ eventId }) => eventId));
    return cards.map((card) => cardMarkup(card, registered)).join("");
  }

  window.DashboardAnnualOverview = { routeId: ROUTE_ID, markup };
})();
