// Exporter: builds a self-contained HTML file (the final popup) + a JSON edit-state file.
// Uses ReactDOM to render into a hidden DOM, then serializes outerHTML.

// The popup CSS used in the exported HTML (matches the sample file's style)
const POPUP_CSS = `
:root{
  --blue:#2F6BFF;--blue-dark:#1451E0;--purple:#7B5CFA;
  --grad: linear-gradient(90deg,#7B5CFA 0%, #2FA8FF 100%);
  --grad-soft: linear-gradient(90deg,#eef0ff 0%, #eaf6ff 100%);
  --ink:#1B2130;--sub:#5B6472;--mute:#9199A6;--line:#E6E9EF;--panel:#F4F5F7;
  --card:#ffffff;--good:#12B886;--warn:#FF7A45;--danger:#F0416C;
  font-family:"Pretendard","Malgun Gothic","맑은 고딕",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;background:#dfe3ea;color:var(--ink);height:100%;}
.host-page{padding:26px 30px;max-width:1180px;margin:0 auto;color:#9199A6;}
.host-page h4{color:#5B6472;font-size:14px;margin:0 0 10px;}
.host-page .host-block{background:#fff;border:1px solid var(--line);border-radius:12px;height:120px;margin-bottom:14px;}
.overlay{position:fixed;inset:0;background:rgba(12,16,28,.55);z-index:50;display:flex;align-items:center;justify-content:center;padding:20px;}
.stage{max-width:1180px;width:100%;margin:0 auto;}
.window{background:#fff;border-radius:12px;box-shadow:0 20px 50px rgba(20,30,60,.18);overflow:hidden;height:min(780px, 88vh);display:flex;flex-direction:column;}
.modal-shell{position:relative;background:#fff;flex:1;min-height:0;display:flex;flex-direction:column;}
.modal-close{position:absolute;top:18px;right:20px;width:34px;height:34px;border-radius:50%;border:none;background:#F1F2F5;color:#66707F;font-size:18px;cursor:pointer;z-index:5;display:flex;align-items:center;justify-content:center;}
.modal-close:hover{background:#E7E9EE;}
.modal-back{position:absolute;top:18px;left:20px;height:34px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--sub);font-size:12.5px;font-weight:700;cursor:pointer;z-index:5;display:none;align-items:center;gap:5px;padding:0 14px;}
.modal-back:hover{background:var(--panel);}
.modal-back.show{display:flex;}
.screen{flex:1;min-height:0;display:none;flex-direction:column;overflow:hidden;}
.screen.active{display:flex;}
#heroScreen{overflow-y:auto;}
.body-wrap{display:flex;flex:1;min-height:0;border-top:1px solid var(--line);}
.side-nav{width:230px;flex:none;background:var(--panel);padding:22px 14px;border-right:1px solid var(--line);overflow-y:auto;}
.side-nav .grp-title{font-size:12px;color:#9199A6;font-weight:700;padding:8px 10px 4px;letter-spacing:.02em;}
.side-nav button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:none;padding:11px 12px;border-radius:10px;font-size:14.5px;color:var(--sub);cursor:pointer;font-weight:600;margin-bottom:2px;}
.side-nav button:hover{background:#EAECF1;color:var(--ink);}
.side-nav button.active{background:#fff;color:var(--blue-dark);box-shadow:0 2px 8px rgba(30,50,120,.08);}
.content{flex:1;padding:18px 44px 20px;min-width:0;overflow-y:auto;min-height:0;}
.panel{display:none;}
.panel.active{display:block;}
.dont-show-bar{flex:none;padding:12px 44px;display:flex;justify-content:flex-end;border-top:1px solid var(--line);}
.dont-show{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--sub);cursor:pointer;user-select:none;}
.dont-show input{width:16px;height:16px;accent-color:var(--blue);cursor:pointer;margin:0;}
.footer-bar{flex:none;border-top:1px solid var(--line);padding:16px 44px;display:flex;justify-content:space-between;align-items:center;color:#9199A6;font-size:12.3px;}
.footer-bar .links span{margin-right:16px;}
.sub-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;}
.sub-tabs button{border:1px solid var(--line);background:#fff;color:var(--sub);font-weight:700;font-size:12.5px;padding:8px 15px;border-radius:999px;cursor:pointer;}
.sub-tabs button.active{background:var(--grad);border-color:transparent;color:#fff;}
.sub-panel{display:none;}
.sub-panel.active{display:block;}
.reopen{position:fixed;bottom:26px;right:26px;background:var(--grad);color:#fff;border:none;padding:13px 20px;border-radius:999px;font-weight:700;font-size:13.5px;box-shadow:0 12px 30px rgba(60,80,255,.3);cursor:pointer;display:none;}
`;

