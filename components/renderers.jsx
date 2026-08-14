// ============================================================
// Popup component renderers
// Each renderer receives { data, editing, onChange } and returns JSX.
// editing=true → contentEditable + editable image placeholders
// editing=false → pure output (used in preview & final export HTML)
// ============================================================

const { useState: rUseState, useRef: rUseRef, useEffect: rUseEffect } = React;

// ------- Editable Text primitive -------
function ET({ tag = 'span', value, onChange, editing, className, style, multiline, placeholder }){
  const ref = rUseRef(null);
  const Tag = tag;
  const handleBlur = (e) => {
    if(!editing) return;
    const v = multiline ? e.currentTarget.innerText : e.currentTarget.innerText;
    if(v !== value) onChange && onChange(v);
  };
  const handleKey = (e) => {
    if(!multiline && e.key === 'Enter'){ e.preventDefault(); e.currentTarget.blur(); }
    if(e.key === 'Escape'){ e.currentTarget.blur(); }
  };
  // Prevent React from resetting DOM on every keystroke: use suppressContentEditableWarning
  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      contentEditable={!!editing}
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKey}
      onClick={(e) => { if(editing) e.stopPropagation(); }}
      data-placeholder={placeholder}
    >{value || (editing ? '' : '')}</Tag>
  );
}
window.ET = ET;

// ------- Editable Image -------
function EImg({ src, alt, editing, onChange, className, style, placeholder = '이미지 업로드' }){
  const inputRef = rUseRef(null);
  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    const rd = new FileReader();
    rd.onload = () => onChange && onChange({ src: rd.result, name: f.name });
    rd.readAsDataURL(f);
  };
  if(src){
    return (
      <div className={className} style={{position:'relative', ...style}}>
        <img src={src} alt={alt||''} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',borderRadius:'inherit'}}/>
        {editing && (
          <button
            onClick={(e)=>{e.stopPropagation(); inputRef.current && inputRef.current.click();}}
            style={{position:'absolute',right:8,bottom:8,background:'rgba(20,30,60,.75)',color:'#fff',border:'none',padding:'6px 10px',borderRadius:6,fontSize:11,cursor:'pointer',fontWeight:700}}
          >이미지 변경</button>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{display:'none'}} onChange={onFile}/>
      </div>
    );
  }
  return (
    <div
      className={className}
      onClick={(e)=>{ if(editing){ e.stopPropagation(); inputRef.current && inputRef.current.click(); } }}
      style={{
        background:'linear-gradient(135deg,#EEF1F6,#E4E9F0)',
        color:'#8891A3',
        display:'flex',alignItems:'center',justifyContent:'center',
        border:'1.5px dashed #C3C8D2',borderRadius:'inherit',
        fontSize:12,fontWeight:600,cursor:editing?'pointer':'default',
        ...style
      }}
    >
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:22,marginBottom:6}}>🖼️</div>
        <div>{editing ? placeholder + ' (클릭)' : placeholder}</div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{display:'none'}} onChange={onFile}/>
    </div>
  );
}
window.EImg = EImg;

// ------- Hero image: keeps original aspect ratio, drag-to-resize (center-anchored), always centered -------
const HERO_IMG_MIN_W = 160, HERO_IMG_MAX_W = 640;

