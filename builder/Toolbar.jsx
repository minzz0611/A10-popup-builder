// Top toolbar - title, save/load/download/preview
const { useState: tUseState, useRef: tUseRef } = React;

function Toolbar({ state, onTitleChange, onSave, onDownload, onImportJson, onOpenPreview, onNewProject, onGoHome, onUpdateWindowHeight, savedIndicator, canUndo, canRedo, onUndo, onRedo }){
  const fileRef = tUseRef(null);
  const [savedLabel, setSavedLabel] = tUseState('');
  const [showHeightPopover, setShowHeightPopover] = tUseState(false);
  const windowHeight = state.popup?.windowHeight ?? 780;

  React.useEffect(()=>{
    if(savedIndicator){
      setSavedLabel('저장됨');
      const t = setTimeout(()=>setSavedLabel(''), 2000);
      return ()=>clearTimeout(t);
    }
  }, [savedIndicator]);

  const btnBase = {
    display:'inline-flex',alignItems:'center',gap:6,padding:'7px 12px',
    background:'#fff',color:'var(--ink)',border:'1px solid var(--line)',
    borderRadius:8,fontSize:12.5,fontWeight:700,cursor:'pointer',
    height:34,
  };
  const btnPrimary = {
    ...btnBase,
    background:'var(--grad)',color:'#fff',border:'none',
    boxShadow:'0 3px 10px rgba(80,90,255,.25)',
  };
  const iconBtn = {
    ...btnBase, padding:'7px 9px',
  };

  return (
    <div style={{height:56, flex:'none', background:'#fff', borderBottom:'1px solid var(--line)', display:'flex', alignItems:'center', padding:'0 18px', gap:14, zIndex:5}}>
      {/* Logo */}
      <div
        style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',userSelect:'none',opacity:1,transition:'opacity .15s'}}
        onClick={onGoHome}
        onMouseEnter={(e)=>{e.currentTarget.style.opacity=0.75}}
        onMouseLeave={(e)=>{e.currentTarget.style.opacity=1}}
        title="홈으로 이동"
      >
        <div style={{width:30,height:30,borderRadius:8,background:'var(--grad)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:14}}>P</div>
        <div style={{fontWeight:800,fontSize:15,color:'var(--ink)',letterSpacing:'-.01em'}}>PopBuilder</div>
      </div>

      <div style={{height:20,width:1,background:'var(--line)'}}/>

      {/* Editable project title */}
      <div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:0}}>
        <input
          value={state.meta.title}
          onChange={(e)=>onTitleChange(e.target.value)}
          style={{border:'none',background:'transparent',fontSize:14,fontWeight:700,color:'var(--ink)',padding:'6px 10px',borderRadius:6,minWidth:0,width:'auto',maxWidth:340,outline:'none'}}
          onFocus={(e)=>e.currentTarget.style.background='var(--panel)'}
          onBlur={(e)=>e.currentTarget.style.background='transparent'}
        />
        {savedLabel && <span style={{fontSize:11,color:'var(--good)',fontWeight:700}}>✓ {savedLabel}</span>}
      </div>

      {/* Actions */}
      <div style={{display:'flex',gap:6,alignItems:'center'}}>
        <button style={iconBtn} onClick={onUndo} disabled={!canUndo} title="실행 취소 (Ctrl+Z)"
          onMouseEnter={(e)=>{if(canUndo) e.currentTarget.style.background='var(--panel)'}}
          onMouseLeave={(e)=>e.currentTarget.style.background='#fff'}>
          <span style={{opacity: canUndo?1:.4, fontSize:14}}>↶</span>
        </button>
        <button style={iconBtn} onClick={onRedo} disabled={!canRedo} title="다시 실행 (Ctrl+Y)"
          onMouseEnter={(e)=>{if(canRedo) e.currentTarget.style.background='var(--panel)'}}
          onMouseLeave={(e)=>e.currentTarget.style.background='#fff'}>
          <span style={{opacity: canRedo?1:.4, fontSize:14}}>↷</span>
        </button>

        <div style={{height:20,width:1,background:'var(--line)',margin:'0 4px'}}/>

        <div style={{position:'relative'}}>
          <button style={btnBase} onClick={()=>setShowHeightPopover(v=>!v)} title="팝업 창 높이 조절">
            ↕ 팝업 높이
          </button>
          {showHeightPopover && (
            <>
              <div style={{position:'fixed',inset:0,zIndex:10}} onClick={()=>setShowHeightPopover(false)}/>
              <div style={{position:'absolute',top:'calc(100% + 8px)',left:0,width:236,background:'#fff',border:'1px solid var(--line)',borderRadius:10,boxShadow:'var(--shadow-lg)',padding:14,zIndex:11}}>
                <div style={{fontSize:12,fontWeight:800,color:'var(--ink)',marginBottom:2}}>팝업 창 높이</div>
                <div style={{fontSize:11,color:'var(--mute)',marginBottom:10,lineHeight:1.5}}>
                  표지·상세 화면이 항상 같은 높이를 공유해요. 내용이 넘치면 창 크기는 그대로 두고 안에서 스크롤돼요.
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <input type="range" min={480} max={900} step={10}
                    value={windowHeight}
                    onChange={(e)=>onUpdateWindowHeight(Number(e.target.value))}
                    style={{flex:1}}/>
                  <div style={{flex:'none',display:'flex',alignItems:'center',gap:2}}>
                    <input type="number" min={480} max={900} step={10}
                      value={windowHeight}
                      onChange={(e)=>{
                        const v = Math.max(480, Math.min(900, Number(e.target.value) || 780));
                        onUpdateWindowHeight(v);
                      }}
                      style={{width:52,padding:'5px 6px',border:'1px solid var(--line)',borderRadius:6,fontSize:12,fontWeight:700,textAlign:'right',fontFamily:'inherit'}}/>
                    <span style={{fontSize:11.5,color:'var(--sub)',fontWeight:700}}>px</span>
                  </div>
                </div>
                <button onClick={()=>onUpdateWindowHeight(780)}
                  style={{marginTop:8,width:'100%',padding:'6px',border:'1px solid var(--line)',borderRadius:7,background:'#fff',fontSize:11.5,fontWeight:700,color:'var(--mute)',cursor:'pointer'}}>
                  기본값(780px)으로
                </button>
              </div>
            </>
          )}
        </div>
        <div style={{height:20,width:1,background:'var(--line)',margin:'0 4px'}}/>

        <button style={btnBase} onClick={onNewProject} title="새 프로젝트">
          {window.Icons.File({size:14})} 새로 만들기
        </button>
        <button style={btnBase} onClick={()=>fileRef.current && fileRef.current.click()}>
          {window.Icons.Upload({size:14})} JSON 불러오기
        </button>
        <input ref={fileRef} type="file" accept=".json,application/json" style={{display:'none'}} onChange={(e)=>{
          const f = e.target.files && e.target.files[0]; if(!f) return;
          const rd = new FileReader();
          rd.onload = () => {
            try { onImportJson(JSON.parse(rd.result)); }
            catch(err){ alert('JSON 파일을 읽을 수 없습니다: ' + err.message); }
          };
          rd.readAsText(f);
          e.target.value = '';
        }}/>
        <button style={btnBase} onClick={onSave}>
          {window.Icons.Save({size:14})} 저장
        </button>
        <button style={btnBase} onClick={onOpenPreview}>
          {window.Icons.Eye({size:14})} 미리보기
        </button>
        <button style={btnPrimary} onClick={onDownload}>
          {window.Icons.Download({size:14})} ZIP 다운로드
        </button>
      </div>
    </div>
  );
}

window.Toolbar = Toolbar;
