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
  const [contextMenu, setContextMenu] = useState(null); // {x,y,compId}
  const [showPreview, setShowPreview] = useState(false);
  const [savedTick, setSavedTick] = useState(0);
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
    setSelectedId(null);
    setShowGallery(false);
  };
  const loadJson = (obj) => {
    if(!obj || !obj.components || !obj.meta){ alert('올바르지 않은 편집상태 파일입니다.'); return; }
    history.current = { past:[], future:[] };
    setState(obj);
    setActiveSectionId(obj.activeSectionId && obj.sidebar?.find(s=>s.id===obj.activeSectionId) ? obj.activeSectionId : null);
    setSelectedId(null);
    setShowGallery(false);
  };

  const newProject = () => {
    if(!confirm('현재 편집 중인 프로젝트를 저장 후 새 프로젝트를 시작하시겠어요?\n(현재 프로젝트는 브라우저에 남지 않습니다. 필요하면 먼저 ZIP 다운로드를 진행하세요.)')) return;
    setShowGallery(true);
  };

  // ------- Component ops -------
  const handleUpdateComp = (id, newData) => {
    commit(prev => ({
      ...prev,
      components: { ...prev.components, [id]: { ...prev.components[id], data: newData } }
    }));
  };

  const handleProjectUpdate = (patch) => {
    commit(prev => ({ ...prev, ...patch }));
    if(patch.activeSectionId !== undefined) setActiveSectionId(patch.activeSectionId);
  };

  const handleAddComponent = (type, position='end') => {
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
        const sidebar = prev.sidebar.map(s => s.id === activeSectionId ? { ...s, components: [...s.components, newComp.id] } : s);
        return { ...prev, components, sidebar };
      }
    });
    setSelectedId(newComp.id);
  };

  const handleDeleteComponent = (id) => {
    commit(prev => {
      const components = { ...prev.components };
      delete components[id];
      const heroComponents = (prev.heroComponents||[]).filter(x => x !== id);
      const sidebar = (prev.sidebar||[]).map(s => ({ ...s, components: s.components.filter(x => x !== id) }));
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
        const sidebar = prev.sidebar.map(s => {
          const idx = s.components.indexOf(id);
          if(idx < 0) return s;
          const arr = [...s.components];
          arr.splice(idx+1, 0, clone.id);
          return { ...s, components: arr };
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
        sidebar: (prev.sidebar||[]).map(s => ({ ...s, components: move(s.components) })),
      };
    });
  };

  const handleReorder = ({ action, sourceId, targetId, position, type }) => {
    if(action === 'insert-new'){
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
          const sidebar = prev.sidebar.map(s => s.id === activeSectionId ? { ...s, components: insertInto(s.components) } : s);
          return { ...prev, components, sidebar };
        }
      });
      setSelectedId(newComp.id);
    } else if(action === 'move'){
      commit(prev => {
        // Find which list contains sourceId & targetId
        const findList = (id) => {
          if((prev.heroComponents||[]).includes(id)) return { kind:'hero' };
          for(const s of prev.sidebar||[]) if(s.components.includes(id)) return { kind:'sec', sec: s.id };
          return null;
        };
        const src = findList(sourceId);
        const tgt = findList(targetId);
        if(!src || !tgt) return prev;
        // For simplicity: only allow reorder within the same list (matches "화면 내 순서 변경")
        if(src.kind !== tgt.kind || (src.kind==='sec' && src.sec !== tgt.sec)) return prev;

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
        } else {
          const sidebar = prev.sidebar.map(s => s.id === src.sec ? { ...s, components: move(s.components) } : s);
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
        onLoadJson={loadJson}
        onOpenPreview={()=>setShowPreview(true)}
        onNewProject={newProject}
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
            targetSection={activeSectionId}
            onAddComponent={handleAddComponent}
            onSelectSection={(id)=>{
              setActiveSectionId(id);
              setSelectedId(null);
              if(id) commit(prev=>({...prev, activeSectionId: id}), {silent:true});
            }}
            onProjectUpdate={handleProjectUpdate}
          />
        </div>

        {/* Center: canvas */}
        <div style={{flex:1, minWidth:0, minHeight:0, overflowY:'auto', background:'#EBEEF3'}}>
          <window.Canvas
            state={state}
            selectedId={selectedId}
            activeSectionId={activeSectionId}
            onSelect={setSelectedId}
            onUpdateComp={handleUpdateComp}
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
            onUpdateComp={handleUpdateComp}
            onProjectUpdate={handleProjectUpdate}
            onDelete={handleDeleteComponent}
            onDuplicate={handleDuplicateComponent}
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
            { divider:true },
            { label:'삭제', icon: window.Icons.Trash({size:14}), shortcut:'Del', danger:true, onClick:()=>handleDeleteComponent(contextMenu.compId) },
          ]}
        />
      )}

      {showPreview && (
        <window.PreviewModal state={state} onClose={()=>setShowPreview(false)}/>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
