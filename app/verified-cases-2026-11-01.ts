import type { CaseRecord } from "./cases-data";

// Individual HTML-body verification only; the full collection remains unverified.
const source = "https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=C020010000&nttId=12600";
const laws = ["개인정보 보호법상 안전조치 의무(보도자료 표현·세부 처분 조문 미확인)"];
const historicalNote = "보도자료 HTML 본문을 확인했습니다. 첨부파일과 의결서는 미확보이며 공개 여부는 확인이 필요합니다. 현행 점검항목과의 대응은 당시 적용 조문을 확정한 것이 아닙니다.";

export const verifiedCases20261101: CaseRecord[] = [
  {
    id: "daekyo-2026-10", date: "2026-10-29", verifiedAt: "2026-11-01",
    title: "대교 안전조치 의무 위반 제재", targets: "㈜대교", institution: "민간기업",
    dispositions: ["과징금", "시정명령", "공표명령"],
    dispositionSummary: "과징금 32억 5,500만 원, 안전조치·사고 대응체계 정비 시정명령 및 공표명령.",
    itemIds: [2, 8, 12], topics: ["내부 관리계획", "접근통제", "이상징후 탐지"],
    summary: "관계사 서버를 통한 회원 DB 접근으로 개인정보 유출이 반복되었습니다.",
    problems: ["불필요한 DB 연결 허용", "탐지 안내 이후 분석·차단 미흡", "내부 관리계획 이행실태 점검 소홀"],
    relation: "계획 이행 점검, 침입 탐지·대응, 비인가 DB 접근 통제와 대응합니다.",
    learning: ["불필요한 연결을 제한하고 경보 후속조치를 기록하세요."],
    laws, source, sourceType: "개인정보위 보도자료", historicalNote,
  },
  {
    id: "younghoon-medical-2026-10", date: "2026-10-29", verifiedAt: "2026-11-01",
    title: "영훈의료재단 안전조치 의무 위반 제재", targets: "의료법인 영훈의료재단(대전선병원·유성선병원)", institution: "민간기업",
    dispositions: ["과징금", "시정명령"],
    dispositionSummary: "과징금 6억 3,000만 원 및 주기적인 취약점 점검·개선 시정명령.",
    itemIds: [8, 25], topics: ["웹 보안", "취약점 점검", "암호화"],
    summary: "병원 홈페이지의 SQL 인젝션 공격으로 회원 개인정보가 유출되었습니다.",
    problems: ["웹 공격 탐지·차단과 취약점 점검 미흡", "비밀번호 저장에 안전하지 않은 암호화 적용"],
    relation: "공격 탐지·차단과 웹 취약점 관리에 대응합니다. 회원 비밀번호 문제를 DB 관리자 인증 위반으로 연결하지 않습니다.",
    learning: ["웹 입력값 검증과 안전한 비밀번호 저장을 확인하세요."],
    laws, source, sourceType: "개인정보위 보도자료", historicalNote,
  },
];
