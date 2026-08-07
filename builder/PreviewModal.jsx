// Full popup preview modal - shows the final output exactly as end users will see it.
// Non-editable: pure output.
const { useState: pmUseState } = React;

function PreviewModal({ state, onClose }){
  const [screen, setScreen] = pmUseState('hero'); // hero | detail
  const [activeSection, setActiveSection] = pmUseState(state.activeSectionId || (state.sidebar||[])[0]?.id);

  const showDetail = () => { setScreen('detail'); setActiveSection(state.activeSectionId || (state.sidebar||[])[0]?.id); };
  const showHero = () => setScreen('hero');

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(12,16,28,.72)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      {/* Preview mode label */}
      <div style={{position:'absolute',top:20,left:20,display:'flex',alignItems:'center',gap:8,color:'#fff',fontSize:12,fontWeight:700,letterSpacing:'.02em'}}>
        <span style={{width:8,height:8,borderRadius:'50%',background:'#12B886',boxShadow:'0 0 10px #12B886'}}/>
        결과물 미리보기 (편집 UI 없음 · 실제 팝업)
      </div>
      <button onClick={onClose}
        style={{position:'absolute',top:20,right:20,background:'rgba(255,255,255,.15)',color:'#fff',border:'1px solid rgba(255,255,255,.2)',padding:'8px 14px',borderRadius:8,fontSize:12.5,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
        {window.Icons.X({size:14})} 미리보기 닫기
      </button>

      <div style={{maxWidth:1180, width:'100%', margin:'0 auto'}}>
        <div style={{background:'#fff', borderRadius:12, boxShadow:'0 30px 70px rgba(0,0,0,.4)', overflow:'hidden', height:'min(780px, 88vh)', display:'flex', flexDirection:'column', position:'relative'}}>
          <button onClick={onClose}
            style={{position:'absolute',top:18,right:20,width:34,height:34,borderRadius:'50%',border:'none',background:'#F1F2F5',color:'#66707F',fontSize:18,cursor:'pointer',zIndex:5,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
          {screen === 'detail' && (
            <button onClick={showHero}
              style={{position:'absolute',top:18,left:20,height:34,borderRadius:999,border:'1px solid var(--line)',background:'#fff',color:'var(--sub)',fontSize:12.5,fontWeight:700,cursor:'pointer',zIndex:5,display:'flex',alignItems:'center',gap:5,padding:'0 14px'}}>
              ‹ 처음으로
            </button>
          )}

          {screen === 'hero' ? (
            <div style={{flex:1,minHeight:0,overflowY:'auto'}}>
              {(state.heroComponents||[]).map(cid => {
                const c = state.components[cid]; if(!c) return null;
                const R = window.RENDERERS[c.type];
                return (
                  <div key={cid} style={{marginBottom:6}}>
                    {c.type === 'hero' ? (
                      <>
                        {/* Render hero, override CTA to switch screen */}
                        <HeroWithCta comp={c} onCta={showDetail}/>
                      </>
                    ) : (
                      <div style={{padding:'12px 44px'}}><R data={c.data} editing={false} onChange={()=>{}}/></div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{display:'flex',flex:1,minHeight:0,borderTop:'1px solid var(--line)'}}>
              <nav style={{width:230, flex:'none', background:'var(--panel)', padding:'22px 14px', borderRight:'1px solid var(--line)', overflowY:'auto'}}>
                <window.SidebarNav state={state} activeSectionId={activeSection} onSelect={setActiveSection}/>
              </nav>
              <div style={{flex:1, padding:'18px 44px 20px', overflowY:'auto', minWidth:0}}>
                {(state.sidebar.find(s=>s.id===activeSection)?.components || []).map(cid => {
                  const c = state.components[cid]; if(!c) return null;
                  const R = window.RENDERERS[c.type];
                  return (
                    <div key={cid} style={{marginBottom:6}}>
                      <R data={c.data} editing={false} onChange={()=>{}}/>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <window.PopupFooter state={state}/>
        </div>
      </div>
    </div>
  );
}

function HeroWithCta({ comp, onCta }){
  // Reuse hero renderer but intercept CTA button click.
  const R = window.RENDERERS.hero;
  return (
    <div onClick={(e)=>{
      // If click landed on a button, treat as CTA
      const btn = e.target.closest('button');
      if(btn){ e.stopPropagation(); onCta(); }
    }}>
      <R data={comp.data} editing={false} onChange={()=>{}}/>
    </div>
  );
}

window.PreviewModal = PreviewModal;
