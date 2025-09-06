// unicom-free.js (测试版)
// Shadowrocket 用于统计 tjupload.pan.wo.cn 免流量，测试推送

const key = "unicom_free_today";
const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// 读取持久化存储
let store = JSON.parse($persistentStore.read(key) || '{"date":"", "used":0}');
if (store.date !== today) {
    // 新的一天，重置
    store = { date: today, used: 0 };
}

// 如果是 HTTP 请求触发
if ($request) {
    let size = 0;
    if ($request.body) size = $request.body.length; // 请求体大小
    size += parseInt($request.headers["Content-Length"] || 0); // 请求头声明大小
    store.used += size;
    $persistentStore.write(JSON.stringify(store), key);
    $done({});
}

// 如果是定时任务触发 (cron)
if ($trigger == "cron") {
    let usedMB = (store.used / 1024 / 1024).toFixed(2);
    $notify("联通免流统计", "测试推送", `今日已免流 ${usedMB} MB`);
    $done();
}
