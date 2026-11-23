export const sources = {
  S1: {
    date: "2026. 10. 19.", title: "개인정보 보호, 생활 속 실천과 사전 점검이 중요합니다",
    url: "https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=C020010000&nttId=12586",
  },
  S2: {
    date: "2026. 10. 22.", title: "개인정보위, PHP 보안 취약점 관련 개인정보 유출 예방조치 당부",
    url: "https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=&nttId=12588",
  },
  S3: {
    date: "2026. 11. 18.", title: "개인정보위, Java 보안 취약점 관련 개인정보 대량 유출 예방조치 당부",
    url: "https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=C010010000&nttId=12660",
  },
} as const;

type Passage = { source: keyof typeof sources; location: string; summary: string };
export const passages = {
  assets: { source: "S1", location: "2쪽 기업·기관 ①", summary: "장비와 설치 소프트웨어의 버전, 자산의 용도·주소·운영 상태·담당자, 시스템별 개인정보 유형·규모와 외부 연계를 파악한다." },
  unused: { source: "S1", location: "2쪽 기업·기관 ②", summary: "방치한 사이트·시스템·계정을 정리한다. 임시·시험 환경도 확인하며 필요 없는 외부 포트를 차단한다." },
  apiInventory: { source: "S1", location: "2쪽 기업·기관 ③", summary: "외부 연계 API를 파악하고 사용이 끝난 API를 폐기한다." },
  apiAccess: { source: "S1", location: "2쪽 기업·기관 ③", summary: "API의 권한과 개인정보 조회 범위를 줄이고 비정상적인 대량·반복 요청을 차단한다." },
  apiKeys: { source: "S1", location: "2쪽 기업·기관 ③", summary: "오랫동안 쓰지 않은 API 키와 토큰은 즉시 회수한다." },
  response: { source: "S1", location: "3쪽 기업·기관 ④", summary: "보호조치를 수시로 점검하고 발견한 취약점은 신속히 개선한다. 사고 대응절차와 담당체계를 미리 정해 상시 점검한다." },
  phpPatch: { source: "S2", location: "2쪽 ①", summary: "PHP 사용 시스템별 버전을 확인하고 최신 보안패치를 적용하며 불필요한 웹서비스를 삭제한다." },
  phpDb: { source: "S2", location: "2쪽 ②", summary: "phpMyAdmin 등 DB 관리도구의 인터넷 직접 접근을 제한한다. 도구 업데이트, 불필요한 설정파일 정리, 웹서비스 계정의 DB 권한 축소도 점검한다." },
  phpLogs: { source: "S2", location: "2쪽 ③", summary: "개인정보 대량조회·반출 이력을 살피고 이상 접근을 탐지·차단하며 접속기록 관리를 강화한다." },
  phpVendors: { source: "S2", location: "2쪽 ④", summary: "외주 개발·운영, 수탁업체와 호스팅 환경까지 PHP 사용 여부를 파악하고 조치한다." },
  javaInventory: { source: "S3", location: "2쪽 첫째", summary: "운영체제의 Java 외에 오픈소스 소프트웨어와 응용프로그램 컨테이너에 내장된 실행환경도 버전을 확인하고 조치한다." },
  javaApi: { source: "S3", location: "2쪽 둘째", summary: "불필요한 API는 중단하고 DB 조회 범위를 업무에 맞춘다. 유출 우려가 있는 인증정보를 재발급하고 인증·권한·정책 조건을 충족하지 않는 요청은 기본 차단한다." },
  javaDb: { source: "S3", location: "2쪽 셋째", summary: "응용프로그램 계정의 불필요한 전체 조회권한을 회수한다. Java 기반 관리도구에서는 외부 DB 직접 접속을 제한하고 승인된 관리자만 접속하게 한다." },
  javaLogs: { source: "S3", location: "1쪽 위험 설명 및 2쪽 마지막 문단", summary: "비정상 대량조회와 다운로드 위험을 살피고 수탁업체 운영 시스템까지 개인정보 조회·반출 이력과 접속기록을 점검한다." },
  scenario: { source: "S3", location: "2쪽 마지막 문단", summary: "시스템 침해 또는 인증·권한 우회가 일어난 상황을 가정해 개인정보 침해 위험을 관리한다." },
} as const satisfies Record<string, Passage>;

export const advisories = {
  kisaJava: { title: "KISA · Oracle 제품 보안 업데이트 권고", url: "https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&menuNo=205020&nttId=72313" },
  oracle: { title: "Oracle · 2026년 11월 보안 업데이트", url: "https://www.oracle.com/security-alerts/cspunov2026.html" },
  kisaPhp: { title: "KISA · PHP 제품 보안 업데이트 권고", url: "https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&menuNo=205020&nttId=72227&pageIndex=1" },
  php: { title: "PHP · 2026년 10월 21일 보안 릴리스", url: "https://www.php.net/archive/2026.php#2026-10-21-5" },
  phpAdmin: { title: "phpMyAdmin · 공식 보안공지", url: "https://www.phpmyadmin.net/security/" },
} as const;
