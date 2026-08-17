/*
  Event registry for the static web deployment
  --------------
  新增活动时：
  1. 复制一份活动数据文件到 data/；
  2. 修改 dataKey，确保与数据文件注册名一致；
  3. 在下方 events 数组增加一条记录。
  无需修改 index.html 或 assets/app.js。
  本文件必须保留在网站根目录，Cloudflare Pages 直接加载它。
*/

window.EVENT_INDEX = {
  events: [
    {
      eventId: "OCTS_2026",
      label: "OCTS 2026",
      dateStart: "2026-07-09",
      overallStatus: "Completed",
    dataFile: "data/OCTS_2026.js?v=1.8.0",
      dataKey: "OCTS_2026"
    },
    {
      eventId: "ODX_2026",
      label: "ODX 2026",
      dateStart: "2026-09-02",
      overallStatus: "In Progress",
    dataFile: "data/ODX_2026.js?v=1.8.2",
      dataKey: "ODX_2026"
    },
    {
      eventId: "ICCAD_2026",
      label: "ICCAD 2026",
      dateStart: "2026-11-19",
      overallStatus: "In Progress",
    dataFile: "data/ICCAD_2026.js?v=1.8.0",
      dataKey: "ICCAD_2026"
    }
  ]
};
