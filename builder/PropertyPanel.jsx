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
  if(multiline){
    return <textarea style={{...inputStyle, resize:'vertical', minHeight: rows*20}}
      value={value||''} placeholder={placeholder}
      onChange={(e)=>onChange(e.target.value)} />;
  }
  return <input type="text" style={inputStyle} value={value||''} placeholder={placeholder}
    onChange={(e)=>onChange(e.target.value)}/>;
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
  const wrapRef = React.useRef(null);

  React.useEffect(()=>{
    if(!open) return;
    const onDoc = (e) => { if(wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return ()=>document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const current = window.DESIGN_PALETTE.flatMap(g=>g.colors).find(c => String(c.hex).toLowerCase() === String(value||'').toLowerCase());

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
        <div style={{position:'absolute',zIndex:30,top:'calc(100% + 6px)',left:0,width:284,maxHeight:340,overflowY:'auto',background:'#fff',border:'1px solid var(--line)',borderRadius:10,boxShadow:'0 12px 30px rgba(20,30,60,.18)',padding:'10px 10px 4px'}}>
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
        <Field label=" "><Toggle value={d.showImage!==false} onChange={(v)=>set('showImage',v)} label="이미지 표시"/></Field>
        {d.showImage!==false && (
          <Field label="히어로 이미지" hint="캔버스에서 직접 클릭해서도 업로드할 수 있습니다.">
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
                  const rd = new FileReader(); rd.onload = () => set('image',{src:rd.result, alt:f.name}); rd.readAsDataURL(f);
                }}/>
              </label>
            )}
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
        <Field label="이미지" hint="캔버스에서 직접 클릭해서도 업로드할 수 있습니다.">
          {d.src ? (
            <div style={{position:'relative',borderRadius:8,overflow:'hidden',border:'1px solid var(--line)'}}>
              <img src={d.src} style={{width:'100%',display:'block'}}/>
              <button onClick={()=>set('src','')}
                style={{position:'absolute',right:6,top:6,background:'rgba(20,30,60,.75)',color:'#fff',border:'none',padding:'4px 8px',borderRadius:5,cursor:'pointer',fontSize:11}}>삭제</button>
            </div>
          ) : (
            <label style={{display:'block',padding:'20px',border:'1.5px dashed var(--line)',borderRadius:8,textAlign:'center',fontSize:12,color:'var(--blue-dark)',fontWeight:700,cursor:'pointer'}}>
              📁 이미지 업로드
              <input type="file" accept="image/*" style={{display:'none'}} onChange={(e)=>{
                const f = e.target.files && e.target.files[0]; if(!f) return;
                const rd = new FileReader(); rd.onload = () => onChange({ ...d, src:rd.result, alt:f.name }); rd.readAsDataURL(f);
              }}/>
            </label>
          )}
        </Field>
        <Field label="캡션 (선택)"><TextInput value={d.caption} onChange={(v)=>set('caption',v)} multiline rows={2}/></Field>
        <Field label="높이 (px)"><NumberInput value={d.height||240} onChange={(v)=>set('height',v)} min={80} max={800} step={20}/></Field>
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
              </div>
            )}/>
        </Field>
      </div>
    );
  }

  return <div style={{color:'var(--mute)',fontSize:12}}>이 컴포넌트는 캔버스에서 더블클릭으로 직접 편집하세요.</div>;
}

function PropertyPanel({ state, selectedId, onUpdateComp, onProjectUpdate, onDelete, onDuplicate }){
  if(!selectedId){
    // No selection → show popup / project meta
    return (
      <div style={{padding:'18px 18px'}}>
        <div style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',marginBottom:12}}>팝업 설정</div>
        <Field label="프로젝트 제목">
          <TextInput value={state.meta.title} onChange={(v)=>onProjectUpdate({ meta:{...state.meta, title:v}})}/>
        </Field>
        <div style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',margin:'22px 0 12px'}}>푸터</div>
        <Field label="이용 링크 (콤마 구분)">
          <TextInput value={(state.popup.footer.links||[]).join(', ')} onChange={(v)=>onProjectUpdate({ popup:{ ...state.popup, footer:{ ...state.popup.footer, links: v.split(',').map(x=>x.trim()).filter(Boolean)}}})}/>
        </Field>
        <Field label="고객센터 전화번호">
          <TextInput value={state.popup.footer.phone} onChange={(v)=>onProjectUpdate({ popup:{...state.popup, footer:{...state.popup.footer, phone:v}}})}/>
        </Field>
        <Field label="URL">
          <TextInput value={state.popup.footer.url} onChange={(v)=>onProjectUpdate({ popup:{...state.popup, footer:{...state.popup.footer, url:v}}})}/>
        </Field>
        <div style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',margin:'22px 0 12px'}}>옵션</div>
        <Field label=" ">
          <Toggle value={state.popup.dontShowOption} onChange={(v)=>onProjectUpdate({ popup:{...state.popup, dontShowOption:v}})} label="'다시 보지 않기' 체크박스 표시"/>
        </Field>

        <div style={{marginTop:24,padding:'14px 14px',background:'var(--grad-soft)',borderRadius:10,fontSize:12,color:'var(--blue-dark)',lineHeight:1.6}}>
          <b>💡 편집 팁</b>
          <div style={{marginTop:6, color:'#3B4250'}}>
            • 캔버스의 요소를 <b>클릭</b>하면 이 패널에서 편집할 수 있습니다.<br/>
            • <b>더블클릭</b>으로 텍스트를 바로 편집합니다.<br/>
            • <b>드래그</b>로 요소 위치를 변경합니다.<br/>
            • <b>우클릭</b>으로 복제/삭제 메뉴를 엽니다.
          </div>
        </div>
      </div>
    );
  }

  const comp = state.components[selectedId];
  if(!comp) return null;
  const meta = window.COMPONENT_META.find(m => m.type === comp.type);

  return (
    <div style={{padding:'18px 18px',display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,paddingBottom:14,borderBottom:'1px solid var(--line)'}}>
        <div style={{width:34,height:34,borderRadius:8,background:'var(--grad)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>
          {window.Icons[meta?.icon || 'Grid']({size:18})}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:800,color:'var(--ink)'}}>{meta?.label || comp.type}</div>
          <div style={{fontSize:11,color:'var(--mute)'}}>선택된 컴포넌트 편집</div>
        </div>
      </div>

      <div style={{flex:1, minHeight:0, overflowY:'auto', paddingRight:4, marginRight:-4}}>
        <CompEditor comp={comp} onChange={(newData)=>onUpdateComp(comp.id, newData)}/>
      </div>

      <div style={{display:'flex',gap:6,paddingTop:14,borderTop:'1px solid var(--line)',marginTop:10}}>
        <button onClick={()=>onDuplicate(comp.id)}
          style={{flex:1,padding:'8px 10px',border:'1px solid var(--line)',background:'#fff',borderRadius:7,fontSize:12,fontWeight:700,color:'var(--ink)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          {window.Icons.Copy({size:13})} 복제
        </button>
        <button onClick={()=>onDelete(comp.id)}
          style={{flex:1,padding:'8px 10px',border:'1px solid #FFD8E0',background:'#fff',borderRadius:7,fontSize:12,fontWeight:700,color:'var(--danger)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          {window.Icons.Trash({size:13})} 삭제
        </button>
      </div>
    </div>
  );
}
window.PropertyPanel = PropertyPanel;
