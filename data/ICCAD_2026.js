/*
  ICCAD 2026 data
  =================
  User-confirmed project information takes priority. Public date and venue
  were verified on the official ICCAD-Expo website. Keep unconfirmed DDLs
  empty; the shared Calendar and Attention Needed components handle them.
*/

window.EVENT_DATASETS = window.EVENT_DATASETS || {};

window.EVENT_DATASETS.ICCAD_2026 = {
  meta: {
    schemaVersion: "1.9",
    lastUpdated: "2026-07-29",
    updatedBy: "Codex"
  },

  event: {
    eventId: "ICCAD_2026",
    shortName: "ICCAD 2026",
    nameCN: "2026集成电路发展论坛（北京）暨第三十二届集成电路设计业展览会",
    nameEN: "ICCAD-Expo 2026",
    dateStart: "2026-11-19",
    dateEnd: "2026-11-20",
    city: "北京",
    venue: "北京亦庄北人亦创国际会展中心",
    sponsorshipLevel: "Diamond Sponsor / 钻石赞助",
    participationForms: ["Booth"],
    showParticipationInHero: true,
    boothArea: "56㎡",
    boothNumber: "C009-010 / C019-020 / C029-030",
    showcasedProducts: "TBD",
    overallStatus: "In Progress",
    reportStatus: "Planning",
    resultMetrics: [],
    showEventCountdown: true,
    officialWebsite: "https://iccad.xmtexpo.com/"
  },

  keynote: {
    labelEN: "Booth Presentation",
    labelCN: "展台演讲",
    showFieldLabels: true,
    showStatus: true,
    speaker: "TBD",
    title: "TBD",
    date: "",
    time: "TBD",
    topicEN: "TBD",
    topicCN: "TBD",
    status: "Planning"
  },

  workstreams: [
    {
      workstreamId: "ICCAD26-WS-01",
      nameCN: "活动基本信息",
      nameEN: "Event Basic Information",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Planning",
      progress: 0,
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-02",
      nameCN: "展台演讲",
      nameEN: "Booth Presentation",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      stages: [
        { id: "presenter-confirmation", nameCN: "演讲人确认", nameEN: "Presenter Confirmation", status: "Planning", dueDate: "", completedDate: "" },
        { id: "topic-confirmation", nameCN: "主题确认", nameEN: "Topic Confirmation", status: "Planning", dueDate: "", completedDate: "" },
        { id: "initial-draft", nameCN: "初稿", nameEN: "Initial Draft", status: "Planning", dueDate: "", completedDate: "" },
        { id: "internal-review", nameCN: "内部审核", nameEN: "Internal Review", status: "Planning", dueDate: "", completedDate: "" },
        { id: "final-approval", nameCN: "最终确认", nameEN: "Final Approval", status: "Planning", dueDate: "", completedDate: "" },
        { id: "rehearsal", nameCN: "彩排", nameEN: "Rehearsal", status: "Planning", dueDate: "", completedDate: "" }
      ],
      currentStageId: "presenter-confirmation",
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "Booth Presentation opportunity and content are under discussion.",
      nextAction: "Confirm presentation opportunity, presenter and topic.",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-03",
      nameCN: "展品清单",
      nameEN: "Demo List",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Planning",
      progress: 0,
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-04",
      nameCN: "活动物料与展台设计",
      nameEN: "Event Materials / Booth Design",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      stages: [
        { id: "design-brief", nameCN: "需求简报", nameEN: "Design Brief", status: "Planning", dueDate: "", completedDate: "" },
        { id: "initial-design", nameCN: "初版设计", nameEN: "Initial Design", status: "Planning", dueDate: "", completedDate: "" },
        { id: "review-revision", nameCN: "审核与修改", nameEN: "Review & Revision", status: "Planning", dueDate: "", completedDate: "" },
        { id: "final-artwork", nameCN: "最终画稿", nameEN: "Final Artwork", status: "Planning", dueDate: "", completedDate: "" },
        { id: "onsite-completion", nameCN: "现场完成", nameEN: "Onsite Completion", status: "Planning", dueDate: "", completedDate: "" }
      ],
      currentStageId: "design-brief",
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-05",
      nameCN: "现场执行",
      nameEN: "Onsite Operation",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Planning",
      progress: 0,
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-06",
      nameCN: "赞助",
      nameEN: "Sponsorship",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "In Progress",
      progress: 0,
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "Diamond Sponsor / 钻石赞助",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-07",
      nameCN: "报价",
      nameEN: "Quotation",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "Planning",
      progress: 0,
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-08",
      nameCN: "合同",
      nameEN: "Contract",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "Planning",
      progress: 0,
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-09",
      nameCN: "付款",
      nameEN: "Payment",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "Planning",
      progress: 0,
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-10",
      nameCN: "社媒传播",
      nameEN: "Social Communication",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      stages: [
        { id: "planning-draft", nameCN: "计划初稿", nameEN: "Planning Draft", status: "Planning", dueDate: "", completedDate: "" }
      ],
      currentStageId: "planning-draft",
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-11",
      nameCN: "公关与媒体",
      nameEN: "PR & Media",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      status: "Planning",
      progress: 0,
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-12",
      nameCN: "会后报告",
      nameEN: "Post-event Report",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      stages: [
        { id: "data-collection", nameCN: "数据收集", nameEN: "Data Collection", status: "Planning", dueDate: "", completedDate: "" },
        { id: "report-draft", nameCN: "报告初稿", nameEN: "Report Draft", status: "Planning", dueDate: "", completedDate: "" },
        { id: "final-report", nameCN: "最终报告", nameEN: "Final Report", status: "Planning", dueDate: "", completedDate: "" }
      ],
      currentStageId: "data-collection",
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    }
  ],

  sessions: [
    {
      sessionId: "ICCAD-SESSION-01",
      type: "Booth Presentation",
      speaker: "TBD",
      role: "TBD",
      topicEN: "TBD",
      topicCN: "TBD",
      time: "TBD",
      status: "Planning",
      remarks: "Under Discussion"
    }
  ],

  finalDocuments: []
};
