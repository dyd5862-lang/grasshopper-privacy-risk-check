import type { CaseRecord } from './cases-data';

// Official PIPC attachment listing + National Law Information Center text.
// Embedded image tables and downloadable PDF/HWP bytes remain unverified.
export const decisionSource20260710 = 'https://pipc.go.kr/np/default/agenda.do?fromDt=&idxId=2026-0710&insttDivCdNm=&insttNms=&isPre=&mCode=E030010000&mrtlCd=&op=view&page=5&processCdNm=&schStr=&toDt=';
const reviewScope = '위원회 게시물 작성일은 2026-09-18, 의결일은 2026-09-09입니다. 작성일을 최초 공개일로 확정하지 않습니다. 국가법령정보센터의 의결서 텍스트 중 주문·행위사실·위법성 판단·결론을 확인했습니다. 이미지 표와 PDF/HWP 파일 자체는 미확인이며 아래 설명은 확인한 텍스트 범위에 한정합니다.';
export const decisionCases20261101: CaseRecord[] = [
  {
    id: 'jenertec-2026-217-390', date: '2026-09-18', verifiedAt: '2026-11-01',
    title: '제이에너텍 접근통제·암호화·접속기록 의무 위반', targets: '㈜제이에너텍', institution: '민간기업',
    dispositions: ['과태료', '시정명령'],
    dispositionSummary: '과태료 480만 원 및 개인정보 유출 통지를 포함한 사고 대응체계 마련 시정명령. 처분 통지일부터 60일 이내 이행결과 제출.',
    itemIds: [6, 12], topics: ['접근통제', '암호화', '접속기록', '유출 통지'],
    problems: ['웹서버·DB서버 방화벽이 모든 국내 IP의 접근을 허용하고 DB 관리 프로그램에 IP 기반 접근통제를 적용하지 않음', '이용자 비밀번호 평문 저장과 개인정보취급자 접속기록 1년 이상 보관·관리 미이행', '유출 인지 후 72시간을 경과하여 통지·신고'],
    summary: '외부에서 DB에 접근 가능한 환경에서 이용자 8명의 이메일·비밀번호가 다크웹에 공개됐습니다. 위원회는 접근통제·암호화·접속기록 및 통지·신고 의무 위반을 판단했습니다.',
    relation: '서버의 허용 IP와 DB 관리 프로그램의 네트워크 접근통제 사실을 위험도 6·12번에 대응합니다. 회원 비밀번호 문제를 DB 관리자 인증 위반으로 연결하지 않습니다.',
    learning: ['DB 관리 프로그램의 외부 접근을 필요한 IP로 제한하세요.', '비밀번호 저장 방식과 취급자 접속기록 보관기간을 확인하세요.'],
    laws: ['개인정보 보호법 제29조·제34조제1항·제3항', '개인정보의 안전성 확보조치 기준(2023-6호) 제6조제1항·제7조제1항·제8조제1항'],
    source: decisionSource20260710, sourceType: '개인정보위 공개용 의결서',
    historicalNote: reviewScope + ' 의결서가 적용한 고시는 2023-6호입니다. 현재 문항의 보호조치 대응과 당시 위반 조항을 구분합니다.',
  },
  {
    id: 'sbridge-2026-217-391', date: '2026-09-18', verifiedAt: '2026-11-01',
    title: '에스브릿지 파일 업로드 취약점·접속기록 의무 위반', targets: '㈜에스브릿지', institution: '민간기업',
    dispositions: ['과태료', '공표'],
    dispositionSummary: '과태료 420만 원 및 개인정보보호위원회 홈페이지에 처분결과 1년간 공표. 사업자 홈페이지 공표명령으로 표시하지 않습니다.',
    itemIds: [8, 14, 25], topics: ['접근통제', '접속기록', '웹 보안', '취약점 점검'],
    problems: ['회원 DB와 연동된 웹서버 접속 IP 재분석 등 악성행위 탐지·차단 운영 미흡', '파일 업로드 취약점에 대한 확장자 검사·업로드 디렉토리 실행권한 제한 등 점검·개선 미이행', '회원 DB의 개인정보취급자 접속기록을 1년 이상 보존·관리하지 않음'],
    summary: '2023년 8월 파일 업로드 취약점을 통한 웹셸 실행으로 로그인 페이지가 피싱 페이지로 연결됐습니다. 실제 민원 1명 외 세부 피해규모는 확인되지 않았습니다.',
    relation: '침입 탐지·대응, 회원 DB 취급자 접속기록, 파일 업로드 취약점 점검 사실을 위험도 8·14·25번과 대응합니다. 다른 장비·OS 보안패치 위반으로 확대하지 않습니다.',
    learning: ['업로드 파일 확장자와 실행권한을 제한하고 우회 가능성을 점검하세요.', '웹서버 탐지 경보와 개인정보취급자 접속기록을 관리하세요.'],
    laws: ['구 개인정보 보호법 제29조', '구 개인정보 보호법 시행령 제48조의2제1항', '구 개인정보의 기술적·관리적 보호조치 기준(2021-3호) 제4조제5항·제9항·제5조제1항'],
    source: decisionSource20260710, sourceType: '개인정보위 공개용 의결서',
    historicalNote: reviewScope + ' 2023년 8월 행위에는 구법과 2021-3호 기술적·관리적 보호조치 기준을 적용했습니다. 현행 안전성 확보조치 기준과 조문 번호를 동일시하지 않습니다.',
  },
];