function HeroImage({ image, editing, onChange }){
  const inputRef = rUseRef(null);
  const draggingRef = rUseRef(false);
  const [liveWidth, setLiveWidth] = rUseState(null);
  const baseWidth = image?.width || HERO_IMG_MAX_W;
  const width = liveWidth != null ? liveWidth : baseWidth;

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    const rd = new FileReader();
    rd.onload = () => onChange({ ...(image||{}), src: rd.result, alt: f.name });
    rd.readAsDataURL(f);
  };

  // Drag the corner handle to resize. Grows/shrinks symmetrically (2× the
  // mouse delta) so the image stays centered no matter the width.
  const handleResizeStart = (e) => {
    e.preventDefault(); e.stopPropagation();
    draggingRef.current = true;
    const startX = e.clientX;
    const startWidth = width;
    document.body.style.cursor = 'nwse-resize';
    const onMove = (ev) => {
      if(!draggingRef.current) return;
      let w = startWidth + (ev.clientX - startX) * 2;
      w = Math.max(HERO_IMG_MIN_W, Math.min(HERO_IMG_MAX_W, w));
      setLiveWidth(w);
    };
    const onUp = (ev) => {
      if(draggingRef.current){
        draggingRef.current = false;
        document.body.style.cursor = '';
        let w = startWidth + (ev.clientX - startX) * 2;
        w = Math.max(HERO_IMG_MIN_W, Math.min(HERO_IMG_MAX_W, w));
        onChange({ ...(image||{}), width: w });
        setLiveWidth(null);
      }
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if(image?.src){
    return (
      <div style={{margin:'16px auto 0', width, maxWidth:'100%', position:'relative'}}>
        <div style={{borderRadius:13,overflow:'hidden',boxShadow:'0 14px 34px rgba(20,30,70,.2)',border:'1px solid var(--line)'}}>
          <img src={image.src} alt={image.alt||''} style={{width:'100%',height:'auto',display:'block'}}/>
        </div>
        {editing && (
          <>
            <button onClick={(e)=>{e.stopPropagation(); inputRef.current && inputRef.current.click();}}
              style={{position:'absolute',right:8,bottom:8,background:'rgba(20,30,60,.75)',color:'#fff',border:'none',padding:'6px 10px',borderRadius:6,fontSize:11,cursor:'pointer',fontWeight:700}}
            >이미지 변경</button>
            <div onMouseDown={handleResizeStart} title="드래그하여 크기 조절"
              style={{position:'absolute',right:-6,bottom:-6,width:14,height:14,borderRadius:4,background:'var(--blue)',border:'2px solid #fff',boxShadow:'0 1px 4px rgba(0,0,0,.3)',cursor:'nwse-resize'}}/>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{display:'none'}} onChange={onFile}/>
      </div>
    );
  }

  return (
    <div
      onClick={(e)=>{ if(editing){ e.stopPropagation(); inputRef.current && inputRef.current.click(); } }}
      style={{
        margin:'16px auto 0', width, maxWidth:'100%', height:220, borderRadius:13,
        background:'linear-gradient(135deg,#EEF1F6,#E4E9F0)', color:'#8891A3',
        display:'flex',alignItems:'center',justifyContent:'center',
        border:'1.5px dashed #C3C8D2', fontSize:12,fontWeight:600,
        cursor: editing ? 'pointer' : 'default',
      }}
    >
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:22,marginBottom:6}}>🖼️</div>
        <div>{editing ? '히어로 이미지 업로드 (클릭)' : '히어로 이미지'}</div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{display:'none'}} onChange={onFile}/>
    </div>
  );
}

// ============================================================
// 1. HERO — 배지 + 그라디언트 제목 + 서브 + 본문 + CTA + 이미지
// ============================================================
function HeroBlock({ data, editing, onChange }){
  const d = data;
  const upd = (k, v) => onChange({ ...d, [k]: v });
  return (
    <section style={{padding:'30px 56px 22px', textAlign:'center', background:'radial-gradient(700px 260px at 50% -60px, #eef1ff 0%, rgba(255,255,255,0) 70%)'}}>
      <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'var(--grad-soft)',color:'var(--blue-dark)',fontWeight:700,fontSize:11.5,padding:'5px 13px',borderRadius:999,marginBottom:10}}>
        <ET tag="span" value={d.badge} onChange={(v)=>upd('badge',v)} editing={editing}/>
      </div>
      <ET tag="h1" value={d.title} onChange={(v)=>upd('title',v)} editing={editing}
        style={{fontSize:23,margin:'0 0 7px',fontWeight:800,background:'var(--grad)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}/>
      <ET tag="h2" value={d.subtitle} onChange={(v)=>upd('subtitle',v)} editing={editing}
        style={{fontSize:14.5,margin:'0 0 9px',fontWeight:700,color:'var(--ink)'}}/>
      <ET tag="p" value={d.body} onChange={(v)=>upd('body',v)} editing={editing} multiline
        style={{color:'var(--sub)',fontSize:12.5,lineHeight:1.5,maxWidth:600,margin:'0 auto 14px'}}/>
      {d.showCta !== false && (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginTop:14}}>
          <button style={{display:'inline-flex',alignItems:'center',gap:8,background:'var(--grad)',color:'#fff',border:'none',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 8px 18px rgba(80,90,255,.26)'}}>
            <ET tag="span" value={d.ctaLabel} onChange={(v)=>upd('ctaLabel',v)} editing={editing}/> &nbsp;›
          </button>
        </div>
      )}
      {d.showImage !== false && (
        <HeroImage image={d.image} editing={editing} onChange={(img)=>upd('image', img)}/>
      )}
    </section>
  );
}

