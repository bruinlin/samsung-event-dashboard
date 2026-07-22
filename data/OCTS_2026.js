/*
  OCTS 2026 数据维护说明
  =====================
  1. 修改状态：更新 workstreams[].status。
  2. 修改进度：progress 使用 0-100；Needs Update / Not Applicable 填写 null，页面显示“—”。
  3. 更新日期：修改 meta.lastUpdated（YYYY-MM-DD）及 meta.updatedBy。
  4. 增加模块：复制一条 workstreams 记录并使用新的 workstreamId。
  5. 负责人：修改 workstreams[].owner；页面仅显示姓名，不显示 Owner 字样。
  6. 详情：仅填写 workstreams[].remarks 或 comments；没有内容时保持空字符串。
  7. Key Documents：link 仅填写 OneDrive 或百度网盘共享链接；没有链接时保持空字符串。
  8. 活动结束后结果：在 event.resultMetrics 中增加或修改大标题栏结果数据。
  9. 展出产品：修改 event.showcasedProducts 数组。
  10. 有效状态：Not Started, In Progress, Internal Review, HQ Review,
     Pending Approval, Confirmed, In Production, Completed, Blocked,
     Needs Update, Not Applicable。

  Dashboard 不再维护或展示风险、信息来源及信息确认程度字段。
*/

window.EVENT_DATASETS = window.EVENT_DATASETS || {};

