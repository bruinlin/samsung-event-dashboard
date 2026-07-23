/*
  ODX 2026 数据维护说明
  ====================
  1. 仅填写已确认的活动事实；未知字段保持“待补充”或空字符串。
  2. 修改状态时同步更新 progress、latestUpdate、nextAction、meta.lastUpdated 和 meta.updatedBy。
  3. Needs Update / Not Applicable 的 progress 使用 null；其他模块使用 0-100。
  4. 不要推测负责人、截止日期、实际完成日期、讲者、议题或文件。
  5. Final Documents 仅登记已确认且适合公开下载的文件；没有文件时保持空数组。
*/

window.EVENT_DATASETS = window.EVENT_DATASETS || {};

window.EVENT_DATASETS.ODX_2026 = {
  meta: {
    schemaVersion: "1.6",
    lastUpdated: "2026-07-23",
    updatedBy: "Bruin"
  },

  event: {
    eventId: "ODX_2026",
    shortName: "ODX 2026",
    nameCN: "ODX 2026",
    nameEN: "ODX 2026",
    dateStart: "2026-09-02",
    dateEnd: "2026-09-02",
    themeCN: "开放AI Infra，普惠算力赋能",
    themeEN: "",
    city: "待补充",
    venue: "待补充",
    eventType: "行业技术大会 / 筹备中",
    overallStatus: "In Progress",
    reportStatus: "Not Started",
    nextMilestone: "补充地点、演讲人及议程信息",
    showcasedProducts: [],
    resultMetrics: [],
    currentSummary: "ODX 2026 计划于 2026 年 9 月 2 日举办，大会主题为“开放AI Infra，普惠算力赋能”。当前已建立活动基础信息，其余场地、演讲人、议程和执行信息待补充。"
  },

  keynote: {
    speaker: "待补充",
    title: "待补充",
    topicEN: "待补充",
    topicCN: "待补充",
    status: "Needs Update"
  },

  workstreams: [
    {
      workstreamId: "ODX26-WS-01",
      nameCN: "活动基本信息",
      nameEN: "Event Basic Information",
      status: "In Progress",
      progress: 50,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "活动日期及大会主题已录入。",
      nextAction: "补充城市、具体场地、活动类型及主办方信息。",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-02",
      nameCN: "Speaker / 演讲人确认",
      nameEN: "Speaker Confirmation",
      status: "Not Started",
      progress: 0,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待补充",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-03",
      nameCN: "Keynote / KN",
      nameEN: "Main Forum Keynote",
      status: "Not Started",
      progress: 0,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待补充",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-04",
      nameCN: "分论坛演讲",
      nameEN: "Breakout Sessions",
      status: "Needs Update",
      progress: null,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待确认是否适用。",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-05",
      nameCN: "报价",
      nameEN: "Quotation",
      status: "Not Started",
      progress: 0,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待补充",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-06",
      nameCN: "合同",
      nameEN: "Contract",
      status: "Not Started",
      progress: 0,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待补充",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-07",
      nameCN: "Booth 设计",
      nameEN: "Booth Design",
      status: "Needs Update",
      progress: null,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待确认是否适用。",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-08",
      nameCN: "礼品",
      nameEN: "Gifts",
      status: "Needs Update",
      progress: null,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待确认是否适用。",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-09",
      nameCN: "产品领奖",
      nameEN: "Product Award",
      status: "Needs Update",
      progress: null,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待确认是否适用。",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-10",
      nameCN: "现场执行",
      nameEN: "Onsite Operation",
      status: "Not Started",
      progress: 0,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待补充",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-11",
      nameCN: "社媒传播",
      nameEN: "Social Communication",
      status: "Not Started",
      progress: 0,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待补充",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-12",
      nameCN: "会后报告",
      nameEN: "Post-event Report",
      status: "Not Started",
      progress: 0,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待补充",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-13",
      nameCN: "付款或报销",
      nameEN: "Payment / Reimbursement",
      status: "Not Started",
      progress: 0,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待补充",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-14",
      nameCN: "展品与屏幕内容",
      nameEN: "Exhibit Content & Product Showcase",
      status: "Needs Update",
      progress: null,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待确认是否适用。",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-15",
      nameCN: "PR / 媒体跟进",
      nameEN: "PR & Media Monitoring",
      status: "Not Started",
      progress: 0,
      owner: "待补充",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "待补充",
      nextAction: "待补充",
      remarks: ""
    }
  ],

  milestones: [
    { milestoneId: "M-01", date: "2026-07-23", titleCN: "活动日期及大会主题录入", status: "Confirmed", remarks: "" },
    { milestoneId: "M-02", date: "2026-09-02", titleCN: "ODX 2026 活动日", status: "Confirmed", remarks: "" },
    { milestoneId: "M-03", date: "", titleCN: "演讲人确认", status: "Needs Update", remarks: "" },
    { milestoneId: "M-04", date: "", titleCN: "Keynote 定稿", status: "Needs Update", remarks: "" },
    { milestoneId: "M-05", date: "", titleCN: "Booth 设计冻结", status: "Needs Update", remarks: "" },
    { milestoneId: "M-06", date: "", titleCN: "合同签署", status: "Needs Update", remarks: "" }
  ],

  sessions: [],
  finalDocuments: []
};