// Render component tree to static markup using ReactDOM
function renderComponentsToHTML(components, order){
  // Create a temporary div, render, get innerHTML
  const tmp = document.createElement('div');
  document.body.appendChild(tmp);
  const root = ReactDOM.createRoot(tmp);

  return new Promise((resolve) => {
    root.render(
      <React.StrictMode>
        <div>
          {order.map(cid => {
            const c = components[cid]; if(!c) return null;
            const R = window.RENDERERS[c.type];
            return <div key={cid} data-comp-type={c.type} style={{marginBottom:6}}><R data={c.data} editing={false} onChange={()=>{}}/></div>;
          })}
        </div>
      </React.StrictMode>
    );
    setTimeout(() => {
      const html = tmp.innerHTML;
      root.unmount();
      document.body.removeChild(tmp);
      resolve(html);
    }, 50);
  });
}

async function buildFinalHtml(state){
  const heroHtml = await renderComponentsToHTML(state.components, state.heroComponents || []);
  const sectionHtmls = {};
  for(const sec of (state.sidebar || [])){
    if(sec.tabs && sec.tabs.length){
      const tabBar = `<div class="sub-tabs">${sec.tabs.map((t,ti) => (
        `<button class="sub-tab-btn${ti===0?' active':''}" data-sec="${sec.id}" data-subtab="${t.id}" onclick="goSubTab('${sec.id}','${t.id}')">${escapeHtml(t.label)}</button>`
      )).join('')}</div>`;
      let panels = '';
      for(let ti = 0; ti < sec.tabs.length; ti++){
        const t = sec.tabs[ti];
        const inner = await renderComponentsToHTML(state.components, t.components || []);
        panels += `<div class="sub-panel${ti===0?' active':''}" id="subpanel-${sec.id}-${t.id}">${inner}</div>`;
      }
      sectionHtmls[sec.id] = tabBar + panels;
    } else {
      sectionHtmls[sec.id] = await renderComponentsToHTML(state.components, sec.components || []);
    }
  }

  // Group sidebar into groups
  const sidebar = state.sidebar || [];
  const grouped = {};
  sidebar.forEach(s => (grouped[s.group||'메뉴'] ||= []).push(s));

  const sidebarHtml = Object.keys(grouped).map(g => {
    const items = grouped[g].map((s,i) => (
      `<button class="nav-btn${i===0 && g===Object.keys(grouped)[0] ? ' active' : ''}" data-panel="${s.id}" onclick="goPanel('${s.id}')">${escapeHtml(s.label)}</button>`
    )).join('');
    return `<div class="grp-title">${escapeHtml(g)}</div>${items}`;
  }).join('');

  const panelsHtml = sidebar.map((s,i) => (
    `<section class="panel${i===0 ? ' active' : ''}" id="panel-${s.id}">${sectionHtmls[s.id]||''}</section>`
  )).join('');

  const footer = state.popup?.footer || {};
  const dontShow = state.popup?.dontShowOption !== false;
  const linksHtml = (footer.links||[]).map(l => `<span>${escapeHtml(l)}</span>`).join('');
  const phoneHtml = footer.phone ? `전국 어디서나 <b>${escapeHtml(footer.phone)}</b>` : '';
  const urlHtml = footer.url ? escapeHtml(footer.url) : '';
  const separator = phoneHtml && urlHtml ? ' &nbsp;|&nbsp; ' : '';

  const hasDetail = sidebar.length > 0;

  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(state.meta?.title || '안내 팝업')}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${POPUP_CSS}</style>
</head>
<body>
<div class="host-page">
  <h4>${escapeHtml(state.meta?.title || '안내 팝업')}</h4>
  <div class="host-block"></div>
  <div class="host-block"></div>
  <div class="host-block"></div>
</div>

<div class="overlay" id="overlay">
<div class="stage">
  <div class="window" id="window">
    <div class="modal-shell" id="modalShell">
      <button class="modal-close" onclick="closeModal()">&#10005;</button>
      ${hasDetail ? `<button class="modal-back" id="backBtn" onclick="showHero()">&#8249; 처음으로</button>` : ''}

      <div class="screen active" id="heroScreen">
        ${heroHtml}
      </div>

      ${hasDetail ? `
      <div class="screen" id="detailScreen">
        <div class="body-wrap">
          <nav class="side-nav">${sidebarHtml}</nav>
          <div class="content">${panelsHtml}</div>
        </div>
      </div>` : ''}

      ${dontShow ? `<div class="dont-show-bar">
        <label class="dont-show" for="dontShowChk">
          <input type="checkbox" id="dontShowChk" onchange="onDontShowChange(this.checked)">
          다시 보지 않기
        </label>
      </div>` : ''}

      <div class="footer-bar">
        <div class="links">${linksHtml}</div>
        <div>${phoneHtml}${separator}${urlHtml}</div>
      </div>
    </div>
  </div>
