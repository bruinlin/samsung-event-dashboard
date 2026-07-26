/*
  ODX 2026 数据维护说明
  ====================
  1. 直接更新 event、keynote、workstreams、milestones 和 sessions 对应字段。
  2. 普通任务使用 status 和 progress（0-100）；有 stages 的任务会由页面自动计算状态和进度。
  3. 未确认信息使用 "TBD"；未知日期保持空字符串，不要推测。
  4. 新增工作项时填写 categoryId、categoryNameCN、categoryNameEN；仅复杂任务配置 stages 和 currentStageId。
  5. workstreams[].dueDate 是任务 Final DDL；stages[].dueDate 是阶段计划 DDL。未知日期保持空字符串，不要用 completedDate 代替 dueDate。
  6. finalDocuments 仅登记已确认可公开下载的文件；当前没有文件时保持空数组。
*/

window.EVENT_DATASETS = window.EVENT_DATASETS || {};

window.EVENT_DATASETS.ODX_2026 = {
  meta: {
    schemaVersion: "1.8",
    lastUpdated: "2026-07-26",
    updatedBy: "Bruin"
  },

  event: {
    eventId: "ODX_2026",
    shortName: "ODX 2026",
    nameCN: "2026开放数据中心大会暨首届算博会",
    nameEN: "2026 Open Data Center Summit and Computing Power Expo",
    dateStart: "2026-09-02",
    dateEnd: "2026-09-02",
    city: "北京",
    venue: "北京国家会议中心二期",
    eventType: "行业技术大会",
    sponsorshipLevel: "钻石赞助/Diamond",
    participationForms: ["主论坛", "分论坛", "Booth"],
    boothArea: "36㎡",
    boothNumber: "TBD",
    detailedAgenda: "TBD",
    overallStatus: "In Progress",
    reportStatus: "Not Started",
    nextMilestone: "TBD",
    showcasedProducts: "TBD",
    resultMetrics: [],
    currentSummary: "2026 ODX 计划于 2026 年 9 月 2 日在北京国家会议中心二期举行。三星将以钻石赞助参与主论坛、分论坛及 Booth；分论坛、展出产品、展位号和详细议程等信息待确认。"
  },

  keynote: {
    speaker: "Jay Hyun",
    title: "CVP, NAND Product Planning, Samsung Electronics",
    topicEN: "TBD",
    topicCN: "TBD",
    status: "Not Started"
  },

  workstreams: [
    {
      workstreamId: "ODX26-WS-01",
      nameCN: "活动基本信息",
      nameEN: "Event Basic Information",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "In Progress",
      progress: 50,
      owner: "Bruin",
      dueDate: "2026-08-21",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "Complete and confirm the detailed agenda by August 21.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-02",
      nameCN: "Speaker / 演讲人确认",
      nameEN: "Speaker Confirmation",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "Bruin & Leo",
      dueDate: "2026-07-22",
      actualCompletionDate: "2026-07-22",
      latestUpdate: "Jay Hyun, CVP, NAND Product Planning, Samsung Electronics",
      nextAction: "/",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-03",
      nameCN: "Keynote / KN",
      nameEN: "Main Forum Keynote",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Not Started",
      progress: 0,
      stages: [
        { id: "initial-draft", nameCN: "初稿", nameEN: "Initial Draft", status: "Not Started", dueDate: "2026-08-10", completedDate: "" },
        { id: "first-washing", nameCN: "第一次 Washing", nameEN: "First Washing", status: "Not Started", dueDate: "2026-08-14", completedDate: "" },
        { id: "internal-review", nameCN: "复审", nameEN: "Internal Review", status: "Not Started", dueDate: "2026-08-19", completedDate: "" },
        { id: "second-revision", nameCN: "第二次修改", nameEN: "Second Revision", status: "Not Started", dueDate: "", completedDate: "" },
        { id: "final-approval", nameCN: "最终确认", nameEN: "Final Approval", status: "Not Started", dueDate: "2026-08-26", completedDate: "" }
      ],
      currentStageId: "initial-draft",
      owner: "Bruin & Leo",
      dueDate: "2026-08-26",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-04",
      nameCN: "报价",
      nameEN: "Quotation",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "In Progress",
      progress: 30,
      owner: "媛媛 & Dennis",
      dueDate: "2026-08-07",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-05",
      nameCN: "合同",
      nameEN: "Contract",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "In Progress",
      progress: 60,
      owner: "媛媛 & Dennis",
      dueDate: "2026-09-02",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-06",
      nameCN: "活动物料 / Booth 设计",
      nameEN: "Event Materials / Booth Design",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "In Progress",
      progress: 30,
      owner: "媛媛 & Dennis",
      dueDate: "2026-08-07",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-07",
      nameCN: "社媒传播",
      nameEN: "Social Communication",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      status: "Not Started",
      progress: 0,
      stages: [
        { id: "planning-draft", nameCN: "计划初稿", nameEN: "Planning Draft", status: "Not Started", dueDate: "2026-08-20", completedDate: "" }
      ],
      currentStageId: "planning-draft",
      owner: "Seloma",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-08",
      nameCN: "PR / 媒体",
      nameEN: "PR & Media",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      status: "Not Started",
      progress: 0,
      owner: "Iris & Christy",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-09",
      nameCN: "现场执行",
      nameEN: "Onsite Operation",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Not Started",
      progress: 0,
      owner: "Bruin",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    }
  ],

  milestones: [],

  sessions: [
    {
      sessionId: "ODX-SESSION-01",
      type: "Breakout Session",
      speaker: "TBD",
      role: "TBD",
      topicEN: "TBD",
      topicCN: "TBD",
      time: "TBD",
      status: "Not Started",
      remarks: ""
    }
  ],

  finalDocuments: []
};
