// Left sidebar - unified panel: 목차(outline, top) + 컴포넌트(palette, bottom), resizable
const { useState: lUseState, useRef: lUseRef } = React;

function ComponentLibrary({ state, activeSectionId, activeTabId, onAddComponent, onSelectSection, onSelectTab, onAddTab, onDeleteTab, onProjectUpdate, targetSection }){
  const containerRef = lUseRef(null);
  const [outlineHeight, setOutlineHeight] = lUseState(300); // px height of 목차 pane
  const draggingRef = lUseRef(false);

  const grouped = {};
  window.COMPONENT_META.forEach(m => {
    if(m.hidden) return;
    (grouped[m.group] ||= []).push(m);
  });

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('component-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // ------- Target label (where a clicked/dropped component will land) -------
  let targetLabel = '표지';
  const activeSec = (state.sidebar||[]).find(s => s.id === activeSectionId);
  if(activeSec){
    targetLabel = activeSec.label;
    if(activeTabId && activeSec.tabs){
      const t = activeSec.tabs.find(tt => tt.id === activeTabId);
      if(t) targetLabel = `${activeSec.label} · ${t.label}`;
    }
  }
  const isCoverActive = activeSectionId === null || activeSec?.kind === 'cover';
  const isCoverEmpty = isCoverActive && window.getComponentList(state, activeSectionId, activeTabId).length === 0;

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
            {isCoverActive
              ? <>표지는 <b style={{color:'var(--blue-dark)'}}>히어로 컴포넌트</b>만 사용할 수 있습니다.</>
              : <>드래그하여 캔버스에 놓거나, 클릭하면 <b style={{color:'var(--blue-dark)'}}>{targetLabel}</b>에 추가됩니다.</>}
          </div>
        </div>
        <div style={{flex:1,minHeight:0,overflowY:'auto',padding:'12px'}}>
          {isCoverActive ? (
            isCoverEmpty ? (
              <div
                onClick={()=>onAddComponent('hero')}
                style={{padding:'22px 14px',textAlign:'center',color:'var(--blue-dark)',fontSize:12,fontWeight:700,lineHeight:1.6,border:'1.5px dashed var(--blue)',background:'var(--grad-soft)',borderRadius:10,cursor:'pointer'}}
              >
                🖼️<br/>히어로 컴포넌트 추가
                <div style={{fontSize:11,color:'var(--mute)',fontWeight:500,marginTop:4}}>클릭하면 표지에 히어로 컴포넌트가 채워집니다.</div>
              </div>
            ) : (
              <div style={{padding:'22px 14px',textAlign:'center',color:'var(--mute)',fontSize:12,lineHeight:1.6,border:'1.5px dashed var(--line)',borderRadius:10}}>
                🖼️<br/>표지에는 히어로 컴포넌트가<br/>자동으로 적용되어 있어요.<br/>다른 컴포넌트는 추가할 수 없습니다.
              </div>
            )
          ) : Object.keys(grouped).map(g => (
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
  const renameSection = (id, label) => {
    onProjectUpdate({ sidebar: state.sidebar.map(s => s.id === id ? { ...s, label } : s) });
  };
  // 그룹명은 여러 섹션이 공유하는 값이므로, 하나를 바꾸면 같은 그룹에 속한 섹션 전체에 반영
  const renameGroup = (oldGroup, newGroup) => {
    onProjectUpdate({ sidebar: state.sidebar.map(s => (s.group||'메뉴') === oldGroup ? { ...s, group: newGroup } : s) });
  };
  const renameTab = (sectionId, tabId, label) => {
    onProjectUpdate({ sidebar: state.sidebar.map(s => s.id === sectionId ? { ...s, tabs: (s.tabs||[]).map(t => t.id === tabId ? { ...t, label } : t) } : s) });
  };
  // 섹션 드래그 리오더 — 드래그 시작한 섹션을 드롭 대상 섹션의 앞/뒤로 옮기고,
  // 다른 그룹 위로 놓으면 그 그룹으로도 함께 이동시킨다.
  const [dragId, setDragId] = lUseState(null);
  const [overId, setOverId] = lUseState(null);
  const [overPos, setOverPos] = lUseState(null); // 'before' | 'after'

  const handleDragStart = (e, id) => {
    e.stopPropagation();
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };
  const handleDragOverRow = (e, id) => {
    if(!dragId || dragId === id) return;
    e.preventDefault(); e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientY - rect.top) < rect.height/2 ? 'before' : 'after';
    setOverId(id); setOverPos(pos);
  };
  const handleDropRow = (e, id) => {
    e.preventDefault(); e.stopPropagation();
    const pos = overPos;
    setDragId(null); setOverId(null); setOverPos(null);
    if(!dragId || dragId === id) return;
    const arr = [...(state.sidebar||[])];
    const fromIdx = arr.findIndex(s => s.id === dragId);
    if(fromIdx < 0) return;
    const [moved] = arr.splice(fromIdx, 1);
    const targetIdx = arr.findIndex(s => s.id === id);
    if(targetIdx < 0){ arr.push(moved); onProjectUpdate({ sidebar: arr }); return; }
    const movedWithGroup = { ...moved, group: arr[targetIdx].group || '메뉴' };
    arr.splice(pos === 'after' ? targetIdx + 1 : targetIdx, 0, movedWithGroup);
    onProjectUpdate({ sidebar: arr });
  };
  const handleDragEndRow = () => { setDragId(null); setOverId(null); setOverPos(null); };

  // 특정 그룹(0뎁스) 바로 아래에 새 섹션(1뎁스)을 추가 — 같은 그룹의 마지막 섹션 다음 위치에 삽입
  const addSectionToGroup = (group) => {
    const sidebar = [...(state.sidebar||[])];
    const num = sidebar.length + 1;
    let insertAt = sidebar.length;
    for(let i = sidebar.length - 1; i >= 0; i--){
      if((sidebar[i].group||'메뉴') === group){ insertAt = i + 1; break; }
    }
    const id = window.uid('sec');
    // 새 섹션엔 기본으로 '섹션 헤딩' 컴포넌트를 하나 넣어둔다 (수정·삭제 자유로운 일반 컴포넌트)
    const headingId = window.uid('c');
    const components = { ...state.components, [headingId]: { id:headingId, type:'section-heading', data: window.DEFAULT_DATA['section-heading'](), style:{spanCols:12} } };
    sidebar.splice(insertAt, 0, { id, label:`섹션 ${num}`, group, kind:'feature', components: [headingId] });
    onProjectUpdate({ sidebar, components, activeSectionId: id });
  };

  // 기존 그룹과 겹치지 않는 완전히 새로운 1뎁스(그룹+첫 섹션)를 추가
  const addNewGroup = () => {
    const existingGroups = new Set((state.sidebar||[]).map(s => s.group || '메뉴'));
    let name = '새 그룹', n = 2;
    while(existingGroups.has(name)){ name = `새 그룹 ${n}`; n++; }
    const sidebar = [...(state.sidebar||[])];
    const id = window.uid('sec');
    const headingId = window.uid('c');
    const components = { ...state.components, [headingId]: { id:headingId, type:'section-heading', data: window.DEFAULT_DATA['section-heading'](), style:{spanCols:12} } };
    sidebar.push({ id, label:'섹션 1', group:name, kind:'feature', components:[headingId] });
    onProjectUpdate({ sidebar, components, activeSectionId:id });
  };

  const iconBtn = {border:'none',background:'none',cursor:'pointer',color:'var(--mute)',padding:4,fontSize:13,borderRadius:5,flex:'none',display:'flex',alignItems:'center',justifyContent:'center',width:22,height:22};

  const rows = [];
  rows.push(
    <button key="hero" onClick={()=>onSelectSection(null)}
      style={{display:'flex',alignItems:'center',gap:8,width:'100%',textAlign:'left',padding:'8px 10px',border:'none',background: activeSectionId===null ? '#fff' : 'transparent',borderRadius:8,fontSize:13,fontWeight:700,color: activeSectionId===null ? 'var(--blue-dark)':'var(--ink)',cursor:'pointer',marginBottom:8,boxShadow: activeSectionId===null ? '0 1px 3px rgba(0,0,0,.06)' : 'none'}}>
      <span>🏠</span>
      <span style={{flex:1}}>표지</span>
      <span style={{fontSize:11,color:'var(--mute)'}}>{state.heroComponents?.length||0}</span>
    </button>
  );
  rows.push(
    <div key="lbl" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'2px 2px 4px'}}>
      <span style={{fontSize:10.5,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>목록</span>
      <button title="새 항목 추가" onClick={addNewGroup} style={iconBtn}
        onMouseEnter={(e)=>e.currentTarget.style.background='var(--panel)'}
        onMouseLeave={(e)=>e.currentTarget.style.background='none'}>+</button>
    </div>
  );

  // ------- 같은 group 값을 공유하는 섹션끼리 묶기 (0뎁스: 그룹, 1뎁스: 섹션, 2뎁스: 하위 탭) -------
  const groupOrder = [];
  const groupedSections = {};
  (state.sidebar||[]).forEach(sec => {
    const g = sec.group || '메뉴';
    if(!groupedSections[g]){ groupedSections[g] = []; groupOrder.push(g); }
    groupedSections[g].push(sec);
  });

  const renderSectionRow = (sec) => {
    const active = activeSectionId === sec.id;
    const tabs = sec.tabs || [];
    const isCover = sec.kind === 'cover';
    const selectThis = () => onSelectSection(sec.id);
    const isDragging = dragId === sec.id;
    const isOver = overId === sec.id && dragId && dragId !== sec.id;
    return (
      <div key={sec.id} style={{marginBottom:2}}>
        <div
          onDragOver={(e)=>handleDragOverRow(e, sec.id)}
          onDrop={(e)=>handleDropRow(e, sec.id)}
          style={{position:'relative',display:'flex',alignItems:'center',gap:2,padding:'4px 4px 3px',borderRadius:9,background: (active && !activeTabId) ? '#fff' : 'transparent',boxShadow: (active && !activeTabId) ? '0 1px 3px rgba(0,0,0,.06)' : 'none',opacity: isDragging?0.4:1}}>
          {isOver && overPos==='before' && (
            <div style={{position:'absolute',top:-2,left:4,right:4,height:2,background:'var(--blue)',borderRadius:2}}/>
          )}
          {isOver && overPos==='after' && (
            <div style={{position:'absolute',bottom:-2,left:4,right:4,height:2,background:'var(--blue)',borderRadius:2}}/>
          )}
          <span
            draggable
            onDragStart={(e)=>handleDragStart(e, sec.id)}
            onDragEnd={handleDragEndRow}
            title="드래그하여 순서 변경"
            style={{flex:'none',cursor:'grab',color:'var(--mute)',fontSize:13,padding:'0 3px',userSelect:'none',lineHeight:1}}
          >⠿</span>
          <div style={{flex:1,minWidth:0,cursor:'pointer',display:'flex',alignItems:'center',gap:5,padding:'2px 6px'}} onClick={selectThis}>
            {isCover && (
              <span style={{flex:'none',fontSize:9,fontWeight:800,color:'var(--purple)',background:'var(--grad-soft)',padding:'1px 6px',borderRadius:999}}>표지</span>
            )}
            {/* 섹션 명칭 - 클릭 시 해당 섹션으로 이동, 인라인 편집 가능 */}
            <input
              value={sec.label}
              onClick={(e)=>{ e.stopPropagation(); selectThis(); }}
              onChange={(e)=>renameSection(sec.id, e.target.value)}
              placeholder="섹션 이름"
              style={{flex:1,minWidth:0,border:'none',background:'transparent',outline:'none',fontSize:13,fontWeight: active?700:600,color: (active && !activeTabId) ? 'var(--blue-dark)':'var(--ink)',padding:'3px 0'}}
            />
          </div>
          {!isCover && (
            <button title="하위 탭 추가" onClick={()=>onAddTab(sec.id)} style={iconBtn}
              onMouseEnter={(e)=>e.currentTarget.style.background='var(--panel)'}
              onMouseLeave={(e)=>e.currentTarget.style.background='none'}>+</button>
          )}
          <button title="섹션 삭제" onClick={()=>{
            if(!confirm('이 섹션을 삭제하시겠습니까? 포함된 컴포넌트도 제거됩니다.')) return;
            const sidebar = state.sidebar.filter(s => s.id !== sec.id);
            const components = {...state.components};
            sec.components.forEach(cid => { delete components[cid]; });
            (sec.tabs||[]).forEach(t => t.components.forEach(cid => { delete components[cid]; }));
            const patch = { sidebar, components };
            if(active) patch.activeSectionId = sidebar[0]?.id || null;
            onProjectUpdate(patch);
          }}
            style={iconBtn}
            onMouseEnter={(e)=>e.currentTarget.style.background='var(--panel)'}
            onMouseLeave={(e)=>e.currentTarget.style.background='none'}>✕</button>
        </div>

        {/* 하위 탭 (2뎁스) */}
        {!!tabs.length && (
          <div style={{marginLeft:16,marginTop:2,paddingLeft:8,borderLeft:'1px dashed var(--line)'}}>
            <div style={{display:'flex',gap:4,margin:'2px 2px 5px'}}>
              {[
                { v:'top', label:'상단만' },
                { v:'toc', label:'목차만' },
                { v:'both', label:'둘 다' },
              ].map(opt => {
                const navActive = (sec.navMode||'top') === opt.v;
                return (
                  <button key={opt.v} title="탭 노출 방식"
                    onClick={()=>onProjectUpdate({ sidebar: state.sidebar.map(s => s.id===sec.id ? { ...s, navMode: opt.v } : s) })}
                    style={{flex:1,padding:'4px 2px',fontSize:10,fontWeight:700,border:'1px solid var(--line)',borderRadius:6,background: navActive ? 'var(--grad)' : '#fff',color: navActive ? '#fff' : 'var(--mute)',cursor:'pointer'}}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {tabs.map(t => {
              const tActive = active && activeTabId === t.id;
              return (
                <div key={t.id} style={{display:'flex',alignItems:'center',gap:2,padding:'2px',borderRadius:8,background: tActive ? '#fff' : 'transparent',boxShadow: tActive ? '0 1px 3px rgba(0,0,0,.06)' : 'none'}}>
                  <span style={{opacity:.5,fontSize:11,padding:'0 2px 0 6px',flex:'none'}}>↳</span>
                  <input
                    value={t.label}
                    onClick={()=>onSelectTab(sec.id, t.id)}
                    onChange={(e)=>renameTab(sec.id, t.id, e.target.value)}
                    placeholder="하위 탭 이름"
                    style={{flex:1,minWidth:0,border:'none',background:'transparent',outline:'none',fontSize:12,fontWeight: tActive?700:500,color: tActive ? 'var(--blue-dark)':'var(--sub)',padding:'6px 4px'}}
                  />
                  <span style={{fontSize:10.5,color:'var(--mute)',flex:'none',padding:'0 2px'}}>{t.components.length}</span>
                  <button title="하위 탭 삭제" onClick={()=>onDeleteTab(sec.id, t.id)} style={{...iconBtn,width:19,height:19,fontSize:11}}
                    onMouseEnter={(e)=>e.currentTarget.style.background='var(--panel)'}
                    onMouseLeave={(e)=>e.currentTarget.style.background='none'}>✕</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  groupOrder.forEach((g, gi) => {
    rows.push(
      <div key={'grp-'+gi} style={{marginBottom:6}}>
        {/* 0뎁스: 그룹(상위 항목) - 편집 시 같은 그룹 내 모든 섹션에 반영, 우측 +로 이 그룹에 섹션 추가 */}
        <div style={{display:'flex',alignItems:'center',gap:2}}>
          <input
            value={g}
            onChange={(e)=>renameGroup(g, e.target.value)}
            placeholder="상위 항목"
            style={{flex:1,minWidth:0,border:'none',background:'transparent',outline:'none',fontSize:10,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.03em',padding:'2px 6px 4px'}}
          />
          <button title="이 그룹에 섹션 추가" onClick={()=>addSectionToGroup(g)} style={iconBtn}
            onMouseEnter={(e)=>e.currentTarget.style.background='var(--panel)'}
            onMouseLeave={(e)=>e.currentTarget.style.background='none'}>+</button>
        </div>
        {/* 1뎁스: 같은 그룹에 속한 섹션들 - 연결선으로 하나의 그룹임을 표시 */}
        <div style={{marginLeft:2,paddingLeft:8,borderLeft:'1.5px solid var(--line)'}}>
          {groupedSections[g].map(sec => renderSectionRow(sec))}
        </div>
      </div>
    );
  });

  // 아직 섹션이 하나도 없을 때만 표시되는 최초 추가 버튼 (그룹이 없으면 우측 + 버튼도 없으므로)
  if(groupOrder.length === 0){
    rows.push(
      <button key="addsec" onClick={()=>addSectionToGroup('메뉴')}
        style={{width:'100%',padding:'8px',marginTop:6,border:'1.5px dashed var(--line)',background:'transparent',borderRadius:8,color:'var(--blue-dark)',fontSize:12,fontWeight:700,cursor:'pointer'}}>
        + 섹션 추가
      </button>
    );
  }

  return <div>{rows}</div>;
}

window.ComponentLibrary = ComponentLibrary;
