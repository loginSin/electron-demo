const RongIMLib = require('@rc/sdk');

const result = document.getElementById('result');
const btnCreateEngine = document.getElementById('btnCreateEngine');
const btnConnect = document.getElementById('btnConnect');

btnCreateEngine.addEventListener('click', async () => {
  try {
    await RongIMLib.createEngine();
    result.textContent = 'createEngine 调用完成（请查看主进程日志）';
  } catch (err) {
    console.error(err);
    result.textContent = 'SDK 调用失败';
  }
});

btnConnect.addEventListener('click', async () => {
  try {
    const token =
      'rdIKubNd6vTWuKUdlUU6eOF+lwb3rejulGH0HEWstV0=@h4mx.cn.rongnav.com;h4mx.cn.rongcfg.com';
    const res = await RongIMLib.connect(token, 5);
    result.textContent = `connect 结果: code=${res && res.code !== undefined ? res.code : 'N/A'}, userId=${res && res.userId ? res.userId : ''}`;
  } catch (err) {
    console.error(err);
    result.textContent = `SDK 调用失败: ${err && err.message ? err.message : String(err)}`;
  }
});
