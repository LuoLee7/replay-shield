'use strict';
const ids = ['meta', 'markers', 'episodeGuard'];
chrome.storage.local.get({ meta: true, markers: true, episodeGuard: true }, settings => {
  for (const id of ids) document.getElementById(id).checked = settings[id];
});
for (const id of ids) document.getElementById(id).addEventListener('change', async event => {
  try { await chrome.storage.local.set({ [id]: event.target.checked }); document.getElementById('status').textContent = '已保存 · 已打开的页面同步生效'; }
  catch { document.getElementById('status').textContent = '保存失败，请关闭面板后重试'; }
});
