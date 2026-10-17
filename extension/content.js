(() => {
  'use strict';
  if (document.getElementById('ns-shield-host')) return;
  // v1 strict/video/blocks are ignored: names and video remain visible.
  const defaults = { meta: true, markers: true, episodeGuard: true };
  let settings = { ...defaults }, expanded = false, revealed = false;
  let video = null, host, shadow, panel, revealTimer, lastURL = location.href;
  let sourceTitle = document.title;
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  function apply() {
    const root = document.documentElement;
    if (!root) return;
    root.removeAttribute('data-ns-teams');
    root.setAttribute('data-ns-meta', settings.meta ? 'hide' : 'show');
    root.setAttribute('data-ns-markers', settings.markers ? 'hide' : 'show');
    root.setAttribute('data-ns-episodes', settings.episodeGuard ? 'hide' : 'show');
    root.toggleAttribute('data-ns-reveal', revealed);
    const videoPage = /\/video\/|\/bangumi\/play\/|\/list\/|\/medialist\//.test(location.pathname) || location.hostname === 'player.bilibili.com';
    if (settings.meta && videoPage) {
      if (document.title !== '赛事回放 · 护盾保护中') { sourceTitle = document.title; document.title = '赛事回放 · 护盾保护中'; }
    } else if (document.title === '赛事回放 · 护盾保护中') document.title = sourceTitle;
    if (!shadow) return;
    shadow.querySelector('#state').textContent = revealed ? '比分临时显示中 · 10 秒后恢复' : '防剧透保护中';
    for (const id of Object.keys(defaults)) shadow.querySelector('#'+id).checked = settings[id];
    panel.hidden = !expanded;
    shadow.querySelector('#launcher').setAttribute('aria-expanded', String(expanded));
    shadow.querySelector('#tip').textContent = video ? '保留队名与完整画面 · 页面比分已隐藏' : '保留队名、日期和回放入口 · 只隐藏赛果';
    shadow.querySelector('#episode-controls').hidden = !settings.episodeGuard;
    // Never inspect the last part: identical controls on P1, P3, and P5.
  }
  function save(changes) {
    Object.assign(settings, changes); apply();
    if (typeof chrome !== 'undefined' && chrome.storage) {
      try { chrome.storage.local.set(changes).catch(() => {}); } catch {}
    } else {
      try { localStorage.setItem('ns-demo-settings-v2', JSON.stringify(settings)); } catch {}
    }
  }
  function changePart(delta) {
    // Only existing links from this video; never invent out-of-range ?p=N+1.
    const current = new URL(location.href);
    const part = Math.max(1, Number(current.searchParams.get('p')) || 1);
    let candidate = null;
    if (/^\/video\//.test(current.pathname)) {
      for (const link of document.querySelectorAll('a[href]')) {
        try {
          const target = new URL(link.getAttribute('href'), location.href);
          if (target.origin === current.origin && target.pathname.replace(/\/$/,'') === current.pathname.replace(/\/$/,'') && Number(target.searchParams.get('p')) === part+delta) { candidate = link; break; }
        } catch {}
      }
    }
    if (!candidate) {
      const selectors = delta > 0 ? '.bpx-player-ctrl-next,.bilibili-player-video-btn-next' : '.bpx-player-ctrl-prev,.bilibili-player-video-btn-prev';
      candidate = [...document.querySelectorAll(selectors)].find(el => !el.disabled && el.getAttribute('aria-disabled') !== 'true' && !el.classList.contains('disabled') && !el.classList.contains('bpx-state-disabled'));
    }
    if (candidate) candidate.click();
    // Same status whether a target exists or not; no count or last-part hint.
    shadow.querySelector('#part-status').textContent = '切局请求已发送';
  }
  function detect() {
    if (location.href !== lastURL) {
      lastURL = location.href; revealed = false; clearTimeout(revealTimer);
      if (shadow) shadow.querySelector('#part-status').textContent = '';
      apply();
    }
    const candidates = [...document.querySelectorAll('video')].filter(v => v.isConnected && v.getBoundingClientRect().width > 150);
    const next = candidates.sort((a,b) => b.getBoundingClientRect().width*b.getBoundingClientRect().height-a.getBoundingClientRect().width*a.getBoundingClientRect().height)[0] || null;
    if (video !== next) { video = next; apply(); }
    const fs = document.fullscreenElement;
    if (host && fs && fs.tagName !== 'VIDEO' && !fs.contains(host)) fs.append(host);
    else if (host && !fs && host.parentElement !== document.documentElement) document.documentElement.append(host);
  }
  function mount() {
    if (!document.documentElement || host) return;
    host = document.createElement('div'); host.id = 'ns-shield-host';
    host.style.setProperty('all','initial','important'); shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>
      :host{all:initial!important;font-family:system-ui,"Microsoft YaHei",sans-serif!important;color:#edf1fa!important;font-size:13px!important}
      *{box-sizing:border-box}[hidden]{display:none!important}button,input,select{font:inherit}
      button{cursor:pointer;border:1px solid #3e485e;border-radius:7px;background:#222c3e;color:#e9effa;padding:9px 10px}button:hover{background:#303f56}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #b9f28a;outline-offset:3px}
      #launcher{position:fixed;right:18px;bottom:26px;z-index:2147483647;background:#b9f28a;color:#17271c;font-weight:750;box-shadow:0 4px 24px #0008;border:1px solid #d3f9b2;padding:11px 16px;border-radius:30px}
      #panel{position:fixed;right:18px;bottom:80px;z-index:2147483647;width:330px;max-height:calc(100vh - 110px);overflow:auto;border:1px solid #455168;border-radius:14px;background:#111927;box-shadow:0 16px 60px #0009;padding:19px;line-height:1.6}
      header{display:flex;justify-content:space-between;align-items:center}strong{font-size:17px}#state{font-size:11px;color:#b9f28a;margin:3px 0 16px}#tip,.note,#part-status{color:#95a4bd;font-size:11px;margin:12px 0}.row{display:flex;gap:7px;margin:10px 0}.row button{flex:1}
      label{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid #2b3446}label small{display:block;font-size:10px;color:#95a4bd}input{accent-color:#b9f28a;width:17px;height:17px;flex-shrink:0}
      #reveal{width:100%;color:#acb8cc;font-size:11px;background:transparent;margin-top:12px}select{background:#222c3e;color:#fff;border:1px solid #455168;border-radius:7px;padding:7px}#episode-controls button{border-color:#77905f;color:#c7eeaa}
      @media(max-width:420px){#panel{width:calc(100vw - 24px);right:12px}#launcher{right:12px}}
    </style><section id="panel" aria-label="回放护盾设置" hidden>
      <header><strong>◈ 回放护盾</strong><button id="close" aria-label="收起设置">×</button></header><p id="state">防剧透保护中</p>
      <label><span>隐藏周边剧透<small>标题 / 推荐 / 评论 / 弹幕 / 进度与时长</small></span><input id="meta" type="checkbox"></label>
      <label><span>隐藏进度条事件提示<small>击杀、大小龙、推塔标记与高能曲线</small></span><input id="markers" type="checkbox"></label>
      <label><span>隐藏总局数线索<small>原生上 / 下一集、选集数量、结束推荐</small></span><input id="episodeGuard" type="checkbox"></label>
      <p id="tip"></p><div id="episode-controls"><div class="row"><button id="prev-part">上一局</button><button id="next-part">下一局</button></div><p class="note">切局按钮始终保留相同状态，不提示总局数。缺少可用入口时不会跳转。</p><p id="part-status" role="status"></p></div>
      <div class="row"><button data-seek="-15">−15 秒</button><button data-seek="15">＋15 秒</button><button data-seek="120">＋2 分钟</button></div>
      <div class="row"><button id="play">播放 / 暂停</button><select id="speed" aria-label="播放倍速"><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></div>
      <button id="reveal">临时显示页面比分 · 10 秒</button><p class="note">Xun · 设置只在本机保存 · v1.1.0</p>
    </section><button id="launcher" aria-expanded="false">◈ 护盾</button>`;
    panel = shadow.querySelector('#panel'); document.documentElement.append(host);
    const on = (id, handler) => shadow.querySelector('#'+id).addEventListener('click',handler);
    on('launcher',() => { expanded=!expanded; apply(); }); on('close',() => { expanded=false; apply(); });
    for (const id of Object.keys(defaults)) shadow.querySelector('#'+id).onchange=e => save({[id]:e.target.checked});
    on('prev-part',() => changePart(-1)); on('next-part',() => changePart(1));
    on('reveal',() => {
      if (revealed) { revealed=false; clearTimeout(revealTimer); apply(); return; }
      revealed=true; apply(); revealTimer=setTimeout(() => { revealed=false; apply(); },10000);
    });
    for(const button of shadow.querySelectorAll('[data-seek]')) button.onclick=() => {
      if(video && Number.isFinite(video.duration)) video.currentTime=clamp(video.currentTime+Number(button.dataset.seek),0,Math.max(0,video.duration-.2));
    };
    on('play',() => { if(video) { if(video.paused) video.play().catch(()=>{}); else video.pause(); } });
    shadow.querySelector('#speed').onchange=e => { if(video) video.playbackRate=Number(e.target.value); };
    apply(); detect();
  }
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(defaults, stored => { for(const key of Object.keys(defaults)) settings[key]=typeof stored[key]==='boolean'?stored[key]:defaults[key]; apply(); });
    chrome.storage.onChanged.addListener((changes,area) => {
      if(area!=='local')return;
      for(const key of Object.keys(defaults)) if(changes[key]) settings[key]=typeof changes[key].newValue==='boolean'?changes[key].newValue:defaults[key]; apply();
    });
  } else { try { const stored=JSON.parse(localStorage.getItem('ns-demo-settings-v2')||'{}'); for(const key of Object.keys(defaults)) if(typeof stored[key]==='boolean')settings[key]=stored[key]; } catch {} }
  apply();
  const observer=new MutationObserver(records => {
    if(!host || !host.isConnected) { host=null; mount(); }
    if(records.some(r => r.target.nodeName==='TITLE' || r.target.parentNode?.nodeName==='TITLE')) apply();
  });
  observer.observe(document,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
  document.addEventListener('fullscreenchange',detect); setInterval(detect,500);
})();
