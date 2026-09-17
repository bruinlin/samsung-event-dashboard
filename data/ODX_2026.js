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
    lastUpdated: "2026-09-09",
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
    eventScale: "8,000㎡ Exhibition Area · 5,726 Event Visitors (+201.8% YoY)",
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
    themeCN: "开放 AI Infra，普惠算力赋能",
    themeEN: "Open AI Infra, Empowering Inclusive Computing",
    boothArea: "36㎡",
    boothNumber: "B9",
    boothLayout: "Four-side-open / 四面开口",
    detailedAgenda: "Completed / 已完成",
    overallStatus: "Completed",
    reportStatus: "Completed",
    showcaseLabel: "Physical / Technology Showcase / 实物与技术展示",
    showcasedProducts: ["PM1763", "BM1773", "CMM-D"],
    systemDemoVideos: ["FDP", "NVMe Large Atomic", "CXL"],
    demoFormat: "Pre-recorded video playback / 预录视频播放",
    resultMetrics: [
      {
        label: "Booth Visitors / 展位访问",
        value: "1,752",
        note: "+20% YoY · Samsung Booth B9 · 3 event days"
      },
      {
        label: "On-site Forum Attendees / 现场论坛参与人次",
        value: "~60 Peak",
        note: "20 min Q&A · 7 questioners"
      },
      {
        label: "New Followers / 新增粉丝",
        value: "+333",
        note: "+20.8% follower growth · +694 likes & saves"
      },
      {
        label: "PR Article Coverage / PR文章覆盖数量",
        value: "64",
        note: ">9.78M potential audience"
      }
    ],
    officialWebsite: "https://www.odx.top/",
    sessionsSubtitle: "主论坛、官方分论坛、现场技术论坛与领奖环节",
    currentSummary: "ODX 2026 completed on 4 September. The event recorded 5,726 visitors (+201.8% YoY) across an 8,000㎡ exhibition area. As Diamond Sponsor, Samsung delivered a Main Forum Keynote, Official Breakout Session, 60-minute Booth On-site Tech Forum, PM1763 / BM1773 / CMM-D showcase, three pre-recorded system demos, three ODX awards, TMTPost expert interview, KOL coverage and full social communication. Samsung Booth B9 recorded 1,752 visitors (+20% YoY). The Main Forum Keynote drew approximately 1,000 attendees, while the On-site Tech Forum reached a peak audience of around 60 and generated a 20-minute Q&A with seven attendees raising questions. PR generated 64 pieces of same-day coverage with >9.78M potential audience, while rednote gained +333 followers and +694 likes & saves. zNAND-O remained Keynote-only and was not a Booth exhibit."
  },

  keynote: {
    speaker: "Jay Hyun",
    speakerCN: "玄在雄",
    title: "CVP, NAND Product Planning, Samsung Electronics",
    titleCN: "三星电子副总裁兼NAND闪存规划与赋能事业部负责人",
    date: "2026-09-03",
    time: "10:30-10:45",
    topicEN: "Beyond the Memory Wall: Rearchitecting the Data Path for Agentic AI",
    topicCN: "突破内存墙：重构面向智能体 AI 的数据通路",
    status: "Completed"
  },

  workstreams: [
    {
      workstreamId: "ODX26-WS-01",
      nameCN: "活动基本信息",
      nameEN: "Event Basic Information",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "Bruin",
      dueDate: "2026-08-10",
      actualCompletionDate: "",
      latestUpdate: "ODX 2026 completed on 4 September at China National Convention Center Phase II. Final event scale: 8,000㎡ exhibition area and 5,726 visitors (+201.8% YoY).",
      nextAction: "Closed / No further action.",
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
      latestUpdate: "Jay Hyun / 玄在雄, Dou Kun / 豆坤, He Xing / 何兴 and Michael Feng / 冯方 completed their confirmed ODX 2026 speaking engagements.",
      nextAction: "Closed / No further action.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-03",
      nameCN: "Keynote / KN",
      nameEN: "Main Forum Keynote",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      stages: [
        { id: "initial-draft", nameCN: "初稿", nameEN: "Initial Draft", status: "Completed", dueDate: "2026-08-10", completedDate: "" },
        { id: "first-washing", nameCN: "第一次 Washing", nameEN: "First Washing", status: "Completed", dueDate: "2026-08-14", completedDate: "" },
        { id: "internal-review", nameCN: "复审", nameEN: "Internal Review", status: "Completed", dueDate: "2026-08-19", completedDate: "" },
        { id: "second-revision", nameCN: "第二次修改", nameEN: "Second Revision", status: "Completed", dueDate: "2026-08-24", completedDate: "" },
        { id: "final-approval", nameCN: "最终确认", nameEN: "Final Approval", status: "Completed", dueDate: "2026-08-26", completedDate: "" }
      ],
      currentStageId: "final-approval",
      owner: "Bruin & Leo",
      dueDate: "2026-08-26",
      actualCompletionDate: "",
      latestUpdate: "Jay Hyun delivered 'Beyond the Memory Wall: Rearchitecting the Data Path for Agentic AI' on 3 September to approximately 1,000 attendees. zNAND-O remained Keynote-only technical content.",
      nextAction: "Closed / No further action.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-04",
      nameCN: "报价",
      nameEN: "Quotation",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "Completed",
      progress: 100,
      owner: "媛媛 & Dennis",
      dueDate: "2026-08-10",
      actualCompletionDate: "",
      latestUpdate: "Quotation process closed for ODX 2026.",
      nextAction: "Closed / No further action.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-05",
      nameCN: "合同",
      nameEN: "Contract",
      categoryId: "business-commercial",
      categoryNameCN: "商务与商业管理",
      categoryNameEN: "Business & Commercial",
      status: "Completed",
      progress: 100,
      owner: "媛媛 & Dennis",
      dueDate: "2026-09-20",
      actualCompletionDate: "",
      latestUpdate: "Contract process closed for ODX 2026.",
      nextAction: "Closed / No further action.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-06",
      nameCN: "活动物料 / Booth 设计",
      nameEN: "Event Materials / Booth Design",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "媛媛 & Dennis",
      dueDate: "2026-08-14",
      actualCompletionDate: "",
      latestUpdate: "Samsung Booth B9 (36㎡, four-side-open) completed with PM1763, BM1773 and CMM-D showcase, plus FDP, NVMe Large Atomic and CXL pre-recorded system demos.",
      nextAction: "Closed / No further action.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-07",
      nameCN: "社媒传播",
      nameEN: "Social Communication",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      status: "Completed",
      progress: 100,
      workflow: "social-publication",
      stages: [
        { id: "planning-draft", workflowStep: "planning", nameCN: "传播计划", nameEN: "Planning", status: "Completed", dueDate: "2026-08-19", completedDate: "" },
        { id: "draft", workflowStep: "draft", nameCN: "内容初稿", nameEN: "Draft", status: "Completed", dueDate: "", completedDate: "" },
        { id: "publish", workflowStep: "publish", nameCN: "发布", nameEN: "Publish", status: "Completed", dueDate: "", completedDate: "" }
      ],
      currentStageId: "publish",
      owner: "Seloma",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "Social communication completed: +333 followers (+20.8%), +694 likes & saves (+43.6%), 366 interactive participants and 237 PM1763 preferences (64.8%).",
      nextAction: "Closed / No further action.",
      remarks: "KOL 智能纪元 AGI completed Booth B9, product showcase, Jay Hyun Main Forum Keynote and On-site Tech Forum coverage with one original short video published on 4 September. Final Social links are available in Resources & Documents."
    },
    {
      workstreamId: "ODX26-WS-08",
      nameCN: "PR / 媒体",
      nameEN: "PR & Media",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      status: "Completed",
      progress: 100,
      owner: "Iris & Christy",
      dueDate: "2026-09-02",
      actualCompletionDate: "",
      latestUpdate: "PR completed: official press release published on 3 September; 64 same-day media coverage pieces generated >9.78M potential audience. TMTPost technical discussion completed with He Xing and Michael Feng.",
      nextAction: "Closed / No further action.",
      remarks: "Official press release: 三星半导体亮相 2026 首届算博会，以创新存储方案赋能智能体 AI\nTMTPost / 钛媒体 technical discussion: CXL / KV Cache, inference-driven enterprise SSD demand, PM1763 / PCIe Gen6 and AiSIO. Final link is available in Resources & Documents."
    },
    {
      workstreamId: "ODX26-WS-09",
      nameCN: "现场执行",
      nameEN: "Onsite Operation",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "Bruin",
      dueDate: "",
      actualCompletionDate: "",
      latestUpdate: "On-site Tech Forum completed on 3 September, 15:00–16:00. He Xing and Michael Feng presented to a peak audience of approximately 60; Q&A ran approximately 20 minutes with seven attendees raising questions.",
      nextAction: "Closed / No further action.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-10",
      nameCN: "礼品",
      nameEN: "Gifts",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "TBD",
      dueDate: "2026-08-06",
      actualCompletionDate: "",
      latestUpdate: "On-site Tech Forum gifts were well received. Gift distribution completed.",
      nextAction: "Closed / No further action.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-11",
      nameCN: "产品信息与资产",
      nameEN: "Product Information & Assets",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "TBD",
      dueDate: "2026-08-14",
      actualCompletionDate: "",
      latestUpdate: "Final physical / technology showcase completed: PM1763, BM1773 and CMM-D. Final pre-recorded system demo categories: FDP, NVMe Large Atomic and CXL.",
      nextAction: "Closed / No further action.",
      remarks: "ODCC co-created technical publications: 《让存储成为 AI 计算的新引擎：三星的 AI 存储战略全景》; 《KV Cache 和 CXL 内存池化…三星 CXL 内存与存储技术新探索》; 《从“疯狂吃盘”到高效推理：三星如何解决 AI 推理的“存储焦虑”》."
    },
    {
      workstreamId: "ODX26-WS-12",
      nameCN: "活动议程与人员明细收集",
      nameEN: "Event Agenda & Personnel Details",
      categoryId: "event-operations-content",
      categoryNameCN: "活动执行与内容交付",
      categoryNameEN: "Event Operations & Content",
      status: "Completed",
      progress: 100,
      owner: "TBD",
      dueDate: "2026-08-25",
      actualCompletionDate: "",
      latestUpdate: "Final Samsung agenda completed: Award Ceremony 9:50–10:10 on 2 September; Main Forum Keynote 10:30–10:45 on 3 September; On-site Tech Forum 15:00–16:00 on 3 September; Official Breakout Session 15:20–15:40 on 4 September.",
      nextAction: "Closed / No further action.",
      remarks: ""
    },
    {
      workstreamId: "ODX26-WS-13",
      nameCN: "会后报告",
      nameEN: "Post-event Report",
      categoryId: "social-pr-reporting",
      categoryNameCN: "传播、公关与报告",
      categoryNameEN: "Social, PR & Reporting",
      status: "Completed",
      progress: 100,
      stages: [
        { id: "report-draft", nameCN: "报告初稿", nameEN: "Report Draft", status: "Completed", dueDate: "2026-08-31", completedDate: "" },
        { id: "final-report", nameCN: "最终报告", nameEN: "Final Report", status: "Completed", dueDate: "2026-09-03", completedDate: "" }
      ],
      currentStageId: "final-report",
      owner: "TBD",
      dueDate: "2026-09-03",
      actualCompletionDate: "",
      latestUpdate: "Final ODX 2026 Post-event Report completed on 9 Sep with final event results, PR/Social performance, VOC, industry analysis and booth benchmark.",
      nextAction: "Closed / No further action.",
      remarks: "Final observations: TMTPost received the Keynote technical substance well; improve China-audience resonance next time through bilingual slides, brief Chinese opening / closing remarks and Chinese-language derivative assets. On-site Tech Forum gifts were well received; use numbered tickets or post-session redemption for future large-crowd distribution. Industry themes: AI Inference & Token Economics; Cross-Layer Memory & Storage Tiering; Ecosystem Competition & Technical Visibility."
    }
  ],

  sessions: [
    {
      sessionId: "ODX-AWARD-01",
      type: "ODX Opening Ceremony / Award Ceremony",
      speaker: "Kevin Yoon",
      role: "Samsung Representative",
      topicEN: "",
      topicCN: "",
      date: "2026-09-02",
      time: "09:50-10:10",
      status: "Completed",
      awards: [
        { category: "2026 ODX Industry Leader / 领军人物", recipient: "Kevin Yoon" },
        { category: "2026 ODX Breakthrough Project / 突破项目", recipient: "PM1763 PCIe Gen6 SSD" },
        { category: "2026 ODX Pioneer Enterprise / 先锋企业", recipient: "Samsung Semiconductor" }
      ],
      remarks: "Samsung Award Ceremony completed on 2 September, 09:50–10:10."
    },
    {
      sessionId: "ODX-SESSION-01",
      type: "Official Breakout Session / 官方分论坛",
      speaker: "Dou Kun / 豆坤",
      role: "Senior Project Manager, Samsung Semiconductor (China)",
      topicEN: "Decoupling, Sharing, Efficiency: Scenario Verification of CXL Memory Pooling",
      topicCN: "解耦·共享·增效：CXL 内存池化的场景验证",
      date: "2026-09-04",
      time: "15:20-15:40",
      status: "Completed",
      remarks: "Storage System Forum · 2F, Room 253 · Core focus: CXL memory pooling, shared / disaggregated memory, scenario validation and AI memory expansion."
    },
    {
      sessionId: "ODX-ONSITE-01",
      type: "On-site Tech Forum / 现场技术论坛",
      date: "2026-09-03",
      time: "15:00-16:00",
      duration: "60 min",
      format: "Technical Forum / 技术论坛",
      status: "Completed",
      overallTopics: [
        "CXL / KV Cache",
        "MoE Offloading",
        "FDP SSD",
        "QLC Atomic Write",
        "AiSIO"
      ],
      participants: [
        {
          speaker: "何兴",
          role: "Technical Director of the Storage Solution Department, Samsung R&D Institute Xi'an",
          topicEN: "CXL Optimized KV Cache Solution",
          topicCN: "CXL 优化的 KV Cache 解决方案",
          subTopics: [
            "Samsung CMM-D based Memory Pooling",
            "CXL Switch based KV Cache Solution",
            "CXL Memory Pooling performance benefit"
          ]
        },
        {
          speaker: "Michael Feng",
          speakerCN: "冯方",
          role: "Director of Memory Strategic Planning, Samsung Semiconductor",
          topicEN: "Feeding Storage to Accelerators: AiSIO",
          topicCN: ""
        }
      ],
      remarks: "Completed 60-minute On-site Tech Forum. Peak audience: approximately 60. Q&A: approximately 20 minutes with seven attendees raising questions."
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

  resourceLinks: [
    {
      id: "ODX-LINK-PR-001",
      nameCN: "钛媒体技术讨论",
      nameEN: "TMTPost Technical Discussion",
      provider: "TMTPost / 钛媒体",
      descriptionCN: "何兴与 Michael Feng 围绕 CXL / KV Cache、企业级 SSD、PM1763 / PCIe Gen6 及 AiSIO 的技术讨论。",
      descriptionEN: "Final technical discussion article.",
      url: "https://www.tmtpost.com/8133976.html",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-KOL-001",
      nameCN: "智能纪元 AGI 微信视频号",
      nameEN: "Intelligent Era AGI · WeChat Channels",
      provider: "WeChat Channels",
      descriptionCN: "ODX 2026 KOL 原创短视频。",
      descriptionEN: "KOL original short video.",
      url: "https://channels.weixin.qq.com/finder-preview/pages/sph?id=A2r1iJiqzM",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-KOL-002",
      nameCN: "智能纪元 AGI 小红书",
      nameEN: "Intelligent Era AGI · rednote",
      provider: "rednote",
      descriptionCN: "ODX 2026 KOL 内容。",
      descriptionEN: "KOL coverage.",
      url: "https://xhslink.cn/o/6gv34xAa9xR",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-KOL-003",
      nameCN: "AI 科技研究员小红书",
      nameEN: "AI Technology Researcher · rednote",
      provider: "rednote",
      descriptionCN: "ODX 2026 KOL 内容。",
      descriptionEN: "KOL coverage.",
      url: "https://xhslink.cn/o/728V9wUOLHj",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-001",
      nameCN: "预热海报 · 微博",
      nameEN: "Warm-up Poster · Weibo",
      provider: "Weibo",
      descriptionCN: "ODX 2026 社媒预热内容。",
      descriptionEN: "Published social content.",
      url: "https://weibo.com/7546687857/RfiDql5Px",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-002",
      nameCN: "预热海报 · 微信",
      nameEN: "Warm-up Poster · WeChat",
      provider: "WeChat",
      descriptionCN: "ODX 2026 社媒预热内容。",
      descriptionEN: "Published social content.",
      url: "https://mp.weixin.qq.com/s/ejSUubofmjL05mkKsd3G6w",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-003",
      nameCN: "预热海报 · 小红书",
      nameEN: "Warm-up Poster · rednote",
      provider: "rednote",
      descriptionCN: "ODX 2026 社媒预热内容。",
      descriptionEN: "Published social content.",
      url: "https://xhslink.cn/o/2ZdHqcuazLB",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-004",
      nameCN: "一图读懂 · 微博",
      nameEN: "At-a-Glance Infographic · Weibo",
      provider: "Weibo",
      descriptionCN: "ODX 2026 一图读懂。",
      descriptionEN: "Published social content.",
      url: "https://weibo.com/7546687857/5339024929330436",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-005",
      nameCN: "一图读懂 · 微信",
      nameEN: "At-a-Glance Infographic · WeChat",
      provider: "WeChat",
      descriptionCN: "ODX 2026 一图读懂。",
      descriptionEN: "Published social content.",
      url: "https://mp.weixin.qq.com/s/ozyKZgLelcQI0WdH7WCSgA",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-006",
      nameCN: "一图读懂 · 小红书",
      nameEN: "At-a-Glance Infographic · rednote",
      provider: "rednote",
      descriptionCN: "ODX 2026 一图读懂。",
      descriptionEN: "Published social content.",
      url: "https://xhslink.cn/o/6slFtAdRbCU",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-007",
      nameCN: "新闻稿 · 微信",
      nameEN: "Press Release · WeChat",
      provider: "WeChat",
      descriptionCN: "三星半导体亮相 2026 首届算博会，以创新存储方案赋能智能体 AI。",
      descriptionEN: "Official press release.",
      url: "https://mp.weixin.qq.com/s/5Cfs5qKdF9eUsmS5BiZcZw",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-008",
      nameCN: "高光时刻 · 微博",
      nameEN: "Event Highlights · Weibo",
      provider: "Weibo",
      descriptionCN: "ODX 2026 活动高光内容。",
      descriptionEN: "Published social content.",
      url: "https://weibo.com/7546687857/5339128459952427",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-009",
      nameCN: "高光时刻 · 微信",
      nameEN: "Event Highlights · WeChat",
      provider: "WeChat",
      descriptionCN: "ODX 2026 活动高光内容。",
      descriptionEN: "Published social content.",
      url: "https://mp.weixin.qq.com/s/7tqU4jfGX_AvXUxyVy0n_g",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-010",
      nameCN: "高光时刻 · 小红书",
      nameEN: "Event Highlights · rednote",
      provider: "rednote",
      descriptionCN: "ODX 2026 活动高光内容。",
      descriptionEN: "Published social content.",
      url: "https://xhslink.cn/o/77HDgulDzOM",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-011",
      nameCN: "回顾视频 · 微博",
      nameEN: "Recap Video · Weibo",
      provider: "Weibo",
      descriptionCN: "ODX 2026 回顾视频。",
      descriptionEN: "Published social content.",
      url: "https://weibo.com/7546687857/Rgzs7b8OX?pagetype=detail",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-012",
      nameCN: "回顾视频 · 微信",
      nameEN: "Recap Video · WeChat",
      provider: "WeChat",
      descriptionCN: "ODX 2026 回顾视频。",
      descriptionEN: "Published social content.",
      url: "https://mp.weixin.qq.com/s/8p8r45Ua3To1CGrMfIui5Q",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-013",
      nameCN: "回顾视频 · 小红书",
      nameEN: "Recap Video · rednote",
      provider: "rednote",
      descriptionCN: "ODX 2026 回顾视频。",
      descriptionEN: "Published social content.",
      url: "https://xhslink.cn/o/5BgbQCU1wOC",
      accessCode: "",
      status: "Published"
    },
    {
      id: "ODX-LINK-SOCIAL-014",
      nameCN: "金句视频 · 小红书",
      nameEN: "Quote Video · rednote",
      provider: "rednote",
      descriptionCN: "ODX 2026 金句视频，发布于 9 月 8 日。",
      descriptionEN: "Published social content.",
      url: "https://xhslink.cn/o/eLKiBXhPfA",
      accessCode: "",
      status: "Published"
    }
  ]
};
