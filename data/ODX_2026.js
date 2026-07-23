/*
  ODX 2026 数据维护说明
  ====================
  1. 直接更新 event、keynote、workstreams、milestones 和 sessions 对应字段。
  2. 所有状态使用既有状态值；完成度使用 0-100。
  3. 未确认信息使用 "TBD"；未知日期保持空字符串，不要推测。
  4. 新增或修改工作项时保留 workstreamId、负责人、日期、进度、更新和备注字段。
  5. finalDocuments 仅登记已确认可公开下载的文件；当前没有文件时保持空数组。
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
    overallStatus: "Not Started",
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
      status: "Not Started",
      progress: 0,
      owner: "Bruin",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-02",
      nameCN: "Speaker / 演讲人确认",
      nameEN: "Speaker Confirmation",
      status: "Not Started",
      progress: 0,
      owner: "Bruin & Leo",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-03",
      nameCN: "Keynote / KN",
      nameEN: "Main Forum Keynote",
      status: "Not Started",
      progress: 0,
      owner: "Bruin & Leo",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-04",
      nameCN: "分论坛演讲",
      nameEN: "Breakout Sessions",
      status: "Not Started",
      progress: 0,
      owner: "Bruin & Leo",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-05",
      nameCN: "报价",
      nameEN: "Quotation",
      status: "Not Started",
      progress: 0,
      owner: "媛媛 & Dennis",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-06",
      nameCN: "合同",
      nameEN: "Contract",
      status: "Not Started",
      progress: 0,
      owner: "媛媛 & Dennis",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-07",
      nameCN: "Booth 设计",
      nameEN: "Booth Design",
      status: "Not Started",
      progress: 0,
      owner: "媛媛 & Dennis",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-08",
      nameCN: "礼品",
      nameEN: "Gifts",
      status: "Not Started",
      progress: 0,
      owner: "Bruin",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-09",
      nameCN: "产品领奖",
      nameEN: "Product Award",
      status: "Not Started",
      progress: 0,
      owner: "Bruin & Leo",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-10",
      nameCN: "现场执行",
      nameEN: "Onsite Operation",
      status: "Not Started",
      progress: 0,
      owner: "Bruin",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-11",
      nameCN: "社媒传播",
      nameEN: "Social Communication",
      status: "Not Started",
      progress: 0,
      owner: "Seloma",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-12",
      nameCN: "会后报告",
      nameEN: "Post-event Report",
      status: "Not Started",
      progress: 0,
      owner: "Christy",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-13",
      nameCN: "付款或报销",
      nameEN: "Payment / Reimbursement",
      status: "Not Started",
      progress: 0,
      owner: "媛媛 & Dennis",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-14",
      nameCN: "展品与屏幕内容",
      nameEN: "Exhibit Content & Product Showcase",
      status: "Not Started",
      progress: 0,
      owner: "媛媛 & Dennis",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-15",
      nameCN: "PR / 媒体跟踪",
      nameEN: "PR & Media Monitoring",
      status: "Not Started",
      progress: 0,
      owner: "Iris & Christy",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    }
  ],

  milestones: [
    { milestoneId: "M-01", date: "2026-09-02", titleCN: "ODX 2026 活动日", status: "Not Started", remarks: "" }
  ],

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
