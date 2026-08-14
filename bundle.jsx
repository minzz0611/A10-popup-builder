// Simple unique id generator
window.uid = function uid(prefix){
  return (prefix || 'id') + '_' + Math.random().toString(36).slice(2,9);
};

window.deepClone = function deepClone(obj){
  return JSON.parse(JSON.stringify(obj));
};

// Returns the ordered component-id list for whichever screen is currently
// open (hero screen, a section, or a section's sub-tab) — the same list
// both the canvas and the right-side property panel render from.
window.getComponentList = function getComponentList(state, activeSectionId, activeTabId){
  if(activeSectionId === null) return state.heroComponents || [];
  const sec = (state.sidebar||[]).find(s => s.id === activeSectionId);
  if(!sec) return [];
  const tab = activeTabId ? (sec.tabs||[]).find(t => t.id === activeTabId) : null;
  return tab ? (tab.components||[]) : (sec.components || []);
};

// Icon set (inline SVG components)
const IconSvg = ({ path, size = 16, stroke = 'currentColor', fill = 'none', sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const Icons = {
  Plus: (p) => <IconSvg {...p} path="M12 5v14 M5 12h14" />,
  Trash: (p) => <IconSvg {...p} path="M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />,
  Copy: (p) => <IconSvg {...p} path="M9 9h10v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z M5 15V5a2 2 0 0 1 2-2h10" />,
  Save: (p) => <IconSvg {...p} path="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8" />,
  Download: (p) => <IconSvg {...p} path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" />,
  Upload: (p) => <IconSvg {...p} path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />,
  Eye: (p) => <IconSvg {...p} path="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  Edit: (p) => <IconSvg {...p} path="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />,
  Grid: (p) => <IconSvg {...p} path="M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z" />,
  Layers: (p) => <IconSvg {...p} path="M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" />,
  Type: (p) => <IconSvg {...p} path="M4 7V4h16v3 M9 20h6 M12 4v16" />,
  Image: (p) => <IconSvg {...p} path="M3 3h18v18H3z M8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M21 15l-5-5L5 21" />,
  Video: (p) => <IconSvg {...p} path="M23 7l-7 5 7 5V7z M1 5h15v14H1z" />,
  Table: (p) => <IconSvg {...p} path="M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18" />,
  List: (p) => <IconSvg {...p} path="M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01" />,
  Flow: (p) => <IconSvg {...p} path="M6 3h4v4H6z M14 10h4v4h-4z M6 17h4v4H6z M8 7v10 M10 12h4" />,
  Star: (p) => <IconSvg {...p} path="M12 2l3 7 7 .5-5 5 2 7-7-4-7 4 2-7-5-5 7-.5 3-7z" />,
  User: (p) => <IconSvg {...p} path="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  Quote: (p) => <IconSvg {...p} path="M3 21c3-3 3-9 3-9H3v-6h6v6c0 3 0 6-3 9z M15 21c3-3 3-9 3-9h-3v-6h6v6c0 3 0 6-3 9z" />,
  Heading: (p) => <IconSvg {...p} path="M6 4v16 M18 4v16 M6 12h12" />,
  ChevronUp: (p) => <IconSvg {...p} path="M6 15l6-6 6 6" />,
  ChevronDown: (p) => <IconSvg {...p} path="M6 9l6 6 6-6" />,
  X: (p) => <IconSvg {...p} path="M18 6L6 18 M6 6l12 12" />,
  Move: (p) => <IconSvg {...p} path="M5 9l-3 3 3 3 M9 5l3-3 3 3 M15 19l-3 3-3-3 M19 9l3 3-3 3 M2 12h20 M12 2v20" />,
  Settings: (p) => <IconSvg {...p} path="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />,
  Zap: (p) => <IconSvg {...p} path="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  Target: (p) => <IconSvg {...p} path="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  MessageCircle: (p) => <IconSvg {...p} path="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  File: (p) => <IconSvg {...p} path="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />,
  Square: (p) => <IconSvg {...p} path="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />,
};
window.Icons = Icons;

// Start templates. Each template returns a full projectState.

function makeComp(type, data){
  const id = window.uid('c');
  return { id, type, data, style: { spanCols: 12 } };
}

// ---------- Template 1: AI 분석리포트 (원본을 그대로 재현) ----------
function templateAI(){
  const components = {};
  const orderMap = {};
  const add = (screenId, type, data) => {
    const c = makeComp(type, data);
    components[c.id] = c;
    (orderMap[screenId] ||= []).push(c.id);
    return c.id;
  };

  // detail screen -> multiple menu sections
  const sec = {};

  // 1. Intro
  add('sec-intro', 'section-heading', { title:'AI 분석리포트란?', desc:'AI 분석리포트는 ERP의 회계·자금·예산·인사·영업·구매 등 기업 전반의 업무 데이터를 AI가 자동으로 분석하여, 각 업무 담당자 또는 의사결정자의 요구에 맞는 KPI·차트·표를 즉시 구성해 주는 서비스입니다. 복잡한 분석 과정 없이 원하는 데이터 항목만 선택하면 AI 에이전트가 의미 있는 인사이트를 담은 대시보드를 자동으로 생성합니다.' });
  add('sec-intro', 'section-heading', { title:'👥 활용 대상', desc:'업무 담당자부터 경영진까지, 역할에 맞는 맞춤형 인사이트를 제공합니다.' });
  add('sec-intro', 'role-cards', {
    items:[
      {icon:'🧑‍💼',title:'업무 담당자',desc:'자신의 업무 영역(회계·자금·인사·구매 등)에 맞는 데이터 항목을 선택하여 맞춤형 분석리포트를 구성합니다.',bullets:['원가·총계정원장·자금현황 등 담당 데이터 분석','업무 흐름 및 수치 추이 한눈에 파악','생성된 리포트를 수시로 재조회하여 현황 모니터링','리포트 권한 부여로 팀 내 공유 활용']},
      {icon:'📊',title:'의사결정자 (경영진)',desc:'회사 전반의 핵심 지표를 한 화면에서 조망하여 단기·중장기 경영 계획 수립 및 신속한 의사결정을 지원합니다.',bullets:['사원 분포·매출 추이·자금계획 현황 확인','당월·단기·중장기 업무 현황 손쉽게 파악','부서·제품별 비교 분석 및 이상 징후 감지','PDF/문서로 즉시 보고자료 생성']},
    ]
  });

  // 2. Demo
  add('sec-demo', 'section-heading', { title:'서비스 시연 영상', desc:'실제 사용 화면으로 AI 분석리포트의 동작 방식을 확인해 보세요.' });
  add('sec-demo', 'video-cards', { cols:2, items:[
    {tag:'DEMO 01',title:'ERP 데이터 실시간 분석',desc:'ERP 내 회계·자금·인사 등 실데이터를 AI가 실시간으로 분석하여 리포트를 생성하는 과정을 시연합니다.',thumb:''},
    {tag:'DEMO 02',title:'파일 첨부 분석',desc:'엑셀 등 외부 파일을 업로드하면 AI가 해당 데이터를 분석하여 맞춤형 리포트를 자동 구성하는 과정을 시연합니다.',thumb:''},
  ]});

  // 3. Feature
  add('sec-feature', 'section-heading', { title:'✨ 주요 특징', desc:'AI 분석리포트가 제공하는 4가지 핵심 가치' });
  add('sec-feature', 'feature-cards', { cols:2, items:[
    {icon:'🤖',title:'AI 자동 대시보드 생성',desc:'분석할 데이터만 선택하면 AI 에이전트가 데이터 구조를 파악하고, 최적의 KPI·차트·표를 자동으로 구성합니다. 별도의 개발이나 설정 없이 초 단위 내에 완성된 대시보드를 제공합니다.',color:'#2F6BFF'},
    {icon:'🎯',title:'담당자 맞춤형 리포트',desc:'회계·자금·인사·영업·구매 등 모듈별 데이터 항목을 선택 또는 복수 선택하여, 각 업무 담당자에게 꼭 맞는 리포트를 생성합니다. 생성 후에도 항목 추가·수정이 자유롭습니다.',color:'#7B5CFA'},
    {icon:'💬',title:'AI 어시스턴트 대화형 편집',desc:'자연어로 수정 요청을 입력하면 AI가 즉시 대시보드에 반영합니다. "차트를 꺾은선으로 바꿔줘", "매출 추이 카드 추가해줘" 등 직관적인 명령만으로 커스터마이징할 수 있습니다.',color:'#12B886'},
    {icon:'📄',title:'보고서 변환 및 공유',desc:'완성된 분석리포트를 PDF 또는 문서로 변환하여 상위 보고자에게 공유·보고할 수 있습니다. 권한 부여를 통해 여러 담당자가 동일 리포트를 활용하는 것도 지원합니다.',color:'#FF7A45'},
  ]});

  // 4. Process
  add('sec-process', 'section-heading', { title:'🧭 사용 프로세스', desc:'역할에 따라 두 가지 프로세스로 AI 분석리포트를 활용합니다.' });
  add('sec-process', 'process-flow', { tone:'blue', trackLabel:'AI분석리포트 생성 담당자 · 리포트 생성 프로세스', steps:[
    {title:'메뉴 진입',desc:'AI분석리포트 메뉴에서 신규 생성을 선택합니다.'},
    {title:'데이터 선택',desc:'분석할 ERP 모듈 및 데이터 항목을 선택합니다.'},
    {title:'AI 자동 생성',desc:'AI가 KPI·차트·표를 자동으로 생성합니다.'},
    {title:'리포트 확인',desc:'생성된 대시보드와 AI 인사이트를 확인합니다.'},
    {title:'편집/저장',desc:'카드 배치·변경 후 저장합니다.'},
    {title:'권한 배포',desc:'완성된 분석리포트를 임직원에게 배포합니다.'},
  ]});
  add('sec-process', 'process-flow', { tone:'green', trackLabel:'AI분석리포트 사용 임직원 · 분석/활용 프로세스', steps:[
    {title:'리포트 확인',desc:'리포트를 선택하여 진입합니다.'},
    {title:'AI 분석 실행',desc:'조회기간을 설정하여 AI분석을 실행합니다.'},
    {title:'결과 확인',desc:'KPI·차트·표 대시보드를 확인합니다.'},
    {title:'요약 확인',desc:'AI 핵심 인사이트를 검토합니다.'},
    {title:'공유',desc:'PDF/문서로 보고자와 공유합니다.'},
  ]});
  add('sec-process', 'section-heading', { title:'⚡ AI 자동 생성 과정', desc:'"AI로 생성하기" 버튼을 누르면 다음 과정이 자동으로 실행되어 대시보드가 완성됩니다.' });
  add('sec-process', 'numbered-list', { items:[
    {title:'데이터 수집',tag:'',desc:'선택된 분석 대상의 내부 API를 호출하여 원본 데이터(행·열)를 조회합니다. 기존 ERP 메뉴와 동일한 데이터를 그대로 활용합니다.',example:''},
    {title:'대시보드 구성 설계',tag:'AI LLM',desc:'AI가 컬럼 구조와 샘플 데이터를 분석하여 컬럼의 역할(금액·비율·코드·시계열 등)을 분류합니다. 데이터에 최적화된 KPI 카드 3~5개, 차트 카드 3~5개의 구성을 자동으로 결정합니다.',example:'예) 매출액 합계 → KPI, 월별 매출 추이 → 꺾은선 차트'},
    {title:'데이터 정제 로직 생성',tag:'AI LLM',desc:'각 카드에 필요한 데이터를 원본에서 추출·가공하는 로직을 AI가 자동 작성합니다.',example:''},
    {title:'데이터 가공 및 카드 생성',tag:'',desc:'생성된 정제 로직을 실행하여 각 카드의 최종 데이터를 추출하고 화면에 렌더링합니다.',example:''},
    {title:'AI 요약 인사이트 제공',tag:'AI LLM',desc:'대시보드 생성 완료 후 AI가 리포트 데이터를 분석하여 핵심 인사이트와 주요 수치를 자연어로 요약합니다.',example:''},
  ]});

  // 5. Data source
  add('sec-datasource', 'section-heading', { title:'📁 지원 데이터 소스', desc:'현재 아래 ERP 모듈 데이터를 지원하며, 분석 대상은 지속적으로 확장됩니다.' });
  add('sec-datasource', 'table', {
    headers:['모듈','데이터명','설명'],
    rows:[
      ['회계관리','원가보고서','제품매출원가 데이터 — 재료비·노무비·제조경비 항목별 원가 구성 및 당기 합계 분석'],
      ['회계관리','원가보고서 (기간별)','5개년 손익계산서 비교 데이터 — 매출액, 영업이익, 각종 비율 등 재무 성과 종합 분석'],
      ['회계관리','자금현황','자금 계좌별 입금·출금·잔액 현황 및 당일 자금 흐름 분석'],
      ['회계관리','재무상태표','기간 기준 재무상태표 — 자산·부채·자본의 당기/전기 비교 분석'],
      ['물류관리','주문현황','고객사별·품목별 주문 접수 현황 데이터'],
      ['물류관리','출고현황','창고별·품목별 출고 실적 데이터'],
      ['구매관리','발주현황','공급업체별·품목별 발주 현황 데이터'],
      ['구매관리','입고현황','창고별·품목별 입고 실적 데이터'],
    ],
  });
  add('sec-datasource', 'highlight-box', { icon:'📌', title:'분석 대상 확대 예정', body:'분석 대상 메뉴는 인사·영업·생산 등 전 모듈로 지속 확장될 예정입니다.' });

  // Hero screen
  const heroId = window.uid('c');
  components[heroId] = { id:heroId, type:'hero', style:{spanCols:12}, data: window.DEFAULT_DATA.hero() };

  return {
    meta: { title:'Amaranth10 AI 분석리포트 소개', updatedAt: Date.now() },
    popup: { footer:{ links:['이용약관','개인정보처리방침'], phone:'1688-5000', url:'www.douzone.com' }, dontShowOption:true },
    heroComponents: [heroId],
    sidebar: [
      { id:'sec-intro', label:'① 서비스 개요', group:'서비스 개요', components: orderMap['sec-intro']||[] },
      { id:'sec-demo', label:'② 서비스 시연 영상', group:'서비스 시연 영상', components: orderMap['sec-demo']||[] },
      { id:'sec-feature', label:'③ 특장점', group:'특장점', components: orderMap['sec-feature']||[] },
      { id:'sec-process', label:'④ 사용 프로세스', group:'사용 프로세스', components: orderMap['sec-process']||[] },
      { id:'sec-datasource', label:'⑤ 지원 데이터 소스', group:'지원 데이터 소스', components: orderMap['sec-datasource']||[] },
    ],
    components,
    activeSectionId: 'sec-intro',
  };
}

// ---------- Template 2: 간단 안내 (히어로 + 특징 + 표) ----------
function templateSimple(){
  const components = {};
  const hero = makeComp('hero', {
    badge:'서비스 안내', title:'새로운 기능이 출시되었습니다',
    subtitle:'지금 바로 확인해 보세요',
    body:'서비스 소개와 사용 방법을 안내드립니다. 팝업 내용을 자유롭게 수정하여 활용하세요.',
    ctaLabel:'자세히 보기', showCta:true, showImage:false
  });
  const heading = makeComp('section-heading', { title:'주요 기능', desc:'제공하는 핵심 기능을 소개합니다.' });
  const features = makeComp('feature-cards', window.DEFAULT_DATA['feature-cards']());
  const hl = makeComp('highlight-box', { icon:'💡', title:'꼭 알아두세요', body:'문의 사항은 고객센터로 연락 주시기 바랍니다.' });

  components[hero.id]=hero; components[heading.id]=heading; components[features.id]=features; components[hl.id]=hl;

  return {
    meta:{ title:'서비스 안내 팝업', updatedAt: Date.now() },
    popup:{ footer:{ links:['이용약관','개인정보처리방침'], phone:'', url:'' }, dontShowOption:true },
    heroComponents:[hero.id],
    sidebar:[
      { id:'sec-main', label:'서비스 안내', group:'안내', components:[heading.id, features.id, hl.id] },
    ],
    components,
    activeSectionId: 'sec-main',
  };
}

// ---------- Template 3: 빈 팝업 ----------
function templateBlank(){
  const hero = makeComp('hero', {
    badge:'NEW', title:'제목을 입력하세요',
    subtitle:'서브 타이틀',
    body:'팝업에 표시할 내용을 자유롭게 편집할 수 있습니다.',
    ctaLabel:'상세보기', showCta:true, showImage:false
  });
  return {
    meta:{ title:'빈 팝업', updatedAt: Date.now() },
    popup:{ footer:{ links:['이용약관','개인정보처리방침'], phone:'', url:'' }, dontShowOption:true },
    heroComponents:[hero.id],
    sidebar:[
      { id:'sec-main', label:'섹션 1', group:'메뉴', components:[] },
    ],
    components:{ [hero.id]: hero },
    activeSectionId: 'sec-main',
  };
}

// ---------- Template 4: 제품 릴리즈 ----------
function templateRelease(){
  const hero = makeComp('hero', {
    badge:'RELEASE 2026.08', title:'v2.0 업데이트',
    subtitle:'더 빨라진 성능, 새로워진 UI로 만나보세요',
    body:'이번 업데이트에서 개선된 주요 사항과 새로 추가된 기능을 안내드립니다.',
    ctaLabel:'변경사항 보기', showCta:true, showImage:false
  });
  const kpiHead = makeComp('section-heading', { title:'📊 이번 릴리즈 요약', desc:'주요 개선 지표' });
  const kpi = makeComp('kpi-grid', { cols:3, items:[
    {label:'성능 향상',value:'2.5×',delta:'로딩 속도'},
    {label:'신규 기능',value:'12',delta:'개'},
    {label:'해결된 이슈',value:'48',delta:'건'},
  ]});
  const flowHead = makeComp('section-heading', { title:'🚀 업데이트 하는 법', desc:'' });
  const flow = makeComp('process-flow', { tone:'blue', trackLabel:'업데이트 절차', steps:[
    {title:'다운로드',desc:'최신 버전을 다운로드합니다.'},
    {title:'설치',desc:'설치 프로그램을 실행합니다.'},
    {title:'재시작',desc:'프로그램을 재시작합니다.'},
    {title:'확인',desc:'새로운 기능을 확인합니다.'},
  ]});

  const components = {[hero.id]:hero,[kpiHead.id]:kpiHead,[kpi.id]:kpi,[flowHead.id]:flowHead,[flow.id]:flow};
  return {
    meta:{ title:'제품 릴리즈 노트', updatedAt: Date.now() },
    popup:{ footer:{ links:['이용약관','개인정보처리방침'], phone:'', url:'' }, dontShowOption:true },
    heroComponents:[hero.id],
    sidebar:[
      { id:'sec-summary', label:'릴리즈 요약', group:'안내', components:[kpiHead.id, kpi.id] },
      { id:'sec-howto', label:'업데이트 방법', group:'안내', components:[flowHead.id, flow.id] },
    ],
    components,
    activeSectionId: 'sec-summary',
  };
}

window.TEMPLATES = [
  { id:'ai-report', title:'AI 분석리포트 소개', desc:'좌측 사이드메뉴 + 상세 컨텐츠 · 완전한 안내 팝업', tags:['풀 컨텐츠','SaaS','5개 섹션'], build: templateAI, badge:'추천' },
  { id:'simple', title:'간단 안내 팝업', desc:'히어로 + 특징 카드 + 강조 박스 · 짧은 공지에 적합', tags:['간단','공지','3개 블록'], build: templateSimple },
  { id:'release', title:'제품 릴리즈 노트', desc:'KPI + 프로세스 플로우 · 업데이트 안내에 적합', tags:['릴리즈','KPI','2개 섹션'], build: templateRelease },
  { id:'blank', title:'빈 팝업으로 시작', desc:'히어로 하나만 있는 최소 구성 · 자유롭게 채워보세요', tags:['빈 문서','최소'], build: templateBlank },
];

// ============================================================
// Popup component renderers
// Each renderer receives { data, editing, onChange } and returns JSX.
// editing=true → contentEditable + editable image placeholders
// editing=false → pure output (used in preview & final export HTML)
// ============================================================

const { useState: rUseState, useRef: rUseRef, useEffect: rUseEffect } = React;

// ------- hex color -> rgba(...) string, used for the neon glow's translucent shadow -------
function hexToRgba(hex, alpha){
  const h = String(hex||'#1C90FB').replace('#','');
  const full = h.length === 3 ? h.split('').map(c=>c+c).join('') : h;
  const r = parseInt(full.substring(0,2),16) || 0;
  const g = parseInt(full.substring(2,4),16) || 0;
  const b = parseInt(full.substring(4,6),16) || 0;
  return `rgba(${r},${g},${b},${alpha})`;
}

// ------- hex color -> lighter tint (blended toward white), used to derive a
// pale card background from a single picked "theme" color -------
function lightenHex(hex, amount){
  const h = String(hex||'#000000').replace('#','');
  const full = h.length === 3 ? h.split('').map(c=>c+c).join('') : h;
  const r = parseInt(full.substring(0,2),16) || 0;
  const g = parseInt(full.substring(2,4),16) || 0;
  const b = parseInt(full.substring(4,6),16) || 0;
  const mix = (c) => Math.round(c + (255-c)*amount);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

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
    if(e.key === 'Enter'){
      // Enter와 Shift+Enter 모두 줄바꿈을 삽입한다 (모든 컴포넌트 공통).
      // 편집을 끝내려면 다른 곳을 클릭하거나 Esc를 누르면 된다.
      e.preventDefault();
      document.execCommand('insertLineBreak');
    } else if(e.key === 'Escape'){
      e.currentTarget.blur();
    }
  };
  // Prevent React from resetting DOM on every keystroke: use suppressContentEditableWarning
  // white-space:pre-wrap ensures stored \n line breaks actually render as line
  // breaks here — plain HTML tags collapse \n by default, unlike a <textarea>.
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ whiteSpace:'pre-wrap', ...style }}
      contentEditable={!!editing}
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKey}
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
      {d.badge && (
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'var(--grad-soft)',color:'var(--blue-dark)',fontWeight:700,fontSize:11.5,padding:'5px 13px',borderRadius:999,marginBottom:10}}>
          <ET tag="span" value={d.badge} onChange={(v)=>upd('badge',v)} editing={editing}/>
        </div>
      )}
      <ET tag="h1" value={d.title} onChange={(v)=>upd('title',v)} editing={editing}
        style={{fontSize:23,margin:'0 0 7px',fontWeight:800,background:'var(--grad)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}/>
      {d.subtitle && (
        <ET tag="h2" value={d.subtitle} onChange={(v)=>upd('subtitle',v)} editing={editing}
          style={{fontSize:14.5,margin:'0 0 9px',fontWeight:700,color:'var(--ink)'}}/>
      )}
      <ET tag="p" value={d.body} onChange={(v)=>upd('body',v)} editing={editing} multiline
        style={{color:'var(--sub)',fontSize:12.5,lineHeight:1.5,maxWidth:600,margin:'0 auto 14px'}}/>
      {(d.showCta !== false || d.showVideoBtn) && (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginTop:14}}>
          {d.showCta !== false && (
            <button style={{display:'inline-flex',alignItems:'center',gap:8,background:'var(--grad)',color:'#fff',border:'none',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 8px 18px rgba(80,90,255,.26)'}}>
              <ET tag="span" value={d.ctaLabel} onChange={(v)=>upd('ctaLabel',v)} editing={editing}/> &nbsp;›
            </button>
          )}
          {d.showVideoBtn && (
            <button style={{display:'inline-flex',alignItems:'center',gap:7,background:'#fff',color:'var(--blue-dark)',border:'1px solid var(--line)',padding:'9px 18px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>
              <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:16,height:16,borderRadius:'50%',background:'var(--grad-soft)',fontSize:9}}>▶</span>
              <ET tag="span" value={d.videoBtnLabel} onChange={(v)=>upd('videoBtnLabel',v)} editing={editing}/>
            </button>
          )}
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
  const centered = d.align === 'center';
  const upd = (i, k, v) => {
    const items = [...(d.items||[])];
    items[i] = { ...items[i], [k]: v };
    onChange({ ...d, items });
  };
  return (
    <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:16}}>
      {(d.items||[]).map((it,i)=>(
        <div key={i} style={{border:'1px solid var(--line)',borderRadius:14,padding:'18px 18px 16px',position:'relative',overflow:'hidden',background:'#fff',boxShadow:'0 2px 10px rgba(20,30,70,.05)',textAlign: centered ? 'center' : 'left'}}>
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
  const inputRef = rUseRef(null);
  const wrapperRef = rUseRef(null);
  const draggingRef = rUseRef(false);
  const [live, setLive] = rUseState(null); // {width, height} while dragging

  const width = live?.width ?? d.width ?? null; // null = 100% (fill container)
  const height = d.freeAspect ? (live?.height ?? d.height ?? 240) : null;

  // 강조(emphasis) 시 굵기·네온 적용범위는 고정값 — 색상만 바꿀 수 있다.
  // 강조가 켜지면 기본 테두리보다 항상 굵게 보이도록, 기본 테두리는 1~2px로 제한한다.
  const EMPHASIS_BORDER_WIDTH = 3;
  const EMPHASIS_GLOW_SPREAD = 5; // 기존(16px)의 약 1/3
  const emphasisOn = !!d.emphasis?.enabled;
  const borderOn = !!d.border?.enabled;
  const baseBorderWidth = Math.max(1, Math.min(2, d.border?.width || 1));
  const baseBorderColor = d.border?.color || '#E2E2E2';
  const emphasisColor = d.emphasis?.color || '#1C90FB';
  let frameExtra = {};
  if(emphasisOn){
    frameExtra = {
      border: `${EMPHASIS_BORDER_WIDTH}px solid ${emphasisColor}`,
      boxShadow: `0 0 0 1px ${hexToRgba(emphasisColor,.08)}, 0 0 ${EMPHASIS_GLOW_SPREAD}px ${Math.round(EMPHASIS_GLOW_SPREAD/2)}px ${hexToRgba(emphasisColor,.2)}`,
    };
  } else if(borderOn){
    frameExtra = {
      border: `${baseBorderWidth}px solid ${baseBorderColor}`,
      boxShadow: `0 0 4px 1px ${hexToRgba(baseBorderColor,.3)}`,
    };
  }

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    const rd = new FileReader();
    rd.onload = () => onChange({ ...d, src:rd.result, originalSrc:rd.result, alt:f.name, cropInset:{top:0,right:0,bottom:0,left:0} });
    rd.readAsDataURL(f);
  };

  // Drag the corner handle: width-only when the ratio is locked, width+height
  // together once "비율에 맞지 않게 수정" is turned on.
  const handleResizeStart = (e) => {
    e.preventDefault(); e.stopPropagation();
    draggingRef.current = true;
    const rect = wrapperRef.current.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    const startW = rect.width, startH = rect.height;
    document.body.style.cursor = d.freeAspect ? 'nwse-resize' : 'ew-resize';
    const compute = (ev) => {
      const w = Math.max(120, Math.min(900, Math.round(startW + (ev.clientX - startX))));
      if(!d.freeAspect) return { width:w };
      const h = Math.max(60, Math.min(700, Math.round(startH + (ev.clientY - startY))));
      return { width:w, height:h };
    };
    const onMove = (ev) => { if(draggingRef.current) setLive(compute(ev)); };
    const onUp = (ev) => {
      if(draggingRef.current){
        draggingRef.current = false;
        document.body.style.cursor = '';
        onChange({ ...d, ...compute(ev) });
        setLive(null);
      }
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div>
      {d.src ? (
        <div ref={wrapperRef} style={{position:'relative', width: width ? width : '100%', maxWidth:'100%'}}>
          <div style={{borderRadius:12, overflow:'hidden', height: d.freeAspect ? height : 'auto', ...frameExtra}}>
            <img src={d.src} alt={d.alt||''} style={{
              width:'100%',
              height: d.freeAspect ? '100%' : 'auto',
              objectFit: d.freeAspect ? 'fill' : undefined,
              display:'block',
            }}/>
          </div>
          {editing && (
            <>
              <button onClick={(e)=>{e.stopPropagation(); inputRef.current && inputRef.current.click();}}
                style={{position:'absolute',right:8,bottom:8,background:'rgba(20,30,60,.75)',color:'#fff',border:'none',padding:'6px 10px',borderRadius:6,fontSize:11,cursor:'pointer',fontWeight:700}}
              >이미지 변경</button>
              <div onMouseDown={handleResizeStart} title={d.freeAspect ? '드래그하여 가로·세로 크기 조절' : '드래그하여 너비 조절 (비율 유지)'}
                style={{position:'absolute',right:-6,bottom:-6,width:14,height:14,borderRadius:4,background:'var(--blue)',border:'2px solid #fff',boxShadow:'0 1px 4px rgba(0,0,0,.3)',cursor: d.freeAspect ? 'nwse-resize' : 'ew-resize'}}/>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" style={{display:'none'}} onChange={onFile}/>
        </div>
      ) : (
        <EImg src="" editing={editing} onChange={(v)=>onChange({...d, src:v.src, originalSrc:v.src, alt:v.name})}
          style={{width:'100%',height:d.height||240,borderRadius:12}}/>
      )}
      {d.caption && (
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
            <span style={{position:'absolute',top:10,left:10,background:'rgba(255,255,255,.14)',color:'#fff',fontSize:10.5,fontWeight:700,padding:'4px 10px',borderRadius:999,backdropFilter:'blur(4px)',display: it.tag ? 'inline-block' : 'none'}}>
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
  const centered = d.align === 'center';
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
      {(d.items||[]).map((it,i)=>{
        // 테마 색상 하나만 고르면: 카드 배경은 그 색을 흰색과 섞어 연하게, 아이콘 배경은 그 색 그대로(진하게) 사용
        const theme = it.themeColor;
        const cardBg = theme ? lightenHex(theme, .85) : backgrounds[i%backgrounds.length];
        const iconBg = theme || iconBgs[i%iconBgs.length];
        return (
          <div key={i} style={{borderRadius:14,padding:'16px 18px',background:cardBg,border:'1px solid var(--line)',textAlign: centered ? 'center' : 'left'}}>
            <div style={{width:34,height:34,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'#fff',background:iconBg, margin: centered ? `0 auto ${d.iconGap ?? 8}px` : `0 0 ${d.iconGap ?? 8}px`}}>
              <ET tag="span" value={it.icon} onChange={(v)=>upd(i,'icon',v)} editing={editing}/>
            </div>
            <ET tag="b" value={it.title} onChange={(v)=>upd(i,'title',v)} editing={editing} style={{display:'block',fontSize:14,marginBottom: d.titleGap ?? 5}}/>
            <ET tag="p" value={it.desc} onChange={(v)=>upd(i,'desc',v)} editing={editing} multiline style={{margin:`0 0 ${d.descGap ?? 8}px`,fontSize:12,color:'var(--sub)',lineHeight:1.5}}/>
            {/* 불릿 목록은 카드 정렬과 무관하게 항상 좌측 정렬 */}
            <ul style={{margin:0,paddingLeft:15,fontSize:11.5,color:'var(--sub)',lineHeight:1.7,textAlign:'left'}}>
              {(it.bullets||[]).map((b,li)=>(
                <li key={li}>
                  <ET tag="span" value={b} onChange={(v)=>updList(i,li,v)} editing={editing}/>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
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
      {d.desc && (
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
// 13. SHAPE — 텍스트를 담는 도형 (사각형/둥근사각형/알약형) + 앞머리 배지 옵션
// ============================================================
function ShapeBlock({ data, editing, onChange }){
  const d = data;
  const upd = (patch) => onChange({ ...d, ...patch });
  const updBadge = (patch) => onChange({ ...d, badge: { ...(d.badge||{}), ...patch } });

  const radius = d.shapeType === 'pill' ? 999 : d.shapeType === 'rect' ? 0 : 14;
  const centered = d.align === 'center';

  return (
    <div style={{display:'flex', justifyContent: centered ? 'center' : 'flex-start'}}>
      <div style={{
        display:'inline-flex', alignItems:'center', gap:10, maxWidth:'100%',
        padding: d.shapeType === 'pill' ? '10px 22px' : '14px 20px',
        borderRadius: radius,
        background: d.bgColor || '#EFF7FF',
      }}>
        {d.badge?.enabled && (
          <span style={{
            flex:'none', boxSizing:'border-box',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            minWidth:26, height:26, padding:'0 9px',
            borderRadius:999,
            background: d.badge.bgColor || '#1C90FB',
            color: d.badge.textColor || '#fff',
            fontSize:12.5, fontWeight:800, lineHeight:1,
          }}>
            <ET tag="span" value={d.badge.content} onChange={(v)=>updBadge({content:v})} editing={editing} placeholder="1"/>
          </span>
        )}
        <ET tag="span" value={d.text} onChange={(v)=>upd({text:v})} editing={editing} multiline
          placeholder="내용을 입력하세요"
          style={{color: d.textColor || '#1C3050', fontSize:14, fontWeight:600, lineHeight:1.5}}/>
      </div>
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
  'shape': ShapeBlock,
};

window.COMPONENT_META = [
  { type:'hero', label:'표지 (히어로)', icon:'Star', group:'헤더', desc:'배지 · 제목 · CTA · 이미지 · 동영상 버튼', hidden:true },
  { type:'section-heading', label:'섹션 헤딩', icon:'Heading', group:'헤더', desc:'제목과 부연 설명' },
  { type:'kpi-grid', label:'KPI 카드', icon:'Grid', group:'데이터', desc:'수치 지표 카드 그리드' },
  { type:'table', label:'표 / 테이블', icon:'Table', group:'데이터', desc:'행과 열의 데이터' },
  { type:'text-block', label:'일반 텍스트', icon:'Type', group:'컨텐츠', desc:'자유롭게 입력하는 본문 텍스트' },
  { type:'shape', label:'도형 (텍스트 입력)', icon:'Square', group:'컨텐츠', desc:'텍스트를 담는 도형 · 앞머리 배지 옵션' },
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
    badge:'배지 텍스트를 입력하세요', title:'제목을 입력하세요',
    subtitle:'부제목을 입력하세요',
    body:'본문 설명을 입력하세요. 이 영역에는 서비스나 기능에 대한 상세 소개 문구가 들어갑니다.',
    ctaLabel:'버튼 텍스트 입력', showCta:true, showImage:true, image:{ src:'', alt:'', width:640 },
    showVideoBtn:false, videoBtnLabel:'버튼 텍스트 입력',
  }),
  'kpi-grid': () => ({ cols:3, items:[
    {label:'지표명을 입력하세요',value:'수치 값 입력',delta:'증감률 입력'},
    {label:'지표명을 입력하세요',value:'수치 값 입력',delta:'증감률 입력'},
    {label:'지표명을 입력하세요',value:'수치 값 입력',delta:'증감률 입력'},
  ]}),
  'card-grid': () => ({ cols:3, items:[
    {title:'카드 제목을 입력하세요',desc:'카드에 표시할 설명 문구를 입력하세요.',color:'#2882FF',badge:''},
    {title:'카드 제목을 입력하세요',desc:'카드에 표시할 설명 문구를 입력하세요.',color:'#5601FF',badge:''},
    {title:'카드 제목을 입력하세요',desc:'카드에 표시할 설명 문구를 입력하세요.',color:'#1E3282',badge:''},
  ]}),
  'process-flow': () => ({ tone:'blue', trackLabel:'전체 프로세스 흐름을 설명하는 문구를 입력하세요', steps:[
    {title:'단계 제목을 입력하세요',desc:'해당 단계에 대한 설명을 입력하세요.'},
    {title:'단계 제목을 입력하세요',desc:'해당 단계에 대한 설명을 입력하세요.'},
    {title:'단계 제목을 입력하세요',desc:'해당 단계에 대한 설명을 입력하세요.'},
    {title:'단계 제목을 입력하세요',desc:'해당 단계에 대한 설명을 입력하세요.'},
  ]}),
  'numbered-list': () => ({ items:[
    {title:'단계명을 입력하세요',tag:'',desc:'단계에 대한 설명을 입력하세요.',example:''},
    {title:'단계명을 입력하세요',tag:'태그(선택)',desc:'단계에 대한 설명을 입력하세요.',example:'예시 문구(선택)'},
    {title:'단계명을 입력하세요',tag:'',desc:'단계에 대한 설명을 입력하세요.',example:''},
  ]}),
  'feature-cards': () => ({ cols:2, align:'left', items:[
    {icon:'✨',title:'특징 제목을 입력하세요',desc:'특징에 대한 설명을 입력하세요.',color:'#2882FF'},
    {icon:'✨',title:'특징 제목을 입력하세요',desc:'특징에 대한 설명을 입력하세요.',color:'#8947FF'},
    {icon:'✨',title:'특징 제목을 입력하세요',desc:'특징에 대한 설명을 입력하세요.',color:'#B932FF'},
    {icon:'✨',title:'특징 제목을 입력하세요',desc:'특징에 대한 설명을 입력하세요.',color:'#1E3282'},
  ]}),
  'table': () => ({
    headers:['항목명','항목명','설명'],
    rows:[
      ['내용을 입력하세요','내용을 입력하세요','설명을 입력하세요'],
      ['내용을 입력하세요','내용을 입력하세요','설명을 입력하세요'],
      ['내용을 입력하세요','내용을 입력하세요','설명을 입력하세요'],
    ],
  }),
  'image': () => ({ src:'', originalSrc:'', alt:'', caption:'', width:null, height:240, freeAspect:false, cropInset:{top:0,right:0,bottom:0,left:0},
    border:{ enabled:false, color:'#E2E2E2', width:1 },
    emphasis:{ enabled:false, color:'#1C90FB' } }),
  'video-cards': () => ({ cols:2, items:[
    {tag:'태그 입력',title:'영상 제목을 입력하세요',desc:'영상에 대한 설명을 입력하세요.',thumb:''},
    {tag:'태그 입력',title:'영상 제목을 입력하세요',desc:'영상에 대한 설명을 입력하세요.',thumb:''},
  ]}),
  'highlight-box': () => ({ icon:'💡', title:'안내 제목을 입력하세요', body:'강조하고 싶은 내용을 여기에 입력하세요.' }),
  'role-cards': () => ({ align:'left', iconGap:8, titleGap:5, descGap:8, items:[
    {icon:'👤',title:'역할명을 입력하세요',desc:'역할에 대한 설명을 입력하세요.',bullets:['불릿 항목을 입력하세요','불릿 항목을 입력하세요','불릿 항목을 입력하세요']},
    {icon:'👤',title:'역할명을 입력하세요',desc:'역할에 대한 설명을 입력하세요.',bullets:['불릿 항목을 입력하세요','불릿 항목을 입력하세요','불릿 항목을 입력하세요']},
  ]}),
  'section-heading': () => ({ title:'섹션 제목을 입력하세요', desc:'섹션에 대한 부연 설명을 입력하세요.' }),
  'text-block': () => ({ body:'본문 내용을 입력하세요.', align:'left', size:13 }),
  'shape': () => ({
    text:'도형 안에 들어갈 텍스트를 입력하세요', shapeType:'rounded', bgColor:'#C5E1FF', textColor:'#0E1941', align:'left',
    badge:{ enabled:false, content:'1', bgColor:'#2882FF', textColor:'#FFFFFF' },
  }),
};

// Exporter: builds a self-contained HTML file (the final popup) + a JSON edit-state file.
// Uses ReactDOM to render into a hidden DOM, then serializes outerHTML.

// The popup CSS used in the exported HTML (matches the sample file's style)
const POPUP_CSS = `
:root{
  --blue:#2F6BFF;--blue-dark:#1451E0;--purple:#7B5CFA;
  --grad: linear-gradient(90deg,#7B5CFA 0%, #2FA8FF 100%);
  --grad-soft: linear-gradient(90deg,#eef0ff 0%, #eaf6ff 100%);
  --ink:#1B2130;--sub:#5B6472;--mute:#9199A6;--line:#E6E9EF;--panel:#F4F5F7;
  --card:#ffffff;--good:#12B886;--warn:#FF7A45;--danger:#F0416C;
  font-family:"Pretendard","Malgun Gothic","맑은 고딕",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;background:#dfe3ea;color:var(--ink);height:100%;}
.host-page{padding:26px 30px;max-width:1180px;margin:0 auto;color:#9199A6;}
.host-page h4{color:#5B6472;font-size:14px;margin:0 0 10px;}
.host-page .host-block{background:#fff;border:1px solid var(--line);border-radius:12px;height:120px;margin-bottom:14px;}
.overlay{position:fixed;inset:0;background:rgba(12,16,28,.55);z-index:50;display:flex;align-items:center;justify-content:center;padding:20px;}
.stage{max-width:1180px;width:100%;margin:0 auto;}
.window{background:#fff;border-radius:12px;box-shadow:0 20px 50px rgba(20,30,60,.18);overflow:hidden;height:min(700px, 88vh);display:flex;flex-direction:column;}
.modal-shell{position:relative;background:#fff;flex:1;min-height:0;display:flex;flex-direction:column;}
.modal-close{position:absolute;top:18px;right:20px;width:34px;height:34px;border-radius:50%;border:none;background:#F1F2F5;color:#66707F;font-size:18px;cursor:pointer;z-index:5;display:flex;align-items:center;justify-content:center;}
.modal-close:hover{background:#E7E9EE;}
.modal-back{position:absolute;top:18px;left:20px;height:34px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--sub);font-size:12.5px;font-weight:700;cursor:pointer;z-index:5;display:none;align-items:center;gap:5px;padding:0 14px;}
.modal-back:hover{background:var(--panel);}
.modal-back.show{display:flex;}
.screen{flex:1;min-height:0;display:none;flex-direction:column;overflow:hidden;}
.screen.active{display:flex;}
#heroScreen{overflow-y:auto;}
.body-wrap{display:flex;flex:1;min-height:0;border-top:1px solid var(--line);}
.side-nav{width:230px;flex:none;background:var(--panel);padding:22px 14px;border-right:1px solid var(--line);overflow-y:auto;}
.side-nav .grp-title{font-size:12px;color:#9199A6;font-weight:700;padding:8px 10px 4px;letter-spacing:.02em;}
.side-nav button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:none;padding:11px 12px;border-radius:10px;font-size:14.5px;color:var(--sub);cursor:pointer;font-weight:600;margin-bottom:2px;}
.side-nav button:hover{background:#EAECF1;color:var(--ink);}
.side-nav button.active{background:#fff;color:var(--blue-dark);box-shadow:0 2px 8px rgba(30,50,120,.08);}
.nav-submenu{display:none;margin:0 0 6px 12px;padding-left:10px;border-left:1.5px solid var(--line);}
.nav-submenu.active{display:block;}
.nav-submenu button{padding:9px 10px;font-size:13px;gap:8px;}
.content{flex:1;padding:0 44px 20px;min-width:0;overflow-y:auto;min-height:0;}
.panel{display:none;}
.panel.active{display:block;}
.dont-show-bar{flex:none;padding:12px 44px;display:flex;justify-content:flex-end;border-top:1px solid var(--line);}
.dont-show{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--sub);cursor:pointer;user-select:none;}
.dont-show input{width:16px;height:16px;accent-color:var(--blue);cursor:pointer;margin:0;}
.footer-bar{flex:none;border-top:1px solid var(--line);padding:16px 44px;display:flex;justify-content:space-between;align-items:center;color:#9199A6;font-size:12.3px;}
.footer-bar .links span{margin-right:16px;}
.sub-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;}
.sub-tabs button{border:1px solid var(--line);background:#fff;color:var(--sub);font-weight:700;font-size:12.5px;padding:8px 15px;border-radius:999px;cursor:pointer;}
.sub-tabs button.active{background:var(--grad);border-color:transparent;color:#fff;}
.sub-panel{display:none;}
.sub-panel.active{display:block;}
.reopen{position:fixed;bottom:26px;right:26px;background:var(--grad);color:#fff;border:none;padding:13px 20px;border-radius:999px;font-weight:700;font-size:13.5px;box-shadow:0 12px 30px rgba(60,80,255,.3);cursor:pointer;display:none;}
`;

// Render component tree to static markup using ReactDOM
function renderComponentsToHTML(components, order){
  // Create a temporary div, render, get innerHTML
  const tmp = document.createElement('div');
  document.body.appendChild(tmp);
  const root = ReactDOM.createRoot(tmp);

  return new Promise((resolve) => {
    root.render(
      <React.StrictMode>
        <div>
          {order.map(cid => {
            const c = components[cid]; if(!c) return null;
            const R = window.RENDERERS[c.type];
            return (
              <div key={cid} data-comp-type={c.type} style={{marginBottom: c.style?.gapAfter ?? 20}}>
                {c.customHtml
                  ? <div dangerouslySetInnerHTML={{__html: c.customHtml}}/>
                  : <R data={c.data} editing={false} onChange={()=>{}}/>}
              </div>
            );
          })}
        </div>
      </React.StrictMode>
    );
    setTimeout(() => {
      const html = tmp.innerHTML;
      root.unmount();
      document.body.removeChild(tmp);
      resolve(html);
    }, 50);
  });
}

async function buildFinalHtml(state){
  const heroHtml = await renderComponentsToHTML(state.components, state.heroComponents || []);
  const sectionHtmls = {};
  for(const sec of (state.sidebar || [])){
    if(sec.tabs && sec.tabs.length){
      const navMode = sec.navMode || 'top';
      const tabBar = (navMode === 'top' || navMode === 'both')
        ? `<div class="sub-tabs">${sec.tabs.map((t,ti) => (
            `<button class="sub-tab-btn${ti===0?' active':''}" data-sec="${sec.id}" data-subtab="${t.id}" onclick="goSubTab('${sec.id}','${t.id}')">${escapeHtml(t.label)}</button>`
          )).join('')}</div>`
        : '';
      let panels = '';
      for(let ti = 0; ti < sec.tabs.length; ti++){
        const t = sec.tabs[ti];
        const inner = await renderComponentsToHTML(state.components, t.components || []);
        panels += `<div class="sub-panel${ti===0?' active':''}" id="subpanel-${sec.id}-${t.id}">${inner}</div>`;
      }
      sectionHtmls[sec.id] = tabBar + panels;
    } else {
      sectionHtmls[sec.id] = await renderComponentsToHTML(state.components, sec.components || []);
    }
  }

  // Group sidebar into groups
  const sidebar = state.sidebar || [];
  const grouped = {};
  sidebar.forEach(s => (grouped[s.group||'메뉴'] ||= []).push(s));

  const sidebarHtml = Object.keys(grouped).map(g => {
    const items = grouped[g].map((s,i) => {
      const isFirst = i===0 && g===Object.keys(grouped)[0];
      const btn = `<button class="nav-btn${isFirst ? ' active' : ''}" data-panel="${s.id}" onclick="goPanel('${s.id}')">${escapeHtml(s.label)}</button>`;
      const navMode = s.navMode || 'top';
      const showSubmenu = s.tabs && s.tabs.length && (navMode === 'toc' || navMode === 'both');
      const submenu = showSubmenu
        ? `<div class="nav-submenu${isFirst ? ' active' : ''}" data-parent="${s.id}">${s.tabs.map((t,ti) => (
            `<button class="${ti===0?'active':''}" data-sec="${s.id}" data-subtab="${t.id}" onclick="goPanelSubTab('${s.id}','${t.id}')">${escapeHtml(t.label)}</button>`
          )).join('')}</div>`
        : '';
      return btn + submenu;
    }).join('');
    return `<div class="grp-title">${escapeHtml(g)}</div>${items}`;
  }).join('');

  const panelsHtml = sidebar.map((s,i) => (
    `<section class="panel${i===0 ? ' active' : ''}" id="panel-${s.id}">${sectionHtmls[s.id]||''}</section>`
  )).join('');

  const footer = state.popup?.footer || {};
  const dontShow = state.popup?.dontShowOption !== false;
  const topGap = state.popup?.topGap ?? 30; // 상세 화면 콘텐츠 맨 위, 첫 컴포넌트 앞 여백
  const windowHeight = state.popup?.windowHeight ?? 700; // 표지·상세 화면이 공유하는 팝업 창 높이
  const linksHtml = (footer.links||[]).map(l => `<span>${escapeHtml(l)}</span>`).join('');
  const phoneHtml = footer.phone ? `전국 어디서나 <b>${escapeHtml(footer.phone)}</b>` : '';
  const urlHtml = footer.url ? escapeHtml(footer.url) : '';
  const separator = phoneHtml && urlHtml ? ' &nbsp;|&nbsp; ' : '';

  const hasDetail = sidebar.length > 0;

  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(state.meta?.title || '안내 팝업')}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${POPUP_CSS}</style>
<style>.window{height:min(${windowHeight}px, 88vh);}</style>
</head>
<body>
<div class="host-page">
  <h4>${escapeHtml(state.meta?.title || '안내 팝업')}</h4>
  <div class="host-block"></div>
  <div class="host-block"></div>
  <div class="host-block"></div>
</div>

<div class="overlay" id="overlay">
<div class="stage">
  <div class="window" id="window">
    <div class="modal-shell" id="modalShell">
      <button class="modal-close" onclick="closeModal()">&#10005;</button>
      ${hasDetail ? `<button class="modal-back" id="backBtn" onclick="showHero()">&#8249; 처음으로</button>` : ''}

      <div class="screen active" id="heroScreen">
        ${heroHtml}
      </div>

      ${hasDetail ? `
      <div class="screen" id="detailScreen">
        <div class="body-wrap">
          <nav class="side-nav">${sidebarHtml}</nav>
          <div class="content"><div style="height:${topGap}px"></div>${panelsHtml}</div>
        </div>
      </div>` : ''}

      ${dontShow ? `<div class="dont-show-bar">
        <label class="dont-show" for="dontShowChk">
          <input type="checkbox" id="dontShowChk" onchange="onDontShowChange(this.checked)">
          다시 보지 않기
        </label>
      </div>` : ''}

      <div class="footer-bar">
        <div class="links">${linksHtml}</div>
        <div>${phoneHtml}${separator}${urlHtml}</div>
      </div>
    </div>
  </div>
</div>
</div>

<button class="reopen" id="reopenBtn" onclick="reopenModal()">${escapeHtml(state.meta?.title || '팝업')} 다시 보기</button>

<script>
function goPanel(id){
  document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('active');});
  var t = document.getElementById('panel-'+id); if(t) t.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.remove('active');});
  var b = document.querySelector('.nav-btn[data-panel="'+id+'"]'); if(b) b.classList.add('active');
  document.querySelectorAll('.nav-submenu').forEach(function(sm){sm.classList.remove('active');});
  var sm = document.querySelector('.nav-submenu[data-parent="'+id+'"]'); if(sm) sm.classList.add('active');
  var c = document.querySelector('#detailScreen .content'); if(c) c.scrollTop = 0;
}
function goSubTab(secId, tabId){
  var scope = document.getElementById('panel-'+secId); if(!scope) return;
  scope.querySelectorAll('.sub-panel').forEach(function(p){p.classList.remove('active');});
  var t = document.getElementById('subpanel-'+secId+'-'+tabId); if(t) t.classList.add('active');
  scope.querySelectorAll('.sub-tab-btn').forEach(function(b){b.classList.remove('active');});
  scope.querySelectorAll('[data-subtab="'+tabId+'"]').forEach(function(b){b.classList.add('active');});
  // keep the sidebar's nested submenu (하위 뎁스), if present, in sync too
  var sm = document.querySelector('.nav-submenu[data-parent="'+secId+'"]');
  if(sm){
    sm.querySelectorAll('button').forEach(function(b){b.classList.remove('active');});
    var sb = sm.querySelector('[data-subtab="'+tabId+'"]'); if(sb) sb.classList.add('active');
  }
}
function goPanelSubTab(secId, tabId){
  goPanel(secId);
  goSubTab(secId, tabId);
}
function showDetail(){
  document.getElementById('heroScreen').classList.remove('active');
  var d = document.getElementById('detailScreen'); if(d) d.classList.add('active');
  var bk = document.getElementById('backBtn'); if(bk) bk.classList.add('show');
}
function showHero(){
  var d = document.getElementById('detailScreen'); if(d) d.classList.remove('active');
  document.getElementById('heroScreen').classList.add('active');
  var bk = document.getElementById('backBtn'); if(bk) bk.classList.remove('show');
}
function closeModal(){
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('reopenBtn').style.display = 'inline-flex';
}
function reopenModal(){
  document.getElementById('overlay').style.display = 'flex';
  document.getElementById('reopenBtn').style.display = 'none';
  showHero();
}
var DONT_SHOW_KEY = 'popbuilder_${(state.meta?.title||'popup').replace(/[^a-z0-9]/gi,'_')}_dont_show';
function onDontShowChange(checked){
  if(checked){ localStorage.setItem(DONT_SHOW_KEY,'1'); } else { localStorage.removeItem(DONT_SHOW_KEY); }
}
(function(){
  if(localStorage.getItem(DONT_SHOW_KEY)==='1'){
    var chk = document.getElementById('dontShowChk'); if(chk) chk.checked = true;
    closeModal();
  }
  // Wire hero CTA button (first button in hero screen) to show detail if detail exists
  ${hasDetail ? `
  var heroBtns = document.querySelectorAll('#heroScreen button');
  heroBtns.forEach(function(b){ b.addEventListener('click', function(e){ e.preventDefault(); showDetail(); }); });
  ` : ''}
})();
</script>
</body>
</html>`;
  return html;
}

function escapeHtml(s){
  if(s == null) return '';
  return String(s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

async function downloadZipBundle(state){
  if(!window.JSZip){ alert('압축 라이브러리를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'); return; }
  const zip = new window.JSZip();
  const html = await buildFinalHtml(state);
  const meta = {
    ...state,
    meta: { ...state.meta, exportedAt: new Date().toISOString() },
  };
  const jsonContent = JSON.stringify(meta, null, 2);
  const safeName = (state.meta?.title || 'popup').replace(/[^a-z0-9가-힣_\- ]/gi,'').replace(/\s+/g,'_') || 'popup';

  const readme = `# ${state.meta?.title || '팝업'} · PopBuilder 내보내기

이 ZIP 파일에는 두 개의 파일이 들어있습니다:

1. **${safeName}.html** — 최종 결과물 팝업 파일
   - 브라우저에서 바로 열어보거나, 실제 서비스에 삽입하여 사용할 수 있습니다.
   - 편집 UI는 포함되어 있지 않습니다.

2. **${safeName}.편집상태.json** — 재편집용 데이터 파일
   - PopBuilder에 다시 업로드하면 편집을 이어서 진행할 수 있습니다.
   - 이 파일이 있어야 나중에 컴포넌트 추가·수정·순서 변경이 가능합니다.

내보낸 시각: ${new Date().toLocaleString('ko-KR')}
`;

  zip.file(safeName + '.html', html);
  zip.file(safeName + '.편집상태.json', jsonContent);
  zip.file('README.txt', readme);

  const blob = await zip.generateAsync({ type:'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = safeName + '.zip';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

window.downloadZipBundle = downloadZipBundle;
window.buildFinalHtml = buildFinalHtml;

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

// Shown when a JSON edit-state file is loaded while a project is already
// open. Lets the person either fully replace the current project (old
// behavior) or pick specific pages (표지/섹션) to bring into it instead.
const { useState: iUseState } = React;

function ImportModal({ source, onCancel, onReplace, onImport }){
  const pages = [];
  if((source.heroComponents||[]).length){
    pages.push({ key:'hero', label:'표지 (히어로 화면) — 선택 시 현재 표지를 교체', icon:'🏠' });
  }
  (source.sidebar||[]).forEach(sec => {
    const tabCount = sec.tabs?.length || 0;
    pages.push({
      key:'sec:'+sec.id,
      label: sec.label + (tabCount ? ` (하위 탭 ${tabCount}개 포함)` : ''),
      icon: sec.kind === 'cover' ? '🖼️' : '📄',
    });
  });

  const [checked, setChecked] = iUseState(() => {
    const init = {};
    pages.forEach(p => { init[p.key] = true; });
    return init;
  });

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const selectedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(20,25,40,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}
      onClick={onCancel}>
      <div style={{width:440,maxHeight:'80vh',display:'flex',flexDirection:'column',background:'#fff',borderRadius:14,boxShadow:'var(--shadow-lg)',overflow:'hidden'}}
        onClick={(e)=>e.stopPropagation()}>
        <div style={{padding:'18px 20px 14px',borderBottom:'1px solid var(--line)'}}>
          <div style={{fontSize:15,fontWeight:800,color:'var(--ink)'}}>JSON 파일 불러오기</div>
          <div style={{fontSize:12,color:'var(--mute)',marginTop:4}}>
            "{source.meta?.title || '제목 없음'}"에서 가져올 방식을 선택하세요.
          </div>
        </div>

        <div style={{flex:1,minHeight:0,overflowY:'auto',padding:'14px 20px'}}>
          {pages.length === 0 ? (
            <div style={{padding:'20px 0',textAlign:'center',color:'var(--mute)',fontSize:12.5}}>이 파일에는 가져올 페이지가 없습니다.</div>
          ) : (
            <>
              <div style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',marginBottom:8}}>
                선택한 페이지만 가져오기
              </div>
              {pages.map(p => (
                <label key={p.key}
                  style={{display:'flex',alignItems:'center',gap:10,padding:'9px 10px',border:'1px solid var(--line)',borderRadius:9,marginBottom:6,cursor:'pointer',background: checked[p.key] ? 'var(--grad-soft)' : '#fff'}}>
                  <input type="checkbox" checked={!!checked[p.key]} onChange={()=>toggle(p.key)}
                    style={{width:16,height:16,accentColor:'var(--blue)',margin:0,flex:'none'}}/>
                  <span style={{flex:'none'}}>{p.icon}</span>
                  <span style={{flex:1,minWidth:0,fontSize:12.5,fontWeight:700,color:'var(--ink)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.label}</span>
                </label>
              ))}
              <div style={{fontSize:11,color:'var(--mute)',marginTop:6,lineHeight:1.5}}>
                선택한 섹션은 현재 프로젝트 목차 맨 아래에 새로운 항목으로 추가됩니다. 표지를 선택하면 현재 표지 내용이 교체됩니다. 기존 섹션 내용은 지워지지 않습니다.
              </div>
            </>
          )}
        </div>

        <div style={{padding:'14px 20px',borderTop:'1px solid var(--line)',display:'flex',flexDirection:'column',gap:8}}>
          <button onClick={()=>onImport(pages.filter(p=>checked[p.key]).map(p=>p.key))}
            disabled={pages.length===0 || selectedCount===0}
            style={{width:'100%',padding:'10px',border:'none',borderRadius:9,background: (pages.length===0||selectedCount===0) ? 'var(--mute)' : 'var(--grad)',color:'#fff',fontSize:13,fontWeight:700,cursor: (pages.length===0||selectedCount===0) ? 'default' : 'pointer'}}>
            선택한 페이지 가져오기 ({selectedCount})
          </button>
          <button onClick={onReplace}
            style={{width:'100%',padding:'10px',border:'1px solid var(--line)',borderRadius:9,background:'#fff',color:'var(--ink)',fontSize:13,fontWeight:700,cursor:'pointer'}}>
            전체 교체 (현재 프로젝트 덮어쓰기)
          </button>
          <button onClick={onCancel}
            style={{width:'100%',padding:'8px',border:'none',background:'transparent',color:'var(--mute)',fontSize:12.5,fontWeight:600,cursor:'pointer'}}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

window.ImportModal = ImportModal;

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
  const ref = React.useRef(null);
  const resize = () => {
    const el = ref.current;
    if(!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };
  // 내용이 바뀔 때마다(불러온 데이터 포함) 높이를 다시 계산해서, 내용이
  // 다 보이도록 늘어나고 내부 스크롤은 생기지 않게 한다.
  React.useEffect(() => { resize(); }, [value]);
  return <textarea ref={ref} style={{...inputStyle, resize:'none', overflow:'hidden', minHeight: (multiline ? rows : 1.6) * 20}}
    rows={multiline ? rows : 1}
    value={value||''} placeholder={placeholder}
    onChange={(e)=>onChange(e.target.value)}
    onInput={resize} />;
}

function NumberInput({ value, onChange, min, max, step=1 }){
  return <input type="number" style={inputStyle} value={value||''} min={min} max={max} step={step}
    onChange={(e)=>onChange(Number(e.target.value))}/>;
}

// ------- Design-system color palette (from user-provided palette sheets) -------
window.DESIGN_PALETTE = [
  { group:'Gray 1', colors:[
    { name:'Gray1 01', hex:'#FFFFFF' }, { name:'Gray1 02', hex:'#F2F2F2' },
    { name:'Gray1 03', hex:'#D8D8D8' }, { name:'Gray1 04', hex:'#BFBFBF' },
    { name:'Gray1 05', hex:'#A5A5A5' }, { name:'Gray1 06', hex:'#7F7F7F' },
  ]},
  { group:'Gray 2', colors:[
    { name:'Gray2 01', hex:'#000000' }, { name:'Gray2 02', hex:'#7F7F7F' },
    { name:'Gray2 03', hex:'#595959' }, { name:'Gray2 04', hex:'#3F3F3F' },
    { name:'Gray2 05', hex:'#262626' }, { name:'Gray2 06', hex:'#0C0C0C' },
  ]},
  { group:'Blue 1', colors:[
    { name:'Blue1 01', hex:'#C5E1FF' }, { name:'Blue1 02', hex:'#97C9FE' },
    { name:'Blue1 03', hex:'#53A6FF' }, { name:'Blue1 04', hex:'#006DE2' },
    { name:'Blue1 05', hex:'#003671' }, { name:'Blue1 06', hex:'#00152D' },
  ]},
  { group:'Blue 2', colors:[
    { name:'Blue2 01', hex:'#5DAEFF' }, { name:'Blue2 02', hex:'#DEEEFF' },
    { name:'Blue2 03', hex:'#BEDEFF' }, { name:'Blue2 04', hex:'#9DCEFF' },
    { name:'Blue2 05', hex:'#0582FF' }, { name:'Blue2 06', hex:'#0057AE' },
  ]},
  { group:'Blue 3', colors:[
    { name:'Blue3 01', hex:'#2882FF' }, { name:'Blue3 02', hex:'#D4E6FF' },
    { name:'Blue3 03', hex:'#A9CDFE' }, { name:'Blue3 04', hex:'#7DB4FF' },
    { name:'Blue3 05', hex:'#005CDD' }, { name:'Blue3 06', hex:'#003D93' },
  ]},
  { group:'Indigo', colors:[
    { name:'Indigo 01', hex:'#374BFF' }, { name:'Indigo 02', hex:'#D7DBFF' },
    { name:'Indigo 03', hex:'#AFB7FF' }, { name:'Indigo 04', hex:'#8793FF' },
    { name:'Indigo 05', hex:'#0017E8' }, { name:'Indigo 06', hex:'#000F9B' },
  ]},
  { group:'Navy', colors:[
    { name:'Navy 01', hex:'#1E3282' }, { name:'Navy 02', hex:'#C6CEF1' },
    { name:'Navy 03', hex:'#8D9EE4' }, { name:'Navy 04', hex:'#546ED7' },
    { name:'Navy 05', hex:'#162561' }, { name:'Navy 06', hex:'#0E1941' },
  ]},
  { group:'Purple 1', colors:[
    { name:'Purple1 01', hex:'#5601FF' }, { name:'Purple1 02', hex:'#DDCCFF' },
    { name:'Purple1 03', hex:'#BB99FF' }, { name:'Purple1 04', hex:'#9966FF' },
    { name:'Purple1 05', hex:'#4000C0' }, { name:'Purple1 06', hex:'#2A0080' },
  ]},
  { group:'Purple 2', colors:[
    { name:'Purple2 01', hex:'#8947FF' }, { name:'Purple2 02', hex:'#E7DAFE' },
    { name:'Purple2 03', hex:'#CFB5FF' }, { name:'Purple2 04', hex:'#B890FF' },
    { name:'Purple2 05', hex:'#5700F4' }, { name:'Purple2 06', hex:'#3A00A3' },
  ]},
  { group:'Magenta', colors:[
    { name:'Magenta 01', hex:'#B932FF' }, { name:'Magenta 02', hex:'#F1D6FF' },
    { name:'Magenta 03', hex:'#E3ADFF' }, { name:'Magenta 04', hex:'#D583FF' },
    { name:'Magenta 05', hex:'#9600E4' }, { name:'Magenta 06', hex:'#640098' },
  ]},
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
  const [coords, setCoords] = pUseState(null); // {top,left,width,maxHeight} - fixed-position, computed from the trigger button
  const wrapRef = React.useRef(null);
  const btnRef = React.useRef(null);
  const panelRef = React.useRef(null);

  const computeCoords = () => {
    const btn = btnRef.current;
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const panelWidth = 320;
    let left = rect.left;
    if(left + panelWidth > window.innerWidth - 8) left = Math.max(8, window.innerWidth - panelWidth - 8);
    const spaceBelow = window.innerHeight - rect.bottom - 14;
    const spaceAbove = rect.top - 14;
    let top, maxHeight;
    if(spaceBelow < 260 && spaceAbove > spaceBelow){
      maxHeight = Math.min(520, spaceAbove);
      top = Math.max(8, rect.top - 6 - maxHeight);
    } else {
      maxHeight = Math.min(520, Math.max(200, spaceBelow));
      top = rect.bottom + 6;
    }
    setCoords({ top, left, width: panelWidth, maxHeight });
  };

  React.useEffect(()=>{
    if(!open) return;
    computeCoords();
    const onDoc = (e) => {
      if(wrapRef.current && wrapRef.current.contains(e.target)) return;
      if(panelRef.current && panelRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onReposition = () => computeCoords();
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('scroll', onReposition, true);
    window.addEventListener('resize', onReposition);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('scroll', onReposition, true);
      window.removeEventListener('resize', onReposition);
    };
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

  const panel = (open && coords) ? ReactDOM.createPortal(
    <div ref={panelRef} style={{position:'fixed',zIndex:9999,top:coords.top,left:coords.left,width:coords.width,maxHeight:coords.maxHeight,overflowY:'auto',background:'#fff',border:'1px solid var(--line)',borderRadius:10,boxShadow:'0 12px 30px rgba(20,30,60,.18)',padding:'10px 10px 10px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2px 12px'}}>
        {window.DESIGN_PALETTE.map(g => (
          <div key={g.group} style={{marginBottom:8}}>
            <div style={{fontSize:9.5,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.03em',marginBottom:4}}>{g.group}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
              {g.colors.map(c => (
                <button key={c.name} type="button" title={`${c.name} · ${c.hex}`}
                  onClick={()=>{ onChange(c.hex); setOpen(false); }}
                  style={{flex:'none',width:18,height:18,borderRadius:4,padding:0,cursor:'pointer',background:c.hex,border: (value||'').toLowerCase()===c.hex.toLowerCase() ? '2px solid #1B2130' : '1px solid rgba(0,0,0,.1)'}}/>
              ))}
            </div>
          </div>
        ))}
      </div>
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
    </div>,
    document.body
  ) : null;

  return (
    <div ref={wrapRef} style={{position:'relative'}}>
      <button ref={btnRef} onClick={()=>setOpen(o=>!o)} type="button"
        style={{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'7px 10px',border:'1px solid var(--line)',borderRadius:7,background:'#fff',cursor:'pointer'}}>
        <span style={{width:18,height:18,borderRadius:5,flex:'none',background:value||'#fff',border:'1px solid rgba(0,0,0,.12)'}}/>
        <span style={{fontSize:12.5,color:'var(--ink)',fontWeight:600,flex:1,textAlign:'left',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
          {current ? current.name : (value || '색상 선택')}
        </span>
        <span style={{fontSize:10.5,color:'var(--mute)'}}>{value||''}</span>
      </button>
      {panel}
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
        <Field label=" "><Toggle value={d.align==='center'} onChange={(v)=>set('align', v?'center':'left')} label="카드 내용 가운데 정렬"/></Field>
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
                  <input type="range" min={1} max={2} step={1}
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

  if(t === 'shape'){
    return (
      <div>
        <Field label="내용"><TextInput value={d.text} onChange={(v)=>set('text',v)} multiline rows={2}/></Field>
        <Field label="도형 형태">
          <Segmented value={d.shapeType||'rounded'} onChange={(v)=>set('shapeType',v)}
            options={[{value:'rect',label:'사각형'},{value:'rounded',label:'둥근 사각형'},{value:'pill',label:'알약형'}]}/>
        </Field>
        <Field label="배경 색상"><ColorPicker value={d.bgColor} onChange={(hex)=>set('bgColor',hex)}/></Field>
        <Field label="텍스트 색상"><ColorPicker value={d.textColor} onChange={(hex)=>set('textColor',hex)}/></Field>
        <Field label=" "><Toggle value={d.align==='center'} onChange={(v)=>set('align', v?'center':'left')} label="컴포넌트 가운데 정렬"/></Field>

        <div style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',margin:'14px 0 8px'}}>앞머리 배지</div>
        <Field label=" ">
          <Toggle value={!!d.badge?.enabled} onChange={(v)=>onChange({...d, badge:{...(d.badge||{}), enabled:v}})} label="도형 앞에 배지 추가"/>
        </Field>
        {d.badge?.enabled && (
          <>
            <Field label="배지 내용" hint="숫자·아이콘·기호·텍스트 모두 가능하며, 길이에 따라 너비가 자동으로 늘어나요.">
              <TextInput value={d.badge?.content} onChange={(v)=>onChange({...d, badge:{...(d.badge||{}), content:v}})} placeholder="1"/>
            </Field>
            <Field label="배지 배경 색상">
              <ColorPicker value={d.badge?.bgColor} onChange={(hex)=>onChange({...d, badge:{...(d.badge||{}), bgColor:hex}})}/>
            </Field>
            <Field label="배지 텍스트 색상">
              <ColorPicker value={d.badge?.textColor} onChange={(hex)=>onChange({...d, badge:{...(d.badge||{}), textColor:hex}})}/>
            </Field>
          </>
        )}
      </div>
    );
  }

  if(t === 'role-cards'){
    return (
      <div>
        <Field label=" "><Toggle value={d.align==='center'} onChange={(v)=>set('align', v?'center':'left')} label="카드 내용 가운데 정렬"/></Field>
        <div style={{fontSize:10.5,color:'var(--mute)',marginBottom:8,lineHeight:1.5}}>불릿 항목은 가운데 정렬을 켜도 항상 왼쪽 정렬로 표시돼요.</div>

        <div style={{fontSize:11,color:'var(--mute)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',margin:'4px 0 6px'}}>카드 내부 간격</div>
        <div style={{fontSize:10.5,color:'var(--mute)',marginBottom:8,lineHeight:1.5}}>카드마다 따로 조절할 수는 없고, 모든 역할 카드에 동일하게 적용돼요 (통일성 유지).</div>
        <Field label={`아이콘 - 제목 (${d.iconGap ?? 8}px)`}>
          <input type="range" min={0} max={30} step={1} value={d.iconGap ?? 8} onChange={(e)=>set('iconGap', Number(e.target.value))} style={{width:'100%'}}/>
        </Field>
        <Field label={`제목 - 설명 (${d.titleGap ?? 5}px)`}>
          <input type="range" min={0} max={30} step={1} value={d.titleGap ?? 5} onChange={(e)=>set('titleGap', Number(e.target.value))} style={{width:'100%'}}/>
        </Field>
        <Field label={`설명 - 불릿 목록 (${d.descGap ?? 8}px)`}>
          <input type="range" min={0} max={30} step={1} value={d.descGap ?? 8} onChange={(e)=>set('descGap', Number(e.target.value))} style={{width:'100%'}}/>
        </Field>

        <Field label="역할 카드">
          <ArrayEditor items={d.items} onChange={(v)=>set('items',v)} itemLabel="역할" maxItems={3}
            defaultItem={{icon:'👤',title:'역할',desc:'설명',bullets:['항목 1','항목 2']}}
            renderItem={(it,upd)=>(
              <div style={{display:'grid',gap:6}}>
                <TextInput value={it.icon} onChange={(v)=>upd({icon:v})} placeholder="아이콘"/>
                <TextInput value={it.title} onChange={(v)=>upd({title:v})} placeholder="역할명"/>
                <TextInput value={it.desc} onChange={(v)=>upd({desc:v})} multiline placeholder="설명"/>

                <div style={{fontSize:11,color:'var(--mute)',marginTop:2}}>불릿 항목</div>
                {(it.bullets||[]).map((b, bi) => (
                  <div key={bi} style={{display:'flex',gap:4,alignItems:'center'}}>
                    <div style={{flex:1}}>
                      <TextInput value={b} placeholder={`항목 ${bi+1}`}
                        onChange={(v)=>{ const bullets=[...(it.bullets||[])]; bullets[bi]=v; upd({bullets}); }}/>
                    </div>
                    <button type="button" onClick={()=>{ const bullets=(it.bullets||[]).filter((_,idx)=>idx!==bi); upd({bullets}); }}
                      style={{flex:'none',width:26,height:26,border:'1px solid var(--line)',borderRadius:6,background:'#fff',color:'var(--danger)',cursor:'pointer',fontSize:12}}>✕</button>
                  </div>
                ))}
                <button type="button" onClick={()=>upd({bullets:[...(it.bullets||[]), '']})}
                  style={{padding:'6px 8px',border:'1px dashed var(--line)',borderRadius:7,background:'#fff',fontSize:11,fontWeight:700,color:'var(--blue-dark)',cursor:'pointer'}}>
                  + 불릿 항목 추가
                </button>

                <div style={{fontSize:11,color:'var(--mute)',marginTop:6}}>테마 색상</div>
                <div style={{fontSize:10.5,color:'var(--mute)',marginBottom:2,lineHeight:1.5}}>색을 하나 고르면 카드 배경은 연하게, 아이콘 배경은 그 색 그대로 진하게 적용돼요.</div>
                <ColorPicker value={it.themeColor} onChange={(hex)=>upd({themeColor:hex})}/>
                {it.themeColor && (
                  <button type="button" onClick={()=>upd({themeColor:''})}
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

function PropertyPanel({ state, selectedId, activeSectionId, activeTabId, onSelect, onUpdateComp, onUpdateStyle, onUpdateCustomHtml, editorMode, onProjectUpdate, onDelete, onDuplicate, isProtected }){
  const [showPopupSettings, setShowPopupSettings] = pUseState(false);

  const componentList = window.getComponentList(state, activeSectionId, activeTabId);
  const itemRefs = React.useRef({});
  React.useEffect(() => {
    if(selectedId && itemRefs.current[selectedId]){
      itemRefs.current[selectedId].scrollIntoView({ block:'nearest', behavior:'smooth' });
    }
  }, [selectedId]);
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
            <div key={cid} ref={(el)=>{ itemRefs.current[cid]=el; }} style={{marginBottom:6,border:'1px solid var(--line)',borderRadius:10,overflow:'hidden',background: expanded ? '#fff' : '#FAFBFC', boxShadow: expanded ? '0 2px 8px rgba(30,50,120,.06)' : 'none'}}>
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
                    {(editorMode === 'html' && !locked) ? (
                      <div>
                        <textarea
                          value={comp.customHtml||''}
                          onChange={(e)=>onUpdateCustomHtml && onUpdateCustomHtml(comp.id, e.target.value)}
                          placeholder="<div>여기에 HTML 코드를 입력하세요</div>"
                          rows={8}
                          style={{width:'100%',padding:'8px 10px',border:'1px solid var(--line)',borderRadius:7,fontSize:11.5,fontFamily:'monospace',color:'var(--ink)',resize:'vertical',boxSizing:'border-box'}}/>
                        <div style={{fontSize:10.5,color:'var(--mute)',marginTop:5,lineHeight:1.5}}>
                          비워두면 구조화된 내용이 그대로 사용되고, 입력하면 이 HTML이 대신 렌더링돼요.
                        </div>
                      </div>
                    ) : (
                      <CompEditor comp={comp} onChange={(newData)=>onUpdateComp(comp.id, newData)}/>
                    )}
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
          {c.customHtml
            ? <div dangerouslySetInnerHTML={{__html: c.customHtml}}/>
            : <R data={c.data} editing={editing} onChange={(newData)=>onUpdateComp(cid, newData)}/>}
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

// Top toolbar - title, save/load/download/preview
const { useState: tUseState, useRef: tUseRef } = React;

function Toolbar({ state, onTitleChange, onSave, onDownload, onImportJson, onOpenPreview, onNewProject, onGoHome, onUpdateWindowHeight, editorMode, onSetEditorMode, savedIndicator, canUndo, canRedo, onUndo, onRedo }){
  const fileRef = tUseRef(null);
  const [savedLabel, setSavedLabel] = tUseState('');
  const [showHeightPopover, setShowHeightPopover] = tUseState(false);
  const windowHeight = state.popup?.windowHeight ?? 700;
  const [draftHeight, setDraftHeight] = tUseState(windowHeight);

  // 팝오버를 열 때마다 현재 저장된 값으로 임시 입력값을 초기화
  React.useEffect(()=>{ if(showHeightPopover) setDraftHeight(windowHeight); }, [showHeightPopover]);

  const commitHeight = (v) => {
    const n = Number(v);
    const clamped = Math.max(480, Math.min(900, isNaN(n) ? 700 : n));
    onUpdateWindowHeight(clamped);
    setDraftHeight(clamped);
  };

  React.useEffect(()=>{
    if(savedIndicator){
      setSavedLabel('저장됨');
      const t = setTimeout(()=>setSavedLabel(''), 2000);
      return ()=>clearTimeout(t);
    }
  }, [savedIndicator]);

  const btnBase = {
    display:'inline-flex',alignItems:'center',gap:6,padding:'7px 12px',
    background:'#fff',color:'var(--ink)',border:'1px solid var(--line)',
    borderRadius:8,fontSize:12.5,fontWeight:700,cursor:'pointer',
    height:34,
  };
  const btnPrimary = {
    ...btnBase,
    background:'var(--grad)',color:'#fff',border:'none',
    boxShadow:'0 3px 10px rgba(80,90,255,.25)',
  };
  const iconBtn = {
    ...btnBase, padding:'7px 9px',
  };

  return (
    <div style={{height:56, flex:'none', background:'#fff', borderBottom:'1px solid var(--line)', display:'flex', alignItems:'center', padding:'0 18px', gap:14, zIndex:5}}>
      {/* Logo */}
      <div
        style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',userSelect:'none',opacity:1,transition:'opacity .15s'}}
        onClick={onGoHome}
        onMouseEnter={(e)=>{e.currentTarget.style.opacity=0.75}}
        onMouseLeave={(e)=>{e.currentTarget.style.opacity=1}}
        title="홈으로 이동"
      >
        <div style={{width:30,height:30,borderRadius:8,background:'var(--grad)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:14}}>P</div>
        <div style={{fontWeight:800,fontSize:15,color:'var(--ink)',letterSpacing:'-.01em'}}>PopBuilder</div>
      </div>

      <div style={{height:20,width:1,background:'var(--line)'}}/>

      {/* Editable project title */}
      <div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:0}}>
        <input
          value={state.meta.title}
          onChange={(e)=>onTitleChange(e.target.value)}
          style={{border:'none',background:'transparent',fontSize:14,fontWeight:700,color:'var(--ink)',padding:'6px 10px',borderRadius:6,minWidth:0,width:'auto',maxWidth:340,outline:'none'}}
          onFocus={(e)=>e.currentTarget.style.background='var(--panel)'}
          onBlur={(e)=>e.currentTarget.style.background='transparent'}
        />
        {savedLabel && <span style={{fontSize:11,color:'var(--good)',fontWeight:700}}>✓ {savedLabel}</span>}
      </div>

      {/* Actions */}
      <div style={{display:'flex',gap:6,alignItems:'center'}}>
        <button style={iconBtn} onClick={onUndo} disabled={!canUndo} title="실행 취소 (Ctrl+Z)"
          onMouseEnter={(e)=>{if(canUndo) e.currentTarget.style.background='var(--panel)'}}
          onMouseLeave={(e)=>e.currentTarget.style.background='#fff'}>
          <span style={{opacity: canUndo?1:.4, fontSize:14}}>↶</span>
        </button>
        <button style={iconBtn} onClick={onRedo} disabled={!canRedo} title="다시 실행 (Ctrl+Y)"
          onMouseEnter={(e)=>{if(canRedo) e.currentTarget.style.background='var(--panel)'}}
          onMouseLeave={(e)=>e.currentTarget.style.background='#fff'}>
          <span style={{opacity: canRedo?1:.4, fontSize:14}}>↷</span>
        </button>

        <div style={{height:20,width:1,background:'var(--line)',margin:'0 4px'}}/>

        <div style={{position:'relative'}}>
          <button style={btnBase} onClick={()=>setShowHeightPopover(v=>!v)} title="팝업 창 높이 조절">
            ↕ 팝업 높이
          </button>
          {showHeightPopover && (
            <>
              <div style={{position:'fixed',inset:0,zIndex:10}} onClick={()=>setShowHeightPopover(false)}/>
              <div style={{position:'absolute',top:'calc(100% + 8px)',left:0,width:236,background:'#fff',border:'1px solid var(--line)',borderRadius:10,boxShadow:'var(--shadow-lg)',padding:14,zIndex:11}}>
                <div style={{fontSize:12,fontWeight:800,color:'var(--ink)',marginBottom:2}}>팝업 창 높이</div>
                <div style={{fontSize:11,color:'var(--mute)',marginBottom:10,lineHeight:1.5}}>
                  표지·상세 화면이 항상 같은 높이를 공유해요. 내용이 넘치면 창 크기는 그대로 두고 안에서 스크롤돼요. 값을 정하고 <b>저장</b>을 눌러야 반영돼요.
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <input type="range" min={480} max={900} step={10}
                    value={Number(draftHeight) || 480}
                    onChange={(e)=>setDraftHeight(Number(e.target.value))}
                    style={{flex:1}}/>
                  <div style={{flex:'none',display:'flex',alignItems:'center',gap:2}}>
                    <input type="number" min={480} max={900}
                      value={draftHeight}
                      onChange={(e)=>{
                        const raw = e.target.value;
                        setDraftHeight(raw === '' ? '' : Number(raw));
                      }}
                      onKeyDown={(e)=>{ if(e.key === 'Enter') commitHeight(draftHeight); }}
                      style={{width:52,padding:'5px 6px',border:'1px solid var(--line)',borderRadius:6,fontSize:12,fontWeight:700,textAlign:'right',fontFamily:'inherit'}}/>
                    <span style={{fontSize:11.5,color:'var(--sub)',fontWeight:700}}>px</span>
                  </div>
                </div>
                <div style={{display:'flex',gap:6,marginTop:10}}>
                  <button onClick={()=>commitHeight(draftHeight)}
                    style={{flex:1,padding:'7px',border:'none',borderRadius:7,background:'var(--grad)',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer'}}>
                    저장
                  </button>
                  <button onClick={()=>commitHeight(700)}
                    style={{flex:1,padding:'7px',border:'1px solid var(--line)',borderRadius:7,background:'#fff',fontSize:11.5,fontWeight:700,color:'var(--mute)',cursor:'pointer'}}>
                    기본값(700px)
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{display:'flex',background:'var(--panel)',borderRadius:8,padding:2,gap:2}} title="우측 패널 전체를 구조화된 폼으로 편집할지, HTML 코드로 직접 편집할지 선택">
          <button onClick={()=>onSetEditorMode('simple')} type="button"
            style={{padding:'6px 10px',fontSize:12,fontWeight:700,borderRadius:6,border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:5,
              background: editorMode!=='html' ? '#fff' : 'transparent',color: editorMode!=='html' ? 'var(--ink)' : 'var(--sub)',boxShadow: editorMode!=='html' ? '0 1px 3px rgba(20,30,60,.1)' : 'none'}}>
            🧩 간단 모드
          </button>
          <button onClick={()=>onSetEditorMode('html')} type="button"
            style={{padding:'6px 10px',fontSize:12,fontWeight:700,borderRadius:6,border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:5,
              background: editorMode==='html' ? '#fff' : 'transparent',color: editorMode==='html' ? 'var(--ink)' : 'var(--sub)',boxShadow: editorMode==='html' ? '0 1px 3px rgba(20,30,60,.1)' : 'none'}}>
            {'</>'} HTML 모드
          </button>
        </div>
        <div style={{height:20,width:1,background:'var(--line)',margin:'0 4px'}}/>

        <button style={btnBase} onClick={onNewProject} title="새 프로젝트">
          {window.Icons.File({size:14})} 새로 만들기
        </button>
        <button style={btnBase} onClick={()=>fileRef.current && fileRef.current.click()}>
          {window.Icons.Upload({size:14})} JSON 불러오기
        </button>
        <input ref={fileRef} type="file" accept=".json,application/json" style={{display:'none'}} onChange={(e)=>{
          const f = e.target.files && e.target.files[0]; if(!f) return;
          const rd = new FileReader();
          rd.onload = () => {
            try { onImportJson(JSON.parse(rd.result)); }
            catch(err){ alert('JSON 파일을 읽을 수 없습니다: ' + err.message); }
          };
          rd.readAsText(f);
          e.target.value = '';
        }}/>
        <button style={btnBase} onClick={onSave}>
          {window.Icons.Save({size:14})} 저장
        </button>
        <button style={btnBase} onClick={onOpenPreview}>
          {window.Icons.Eye({size:14})} 미리보기
        </button>
        <button style={btnPrimary} onClick={onDownload}>
          {window.Icons.Download({size:14})} ZIP 다운로드
        </button>
      </div>
    </div>
  );
}

window.Toolbar = Toolbar;

// Full popup preview modal - shows the final output exactly as end users will see it.
// Non-editable: pure output.
const { useState: pmUseState } = React;

function PreviewModal({ state, onClose }){
  const [screen, setScreen] = pmUseState('hero'); // hero | detail
  const [activeSection, setActiveSection] = pmUseState(state.activeSectionId || (state.sidebar||[])[0]?.id);
  const windowHeight = state.popup?.windowHeight ?? 700;

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
        <div style={{background:'#fff', borderRadius:12, boxShadow:'0 30px 70px rgba(0,0,0,.4)', overflow:'hidden', height:`min(${windowHeight}px, 88vh)`, display:'flex', flexDirection:'column', position:'relative'}}>
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
  const [editorMode, setEditorMode] = useState('simple'); // 'simple' | 'html' — 우측 패널 전체에 공통 적용
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

  // 팝업 창 높이 — 표지·상세 화면이 공유하는 하나의 값
  const handleUpdateWindowHeight = (h) => {
    commit(prev => ({ ...prev, popup: { ...prev.popup, windowHeight: h } }));
  };

  // 컴포넌트를 구조화된 폼 대신 직접 입력한 HTML로 렌더링 (빈 문자열이면 구조화된 편집으로 복귀)
  const handleUpdateCustomHtml = (id, html) => {
    commit(prev => ({
      ...prev,
      components: { ...prev.components, [id]: { ...prev.components[id], customHtml: html } }
    }));
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
        onUpdateWindowHeight={handleUpdateWindowHeight}
        editorMode={editorMode}
        onSetEditorMode={setEditorMode}
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
            onSelectSection={selectSection}
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
            onUpdateCustomHtml={handleUpdateCustomHtml}
            editorMode={editorMode}
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
