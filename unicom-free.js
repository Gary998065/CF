// unicom-free.js (测试版)
// Shadowrocket 用于统计 tjupload.pan.wo.cn 免流量，每次访问立即推送通知

const key = "unicom_free_today";
const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// 读取持久化存储
let store = JSON.parse($persistentStore.read(key) || '{"date":"", "used":0}');
if (store.date !== today) {
    // 新的一天，重置
    store = { date: today, used: 0 };
}

// 统计流量
let size = 0;
if ($request) {
    if ($request.body) size += $request.body.length;
    size += parseInt($request.headers["Content-Length"] || 0);
    store.used += size;
    $persistentStore.write(JSON.stringify(store), key);

    // 推送通知（每次访问立即触发）
    let usedMB = (store.used / 1024 / 1024).toFixed(2);
    $notify("联通免流统计", "实时推送", `今日累计免流 ${usedMB} MB`);
    $done({});
}

// 如果是 cron 触发，只累加数据，不推送
if ($trigger == "cron") {
    $persistentStore.write(JSON.stringify(store), key);
    $done();
}