// ============================================================
// 2. KPI GRID
// ============================================================
function KpiGrid({ data, editing, onChange }){
  const d = data;
  const cols = d.cols || 3;
  const upd = (i, k, v) => {
    const items = [...(d.items||[])];
    items[i] = { ...items[i], [k]: v };
    onChange({ ...d, items });
  };
  return (
    <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:12}}>
      {(d.items||[]).map((it,i)=>(
        <div key={i} style={{background:'#fff',border:'1px solid var(--line)',borderRadius:12,padding:'16px 18px',boxShadow:'var(--shadow-sm)'}}>
          <ET tag="div" value={it.label} onChange={(v)=>upd(i,'label',v)} editing={editing} style={{color:'var(--sub)',fontSize:11.5,fontWeight:700,marginBottom:6,textTransform:'uppercase',letterSpacing:'.02em'}}/>
          <ET tag="div" value={it.value} onChange={(v)=>upd(i,'value',v)} editing={editing} style={{color:'var(--ink)',fontSize:22,fontWeight:800,marginBottom:4}}/>
          {it.delta && <ET tag="div" value={it.delta} onChange={(v)=>upd(i,'delta',v)} editing={editing} style={{color:'var(--good)',fontSize:11.5,fontWeight:700}}/>}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 3. CARD GRID (일반 카드)
// ============================================================
function CardGrid({ data, editing, onChange }){
  const d = data;
  const cols = d.cols || 3;
  const upd = (i, k, v) => {
    const items = [...(d.items||[])];
    items[i] = { ...items[i], [k]: v };
    onChange({ ...d, items });
  };
  return (
    <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:14}}>
      {(d.items||[]).map((it,i)=>{
        const color = it.color || '#2F6BFF';
        return (
          <div key={i} style={{border:'1px solid var(--line)',borderRadius:14,padding:'16px',position:'relative',overflow:'hidden',background:'#fff',boxShadow:'var(--shadow-sm)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:color}}/>
            {it.badge && <ET tag="span" value={it.badge} onChange={(v)=>upd(i,'badge',v)} editing={editing}
              style={{display:'inline-block',fontSize:10.5,fontWeight:800,padding:'3px 11px',borderRadius:999,marginBottom:9,background:color+'22',color}}/>}
            <ET tag="b" value={it.title} onChange={(v)=>upd(i,'title',v)} editing={editing} style={{display:'block',fontSize:13.5,marginBottom:6}}/>
            <ET tag="span" value={it.desc} onChange={(v)=>upd(i,'desc',v)} editing={editing} multiline style={{fontSize:11.8,color:'var(--sub)',lineHeight:1.6,display:'block'}}/>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 4. PROCESS FLOW — STEP 원형 + 화살표
// ============================================================
function ProcessFlow({ data, editing, onChange }){
  const d = data;
  const tone = d.tone || 'blue'; // blue | green
  const bgs = {
    blue: 'linear-gradient(180deg,#F2F6FF,#fff)',
    green: 'linear-gradient(180deg,#F0FBF6,#fff)',
    purple: 'linear-gradient(180deg,#F5F1FF,#fff)',
  };
  const borders = { blue:'#D7E3FF', green:'#C9EEDD', purple:'#DDD3FA' };
  const labelColor = { blue:'var(--blue-dark)', green:'#0F9D6B', purple:'var(--purple)' };
  const circleGrad = {
    blue:'var(--grad)',
    green:'linear-gradient(90deg,#12B886,#0F9D6B)',
    purple:'linear-gradient(90deg,#7B5CFA,#B48CFF)',
  };
  const upd = (i, k, v) => {
    const steps = [...(d.steps||[])];
    steps[i] = { ...steps[i], [k]: v };
    onChange({ ...d, steps });
  };
  return (
    <div style={{borderRadius:14,padding:'16px 18px 20px',background:bgs[tone],border:`1px solid ${borders[tone]}`}}>
      <div style={{fontSize:12.5,fontWeight:800,marginBottom:12,color:labelColor[tone]}}>
        <ET tag="span" value={d.trackLabel} onChange={(v)=>onChange({...d, trackLabel:v})} editing={editing}/>
      </div>
      <div style={{display:'flex',alignItems:'stretch',gap:6}}>
        {(d.steps||[]).map((s,i)=>(
          <React.Fragment key={i}>
            <div style={{flex:1,background:'#fff',border:'1px solid var(--line)',borderRadius:12,padding:'12px 10px',textAlign:'center',boxShadow:'0 2px 8px rgba(20,30,70,.05)'}}>
              <div style={{width:30,height:30,borderRadius:'50%',margin:'0 auto 8px',color:'#fff',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12.5,background:circleGrad[tone]}}>{i+1}</div>
              <ET tag="b" value={s.title} onChange={(v)=>upd(i,'title',v)} editing={editing} style={{display:'block',fontSize:12,marginBottom:5}}/>
              <ET tag="span" value={s.desc} onChange={(v)=>upd(i,'desc',v)} editing={editing} multiline style={{fontSize:10.3,color:'var(--sub)',lineHeight:1.45,display:'block'}}/>
            </div>
            {i < d.steps.length-1 && <div style={{flex:'none',display:'flex',alignItems:'center',color:'#C3C8D2',fontSize:14,fontWeight:700,padding:'0 1px'}}>›</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 5. NUMBERED LIST — 번호 원형 + 본문 + LLM 태그
// ============================================================
function NumberedList({ data, editing, onChange }){
  const d = data;
  const upd = (i, k, v) => {
    const items = [...(d.items||[])];
    items[i] = { ...items[i], [k]: v };
    onChange({ ...d, items });
  };
  return (
    <div>
      {(d.items||[]).map((it,i)=>(
        <div key={i} style={{display:'flex',gap:14,padding:'14px 0',borderBottom: i < d.items.length-1 ? '1px solid var(--line)' : 'none'}}>
          <div style={{flex:'none',width:30,height:30,borderRadius:'50%',background:'var(--grad)',color:'#fff',fontWeight:800,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>{i+1}</div>
          <div style={{flex:1}}>
            <ET tag="b" value={it.title} onChange={(v)=>upd(i,'title',v)} editing={editing} style={{fontSize:13.5,marginRight:6}}/>
            {it.tag && <ET tag="span" value={it.tag} onChange={(v)=>upd(i,'tag',v)} editing={editing}
              style={{display:'inline-block',background:'linear-gradient(90deg,#EEF2FF,#F3F0FF)',color:'var(--purple)',fontSize:10,fontWeight:800,padding:'2px 9px',borderRadius:999,verticalAlign:'middle'}}/>}
            <ET tag="p" value={it.desc} onChange={(v)=>upd(i,'desc',v)} editing={editing} multiline style={{margin:'6px 0 0',fontSize:12.3,color:'var(--sub)',lineHeight:1.6}}/>
            {it.example && <ET tag="span" value={it.example} onChange={(v)=>upd(i,'example',v)} editing={editing}
              style={{display:'inline-block',marginTop:5,background:'var(--panel)',borderRadius:7,padding:'4px 10px',fontSize:11,color:'#3B4250'}}/>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 6. FEATURE CARDS — 아이콘 + 제목 + 설명 (컬러바)
// ============================================================
function FeatureCards({ data, editing, onChange }){
  const d = data;
  const cols = d.cols || 2;
  const upd = (i, k, v) => {
    const items = [...(d.items||[])];
    items[i] = { ...items[i], [k]: v };
    onChange({ ...d, items });
  };
  return (
    <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:16}}>
      {(d.items||[]).map((it,i)=>(
        <div key={i} style={{border:'1px solid var(--line)',borderRadius:14,padding:'18px 18px 16px',position:'relative',overflow:'hidden',background:'#fff',boxShadow:'0 2px 10px rgba(20,30,70,.05)'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:it.color||'#2F6BFF'}}/>
          <ET tag="span" value={it.icon} onChange={(v)=>upd(i,'icon',v)} editing={editing} style={{fontSize:22,marginBottom:8,display:'block'}}/>
          <ET tag="b" value={it.title} onChange={(v)=>upd(i,'title',v)} editing={editing} style={{display:'block',fontSize:14,marginBottom:6}}/>
          <ET tag="span" value={it.desc} onChange={(v)=>upd(i,'desc',v)} editing={editing} multiline style={{fontSize:12,color:'var(--sub)',lineHeight:1.6,display:'block'}}/>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 7. TABLE
// ============================================================
function TableBlock({ data, editing, onChange }){
  const d = data;
  const updHeader = (i, v) => {
    const headers = [...(d.headers||[])];
    headers[i] = v;
    onChange({ ...d, headers });
  };
  const updCell = (r, c, v) => {
    const rows = d.rows.map(row => [...row]);
    rows[r][c] = v;
    onChange({ ...d, rows });
  };
  return (
    <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
      <thead>
        <tr>
          {(d.headers||[]).map((h,i)=>(
            <th key={i} style={{textAlign:'left',color:'#9199A6',fontWeight:700,fontSize:11,padding:'9px 12px',borderBottom:'2px solid var(--line)'}}>
              <ET tag="span" value={h} onChange={(v)=>updHeader(i,v)} editing={editing}/>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(d.rows||[]).map((row,r)=>(
          <tr key={r}>
            {row.map((cell,c)=>(
              <td key={c} style={{padding:'10px 12px',borderBottom:'1px solid var(--line)',verticalAlign:'top', fontWeight: c===0?700:400, color: c===0?'var(--ink)':'var(--sub)', whiteSpace: c===0?'nowrap':'normal'}}>
                <ET tag="span" value={cell} onChange={(v)=>updCell(r,c,v)} editing={editing} multiline/>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============================================================
// 8. IMAGE BLOCK
// ============================================================
function ImageBlock({ data, editing, onChange }){
  const d = data;
  const h = d.height || 240;
  return (
    <div>
      <EImg src={d.src} editing={editing} onChange={(v)=>onChange({...d, src:v.src, alt:v.name})}
        style={{width:'100%',height:h,borderRadius:12,overflow:'hidden'}}/>
      {(d.caption || editing) && (
        <ET tag="div" value={d.caption} onChange={(v)=>onChange({...d, caption:v})} editing={editing} placeholder="이미지 설명 (선택)"
          style={{marginTop:8,fontSize:12,color:'var(--sub)',textAlign:'center',lineHeight:1.5,minHeight: editing?18:0}}/>
      )}
    </div>
  );
}

// ============================================================
// 9. VIDEO CARDS
// ============================================================
function VideoCards({ data, editing, onChange }){
  const d = data;
  const cols = d.cols || 2;
  const upd = (i, k, v) => {
    const items = [...(d.items||[])];
    items[i] = { ...items[i], [k]: v };
    onChange({ ...d, items });
  };
  return (
    <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:18}}>
      {(d.items||[]).map((it,i)=>(
        <div key={i} style={{border:'1px solid var(--line)',borderRadius:14,overflow:'hidden',boxShadow:'0 10px 26px rgba(20,30,70,.08)',background:'#fff'}}>
          <div style={{background:'#161B26',height:150,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',backgroundImage: it.thumb ? `url(${it.thumb})` : 'none',backgroundSize:'cover',backgroundPosition:'center'}}>
            <span style={{position:'absolute',top:10,left:10,background:'rgba(255,255,255,.14)',color:'#fff',fontSize:10.5,fontWeight:700,padding:'4px 10px',borderRadius:999,backdropFilter:'blur(4px)'}}>
              <ET tag="span" value={it.tag} onChange={(v)=>upd(i,'tag',v)} editing={editing}/>
            </span>
            <div style={{width:52,height:52,borderRadius:'50%',background:'var(--grad)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:16,boxShadow:'0 8px 20px rgba(80,90,255,.4)'}}>▶</div>
            {editing && (
              <label style={{position:'absolute',right:10,bottom:10,background:'rgba(20,30,60,.75)',color:'#fff',padding:'5px 10px',borderRadius:6,fontSize:10.5,fontWeight:700,cursor:'pointer'}}>
                썸네일 변경
                <input type="file" accept="image/*" style={{display:'none'}} onChange={(e)=>{
                  const f = e.target.files && e.target.files[0]; if(!f) return;
                  const rd = new FileReader();
                  rd.onload = () => upd(i,'thumb',rd.result);
                  rd.readAsDataURL(f);
                }}/>
              </label>
            )}
          </div>
          <div style={{padding:'14px 16px'}}>
            <ET tag="b" value={it.title} onChange={(v)=>upd(i,'title',v)} editing={editing} style={{display:'block',fontSize:13.5,marginBottom:5}}/>
            <ET tag="span" value={it.desc} onChange={(v)=>upd(i,'desc',v)} editing={editing} multiline style={{fontSize:11.8,color:'var(--sub)',lineHeight:1.55,display:'block'}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 10. HIGHLIGHT BOX
// ============================================================
function HighlightBox({ data, editing, onChange }){
  const d = data;
  return (
    <div style={{display:'flex',gap:10,background:'var(--grad-soft)',borderLeft:'4px solid var(--blue)',borderRadius:10,padding:'14px 18px',fontSize:12.5,color:'#1B2130',lineHeight:1.6}}>
      <ET tag="span" value={d.icon||'💡'} onChange={(v)=>onChange({...d, icon:v})} editing={editing} style={{fontSize:18,flexShrink:0}}/>
      <div>
        <ET tag="b" value={d.title} onChange={(v)=>onChange({...d, title:v})} editing={editing} style={{color:'var(--blue-dark)',display:'block',marginBottom:4,fontSize:13}}/>
        <ET tag="span" value={d.body} onChange={(v)=>onChange({...d, body:v})} editing={editing} multiline style={{display:'block'}}/>
      </div>
    </div>
  );
}

// ============================================================
// 11. ROLE CARDS (사용자 유형별)
// ============================================================
function RoleCards({ data, editing, onChange }){
  const d = data;
  const upd = (i, k, v) => {
    const items = [...(d.items||[])];
    items[i] = { ...items[i], [k]: v };
    onChange({ ...d, items });
  };
  const updList = (i, li, v) => {
    const items = [...(d.items||[])];
    const bullets = [...(items[i].bullets||[])];
    bullets[li] = v;
    items[i] = { ...items[i], bullets };
    onChange({ ...d, items });
  };
  const backgrounds = ['linear-gradient(135deg,#EAF1FF,#F3F0FF)','linear-gradient(135deg,#F3F0FF,#EAF6FF)','linear-gradient(135deg,#EAF6FF,#E4F5EE)'];
  const iconBgs = ['var(--grad)','linear-gradient(90deg,#2FA8FF,#7B5CFA)','linear-gradient(90deg,#12B886,#2FA8FF)'];
  return (
    <div style={{display:'grid',gridTemplateColumns:`repeat(${d.items?.length||2},1fr)`,gap:14}}>
      {(d.items||[]).map((it,i)=>(
        <div key={i} style={{borderRadius:14,padding:'16px 18px',background: backgrounds[i%backgrounds.length],border:'1px solid var(--line)'}}>
          <div style={{width:34,height:34,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'#fff',marginBottom:8,background: iconBgs[i%iconBgs.length]}}>
            <ET tag="span" value={it.icon} onChange={(v)=>upd(i,'icon',v)} editing={editing}/>
          </div>
          <ET tag="b" value={it.title} onChange={(v)=>upd(i,'title',v)} editing={editing} style={{display:'block',fontSize:14,marginBottom:5}}/>
          <ET tag="p" value={it.desc} onChange={(v)=>upd(i,'desc',v)} editing={editing} multiline style={{margin:'0 0 8px',fontSize:12,color:'var(--sub)',lineHeight:1.5}}/>
          <ul style={{margin:0,paddingLeft:15,fontSize:11.5,color:'var(--sub)',lineHeight:1.7}}>
            {(it.bullets||[]).map((b,li)=>(
              <li key={li}>
                <ET tag="span" value={b} onChange={(v)=>updList(i,li,v)} editing={editing}/>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 12. SECTION HEADING (제목+설명 구분자)
// ============================================================
function SectionHeading({ data, editing, onChange }){
  const d = data;
  return (
    <div>
      <ET tag="h3" value={d.title} onChange={(v)=>onChange({...d, title:v})} editing={editing}
        style={{fontSize:18,margin:'0 0 4px',color:'var(--ink)'}}/>
      {(d.desc || editing) && (
        <ET tag="p" value={d.desc} onChange={(v)=>onChange({...d, desc:v})} editing={editing} multiline
          style={{color:'var(--sub)',fontSize:12.5,lineHeight:1.5,margin:'0 0 4px'}}/>
      )}
    </div>
  );
}

// ============================================================
// 13. TEXT BLOCK (자유 텍스트)
// ============================================================
function TextBlock({ data, editing, onChange }){
  const d = data;
  const align = d.align || 'left';
  return (
    <div style={{padding:'2px 0'}}>
      <ET tag="p" value={d.body} onChange={(v)=>onChange({...d, body:v})} editing={editing} multiline
        placeholder="내용을 입력하세요"
        style={{margin:0,fontSize: d.size||13,lineHeight:1.75,color:'var(--ink)',textAlign:align,whiteSpace:'pre-wrap'}}/>
    </div>
  );
}

// ============================================================
// Registry
// ============================================================
window.RENDERERS = {
  hero: HeroBlock,
  'kpi-grid': KpiGrid,
  'card-grid': CardGrid,
  'process-flow': ProcessFlow,
  'numbered-list': NumberedList,
  'feature-cards': FeatureCards,
  'table': TableBlock,
  'image': ImageBlock,
  'video-cards': VideoCards,
  'highlight-box': HighlightBox,
  'role-cards': RoleCards,
  'section-heading': SectionHeading,
  'text-block': TextBlock,
};

window.COMPONENT_META = [
  { type:'hero', label:'히어로 섹션', icon:'Star', group:'헤더', desc:'배지 · 제목 · CTA · 미니 대시보드' },
  { type:'section-heading', label:'섹션 헤딩', icon:'Heading', group:'헤더', desc:'제목과 부연 설명' },
  { type:'kpi-grid', label:'KPI 카드', icon:'Grid', group:'데이터', desc:'수치 지표 카드 그리드' },
  { type:'table', label:'표 / 테이블', icon:'Table', group:'데이터', desc:'행과 열의 데이터' },
  { type:'text-block', label:'일반 텍스트', icon:'Type', group:'컨텐츠', desc:'자유롭게 입력하는 본문 텍스트' },
  { type:'card-grid', label:'카드 그리드', icon:'Layers', group:'컨텐츠', desc:'2~4열 일반 카드' },
  { type:'feature-cards', label:'특징 카드', icon:'Zap', group:'컨텐츠', desc:'아이콘 + 제목 + 설명' },
  { type:'role-cards', label:'역할 카드', icon:'User', group:'컨텐츠', desc:'사용자 유형별 소개' },
  { type:'process-flow', label:'프로세스 플로우', icon:'Flow', group:'프로세스', desc:'STEP 1 → 2 → 3 흐름' },
  { type:'numbered-list', label:'번호 리스트', icon:'List', group:'프로세스', desc:'번호 원형 + 상세 설명' },
  { type:'highlight-box', label:'하이라이트 박스', icon:'Quote', group:'컨텐츠', desc:'강조/인용 텍스트 박스' },
  { type:'image', label:'이미지', icon:'Image', group:'미디어', desc:'이미지 업로드 + 캡션' },
  { type:'video-cards', label:'동영상 카드', icon:'Video', group:'미디어', desc:'썸네일 + 재생 아이콘' },
];

// Default data factories - what a fresh component looks like
window.DEFAULT_DATA = {
  hero: () => ({
    badge:'Amaranth10 × ERP AI 서비스', title:'AI 분석리포트',
    subtitle:'나에게 필요한 데이터만 골라, AI가 자동으로 구성하는 맞춤형 경영 분석 대시보드',
    body:'회계·자금·인사·영업·구매 등 업무 데이터를 AI가 자동으로 분석해 KPI·차트·표를 즉시 구성합니다. 담당자는 원하는 데이터 항목만 선택하면 됩니다.',
    ctaLabel:'상세내용 보기', showCta:true, showImage:true, image:{ src:'', alt:'', width:640 },
  }),
  'kpi-grid': () => ({ cols:3, items:[
    {label:'매출액',value:'₩482M',delta:'+12.3%'},
    {label:'영업이익',value:'₩89M',delta:'+8.1%'},
    {label:'거래 건수',value:'1,284',delta:'+204'},
  ]}),
  'card-grid': () => ({ cols:3, items:[
    {title:'첫번째 카드',desc:'카드에 표시할 설명 문구를 입력하세요.',color:'#2F6BFF',badge:''},
    {title:'두번째 카드',desc:'카드에 표시할 설명 문구를 입력하세요.',color:'#7B5CFA',badge:''},
    {title:'세번째 카드',desc:'카드에 표시할 설명 문구를 입력하세요.',color:'#12B886',badge:''},
  ]}),
  'process-flow': () => ({ tone:'blue', trackLabel:'전체 프로세스 · AI분석리포트 생성 흐름', steps:[
    {title:'메뉴 진입',desc:'서비스 메뉴에서 신규 생성을 선택합니다.'},
    {title:'데이터 선택',desc:'분석할 모듈 및 데이터 항목을 선택합니다.'},
    {title:'AI 자동 생성',desc:'AI가 KPI·차트·표를 자동으로 구성합니다.'},
    {title:'리포트 확인',desc:'생성된 대시보드와 인사이트를 확인합니다.'},
  ]}),
  'numbered-list': () => ({ items:[
    {title:'데이터 수집',tag:'',desc:'선택한 데이터 소스에서 원본 행·열을 조회합니다.',example:''},
    {title:'구조 분석',tag:'AI LLM',desc:'AI가 컬럼 구조와 데이터 특성을 자동 분류합니다.',example:'예) 매출액 합계 → KPI'},
    {title:'대시보드 생성',tag:'',desc:'분류 결과를 바탕으로 최적의 KPI·차트·표를 구성합니다.',example:''},
  ]}),
  'feature-cards': () => ({ cols:2, items:[
    {icon:'🤖',title:'AI 자동 대시보드 생성',desc:'분석할 데이터만 선택하면 초 단위 내에 완성된 대시보드를 제공합니다.',color:'#2F6BFF'},
    {icon:'🎯',title:'담당자 맞춤형 리포트',desc:'각 업무 담당자에게 꼭 맞는 리포트를 자동으로 구성합니다.',color:'#7B5CFA'},
    {icon:'💬',title:'대화형 편집',desc:'자연어로 수정 요청을 입력하면 AI가 즉시 반영합니다.',color:'#12B886'},
    {icon:'📄',title:'보고서 변환·공유',desc:'PDF/문서로 즉시 변환하여 상위 보고자와 공유합니다.',color:'#FF7A45'},
  ]}),
  'table': () => ({
    headers:['모듈','데이터명','설명'],
    rows:[
      ['회계관리','원가보고서','제품매출원가 데이터를 항목별로 분석합니다.'],
      ['회계관리','자금현황','자금 계좌별 입출금 및 잔액 현황을 분석합니다.'],
      ['물류관리','주문현황','고객사별·품목별 주문 접수 현황을 분석합니다.'],
    ],
  }),
  'image': () => ({ src:'', alt:'', caption:'', height:240 }),
  'video-cards': () => ({ cols:2, items:[
    {tag:'DEMO 01',title:'실시간 분석 시연',desc:'실제 사용 화면으로 서비스 동작 방식을 확인하세요.',thumb:''},
    {tag:'DEMO 02',title:'파일 첨부 분석',desc:'외부 파일을 업로드하여 리포트를 생성하는 과정입니다.',thumb:''},
  ]}),
  'highlight-box': () => ({ icon:'💡', title:'꼭 알아두세요', body:'중요한 안내 사항이나 강조하고 싶은 내용을 여기에 입력하세요.' }),
  'role-cards': () => ({ items:[
    {icon:'🧑‍💼',title:'업무 담당자',desc:'담당 업무 영역에 맞는 데이터를 선택하여 맞춤형 리포트를 구성합니다.',bullets:['담당 데이터 실시간 분석','업무 흐름과 수치 추이 파악','팀 내 리포트 공유']},
    {icon:'📊',title:'의사결정자',desc:'회사 전반의 핵심 지표를 한 화면에서 조망하여 신속한 의사결정을 지원합니다.',bullets:['핵심 KPI 종합 조망','부서·제품별 비교 분석','즉시 보고 자료 생성']},
  ]}),
  'section-heading': () => ({ title:'섹션 제목', desc:'섹션에 대한 부연 설명을 입력하세요.' }),
  'text-block': () => ({ body:'여기에 내용을 입력하세요.', align:'left', size:13 }),
};
