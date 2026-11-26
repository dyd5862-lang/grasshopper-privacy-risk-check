import { reviewedPress } from "../../data/pipc/press-2026-11-24";
import { reviewedDecisions } from "../../data/pipc/decisions-2026-11-24";
import { publicDecisionsByCase } from "../../app/decision-data";

type Material = {
  id: string;
  title: string;
  date: string;
  url: string;
  kind: "보도자료" | "공개용 의결서";
  label: string;
};

function press(key: keyof typeof reviewedPress): Material {
  const source = reviewedPress[key];
  return { ...source, kind: "보도자료", label: source.kind };
}

function decision(caseId: string, date: string): Material {
  const [source] = publicDecisionsByCase[caseId];
  return {
    id: source.decisionNo,
    title: `개인정보보호 법규 위반행위에 대한 시정조치에 관한 건 (${source.organization})`,
    date, url: source.agendaUrl, kind: "공개용 의결서", label: source.decisionNo,
  };
}

function reviewedDecision(key: keyof typeof reviewedDecisions): Material {
  const source = reviewedDecisions[key];
  return { ...source, title: `${source.title} (${source.organization})`, kind: "공개용 의결서", label: source.decisionNo };
}

export const relatedMaterials = {
  guide: press("12609"),
  skt: press("11453"),
  kakao: press("10180"),
  daekyo: press("12600"),
  blackyak: press("11343"),
  samyang: press("12648"),
  edtech: press("12649"),
  mvno: press("12647"),
  anchor: reviewedDecision("2026-222-459"),
  tcsoft: reviewedDecision("2026-220-441"),
  pgim: reviewedDecision("2026-217-384"),
  triple: decision("historic-2022-02", "2022-02-23"),
  jenertec: decision("jenertec-2026-217-390", "2026-09-09"),
  sbridge: decision("sbridge-2026-217-391", "2026-09-09"),
} as const;

export type MaterialLink = {
  source: keyof typeof relatedMaterials;
  questionIds: string[];
  relevance: "직접 관련" | "실질 관련";
  location: string;
  reason: string;
};

