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
    lastUpdated: "2026-08-18",
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
    resultMetrics: [
      {
        label: "Booth Visitors / 展位访问",
        value: "TBD",
        note: "Total booth visitors during the event"
      },
      {
        label: "On-site Forum Attendees / 现场论坛参与人次",
        value: "TBD",
        note: "Total attendance across On-site Tech Forum sessions"
      },
      {
        label: "New Followers / 新增粉丝",
        value: "TBD",
        note: "New social followers generated during the event"
      },
      {
        label: "PR Article Coverage / PR文章覆盖数量",
        value: "TBD",
        note: "Number of published PR / media coverage articles"
      },
      {
        label: "Tech Article Views / 技术文章阅读量",
        value: "TBD",
        note: "Total views of the ODX technical article"
      }
    ],
    officialWebsite: "https://www.odx.top/",
    currentSummary: "2026 ODX 计划于 2026 年 9 月 2 日至 4 日在北京国家会议中心二期举行。三星将以钻石赞助参与主论坛、分论坛及 Booth；分论坛、展出产品、展位号和详细议程等信息待确认。"
  },

  keynote: {
    speaker: "Jay Hyun",
    speakerCN: "玄在雄",
    title: "CVP, NAND Product Planning, Samsung Electronics",
    titleCN: "三星电子解决方案产品与开发团队副总裁",
    date: "2026-09-03",
    time: "10:30-10:45",
    topicEN: "TBD",
    topicCN: "TBD",
    status: "In Progress"
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
      progress: 80,
      owner: "Bruin",
      dueDate: "2026-08-10",
      actualCompletionDate: "",
      latestUpdate: "Event dates, venue, Diamond sponsorship, Booth B9 and participation structure confirmed. Main Forum Keynote, Official Breakout Session and On-site Tech Forum information are now available.",
      nextAction: "Complete the remaining detailed agenda, booth program timing and other TBD event information.",
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
      latestUpdate: "Jay Hyun confirmed for Main Forum Keynote; 何兴 confirmed for Official Breakout Session; Michael Feng confirmed for On-site Tech Forum.",
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
      status: "In Progress",
      progress: 30,
      stages: [
        { id: "initial-draft", nameCN: "初稿", nameEN: "Initial Draft", status: "Completed", dueDate: "2026-08-10", completedDate: "" },
        { id: "first-washing", nameCN: "第一次 Washing", nameEN: "First Washing", status: "In Progress", dueDate: "2026-08-14", completedDate: "" },
        { id: "internal-review", nameCN: "复审", nameEN: "Internal Review", status: "Planning", dueDate: "2026-08-19", completedDate: "" },
        { id: "second-revision", nameCN: "第二次修改", nameEN: "Second Revision", status: "Planning", dueDate: "2026-08-24", completedDate: "" },
        { id: "final-approval", nameCN: "最终确认", nameEN: "Final Approval", status: "Planning", dueDate: "2026-08-26", completedDate: "" }
      ],
      currentStageId: "first-washing",
      owner: "Bruin & Leo",
      dueDate: "2026-08-26",
      actualCompletionDate: "",
      latestUpdate: "Keynote draft v0.2 is under development. Storyline currently covers Agentic AI, Token Economy, KV Cache, AI memory hierarchy, PCIe Gen6 / QLC SSD and zNAND-O. Multiple storyline, benchmark and animation revisions remain open.",
      nextAction: "Complete current content washing and resolve storyline bridges, final title, Kimi K3 benchmark, video revisions and remaining technical comments before internal review.",
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
      progress: 90,
      owner: "媛媛 & Dennis",
      dueDate: "2026-08-10",
      actualCompletionDate: "",
      latestUpdate: "Quotation is nearly finalized based on the latest ODX booth and operation scope. Only DSK confirmation remains outstanding.",
      nextAction: "Obtain final DSK confirmation and close the quotation.",
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
      latestUpdate: "Contract remains in progress. No newer confirmed signing milestone is available in the current project materials.",
      nextAction: "Confirm current contract approval/signing status and validate the final contract DDL, especially the current 2026-09-20 date.",
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
      progress: 60,
      owner: "媛媛 & Dennis",
      dueDate: "2026-08-14",
      actualCompletionDate: "",
      latestUpdate: "Booth Design V5 issued. Core 6m × 6m layout is established with central round showcase, 75-inch presentation screen, 65-inch signage, poster walls, reception and meeting/presentation area.",
      nextAction: "Confirm final system demo list and physical showcase list, then integrate technical content, On-site Forum operation and final display assets into the next booth revision.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-07",
      nameCN: "社媒传播",
      nameEN: "Social Communication",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      status: "In Progress",
      progress: 20,
      stages: [
        { id: "planning-draft", nameCN: "计划初稿", nameEN: "Planning Draft", status: "In Progress", dueDate: "2026-08-19", completedDate: "" }
      ],
      currentStageId: "planning-draft",
      owner: "Seloma",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "Initial booth social interaction mechanism has been proposed in the Operation Plan, including follow / like / comment interaction and gift incentive. Posting schedule remains pending Social team confirmation.",
      nextAction: "Complete the social planning draft by Aug. 19; confirm platform/posting schedule, session promotion, onsite CTA, content capture and gift interaction mechanics.",
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
      latestUpdate: "No confirmed PR / media execution plan has been identified in the current materials.",
      nextAction: "Define PR and media scope, pre-event / onsite / post-event communication plan, approval flow and relationship with the planned Tech Article.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-09",
      nameCN: "现场执行",
      nameEN: "Onsite Operation",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "In Progress",
      progress: 40,
      owner: "Bruin",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "Operation Plan draft is available, covering guest flow, booth interaction, materials, gift mechanics and initial Ogilvy onsite staffing. Michael Feng and five On-site Tech Forum topics are now confirmed.",
      nextAction: "Update the Operation Plan with latest forum/session information; finalize forum schedule, demo operation, staffing duty matrix, equipment list, rehearsal plan and onsite SOP.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-10",
      nameCN: "礼品",
      nameEN: "Gifts",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "In Progress",
      progress: 80,
      owner: "TBD",
      dueDate: "2026-08-06",
      actualCompletionDate: "",
      latestUpdate: "Final gift selection has been confirmed. Gift plan and usage are defined; procurement remains outstanding.",
      nextAction: "Complete gift procurement and confirm quantity, delivery schedule and onsite allocation.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-11",
      nameCN: "产品信息与资产",
      nameEN: "Product Information & Assets",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "In Progress",
      progress: 20,
      owner: "TBD",
      dueDate: "2026-08-14",
      actualCompletionDate: "",
      latestUpdate: "Physical showcase list is still under confirmation. Keynote content currently includes PM1763, 256TB QLC / BM1773 and zNAND-O technology, but the final booth display product list remains TBD.",
      nextAction: "Confirm the final physical showcase list with HQ / technical teams and collect approved product names, key messages, samples or mockups, images and public-use assets.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-12",
      nameCN: "活动议程与人员明细收集",
      nameEN: "Event Agenda & Personnel Details",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "In Progress",
      progress: 50,
      owner: "TBD",
      dueDate: "2026-08-25",
      actualCompletionDate: "",
      latestUpdate: "Main Forum Keynote is confirmed for Sep. 3 at 10:30–10:45. 何兴 is confirmed for the Sep. 4 Breakout Session and Michael Feng for the Sep. 3 On-site Tech Forum. Initial Ogilvy onsite staff list is available.",
      nextAction: "Confirm Breakout and On-site Forum time slots, speaker roles/titles, Samsung onsite personnel, full three-day run sheet and technical/demo staffing details.",
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
      latestUpdate: "Post-event reporting has not started. Current dashboard DDLs for report draft (Aug. 31) and final report (Sep. 3) occur before the event is completed and require confirmation.",
      nextAction: "Reconfirm report DDLs, define report structure and metrics, and assign onsite data/photo/result collection responsibilities before the event.",
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
