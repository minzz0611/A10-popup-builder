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

// ------- Figma-style spacing handle between two components -------
// Renders as an empty spacer the height of the gap; hovering/dragging
// reveals a draggable guide so the gap between component A and B can be
// adjusted directly on the canvas.
const GAP_MIN = 0, GAP_MAX = 120;
function GapHandle({ gap, onChange }){
  const draggingRef = cUseRef(false);
  const [liveGap, setLiveGap] = cUseState(null);
  const [hover, setHover] = cUseState(false);
  const value = liveGap != null ? liveGap : gap;

  const handleDown = (e) => {
    e.preventDefault(); e.stopPropagation();
    draggingRef.current = true;
    const startY = e.clientY;
    const startGap = gap;
    document.body.style.cursor = 'ns-resize';
    const onMove = (ev) => {
      if(!draggingRef.current) return;
      setLiveGap(Math.max(GAP_MIN, Math.min(GAP_MAX, startGap + (ev.clientY - startY))));
    };
    const onUp = (ev) => {
      if(draggingRef.current){
        draggingRef.current = false;
        document.body.style.cursor = '';
        const g = Math.max(GAP_MIN, Math.min(GAP_MAX, startGap + (ev.clientY - startY)));
        onChange(g);
        setLiveGap(null);
      }
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const active = hover || liveGap != null;
  return (
    <div
      onClick={(e)=>e.stopPropagation()}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      onMouseDown={handleDown}
      style={{ position:'relative', height: Math.max(value, 10), cursor:'ns-resize' }}
    >
      {active && (
        <>
          <div style={{position:'absolute',left:0,right:0,top:'50%',height:2,background:'var(--blue)',opacity:.55,transform:'translateY(-1px)'}}/>
          <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',background:'var(--blue)',color:'#fff',fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:999,whiteSpace:'nowrap',boxShadow:'0 2px 6px rgba(0,0,0,.25)',zIndex:6}}>{value}px</div>
        </>
      )}
    </div>
  );
}

// ============================================================
// Canvas
// ============================================================
function Canvas({ state, selectedId, activeSectionId, activeTabId, onSelect, onSelectSection, onSelectTab, onUpdateComp, onUpdateStyle, onUpdateTopGap, onReorder, onContextMenu, targetSection, previewOnly }){
  const [dragOverId, setDragOverId] = cUseState(null);
  const [dragOverPos, setDragOverPos] = cUseState(null); // 'before' | 'after'
  const draggingCompId = cUseRef(null);

  const activeSec = activeSectionId === null ? null : (state.sidebar||[]).find(s=>s.id===activeSectionId);
  const activeTab = activeSec?.tabs?.find(t=>t.id===activeTabId) || null;
  const topGap = state.popup?.topGap ?? 30; // 상세 화면 콘텐츠 맨 위, 첫 컴포넌트 앞 여백
  const windowHeight = state.popup?.windowHeight ?? 700; // 표지·상세 화면이 공유하는 팝업 창 높이

  // Current list of components based on active section (and sub-tab, if any)
  const componentList = window.getComponentList(state, activeSectionId, activeTabId);

  const editing = !previewOnly;

  // Renders the component list with a Figma-style, draggable spacing
  // handle between each pair — the single place both screens pull from.
  const renderComponentList = () => {
    const out = [];
    componentList.forEach((cid, idx) => {
      const c = state.components[cid];
      if(!c) return;
      const R = window.RENDERERS[c.type];
      out.push(
        <CompFrame key={cid} comp={c} selected={selectedId===cid} onSelect={onSelect} onContextMenu={onContextMenu}
          isDragOver={dragOverId===cid} dragOverPosition={dragOverPos}
          onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} onDragEnd={handleDragEnd}>
          <R data={c.data} editing={editing} onChange={(newData)=>onUpdateComp(cid, newData)}/>
        </CompFrame>
      );
      if(idx < componentList.length - 1){
        const gap = c.style?.gapAfter ?? 20;
        out.push(editing
          ? <GapHandle key={cid+'-gap'} gap={gap} onChange={(g)=>onUpdateStyle && onUpdateStyle(cid, { gapAfter: g })}/>
          : <div key={cid+'-gap'} style={{height:gap}}/>
        );
      }
    });
    return out;
  };

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
        <div style={{maxWidth:1180, margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:14, color:'var(--mute)', fontSize:12, fontWeight:600, letterSpacing:'.02em'}}>
            🏠 표지 (팝업 첫 진입 시 표시)
          </div>
          <div style={{background:'#fff', borderRadius:12, boxShadow:'var(--shadow-lg)', overflow:'hidden', position:'relative', display:'flex', flexDirection:'column', height: windowHeight}}
            onClick={()=>onSelect(null)}
            onDragOver={handleContainerDragOver}
            onDrop={handleContainerDrop}
          >
            <button style={{position:'absolute',top:18,right:20,width:34,height:34,borderRadius:'50%',border:'none',background:'#F1F2F5',color:'#66707F',fontSize:18,cursor:'default',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}}>✕</button>
            <div style={{flex:1, minHeight:0, overflowY:'auto'}}>
              {componentList.length === 0 && (
                <div style={{padding:'80px 40px', textAlign:'center', border:'2px dashed var(--line)', borderRadius:12, color:'var(--mute)'}}>
                  <div style={{fontSize:32, marginBottom:12}}>🖼️</div>
                  <div style={{fontSize:14, fontWeight:700, color:'var(--sub)', marginBottom:6}}>표지는 히어로 컴포넌트로 채워집니다</div>
                  <div style={{fontSize:12}}>좌측 팔레트에서 히어로 컴포넌트를 클릭해 추가하세요.</div>
                </div>
              )}
              {renderComponentList()}
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
        <div style={{background:'#fff', borderRadius:12, boxShadow:'var(--shadow-lg)', overflow:'hidden', display:'flex', flexDirection:'column', height: windowHeight}}
          onClick={()=>onSelect(null)}>
          <div style={{position:'relative', display:'flex', flex:1, minHeight:0, borderTop:'1px solid var(--line)'}}>
            {/* Sidebar mock */}
            <nav style={{width:230, flex:'none', background:'var(--panel)', padding:'22px 14px', borderRight:'1px solid var(--line)', overflowY:'auto'}}>
              <SidebarNav state={state} activeSectionId={activeSectionId} activeTabId={activeTabId}
                onSelect={(id)=>onSelectSection && onSelectSection(id)}
                onSelectTab={(secId, tabId)=>{ if(secId===activeSectionId) onSelectTab(tabId); }}/>
            </nav>
            {/* Content editable */}
            <div style={{flex:1, padding:'0 44px 20px', overflowY:'auto'}}
              onDragOver={handleContainerDragOver}
              onDrop={handleContainerDrop}
            >
              {editing
                ? <GapHandle gap={topGap} onChange={(g)=>onUpdateTopGap && onUpdateTopGap(g)}/>
                : <div style={{height:topGap}}/>}
              {!!(activeSec?.tabs?.length) && (activeSec.navMode==='top' || activeSec.navMode==='both' || !activeSec.navMode) && (
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
              {renderComponentList()}
              {editing && componentList.length === 1 && activeSec?.kind !== 'cover' && state.components[componentList[0]]?.type === 'section-heading' && (
                <div style={{marginTop:14, padding:'26px 20px', textAlign:'center', border:'2px dashed var(--line)', borderRadius:12, color:'var(--mute)'}}>
                  <div style={{fontSize:26, marginBottom:8}}>📥</div>
                  <div style={{fontSize:13, fontWeight:700, color:'var(--sub)', marginBottom:4}}>아래에 컴포넌트를 추가하세요</div>
                  <div style={{fontSize:11.5}}>좌측 팔레트에서 원하는 컴포넌트를 끌어다 놓거나 클릭해서 추가할 수 있어요.</div>
                </div>
              )}
            </div>
          </div>
          <PopupFooter state={state}/>
        </div>
      </div>
    </div>
  );
}

function SidebarNav({ state, activeSectionId, activeTabId, onSelect, onSelectTab }){
  // Group sidebar items by group
  const grouped = {};
  (state.sidebar||[]).forEach(s => (grouped[s.group||'메뉴'] ||= []).push(s));
  const out = [];
  Object.keys(grouped).forEach((g,gi) => {
    out.push(<div key={'g'+gi} style={{fontSize:12,color:'#9199A6',fontWeight:700,padding:'8px 10px 4px',letterSpacing:'.02em'}}>{g}</div>);
    grouped[g].forEach(s => {
      const active = s.id === activeSectionId;
      const navMode = s.navMode || 'top';
      const showSubmenu = active && !!(s.tabs && s.tabs.length) && (navMode === 'toc' || navMode === 'both');
      out.push(
        <button key={s.id} onClick={(e)=>{ e.stopPropagation(); onSelect(s.id); }}
          style={{display:'flex',alignItems:'center',gap:10,width:'100%',textAlign:'left',background: active ? '#fff' : 'none', border:'none',padding:'11px 12px',borderRadius:10,fontSize:14.5,color: active ? 'var(--blue-dark)' : 'var(--sub)',cursor:'pointer',fontWeight:600,marginBottom:2, boxShadow: active ? '0 2px 8px rgba(30,50,120,.08)' : 'none'}}>
          <span style={{flex:1}}>{s.label}</span>
        </button>
      );
      // 하위 뎁스: 이 섹션의 탭들을 사이드바 안에 들여쓰기하여 표시 (목차 노출)
      if(showSubmenu){
        out.push(
          <div key={s.id+'-sub'} style={{margin:'0 0 6px 12px',paddingLeft:10,borderLeft:'1.5px solid var(--line)'}}>
            {s.tabs.map((t,ti) => {
              const tActive = activeTabId === t.id;
              return (
                <button key={t.id} onClick={(e)=>{ e.stopPropagation(); onSelectTab && onSelectTab(s.id, t.id); }}
                  style={{display:'flex',alignItems:'center',gap:8,width:'100%',textAlign:'left',background: tActive ? '#fff' : 'none', border:'none',padding:'9px 10px',borderRadius:8,fontSize:13,color: tActive ? 'var(--blue-dark)' : 'var(--sub)',cursor:'pointer',fontWeight:600,marginBottom:2, boxShadow: tActive ? '0 2px 8px rgba(30,50,120,.08)' : 'none'}}>
                  <span style={{flex:1}}>{t.label}</span>
                </button>
              );
            })}
          </div>
        );
      }
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
