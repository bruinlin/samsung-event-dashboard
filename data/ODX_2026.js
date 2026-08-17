/*
  ODX 2026 数据维护说明
  ====================
  1. 直接更新 event、keynote、workstreams 和 sessions 对应字段。
  2. 普通任务使用 status 和 progress（0-100）；有 stages 的任务Status由Stage派生，Workstream Progress由Editor/Admin人工维护，Stage completion仅作为参考。
  3. 未确认信息使用 "TBD"；未知日期保持空字符串，不要推测。
  4. 新增工作项时填写 categoryId、categoryNameCN、categoryNameEN；仅复杂任务配置 stages 和 currentStageId。
  5. workstreams[].dueDate 是任务 Final DDL；stages[].dueDate 是阶段计划 DDL。未知日期保持空字符串，不要用 completedDate 代替 dueDate。
  6. finalDocuments 仅登记已确认可公开下载的文件；当前没有文件时保持空数组。
*/

window.EVENT_DATASETS = window.EVENT_DATASETS || {};

window.EVENT_DATASETS.ODX_2026 = {
  meta: {
    schemaVersion: "1.8",
    lastUpdated: "2026-08-17",
    updatedBy: "Bruin"
  },

  event: {
    eventId: "ODX_2026",
    shortName: "ODX 2026",
    nameCN: "2026开放数据中心大会暨首届算博会",
    nameEN: "2026 Open Data Center Summit and Computing Power Expo",
    dateStart: "2026-09-02",
    dateEnd: "2026-09-04",
    city: "北京",
    venue: "北京国家会议中心二期",
    eventType: "行业技术大会",
    sponsorshipLevel: "Diamond Sponsor / 钻石赞助",
    participationForms: [
      "Main Forum Keynote / 主论坛演讲",
      "Official Breakout Session / 官方分论坛",
      "On-site Tech Forum / 现场技术论坛",
      "Hero Live Demo / Hero Live 演示",
      "Tech Article / 技术文章",
      "Booth"
    ],
    showParticipationInHero: true,
    themeCN: "开放AI Infra，普惠算力赋能",
    boothArea: "36㎡",
    boothNumber: "B9",
    detailedAgenda: "TBD",
    overallStatus: "In Progress",
    reportStatus: "Planning",
    showcasedProducts: "TBD",
    resultMetrics: [],
    officialWebsite: "https://www.odx.top/",
    currentSummary: "2026 ODX 计划于 2026 年 9 月 2 日至 4 日在北京国家会议中心二期举行。三星将以钻石赞助参与主论坛、分论坛及 Booth；分论坛、展出产品、展位号和详细议程等信息待确认。"
  },

  keynote: {
    speaker: "Jay Hyun",
    title: "CVP, NAND Product Planning, Samsung Electronics",
    date: "2026-09-03",
    time: "10:30-10:45",
    topicEN: "TBD",
    topicCN: "TBD",
    status: "Planning"
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
      dueDate: "2026-08-10",
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
      status: "Planning",
      progress: 0,
      stages: [
        { id: "initial-draft", nameCN: "初稿", nameEN: "Initial Draft", status: "Planning", dueDate: "2026-08-10", completedDate: "" },
        { id: "first-washing", nameCN: "第一次 Washing", nameEN: "First Washing", status: "Planning", dueDate: "2026-08-14", completedDate: "" },
        { id: "internal-review", nameCN: "复审", nameEN: "Internal Review", status: "Planning", dueDate: "2026-08-19", completedDate: "" },
        { id: "second-revision", nameCN: "第二次修改", nameEN: "Second Revision", status: "Planning", dueDate: "2026-08-24", completedDate: "" },
        { id: "final-approval", nameCN: "最终确认", nameEN: "Final Approval", status: "Planning", dueDate: "2026-08-26", completedDate: "" }
      ],
      currentStageId: "initial-draft",
      owner: "Bruin & Leo",
      dueDate: "2026-08-26",
      actualCompletionDate: "",
      latestUpdate: "Keynote draft v0.2 under development. Current storyline covers Agentic AI, Token Economy, KV Cache, AI memory hierarchy, PCIe Gen6 / QLC SSD and zNAND-O.",
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
      dueDate: "2026-08-10",
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
      dueDate: "2026-09-20",
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
      dueDate: "2026-08-14",
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
      status: "Planning",
      progress: 0,
      stages: [
        { id: "planning-draft", nameCN: "计划初稿", nameEN: "Planning Draft", status: "Planning", dueDate: "2026-08-19", completedDate: "" }
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
      status: "Planning",
      progress: 0,
      owner: "Iris & Christy",
      dueDate: "2026-09-02",
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
      status: "Planning",
      progress: 0,
      owner: "Bruin",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-10",
      nameCN: "礼品",
      nameEN: "Gifts",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Planning",
      progress: 0,
      owner: "TBD",
      dueDate: "2026-08-06",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-11",
      nameCN: "产品信息与资产",
      nameEN: "Product Information & Assets",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Planning",
      progress: 0,
      owner: "TBD",
      dueDate: "2026-08-14",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-12",
      nameCN: "活动议程与人员明细收集",
      nameEN: "Event Agenda & Personnel Details",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Planning",
      progress: 0,
      owner: "TBD",
      dueDate: "2026-08-25",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-13",
      nameCN: "会后报告",
      nameEN: "Post-event Report",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      status: "Planning",
      progress: 0,
      stages: [
        { id: "report-draft", nameCN: "报告初稿", nameEN: "Report Draft", status: "Planning", dueDate: "2026-08-31", completedDate: "" },
        { id: "final-report", nameCN: "最终报告", nameEN: "Final Report", status: "Planning", dueDate: "2026-09-03", completedDate: "" }
      ],
      currentStageId: "report-draft",
      owner: "TBD",
      dueDate: "2026-09-03",
      actualCompletionDate: "",
      latestUpdate: "TBD",
      nextAction: "TBD",
      remarks: ""
    }
  ],

  sessions: [
    {
      sessionId: "ODX-SESSION-01",
      type: "Breakout Session",
      speaker: "何兴",
      role: "TBD",
      topicEN: "TBD",
      topicCN: "解耦·共享·增效：CXL内存池化的场景验证",
      date: "2026-09-04",
      time: "TBD",
      status: "Planning",
      remarks: ""
    },
    {
      sessionId: "ODX-ONSITE-01",
      type: "On-site Tech Forum",
      speaker: "Michael Feng",
      role: "TBD",
      date: "2026-09-03",
      topicEN: "TBD",
      topicCN: "关于Server SSD在KV Cache Offloading场景下，应用FDP后所产生的效果",
      time: "TBD",
      status: "Planning",
      subTopics: [
        "CXL Memory Pooling",
        "MoE offloading Project",
        "MySQL+QLC project",
        "KV Cache with Seemless FDP",
        "AiSIO"
      ],
      remarks: ""
    }
  ],

  finalDocuments: []
};