export const materialLinks: MaterialLink[] = [
  { source: "guide", questionIds: ["C-03", "C-04", "C-05"], relevance: "실질 관련", location: "FAQ 정비 중 업데이트 지연 시 안전조치",
    reason: "안내서에 시스템 업데이트가 지연될 때 고려할 보호조치가 보완됐습니다. 제품별 패치 적용이 늦어질 때 해당 안내를 함께 확인할 수 있습니다." },
  { source: "guide", questionIds: ["D-01"], relevance: "실질 관련", location: "FAQ 정비 중 시스템 간 정보 연계",
    reason: "시스템 간 정보를 연계하는 API의 안전한 이용·관리 점검사항을 안내서에 추가했습니다. 검토할 연계 경로를 파악하는 데 활용할 수 있습니다." },
  { source: "skt", questionIds: ["B-04", "E-04", "G-05"], relevance: "실질 관련", location: "위반 사항 1) ① 접근통제조치 소홀",
    reason: "관리망과 가입자 서버 사이에 불필요한 접속을 허용해 내부 침해가 개인정보 DB로 확산됐습니다. 불필요한 통신과 DB 접근 경로를 점검할 근거입니다." },
  { source: "skt", questionIds: ["F-03", "F-04"], relevance: "직접 관련", location: "위반 사항 1) ① 및 ④ 뒤의 접속기록 관련 설명",
    reason: "침입탐지 경보를 점검하지 않았고 접속기록 미보관도 확인됐습니다. 이상 접속을 탐지한 뒤 대응하는 과정이 문제 된 사례입니다." },
  { source: "skt", questionIds: ["F-02"], relevance: "실질 관련", location: "유출 관련 사실관계 및 위반 사항 1) ①",
    reason: "가입자 서버에서 대량의 개인정보가 외부로 전송됐습니다. 반출 이력을 검토할 필요성을 보여 줍니다." },
  { source: "skt", questionIds: ["C-03", "C-04"], relevance: "실질 관련", location: "위반 사항 1) ③ 보안 업데이트 미조치 등",
    reason: "공개된 운영체제 보안패치를 장기간 적용하지 않아 침해가 발생했습니다. Java·PHP를 운영할 때도 패치 적용 여부를 확인할 필요성을 보여 주는 다른 제품의 사례입니다." },
  { source: "kakao", questionIds: ["D-03", "D-04"], relevance: "실질 관련", location: "오픈채팅 보안 취약점 및 공개 API의 영향 검토 문단",
    reason: "이용자 정보 추출이 가능한 API의 영향과 피해 가능성을 충분히 검토하지 않았다고 발표했습니다. API를 통한 조회 범위와 접근 조건을 점검할 근거입니다." },
  { source: "kakao", questionIds: ["G-04"], relevance: "실질 관련", location: "유출 신고·통지 의무 위반",
    reason: "위원회는 이용자 대상 유출 통지를 명령했다고 발표했습니다. 유출 인지 이후 통지·신고 절차를 점검할 사례입니다." },
  { source: "daekyo", questionIds: ["A-01", "A-03"], relevance: "실질 관련", location: "이번 조사·처분의 의의",
    reason: "관계사 서버와 보조 서비스 홈페이지가 유출 경로로 확인돼 위원회가 개인정보처리시스템 현황 파악을 당부했습니다." },
  { source: "daekyo", questionIds: ["E-04", "G-05"], relevance: "실질 관련", location: "대교 조사 결과 중 DB 직접 연결",
    reason: "관계사 웹서버에서 회원 DB로 불필요한 직접 연결이 허용돼 외부 시스템 침해가 DB 유출로 이어졌습니다." },
  { source: "daekyo", questionIds: ["F-03", "G-04"], relevance: "직접 관련", location: "대교 조사 결과 및 시정명령",
    reason: "이상행위 탐지 통보 이후 분석과 차단이 미흡해 유출이 재발했습니다. 위원회는 안전조치 강화와 유출사고 대응체계 정비를 명령했습니다." },
  { source: "daekyo", questionIds: ["F-04"], relevance: "실질 관련", location: "대교 조사 결과 중 관제업체의 이상행위 통보",
    reason: "보안관제업체가 이상행위를 알린 뒤 상세 분석이 충분히 이뤄지지 않았습니다. 의심 접속이 탐지된 경우 관련 기록을 확인할 필요성을 보여 줍니다." },
  { source: "blackyak", questionIds: ["F-02", "F-03", "G-05"], relevance: "실질 관련", location: "비와이엔블랙야크 조사 결과",
    reason: "관리자 계정 탈취 후 다수 이용자의 개인정보가 내려받아졌습니다. 권한 탈취 이후 대량 반출을 막는 조치를 점검할 사례입니다." },
  { source: "blackyak", questionIds: ["F-04", "G-04"], relevance: "실질 관련", location: "한국토픽교육센터 조사 결과",
    reason: "한국토픽교육센터에서 접속기록 미보관과 유출 통지 지연이 확인됐습니다. 기록을 확보하고 유출을 인지한 후 통지하는 절차와 관련됩니다." },
  { source: "anchor", questionIds: ["G-04"], relevance: "직접 관련", location: "주문 1.가 및 이유 Ⅳ.2",
    reason: "메일 발송 중 유출된 개인정보에 대한 통지·신고가 지연돼 위원회가 통지 절차를 포함한 유출사고 대응체계 마련을 명령했습니다." },
  { source: "tcsoft", questionIds: ["G-04"], relevance: "직접 관련", location: "주문 1.가 및 이유 Ⅳ.1",
    reason: "서비스 배포 과정에서 발생한 유출사고의 통지가 지연돼 위원회가 통지를 포함한 사고 대응체계 마련을 명령했습니다." },
  { source: "pgim", questionIds: ["D-03", "D-04", "G-05"], relevance: "실질 관련", location: "이유 Ⅱ.2.가, Ⅱ.3.가 및 Ⅲ.2.가",
    reason: "인증수단 재설정과 제3자 앱 승인권한 통제가 미흡해 고객지원시스템에 승인되지 않은 앱이 연결됐습니다. 외부 연계의 승인·권한 조건을 점검할 근거입니다." },
  { source: "pgim", questionIds: ["F-02", "F-03"], relevance: "실질 관련", location: "이유 Ⅱ.2.가",
    reason: "고객지원시스템의 개인정보가 외부 앱을 통해 클라우드 저장소로 반출됐습니다. 연계 시스템의 비정상 반출 경로를 점검하는 데 참고할 사례입니다." },
  { source: "pgim", questionIds: ["G-04"], relevance: "실질 관련", location: "이유 Ⅲ.2.나",
    reason: "유출을 인지하고도 직원과 고객사 직원에 대한 통지가 지연됐습니다. 통지 대상별 담당자와 일정을 사고 대응절차에 반영할 필요성을 보여 줍니다." },
  { source: "samyang", questionIds: ["B-01", "B-04"], relevance: "직접 관련", location: "조사·처분의 의의",
    reason: "데이터 이관이 끝난 서버로 외부 통신이 가능했습니다. 위원회는 사용을 중단한 서버의 폐기 또는 외부 접근 차단을 당부했습니다." },
  { source: "samyang", questionIds: ["B-03", "A-04"], relevance: "실질 관련", location: "삼양그룹 조사 결과 중 데이터 이관용 파일서버",
    reason: "수탁사가 임시로 사용한 이관용 파일서버가 업무 종료 후에도 외부망과 연결돼 있었습니다. 외부 운영 자산의 용도와 종료 여부를 확인할 근거입니다." },
  { source: "samyang", questionIds: ["F-02", "F-03", "G-05"], relevance: "실질 관련", location: "삼양그룹 조사 결과 중 인증정보 탈취와 외부 반출",
    reason: "관리자 권한과 서버 인증정보가 유출된 후 다량의 파일이 외부 클라우드로 전송됐습니다. 권한 탈취 이후 반출 경로를 점검하는 데 참고할 사고 사례입니다." },
  { source: "edtech", questionIds: ["B-01", "B-03", "B-04"], relevance: "직접 관련", location: "셋째, 외부 침입 탐지·차단 및 접속기록 관리",
    reason: "사업자가 사용을 마친 개발·시험 페이지를 인터넷에 노출한 사실이 확인됐습니다." },
  { source: "edtech", questionIds: ["F-03"], relevance: "직접 관련", location: "셋째, 외부 침입 탐지·차단 및 접속기록 관리",
    reason: "외부의 비인가 접근과 침입을 탐지하고 차단하는 조치가 미흡해 위원회가 개선을 권고했습니다." },
  { source: "edtech", questionIds: ["F-04"], relevance: "실질 관련", location: "셋째, 외부 침입 탐지·차단 및 접속기록 관리",
    reason: "두 사업자가 접속기록을 보관하지 않아 점검 과정에서 개선했습니다. 의심 접속을 확인하려면 해당 기록을 확보해야 합니다." },
  { source: "mvno", questionIds: ["F-04"], relevance: "실질 관련", location: "사업자별 위반 내용 및 처분 결과",
    reason: "엘지헬로비전은 개인정보취급자의 접속기록 보관을 소홀히 했습니다. 기록이 빠지면 취급자의 접속 이력을 검토하기 어렵습니다." },
  { source: "jenertec", questionIds: ["E-04"], relevance: "직접 관련", location: "이유 Ⅱ.2.나 및 Ⅲ.2.가",
    reason: "DB 관리도구에 접속 가능한 IP를 제한하지 않은 사실을 확인했습니다. 당시 안전성 확보조치 기준(제2023-6호) 제6조제1항이 적용됐습니다." },
  { source: "jenertec", questionIds: ["E-03"], relevance: "실질 관련", location: "이유 Ⅱ.2.나",
    reason: "외부에서 DB 관리도구에 직접 접근할 수 있었습니다. 관리 접근 경로를 제한할 필요성을 보여 주며, 의결서에서 도구의 구현 언어는 확인되지 않습니다." },
  { source: "jenertec", questionIds: ["F-04"], relevance: "실질 관련", location: "이유 Ⅲ.2.가",
    reason: "개인정보취급자의 웹 관리자 페이지 접속기록 보관 의무를 위반했습니다. 당시 안전성 확보조치 기준(제2023-6호) 제8조제1항을 적용한 사례입니다." },
  { source: "jenertec", questionIds: ["G-04"], relevance: "직접 관련", location: "주문 제2항 및 이유 Ⅲ.2.나",
    reason: "유출 통지·신고가 지연돼 위원회가 유출 통지를 포함한 사고 대응체계 마련을 명령했습니다." },
  { source: "sbridge", questionIds: ["F-03", "F-04"], relevance: "직접 관련", location: "이유 Ⅱ.3.가 및 Ⅲ.2.가",
    reason: "웹서버 접속 IP 분석을 통한 침입 탐지·차단 운영과 회원 DB 취급자의 접속기록 보관이 미흡했습니다. 당시 기술적·관리적 보호조치 기준(제2021-3호)이 적용됐습니다." },
  { source: "triple", questionIds: ["F-04"], relevance: "직접 관련", location: "주문 1.라.4 및 이유 Ⅱ.3.라",
    reason: "위원회는 개인정보취급자의 접속기록을 정기적으로 확인·감독하도록 명령했습니다. 해당 기간과 주기는 사건 당시 적용된 기술적·관리적 보호조치 기준에 따릅니다." },
  { source: "triple", questionIds: ["D-07", "F-02", "F-03", "G-05"], relevance: "실질 관련", location: "이유 Ⅱ.2.나.2 및 Ⅱ.3.라",
    reason: "노출된 클라우드 접근키로 DB 백업과 파일 반출이 이뤄졌습니다. 인증정보 노출 뒤 재발급 및 반출 탐지·차단 대책을 점검할 근거가 됩니다." },
  { source: "triple", questionIds: ["G-04"], relevance: "실질 관련", location: "주문 1.마 및 이유 Ⅱ.3.마",
    reason: "이용자에게 유출 항목과 대응조치 등을 알리지 않아 시정명령을 받았습니다. 유출사고 대응 절차에 통지를 포함할 필요성을 보여 줍니다." },
];
