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
    lastUpdated: "2026-08-26",
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
    showcasedProducts: ["PM1763", "BM1773", "CMM-D", "zNAND-O stand card"],
    systemDemoVideos: ["FDP on LMCache", "NVMe Large Atomic in QLC SSDs", "CXL-related System Demo"],
    demoFormat: "Pre-recorded video playback · No onsite explanation / 预录视频播放 · 不安排现场讲解",
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
    currentSummary: "2026 ODX 将于 2026 年 9 月 2 日至 4 日在北京国家会议中心二期举行。三星将以 Diamond Sponsor 身份参与 Main Forum Keynote、Official Breakout Session、On-site Tech Forum、Booth、System Demo Videos 及 Tech Article。Samsung Booth B9（36㎡）将展示 PM1763、BM1773、CMM-D 及 zNAND-O stand card，并播放 FDP on LMCache、NVMe Large Atomic in QLC SSDs 和 CXL-related 三项预录系统 Demo。"
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
      latestUpdate: "Booth Design V5 issued. Core 6m × 6m layout is established with central round showcase, 75-inch presentation screen, 65-inch signage, poster walls, reception and meeting/presentation area.",
      latestUpdate: "Physical / technology showcase is confirmed: PM1763, BM1773, CMM-D and zNAND-O stand card. Three pre-recorded system demo videos are confirmed: FDP on LMCache, NVMe Large Atomic in QLC SSDs and a CXL-related system demo.",
      nextAction: "Finalize booth graphics, product / technology copy, zNAND-O stand card production, demo playback assets and On-site Tech Forum integration.",
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
      latestUpdate: "Booth social interaction mechanism is planned, and KOL booth tour with 智能纪元 is confirmed for ODX 2026.",
      nextAction: "Finalize social posting schedule, KOL booth-tour coordination, onsite content capture, CTA and gift interaction execution.",
      remarks: "KOL: 智能纪元. Final platform, onsite timing, content angle and publishing timing remain to be coordinated."
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
      latestUpdate: "Onsite PR interview with Micheal Feng / 冯方, Samsung Semiconductor Memory Strategy Planning Director, is confirmed. Detailed media, interview timing, questions and output format are under internal coordination.",
      nextAction: "Complete internal interview coordination and confirm media, timing, interview angle, onsite capture and follow-up coverage.",
      remarks: "Confirmed PR activity: onsite interview with Micheal Feng / 冯方. Execution details TBD."
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
      latestUpdate: "On-site Tech Forum is scheduled for Sep. 3, 15:00–15:30 (30 minutes), with 何兴 and Micheal Feng / 冯方 confirmed. The final format may be a technical dialogue and remains TBD. 何兴 will cover CXL Optimized KV Cache Solution; Micheal Feng will cover AiSIO. System demos are pre-recorded video playback with no dedicated onsite explanation.",
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
      latestUpdate: "Physical / technology showcase is confirmed: PM1763, BM1773, CMM-D and zNAND-O stand card. System demo videos are confirmed for FDP on LMCache, NVMe Large Atomic in QLC SSDs and a CXL-related solution.",
      nextAction: "Complete approved product / technology copy and assets, CMM-D messaging, zNAND-O stand-card artwork and the three final demo video files.",
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
      latestUpdate: "Kevin Yoon is confirmed as Samsung representative for the Award Ceremony; exact award name and time remain TBD. Main Forum Keynote is confirmed for Sep. 3 at 10:30–10:45. The On-site Tech Forum is scheduled for Sep. 3 at 15:00–15:30 with 何兴 and Micheal Feng / 冯方. 豆坤 is confirmed for the Sep. 4 Official Breakout Session at 15:40–16:00.",
      nextAction: "Confirm Award name / timing, final On-site interaction format, final organizer agenda, Samsung onsite personnel and the complete three-day run sheet.",
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
      latestUpdate: "Pre-event post-event-report skeleton has been prepared based on the OCTS format. The reporting narrative will prioritize Samsung's Technical Leadership across keynote, CXL / KV Cache, AiSIO, zNAND-O, CMM-D, SSD products, system demo videos and technical communications.",
      nextAction: "Reconfirm report DDLs and assign onsite evidence collection for Technical Leadership, including audience response, technical questions, demo / product interest, media interview, KOL coverage and final KPI results.",
      remarks: "Key Technical Leadership evidence to track onsite: zNAND-O first China industry-event/forum appearance after FMS 2026 global debut; Main Forum Keynote; On-site technical session; Official Breakout; product / technology showcase; recorded system demos; Micheal Feng interview; KOL booth tour."
    }
  ],

  sessions: [
    {
      sessionId: "ODX-AWARD-01",
      type: "Award Ceremony / 颁奖",
      speaker: "Kevin Yoon",
      role: "Samsung Representative",
      topicEN: "TBD",
      topicCN: "TBD",
      date: "2026-09-02",
      time: "TBD",
      status: "Planning",
      remarks: "Kevin Yoon confirmed as Samsung representative. Exact award name and time remain TBD."
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
      remarks: "Shared 30-minute onsite technical session. Final interaction format remains TBD."
    }
  ],

  finalDocuments: [],

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
