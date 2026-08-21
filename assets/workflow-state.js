"use strict";

// Shared derived-state helpers. These never write to event data or collaboration
// overlays: a task is overdue only while an uncompleted Task/Stage DDL is past.
(function attachDashboardWorkflow(global) {
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
    const [year, month, day] = String(value).split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  function todayIso() {
    const date = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function stagesFor(item) {
    return Array.isArray(item?.stages) ? item.stages : [];
  }

  function isCompleted(status) {
    return status === "Completed";
  }

  function currentStageFor(item) {
    const stages = stagesFor(item);
    if (!stages.length) return null;
    const configured = stages.find((stage) => stage.id === item.currentStageId);
    if (configured && !isCompleted(configured.status)) return configured;
    return stages.find((stage) => !isCompleted(stage.status)) || stages[stages.length - 1];
  }

  function workstreamStatus(item) {
    const stages = stagesFor(item);
    if (!stages.length) return item?.status || "Planning";
    if (stages.some((stage) => stage.status === "Blocked")) return "Blocked";
    const currentStage = currentStageFor(item);
    if (currentStage?.status === "Under Review" || stages.some((stage) => stage.status === "Under Review")) return "Under Review";
    const completed = stages.filter((stage) => isCompleted(stage.status)).length;
    if (completed === stages.length) return "Completed";
    if (completed === 0 && stages.every((stage) => stage.status === "Planning")) return "Planning";
    return "In Progress";
  }

  function isOverdue(status, dueDate, referenceDate = todayIso()) {
    return !isCompleted(status) && validDate(dueDate) && dueDate < referenceDate;
  }

  function overdueDeadlineFor(item, referenceDate = todayIso()) {
    const taskStatus = workstreamStatus(item);
    if (isOverdue(taskStatus, item?.dueDate, referenceDate)) {
      return { type: "task", dueDate: item.dueDate };
    }
    return stagesFor(item)
      .filter((stage) => isOverdue(stage.status || "Planning", stage.dueDate, referenceDate))
      .sort((left, right) => left.dueDate.localeCompare(right.dueDate))[0] || null;
  }

  function displayWorkstreamStatus(item, referenceDate = todayIso()) {
    const status = workstreamStatus(item);
    return status === "Completed" || !overdueDeadlineFor(item, referenceDate) ? status : "Overdue";
  }

  function displayStageStatus(stage, referenceDate = todayIso()) {
    const status = stage?.status || "Planning";
    return isOverdue(status, stage?.dueDate, referenceDate) ? "Overdue" : status;
  }

  global.DashboardWorkflow = {
    validDate,
    todayIso,
    stagesFor,
    isCompleted,
    currentStageFor,
    workstreamStatus,
    isOverdue,
    overdueDeadlineFor,
    displayWorkstreamStatus,
    displayStageStatus
  };
})(window);