window.EVENT_DATASETS.OCTS_2026 = {
  meta: {
    schemaVersion: "1.4",
    lastUpdated: "2026-07-20",
    updatedBy: "待补充"
  },

  event: {
    eventId: "OCTS_2026",
    shortName: "OCTS 2026",
    nameCN: "2026开放计算技术大会",
    nameEN: "Open Compute Tech Summit 2026",
    dateStart: "2026-07-09",
    dateEnd: "2026-07-09",
    city: "北京",
    venue: "北京国际饭店 / Beijing International Hotel",
    eventType: "行业技术峰会 / 钻石合作伙伴参展",
    overallStatus: "Completed",
    reportStatus: "Final controlled copy archived",
    nextMilestone: "完成剩余 20% 付款并补录文件链接",
    showcasedProducts: ["PM1763", "BM1773", "SOCAMM2"],
    resultMetrics: [
      { label: "Booth Visitors / 展位访问", value: "460–500", note: "Estimated visitors" },
      { label: "New Followers / 新增粉丝", value: "+213", note: "Xiaohongshu · Event day" }
    ],
    currentSummary: "活动于 2026 年 7 月 9 日在北京国际饭店举行。三星完成主论坛 Keynote 和两场分论坛演讲，展位访问约 460–500 人次；展出产品为 PM1763、BM1773 和 SOCAMM2。合同、社媒传播及 PR 已完成，付款进度为 80%。"
  },

  keynote: {
    speaker: "Sunghoon Chun / 田成勳",
    title: "Vice President, Solution Product & Development Team, Samsung Electronics",
    topicEN: "Solving the Context Explosion: Next-Gen Flash Storage for Agentic AI Era",
    topicCN: "破解超长上下文挑战：面向智能体 AI 时代的下一代闪存存储",
    status: "Completed"
  },

  workstreams: [
    {
      workstreamId: "OCTS26-WS-01",
      nameCN: "活动基本信息",
      nameEN: "Event Basic Information",
      status: "Completed",
      progress: 100,
      owner: "Bruin",
      dueDate: "2026-07-09",
      actualCompletionDate: "",
      latestUpdate: "活动基本信息已全部完成。",
      nextAction: "无；如活动信息发生变化再更新。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-02",
      nameCN: "Speaker / 演讲人确认",
      nameEN: "Speaker Confirmation",
      status: "Confirmed",
      progress: 100,
      owner: "Bruin & Leo",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "主论坛及两场分论坛演讲人、职务和主题均已确认。",
      nextAction: "如存在 Speaker Information Collection Form，请补充归档。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-03",
      nameCN: "Keynote / KN",
      nameEN: "Main Forum Keynote",
      status: "Completed",
      progress: 100,
      owner: "Bruin & Leo",
      dueDate: "2026-07-09",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "中英文最终版及讲稿已归档；主论坛演讲已完成，时间为 11:05-11:15。",
      nextAction: "无执行动作；后续仅在有新版本时更新。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-04",
      nameCN: "分论坛演讲",
      nameEN: "Breakout Sessions",
      status: "Completed",
      progress: 100,
      owner: "Bruin & Leo",
      dueDate: "2026-07-09",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "KV Cache Offloading 与 CXL Memory Pooling / Compute Offloading 两场分论坛已完成。",
      nextAction: "无执行动作；保留最终版材料。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-05",
      nameCN: "报价",
      nameEN: "Quotation",
      status: "Confirmed",
      progress: 100,
      owner: "媛媛 & Dennis",
      dueDate: "",
      actualCompletionDate: "2026-06-22",
      latestUpdate: "报价单及 2026 年 6 月 22 日正式确认邮件已归档。",
      nextAction: "后续仅在发生商业变更时更新；主页面不展示金额。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-06",
      nameCN: "合同",
      nameEN: "Contract",
      status: "Completed",
      progress: 100,
      owner: "媛媛 & Dennis",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "合同工作已完成。",
      nextAction: "补充合同完成日期及云盘文件链接。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-07",
      nameCN: "Booth 设计",
      nameEN: "Booth Design",
      status: "Completed",
      progress: 100,
      owner: "媛媛 & Dennis",
      dueDate: "2026-07-08",
      actualCompletionDate: "",
      latestUpdate: "最终展位效果图已归档；现场展位完成并展示 PM1763、BM1773 和 SOCAMM2。",
      nextAction: "补录设计冻结的实际日期与最终审批人。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-08",
      nameCN: "礼品",
      nameEN: "Gifts",
      status: "Completed",
      progress: 100,
      owner: "Bruin",
      dueDate: "2026-07-09",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "活动结束前 300 份准备礼品全部发放。",
      nextAction: "如需财务或库存对账，补充最终采购及发放清单。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-09",
      nameCN: "产品领奖",
      nameEN: "Product Award",
      status: "Completed",
      progress: 100,
      owner: "Bruin & Leo",
      dueDate: "2026-07-09",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "Samsung 获得 Open Compute Best Innovation Award，由 Kevin Yoon 代表领奖。",
      nextAction: "确认奖项与 PM1763 的正式产品关联文件，并补充证书或奖杯照片。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-10",
      nameCN: "现场执行",
      nameEN: "Onsite Operation",
      status: "Completed",
      progress: 100,
      owner: "Bruin",
      dueDate: "2026-07-09",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "主论坛、分论坛、展位、社媒互动及领奖均已完成。",
      nextAction: "如需完整复盘，补充现场签到、执行表和照片索引。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-11",
      nameCN: "社媒传播",
      nameEN: "Social Communication",
      status: "Completed",
      progress: 100,
      owner: "Seloma",
      dueDate: "2026-07-10",
      actualCompletionDate: "",
      latestUpdate: "社媒传播已完成。",
      nextAction: "如需复盘，补录最终发布链接和数据。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-12",
      nameCN: "会后报告",
      nameEN: "Post-event Report",
      status: "Completed",
      progress: 100,
      owner: "Christy",
      dueDate: "",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "会后报告 DOCX 和 PDF 已归档，报告更新时间为 7 月 9 日 22:30。",
      nextAction: "如后续补充社媒结果，应另存更新版本并保留当前版本。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-13",
      nameCN: "付款或报销",
      nameEN: "Payment / Reimbursement",
      status: "In Progress",
      progress: 80,
      owner: "媛媛 & Dennis",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "付款进度为 80%。",
      nextAction: "完成剩余 20%，并补录实际完成日期及凭证位置。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-14",
      nameCN: "展品与屏幕内容",
      nameEN: "Exhibit Content & Product Showcase",
      status: "Completed",
      progress: 100,
      owner: "媛媛 & Dennis",
      dueDate: "2026-07-09",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "PM1763、BM1773、SOCAMM2 已完成现场展示。",
      nextAction: "无执行动作；后续活动复用时更新产品清单。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-15",
      nameCN: "PR / 媒体跟踪",
      nameEN: "PR & Media Monitoring",
      status: "Completed",
      progress: 100,
      owner: "Iris & Christy",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "PR / 媒体跟踪已完成。",
      nextAction: "如有最终媒体清单，补录云盘链接。",
      remarks: ""
    }
  ],

  milestones: [
    { milestoneId: "M-01", date: "2026-06-20", titleCN: "内部费用审批完成", status: "Completed", remarks: "" },
    { milestoneId: "M-02", date: "2026-06-22", titleCN: "报价确认邮件", status: "Confirmed", remarks: "" },
    { milestoneId: "M-03", date: "2026-07-02", titleCN: "执行手册版本归档", status: "Confirmed", remarks: "" },
    { milestoneId: "M-04", date: "2026-07-06", titleCN: "Keynote 与分论坛最终材料归档", status: "Completed", remarks: "" },
    { milestoneId: "M-05", date: "2026-07-08", titleCN: "Booth 搭建目标", status: "Confirmed", remarks: "" },
    { milestoneId: "M-06", date: "2026-07-09", titleCN: "活动日 / 主论坛 / 分论坛 / 领奖", status: "Completed", remarks: "" },
    { milestoneId: "M-07", date: "2026-07-09", titleCN: "会后报告数据截点", status: "Completed", remarks: "" },
    { milestoneId: "M-08", date: "2026-07-10", titleCN: "Recap video 计划发布", status: "Needs Update", remarks: "" },
    { milestoneId: "M-09", date: "", titleCN: "Speaker 确认日期", status: "Confirmed", remarks: "" },
    { milestoneId: "M-10", date: "", titleCN: "合同签署", status: "Completed", remarks: "" },
    { milestoneId: "M-11", date: "", titleCN: "Booth 设计冻结", status: "Completed", remarks: "" },
    { milestoneId: "M-12", date: "", titleCN: "付款 / 报销完成", status: "In Progress", remarks: "" }
  ],

  sessions: [
    {
      sessionId: "S-01",
      type: "Main Forum",
      speaker: "Sunghoon Chun / 田成勳",
      role: "Vice President, Solution Product & Development Team, Samsung Electronics",
      topicEN: "Solving the Context Explosion: Next-Gen Flash Storage for Agentic AI Era",
      topicCN: "破解超长上下文挑战：面向智能体 AI 时代的下一代闪存存储",
      time: "11:05-11:15",
      status: "Completed",
      remarks: ""
    },
    {
      sessionId: "S-02",
      type: "Breakout Session · Data Center Infrastructure Forum",
      speaker: "Sungup Moon / 文盛業",
      role: "Manager, NAND Application Engineering Team, Memory Business, Samsung Electronics",
      topicEN: "KV Cache Offloading: Enabling AI Inference Scaling",
      topicCN: "KV 缓存卸载：助力 AI 推理规模扩展",
      time: "14:05-14:25",
      status: "Completed",
      remarks: ""
    },
    {
      sessionId: "S-03",
      type: "Breakout Session · Open System Design Forum",
      speaker: "Sinae Hwang / 黄时来; Dong Fei / 董飞",
      role: "Manager, NAND Application Engineering Team; Manager, Intelligent Solution Team, Samsung Electronics",
      topicEN: "Tiered Memory Architecture: CXL Memory Pooling and Compute Offloading in Agentic AI",
      topicCN: "分层内存架构：Agent AI 中的 CXL 内存池化与计算卸载",
      time: "14:25-14:45",
      status: "Completed",
      remarks: ""
    },
    {
      sessionId: "S-04",
      type: "Award",
      speaker: "Kevin Yoon",
      role: "Vice President and CTO of Memory Business, Samsung Semiconductor China",
      topicEN: "Open Compute Best Innovation Award",
      topicCN: "Open Compute Best Innovation Award（产品关联待复核）",
      time: "12:05-12:15",
      status: "Completed",
      remarks: ""
    }
  ],

  documents: [
    { documentId: "D-01", name: "Final Keynote · CN", status: "Confirmed", link: "", comments: "" },
    { documentId: "D-02", name: "Final Keynote · EN", status: "Confirmed", link: "", comments: "" },
    { documentId: "D-03", name: "Speaker Information Collection Form", status: "Needs Update", link: "", comments: "" },
    { documentId: "D-04", name: "Breakout Deck · KV Cache Offloading", status: "Confirmed", link: "", comments: "" },
    { documentId: "D-05", name: "Breakout Deck · CXL Memory Pooling", status: "Confirmed", link: "", comments: "" },
    { documentId: "D-06", name: "Final Quotation", status: "Confirmed", link: "", comments: "" },
    { documentId: "D-07", name: "Quotation Confirmation", status: "Confirmed", link: "", comments: "" },
    { documentId: "D-08", name: "Signed Contract", status: "Needs Update", link: "", comments: "" },
    { documentId: "D-09", name: "Booth Final Design", status: "Confirmed", link: "", comments: "" },
    { documentId: "D-10", name: "Booth Content Video", status: "Confirmed", link: "", comments: "" },
    { documentId: "D-11", name: "Operation Manual", status: "Confirmed", link: "", comments: "" },
    { documentId: "D-12", name: "Event Photos", status: "Needs Update", link: "", comments: "" },
    { documentId: "D-13", name: "Post-event Report · PDF", status: "Confirmed", link: "", comments: "" },
    { documentId: "D-14", name: "Post-event Report · DOCX", status: "Confirmed", link: "", comments: "" }
  ]
};
