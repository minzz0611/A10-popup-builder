// ============================================================
// PopBuilder root
// ============================================================
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const STORAGE_KEY = 'popbuilder_state_v1';
const HISTORY_LIMIT = 30;

function App(){
  const [state, setState] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null); // null = hero screen
  const [activeTabId, setActiveTabId] = useState(null); // sub-tab within active section, if any
  const [contextMenu, setContextMenu] = useState(null); // {x,y,compId}
  const [showPreview, setShowPreview] = useState(false);
  const [savedTick, setSavedTick] = useState(0);
  const [importObj, setImportObj] = useState(null); // parsed JSON awaiting 전체교체/선택가져오기 결정
  const history = useRef({ past:[], future:[] });

  // ------- Boot: load from localStorage or show gallery -------
  useEffect(()=>{
    try{
      const s = localStorage.getItem(STORAGE_KEY);
      if(s){
        const parsed = JSON.parse(s);
        setState(parsed);
        setActiveSectionId(null);
        return;
      }
    } catch(e){}
    setShowGallery(true);
  }, []);

  // ------- Persist -------
  useEffect(()=>{
    if(state){
      try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){}
    }
  }, [state]);

  // ------- History (undo/redo) -------
  const commit = useCallback((newStateOrFn, options={}) => {
    setState(prev => {
      const next = typeof newStateOrFn === 'function' ? newStateOrFn(prev) : newStateOrFn;
      if(!options.silent && prev){
        history.current.past.push(prev);
        if(history.current.past.length > HISTORY_LIMIT) history.current.past.shift();
        history.current.future = [];
      }
      return next;
    });
  }, []);
  const undo = () => {
    setState(prev => {
      if(!history.current.past.length) return prev;
      const last = history.current.past.pop();
      history.current.future.push(prev);
      return last;
    });
  };
  const redo = () => {
    setState(prev => {
      if(!history.current.future.length) return prev;
      const next = history.current.future.pop();
      history.current.past.push(prev);
      return next;
    });
  };
  useEffect(()=>{
    const h = (e) => {
      if((e.ctrlKey||e.metaKey) && !e.shiftKey && e.key.toLowerCase()==='z'){ e.preventDefault(); undo(); }
      else if(((e.ctrlKey||e.metaKey) && e.shiftKey && e.key.toLowerCase()==='z') || ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='y')){ e.preventDefault(); redo(); }
      else if(e.key === 'Delete' && selectedId){
        // Only if focus is on canvas (not on an input)
        const tag = document.activeElement && document.activeElement.tagName;
        if(tag !== 'INPUT' && tag !== 'TEXTAREA' && !document.activeElement?.isContentEditable){
          e.preventDefault();
          handleDeleteComponent(selectedId);
        }
      }
    };
    window.addEventListener('keydown', h);
    return ()=>window.removeEventListener('keydown', h);
  }, [selectedId]);

  // ------- Template pick -------
  const pickTemplate = (t) => {
    const st = t.build();
    history.current = { past:[], future:[] };
    setState(st);
    setActiveSectionId(null);
    setActiveTabId(null);
    setSelectedId(null);
    setShowGallery(false);
  };
  const loadJson = (obj) => {
    if(!obj || !obj.components || !obj.meta){ alert('올바르지 않은 편집상태 파일입니다.'); return; }
    history.current = { past:[], future:[] };
    setState(obj);
    setActiveSectionId(obj.activeSectionId && obj.sidebar?.find(s=>s.id===obj.activeSectionId) ? obj.activeSectionId : null);
    setActiveTabId(null);
    setSelectedId(null);
    setShowGallery(false);
  };

  // Toolbar's "JSON 불러오기" (used while a project is already open) — don't
  // replace immediately; open a picker so the person can choose 전체 교체
  // vs 선택한 페이지만 가져오기.
  const handleImportFileLoaded = (obj) => {
    if(!obj || !obj.components || !obj.meta){ alert('올바르지 않은 편집상태 파일입니다.'); return; }
    setImportObj(obj);
  };

  const handleImportReplace = () => {
    if(importObj) loadJson(importObj);
    setImportObj(null);
  };

  const handleImportCancel = () => setImportObj(null);

  // Copies the selected pages (표지/섹션, with their components and tabs)
  // from the loaded JSON into the current project, generating fresh ids so
  // nothing collides with what's already here. Existing sections are kept;
  // 표지(히어로 화면)는 하나뿐이므로 선택 시 현재 표지를 가져온 내용으로 교체한다.
  const handleImportPages = (selectedKeys) => {
    const source = importObj;
    if(!source || !state || !selectedKeys.length) return;

    const idMap = {};
    const components = { ...state.components };
    const cloneComponent = (cid) => {
      const orig = source.components?.[cid];
      if(!orig) return null;
      if(idMap[cid]) return idMap[cid];
      const newId = window.uid('c');
      idMap[cid] = newId;
      components[newId] = { ...window.deepClone(orig), id:newId };
      return newId;
    };

    let newHeroComponents = null;
    const newSections = [];
    selectedKeys.forEach(key => {
      if(key === 'hero'){
        const heroIds = (source.heroComponents||[]).map(cloneComponent).filter(Boolean);
        if(heroIds.length) newHeroComponents = heroIds;
      } else if(key.startsWith('sec:')){
        const sec = (source.sidebar||[]).find(s => s.id === key.slice(4));
        if(!sec) return;
        const comps = (sec.components||[]).map(cloneComponent).filter(Boolean);
        const tabs = (sec.tabs||[]).map(t => ({
          id: window.uid('tab'), label: t.label,
          components: (t.components||[]).map(cloneComponent).filter(Boolean),
        }));
        // 사이드메뉴 섹션은 항상 일반(feature) 타입으로 가져온다 — 표지는 히어로 화면 하나뿐.
        const newSec = { id: window.uid('sec'), label: sec.label, group: sec.group || '메뉴', kind:'feature', components: comps };
        if(tabs.length) newSec.tabs = tabs;
        newSections.push(newSec);
      }
    });

    if(!newHeroComponents && !newSections.length){ setImportObj(null); return; }

    commit(prev => ({
      ...prev,
      components,
      heroComponents: newHeroComponents || prev.heroComponents,
      sidebar: [...(prev.sidebar||[]), ...newSections],
    }));
    setActiveSectionId(newSections.length ? newSections[0].id : null);
    setActiveTabId(null);
    setSelectedId(null);
    setImportObj(null);
  };

  const newProject = () => {
    if(!confirm('현재 편집 중인 프로젝트를 저장 후 새 프로젝트를 시작하시겠어요?\n(현재 프로젝트는 브라우저에 남지 않습니다. 필요하면 먼저 ZIP 다운로드를 진행하세요.)')) return;
    setShowGallery(true);
  };

  const goHome = () => {
    if(!confirm('저장하지 않은 변경사항은 사라집니다.\n홈으로 이동하시겠어요? (필요하면 먼저 ZIP 다운로드를 진행하세요.)')) return;
    setShowGallery(true);
  };

  // ------- Section / sub-tab navigation -------
  const selectSection = (id) => {
    setSelectedId(null);
    if(id === null){
      setActiveSectionId(null);
      setActiveTabId(null);
      return;
    }
    const sec = (state?.sidebar||[]).find(s => s.id === id);
    const firstTab = sec?.tabs?.[0]?.id || null;
    setActiveSectionId(id);
    setActiveTabId(firstTab);
    commit(prev=>({...prev, activeSectionId: id}), {silent:true});
  };

  const selectTab = (sectionId, tabId) => {
    setSelectedId(null);
    setActiveSectionId(sectionId);
    setActiveTabId(tabId);
    commit(prev=>({...prev, activeSectionId: sectionId}), {silent:true});
  };

  const addTab = (sectionId) => {
    const newTab = { id: window.uid('tab'), label:'새 탭', components: [] };
    commit(prev => ({
      ...prev,
      sidebar: prev.sidebar.map(s => s.id === sectionId ? { ...s, tabs: [...(s.tabs||[]), newTab] } : s),
    }));
    setActiveSectionId(sectionId);
    setActiveTabId(newTab.id);
    setSelectedId(null);
  };

  const deleteTab = (sectionId, tabId) => {
    if(!confirm('이 하위 탭을 삭제하시겠습니까? 포함된 컴포넌트도 함께 제거됩니다.')) return;
    commit(prev => {
      const sec = prev.sidebar.find(s => s.id === sectionId);
      if(!sec) return prev;
      const tab = (sec.tabs||[]).find(t => t.id === tabId);
      const components = { ...prev.components };
      (tab?.components||[]).forEach(cid => { delete components[cid]; });
      const sidebar = prev.sidebar.map(s => s.id === sectionId ? { ...s, tabs: (s.tabs||[]).filter(t => t.id !== tabId) } : s);
      return { ...prev, components, sidebar };
    });
    if(activeSectionId === sectionId && activeTabId === tabId){
      setActiveTabId(null);
      setSelectedId(null);
    }
  };

  // ------- Component ops -------
  const handleUpdateComp = (id, newData) => {
    commit(prev => ({
      ...prev,
      components: { ...prev.components, [id]: { ...prev.components[id], data: newData } }
    }));
  };

  // Updates comp.style (e.g. gapAfter — the spacing below this component).
  // silent=true skips pushing to undo history, used for the live drag preview.
  const handleUpdateStyle = (id, patch, options={}) => {
    commit(prev => ({
      ...prev,
      components: { ...prev.components, [id]: { ...prev.components[id], style: { ...(prev.components[id]?.style||{}), ...patch } } }
    }), options);
  };

  // 상세 화면 콘텐츠 맨 위, 첫 컴포넌트 앞 여백
  const handleUpdateTopGap = (g) => {
    commit(prev => ({ ...prev, popup: { ...prev.popup, topGap: g } }));
  };

  const handleProjectUpdate = (patch) => {
    commit(prev => ({ ...prev, ...patch }));
    if(patch.activeSectionId !== undefined){
      setActiveSectionId(patch.activeSectionId);
      setActiveTabId(null);
    }
  };

  const handleAddComponent = (type, position='end') => {
    if(activeSectionId === null){
      if(type !== 'hero') return; // 표지 화면은 히어로 컴포넌트만 허용
    } else {
      const sec = (state?.sidebar||[]).find(s => s.id === activeSectionId);
      if(sec?.kind === 'cover' && type !== 'hero') return; // 표지 섹션은 히어로 컴포넌트만 허용
    }
    const newComp = {
      id: window.uid('c'),
      type,
      data: window.DEFAULT_DATA[type](),
      style: { spanCols: 12 },
    };
    commit(prev => {
      const components = { ...prev.components, [newComp.id]: newComp };
      if(activeSectionId === null){
        return { ...prev, components, heroComponents: [...(prev.heroComponents||[]), newComp.id] };
      } else {
        const sidebar = prev.sidebar.map(s => {
          if(s.id !== activeSectionId) return s;
          if(activeTabId){
            const tabs = (s.tabs||[]).map(t => t.id === activeTabId ? { ...t, components: [...t.components, newComp.id] } : t);
            return { ...s, tabs };
          }
          return { ...s, components: [...s.components, newComp.id] };
        });
        return { ...prev, components, sidebar };
      }
    });
    setSelectedId(newComp.id);
  };

  // 표지(히어로 화면 및 표지 섹션)의 히어로 컴포넌트는 항상 적용되어 있어야 하므로 삭제 불가
  const isProtectedComponent = (id) => {
    if(!state) return false;
    if((state.heroComponents||[]).includes(id)) return true;
    return (state.sidebar||[]).some(s => s.kind === 'cover' && (s.components||[]).includes(id));
  };

  const handleDeleteComponent = (id) => {
    if(isProtectedComponent(id)){
      alert('표지의 히어로 컴포넌트는 삭제할 수 없습니다.');
      return;
    }
    commit(prev => {
      const components = { ...prev.components };
      delete components[id];
      const heroComponents = (prev.heroComponents||[]).filter(x => x !== id);
      const sidebar = (prev.sidebar||[]).map(s => ({
        ...s,
        components: s.components.filter(x => x !== id),
        tabs: (s.tabs||[]).map(t => ({ ...t, components: t.components.filter(x => x !== id) })),
      }));
      return { ...prev, components, heroComponents, sidebar };
    });
    if(selectedId === id) setSelectedId(null);
  };

  const handleDuplicateComponent = (id) => {
    commit(prev => {
      const orig = prev.components[id]; if(!orig) return prev;
      const clone = { ...window.deepClone(orig), id: window.uid('c') };
      const components = { ...prev.components, [clone.id]: clone };
      // insert after original in whichever list contains it
      const inHero = (prev.heroComponents||[]).includes(id);
      if(inHero){
        const idx = prev.heroComponents.indexOf(id);
        const hc = [...prev.heroComponents];
        hc.splice(idx+1, 0, clone.id);
        return { ...prev, components, heroComponents: hc };
      } else {
        let placed = false;
        const sidebar = prev.sidebar.map(s => {
          if(placed) return s;
          const idx = s.components.indexOf(id);
          if(idx >= 0){
            placed = true;
            const arr = [...s.components];
            arr.splice(idx+1, 0, clone.id);
            return { ...s, components: arr };
          }
          if(s.tabs && s.tabs.length){
            let tabPlaced = false;
            const tabs = s.tabs.map(t => {
              if(tabPlaced) return t;
              const tidx = t.components.indexOf(id);
              if(tidx < 0) return t;
              tabPlaced = true; placed = true;
              const arr = [...t.components];
              arr.splice(tidx+1, 0, clone.id);
              return { ...t, components: arr };
            });
            if(tabPlaced) return { ...s, tabs };
          }
          return s;
        });
        return { ...prev, components, sidebar };
      }
    });
  };

  const handleMoveComponent = (id, direction) => {
    commit(prev => {
      const move = (arr) => {
        const idx = arr.indexOf(id); if(idx < 0) return arr;
        const swap = direction === 'up' ? idx-1 : idx+1;
        if(swap < 0 || swap >= arr.length) return arr;
        const na = [...arr]; [na[idx], na[swap]] = [na[swap], na[idx]]; return na;
      };
      return {
        ...prev,
        heroComponents: move(prev.heroComponents || []),
        sidebar: (prev.sidebar||[]).map(s => ({
          ...s,
          components: move(s.components),
          tabs: (s.tabs||[]).map(t => ({ ...t, components: move(t.components) })),
        })),
      };
    });
  };

  const handleReorder = ({ action, sourceId, targetId, position, type }) => {
    if(action === 'insert-new'){
      if(activeSectionId === null){
        if(type !== 'hero') return; // 표지 화면은 히어로 컴포넌트만 허용
      } else {
        const sec = (state?.sidebar||[]).find(s => s.id === activeSectionId);
        if(sec?.kind === 'cover' && type !== 'hero') return; // 표지 섹션은 히어로 컴포넌트만 허용
      }
      // insert a new component at position relative to targetId
      const newComp = {
        id: window.uid('c'), type,
        data: window.DEFAULT_DATA[type](), style:{spanCols:12},
      };
      commit(prev => {
        const components = { ...prev.components, [newComp.id]: newComp };
        const insertInto = (arr) => {
          if(!targetId){ return [...arr, newComp.id]; }
          const idx = arr.indexOf(targetId);
          if(idx < 0) return arr;
          const na = [...arr];
          na.splice(position === 'before' ? idx : idx+1, 0, newComp.id);
          return na;
        };
        if(activeSectionId === null){
          return { ...prev, components, heroComponents: insertInto(prev.heroComponents||[]) };
        } else {
          const sidebar = prev.sidebar.map(s => {
            if(s.id !== activeSectionId) return s;
            if(activeTabId){
              const tabs = (s.tabs||[]).map(t => t.id === activeTabId ? { ...t, components: insertInto(t.components) } : t);
              return { ...s, tabs };
            }
            return { ...s, components: insertInto(s.components) };
          });
          return { ...prev, components, sidebar };
        }
      });
      setSelectedId(newComp.id);
    } else if(action === 'move'){
      commit(prev => {
        // Find which list contains sourceId & targetId (hero / section / section-tab)
        const findList = (id) => {
          if((prev.heroComponents||[]).includes(id)) return { kind:'hero' };
          for(const s of prev.sidebar||[]){
            if(s.components.includes(id)) return { kind:'sec', sec: s.id };
            for(const t of s.tabs||[]) if(t.components.includes(id)) return { kind:'tab', sec: s.id, tab: t.id };
          }
          return null;
        };
        const src = findList(sourceId);
        const tgt = findList(targetId);
        if(!src || !tgt) return prev;
        // For simplicity: only allow reorder within the same list (matches "화면 내 순서 변경")
        if(src.kind !== tgt.kind) return prev;
        if(src.kind === 'sec' && src.sec !== tgt.sec) return prev;
        if(src.kind === 'tab' && (src.sec !== tgt.sec || src.tab !== tgt.tab)) return prev;

        const move = (arr) => {
          const from = arr.indexOf(sourceId);
          if(from < 0) return arr;
          const na = arr.filter(x => x !== sourceId);
          const to = na.indexOf(targetId);
          if(to < 0) return arr;
          na.splice(position === 'before' ? to : to+1, 0, sourceId);
          return na;
        };
        if(src.kind === 'hero'){
          return { ...prev, heroComponents: move(prev.heroComponents||[]) };
        } else if(src.kind === 'sec'){
          const sidebar = prev.sidebar.map(s => s.id === src.sec ? { ...s, components: move(s.components) } : s);
          return { ...prev, sidebar };
        } else {
          const sidebar = prev.sidebar.map(s => s.id === src.sec ? { ...s, tabs: s.tabs.map(t => t.id === src.tab ? { ...t, components: move(t.components) } : t) } : s);
          return { ...prev, sidebar };
        }
      });
    }
  };

  const handleContextMenu = (e, compId) => {
    setContextMenu({ x: e.clientX, y: e.clientY, compId });
  };

  const handleSave = () => {
    if(state){
      try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){}
      setSavedTick(t=>t+1);
    }
  };

  const handleDownload = async () => {
    try {
      await window.downloadZipBundle(state);
    } catch(err){
      alert('다운로드 중 오류: ' + err.message);
      console.error(err);
    }
  };

  // ============================================================
  // Render
  // ============================================================
  if(showGallery){
    return (
      <window.TemplateGallery
        onPick={pickTemplate}
        onLoadJson={loadJson}
        canClose={!!state}
        onClose={()=>setShowGallery(false)}
      />
    );
  }

  if(!state){
    return (
      <div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',color:'var(--mute)'}}>
        불러오는 중...
      </div>
    );
  }

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',minHeight:0,overflow:'hidden'}}>
      <window.Toolbar
        state={state}
        onTitleChange={(v)=>commit(prev=>({...prev, meta:{...prev.meta, title:v}}))}
        onSave={handleSave}
        onDownload={handleDownload}
        onImportJson={handleImportFileLoaded}
        onOpenPreview={()=>setShowPreview(true)}
        onNewProject={newProject}
        onGoHome={goHome}
        savedIndicator={savedTick}
        canUndo={history.current.past.length > 0}
        canRedo={history.current.future.length > 0}
        onUndo={undo}
        onRedo={redo}
      />

      <div style={{flex:1, display:'flex', minHeight:0, overflow:'hidden'}}>
        {/* Left: component library */}
        <div style={{width:280, flex:'none'}}>
          <window.ComponentLibrary
            state={state}
            activeSectionId={activeSectionId}
            activeTabId={activeTabId}
            targetSection={activeSectionId}
            onAddComponent={handleAddComponent}
            onSelectSection={selectSection}
            onSelectTab={selectTab}
            onAddTab={addTab}
            onDeleteTab={deleteTab}
            onProjectUpdate={handleProjectUpdate}
          />
        </div>

        {/* Center: canvas */}
        <div style={{flex:1, minWidth:0, minHeight:0, overflowY:'auto', background:'#EBEEF3'}}>
          <window.Canvas
            state={state}
            selectedId={selectedId}
            activeSectionId={activeSectionId}
            activeTabId={activeTabId}
            onSelect={setSelectedId}
            onSelectTab={(tabId)=>{ setActiveTabId(tabId); setSelectedId(null); }}
            onUpdateComp={handleUpdateComp}
            onUpdateStyle={handleUpdateStyle}
            onUpdateTopGap={handleUpdateTopGap}
            onReorder={handleReorder}
            onContextMenu={handleContextMenu}
            targetSection={activeSectionId}
          />
        </div>

        {/* Right: property panel */}
        <div style={{width:320, flex:'none', background:'#fff', borderLeft:'1px solid var(--line)', overflowY:'auto'}}>
          <window.PropertyPanel
            state={state}
            selectedId={selectedId}
            activeSectionId={activeSectionId}
            activeTabId={activeTabId}
            onSelect={setSelectedId}
            onUpdateComp={handleUpdateComp}
            onUpdateStyle={handleUpdateStyle}
            onProjectUpdate={handleProjectUpdate}
            onDelete={handleDeleteComponent}
            onDuplicate={handleDuplicateComponent}
            isProtected={isProtectedComponent}
          />
        </div>
      </div>

      {contextMenu && (
        <window.ContextMenu
          x={contextMenu.x} y={contextMenu.y}
          onClose={()=>setContextMenu(null)}
          actions={[
            { label:'복제', icon: window.Icons.Copy({size:14}), shortcut:'Ctrl+D', onClick:()=>handleDuplicateComponent(contextMenu.compId) },
            { label:'위로 이동', icon:'▲', onClick:()=>handleMoveComponent(contextMenu.compId, 'up') },
            { label:'아래로 이동', icon:'▼', onClick:()=>handleMoveComponent(contextMenu.compId, 'down') },
            ...(isProtectedComponent(contextMenu.compId) ? [] : [
              { divider:true },
              { label:'삭제', icon: window.Icons.Trash({size:14}), shortcut:'Del', danger:true, onClick:()=>handleDeleteComponent(contextMenu.compId) },
            ]),
          ]}
        />
      )}

      {showPreview && (
        <window.PreviewModal state={state} onClose={()=>setShowPreview(false)}/>
      )}

      {importObj && (
        <window.ImportModal
          source={importObj}
          onCancel={handleImportCancel}
          onReplace={handleImportReplace}
          onImport={handleImportPages}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
