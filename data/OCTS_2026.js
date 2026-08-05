/*
  OCTS 2026 数据维护说明
  =====================
  1. 修改状态：更新 workstreams[].status。
  2. 修改进度：progress 使用 0-100；Needs Update / Not Applicable 填写 null，页面显示“—”。
  3. 更新日期：修改 meta.lastUpdated（YYYY-MM-DD）及 meta.updatedBy。
  4. 增加模块：复制一条 workstreams 记录并使用新的 workstreamId、categoryId、categoryNameCN 和 categoryNameEN。
  5. 负责人：修改 workstreams[].owner；页面仅显示姓名，不显示 Owner 字样。
  6. 详情：仅填写 workstreams[].remarks 或 comments；没有内容时保持空字符串。
  7. 文件与交付物：仅登记公开文件名称、状态和下载资格；受控 PDF 由 private event-files Bucket 提供短时授权链接，
     不填写 filePath、对象路径或下载链接。
  8. 活动结束后结果：在 event.resultMetrics 中增加或修改大标题栏结果数据。
  9. 展出产品：修改 event.showcasedProducts 数组。
  10. 最终交付文件：在 finalDocuments 中登记受控文件名称、格式、大小和状态；不要记录本地、Bucket或公开下载路径。
  11. 有效状态：Planning, In Progress, Under Review, Completed, Blocked。
  12. 阶段追踪：仅复杂任务添加 stages 和 currentStageId。阶段状态仅可使用
      Planning, In Progress, Under Review, Completed, Blocked；页面由Stage派生任务Status，Workstream Progress由Editor/Admin人工维护，Stage completion仅作为参考。
  13. DDL：workstreams[].dueDate 是任务 Final DDL；stages[].dueDate 是阶段计划 DDL。
      未确认日期保留空字符串，页面显示 Missing DDL；completedDate 仅记录实际完成日期，不能替代 dueDate。

  Dashboard 不再维护或展示风险、信息来源及信息确认程度字段。
*/

window.EVENT_DATASETS = window.EVENT_DATASETS || {};

