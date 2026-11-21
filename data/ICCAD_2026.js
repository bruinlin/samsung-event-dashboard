/*
  ICCAD 2026 data
  =================
  User-confirmed project information takes priority. Public date and venue
  were verified on the official ICCAD-Expo website. User-authorized internal
  planning DDLs are labelled in visible workstream notes; they are distinct
  from the confirmed attendee-form deadline and actual completion dates.
*/

window.EVENT_DATASETS = window.EVENT_DATASETS || {};

window.EVENT_DATASETS.ICCAD_2026 = {
  meta: {
    schemaVersion: "1.9",
    lastUpdated: "2026-11-21",
    workstreamCloseoutAt: "2026-11-21T02:08:20Z",
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
    boothArea: "54㎡",
    boothNumber: "C009-010 / C019-020 / C029-030",
    showcasedProducts: "2.3D Cube-E、3D IC Cube-T/H、2nm GAA Wafer、All-in-one Heterogeneous、The Evolution of Transistors",
    overallStatus: "In Progress",
    reportStatus: "Completed",
    resultMetrics: [],
    showEventCountdown: true,
    officialWebsite: "https://iccad.xmtexpo.com/"
  },

  keynote: {
    labelEN: "Booth Presentation",
    labelCN: "展台演讲",
    showFieldLabels: true,
    showStatus: true,
    speaker: "Simon Hu",
    title: "Samsung",
    date: "2026-11-19",
    time: "Afternoon (Beijing time) / 下午（北京时间）",
    topicEN: "Samsung Foundry: Innovative All-in-One",
    topicCN: "面向未来，一体化的异构集成创新方案",
    status: "Completed"
  },

  workstreams: [
    {
      workstreamId: "ICCAD26-WS-01",
      nameCN: "活动基本信息",
      nameEN: "Event Basic Information",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "TBD",
      dueDate: "2026-10-30",
      actualCompletionDate: "",
      latestUpdate: "按 ICCAD 2026 收尾口径，任务标记完成。",
      nextAction: "",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-02",
      nameCN: "展台演讲",
      nameEN: "Booth Presentation",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      stages: [
        { id: "presenter-confirmation", nameCN: "演讲人确认", nameEN: "Presenter Confirmation", status: "Completed", dueDate: "2026-10-30", completedDate: "" },
        { id: "topic-confirmation", nameCN: "主题确认", nameEN: "Topic Confirmation", status: "Completed", dueDate: "2026-10-30", completedDate: "" },
        { id: "initial-draft", nameCN: "初稿", nameEN: "Initial Draft", status: "Completed", dueDate: "2026-11-06", completedDate: "" },
        { id: "internal-review", nameCN: "内部审核", nameEN: "Internal Review", status: "Completed", dueDate: "2026-11-12", completedDate: "" },
        { id: "final-approval", nameCN: "最终确认", nameEN: "Final Approval", status: "Completed", dueDate: "2026-11-13", completedDate: "" },
        { id: "rehearsal", nameCN: "彩排", nameEN: "Rehearsal", status: "Completed", dueDate: "2026-11-18", completedDate: "" }
      ],
      currentStageId: "presenter-confirmation",
      owner: "TBD",
      dueDate: "2026-11-18",
      actualCompletionDate: "",
      latestUpdate: "11 月 19 日下午（北京时间），Simon Hu 完成一场定向邀请的展台技术演讲。",
      nextAction: "",
      remarks: "演讲题目：Samsung Foundry: Innovative All-in-One（面向未来，一体化的异构集成创新方案）。此为三星展台演讲，不是大会主论坛。未确认确切开场和结束时间。"
    },
    {
      workstreamId: "ICCAD26-WS-03",
      nameCN: "展品清单",
      nameEN: "Demo List",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "按 ICCAD 2026 收尾口径，任务标记完成。",
      nextAction: "",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-04",
      nameCN: "活动物料与展台设计",
      nameEN: "Event Materials / Booth Design",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      stages: [
        { id: "design-brief", nameCN: "需求简报", nameEN: "Design Brief", status: "Completed", dueDate: "", completedDate: "" },
        { id: "initial-design", nameCN: "初版设计", nameEN: "Initial Design", status: "Completed", dueDate: "", completedDate: "" },
        { id: "review-revision", nameCN: "审核与修改", nameEN: "Review & Revision", status: "Completed", dueDate: "2026-10-29", completedDate: "" },
        { id: "final-artwork", nameCN: "最终画稿", nameEN: "Final Artwork", status: "Completed", dueDate: "2026-10-30", completedDate: "" },
        { id: "onsite-completion", nameCN: "现场完成", nameEN: "Onsite Completion", status: "Completed", dueDate: "2026-11-18", completedDate: "" }
      ],
      currentStageId: "review-revision",
      owner: "TBD",
      dueDate: "2026-11-18",
      actualCompletionDate: "",
      latestUpdate: "按 ICCAD 2026 收尾口径，任务标记完成。",
      nextAction: "",
      remarks: "11/15新增确认：为演讲私密性采用屏风半遮挡方案；已归档展台方案和屏风提案。全遮挡不获主办/场馆允许；提案为两侧各一组折叠屏风，并保留间隙。该记录仅表示方案选择，不代表采购、安装或验收完成。下一步现场核对视线、通道和屏幕效果。"
    },
    {
      workstreamId: "ICCAD26-WS-05",
      nameCN: "现场执行",
      nameEN: "Onsite Operation",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      stages: [
        { id: "participants-confirmation", nameCN: "人员统计", nameEN: "Participants Confirmation", status: "Completed", dueDate: "2026-10-31", completedDate: "" },
        { id: "onsite-readiness", nameCN: "现场准备验收", nameEN: "Onsite Readiness", status: "Completed", dueDate: "2026-11-18", completedDate: "" },
        { id: "event-execution", nameCN: "展期执行与撤场清点", nameEN: "Event Execution & Teardown Check", status: "Completed", dueDate: "2026-11-20", completedDate: "" }
      ],
      currentStageId: "participants-confirmation",
      owner: "TBD",
      dueDate: "2026-11-20",
      actualCompletionDate: "",
      latestUpdate: "按 ICCAD 2026 收尾口径，任务标记完成。",
      nextAction: "",
      remarks: "11/15执行资料已归档：会议议程、展台方案、屏风提案及演讲稿v4（HQ review）。现场准备应加入半遮挡屏风视线与通道检查，并核对最终演讲稿、排期及播放链路。尚无上述现场测试、安装或验收完成证据；保留原有协作进度、负责人及DDL。"
    },
    {
      workstreamId: "ICCAD26-WS-06",
      nameCN: "赞助",
      nameEN: "Sponsorship",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "Completed",
      progress: 100,
      owner: "TBD",
      dueDate: "2026-10-30",
      actualCompletionDate: "",
      latestUpdate: "按 ICCAD 2026 收尾口径，任务标记完成。",
      nextAction: "",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-07",
      nameCN: "报价",
      nameEN: "Quotation",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "Completed",
      progress: 100,
      owner: "TBD",
      dueDate: "2026-10-29",
      actualCompletionDate: "",
      latestUpdate: "按 ICCAD 2026 收尾口径，任务标记完成。",
      nextAction: "",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-08",
      nameCN: "合同",
      nameEN: "Contract",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "Completed",
      progress: 100,
      owner: "TBD",
      dueDate: "2026-10-30",
      actualCompletionDate: "",
      latestUpdate: "按 ICCAD 2026 收尾口径，任务标记完成。",
      nextAction: "",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-09",
      nameCN: "付款",
      nameEN: "Payment",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "Completed",
      progress: 100,
      owner: "TBD",
      dueDate: "2026-11-12",
      actualCompletionDate: "",
      latestUpdate: "按 ICCAD 2026 收尾口径，任务标记完成。",
      nextAction: "",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-10",
      nameCN: "社媒传播",
      nameEN: "Social Communication",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      status: "Completed",
      progress: 100,
      stages: [
        { id: "planning-draft", nameCN: "计划初稿", nameEN: "Planning Draft", status: "Completed", dueDate: "2026-10-30", completedDate: "" },
        { id: "draft", nameCN: "内容初稿", nameEN: "Content Draft", status: "Completed", dueDate: "2026-11-12", completedDate: "" },
        { id: "publish", nameCN: "发布", nameEN: "Publish", status: "Completed", dueDate: "2026-11-16", completedDate: "" }
      ],
      currentStageId: "planning-draft",
      owner: "TBD",
      dueDate: "2026-11-16",
      actualCompletionDate: "",
      latestUpdate: "按 ICCAD 2026 收尾口径，任务标记完成。",
      nextAction: "",
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
      progress: null,
      notRequired: true,
      owner: "TBD",
      dueDate: "2026-10-30",
      actualCompletionDate: "",
      latestUpdate: "ICCAD 2026 不需要此项。",
      nextAction: "",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-12",
      nameCN: "会后报告",
      nameEN: "Post-event Report",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      status: "Completed",
      progress: 100,
      stages: [
        { id: "data-collection", nameCN: "数据收集", nameEN: "Data Collection", status: "Completed", dueDate: "2026-11-23", completedDate: "" },
        { id: "report-draft", nameCN: "报告初稿", nameEN: "Report Draft", status: "Completed", dueDate: "2026-11-25", completedDate: "" },
        { id: "final-report", nameCN: "最终报告", nameEN: "Final Report", status: "Completed", dueDate: "2026-11-27", completedDate: "" }
      ],
      currentStageId: "data-collection",
      owner: "TBD",
      dueDate: "2026-11-27",
      actualCompletionDate: "",
      latestUpdate: "按 ICCAD 2026 收尾口径，任务标记完成。",
      nextAction: "",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-13",
      nameCN: "会后问卷",
      nameEN: "Post-event Survey",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      status: "Planning",
      progress: 0,
      requiresOverlayRegistration: true,
      owner: "TBD",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "会后问卷待开展；与现场 VOC 分开跟踪。",
      nextAction: "确认问卷范围、发送对象和时间。",
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
      status: "Completed",
      remarks: ""
    }
  ],

  finalDocuments: []
};