</div>
</div>

<button class="reopen" id="reopenBtn" onclick="reopenModal()">${escapeHtml(state.meta?.title || '팝업')} 다시 보기</button>

<script>
function goPanel(id){
  document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('active');});
  var t = document.getElementById('panel-'+id); if(t) t.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.remove('active');});
  var b = document.querySelector('.nav-btn[data-panel="'+id+'"]'); if(b) b.classList.add('active');
  var c = document.querySelector('#detailScreen .content'); if(c) c.scrollTop = 0;
}
function goSubTab(secId, tabId){
  var scope = document.getElementById('panel-'+secId); if(!scope) return;
  scope.querySelectorAll('.sub-panel').forEach(function(p){p.classList.remove('active');});
  var t = document.getElementById('subpanel-'+secId+'-'+tabId); if(t) t.classList.add('active');
  scope.querySelectorAll('.sub-tab-btn').forEach(function(b){b.classList.remove('active');});
  var b = scope.querySelector('.sub-tab-btn[data-subtab="'+tabId+'"]'); if(b) b.classList.add('active');
}
function showDetail(){
  document.getElementById('heroScreen').classList.remove('active');
  var d = document.getElementById('detailScreen'); if(d) d.classList.add('active');
  var bk = document.getElementById('backBtn'); if(bk) bk.classList.add('show');
}
function showHero(){
  var d = document.getElementById('detailScreen'); if(d) d.classList.remove('active');
  document.getElementById('heroScreen').classList.add('active');
  var bk = document.getElementById('backBtn'); if(bk) bk.classList.remove('show');
}
function closeModal(){
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('reopenBtn').style.display = 'inline-flex';
}
function reopenModal(){
  document.getElementById('overlay').style.display = 'flex';
  document.getElementById('reopenBtn').style.display = 'none';
  showHero();
}
var DONT_SHOW_KEY = 'popbuilder_${(state.meta?.title||'popup').replace(/[^a-z0-9]/gi,'_')}_dont_show';
function onDontShowChange(checked){
  if(checked){ localStorage.setItem(DONT_SHOW_KEY,'1'); } else { localStorage.removeItem(DONT_SHOW_KEY); }
}
(function(){
  if(localStorage.getItem(DONT_SHOW_KEY)==='1'){
    var chk = document.getElementById('dontShowChk'); if(chk) chk.checked = true;
    closeModal();
  }
  // Wire hero CTA button (first button in hero screen) to show detail if detail exists
  ${hasDetail ? `
  var heroBtns = document.querySelectorAll('#heroScreen button');
  heroBtns.forEach(function(b){ b.addEventListener('click', function(e){ e.preventDefault(); showDetail(); }); });
  ` : ''}
})();
</script>
</body>
</html>`;
  return html;
}

function escapeHtml(s){
  if(s == null) return '';
  return String(s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

async function downloadZipBundle(state){
  if(!window.JSZip){ alert('압축 라이브러리를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'); return; }
  const zip = new window.JSZip();
  const html = await buildFinalHtml(state);
  const meta = {
    ...state,
    meta: { ...state.meta, exportedAt: new Date().toISOString() },
  };
  const jsonContent = JSON.stringify(meta, null, 2);
  const safeName = (state.meta?.title || 'popup').replace(/[^a-z0-9가-힣_\- ]/gi,'').replace(/\s+/g,'_') || 'popup';

  const readme = `# ${state.meta?.title || '팝업'} · PopBuilder 내보내기

이 ZIP 파일에는 두 개의 파일이 들어있습니다:

1. **${safeName}.html** — 최종 결과물 팝업 파일
   - 브라우저에서 바로 열어보거나, 실제 서비스에 삽입하여 사용할 수 있습니다.
   - 편집 UI는 포함되어 있지 않습니다.

2. **${safeName}.편집상태.json** — 재편집용 데이터 파일
   - PopBuilder에 다시 업로드하면 편집을 이어서 진행할 수 있습니다.
   - 이 파일이 있어야 나중에 컴포넌트 추가·수정·순서 변경이 가능합니다.

내보낸 시각: ${new Date().toLocaleString('ko-KR')}
`;

  zip.file(safeName + '.html', html);
  zip.file(safeName + '.편집상태.json', jsonContent);
  zip.file('README.txt', readme);

  const blob = await zip.generateAsync({ type:'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = safeName + '.zip';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

window.downloadZipBundle = downloadZipBundle;
window.buildFinalHtml = buildFinalHtml;
