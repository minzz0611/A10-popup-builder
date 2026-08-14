// Right-side property panel — edits data & style of selected component
const { useState: pUseState } = React;

function Field({ label, children, hint }){
  return (
    <div style={{marginBottom:14}}>
      <label style={{display:'block',fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.03em',marginBottom:6}}>{label}</label>
      {children}
      {hint && <div style={{fontSize:11,color:'var(--mute)',marginTop:4}}>{hint}</div>}
    </div>
  );
}

const inputStyle = {
  width:'100%',
  padding:'8px 10px',
  border:'1px solid var(--line)',
  borderRadius:7,
  fontSize:13,
  fontFamily:'inherit',
  color:'var(--ink)',
  background:'#fff',
  outline:'none',
};

function TextInput({ value, onChange, multiline, placeholder, rows=3 }){
  // 항상 textarea를 사용해서, multiline으로 지정하지 않은 짧은 필드에서도
  // Enter/Shift+Enter로 줄바꿈을 넣을 수 있게 한다. <input>은 구조적으로
  // 줄바꿈 문자를 담을 수 없어서 textarea로 통일함.
  return <textarea style={{...inputStyle, resize:'vertical', minHeight: (multiline ? rows : 1.6) * 20}}
    rows={multiline ? rows : 1}
    value={value||''} placeholder={placeholder}
    onChange={(e)=>onChange(e.target.value)} />;
}

function NumberInput({ value, onChange, min, max, step=1 }){
  return <input type="number" style={inputStyle} value={value||''} min={min} max={max} step={step}
    onChange={(e)=>onChange(Number(e.target.value))}/>;
}

// ------- Design-system color palette (from user-provided palette sheets) -------
window.DESIGN_PALETTE = [
  { group:'Text', colors:[
    { name:'Text 01', hex:'#000000' }, { name:'Text 02', hex:'#4A4A4A' },
    { name:'Text 03', hex:'#8C8C8C' }, { name:'Text 04', hex:'#A6A6A6' },
    { name:'Text 05', hex:'#1C90FB' }, { name:'Text 06', hex:'#FC5356' },
  ]},
  { group:'Bg', colors:[
    { name:'Bg 01', hex:'#F5F5F5' }, { name:'Bg 02', hex:'#F7F7F7' },
    { name:'Bg 03', hex:'#FAFAFA' }, { name:'Bg 04', hex:'#F2F6F8' },
    { name:'Bg 05', hex:'#EFF7FF' }, { name:'Bg 06', hex:'#FEF3F0' },
  ]},
  { group:'Icon', colors:[
    { name:'Icon 01', hex:'#4A4A4A' }, { name:'Icon 02', hex:'#7B7B7B' },
    { name:'Icon 03', hex:'#C4C4C4' }, { name:'Icon 04', hex:'#1C90FB' },
    { name:'Icon 05', hex:'#436EBD' },
  ]},
  { group:'Border', colors:[
    { name:'Border 01', hex:'#666666' }, { name:'Border 02', hex:'#CCCCCC' },
    { name:'Border 03', hex:'#D9D9D9' }, { name:'Border 04', hex:'#E6E6E6' },
    { name:'Border 05', hex:'#1C90FB' },
  ]},
  { group:'Status', colors:[
    { name:'Status 01', hex:'#20C997' }, { name:'Status 02', hex:'#2DBCB5' },
    { name:'Status 03', hex:'#39B0D2' }, { name:'Status 04', hex:'#46A3F0' },
    { name:'Status 05', hex:'#FF8787' }, { name:'Status 06', hex:'#F8A457' },
    { name:'Status 07', hex:'#F0C325' }, { name:'Status 08', hex:'#C8B465' },
    { name:'Status 09', hex:'#9DA3AA' }, { name:'Status 10', hex:'#E2E2E2' },
  ]},
  { group:'Graph', colors:[
    { name:'Graph 01', hex:'#4EABFA' }, { name:'Graph 02', hex:'#50CBDE' },
    { name:'Graph 03', hex:'#AFD873' }, { name:'Graph 04', hex:'#F7AD68' },
    { name:'Graph 05', hex:'#F5D471' }, { name:'Graph 06', hex:'#9A96FF' },
    { name:'Graph 07', hex:'#F48DA5' }, { name:'Graph 08', hex:'#67CCB5' },
    { name:'Graph 09', hex:'#819AFF' }, { name:'Graph 10', hex:'#D887ED' },
  ]},
  { group:'색상 구분값', colors:[
    { name:'Color 01', hex:'#FF8787' }, { name:'Color 02', hex:'#FFA94D' },
    { name:'Color 03', hex:'#FFCA55' }, { name:'Color 04', hex:'#FFE748' },
    { name:'Color 05', hex:'#B3E270' }, { name:'Color 06', hex:'#60DA9F' },
    { name:'Color 07', hex:'#49C8F2' }, { name:'Color 08', hex:'#53A0FE' },
    { name:'Color 09', hex:'#8B8BFF' }, { name:'Color 10', hex:'#BC8FFF' },
  ]},
];

function ColorPicker({ value, onChange }){
  const [open, setOpen] = pUseState(false);
  const [customHex, setCustomHex] = pUseState(value || '#000000');
  const wrapRef = React.useRef(null);

  React.useEffect(()=>{
    if(!open) return;
    const onDoc = (e) => { if(wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return ()=>document.removeEventListener('mousedown', onDoc);
  }, [open]);

  React.useEffect(()=>{ if(open) setCustomHex(value || '#000000'); }, [open]);

  const current = window.DESIGN_PALETTE.flatMap(g=>g.colors).find(c => String(c.hex).toLowerCase() === String(value||'').toLowerCase());

  const applyHex = (hex) => {
    if(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) onChange(hex);
  };

  const pickWithEyedropper = async () => {
    if(!window.EyeDropper) return;
    try {
      const ed = new window.EyeDropper();
      const result = await ed.open();
      if(result && result.sRGBHex){ onChange(result.sRGBHex); setCustomHex(result.sRGBHex); setOpen(false); }
    } catch(e) { /* 사용자가 취소함 */ }
  };

  return (
    <div ref={wrapRef} style={{position:'relative'}}>
      <button onClick={()=>setOpen(o=>!o)} type="button"
        style={{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'7px 10px',border:'1px solid var(--line)',borderRadius:7,background:'#fff',cursor:'pointer'}}>
        <span style={{width:18,height:18,borderRadius:5,flex:'none',background:value||'#fff',border:'1px solid rgba(0,0,0,.12)'}}/>
        <span style={{fontSize:12.5,color:'var(--ink)',fontWeight:600,flex:1,textAlign:'left',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
          {current ? current.name : (value || '색상 선택')}
        </span>
        <span style={{fontSize:10.5,color:'var(--mute)'}}>{value||''}</span>
      </button>

      {open && (
        <div style={{position:'absolute',zIndex:30,top:'calc(100% + 6px)',left:0,width:284,maxHeight:400,overflowY:'auto',background:'#fff',border:'1px solid var(--line)',borderRadius:10,boxShadow:'0 12px 30px rgba(20,30,60,.18)',padding:'10px 10px 10px'}}>
          {window.DESIGN_PALETTE.map(g => (
            <div key={g.group} style={{marginBottom:10}}>
              <div style={{fontSize:10.5,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>{g.group}</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:5}}>
                {g.colors.map(c => (
                  <button key={c.name} type="button" title={`${c.name} · ${c.hex}`}
                    onClick={()=>{ onChange(c.hex); setOpen(false); }}
                    style={{width:26,height:26,borderRadius:6,padding:0,cursor:'pointer',background:c.hex,border: (value||'').toLowerCase()===c.hex.toLowerCase() ? '2px solid #1B2130' : '1px solid rgba(0,0,0,.1)'}}/>
                ))}
              </div>
            </div>
          ))}
          <div style={{borderTop:'1px solid var(--line)',paddingTop:10,marginTop:2}}>
            <div style={{fontSize:10.5,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>다른 색상 (직접 지정)</div>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <input type="color" value={/^#([0-9a-f]{6})$/i.test(customHex) ? customHex : '#000000'}
                onChange={(e)=>{ setCustomHex(e.target.value); onChange(e.target.value); }}
                title="색상 선택기"
                style={{width:32,height:32,padding:0,border:'1px solid var(--line)',borderRadius:6,cursor:'pointer',flex:'none'}}/>
              <input type="text" value={customHex}
                onChange={(e)=>{ setCustomHex(e.target.value); applyHex(e.target.value); }}
                placeholder="#RRGGBB"
                style={{flex:1,padding:'6px 8px',border:'1px solid var(--line)',borderRadius:6,fontSize:12,fontFamily:'monospace',color:'var(--ink)'}}/>
              {!!window.EyeDropper && (
                <button type="button" onClick={pickWithEyedropper} title="스포이드로 화면에서 색 추출"
                  style={{flex:'none',width:32,height:32,border:'1px solid var(--line)',borderRadius:6,background:'#fff',cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  💧
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Segmented({ value, onChange, options }){
  return (
    <div style={{display:'flex',background:'var(--panel)',borderRadius:8,padding:3,gap:2}}>
      {options.map(o => (
        <button key={o.value}
          onClick={()=>onChange(o.value)}
          style={{
            flex:1,padding:'6px 8px',fontSize:12,fontWeight:700,borderRadius:6,border:'none',cursor:'pointer',
            background: value===o.value ? '#fff' : 'transparent',
            color: value===o.value ? 'var(--ink)' : 'var(--sub)',
            boxShadow: value===o.value ? '0 1px 3px rgba(20,30,60,.1)' : 'none',
          }}>{o.label}</button>
      ))}
    </div>
  );
}

function Toggle({ value, onChange, label }){
  return (
    <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13,color:'var(--ink)'}}>
      <span style={{position:'relative',width:34,height:20,background: value?'var(--blue)':'#c9cdd5',borderRadius:20,transition:'.15s'}}>
        <span style={{position:'absolute',top:2,left: value?16:2, width:16,height:16,background:'#fff',borderRadius:'50%',transition:'.15s',boxShadow:'0 1px 3px rgba(0,0,0,.15)'}}/>
      </span>
      <input type="checkbox" style={{display:'none'}} checked={!!value} onChange={(e)=>onChange(e.target.checked)}/>
      {label}
    </label>
  );
}

function ArrayEditor({ items, onChange, itemLabel = '항목', renderItem, defaultItem, maxItems }){
  return (
    <div>
      {(items||[]).map((it, i) => (
        <div key={i} style={{border:'1px solid var(--line)',borderRadius:8,padding:'10px 10px 6px',marginBottom:8,background:'#fff'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
            <span style={{fontSize:11,fontWeight:700,color:'var(--mute)'}}>{itemLabel} {i+1}</span>
            <div style={{display:'flex',gap:4}}>
              <button title="위로" disabled={i===0}
                onClick={()=>{ const arr=[...items]; [arr[i-1],arr[i]]=[arr[i],arr[i-1]]; onChange(arr); }}
                style={{border:'none',background:'none',cursor: i===0 ? 'default':'pointer',color: i===0 ? '#ccc' : 'var(--sub)',padding:2,fontSize:12}}>▲</button>
              <button title="아래로" disabled={i===items.length-1}
                onClick={()=>{ const arr=[...items]; [arr[i+1],arr[i]]=[arr[i],arr[i+1]]; onChange(arr); }}
                style={{border:'none',background:'none',cursor: i===items.length-1?'default':'pointer',color: i===items.length-1 ? '#ccc' : 'var(--sub)',padding:2,fontSize:12}}>▼</button>
              <button title="삭제" onClick={()=>{ const arr=[...items]; arr.splice(i,1); onChange(arr); }}
                style={{border:'none',background:'none',cursor:'pointer',color:'var(--danger)',padding:2,fontSize:12}}>✕</button>
            </div>
          </div>
          {renderItem(it, (patch) => {
            const arr=[...items]; arr[i]={...arr[i], ...patch}; onChange(arr);
          })}
        </div>
      ))}
      {(!maxItems || items.length < maxItems) && (
        <button onClick={()=>onChange([...(items||[]), defaultItem])}
          style={{width:'100%',padding:'8px',border:'1.5px dashed var(--line)',background:'transparent',borderRadius:8,color:'var(--blue-dark)',fontSize:12,fontWeight:700,cursor:'pointer'}}>
          + {itemLabel} 추가
        </button>
      )}
    </div>
  );
}

// ============================================================
// Per-component editor dispatch
// ============================================================
// ------- Image crop editor: preview via canvas, bakes the crop into a new
// data URL only when "적용" is pressed. Always crops from the original
// upload (image.originalSrc) so re-cropping never compounds quality loss
// and areas cropped away earlier can be brought back. -------
function ImageCropEditor({ image, onApply, onReset }){
  const [inset, setInset] = pUseState(image.cropInset || {top:0,right:0,bottom:0,left:0});
  const canvasRef = React.useRef(null);
  const imgElRef = React.useRef(null);
  const sourceSrc = image.originalSrc || image.src;

  const draw = () => {
    const img = imgElRef.current;
    const canvas = canvasRef.current;
    if(!img || !canvas || !img.naturalWidth) return;
    const { top, right, bottom, left } = inset;
    const sx = img.naturalWidth * (left/100);
    const sy = img.naturalHeight * (top/100);
    const sw = Math.max(1, img.naturalWidth * (1 - (left+right)/100));
    const sh = Math.max(1, img.naturalHeight * (1 - (top+bottom)/100));
    canvas.width = sw; canvas.height = sh;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,sw,sh);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  };

  React.useEffect(() => {
    const img = new window.Image();
    img.onload = () => { imgElRef.current = img; draw(); };
    img.src = sourceSrc;
    // eslint-disable-next-line
  }, [sourceSrc]);

  React.useEffect(() => { draw(); }, [inset]);

  const setPart = (k, v) => {
    setInset(prev => {
      const next = { ...prev, [k]: v };
      if(next.left + next.right > 90){ if(k==='left') next.right = 90-next.left; else next.left = 90-next.right; }
      if(next.top + next.bottom > 90){ if(k==='top') next.bottom = 90-next.top; else next.top = 90-next.bottom; }
      return next;
    });
  };

  const slider = (label, key) => (
    <div>
      <div style={{fontSize:10.5,color:'var(--mute)',marginBottom:3}}>{label} {inset[key]}%</div>
      <input type="range" min={0} max={80} value={inset[key]} onChange={(e)=>setPart(key, Number(e.target.value))} style={{width:'100%'}}/>
    </div>
  );

  return (
    <Field label="자르기" hint="미리보기를 조절한 뒤 '자르기 적용'을 눌러야 반영됩니다.">
      <div style={{border:'1px solid var(--line)',borderRadius:8,padding:10,background:'#FAFBFC'}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:10,background:'#EAECEF',borderRadius:6,overflow:'hidden',padding:4}}>
          <canvas ref={canvasRef} style={{maxWidth:'100%',maxHeight:180,display:'block'}}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
          {slider('위쪽','top')}
          {slider('아래쪽','bottom')}
          {slider('왼쪽','left')}
          {slider('오른쪽','right')}
        </div>
        <div style={{display:'flex',gap:6}}>
          <button onClick={()=>{ const c = canvasRef.current; if(c) onApply(c.toDataURL('image/png'), inset); }}
            style={{flex:1,padding:'7px 8px',border:'none',background:'var(--grad)',color:'#fff',borderRadius:7,fontSize:11.5,fontWeight:700,cursor:'pointer'}}>자르기 적용</button>
          <button onClick={()=>{ setInset({top:0,right:0,bottom:0,left:0}); onReset(); }}
            style={{flex:1,padding:'7px 8px',border:'1px solid var(--line)',background:'#fff',borderRadius:7,fontSize:11.5,fontWeight:700,color:'var(--ink)',cursor:'pointer'}}>원본으로 초기화</button>
        </div>
      </div>
    </Field>
  );
}

function CompEditor({ comp, onChange }){
  const t = comp.type;
  const d = comp.data;
  const set = (k, v) => onChange({ ...d, [k]: v });

  if(t === 'hero'){
    return (
      <div>
        <Field label="배지 (상단)"><TextInput value={d.badge} onChange={(v)=>set('badge',v)}/></Field>
        <Field label="메인 타이틀"><TextInput value={d.title} onChange={(v)=>set('title',v)}/></Field>
        <Field label="서브 타이틀"><TextInput value={d.subtitle} onChange={(v)=>set('subtitle',v)} multiline rows={2}/></Field>
        <Field label="본문"><TextInput value={d.body} onChange={(v)=>set('body',v)} multiline rows={3}/></Field>
        <Field label="CTA 버튼 라벨"><TextInput value={d.ctaLabel} onChange={(v)=>set('ctaLabel',v)}/></Field>
        <Field label=" "><Toggle value={d.showCta!==false} onChange={(v)=>set('showCta',v)} label="CTA 버튼 표시"/></Field>
        <Field label=" "><Toggle value={!!d.showVideoBtn} onChange={(v)=>set('showVideoBtn',v)} label="동영상 버튼 표시"/></Field>
        {d.showVideoBtn && (
          <Field label="동영상 버튼 라벨"><TextInput value={d.videoBtnLabel} onChange={(v)=>set('videoBtnLabel',v)}/></Field>
        )}
        <Field label=" "><Toggle value={d.showImage!==false} onChange={(v)=>set('showImage',v)} label="이미지 표시"/></Field>
        {d.showImage!==false && (
          <Field label="히어로 이미지" hint="캔버스에서 직접 클릭 후 모서리를 드래그해도 크기를 조절할 수 있습니다.">
            {d.image?.src ? (
              <div style={{position:'relative',borderRadius:8,overflow:'hidden',border:'1px solid var(--line)'}}>
                <img src={d.image.src} style={{width:'100%',display:'block'}}/>
                <button onClick={()=>set('image',{src:'',alt:''})}
                  style={{position:'absolute',right:6,top:6,background:'rgba(20,30,60,.75)',color:'#fff',border:'none',padding:'4px 8px',borderRadius:5,cursor:'pointer',fontSize:11}}>삭제</button>
              </div>
            ) : (
              <label style={{display:'block',padding:'20px',border:'1.5px dashed var(--line)',borderRadius:8,textAlign:'center',fontSize:12,color:'var(--blue-dark)',fontWeight:700,cursor:'pointer'}}>
                📁 이미지 업로드
                <input type="file" accept="image/*" style={{display:'none'}} onChange={(e)=>{
                  const f = e.target.files && e.target.files[0]; if(!f) return;
                  const rd = new FileReader(); rd.onload = () => set('image',{...(d.image||{}), src:rd.result, alt:f.name}); rd.readAsDataURL(f);
                }}/>
              </label>
            )}
          </Field>
        )}
        {d.showImage!==false && d.image?.src && (
          <Field label={`이미지 크기 (${d.image?.width||640}px)`} hint="원본 비율은 그대로 유지되며, 항상 가운데 정렬됩니다.">
            <input type="range" min={160} max={640} step={10}
              value={d.image?.width||640}
              onChange={(e)=>set('image',{...(d.image||{}), width:Number(e.target.value)})}
              style={{width:'100%'}}/>
          </Field>
        )}
      </div>
    );
  }

  if(t === 'section-heading'){
    return (
      <div>
        <Field label="제목"><TextInput value={d.title} onChange={(v)=>set('title',v)}/></Field>
        <Field label="설명"><TextInput value={d.desc} onChange={(v)=>set('desc',v)} multiline/></Field>
      </div>
    );
  }

  if(t === 'kpi-grid'){
    return (
      <div>
        <Field label="컬럼 수">
          <Segmented value={d.cols||3} onChange={(v)=>set('cols',v)}
            options={[{value:2,label:'2열'},{value:3,label:'3열'},{value:4,label:'4열'}]}/>
        </Field>
        <Field label="KPI 항목">
          <ArrayEditor items={d.items} onChange={(v)=>set('items',v)} itemLabel="KPI"
            defaultItem={{label:'항목',value:'0',delta:''}}
            renderItem={(it,upd)=>(
              <div style={{display:'grid',gap:6}}>
                <TextInput value={it.label} onChange={(v)=>upd({label:v})} placeholder="라벨"/>
                <TextInput value={it.value} onChange={(v)=>upd({value:v})} placeholder="값"/>
                <TextInput value={it.delta} onChange={(v)=>upd({delta:v})} placeholder="증감 (선택)"/>
              </div>
            )}/>
        </Field>
      </div>
    );
  }

  if(t === 'card-grid'){
    return (
      <div>
        <Field label="컬럼 수">
          <Segmented value={d.cols||3} onChange={(v)=>set('cols',v)}
            options={[{value:2,label:'2열'},{value:3,label:'3열'},{value:4,label:'4열'}]}/>
        </Field>
        <Field label="카드">
          <ArrayEditor items={d.items} onChange={(v)=>set('items',v)} itemLabel="카드"
            defaultItem={{title:'제목',desc:'설명',color:'#2F6BFF',badge:''}}
            renderItem={(it,upd)=>(
              <div style={{display:'grid',gap:6}}>
                <TextInput value={it.badge} onChange={(v)=>upd({badge:v})} placeholder="배지 (선택)"/>
                <TextInput value={it.title} onChange={(v)=>upd({title:v})} placeholder="제목"/>
                <TextInput value={it.desc} onChange={(v)=>upd({desc:v})} multiline placeholder="설명"/>
                <ColorPicker value={it.color} onChange={(v)=>upd({color:v})}/>
              </div>
            )}/>
        </Field>
      </div>
    );
  }

  if(t === 'feature-cards'){
    return (
      <div>
        <Field label="컬럼 수">
          <Segmented value={d.cols||2} onChange={(v)=>set('cols',v)}
            options={[{value:2,label:'2열'},{value:3,label:'3열'},{value:4,label:'4열'}]}/>
        </Field>
        <Field label="특징">
          <ArrayEditor items={d.items} onChange={(v)=>set('items',v)} itemLabel="특징"
            defaultItem={{icon:'✨',title:'제목',desc:'설명',color:'#2F6BFF'}}
            renderItem={(it,upd)=>(
              <div style={{display:'grid',gap:6}}>
                <TextInput value={it.icon} onChange={(v)=>upd({icon:v})} placeholder="아이콘 (이모지)"/>
                <TextInput value={it.title} onChange={(v)=>upd({title:v})} placeholder="제목"/>
                <TextInput value={it.desc} onChange={(v)=>upd({desc:v})} multiline placeholder="설명"/>
                <ColorPicker value={it.color} onChange={(v)=>upd({color:v})}/>
              </div>
            )}/>
        </Field>
      </div>
    );
  }

  if(t === 'process-flow'){
    return (
      <div>
        <Field label="트랙 라벨"><TextInput value={d.trackLabel} onChange={(v)=>set('trackLabel',v)}/></Field>
        <Field label="컬러 톤">
          <Segmented value={d.tone||'blue'} onChange={(v)=>set('tone',v)}
            options={[{value:'blue',label:'블루'},{value:'green',label:'그린'},{value:'purple',label:'퍼플'}]}/>
        </Field>
        <Field label="단계">
          <ArrayEditor items={d.steps} onChange={(v)=>set('steps',v)} itemLabel="STEP"
            defaultItem={{title:'단계',desc:'설명'}}
            renderItem={(it,upd)=>(
              <div style={{display:'grid',gap:6}}>
                <TextInput value={it.title} onChange={(v)=>upd({title:v})} placeholder="단계명"/>
                <TextInput value={it.desc} onChange={(v)=>upd({desc:v})} multiline placeholder="설명"/>
              </div>
            )}/>
        </Field>
      </div>
    );
  }

  if(t === 'numbered-list'){
    return (
      <div>
        <Field label="번호 항목">
          <ArrayEditor items={d.items} onChange={(v)=>set('items',v)} itemLabel="항목"
            defaultItem={{title:'제목',tag:'',desc:'설명',example:''}}
            renderItem={(it,upd)=>(
              <div style={{display:'grid',gap:6}}>
                <TextInput value={it.title} onChange={(v)=>upd({title:v})} placeholder="제목"/>
                <TextInput value={it.tag} onChange={(v)=>upd({tag:v})} placeholder="태그 (선택, 예: AI LLM)"/>
                <TextInput value={it.desc} onChange={(v)=>upd({desc:v})} multiline placeholder="설명"/>
                <TextInput value={it.example} onChange={(v)=>upd({example:v})} placeholder="예시 (선택)"/>
              </div>
            )}/>
        </Field>
      </div>
    );
  }

  if(t === 'table'){
    const addCol = () => {
      const headers = [...d.headers, '컬럼'];
      const rows = d.rows.map(r => [...r, '']);
      onChange({ ...d, headers, rows });
    };
    const delCol = (idx) => {
      if(d.headers.length<=1) return;
      const headers = d.headers.filter((_,i)=>i!==idx);
      const rows = d.rows.map(r => r.filter((_,i)=>i!==idx));
      onChange({ ...d, headers, rows });
    };
    const addRow = () => {
      const rows = [...d.rows, d.headers.map(()=>'')];
      onChange({ ...d, rows });
    };
    const delRow = (idx) => {
      const rows = d.rows.filter((_,i)=>i!==idx);
      onChange({ ...d, rows });
    };
    return (
      <div>
        <Field label="표 편집" hint="셀은 캔버스에서 직접 클릭해 편집할 수 있습니다.">
          <div style={{fontSize:12,color:'var(--sub)',marginBottom:8}}>컬럼: {d.headers.length}개 · 행: {d.rows.length}개</div>
          <div style={{display:'flex',gap:6,marginBottom:10}}>
            <button onClick={addCol} style={{...inputStyle,cursor:'pointer',fontWeight:700,color:'var(--blue-dark)'}}>+ 컬럼</button>
            <button onClick={addRow} style={{...inputStyle,cursor:'pointer',fontWeight:700,color:'var(--blue-dark)'}}>+ 행</button>
          </div>
          <div style={{border:'1px solid var(--line)',borderRadius:8,overflow:'hidden'}}>
            {d.headers.map((h,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',padding:'6px 10px',fontSize:12,borderBottom: i<d.headers.length-1 ? '1px solid var(--line)' : 'none'}}>
                <span style={{flex:1,color:'var(--sub)'}}>컬럼 {i+1}: <b style={{color:'var(--ink)'}}>{h||'(빈 헤더)'}</b></span>
                <button onClick={()=>delCol(i)} disabled={d.headers.length<=1}
                  style={{border:'none',background:'none',cursor: d.headers.length<=1 ? 'default':'pointer',color: d.headers.length<=1 ? '#ccc':'var(--danger)',fontSize:12}}>✕</button>
              </div>
            ))}
          </div>
          <div style={{marginTop:10,border:'1px solid var(--line)',borderRadius:8,overflow:'hidden'}}>
            {d.rows.map((r,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',padding:'6px 10px',fontSize:12,borderBottom: i<d.rows.length-1 ? '1px solid var(--line)' : 'none'}}>
                <span style={{flex:1,color:'var(--sub)'}}>행 {i+1}: <b style={{color:'var(--ink)'}}>{r[0]||'(빈 행)'}</b></span>
                <button onClick={()=>delRow(i)} style={{border:'none',background:'none',cursor:'pointer',color:'var(--danger)',fontSize:12}}>✕</button>
              </div>
            ))}
          </div>
        </Field>
      </div>
    );
  }

  if(t === 'image'){
    return (
      <div>
        <Field label="이미지" hint="캔버스에서 직접 클릭 후 모서리를 드래그해도 크기를 조절할 수 있습니다.">
          {d.src ? (
            <div style={{position:'relative',borderRadius:8,overflow:'hidden',border:'1px solid var(--line)'}}>
              <img src={d.src} style={{width:'100%',display:'block'}}/>
              <button onClick={()=>onChange({...d, src:'', originalSrc:'', cropInset:{top:0,right:0,bottom:0,left:0}})}
                style={{position:'absolute',right:6,top:6,background:'rgba(20,30,60,.75)',color:'#fff',border:'none',padding:'4px 8px',borderRadius:5,cursor:'pointer',fontSize:11}}>삭제</button>
            </div>
          ) : (
            <label style={{display:'block',padding:'20px',border:'1.5px dashed var(--line)',borderRadius:8,textAlign:'center',fontSize:12,color:'var(--blue-dark)',fontWeight:700,cursor:'pointer'}}>
              📁 이미지 업로드
              <input type="file" accept="image/*" style={{display:'none'}} onChange={(e)=>{
                const f = e.target.files && e.target.files[0]; if(!f) return;
                const rd = new FileReader(); rd.onload = () => onChange({ ...d, src:rd.result, originalSrc:rd.result, alt:f.name, cropInset:{top:0,right:0,bottom:0,left:0} }); rd.readAsDataURL(f);
              }}/>
            </label>
          )}
        </Field>

        {d.src && (
          <>
            <Field label=" "><Toggle value={!!d.freeAspect} onChange={(v)=>set('freeAspect',v)} label="비율에 맞지 않게 수정"/></Field>

            {!d.freeAspect ? (
              <Field label={`너비 (${d.width ? d.width+'px' : '전체 너비'})`} hint="원본 이미지의 가로·세로 비율이 그대로 유지됩니다.">
                <input type="range" min={120} max={900} step={10}
                  value={d.width || 640}
                  onChange={(e)=>set('width', Number(e.target.value))}
                  style={{width:'100%'}}/>
              </Field>
            ) : (
              <>
                <Field label={`너비 (${d.width||640}px)`} hint="비율을 무시하고 가로·세로를 각각 지정합니다.">
                  <input type="range" min={120} max={900} step={10} value={d.width||640} onChange={(e)=>set('width',Number(e.target.value))} style={{width:'100%'}}/>
                </Field>
                <Field label={`높이 (${d.height||240}px)`}>
                  <input type="range" min={60} max={700} step={10} value={d.height||240} onChange={(e)=>set('height',Number(e.target.value))} style={{width:'100%'}}/>
                </Field>
              </>
            )}

            <ImageCropEditor image={d}
              onApply={(newSrc, cropInset)=>onChange({...d, src:newSrc, cropInset})}
              onReset={()=>onChange({...d, src:d.originalSrc||d.src, cropInset:{top:0,right:0,bottom:0,left:0}})}/>

            <div style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',margin:'14px 0 8px'}}>테두리 · 강조</div>
            <Field label=" ">
              <Toggle value={!!d.border?.enabled} onChange={(v)=>onChange({...d, border:{...(d.border||{}), enabled:v}})} label="테두리 추가"/>
            </Field>
            {d.border?.enabled && !d.emphasis?.enabled && (
              <>
                <Field label="테두리 색상">
                  <ColorPicker value={d.border?.color} onChange={(hex)=>onChange({...d, border:{...(d.border||{}), color:hex}})}/>
                </Field>
                <Field label={`테두리 굵기 (${d.border?.width||1}px)`}>
                  <input type="range" min={1} max={3} step={1}
                    value={d.border?.width||1}
                    onChange={(e)=>onChange({...d, border:{...(d.border||{}), width:Number(e.target.value)}})}
                    style={{width:'100%'}}/>
                </Field>
              </>
            )}

            <Field label=" ">
              <Toggle value={!!d.emphasis?.enabled} onChange={(v)=>onChange({...d, emphasis:{...(d.emphasis||{}), enabled:v}})} label="강조 (굵은 테두리 + 네온)"/>
            </Field>
            {d.emphasis?.enabled && (
              <Field label="강조 색상" hint="테두리 굵기와 네온 적용범위는 고정이며, 색상만 바꿀 수 있어요. 강조를 켜면 기본 테두리보다 굵게 표시됩니다.">
                <ColorPicker value={d.emphasis?.color} onChange={(hex)=>onChange({...d, emphasis:{...(d.emphasis||{}), color:hex}})}/>
              </Field>
            )}
          </>
        )}

        <Field label="캡션 (선택)"><TextInput value={d.caption} onChange={(v)=>set('caption',v)} multiline rows={2}/></Field>
      </div>
    );
  }

  if(t === 'video-cards'){
    return (
      <div>
        <Field label="컬럼 수">
          <Segmented value={d.cols||2} onChange={(v)=>set('cols',v)}
            options={[{value:1,label:'1열'},{value:2,label:'2열'},{value:3,label:'3열'}]}/>
        </Field>
        <Field label="동영상 카드">
          <ArrayEditor items={d.items} onChange={(v)=>set('items',v)} itemLabel="영상"
            defaultItem={{tag:'DEMO',title:'제목',desc:'설명',thumb:''}}
            renderItem={(it,upd)=>(
              <div style={{display:'grid',gap:6}}>
                <TextInput value={it.tag} onChange={(v)=>upd({tag:v})} placeholder="태그"/>
                <TextInput value={it.title} onChange={(v)=>upd({title:v})} placeholder="제목"/>
                <TextInput value={it.desc} onChange={(v)=>upd({desc:v})} multiline placeholder="설명"/>
                {it.thumb ? (
                  <div style={{position:'relative',borderRadius:6,overflow:'hidden',border:'1px solid var(--line)'}}>
                    <img src={it.thumb} style={{width:'100%',display:'block',maxHeight:120,objectFit:'cover'}}/>
                    <button onClick={()=>upd({thumb:''})} style={{position:'absolute',right:4,top:4,background:'rgba(20,30,60,.75)',color:'#fff',border:'none',padding:'2px 6px',borderRadius:4,cursor:'pointer',fontSize:10}}>삭제</button>
                  </div>
                ) : (
                  <label style={{padding:'8px',border:'1.5px dashed var(--line)',borderRadius:6,textAlign:'center',fontSize:11,color:'var(--blue-dark)',fontWeight:700,cursor:'pointer'}}>
                    📁 썸네일 업로드
                    <input type="file" accept="image/*" style={{display:'none'}} onChange={(e)=>{
                      const f = e.target.files && e.target.files[0]; if(!f) return;
                      const rd = new FileReader(); rd.onload = () => upd({thumb:rd.result}); rd.readAsDataURL(f);
                    }}/>
                  </label>
                )}
              </div>
            )}/>
        </Field>
      </div>
    );
  }

  if(t === 'highlight-box'){
    return (
      <div>
        <Field label="아이콘"><TextInput value={d.icon} onChange={(v)=>set('icon',v)}/></Field>
        <Field label="제목"><TextInput value={d.title} onChange={(v)=>set('title',v)}/></Field>
        <Field label="본문"><TextInput value={d.body} onChange={(v)=>set('body',v)} multiline/></Field>
      </div>
    );
  }

  if(t === 'text-block'){
    return (
      <div>
        <Field label="본문"><TextInput value={d.body} onChange={(v)=>set('body',v)} multiline rows={6}/></Field>
        <Field label="정렬">
          <Segmented value={d.align||'left'} onChange={(v)=>set('align',v)}
            options={[{value:'left',label:'왼쪽'},{value:'center',label:'가운데'},{value:'right',label:'오른쪽'}]}/>
        </Field>
        <Field label="글자 크기"><NumberInput value={d.size||13} onChange={(v)=>set('size',v)} min={10} max={28}/></Field>
      </div>
    );
  }

  if(t === 'role-cards'){
    return (
      <div>
        <Field label="역할 카드">
          <ArrayEditor items={d.items} onChange={(v)=>set('items',v)} itemLabel="역할" maxItems={3}
            defaultItem={{icon:'👤',title:'역할',desc:'설명',bullets:['항목 1','항목 2']}}
            renderItem={(it,upd)=>(
              <div style={{display:'grid',gap:6}}>
                <TextInput value={it.icon} onChange={(v)=>upd({icon:v})} placeholder="아이콘"/>
                <TextInput value={it.title} onChange={(v)=>upd({title:v})} placeholder="역할명"/>
                <TextInput value={it.desc} onChange={(v)=>upd({desc:v})} multiline placeholder="설명"/>
                <div style={{fontSize:11,color:'var(--mute)',marginTop:2}}>불릿 항목 (한 줄에 하나씩)</div>
                <TextInput value={(it.bullets||[]).join('\n')} onChange={(v)=>upd({bullets: v.split('\n').filter(x=>x.trim())})} multiline rows={4}/>
                <div style={{fontSize:11,color:'var(--mute)',marginTop:2}}>배경 색상</div>
                <ColorPicker value={it.bgColor} onChange={(hex)=>upd({bgColor:hex})}/>
                {it.bgColor && (
                  <button type="button" onClick={()=>upd({bgColor:''})}
                    style={{fontSize:10.5,color:'var(--mute)',background:'none',border:'none',cursor:'pointer',textAlign:'left',padding:0}}>
                    기본 배경으로 되돌리기
                  </button>
                )}
              </div>
            )}/>
        </Field>
      </div>
    );
  }

  return <div style={{color:'var(--mute)',fontSize:12}}>이 컴포넌트는 캔버스에서 더블클릭으로 직접 편집하세요.</div>;
}

function PropertyPanel({ state, selectedId, activeSectionId, activeTabId, onSelect, onUpdateComp, onUpdateStyle, onProjectUpdate, onDelete, onDuplicate, isProtected }){
  const [showPopupSettings, setShowPopupSettings] = pUseState(false);

  const componentList = window.getComponentList(state, activeSectionId, activeTabId);
  const activeSec = activeSectionId === null ? null : (state.sidebar||[]).find(s => s.id === activeSectionId);
  const activeTab = activeSec?.tabs?.find(t => t.id === activeTabId) || null;
  const screenLabel = activeSectionId === null
    ? '🏠 표지'
    : `${activeSec?.kind === 'cover' ? '🖼️' : '📄'} ${activeSec?.label || ''}${activeTab ? ` · ${activeTab.label}` : ''}`;

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      {/* 현재 화면에서 사용 중인 컴포넌트 목록 (화면상 위치 순서) */}
      <div style={{flex:'none',padding:'16px 16px 10px',borderBottom:'1px solid var(--line)'}}>
        <div style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',marginBottom:5}}>컴포넌트 목록</div>
        <div style={{fontSize:13,fontWeight:800,color:'var(--ink)'}}>{screenLabel}</div>
        <div style={{fontSize:11,color:'var(--mute)',marginTop:3,lineHeight:1.5}}>화면에 보이는 순서대로 표시됩니다. 클릭하면 아래에 상세 내용이 열려요.</div>
      </div>

      <div style={{flex:1,minHeight:0,overflowY:'auto',padding:'10px'}}>
        {componentList.length === 0 && (
          <div style={{padding:'28px 12px',textAlign:'center',color:'var(--mute)',fontSize:12,lineHeight:1.6}}>
            아직 추가된 컴포넌트가 없어요.<br/>좌측 팔레트에서 추가해 보세요.
          </div>
        )}
        {componentList.map((cid, idx) => {
          const comp = state.components[cid];
          if(!comp) return null;
          const meta = window.COMPONENT_META.find(m => m.type === comp.type);
          const expanded = selectedId === cid;
          const isLast = idx === componentList.length - 1;
          const locked = isProtected && isProtected(cid);
          return (
            <div key={cid} style={{marginBottom:6,border:'1px solid var(--line)',borderRadius:10,overflow:'hidden',background: expanded ? '#fff' : '#FAFBFC', boxShadow: expanded ? '0 2px 8px rgba(30,50,120,.06)' : 'none'}}>
              <button onClick={()=>onSelect(expanded ? null : cid)}
                style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 12px',border:'none',background:'transparent',cursor:'pointer',textAlign:'left'}}>
                <span style={{flex:'none',fontSize:11,color:'var(--mute)',fontWeight:700,width:14,textAlign:'center'}}>{idx+1}</span>
                <div style={{flex:'none',width:26,height:26,borderRadius:7,background: expanded ? 'var(--grad)' : 'var(--panel)',color: expanded ? '#fff':'var(--blue-dark)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {window.Icons[meta?.icon || 'Grid']({size:14})}
                </div>
                <span style={{flex:1,minWidth:0,fontSize:12.5,fontWeight:700,color:'var(--ink)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{meta?.label || comp.type}</span>
                <span style={{flex:'none',fontSize:13,color:'var(--mute)',transform: expanded ? 'rotate(90deg)':'none',transition:'transform .15s'}}>›</span>
              </button>

              {expanded && (
                <div style={{padding:'2px 12px 14px',borderTop:'1px solid var(--line)'}}>
                  <div style={{paddingTop:12}}>
                    <CompEditor comp={comp} onChange={(newData)=>onUpdateComp(comp.id, newData)}/>
                  </div>

                  {!isLast && (
                    <Field label="다음 컴포넌트와의 간격" hint="캔버스에서 컴포넌트 사이를 직접 드래그해도 조절할 수 있어요.">
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <input type="range" min={0} max={120} step={2}
                          value={comp.style?.gapAfter ?? 20}
                          onChange={(e)=>onUpdateStyle && onUpdateStyle(comp.id, { gapAfter:Number(e.target.value) })}
                          style={{flex:1}}/>
                        <div style={{flex:'none',display:'flex',alignItems:'center',gap:2}}>
                          <input type="number" min={0} max={120} step={1}
                            value={comp.style?.gapAfter ?? 20}
                            onChange={(e)=>{
                              const v = Math.max(0, Math.min(120, Number(e.target.value) || 0));
                              onUpdateStyle && onUpdateStyle(comp.id, { gapAfter:v });
                            }}
                            style={{width:44,padding:'4px 5px',border:'1px solid var(--line)',borderRadius:6,fontSize:12,fontWeight:700,color:'var(--sub)',textAlign:'right',fontFamily:'inherit'}}/>
                          <span style={{fontSize:12,color:'var(--sub)',fontWeight:700}}>px</span>
                        </div>
                      </div>
                    </Field>
                  )}

                  <div style={{display:'flex',gap:6,paddingTop:10,borderTop:'1px solid var(--line)',marginTop:6}}>
                    <button onClick={()=>onDuplicate(comp.id)}
                      style={{flex:1,padding:'7px 8px',border:'1px solid var(--line)',background:'#fff',borderRadius:7,fontSize:11.5,fontWeight:700,color:'var(--ink)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5}}>
                      {window.Icons.Copy({size:12})} 복제
                    </button>
                    {locked ? (
                      <div title="표지의 히어로 컴포넌트는 삭제할 수 없습니다."
                        style={{flex:1,padding:'7px 8px',border:'1px solid var(--line)',background:'var(--panel)',borderRadius:7,fontSize:11.5,fontWeight:700,color:'var(--mute)',display:'flex',alignItems:'center',justifyContent:'center',gap:5}}>
                        🔒 삭제 불가
                      </div>
                    ) : (
                      <button onClick={()=>onDelete(comp.id)}
                        style={{flex:1,padding:'7px 8px',border:'1px solid #FFD8E0',background:'#fff',borderRadius:7,fontSize:11.5,fontWeight:700,color:'var(--danger)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5}}>
                        {window.Icons.Trash({size:12})} 삭제
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 팝업 전체 설정 - 접이식, 목록 아래에 위치 */}
      <div style={{flex:'none',borderTop:'1px solid var(--line)'}}>
        <button onClick={()=>setShowPopupSettings(v=>!v)}
          style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',border:'none',background:'transparent',cursor:'pointer'}}>
          <span style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em'}}>팝업 설정</span>
          <span style={{fontSize:12,color:'var(--mute)',transform: showPopupSettings ? 'rotate(90deg)':'none',transition:'transform .15s'}}>›</span>
        </button>
        {showPopupSettings && (
          <div style={{padding:'0 16px 18px',maxHeight:360,overflowY:'auto'}}>
            <Field label="프로젝트 제목">
              <TextInput value={state.meta.title} onChange={(v)=>onProjectUpdate({ meta:{...state.meta, title:v}})}/>
            </Field>
            <div style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',margin:'16px 0 10px'}}>레이아웃</div>
            <Field label="상세 화면 상단 여백" hint="첫 컴포넌트 앞 여백입니다. 캔버스에서 직접 드래그해도 조절할 수 있어요.">
              <div style={{display:'flex',alignItems:'center',gap:2}}>
                <input type="number" min={0} max={120} step={1}
                  value={state.popup?.topGap ?? 30}
                  onChange={(e)=>{
                    const v = Math.max(0, Math.min(120, Number(e.target.value) || 0));
                    onProjectUpdate({ popup:{...state.popup, topGap:v} });
                  }}
                  style={{width:56,padding:'6px 7px',border:'1px solid var(--line)',borderRadius:6,fontSize:12.5,fontWeight:700,color:'var(--sub)',textAlign:'right',fontFamily:'inherit'}}/>
                <span style={{fontSize:12,color:'var(--sub)',fontWeight:700}}>px</span>
              </div>
            </Field>
            <div style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',margin:'16px 0 10px'}}>푸터</div>
            <Field label="이용 링크 (콤마 구분)">
              <TextInput value={(state.popup.footer.links||[]).join(', ')} onChange={(v)=>onProjectUpdate({ popup:{ ...state.popup, footer:{ ...state.popup.footer, links: v.split(',').map(x=>x.trim()).filter(Boolean)}}})}/>
            </Field>
            <Field label="고객센터 전화번호">
              <TextInput value={state.popup.footer.phone} onChange={(v)=>onProjectUpdate({ popup:{...state.popup, footer:{...state.popup.footer, phone:v}}})}/>
            </Field>
            <Field label="URL">
              <TextInput value={state.popup.footer.url} onChange={(v)=>onProjectUpdate({ popup:{...state.popup, footer:{...state.popup.footer, url:v}}})}/>
            </Field>
            <div style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',margin:'16px 0 10px'}}>옵션</div>
            <Field label=" ">
              <Toggle value={state.popup.dontShowOption} onChange={(v)=>onProjectUpdate({ popup:{...state.popup, dontShowOption:v}})} label="'다시 보지 않기' 체크박스 표시"/>
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}
window.PropertyPanel = PropertyPanel;
