/* Public event facts and approved aggregate outcomes only.
 * eventRouteId must match a deployed event in event_data.js.
 * Keep whole-event counts distinct from Samsung-specific measures. */
window.ANNUAL_OVERVIEW_2026 = [
  {
    code: "CFMS",
    title: "CFMS | MemoryS 2026",
    date: "2026.03.27",
    venue: "深圳前海华侨城 JW 万豪酒店",
    theme: "穿越周期，释放价值",
    talks: [{ speaker: "Silwan Chang（张实完）", title: "AI系统架构演进：驱动未来AI的存储技术 / Architecting AI Systems: Storage for the Next Generation of AI" }],
    metrics: [
      { label: "全展专业访客", value: "6,200+" },
      { label: "企业演讲听众", value: "约 1,800", note: "会后报告口径，非三星单场" },
      { label: "三星展台问卷参与者", value: "495", note: "不是展台到访人数" }
    ],
    note: "三星为铂金赞助商；PM1763 获 PCIe 6.0 年度创新先锋奖。"
  },
  {
    code: "AUTO",
    title: "Auto China 2026 · 北京车展",
    date: "2026.04.24–05.03",
    venue: "中国国际展览中心（顺义馆）及首都国际会展中心 · 北京",
    theme: "领时代·智未来",
    metrics: [
      { label: "全展参观人次", value: "128 万" },
      { label: "三星正式客户会议", value: "30 场" },
      { label: "三星客户及合作伙伴到访", value: "126 次", note: "含 30 场正式客户会议" },
      { label: "三星展位到访", value: "340 人次" },
      { label: "三星展台技术演讲", value: "426 人次", note: "4 月 25–26 日，4 个主题各讲两场；为累计到场人次" }
    ],
    note: "三星半导体于 4 月 24–27 日参加联合展示。"
  },
  {
    code: "OCTS",
    title: "OCTS 2026 · 开放计算技术大会",
    date: "2026.07.09",
    venue: "北京国际饭店",
    theme: "智算无界：开放、多元、扩展 / Intelligence Without Limits: Open, Diverse, Scalable",
    talks: [{ speaker: "Sunghoon Chun（田成勳）", title: "Solving the Context Explosion: Next-Gen Flash Storage for Agentic AI Era" }],
    metrics: [
      { label: "三星展位访问", value: "460–500", note: "估计到访" },
      { label: "三星分论坛", value: "2 场", note: "不同场次分别记录 120+、估计 250+，不合计" }
    ],
    eventRouteId: "OCTS_2026"
  },
  {
    code: "ODX",
    title: "ODX 2026 · Open Data Center Summit",
    date: "2026.09.02–04",
    venue: "北京国家会议中心二期",
    theme: "开放 AI Infra，普惠算力赋能",
    talks: [{ speaker: "Jay Hyun（玄在雄）", title: "Beyond the Memory Wall: Rearchitecting the Data Path for Agentic AI" }],
    metrics: [
      { label: "大会到访人数", value: "5,726" },
      { label: "三星展位访问", value: "1,752", note: "展期 3 天，估计到访" },
      { label: "主论坛演讲到场", value: "约 1,000" },
      { label: "三星展台论坛到场", value: "约 60", note: "现场峰值" }
    ],
    eventRouteId: "ODX_2026"
  },
  {
    code: "GMIF",
    title: "GMIF 2026",
    date: "2026.09.22–23",
    venue: "深圳湾万丽酒店",
    theme: "AI存储，驱动未来",
    talks: [{ speaker: "Kevin Yoon", title: "The Memory Revolution: Building the Foundation of Agentic AI / 存储变革：构筑智能体AI的基础", when: "9 月 23 日 · 主旨演讲" }],
    metrics: [
      { label: "专业观众注册", value: "3,000+", note: "注册人数，非实到人数" },
      { label: "同期展商", value: "约 40 家" }
    ],
    note: "沿用 ODX 演讲材料，聚焦智能体 AI 的 KV Cache 存储、PM1763/BM1773 与端侧 zNAND-O。三星获「杰出AI存储产业引领奖」。"
  },
  {
    code: "CIIE",
    title: "第九届中国国际进口博览会",
    date: "2026.11.05–10",
    venue: "上海国家会展中心",
    theme: "新时代，共享未来",
    metrics: [
      { label: "全展累计进场人次", value: "93.1 万" },
      { label: "全展注册人数", value: "47 万+" },
      { label: "三星综合展台首日到访", value: "5,412 人次", note: "11 月 5 日，含 DS 区" },
      { label: "三星半导体（DS）区首日到访", value: "1,021 人次", note: "已计入三星综合展台首日到访" }
    ],
    note: "三星半导体展示主题：Architecting AI Systems（AI 系统架构），涵盖存储、图像传感器与 AI 系统。"
  },
  {
    code: "ICCAD",
    title: "ICCAD-Expo 2026",
    date: "2026.11.19–20",
    venue: "北京亦庄北人亦创国际会展中心 C 馆",
    theme: "芯聚北京，智联世界",
    talks: [{ speaker: "Simon Hu", title: "Samsung Foundry: Innovative All-in-One", when: "11 月 19 日 14:40–15:00（北京时间）· 定向邀请展台演讲" }],
    metrics: [
      { label: "三星展位访问", value: "2,400+", note: "同比 +20%" },
      { label: "会议总数", value: "73+" },
      { label: "定向展台演讲到场", value: "70", note: "1 场" },
      { label: "展台有效问卷", value: "444" }
    ],
    eventRouteId: "ICCAD_2026"
  }
];