window.EVENT_DATASETS.OCTS_2026 = {
  meta: {
    schemaVersion: "1.8",
    lastUpdated: "2026-07-23",
    updatedBy: "Bruin"
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
    reportStatus: "Completed",
    nextMilestone: "All workstreams completed",
    showcasedProducts: ["PM1763", "BM1773", "SOCAMM2"],
    officialWebsite: "https://ocpasia.org/",
    resultMetrics: [
      { label: "Booth Visitors / 展位访问", value: "460–500", note: "Estimated visitors" },
      { label: "New Followers / 新增粉丝", value: "+213", note: "Xiaohongshu · Event day" }
    ],
    currentSummary: "活动于 2026 年 7 月 9 日在北京国际饭店举行。三星已完成主论坛 Keynote、两场分论坛演讲、展位展示、礼品发放、产品领奖、社媒传播、PR、会后报告、合同及付款等全部活动模块；15 个 Workstream 均已完成。"
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
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "Bruin",
      dueDate: "2026-07-09",
      actualCompletionDate: "",
      latestUpdate: "活动基本信息已全部完成。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-02",
      nameCN: "Speaker / 演讲人确认",
      nameEN: "Speaker Confirmation",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "Bruin & Leo",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "主论坛及两场分论坛演讲人、职务、主题和相关信息均已确认并归档。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-03",
      nameCN: "Keynote / KN",
      nameEN: "Main Forum Keynote",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      stages: [
        { id: "initial-draft", nameCN: "初稿", nameEN: "Initial Draft", status: "Completed", dueDate: "", completedDate: "" },
        { id: "first-washing", nameCN: "第一次 Washing", nameEN: "First Washing", status: "Completed", dueDate: "", completedDate: "" },
        { id: "internal-review", nameCN: "复审", nameEN: "Internal Review", status: "Completed", dueDate: "", completedDate: "" },
        { id: "second-revision", nameCN: "第二次修改", nameEN: "Second Revision", status: "Completed", dueDate: "", completedDate: "" },
        { id: "final-approval", nameCN: "最终确认", nameEN: "Final Approval", status: "Completed", dueDate: "", completedDate: "" }
      ],
      currentStageId: "final-approval",
      status: "Completed",
      progress: 100,
      owner: "Bruin & Leo",
      dueDate: "2026-07-09",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "中英文最终版及讲稿已归档；主论坛演讲已完成，时间为 11:05-11:15。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-04",
      nameCN: "分论坛演讲",
      nameEN: "Breakout Sessions",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "Bruin & Leo",
      dueDate: "2026-07-09",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "KV Cache Offloading 与 CXL Memory Pooling / Compute Offloading 两场分论坛已完成。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-05",
      nameCN: "报价",
      nameEN: "Quotation",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "Completed",
      progress: 100,
      owner: "媛媛 & Dennis",
      dueDate: "",
      actualCompletionDate: "2026-06-22",
      latestUpdate: "最终报价及确认记录已完成并归档。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-06",
      nameCN: "合同",
      nameEN: "Contract",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "Completed",
      progress: 100,
      owner: "媛媛 & Dennis",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "合同工作已完成。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-07",
      nameCN: "Booth 设计",
      nameEN: "Booth Design",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      stages: [
        { id: "brief", nameCN: "需求简报", nameEN: "Brief", status: "Completed", dueDate: "", completedDate: "" },
        { id: "initial-design", nameCN: "初版设计", nameEN: "Initial Design", status: "Completed", dueDate: "", completedDate: "" },
        { id: "review-revision", nameCN: "审核与修改", nameEN: "Review & Revision", status: "Completed", dueDate: "", completedDate: "" },
        { id: "final-artwork", nameCN: "最终画稿", nameEN: "Final Artwork", status: "Completed", dueDate: "", completedDate: "" },
        { id: "onsite-completion", nameCN: "现场完成", nameEN: "Onsite Completion", status: "Completed", dueDate: "", completedDate: "" }
      ],
      currentStageId: "onsite-completion",
      status: "Completed",
      progress: 100,
      owner: "媛媛 & Dennis",
      dueDate: "2026-07-08",
      actualCompletionDate: "",
      latestUpdate: "最终展位效果图已归档；现场展位完成并展示 PM1763、BM1773 和 SOCAMM2。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-08",
      nameCN: "礼品",
      nameEN: "Gifts",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "Bruin",
      dueDate: "2026-07-09",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "活动结束前 300 份准备礼品全部发放。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-09",
      nameCN: "产品领奖",
      nameEN: "Product Award",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "Bruin & Leo",
      dueDate: "2026-07-09",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "Samsung 获得 Open Compute Best Innovation Award，由 Kevin Yoon 代表领奖。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-10",
      nameCN: "现场执行",
      nameEN: "Onsite Operation",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "Bruin",
      dueDate: "2026-07-09",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "主论坛、分论坛、展位、社媒互动及领奖均已完成。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-11",
      nameCN: "社媒传播",
      nameEN: "Social Communication",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      stages: [
        { id: "draft", nameCN: "初稿", nameEN: "Draft", status: "Completed", dueDate: "", completedDate: "" },
        { id: "review", nameCN: "审核", nameEN: "Review", status: "Completed", dueDate: "", completedDate: "" },
        { id: "published", nameCN: "发布", nameEN: "Published", status: "Completed", dueDate: "", completedDate: "" },
        { id: "performance-review", nameCN: "效果复盘", nameEN: "Performance Review", status: "Completed", dueDate: "", completedDate: "" }
      ],
      currentStageId: "performance-review",
      status: "Completed",
      progress: 100,
      owner: "Seloma",
      dueDate: "2026-07-10",
      actualCompletionDate: "",
      latestUpdate: "社媒传播已完成。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-12",
      nameCN: "会后报告",
      nameEN: "Post-event Report",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      stages: [
        { id: "data-collection", nameCN: "资料收集", nameEN: "Data Collection", status: "Completed", dueDate: "", completedDate: "" },
        { id: "drafting", nameCN: "报告初稿", nameEN: "Drafting", status: "Completed", dueDate: "", completedDate: "" },
        { id: "review", nameCN: "审核", nameEN: "Review", status: "Completed", dueDate: "", completedDate: "" },
        { id: "final-report", nameCN: "最终报告", nameEN: "Final Report", status: "Completed", dueDate: "", completedDate: "" }
      ],
      currentStageId: "final-report",
      status: "Completed",
      progress: 100,
      owner: "Christy",
      dueDate: "",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "会后报告 DOCX 和 PDF 已归档，报告更新时间为 7 月 9 日 22:30。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-13",
      nameCN: "付款或报销",
      nameEN: "Payment / Reimbursement",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "Completed",
      progress: 100,
      owner: "媛媛 & Dennis",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "付款及报销流程已全部完成，完成进度为 100%。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-14",
      nameCN: "展品与屏幕内容",
      nameEN: "Exhibit Content & Product Showcase",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "媛媛 & Dennis",
      dueDate: "2026-07-09",
      actualCompletionDate: "2026-07-09",
      latestUpdate: "PM1763、BM1773、SOCAMM2 已完成现场展示。",
      nextAction: "无；模块已完成。",
      remarks: ""
    },
    {
      workstreamId: "OCTS26-WS-15",
      nameCN: "PR / 媒体跟踪",
      nameEN: "PR & Media Monitoring",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      status: "Completed",
      progress: 100,
      owner: "Iris & Christy",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "PR / 媒体跟踪已完成。",
      nextAction: "无；模块已完成。",
      remarks: ""
    }
  ],

  milestones: [
    { milestoneId: "M-01", date: "2026-06-20", titleCN: "内部费用审批完成", status: "Completed", remarks: "" },
    { milestoneId: "M-02", date: "2026-06-22", titleCN: "报价确认邮件", status: "Completed", remarks: "" },
    { milestoneId: "M-03", date: "2026-07-02", titleCN: "执行手册版本归档", status: "Completed", remarks: "" },
    { milestoneId: "M-04", date: "2026-07-06", titleCN: "Keynote 与分论坛最终材料归档", status: "Completed", remarks: "" },
    { milestoneId: "M-05", date: "2026-07-08", titleCN: "Booth 搭建目标", status: "Completed", remarks: "" },
    { milestoneId: "M-06", date: "2026-07-09", titleCN: "活动日 / 主论坛 / 分论坛 / 领奖", status: "Completed", remarks: "" },
    { milestoneId: "M-07", date: "2026-07-09", titleCN: "会后报告数据截点", status: "Completed", remarks: "" },
    { milestoneId: "M-08", date: "2026-07-10", titleCN: "Recap video 计划发布", status: "Completed", remarks: "" },
    { milestoneId: "M-09", date: "", titleCN: "Speaker 确认日期", status: "Completed", remarks: "" },
    { milestoneId: "M-10", date: "", titleCN: "合同签署", status: "Completed", remarks: "" },
    { milestoneId: "M-11", date: "", titleCN: "Booth 设计冻结", status: "Completed", remarks: "" },
    { milestoneId: "M-12", date: "", titleCN: "付款 / 报销完成", status: "Completed", remarks: "" }
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

  finalDocuments: [
    {
      id: "OCTS-DOC-001",
      nameZh: "OCTS 2026 主论坛演讲中文最终版",
      nameEn: "OCTS 2026 Main Forum Keynote · Chinese Final",
      category: "Presentation",
      subcategory: "Main Forum",
      version: "Final",
      finalDate: "2026-07-06",
      format: "PDF",
      fileSize: "30.6 MB",
      fileSizeBytes: 32056302,
      descriptionZh: "田成勳主论坛演讲中文正式版本",
      descriptionEn: "Final Chinese main forum keynote presentation",
      speaker: "田成勳 / Sunghoon Chun",
      status: "Available",
      downloadable: true
    },
    {
      id: "OCTS-DOC-002",
      nameZh: "OCTS 2026 主论坛演讲英文最终版",
      nameEn: "OCTS 2026 Main Forum Keynote · English Final",
      category: "Presentation",
      subcategory: "Main Forum",
      version: "Final",
      finalDate: "2026-07-06",
      format: "PDF",
      fileSize: "31.4 MB",
      fileSizeBytes: 32916772,
      descriptionZh: "田成勳主论坛演讲英文正式版本",
      descriptionEn: "Final English main forum keynote presentation",
      speaker: "田成勳 / Sunghoon Chun",
      status: "Available",
      downloadable: true
    },
    {
      id: "OCTS-DOC-003",
      nameZh: "OCTS 2026 主论坛演讲稿最终版",
      nameEn: "OCTS 2026 Main Forum Speech Script · Final",
      category: "Presentation",
      subcategory: "Main Forum",
      version: "Final",
      finalDate: "2026-07-03",
      format: "PDF",
      fileSize: "115.4 KB",
      fileSizeBytes: 118124,
      descriptionZh: "田成勳主论坛演讲稿正式版本",
      descriptionEn: "Final main forum keynote speech script",
      speaker: "田成勳 / Sunghoon Chun",
      status: "Available",
      downloadable: true
    },
    {
      id: "OCTS-DOC-004",
      nameZh: "OCTS 2026 会后报告最终版",
      nameEn: "OCTS 2026 Post-event Report · Final",
      category: "Report",
      subcategory: "Post-event",
      version: "Final",
      finalDate: "2026-07-09",
      format: "PDF",
      fileSize: "10.8 MB",
      fileSizeBytes: 11276065,
      descriptionZh: "OCTS 2026 会后报告正式归档版本。",
      descriptionEn: "Final archived OCTS 2026 post-event report.",
      speaker: "",
      status: "Available",
      downloadable: true
    }
  ]
};
