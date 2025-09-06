// unicom-free.js
// 统计联通云盘免流量 (单位: KB)

let key = "unicom_free_today";
let today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// 读取数据
let store = JSON.parse($persistentStore.read(key) || "{}");
if (store.date !== today) {
  // 新的一天，清零
  store = { date: today, used: 0 };
}

// 如果是 http 请求触发
if ($request) {
  let size = 0;
  if ($request.body) size = $request.body.length; // 请求体大小
  size += ($request.headers["Content-Length"] || 0); // 头里声明的大小
  store.used += parseInt(size) || 0;
  $persistentStore.write(JSON.stringify(store), key);
  $done({});
}

// 如果是定时任务触发
if ($trigger == "cron") {
  let usedMB = (store.used / 1024 / 1024).toFixed(2);
  $notify("联通免流统计", "今日已用免流", `${usedMB} MB`);
  $done();
}
