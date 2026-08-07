// Left sidebar - unified panel: 목차(outline, top) + 컴포넌트(palette, bottom), resizable
const { useState: lUseState, useRef: lUseRef } = React;

function ComponentLibrary({ state, activeSectionId, activeTabId, onAddComponent, onSelectSection, onSelectTab, onAddTab, onDeleteTab, onProjectUpdate, targetSection }){
  const containerRef = lUseRef(null);
  const [outlineHeight, setOutlineHeight] = lUseState(300); // px height of 목차 pane
  const draggingRef = lUseRef(false);

  const grouped = {};
  window.COMPONENT_META.forEach(m => {
    (grouped[m.group] ||= []).push(m);
  });

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('component-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // ------- Target label (where a clicked/dropped component will land) -------
  let targetLabel = '히어로 화면';
  const activeSec = (state.sidebar||[]).find(s => s.id === activeSectionId);
  if(activeSec){
    targetLabel = activeSec.label;
    if(activeTabId && activeSec.tabs){
      const t = activeSec.tabs.find(tt => tt.id === activeTabId);
      if(t) targetLabel = `${activeSec.label} · ${t.label}`;
    }
  }

  // ------- Resizer drag handling -------
  const handleResizeStart = (e) => {
    e.preventDefault();
    draggingRef.current = true;
    const startY = e.clientY;
    const startH = outlineHeight;
    document.body.style.cursor = 'row-resize';
    const onMove = (ev) => {
      if(!draggingRef.current) return;
      const containerH = containerRef.current ? containerRef.current.clientHeight : 640;
      const minTop = 140, minBottom = 180;
      let next = startH + (ev.clientY - startY);
      next = Math.max(minTop, Math.min(next, containerH - minBottom));
      setOutlineHeight(next);
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div ref={containerRef} style={{display:'flex',flexDirection:'column',height:'100%',minHeight:0,background:'#F8F9FB',borderRight:'1px solid var(--line)'}}>

      {/* ===== 목차 (outline) pane ===== */}
      <div style={{height:outlineHeight,flex:'none',display:'flex',flexDirection:'column',minHeight:0}}>
        <div style={{flex:'none',padding:'13px 14px 10px',borderBottom:'1px solid var(--line)',background:'#F8F9FB'}}>
          <div style={{fontSize:12.5,fontWeight:800,color:'var(--ink)',letterSpacing:'-.01em'}}>목차</div>
        </div>
        <div style={{flex:1,minHeight:0,overflowY:'auto',padding:'10px 12px'}}>
          <SectionsTree
            state={state}
            activeSectionId={activeSectionId}
            activeTabId={activeTabId}
            onSelectSection={onSelectSection}
            onSelectTab={onSelectTab}
            onAddTab={onAddTab}
            onDeleteTab={onDeleteTab}
            onProjectUpdate={onProjectUpdate}
          />
        </div>
      </div>

      {/* ===== Resizer ===== */}
      <div
        onMouseDown={handleResizeStart}
        title="드래그하여 영역 크기 조절"
        style={{flex:'none',height:9,cursor:'row-resize',position:'relative',background:'#F1F2F5',borderTop:'1px solid var(--line)',borderBottom:'1px solid var(--line)'}}
      >
        <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',width:32,height:3,borderRadius:3,background:'var(--mute)',opacity:.5}}/>
      </div>

      {/* ===== 컴포넌트 (palette) pane ===== */}
      <div style={{flex:1,minHeight:0,display:'flex',flexDirection:'column'}}>
        <div style={{flex:'none',padding:'12px 14px 8px',borderBottom:'1px solid var(--line)'}}>
          <div style={{fontSize:12.5,fontWeight:800,color:'var(--ink)',letterSpacing:'-.01em',marginBottom:5}}>컴포넌트</div>
          <div style={{fontSize:11,color:'var(--mute)',lineHeight:1.5}}>
            드래그하여 캔버스에 놓거나, 클릭하면 <b style={{color:'var(--blue-dark)'}}>{targetLabel}</b>에 추가됩니다.
          </div>
        </div>
        <div style={{flex:1,minHeight:0,overflowY:'auto',padding:'12px'}}>
          {Object.keys(grouped).map(g => (
            <div key={g} style={{marginBottom:14}}>
              <div style={{fontSize:10.5,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',padding:'0 4px 6px'}}>{g}</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                {grouped[g].map(m => (
                  <div key={m.type}
                    draggable
                    onDragStart={(e)=>handleDragStart(e, m.type)}
                    onClick={()=>onAddComponent(m.type)}
                    style={{
                      background:'#fff',border:'1px solid var(--line)',borderRadius:9,
                      padding:'10px 10px',cursor:'grab',transition:'.15s',
                      display:'flex',flexDirection:'column',gap:5,minHeight:66,
                    }}
                    onMouseEnter={(e)=>{e.currentTarget.style.borderColor='var(--blue)';e.currentTarget.style.background='linear-gradient(180deg,#F8FAFF,#fff)';}}
                    onMouseLeave={(e)=>{e.currentTarget.style.borderColor='var(--line)';e.currentTarget.style.background='#fff';}}
                    title={m.desc}
                  >
                    <div style={{color:'var(--blue-dark)'}}>{window.Icons[m.icon]({size:16})}</div>
                    <div style={{fontSize:11.5,fontWeight:700,color:'var(--ink)',lineHeight:1.3}}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionsTree({ state, activeSectionId, activeTabId, onSelectSection, onSelectTab, onAddTab, onDeleteTab, onProjectUpdate }){
  const rows = [];
  rows.push(
    <button key="hero" onClick={()=>onSelectSection(null)}
      style={{display:'flex',alignItems:'center',gap:8,width:'100%',textAlign:'left',padding:'8px 10px',border:'none',background: activeSectionId===null ? '#fff' : 'transparent',borderRadius:8,fontSize:13,fontWeight:700,color: activeSectionId===null ? 'var(--blue-dark)':'var(--ink)',cursor:'pointer',marginBottom:4,boxShadow: activeSectionId===null ? '0 1px 3px rgba(0,0,0,.06)' : 'none'}}>
      <span>🏠</span>
      <span style={{flex:1}}>히어로 화면</span>
      <span style={{fontSize:11,color:'var(--mute)'}}>{state.heroComponents?.length||0}</span>
    </button>
  );
  rows.push(<div key="div" style={{height:1,background:'var(--line)',margin:'8px 0'}}/>);
  rows.push(<div key="lbl" style={{fontSize:10.5,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',padding:'6px 4px 4px'}}>사이드메뉴 섹션</div>);
  (state.sidebar||[]).forEach(sec => {
    const active = activeSectionId === sec.id;
    const tabs = sec.tabs || [];
    rows.push(
      <div key={sec.id} style={{marginBottom:4}}>
        <div style={{display:'flex',alignItems:'center',gap:4}}>
          <button onClick={()=>onSelectSection(sec.id)}
            style={{display:'flex',alignItems:'center',gap:8,flex:1,textAlign:'left',padding:'8px 10px',border:'none',background: (active && !activeTabId) ? '#fff' : 'transparent',borderRadius:8,fontSize:13,fontWeight: active?700:600,color: (active && !activeTabId) ? 'var(--blue-dark)':'var(--ink)',cursor:'pointer',boxShadow: (active && !activeTabId) ? '0 1px 3px rgba(0,0,0,.06)' : 'none'}}>
            <span style={{flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{sec.label}</span>
            {!tabs.length && <span style={{fontSize:11,color:'var(--mute)'}}>{sec.components.length}</span>}
          </button>
          <button title="삭제" onClick={()=>{
            if(!confirm('이 섹션을 삭제하시겠습니까? 포함된 컴포넌트도 제거됩니다.')) return;
            const sidebar = state.sidebar.filter(s => s.id !== sec.id);
            const components = {...state.components};
            sec.components.forEach(cid => { delete components[cid]; });
            (sec.tabs||[]).forEach(t => t.components.forEach(cid => { delete components[cid]; }));
            const patch = { sidebar, components };
            if(active) patch.activeSectionId = sidebar[0]?.id || null;
            onProjectUpdate(patch);
          }}
            style={{border:'none',background:'none',cursor:'pointer',color:'var(--mute)',padding:4,fontSize:12}}>✕</button>
        </div>

        {/* 하위 탭 */}
        <div style={{marginLeft:18,marginTop:2,paddingLeft:8,borderLeft:'1px dashed var(--line)'}}>
          {tabs.map(t => {
            const tActive = active && activeTabId === t.id;
            return (
              <div key={t.id} style={{display:'flex',alignItems:'center',gap:4}}>
                <button onClick={()=>onSelectTab(sec.id, t.id)}
                  style={{display:'flex',alignItems:'center',gap:6,flex:1,textAlign:'left',padding:'6px 9px',border:'none',background: tActive ? '#fff' : 'transparent',borderRadius:7,fontSize:12,fontWeight: tActive?700:500,color: tActive ? 'var(--blue-dark)':'var(--sub)',cursor:'pointer',boxShadow: tActive ? '0 1px 3px rgba(0,0,0,.06)' : 'none'}}>
                  <span style={{opacity:.6}}>↳</span>
                  <span style={{flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.label}</span>
                  <span style={{fontSize:10.5,color:'var(--mute)'}}>{t.components.length}</span>
                </button>
                <button title="하위 탭 삭제" onClick={()=>onDeleteTab(sec.id, t.id)}
                  style={{border:'none',background:'none',cursor:'pointer',color:'var(--mute)',padding:3,fontSize:11}}>✕</button>
              </div>
            );
          })}
          <button onClick={()=>onAddTab(sec.id)}
            style={{width:'100%',textAlign:'left',padding:'5px 9px',marginTop:2,marginBottom:6,border:'none',background:'transparent',color:'var(--blue-dark)',fontSize:11.5,fontWeight:700,cursor:'pointer'}}>
            + 하위 탭 추가
          </button>
        </div>
      </div>
    );
  });
  rows.push(
    <button key="addsec" onClick={()=>{
      const id = window.uid('sec');
      const num = (state.sidebar||[]).length + 1;
      onProjectUpdate({
        sidebar: [...(state.sidebar||[]), { id, label:`섹션 ${num}`, group:'메뉴', components: [] }],
        activeSectionId: id,
      });
    }}
      style={{width:'100%',padding:'8px',marginTop:6,border:'1.5px dashed var(--line)',background:'transparent',borderRadius:8,color:'var(--blue-dark)',fontSize:12,fontWeight:700,cursor:'pointer'}}>
      + 섹션 추가
    </button>
  );

  return <div>{rows}</div>;
}

window.ComponentLibrary = ComponentLibrary;
