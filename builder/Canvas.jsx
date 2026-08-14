// Center canvas - shows the popup preview WITH editing affordances (drag, select, resize handles)

const { useState: cUseState, useRef: cUseRef, useEffect: cUseEffect } = React;

// ------- Draggable component wrapper -------
function CompFrame({ comp, selected, onSelect, onContextMenu, isDragOver, dragOverPosition, onDragStart, onDragOver, onDrop, onDragEnd, children }){
  const R = window.RENDERERS[comp.type];
  return (
    <div
      data-comp-id={comp.id}
      draggable
      onDragStart={(e)=>onDragStart(e, comp.id)}
      onDragOver={(e)=>onDragOver(e, comp.id)}
      onDrop={(e)=>onDrop(e, comp.id)}
      onDragEnd={onDragEnd}
      onClick={(e)=>{ e.stopPropagation(); onSelect(comp.id); }}
      onContextMenu={(e)=>{ e.preventDefault(); e.stopPropagation(); onSelect(comp.id); onContextMenu(e, comp.id); }}
      style={{
        position:'relative',
        borderRadius:10,
        outline: selected ? '2px solid var(--blue)' : '2px solid transparent',
        outlineOffset: 2,
        transition:'outline .12s',
        cursor: 'grab',
        marginBottom: 6,
      }}
    >
      {/* Drop indicator */}
      {isDragOver && dragOverPosition === 'before' && (
        <div style={{position:'absolute',top:-4,left:0,right:0,height:3,background:'var(--blue)',borderRadius:3,zIndex:5}}/>
      )}
      {isDragOver && dragOverPosition === 'after' && (
        <div style={{position:'absolute',bottom:-4,left:0,right:0,height:3,background:'var(--blue)',borderRadius:3,zIndex:5}}/>
      )}

      {/* Hover/select label */}
      {selected && (
        <div style={{position:'absolute',top:-24,left:0,background:'var(--blue)',color:'#fff',fontSize:10.5,fontWeight:700,padding:'2px 8px',borderRadius:'4px 4px 0 0',zIndex:5,display:'flex',alignItems:'center',gap:6,pointerEvents:'none'}}>
          <span style={{cursor:'grab'}}>⋮⋮</span>
          {window.COMPONENT_META.find(m=>m.type===comp.type)?.label || comp.type}
        </div>
      )}
      {/* Actual component */}
      <div style={{ position:'relative', pointerEvents: selected ? 'auto' : 'auto' }}>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// Canvas
// ============================================================
function Canvas({ state, selectedId, activeSectionId, activeTabId, onSelect, onSelectTab, onUpdateComp, onReorder, onContextMenu, targetSection, previewOnly }){
  const [dragOverId, setDragOverId] = cUseState(null);
  const [dragOverPos, setDragOverPos] = cUseState(null); // 'before' | 'after'
  const draggingCompId = cUseRef(null);

  const activeSec = activeSectionId === null ? null : (state.sidebar||[]).find(s=>s.id===activeSectionId);
  const activeTab = activeSec?.tabs?.find(t=>t.id===activeTabId) || null;

  // Current list of components based on active section (and sub-tab, if any)
  const componentList = activeSectionId === null
    ? (state.heroComponents || [])
    : (activeTab ? activeTab.components : (activeSec?.components || []));

  const editing = !previewOnly;

  const handleDragStart = (e, id) => {
    draggingCompId.current = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('reorder-id', id);
    // Ghost styling
    setTimeout(()=>{
      const el = document.querySelector(`[data-comp-id="${id}"]`);
      if(el) el.style.opacity = '0.4';
    }, 0);
  };
  const handleDragEnd = () => {
    const id = draggingCompId.current;
    if(id){
      const el = document.querySelector(`[data-comp-id="${id}"]`);
      if(el) el.style.opacity = '1';
    }
    draggingCompId.current = null;
    setDragOverId(null);
    setDragOverPos(null);
  };
  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = e.dataTransfer.types.includes('component-type') ? 'copy' : 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientY - rect.top) < rect.height/2 ? 'before' : 'after';
    setDragOverId(id);
    setDragOverPos(pos);
  };
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const compType = e.dataTransfer.getData('component-type');
    const reorderId = e.dataTransfer.getData('reorder-id');
    const pos = dragOverPos;
    setDragOverId(null); setDragOverPos(null);
    if(compType){
      // new component from palette
      onReorder({ action:'insert-new', type: compType, targetId, position: pos });
    } else if(reorderId && reorderId !== targetId){
      onReorder({ action:'move', sourceId: reorderId, targetId, position: pos });
    }
  };
  // Drop on empty section area
  const handleContainerDragOver = (e) => {
    if(componentList.length > 0) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  const handleContainerDrop = (e) => {
    if(componentList.length > 0) return;
    e.preventDefault();
    const compType = e.dataTransfer.getData('component-type');
    if(compType){
      onReorder({ action:'insert-new', type: compType, targetId: null, position: 'after' });
    }
  };

  // === HERO SCREEN ===
  if(activeSectionId === null){
    return (
      <div style={{background:'#EBEEF3', padding:'40px 20px', minHeight:'100%'}}>
        <div style={{maxWidth:900, margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:14, color:'var(--mute)', fontSize:12, fontWeight:600, letterSpacing:'.02em'}}>
            🏠 히어로 화면 (팝업 첫 진입 시 표시)
          </div>
          <div style={{background:'#fff', borderRadius:12, boxShadow:'var(--shadow-lg)', overflow:'hidden', position:'relative'}}
            onClick={()=>onSelect(null)}
            onDragOver={handleContainerDragOver}
            onDrop={handleContainerDrop}
          >
            <button style={{position:'absolute',top:18,right:20,width:34,height:34,borderRadius:'50%',border:'none',background:'#F1F2F5',color:'#66707F',fontSize:18,cursor:'default',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}}>✕</button>
            <div style={{padding:'12px 14px'}}>
              {componentList.length === 0 && (
                <div style={{padding:'80px 40px', textAlign:'center', border:'2px dashed var(--line)', borderRadius:12, color:'var(--mute)'}}>
                  <div style={{fontSize:32, marginBottom:12}}>📥</div>
                  <div style={{fontSize:14, fontWeight:700, color:'var(--sub)', marginBottom:6}}>여기에 컴포넌트를 드래그하세요</div>
                  <div style={{fontSize:12}}>또는 좌측 팔레트에서 클릭하여 추가할 수 있습니다.</div>
                </div>
              )}
              {componentList.map(cid => {
                const c = state.components[cid];
                if(!c) return null;
                const R = window.RENDERERS[c.type];
                return (
                  <CompFrame key={cid} comp={c} selected={selectedId===cid} onSelect={onSelect} onContextMenu={onContextMenu}
                    isDragOver={dragOverId===cid} dragOverPosition={dragOverPos}
                    onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} onDragEnd={handleDragEnd}>
                    <R data={c.data} editing={editing} onChange={(newData)=>onUpdateComp(cid, newData)}/>
                  </CompFrame>
                );
              })}
            </div>
            {/* Footer preview */}
            <PopupFooter state={state}/>
          </div>
        </div>
      </div>
    );
  }

  // === DETAIL SCREEN (sidebar + content) ===
  return (
    <div style={{background:'#EBEEF3', padding:'40px 20px', minHeight:'100%'}}>
      <div style={{maxWidth:1180, margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:14, color:'var(--mute)', fontSize:12, fontWeight:600, letterSpacing:'.02em'}}>
          {activeSec?.kind === 'cover' ? '🖼️ 표지 화면' : '📄 상세 화면'} · {activeSec?.label}{activeTab ? ` · ${activeTab.label}` : ''}
        </div>
        <div style={{background:'#fff', borderRadius:12, boxShadow:'var(--shadow-lg)', overflow:'hidden', display:'flex', flexDirection:'column', minHeight:600}}
          onClick={()=>onSelect(null)}>
          <div style={{position:'relative', display:'flex', flex:1, minHeight:0, borderTop:'1px solid var(--line)'}}>
            {/* Sidebar mock */}
            <nav style={{width:230, flex:'none', background:'var(--panel)', padding:'22px 14px', borderRight:'1px solid var(--line)'}}>
              <SidebarNav state={state} activeSectionId={activeSectionId} onSelect={(id)=>{
                // clicking sidebar in canvas doesn't switch section; that's for real popup
              }}/>
            </nav>
            {/* Content editable */}
            <div style={{flex:1, padding:'18px 44px 20px', overflowY:'auto'}}
              onDragOver={handleContainerDragOver}
              onDrop={handleContainerDrop}
            >
              {!!(activeSec?.tabs?.length) && (
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:18}} onClick={(e)=>e.stopPropagation()}>
                  {activeSec.tabs.map(t => (
                    <button key={t.id} onClick={()=>onSelectTab(t.id)}
                      style={{border:'1px solid var(--line)',background: t.id===activeTabId ? 'var(--grad)' : '#fff',color: t.id===activeTabId ? '#fff' : 'var(--sub)',borderColor: t.id===activeTabId ? 'transparent' : 'var(--line)',fontWeight:700,fontSize:12.5,padding:'8px 15px',borderRadius:999,cursor:'pointer'}}>
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
              {componentList.length === 0 && (
                <div style={{padding:'80px 40px', textAlign:'center', border:'2px dashed var(--line)', borderRadius:12, color:'var(--mute)'}}>
                  <div style={{fontSize:32, marginBottom:12}}>{activeSec?.kind === 'cover' ? '🖼️' : '📥'}</div>
                  <div style={{fontSize:14, fontWeight:700, color:'var(--sub)', marginBottom:6}}>
                    {activeSec?.kind === 'cover' ? '표지 섹션은 히어로 컴포넌트로 채워집니다' : '여기에 컴포넌트를 드래그하세요'}
                  </div>
                  <div style={{fontSize:12}}>
                    {activeSec?.kind === 'cover' ? '좌측 팔레트에서 히어로 컴포넌트를 클릭해 추가하세요.' : '좌측 팔레트에서 원하는 컴포넌트를 끌어다 놓으세요.'}
                  </div>
                </div>
              )}
              {componentList.map(cid => {
                const c = state.components[cid];
                if(!c) return null;
                const R = window.RENDERERS[c.type];
                return (
                  <CompFrame key={cid} comp={c} selected={selectedId===cid} onSelect={onSelect} onContextMenu={onContextMenu}
                    isDragOver={dragOverId===cid} dragOverPosition={dragOverPos}
                    onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} onDragEnd={handleDragEnd}>
                    <R data={c.data} editing={editing} onChange={(newData)=>onUpdateComp(cid, newData)}/>
                  </CompFrame>
                );
              })}
            </div>
          </div>
          <PopupFooter state={state}/>
        </div>
      </div>
    </div>
  );
}

function SidebarNav({ state, activeSectionId, onSelect }){
  // Group sidebar items by group
  const grouped = {};
  (state.sidebar||[]).forEach(s => (grouped[s.group||'메뉴'] ||= []).push(s));
  const out = [];
  Object.keys(grouped).forEach((g,gi) => {
    out.push(<div key={'g'+gi} style={{fontSize:12,color:'#9199A6',fontWeight:700,padding:'8px 10px 4px',letterSpacing:'.02em'}}>{g}</div>);
    grouped[g].forEach(s => {
      const active = s.id === activeSectionId;
      out.push(
        <button key={s.id} onClick={(e)=>{ e.stopPropagation(); onSelect(s.id); }}
          style={{display:'flex',alignItems:'center',gap:10,width:'100%',textAlign:'left',background: active ? '#fff' : 'none', border:'none',padding:'11px 12px',borderRadius:10,fontSize:14.5,color: active ? 'var(--blue-dark)' : 'var(--sub)',cursor:'pointer',fontWeight:600,marginBottom:2, boxShadow: active ? '0 2px 8px rgba(30,50,120,.08)' : 'none'}}>
          <span style={{flex:1}}>{s.label}</span>
        </button>
      );
    });
  });
  return <div>{out}</div>;
}

function PopupFooter({ state }){
  const p = state.popup || {};
  const f = p.footer || {};
  return (
    <>
      {p.dontShowOption && (
        <div style={{flex:'none',padding:'12px 44px',display:'flex',justifyContent:'flex-end',borderTop:'1px solid var(--line)'}}>
          <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--sub)',cursor:'default'}}>
            <input type="checkbox" style={{width:16,height:16,accentColor:'var(--blue)',margin:0}}/>
            다시 보지 않기
          </label>
        </div>
      )}
      <div style={{flex:'none',borderTop:'1px solid var(--line)',padding:'16px 44px',display:'flex',justifyContent:'space-between',alignItems:'center',color:'#9199A6',fontSize:12.3}}>
        <div>{(f.links||[]).map((l,i) => <span key={i} style={{marginRight:16}}>{l}</span>)}</div>
        <div>{f.phone && <>전국 어디서나 <b>{f.phone}</b></>} {f.phone && f.url && ' | '} {f.url}</div>
      </div>
    </>
  );
}

window.Canvas = Canvas;
window.SidebarNav = SidebarNav;
window.PopupFooter = PopupFooter;
