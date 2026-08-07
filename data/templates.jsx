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
    ctaLabel:'자세히 보기', showCta:true, showDash:false, kpis:[]
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
    ctaLabel:'상세보기', showCta:true, showDash:false, kpis:[]
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
    ctaLabel:'변경사항 보기', showCta:true, showDash:false, kpis:[]
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
