// Template selection screen shown on first entry or when creating a new project.
const { useState: tgUseState } = React;

function TemplateGallery({ onPick, onLoadJson, canClose, onClose }){
  const fileRef = React.useRef(null);

  return (
    <div style={{position:'fixed',inset:0,background:'#EBEEF3',zIndex:100,overflowY:'auto'}}>
      <div style={{maxWidth:960, margin:'0 auto', padding:'70px 30px 60px'}}>
        {/* header */}
        <div style={{textAlign:'center', marginBottom:44}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,marginBottom:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:'var(--grad)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:20,boxShadow:'0 8px 24px rgba(80,90,255,.28)'}}>P</div>
            <div style={{fontWeight:900,fontSize:26,color:'var(--ink)',letterSpacing:'-.02em'}}>PopBuilder</div>
          </div>
          <h1 style={{fontSize:32,margin:'6px 0 8px',fontWeight:800,color:'var(--ink)',letterSpacing:'-.02em'}}>
            안내 팝업, <span style={{background:'var(--grad)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>몇 분이면 완성.</span>
          </h1>
          <p style={{color:'var(--sub)',fontSize:14,lineHeight:1.6,maxWidth:520,margin:'0 auto'}}>
            드래그·드롭으로 컴포넌트를 조합하고, 인라인 편집으로 내용을 채우세요.<br/>
            결과물은 실제 팝업 HTML과 편집 가능한 JSON, 2개 파일로 저장됩니다.
          </p>
          {canClose && (
            <button onClick={onClose}
              style={{marginTop:20,background:'transparent',border:'1px solid var(--line)',padding:'6px 14px',borderRadius:999,fontSize:12,color:'var(--sub)',cursor:'pointer'}}>
              ← 편집 중인 프로젝트로 돌아가기
            </button>
          )}
        </div>

        {/* Templates */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:13,fontWeight:800,color:'var(--sub)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:14,padding:'0 4px'}}>템플릿에서 시작하기</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16}}>
            {window.TEMPLATES.map(t => (
              <TemplateCard key={t.id} t={t} onPick={()=>onPick(t)}/>
            ))}
          </div>
        </div>

        <div style={{textAlign:'center',margin:'28px 0 20px',color:'var(--mute)',fontSize:12,display:'flex',alignItems:'center',gap:14,justifyContent:'center'}}>
          <div style={{flex:1,maxWidth:200,height:1,background:'var(--line)'}}/>
          또는
          <div style={{flex:1,maxWidth:200,height:1,background:'var(--line)'}}/>
        </div>

        <div style={{textAlign:'center'}}>
          <button
            onClick={()=>fileRef.current && fileRef.current.click()}
            style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 22px',border:'1px solid var(--line)',background:'#fff',borderRadius:10,fontSize:14,fontWeight:700,color:'var(--ink)',cursor:'pointer',boxShadow:'var(--shadow-sm)'}}>
            {window.Icons.Upload({size:16})} JSON 파일 불러오기 (이어서 편집)
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" style={{display:'none'}} onChange={(e)=>{
            const f = e.target.files && e.target.files[0]; if(!f) return;
            const rd = new FileReader();
            rd.onload = () => {
              try { onLoadJson(JSON.parse(rd.result)); }
              catch(err){ alert('JSON 파일을 읽을 수 없습니다: ' + err.message); }
            };
            rd.readAsText(f);
            e.target.value = '';
          }}/>
          <div style={{marginTop:10,fontSize:11,color:'var(--mute)'}}>이전에 저장한 편집상태.json 파일을 업로드하세요.</div>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ t, onPick }){
  const [hover, setHover] = tgUseState(false);
  return (
    <div onClick={onPick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        background:'#fff', border: hover ? '2px solid var(--blue)' : '2px solid transparent',
        borderRadius:14, overflow:'hidden', cursor:'pointer',
        boxShadow: hover ? '0 14px 30px rgba(20,30,70,.14)' : '0 2px 10px rgba(20,30,70,.06)',
        transition:'.15s', transform: hover ? 'translateY(-2px)' : 'none',
        position:'relative',
      }}>
      {t.badge && (
        <div style={{position:'absolute',top:12,right:12,background:'var(--grad)',color:'#fff',fontSize:10.5,fontWeight:800,padding:'3px 10px',borderRadius:999,zIndex:1}}>{t.badge}</div>
      )}
      <div style={{height:130, background:'linear-gradient(135deg, #EEF1FF 0%, #F5F0FF 60%, #E4F5FF 100%)', position:'relative', overflow:'hidden'}}>
        <TemplatePreview id={t.id}/>
      </div>
      <div style={{padding:'16px 16px 18px'}}>
        <div style={{fontSize:14.5,fontWeight:800,color:'var(--ink)',marginBottom:5}}>{t.title}</div>
        <div style={{fontSize:12,color:'var(--sub)',lineHeight:1.55,marginBottom:10}}>{t.desc}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
          {t.tags.map(tag => (
            <span key={tag} style={{fontSize:10.5,color:'var(--sub)',background:'var(--panel)',padding:'3px 8px',borderRadius:999,fontWeight:600}}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mini illustration per template
function TemplatePreview({ id }){
  const wrap = {position:'absolute',inset:14,background:'#fff',borderRadius:8,boxShadow:'0 4px 12px rgba(20,30,70,.1)',padding:8,overflow:'hidden'};
  if(id === 'ai-report'){
    return (
      <div style={wrap}>
        <div style={{display:'flex',gap:6,height:'100%'}}>
          <div style={{width:34, background:'#F4F5F7', borderRadius:4, padding:'4px 3px', display:'flex', flexDirection:'column', gap:3}}>
            {[1,2,3,4,5].map(i => <div key={i} style={{height:5, background: i===1 ? '#fff' : 'transparent', borderRadius:2}}/>)}
          </div>
          <div style={{flex:1, display:'flex', flexDirection:'column', gap:4}}>
            <div style={{height:7,background:'linear-gradient(90deg,#7B5CFA,#2FA8FF)',borderRadius:2,width:'50%'}}/>
            <div style={{height:4,background:'#E6E9EF',borderRadius:2,width:'80%'}}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,marginTop:3}}>
              <div style={{height:24,background:'#F4F5F7',borderRadius:3}}/>
              <div style={{height:24,background:'#F4F5F7',borderRadius:3}}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if(id === 'simple'){
    return (
      <div style={wrap}>
        <div style={{height:7,background:'linear-gradient(90deg,#7B5CFA,#2FA8FF)',borderRadius:2,width:'40%',margin:'0 auto 5px'}}/>
        <div style={{height:4,background:'#E6E9EF',borderRadius:2,width:'70%',margin:'0 auto 8px'}}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>
          <div style={{height:26,background:'#F4F5F7',borderRadius:3, borderTop:'3px solid #2F6BFF'}}/>
          <div style={{height:26,background:'#F4F5F7',borderRadius:3, borderTop:'3px solid #7B5CFA'}}/>
        </div>
      </div>
    );
  }
  if(id === 'release'){
    return (
      <div style={wrap}>
        <div style={{height:6,background:'linear-gradient(90deg,#7B5CFA,#2FA8FF)',borderRadius:2,width:'50%',marginBottom:8}}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:3,marginBottom:8}}>
          <div style={{height:20,background:'#F4F5F7',borderRadius:3}}/>
          <div style={{height:20,background:'#F4F5F7',borderRadius:3}}/>
          <div style={{height:20,background:'#F4F5F7',borderRadius:3}}/>
        </div>
        <div style={{display:'flex',gap:2,alignItems:'center'}}>
          {[1,2,3,4].map(i => <React.Fragment key={i}>
            <div style={{flex:1,height:14,background:'#F4F5F7',borderRadius:3}}/>
            {i<4 && <span style={{fontSize:8,color:'#C3C8D2'}}>›</span>}
          </React.Fragment>)}
        </div>
      </div>
    );
  }
  return (
    <div style={wrap}>
      <div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--mute)',fontSize:24}}>+</div>
    </div>
  );
}

window.TemplateGallery = TemplateGallery;
