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
    lastUpdated: "2026-10-27",
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
      status: "In Progress",
      progress: 80,
      owner: "TBD",
      dueDate: "2026-10-30",
      actualCompletionDate: "",
      latestUpdate: "时间、场馆、54㎡展台及五项展示内容已明确；展商证及权益执行信息待核。80%为规划估算，非实际工时完成率。",
      nextAction: "10/30核对展商证及权益执行信息。日期说明：10/31参会统计表为已核实执行截止；其余新增任务及阶段DDL均为建议内部截止，按展期及往年经验倒排，待确认。展期保持11/19–20。",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-02",
      nameCN: "展台演讲",
      nameEN: "Booth Presentation",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      progress: 10,
      stages: [
        { id: "presenter-confirmation", nameCN: "演讲人确认", nameEN: "Presenter Confirmation", status: "In Progress", dueDate: "2026-10-30", completedDate: "" },
        { id: "topic-confirmation", nameCN: "主题确认", nameEN: "Topic Confirmation", status: "Planning", dueDate: "2026-10-30", completedDate: "" },
        { id: "initial-draft", nameCN: "初稿", nameEN: "Initial Draft", status: "Planning", dueDate: "2026-11-06", completedDate: "" },
        { id: "internal-review", nameCN: "内部审核", nameEN: "Internal Review", status: "Planning", dueDate: "2026-11-12", completedDate: "" },
        { id: "final-approval", nameCN: "最终确认", nameEN: "Final Approval", status: "Planning", dueDate: "2026-11-13", completedDate: "" },
        { id: "rehearsal", nameCN: "彩排", nameEN: "Rehearsal", status: "Planning", dueDate: "2026-11-18", completedDate: "" }
      ],
      currentStageId: "presenter-confirmation",
      owner: "TBD",
      dueDate: "2026-11-18",
      actualCompletionDate: "",
      latestUpdate: "展台演讲处于确认筹备，场次、人选及主题尚未确认。10%为规划估算，非实际工时完成率，不代表已启动邀约。",
      nextAction: "本模块全部DDL为建议内部截止，按展期及往年经验倒排，待确认：10/30确认场次、人选与主题；11/06讲者交稿内部目标，负责人待定；11/12内部审核；11/13最终确认；11/18彩排。",
      remarks: ""
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
      latestUpdate: "五项展品清单截至10/27已获用户确认：2.3D Cube-E、3D IC Cube-T/H、2nm GAA Wafer、All-in-one Heterogeneous、The Evolution of Transistors。100%仅指清单确认，不代表实物制作、到场或展示就绪。HPC 内容保留，Auto 内容缩减；本次 ICCAD 取消展品运输。",
      nextAction: "清单确认已完成；制作、借调、现场展示条件及验收由相关设计和现场执行环节继续核对。实际完成日期未确认，保持空白。",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-04",
      nameCN: "活动物料与展台设计",
      nameEN: "Event Materials / Booth Design",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      progress: 40,
      stages: [
        { id: "design-brief", nameCN: "需求简报", nameEN: "Design Brief", status: "Completed", dueDate: "", completedDate: "" },
        { id: "initial-design", nameCN: "初版设计", nameEN: "Initial Design", status: "Completed", dueDate: "", completedDate: "" },
        { id: "review-revision", nameCN: "审核与修改", nameEN: "Review & Revision", status: "In Progress", dueDate: "2026-10-29", completedDate: "" },
        { id: "final-artwork", nameCN: "最终画稿", nameEN: "Final Artwork", status: "Planning", dueDate: "2026-10-30", completedDate: "" },
        { id: "onsite-completion", nameCN: "现场完成", nameEN: "Onsite Completion", status: "Planning", dueDate: "2026-11-18", completedDate: "" }
      ],
      currentStageId: "review-revision",
      owner: "TBD",
      dueDate: "2026-11-18",
      actualCompletionDate: "",
      latestUpdate: "展台面积54㎡；需求简报与初版设计已有10/19记录，真实完成日期未知。大屏已收到2条视频，可播放，现场播放链路待测。40%为规划估算，非实际工时完成率。",
      nextAction: "本模块未完成项DDL为建议内部截止，按展期及往年经验倒排，待确认：10/29审核修改并纳入最新五项展品；10/30最终画稿；11/18现场完成与验收。视频收到不代表全部宣传物料完成。",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-05",
      nameCN: "现场执行",
      nameEN: "Onsite Operation",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "In Progress",
      progress: 15,
      stages: [
        { id: "participants-confirmation", nameCN: "人员统计", nameEN: "Participants Confirmation", status: "In Progress", dueDate: "2026-10-31", completedDate: "" },
        { id: "onsite-readiness", nameCN: "现场准备验收", nameEN: "Onsite Readiness", status: "Planning", dueDate: "2026-11-18", completedDate: "" },
        { id: "event-execution", nameCN: "展期执行与撤场清点", nameEN: "Event Execution & Teardown Check", status: "Planning", dueDate: "2026-11-20", completedDate: "" }
      ],
      currentStageId: "participants-confirmation",
      owner: "TBD",
      dueDate: "2026-11-20",
      actualCompletionDate: "",
      latestUpdate: "计划租赁约60㎡会议室，U型摆放，容纳约18人，尚待落实租赁。客户及三星参会名单确认中；10/31参会统计表为已核实执行截止。15%为规划估算，非实际工时完成率。",
      nextAction: "除10/31人员统计外，下列日期及本模块其余DDL均为建议内部截止，按展期及往年经验倒排，待确认：\n10/30会议室报价/预订与礼品方案、数量锁定；\n11/12执行手册、分工、讲座排期复核；\n11/13礼品印刷及耗材准备交运；\n11/16视频、大屏与PPT链路测试；\n11/17现场物料与展品展示条件核对；\n11/18验收，进场时间服从主办安排；\n11/20展期执行收尾与撤场清点。取消ICCAD展品运输不取消礼品物料配送、搭建或回收。",
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
      dueDate: "2026-10-30",
      actualCompletionDate: "",
      latestUpdate: "Diamond Sponsor / 钻石赞助。进度待核；0%为原始基线，不代表确认未启动。",
      nextAction: "10/30核对权益执行及证件安排。此DDL为建议内部截止，按展期及往年经验倒排，待确认。",
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
      dueDate: "2026-10-29",
      actualCompletionDate: "",
      latestUpdate: "2026报价及预算状态待核。进度待核；0%为原始基线，不代表确认未启动。",
      nextAction: "10/29核对报价与预算。此DDL为建议内部截止，按展期及往年经验倒排，待确认。",
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
      dueDate: "2026-10-30",
      actualCompletionDate: "",
      latestUpdate: "合同签署及采购安排状态待核。进度待核；0%为原始基线，不代表确认未启动。",
      nextAction: "10/30为核对并锁定签署、采购安排的内部目标。此DDL为建议内部截止，按展期及往年经验倒排，待确认，不代表合同已签。",
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
      dueDate: "2026-11-12",
      actualCompletionDate: "",
      latestUpdate: "付款事项状态待核。进度待核；0%为原始基线，不代表确认未启动。",
      nextAction: "11/12仅为付款事项复核的建议内部截止，按展期及往年经验倒排，待确认；实际付款期限以合同为准，本日期不是付款到期日。",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-10",
      nameCN: "社媒传播",
      nameEN: "Social Communication",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      progress: 0,
      stages: [
        { id: "planning-draft", nameCN: "计划初稿", nameEN: "Planning Draft", status: "Planning", dueDate: "2026-10-30", completedDate: "" },
        { id: "draft", nameCN: "内容初稿", nameEN: "Content Draft", status: "Planning", dueDate: "2026-11-12", completedDate: "" },
        { id: "publish", nameCN: "发布", nameEN: "Publish", status: "Planning", dueDate: "2026-11-16", completedDate: "" }
      ],
      currentStageId: "planning-draft",
      owner: "TBD",
      dueDate: "2026-11-16",
      actualCompletionDate: "",
      latestUpdate: "今年是否预热及发布范围待确认。进度待核；0%为原始基线，不代表确认未启动。",
      nextAction: "本模块全部DDL为建议内部截止，按展期及往年经验倒排，待确认：10/30确认发布需求与范围；11/12内容初稿、11/16发布仅在有发布需求时适用，未获批则取消计划，不构成发布承诺。",
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
      dueDate: "2026-10-30",
      actualCompletionDate: "",
      latestUpdate: "今年公关及媒体是否参与、具体范围待确认。进度待核；0%为原始基线，不代表确认未启动。",
      nextAction: "10/30确认今年公关/媒体是否参与及范围。此DDL为建议内部截止，按展期及往年经验倒排，待确认。",
      remarks: ""
    },
    {
      workstreamId: "ICCAD26-WS-12",
      nameCN: "会后报告",
      nameEN: "Post-event Report",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      progress: 0,
      stages: [
        { id: "data-collection", nameCN: "数据收集", nameEN: "Data Collection", status: "Planning", dueDate: "2026-11-23", completedDate: "" },
        { id: "report-draft", nameCN: "报告初稿", nameEN: "Report Draft", status: "Planning", dueDate: "2026-11-25", completedDate: "" },
        { id: "final-report", nameCN: "最终报告", nameEN: "Final Report", status: "Planning", dueDate: "2026-11-27", completedDate: "" }
      ],
      currentStageId: "data-collection",
      owner: "TBD",
      dueDate: "2026-11-27",
      actualCompletionDate: "",
      latestUpdate: "会后数据收集、初稿及最终报告保留Planning。进度待核；0%为原始基线，不代表确认未启动。",
      nextAction: "本模块全部DDL为建议内部截止，按展期及往年经验倒排，待确认：11/23数据收集；11/25报告初稿；11/27最终报告。",
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
