// Top toolbar - title, save/load/download/preview
const { useState: tUseState, useRef: tUseRef } = React;

function Toolbar({ state, onTitleChange, onSave, onDownload, onImportJson, onOpenPreview, onNewProject, onGoHome, onUpdateWindowHeight, onUpdateWindowWidth, onUpdateSidebarWidth, editorMode, onSetEditorMode, savedIndicator, canUndo, canRedo, onUndo, onRedo }){
  const fileRef = tUseRef(null);
  const [savedLabel, setSavedLabel] = tUseState('');
  const [showHeightPopover, setShowHeightPopover] = tUseState(false);
  const windowHeight = state.popup?.windowHeight ?? 700;
  const windowWidth = state.popup?.windowWidth ?? 1180;
  const sidebarWidth = state.popup?.sidebarWidth ?? 230;
  const [draftHeight, setDraftHeight] = tUseState(windowHeight);
  const [draftWidth, setDraftWidth] = tUseState(windowWidth);
  const [draftSidebarWidth, setDraftSidebarWidth] = tUseState(sidebarWidth);

  // 팝오버를 열 때마다 현재 저장된 값으로 임시 입력값을 초기화
  React.useEffect(()=>{ if(showHeightPopover){ setDraftHeight(windowHeight); setDraftWidth(windowWidth); setDraftSidebarWidth(sidebarWidth); } }, [showHeightPopover]);

  const commitHeight = (v) => {
    const n = Number(v);
    const clamped = Math.max(480, Math.min(900, isNaN(n) ? 700 : n));
    onUpdateWindowHeight(clamped);
    setDraftHeight(clamped);
  };
  const commitWidth = (v) => {
    const n = Number(v);
    const clamped = Math.max(600, Math.min(1600, isNaN(n) ? 1180 : n));
    onUpdateWindowWidth(clamped);
    setDraftWidth(clamped);
  };
  const commitSidebarWidth = (v) => {
    const n = Number(v);
    const clamped = Math.max(160, Math.min(320, isNaN(n) ? 230 : n));
    onUpdateSidebarWidth(clamped);
    setDraftSidebarWidth(clamped);
  };

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
          <button style={btnBase} onClick={()=>setShowHeightPopover(v=>!v)} title="팝업 창 크기 조절">
            ⛶ 팝업 크기
          </button>
          {showHeightPopover && (
            <>
              <div style={{position:'fixed',inset:0,zIndex:10}} onClick={()=>setShowHeightPopover(false)}/>
              <div style={{position:'absolute',top:'calc(100% + 8px)',left:0,width:236,background:'#fff',border:'1px solid var(--line)',borderRadius:10,boxShadow:'var(--shadow-lg)',padding:14,zIndex:11}}>
                <div style={{fontSize:12,fontWeight:800,color:'var(--ink)',marginBottom:2}}>팝업 창 크기</div>
                <div style={{fontSize:11,color:'var(--mute)',marginBottom:10,lineHeight:1.5}}>
                  표지·상세 화면이 항상 같은 크기를 공유해요. 내용이 넘치면 창 크기는 그대로 두고 안에서 스크롤돼요. 값을 정하고 <b>저장</b>을 눌러야 반영돼요.
                </div>

                <div style={{fontSize:10.5,color:'var(--mute)',fontWeight:700,marginBottom:4}}>높이</div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                  <input type="range" min={480} max={900} step={10}
                    value={Number(draftHeight) || 480}
                    onChange={(e)=>setDraftHeight(Number(e.target.value))}
                    style={{flex:1}}/>
                  <div style={{flex:'none',display:'flex',alignItems:'center',gap:2}}>
                    <input type="number" min={480} max={900}
                      value={draftHeight}
                      onChange={(e)=>{
                        const raw = e.target.value;
                        setDraftHeight(raw === '' ? '' : Number(raw));
                      }}
                      onKeyDown={(e)=>{ if(e.key === 'Enter') commitHeight(draftHeight); }}
                      style={{width:52,padding:'5px 6px',border:'1px solid var(--line)',borderRadius:6,fontSize:12,fontWeight:700,textAlign:'right',fontFamily:'inherit'}}/>
                    <span style={{fontSize:11.5,color:'var(--sub)',fontWeight:700}}>px</span>
                  </div>
                </div>

                <div style={{fontSize:10.5,color:'var(--mute)',fontWeight:700,marginBottom:4}}>가로 길이</div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <input type="range" min={600} max={1600} step={10}
                    value={Number(draftWidth) || 600}
                    onChange={(e)=>setDraftWidth(Number(e.target.value))}
                    style={{flex:1}}/>
                  <div style={{flex:'none',display:'flex',alignItems:'center',gap:2}}>
                    <input type="number" min={600} max={1600}
                      value={draftWidth}
                      onChange={(e)=>{
                        const raw = e.target.value;
                        setDraftWidth(raw === '' ? '' : Number(raw));
                      }}
                      onKeyDown={(e)=>{ if(e.key === 'Enter') commitWidth(draftWidth); }}
                      style={{width:52,padding:'5px 6px',border:'1px solid var(--line)',borderRadius:6,fontSize:12,fontWeight:700,textAlign:'right',fontFamily:'inherit'}}/>
                    <span style={{fontSize:11.5,color:'var(--sub)',fontWeight:700}}>px</span>
                  </div>
                </div>

                <div style={{fontSize:10.5,color:'var(--mute)',fontWeight:700,marginBottom:4}}>사이드바(목차) 너비</div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                  <input type="range" min={160} max={320} step={10}
                    value={Number(draftSidebarWidth) || 160}
                    onChange={(e)=>setDraftSidebarWidth(Number(e.target.value))}
                    style={{flex:1}}/>
                  <div style={{flex:'none',display:'flex',alignItems:'center',gap:2}}>
                    <input type="number" min={160} max={320}
                      value={draftSidebarWidth}
                      onChange={(e)=>{
                        const raw = e.target.value;
                        setDraftSidebarWidth(raw === '' ? '' : Number(raw));
                      }}
                      onKeyDown={(e)=>{ if(e.key === 'Enter') commitSidebarWidth(draftSidebarWidth); }}
                      style={{width:52,padding:'5px 6px',border:'1px solid var(--line)',borderRadius:6,fontSize:12,fontWeight:700,textAlign:'right',fontFamily:'inherit'}}/>
                    <span style={{fontSize:11.5,color:'var(--sub)',fontWeight:700}}>px</span>
                  </div>
                </div>

                <div style={{display:'flex',gap:6,marginTop:10}}>
                  <button onClick={()=>{ commitHeight(draftHeight); commitWidth(draftWidth); commitSidebarWidth(draftSidebarWidth); }}
                    style={{flex:1,padding:'7px',border:'none',borderRadius:7,background:'var(--grad)',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer'}}>
                    저장
                  </button>
                  <button onClick={()=>{ commitHeight(700); commitWidth(1180); commitSidebarWidth(230); }}
                    style={{flex:1,padding:'7px',border:'1px solid var(--line)',borderRadius:7,background:'#fff',fontSize:11.5,fontWeight:700,color:'var(--mute)',cursor:'pointer'}}>
                    기본값
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{display:'flex',background:'var(--panel)',borderRadius:8,padding:2,gap:2}} title="우측 패널 전체를 구조화된 폼으로 편집할지, HTML 코드로 직접 편집할지 선택">
          <button onClick={()=>onSetEditorMode('simple')} type="button"
            style={{padding:'6px 10px',fontSize:12,fontWeight:700,borderRadius:6,border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:5,
              background: editorMode!=='html' ? '#fff' : 'transparent',color: editorMode!=='html' ? 'var(--ink)' : 'var(--sub)',boxShadow: editorMode!=='html' ? '0 1px 3px rgba(20,30,60,.1)' : 'none'}}>
            🧩 간단 모드
          </button>
          <button onClick={()=>onSetEditorMode('html')} type="button"
            style={{padding:'6px 10px',fontSize:12,fontWeight:700,borderRadius:6,border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:5,
              background: editorMode==='html' ? '#fff' : 'transparent',color: editorMode==='html' ? 'var(--ink)' : 'var(--sub)',boxShadow: editorMode==='html' ? '0 1px 3px rgba(20,30,60,.1)' : 'none'}}>
            {'</>'} HTML 모드
          </button>
        </div>
        <div style={{height:20,width:1,background:'var(--line)',margin:'0 4px'}}/>

        <button style={btnBase} onClick={onNewProject} title="새 프로젝트">
          {window.Icons.File({size:14})} 새로 만들기
        </button>
        <button style={btnBase} onClick={()=>fileRef.current && fileRef.current.click()}
          title="ZIP 다운로드 시 결과물 HTML과 함께 저장되는 편집용 JSON 파일을 불러와 이어서 편집할 수 있어요">
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
        <button style={btnBase} onClick={onSave} title="지금까지 작업한 내용을 이 PC(브라우저)에 저장해요. 다른 PC나 브라우저에서는 불러올 수 없어요">
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
