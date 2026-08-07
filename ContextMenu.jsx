// Right-click context menu for canvas components
function ContextMenu({ x, y, onClose, actions }){
  const rUseEffect = React.useEffect;
  rUseEffect(() => {
    const h = () => onClose();
    document.addEventListener('click', h);
    document.addEventListener('scroll', h, true);
    return () => {
      document.removeEventListener('click', h);
      document.removeEventListener('scroll', h, true);
    };
  }, []);
  // Position adjustment near edges
  const style = {
    position:'fixed', left:x, top:y, background:'#fff', border:'1px solid var(--line)',
    borderRadius:10, boxShadow:'0 10px 30px rgba(20,30,60,.18)',
    padding:6, minWidth:170, zIndex:10000, fontSize:13,
  };
  const btnStyle = {
    display:'flex',alignItems:'center',gap:10,width:'100%',textAlign:'left',
    background:'none',border:'none',padding:'8px 10px',borderRadius:6,
    cursor:'pointer',color:'var(--ink)',fontSize:13,
  };
  return (
    <div style={style} onClick={(e)=>e.stopPropagation()}>
      {actions.map((a,i) => a.divider ? (
        <div key={i} style={{height:1,background:'var(--line)',margin:'4px 6px'}}/>
      ) : (
        <button key={i} style={{...btnStyle, color: a.danger ? 'var(--danger)' : 'var(--ink)'}}
          onMouseEnter={(e)=>e.currentTarget.style.background='var(--panel)'}
          onMouseLeave={(e)=>e.currentTarget.style.background='none'}
          onClick={()=>{ a.onClick(); onClose(); }}>
          <span style={{width:16, display:'inline-flex'}}>{a.icon}</span>
          <span style={{flex:1}}>{a.label}</span>
          {a.shortcut && <span style={{color:'var(--mute)',fontSize:11}}>{a.shortcut}</span>}
        </button>
      ))}
    </div>
  );
}
window.ContextMenu = ContextMenu;
