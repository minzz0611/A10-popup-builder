// Shown when a JSON edit-state file is loaded while a project is already
// open. Lets the person either fully replace the current project (old
// behavior) or pick specific pages (표지/섹션) to bring into it instead.
const { useState: iUseState } = React;

function ImportModal({ source, onCancel, onReplace, onImport }){
  const pages = [];
  if((source.heroComponents||[]).length){
    pages.push({ key:'hero', label:'표지 (히어로 화면) — 선택 시 현재 표지를 교체', icon:'🏠' });
  }
  (source.sidebar||[]).forEach(sec => {
    const tabCount = sec.tabs?.length || 0;
    pages.push({
      key:'sec:'+sec.id,
      label: sec.label + (tabCount ? ` (하위 탭 ${tabCount}개 포함)` : ''),
      icon: sec.kind === 'cover' ? '🖼️' : '📄',
    });
  });

  const [checked, setChecked] = iUseState(() => {
    const init = {};
    pages.forEach(p => { init[p.key] = true; });
    return init;
  });

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const selectedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(20,25,40,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}
      onClick={onCancel}>
      <div style={{width:440,maxHeight:'80vh',display:'flex',flexDirection:'column',background:'#fff',borderRadius:14,boxShadow:'var(--shadow-lg)',overflow:'hidden'}}
        onClick={(e)=>e.stopPropagation()}>
        <div style={{padding:'18px 20px 14px',borderBottom:'1px solid var(--line)'}}>
          <div style={{fontSize:15,fontWeight:800,color:'var(--ink)'}}>JSON 파일 불러오기</div>
          <div style={{fontSize:12,color:'var(--mute)',marginTop:4}}>
            "{source.meta?.title || '제목 없음'}"에서 가져올 방식을 선택하세요.
          </div>
        </div>

        <div style={{flex:1,minHeight:0,overflowY:'auto',padding:'14px 20px'}}>
          {pages.length === 0 ? (
            <div style={{padding:'20px 0',textAlign:'center',color:'var(--mute)',fontSize:12.5}}>이 파일에는 가져올 페이지가 없습니다.</div>
          ) : (
            <>
              <div style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',marginBottom:8}}>
                선택한 페이지만 가져오기
              </div>
              {pages.map(p => (
                <label key={p.key}
                  style={{display:'flex',alignItems:'center',gap:10,padding:'9px 10px',border:'1px solid var(--line)',borderRadius:9,marginBottom:6,cursor:'pointer',background: checked[p.key] ? 'var(--grad-soft)' : '#fff'}}>
                  <input type="checkbox" checked={!!checked[p.key]} onChange={()=>toggle(p.key)}
                    style={{width:16,height:16,accentColor:'var(--blue)',margin:0,flex:'none'}}/>
                  <span style={{flex:'none'}}>{p.icon}</span>
                  <span style={{flex:1,minWidth:0,fontSize:12.5,fontWeight:700,color:'var(--ink)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.label}</span>
                </label>
              ))}
              <div style={{fontSize:11,color:'var(--mute)',marginTop:6,lineHeight:1.5}}>
                선택한 섹션은 현재 프로젝트 목차 맨 아래에 새로운 항목으로 추가됩니다. 표지를 선택하면 현재 표지 내용이 교체됩니다. 기존 섹션 내용은 지워지지 않습니다.
              </div>
            </>
          )}
        </div>

        <div style={{padding:'14px 20px',borderTop:'1px solid var(--line)',display:'flex',flexDirection:'column',gap:8}}>
          <button onClick={()=>onImport(pages.filter(p=>checked[p.key]).map(p=>p.key))}
            disabled={pages.length===0 || selectedCount===0}
            style={{width:'100%',padding:'10px',border:'none',borderRadius:9,background: (pages.length===0||selectedCount===0) ? 'var(--mute)' : 'var(--grad)',color:'#fff',fontSize:13,fontWeight:700,cursor: (pages.length===0||selectedCount===0) ? 'default' : 'pointer'}}>
            선택한 페이지 가져오기 ({selectedCount})
          </button>
          <button onClick={onReplace}
            style={{width:'100%',padding:'10px',border:'1px solid var(--line)',borderRadius:9,background:'#fff',color:'var(--ink)',fontSize:13,fontWeight:700,cursor:'pointer'}}>
            전체 교체 (현재 프로젝트 덮어쓰기)
          </button>
          <button onClick={onCancel}
            style={{width:'100%',padding:'8px',border:'none',background:'transparent',color:'var(--mute)',fontSize:12.5,fontWeight:600,cursor:'pointer'}}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

window.ImportModal = ImportModal;
