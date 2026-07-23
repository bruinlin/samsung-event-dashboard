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
  defaultEventId: "OCTS_2026",
  events: [
    {
      eventId: "OCTS_2026",
      label: "OCTS 2026",
      dataFile: "data/OCTS_2026.js?v=1.2.0",
      dataKey: "OCTS_2026"
    },
    {
      eventId: "ODX_2026",
      label: "ODX 2026",
      dataFile: "data/ODX_2026.js?v=1.0.0",
      dataKey: "ODX_2026"
    }
  ]
};
