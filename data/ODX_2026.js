/*
  ODX 2026 数据维护说明
  ====================
  1. 直接更新 event、keynote、workstreams 和 sessions 对应字段。
  2. 普通任务使用 status 和 progress（0-100）；有 stages 的任务Status由Stage派生，Workstream Progress由Editor/Admin人工维护，Stage completion仅作为参考。
  3. 未确认信息使用 "TBD"；未知日期保持空字符串，不要推测。
  4. 新增工作项时填写 categoryId、categoryNameCN、categoryNameEN；仅复杂任务配置 stages 和 currentStageId。
  5. workstreams[].dueDate 是任务 Final DDL；stages[].dueDate 是阶段计划 DDL。未知日期保持空字符串，不要用 completedDate 代替 dueDate。
  6. finalDocuments 仅保留公开安全的静态文件元数据；私有 Preview / Final PDF 由本地管理员脚本上传至 Supabase，数据文件中不得写入私有路径或签名链接。
*/

window.EVENT_DATASETS = window.EVENT_DATASETS || {};

window.EVENT_DATASETS.ODX_2026 = {
  meta: {
    schemaVersion: "1.8",
    lastUpdated: "2026-08-28",
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
    organizer: "ODCC / Open Data Center Committee",
    eventScale: "25 Keynotes · 184 Sessions · 3-day event",
    eventType: "行业技术大会",
    sponsorshipLevel: "Diamond Sponsor / 钻石赞助",
    participationForms: [
      "Main Forum Keynote / 主论坛演讲",
      "Official Breakout Session / 官方分论坛",
      "On-site Tech Forum / 现场技术论坛",
      "System Demo Videos / 系统 Demo 视频",
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
    showcaseLabel: "Physical / Technology Showcase / 实物与技术展示",
    showcasedProducts: ["PM1763", "BM1773", "CMM-D"],
    systemDemoVideos: ["CXL Memory Pooling", "MoE Offloading Project", "MySQL + QLC Project", "KV Cache with Seamless FDP"],
    demoFormat: "Pre-recorded video playback / 预录视频播放",
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
    sessionsSubtitle: "主论坛、官方分论坛、现场技术论坛与领奖环节",
    currentSummary: "2026 ODX 将于 2026 年 9 月 2 日至 4 日在北京国家会议中心二期举行，共设置 25 场 Keynote 和 184 场 Session。三星将以 Diamond Sponsor 身份参与 Main Forum Keynote、Official Breakout Session、On-site Tech Forum、Booth、System Demo Videos 及 Tech Article。Samsung Booth B9（36㎡）将展示 PM1763、BM1773 及 CMM-D / CXL，并播放 CXL Memory Pooling、MoE Offloading Project、MySQL + QLC Project 和 KV Cache with Seamless FDP 预录系统 Demo。zNAND-O 仅作为 Main Forum Keynote 技术内容呈现，不安排 Booth 展示。"
  },

  keynote: {
    speaker: "Jay Hyun",
    speakerCN: "玄在雄",
    title: "CVP, NAND Product Planning, Samsung Electronics",
    titleCN: "三星电子副总裁兼NAND闪存规划与赋能事业部负责人",
    date: "2026-09-03",
    time: "10:30-10:45",
    topicEN: "Beyond the Memory Wall: Rearchitecting the Data Path for Agentic AI",
    topicCN: "突破内存墙：重构智能体 AI 数据路径",
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
      latestUpdate: "Organizer 0824 V1 preliminary agenda is available. Event dates, new venue at China National Convention Center Phase II, Diamond sponsorship, Booth B9, Main Forum Keynote, Official Breakout Session and Sep. 3 On-site Tech Forum timing are now available.",
      nextAction: "Track organizer agenda revisions and confirm the final three-day agenda, Award details and any remaining organizer-side timing changes.",
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
      latestUpdate: "Jay Hyun / 玄在雄 confirmed for Main Forum Keynote; 豆坤 confirmed for Official Breakout Session; 何兴 and Micheal Feng / 冯方 confirmed for the Sep. 3 On-site Tech Forum.",
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
      latestUpdate: "Keynote title is confirmed as 'Beyond the Memory Wall: Rearchitecting the Data Path for Agentic AI'. First-washing v0.3 has received DSK feedback. Current revisions cover memory hierarchy, benchmark consistency, zNAND-O storyline, video treatment and production QA.",
      nextAction: "Incorporate DSK feedback and complete the remaining benchmark, video and production revisions while retaining the confirmed keynote title and speaker information.",
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
      latestUpdate: "Booth Design V5 issued. Core 6m × 6m layout is established with central round showcase, 75-inch presentation screen, 65-inch signage, poster walls, reception and meeting/presentation area. Physical / technology showcase is confirmed: PM1763, BM1773 and CMM-D / CXL. Pre-recorded system demo videos are confirmed: CXL Memory Pooling, MoE Offloading Project, MySQL + QLC Project and KV Cache with Seamless FDP.",
      nextAction: "Finalize booth graphics, PM1763 / BM1773 / CMM-D showcase assets, demo playback assets and On-site Tech Forum integration.",
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
      workflow: "social-publication",
      stages: [
        { id: "planning-draft", workflowStep: "planning", nameCN: "传播计划", nameEN: "Planning", status: "In Progress", dueDate: "2026-08-19", completedDate: "" },
        { id: "draft", workflowStep: "draft", nameCN: "内容初稿", nameEN: "Draft", status: "Planning", dueDate: "", completedDate: "" },
        { id: "publish", workflowStep: "publish", nameCN: "发布", nameEN: "Publish", status: "Planning", dueDate: "", completedDate: "" }
      ],
      currentStageId: "planning-draft",
      owner: "Seloma",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "KOL booth exploration with 智能纪元AGI is confirmed for ODX 2026.",
      nextAction: "Finalize social posting schedule, KOL booth-exploration coordination, onsite content capture, CTA and gift interaction execution.",
      remarks: "KOL: 智能纪元AGI\nFormat: Booth Exploration / 探展\nOnsite timing, publishing timing, platform details, content angle and final metrics remain TBD."
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
      latestUpdate: "Onsite PR interview by TMTPost / 钛媒体 with Micheal Feng / 冯方 is confirmed.",
      nextAction: "Complete TMTPost / 钛媒体 interview coordination, including timing, interview angle, questions, onsite capture and follow-up coverage.",
      remarks: "Confirmed PR: TMTPost / 钛媒体 × Micheal Feng / 冯方\nRole: Samsung Semiconductor Memory Strategy Planning Director / 三星半导体 Memory 战略规划总监\nExact interview time, questions, angle, output format, publication timing and coverage result remain TBD."
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
      latestUpdate: "On-site Tech Forum is scheduled for Sep. 3, 15:00–15:30 (30 minutes), with 何兴 and Micheal Feng / 冯方 confirmed. The final format may be a technical dialogue and remains TBD. 何兴 will cover CXL Optimized KV Cache Solution; Micheal Feng will cover AiSIO. Booth system demos are pre-recorded video playback and align with the On-site presentation content by 何兴.",
      nextAction: "Confirm the final dialogue / presentation format, speaker flow or moderator arrangement, finalize demo-video playback setup, staffing, equipment, rehearsal and onsite SOP.",
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
      latestUpdate: "Physical / technology showcase is confirmed: PM1763, BM1773 and CMM-D / CXL. System demo videos are confirmed for CXL Memory Pooling, MoE Offloading Project, MySQL + QLC Project and KV Cache with Seamless FDP.",
      nextAction: "Complete approved product / technology copy and assets, CMM-D messaging and the four final demo video files.",
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
      latestUpdate: "Sep. 2 Opening Ceremony includes three confirmed Samsung awards; exact Samsung award presentation timing remains TBD. Main Forum Keynote is confirmed for Sep. 3 at 10:30–10:45. The On-site Tech Forum is scheduled for Sep. 3 at 15:00–15:30 with 何兴 and Micheal Feng / 冯方. 豆坤 is confirmed for the Sep. 4 Official Breakout Session at 15:40–16:00.",
      nextAction: "Confirm exact Award presentation timing, final On-site interaction format, final organizer agenda, Samsung onsite personnel and the complete three-day run sheet.",
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
      latestUpdate: "Pre-event post-event-report skeleton has been prepared based on the OCTS format. The reporting narrative will prioritize Samsung's Technical Leadership across the Main Forum Keynote, zNAND-O storyline inside the keynote, On-site Tech Forum, Official Breakout, PM1763 / BM1773 / CMM-D Booth Showcase, pre-recorded system demos, TMTPost / 钛媒体 interview, 智能纪元AGI booth exploration and Tech Article.",
      nextAction: "Reconfirm report DDLs and assign onsite evidence collection for Technical Leadership, including audience response, technical questions, demo / product interest, media interview, KOL coverage and final KPI results.",
      remarks: "Reporting logic: zNAND-O is Keynote-only technical content. Booth showcase: PM1763 / BM1773 / CMM-D. System Demo: CXL Memory Pooling / MoE Offloading Project / MySQL + QLC Project / KV Cache with Seamless FDP. Key Technical Leadership evidence to track onsite: Main Forum Keynote; zNAND-O storyline inside keynote; On-site Tech Forum; Official Breakout; PM1763 / BM1773 / CMM-D Booth Showcase; pre-recorded system demos; TMTPost / 钛媒体 interview with Micheal Feng / 冯方; 智能纪元AGI booth exploration; Tech Article."
    }
  ],

  sessions: [
    {
      sessionId: "ODX-AWARD-01",
      type: "ODX Opening Ceremony / Award Ceremony",
      speaker: "Kevin Yoon",
      role: "Samsung Representative",
      topicEN: "TBD",
      topicCN: "TBD",
      date: "2026-09-02",
      time: "TBD",
      status: "Planning",
      awards: [
        { category: "Annual Leading Figure", recipient: "CVP Kevin Yoon" },
        { category: "Annual Breakthrough Project", recipient: "PM1763 PCIe Gen6 SSD" },
        { category: "Annual Pioneer Enterprise", recipient: "Shanghai Samsung Semiconductor" }
      ],
      remarks: "Samsung will receive three confirmed awards during the Sep. 2 AM Opening Ceremony. Exact Samsung award presentation timing remains TBD."
    },
    {
      sessionId: "ODX-SESSION-01",
      type: "Official Breakout Session / 官方分论坛",
      speaker: "豆坤",
      role: "三星（中国）半导体有限公司高级项目经理",
      topicEN: "TBD",
      topicCN: "解耦·共享·增效：CXL 内存池化的场景验证",
      date: "2026-09-04",
      time: "15:40-16:00",
      status: "Planning",
      remarks: ""
    },
    {
      sessionId: "ODX-ONSITE-01",
      type: "On-site Tech Forum / 现场技术论坛",
      date: "2026-09-03",
      time: "15:00-15:30",
      duration: "30 min",
      format: "TBD — Possible dialogue format / 形式待定，可能采用对话形式",
      status: "Planning",
      overallTopics: [
        "CXL Memory Pooling",
        "MoE Offloading Project",
        "MySQL + QLC Project",
        "KV Cache with Seamless FDP",
        "AiSIO"
      ],
      participants: [
        {
          speaker: "何兴",
          role: "西安三星电子研究所 存储解决方案部技术总监",
          topicEN: "CXL Optimized KV Cache Solution",
          topicCN: "CXL 优化的 KV Cache 解决方案",
          subTopics: [
            "Samsung CMM-D based Memory Pooling",
            "CXL Switch based KV Cache Solution",
            "CXL Memory Pooling performance benefit"
          ]
        },
        {
          speaker: "Micheal Feng",
          speakerCN: "冯方",
          role: "三星半导体 Memory 战略规划总监",
          topicEN: "Feeding Storage to Accelerators: AiSIO",
          topicCN: "TBD"
        }
      ],
      remarks: "Shared 30-minute onsite technical session. Overall technical scope: CXL Memory Pooling; MoE Offloading Project; MySQL + QLC Project; KV Cache with Seamless FDP; AiSIO. Final interaction format remains TBD."
    }
  ],

  finalDocuments: [
    {
      id: "ODX-DOC-001",
      nameZh: "ODX 2026 现场技术论坛 CXL 演示材料",
      nameEn: "ODX 2026 On-site Tech Forum · CXL",
      category: "Presentation",
      subcategory: "On-site Tech Forum",
      version: "Current",
      lifecycle: "Preview",
      finalDate: "",
      format: "PDF",
      fileSize: "1.6 MB",
      fileSizeBytes: 1647913,
      status: "Available",
      downloadable: true
    },
    {
      id: "ODX-DOC-002",
      nameZh: "ODX 2026 官方分论坛演讲材料",
      nameEn: "ODX 2026 Official Breakout Session · CXL Memory Pooling",
      category: "Presentation",
      subcategory: "Official Breakout Session",
      version: "Current",
      lifecycle: "Preview",
      finalDate: "",
      format: "PDF",
      fileSize: "3.0 MB",
      fileSizeBytes: 3193087,
      status: "Available",
      downloadable: true
    },
    {
      id: "ODX-DOC-003",
      nameZh: "ODX 2026 现场技术论坛 AiSIO 演示材料",
      nameEn: "ODX 2026 On-site Tech Forum · AiSIO",
      category: "Presentation",
      subcategory: "On-site Tech Forum",
      version: "Current",
      lifecycle: "Preview",
      finalDate: "",
      format: "PDF",
      fileSize: "2.7 MB",
      fileSizeBytes: 2817926,
      status: "Available",
      downloadable: true
    },
    {
      id: "ODX-DOC-004",
      nameZh: "Samsung @ ODX 2026 执行方案",
      nameEn: "Samsung @ ODX 2026 Operation Plan",
      category: "Event Plan",
      subcategory: "Operations",
      version: "Current",
      lifecycle: "Preview",
      finalDate: "",
      format: "PDF",
      fileSize: "10.5 MB",
      fileSizeBytes: 11052026,
      status: "Available",
      downloadable: true
    },
    {
      id: "ODX-DOC-005",
      nameZh: "ODX 2026 主论坛演讲中文稿 v0.8",
      nameEn: "ODX 2026 Main Forum Keynote · Chinese v0.8",
      category: "Presentation",
      subcategory: "Main Forum",
      version: "v0.8",
      lifecycle: "Preview",
      finalDate: "",
      format: "PDF",
      fileSize: "5.8 MB",
      fileSizeBytes: 6074742,
      status: "Available",
      downloadable: true
    },
    {
      id: "ODX-DOC-006",
      nameZh: "ODX 2026 主论坛演讲稿 v0.8",
      nameEn: "ODX 2026 Main Forum Keynote Script · v0.8",
      category: "Presentation",
      subcategory: "Main Forum",
      version: "v0.8",
      lifecycle: "Preview",
      finalDate: "",
      format: "PDF",
      fileSize: "109.7 KB",
      fileSizeBytes: 112292,
      status: "Available",
      downloadable: true
    }
  ],

  // 外部资料入口：后续只需填写 url 和（如适用）accessCode，无需修改前端或 Supabase。
  resourceLinks: [
    {
      id: "ODX-LINK-001",
      nameCN: "全部附件",
      nameEN: "All Attachments",
      provider: "Baidu Netdisk",
      descriptionCN: "ODX 2026 项目附件汇总，包括 Main Forum Keynote、On-site Tech Forum、Official Breakout Session、System Demo 及 Operation Plan。",
      descriptionEN: "ODX 2026 consolidated event materials.",
      url: "",
      accessCode: "",
      status: "TBD"
    },
    {
      id: "ODX-LINK-002",
      nameCN: "图片直播",
      nameEN: "Photo Live",
      provider: "Photo Live",
      descriptionCN: "ODX 2026 活动现场图片直播。",
      descriptionEN: "ODX 2026 onsite photo live gallery.",
      url: "",
      accessCode: "",
      status: "TBD"
    }
  ]
};
