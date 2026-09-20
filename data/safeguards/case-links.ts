// Reviewed mappings only. Case bodies and URLs remain in app/cases-data.ts and app/decision-data.ts.
export type CaseLink = { questionId: string; caseId: string; relevance: 'direct' | 'reference'; reason: string; checkPoint: string };
export type CaseReview = { checkedAt: string; decisionDate: string; sourceLocator: string; lawNote: string; historicalNote: string };
export type DecisionReview = { listingStatus: 'confirmed' | 'unavailable'; identityStatus: 'filename-date' | 'unconfirmed'; bodyStatus: 'unavailable'; pdfStatus: 'unavailable'; checkedAt: string; note: string };
export const caseReviews: Record<string, CaseReview> = {
  "geps-gangbuk-2026": {
    "checkedAt": "2026-09-20",
    "decisionDate": "2026-03-25",
    "sourceLocator": "기관별 조사 결과 문단",
    "lawNote": "개인정보 보호법상 안전조치 의무 등 위반은 보도자료로 확인했습니다. 처분 당시 세부 적용 조문·항·호 및 적용 고시 버전은 의결서 본문 재확인이 필요합니다. 기존 사례의 조문 표기를 확정된 당시 적용조문으로 재사용하지 않습니다.",
    "historicalNote": "문항의 현재 조문은 이 도구의 기준자료(2025-9호)를 따릅니다. 2026-11-01 시행 예정 문구를 과거 사건에 소급하지 않으며, 직접 관련은 보호조치의 사실관계가 대응한다는 뜻입니다. 처분 근거 조문의 동일성이나 법 위반 확정을 의미하지 않습니다."
  },
  "blackyak-topic-2025": {
    "checkedAt": "2026-09-20",
    "decisionDate": "2025-07-09",
    "sourceLocator": "두 사업자별 조사 결과 문단",
    "lawNote": "개인정보 보호법상 안전조치 의무 등 위반은 보도자료로 확인했습니다. 처분 당시 세부 적용 조문·항·호 및 적용 고시 버전은 의결서 본문 재확인이 필요합니다. 기존 사례의 조문 표기를 확정된 당시 적용조문으로 재사용하지 않습니다.",
    "historicalNote": "문항의 현재 조문은 이 도구의 기준자료(2025-9호)를 따릅니다. 2026-11-01 시행 예정 문구를 과거 사건에 소급하지 않으며, 직접 관련은 보호조치의 사실관계가 대응한다는 뜻입니다. 처분 근거 조문의 동일성이나 법 위반 확정을 의미하지 않습니다."
  },
  "skt-2025": {
    "checkedAt": "2026-09-20",
    "decisionDate": "2025-08-27",
    "sourceLocator": "3. 개인정보 보호법 위반 사항 및 4. 처분 내용",
    "lawNote": "개인정보 보호법상 안전조치 의무 등 위반은 보도자료로 확인했습니다. 처분 당시 세부 적용 조문·항·호 및 적용 고시 버전은 의결서 본문 재확인이 필요합니다. 기존 사례의 조문 표기를 확정된 당시 적용조문으로 재사용하지 않습니다.",
    "historicalNote": "문항의 현재 조문은 이 도구의 기준자료(2025-9호)를 따릅니다. 2026-11-01 시행 예정 문구를 과거 사건에 소급하지 않으며, 직접 관련은 보호조치의 사실관계가 대응한다는 뜻입니다. 처분 근거 조문의 동일성이나 법 위반 확정을 의미하지 않습니다."
  },
  "ks-duo-geumneung-2026": {
    "checkedAt": "2026-09-20",
    "decisionDate": "2026-04-22",
    "sourceLocator": "세 사업자별 조사 결과와 시정명령 문단",
    "lawNote": "개인정보 보호법상 안전조치 의무 등 위반은 보도자료로 확인했습니다. 처분 당시 세부 적용 조문·항·호 및 적용 고시 버전은 의결서 본문 재확인이 필요합니다. 기존 사례의 조문 표기를 확정된 당시 적용조문으로 재사용하지 않습니다.",
    "historicalNote": "문항의 현재 조문은 이 도구의 기준자료(2025-9호)를 따릅니다. 2026-11-01 시행 예정 문구를 과거 사건에 소급하지 않으며, 직접 관련은 보호조치의 사실관계가 대응한다는 뜻입니다. 처분 근거 조문의 동일성이나 법 위반 확정을 의미하지 않습니다."
  },
  "luxury-saas-2026": {
    "checkedAt": "2026-09-20",
    "decisionDate": "2026-02-11",
    "sourceLocator": "브랜드별 조사 결과 및 이번 조사·처분의 의의",
    "lawNote": "개인정보 보호법상 안전조치 의무 등 위반은 보도자료로 확인했습니다. 처분 당시 세부 적용 조문·항·호 및 적용 고시 버전은 의결서 본문 재확인이 필요합니다. 기존 사례의 조문 표기를 확정된 당시 적용조문으로 재사용하지 않습니다.",
    "historicalNote": "문항의 현재 조문은 이 도구의 기준자료(2025-9호)를 따릅니다. 2026-11-01 시행 예정 문구를 과거 사건에 소급하지 않으며, 직접 관련은 보호조치의 사실관계가 대응한다는 뜻입니다. 처분 근거 조문의 동일성이나 법 위반 확정을 의미하지 않습니다."
  },
  "online-services-2024": {
    "checkedAt": "2026-09-20",
    "decisionDate": "2024-08-28",
    "sourceLocator": "사업자별 위반 내용 및 처분 결과",
    "lawNote": "개인정보 보호법상 안전조치 의무 등 위반은 보도자료로 확인했습니다. 처분 당시 세부 적용 조문·항·호 및 적용 고시 버전은 의결서 본문 재확인이 필요합니다. 기존 사례의 조문 표기를 확정된 당시 적용조문으로 재사용하지 않습니다.",
    "historicalNote": "문항의 현재 조문은 이 도구의 기준자료(2025-9호)를 따릅니다. 2026-11-01 시행 예정 문구를 과거 사건에 소급하지 않으며, 직접 관련은 보호조치의 사실관계가 대응한다는 뜻입니다. 처분 근거 조문의 동일성이나 법 위반 확정을 의미하지 않습니다."
  }
};
export const decisionReviews: Record<string, DecisionReview> = {
  "제2025-026-305호": {
    "listingStatus": "confirmed",
    "identityStatus": "filename-date",
    "bodyStatus": "unavailable",
    "pdfStatus": "unavailable",
    "checkedAt": "2026-09-20",
    "note": "공식 게시판에서 문서번호·기관명·게시판 의결일을 대조했습니다. 본문 사실관계와 개별 문서의 의결일은 미확인입니다."
  },
  "제2026-005-025호": {
    "listingStatus": "confirmed",
    "identityStatus": "filename-date",
    "bodyStatus": "unavailable",
    "pdfStatus": "unavailable",
    "checkedAt": "2026-09-20",
    "note": "공식 게시판에서 문서번호·기관명·게시판 의결일을 대조했습니다. 본문 사실관계와 개별 문서의 의결일은 미확인입니다."
  },
  "제2025-015-229호": {
    "listingStatus": "confirmed",
    "identityStatus": "unconfirmed",
    "bodyStatus": "unavailable",
    "pdfStatus": "unavailable",
    "checkedAt": "2026-09-20",
    "note": "공식 게시판의 의결번호·첨부 존재·의결일은 확인했으나 문서 본문과 기관 동일성은 재확인이 필요합니다."
  },
  "제2025-015-230호": {
    "listingStatus": "confirmed",
    "identityStatus": "unconfirmed",
    "bodyStatus": "unavailable",
    "pdfStatus": "unavailable",
    "checkedAt": "2026-09-20",
    "note": "공식 게시판의 의결번호·첨부 존재·의결일은 확인했으나 문서 본문과 기관 동일성은 재확인이 필요합니다."
  },
  "제2025-018-243호": {
    "listingStatus": "unavailable",
    "identityStatus": "unconfirmed",
    "bodyStatus": "unavailable",
    "pdfStatus": "unavailable",
    "checkedAt": "2026-09-20",
    "note": "기존 연결자료입니다. 이번 확인에서 공식 게시판과 PDF에 접근하지 못해 사건 동일성을 재확인하지 못했습니다. 비공개 또는 자료 부재를 뜻하지 않습니다."
  },
  "제2026-006-050호": {
    "listingStatus": "confirmed",
    "identityStatus": "filename-date",
    "bodyStatus": "unavailable",
    "pdfStatus": "unavailable",
    "checkedAt": "2026-09-20",
    "note": "공식 게시판에서 문서번호·기관명·게시판 의결일을 대조했습니다. 본문 사실관계와 개별 문서의 의결일은 미확인입니다."
  },
  "제2026-007-052호": {
    "listingStatus": "confirmed",
    "identityStatus": "filename-date",
    "bodyStatus": "unavailable",
    "pdfStatus": "unavailable",
    "checkedAt": "2026-09-20",
    "note": "공식 게시판에서 문서번호·기관명·게시판 의결일을 대조했습니다. 본문 사실관계와 개별 문서의 의결일은 미확인입니다."
  },
  "제2026-007-053호": {
    "listingStatus": "confirmed",
    "identityStatus": "filename-date",
    "bodyStatus": "unavailable",
    "pdfStatus": "unavailable",
    "checkedAt": "2026-09-20",
    "note": "공식 게시판에서 문서번호·기관명·게시판 의결일을 대조했습니다. 본문 사실관계와 개별 문서의 의결일은 미확인입니다."
  },
  "제2024-014-195호": {
    "listingStatus": "unavailable",
    "identityStatus": "unconfirmed",
    "bodyStatus": "unavailable",
    "pdfStatus": "unavailable",
    "checkedAt": "2026-09-20",
    "note": "기존 연결자료입니다. 이번 확인에서 공식 게시판과 PDF에 접근하지 못해 사건 동일성을 재확인하지 못했습니다. 비공개 또는 자료 부재를 뜻하지 않습니다."
  },
  "제2024-014-196호": {
    "listingStatus": "unavailable",
    "identityStatus": "unconfirmed",
    "bodyStatus": "unavailable",
    "pdfStatus": "unavailable",
    "checkedAt": "2026-09-20",
    "note": "기존 연결자료입니다. 이번 확인에서 공식 게시판과 PDF에 접근하지 못해 사건 동일성을 재확인하지 못했습니다. 비공개 또는 자료 부재를 뜻하지 않습니다."
  },
  "제2024-014-197호": {
    "listingStatus": "unavailable",
    "identityStatus": "unconfirmed",
    "bodyStatus": "unavailable",
    "pdfStatus": "unavailable",
    "checkedAt": "2026-09-20",
    "note": "기존 연결자료입니다. 이번 확인에서 공식 게시판과 PDF에 접근하지 못해 사건 동일성을 재확인하지 못했습니다. 비공개 또는 자료 부재를 뜻하지 않습니다."
  },
  "제2024-014-198호": {
    "listingStatus": "unavailable",
    "identityStatus": "unconfirmed",
    "bodyStatus": "unavailable",
    "pdfStatus": "unavailable",
    "checkedAt": "2026-09-20",
    "note": "기존 연결자료입니다. 이번 확인에서 공식 게시판과 PDF에 접근하지 못해 사건 동일성을 재확인하지 못했습니다. 비공개 또는 자료 부재를 뜻하지 않습니다."
  }
};
export const caseLinks: CaseLink[] = [
  {
    "questionId": "A-02",
    "caseId": "geps-gangbuk-2026",
    "relevance": "direct",
    "reason": "공무원연금공단이 업무 변경으로 자격을 잃은 담당자의 권한을 말소하지 않은 사실이 확인되었다.",
    "checkPoint": "인사변경 내역과 실제 권한 회수 시점을 대조하세요."
  },
  {
    "questionId": "N-01",
    "caseId": "geps-gangbuk-2026",
    "relevance": "direct",
    "reason": "강북구청이 시스템 접근 IP를 제한하지 않은 사실이 확인되었다.",
    "checkPoint": "관리자 페이지의 외부 노출과 IP 허용 정책을 확인하세요."
  },
  {
    "questionId": "N-04",
    "caseId": "geps-gangbuk-2026",
    "relevance": "direct",
    "reason": "강북구청의 외부접속에 안전한 접속·인증수단이 없었다. 현재 비이용자 정보 문항과 보호조치의 실질을 비교한다.",
    "checkPoint": "비이용자 정보 시스템인지 확인하고 외부 접속수단을 점검하세요."
  },
  {
    "questionId": "E-01",
    "caseId": "geps-gangbuk-2026",
    "relevance": "direct",
    "reason": "강북구청이 비밀번호에 안전하지 않은 암호화 알고리즘을 적용하였다.",
    "checkPoint": "비밀번호의 일방향 암호화 방식과 알고리즘을 확인하세요."
  },
  {
    "questionId": "L-01",
    "caseId": "geps-gangbuk-2026",
    "relevance": "direct",
    "reason": "공무원연금공단·강북구청의 취급자 접속기록 보관·관리 미흡이 확인되었다. 확대된 현행 기록대상 전체 위반을 의미하지 않는다.",
    "checkPoint": "취급자 기록과 현행 확대 대상의 기록을 나누어 확인하세요."
  },
  {
    "questionId": "L-03",
    "caseId": "geps-gangbuk-2026",
    "relevance": "direct",
    "reason": "강북구청이 취급자의 접속기록을 1년 이상 보관·관리하지 않았다.",
    "checkPoint": "보관기간과 실제 조회 가능한 가장 오래된 기록을 대조하세요."
  },
  {
    "questionId": "L-06",
    "caseId": "geps-gangbuk-2026",
    "relevance": "direct",
    "reason": "공무원연금공단이 기관별 담당자의 접속기록 점검을 소홀히 하였다. 현행 계획기반 주기와 당시 기준은 구분한다.",
    "checkPoint": "접속기록 점검 결과와 다운로드 확인 이력을 확인하세요."
  },
  {
    "questionId": "H-01",
    "caseId": "geps-gangbuk-2026",
    "relevance": "reference",
    "reason": "권한 말소 실패는 인사정보 연계의 필요성을 보여주지만 제16조의 연계 의무 위반을 확인한 것은 아니다.",
    "checkPoint": "사례의 운영상 문제를 참고하되 현재 문항의 별도 요건과 증적을 확인하세요."
  },
  {
    "questionId": "H-02",
    "caseId": "geps-gangbuk-2026",
    "relevance": "reference",
    "reason": "비자격자 승인 사례이나 인사정보 미등록자 계정 발급 금지 조항에 따른 처분인지는 확인되지 않았다.",
    "checkPoint": "사례의 운영상 문제를 참고하되 현재 문항의 별도 요건과 증적을 확인하세요."
  },
  {
    "questionId": "T-01",
    "caseId": "geps-gangbuk-2026",
    "relevance": "reference",
    "reason": "접속기록 점검 소홀 사례이며 제17조의 자동화 분석 기능 미구축을 처분한 것으로 확인되지 않았다.",
    "checkPoint": "사례의 운영상 문제를 참고하되 현재 문항의 별도 요건과 증적을 확인하세요."
  },
  {
    "questionId": "S-06",
    "caseId": "geps-gangbuk-2026",
    "relevance": "reference",
    "reason": "실제 권한관리 실패 사례다. 공공시스템별 내부 관리계획 내용 누락을 직접 입증하지 않는다.",
    "checkPoint": "사례의 운영상 문제를 참고하되 현재 문항의 별도 요건과 증적을 확인하세요."
  },
  {
    "questionId": "N-05",
    "caseId": "blackyak-topic-2025",
    "relevance": "direct",
    "reason": "두 사업자의 SQL 삽입 취약점 방치로 웹사이트에서 개인정보가 유출되었다.",
    "checkPoint": "입력값 검증과 SQL 삽입 취약점 조치 결과를 확인하세요."
  },
  {
    "questionId": "N-03",
    "caseId": "blackyak-topic-2025",
    "relevance": "direct",
    "reason": "블랙야크의 외부 관리자 접속에 아이디·비밀번호 외 안전한 인증수단이 없었다.",
    "checkPoint": "외부 관리자 접속의 다중인증을 실제로 시험하세요."
  },
  {
    "questionId": "L-01",
    "caseId": "blackyak-topic-2025",
    "relevance": "direct",
    "reason": "한국토픽교육센터가 취급자의 시스템 접속기록을 보관·관리하지 않았다.",
    "checkPoint": "시스템 접속·처리기록의 실제 생성과 보관을 확인하세요."
  },
  {
    "questionId": "M-26",
    "caseId": "blackyak-topic-2025",
    "relevance": "reference",
    "reason": "웹 취약점 점검 미흡은 확인되지만 내부 관리계획에 따른 이행 여부 자체의 처분은 확인되지 않았다.",
    "checkPoint": "계획상 취약점 점검 범위와 수행·개선 이력을 대조하세요."
  },
  {
    "questionId": "M-11",
    "caseId": "blackyak-topic-2025",
    "relevance": "reference",
    "reason": "실제 취약점 점검 실패 사례다. 계획에 취약점 점검 내용을 누락했다고 단정할 수 없다.",
    "checkPoint": "내부 관리계획에 점검·개선 방법이 포함되었는지 별도로 확인하세요."
  },
  {
    "questionId": "R-25",
    "caseId": "blackyak-topic-2025",
    "relevance": "reference",
    "reason": "SQL 삽입 취약점 미조치 사례다. 부록의 연 1회 진단 또는 상시 자동차단이라는 평가조건 자체를 판단한 처분은 아니다.",
    "checkPoint": "위험도 분석 부록에서 요구하는 진단주기 또는 자동차단 증적을 확인하세요."
  },
  {
    "questionId": "M-01",
    "caseId": "skt-2025",
    "relevance": "direct",
    "reason": "보도자료에서 내부 관리계획 수립·시행 소홀을 명시하였다.",
    "checkPoint": "핵심 시스템 전체를 포함한 관리계획과 승인·시행 이력을 확인하세요."
  },
  {
    "questionId": "M-24",
    "caseId": "skt-2025",
    "relevance": "reference",
    "reason": "관리계획 점검 소홀은 명시되나 연 1회 및 책임주체별 세부요건 위반은 원문 확인이 필요하다.",
    "checkPoint": "보호책임자 점검의 주체·주기·범위를 별도로 확인하세요."
  },
  {
    "questionId": "A-06",
    "caseId": "skt-2025",
    "relevance": "direct",
    "reason": "서버 계정정보를 보호하지 않고 HSS 조회 인증절차를 생략한 사실이 확인되었다.",
    "checkPoint": "서버 계정정보 보호와 개인정보 조회 인증을 확인하세요."
  },
  {
    "questionId": "N-01",
    "caseId": "skt-2025",
    "relevance": "direct",
    "reason": "외부망에서 내부 관리망 서버로의 접근을 제한하지 않았다.",
    "checkPoint": "인터넷과 내부 시스템 사이의 허용 규칙을 확인하세요."
  },
  {
    "questionId": "N-02",
    "caseId": "skt-2025",
    "relevance": "direct",
    "reason": "침입탐지 로그를 확인하지 않는 등 유출 시도 탐지·대응이 미흡하였다.",
    "checkPoint": "경보를 분석하고 실제 후속조치를 남기는지 확인하세요."
  },
  {
    "questionId": "E-02",
    "caseId": "skt-2025",
    "relevance": "direct",
    "reason": "유심 인증키를 평문으로 저장한 사실이 확인되었다. 생체정보가 아닌 인증정보 저장 사례다.",
    "checkPoint": "인증정보 종류를 식별하고 저장 암호화를 확인하세요."
  },
  {
    "questionId": "V-01",
    "caseId": "skt-2025",
    "relevance": "direct",
    "reason": "백신을 설치하지 않았으며 이를 대신하는 보안조치도 미흡하였다.",
    "checkPoint": "운영체제별 보안프로그램과 대체조치를 확인하세요."
  },
  {
    "questionId": "V-04",
    "caseId": "skt-2025",
    "relevance": "direct",
    "reason": "공개된 OS 취약점 패치를 장기간 적용하지 않았다.",
    "checkPoint": "보안공지 수신부터 패치 완료까지의 이력을 확인하세요."
  },
  {
    "questionId": "R-01",
    "caseId": "skt-2025",
    "relevance": "reference",
    "reason": "CPO 관리 범위가 일부 IT 서비스에 한정된 사례다. 위험도 분석 부록의 평가 결과를 뜻하지 않는다.",
    "checkPoint": "CPO의 실제 관리 범위에 점검 시스템이 포함되는지 확인하세요."
  },
  {
    "questionId": "M-04",
    "caseId": "skt-2025",
    "relevance": "reference",
    "reason": "CPO 역할의 실질적 제한 사례이며 내부 관리계획의 역할·책임 문구 누락 여부는 별도 확인이 필요하다.",
    "checkPoint": "계획상 역할과 실제 보고·감독 체계가 일치하는지 확인하세요."
  },
  {
    "questionId": "A-07",
    "caseId": "ks-duo-geumneung-2026",
    "relevance": "direct",
    "reason": "듀오정보가 회원DB 인증 반복 실패 시 접근제한을 설정하지 않았다.",
    "checkPoint": "실패 횟수 제한과 잠금 동작을 확인하세요."
  },
  {
    "questionId": "R-20",
    "caseId": "ks-duo-geumneung-2026",
    "relevance": "direct",
    "reason": "듀오정보의 회원DB 반복 인증실패 제한 부재가 직접 확인된다. 해당 조치만 연결하며 암호화 예외 판정을 뜻하지 않는다.",
    "checkPoint": "DB와 관련 시스템의 인증 실패 차단을 확인하세요."
  },
  {
    "questionId": "E-01",
    "caseId": "ks-duo-geumneung-2026",
    "relevance": "direct",
    "reason": "듀오정보 비밀번호에 안전하지 않은 암호화 알고리즘을 적용하였다.",
    "checkPoint": "비밀번호 저장 알고리즘을 확인하세요."
  },
  {
    "questionId": "E-04",
    "caseId": "ks-duo-geumneung-2026",
    "relevance": "direct",
    "reason": "금릉공원묘원의 이용자 주민등록번호 평문 보관이 확인되었다.",
    "checkPoint": "이용자 고유식별정보의 저장 암호화를 확인하세요."
  },
  {
    "questionId": "E-10",
    "caseId": "ks-duo-geumneung-2026",
    "relevance": "direct",
    "reason": "금릉공원묘원이 인터넷 구간 개인정보 전송에 암호화 통신을 적용하지 않았다.",
    "checkPoint": "전송 경로 전체의 암호화 적용을 확인하세요."
  },
  {
    "questionId": "N-01",
    "caseId": "ks-duo-geumneung-2026",
    "relevance": "direct",
    "reason": "KS한국고용정보가 외부 시스템 접근을 IP로 제한하지 않았다.",
    "checkPoint": "외부접속 허용 범위를 점검하세요."
  },
  {
    "questionId": "N-04",
    "caseId": "ks-duo-geumneung-2026",
    "relevance": "reference",
    "reason": "KS 시스템에는 인사·상담 정보가 혼재한다. 비이용자 정보 전용 조건이 확정되지 않아 참고 사례로 연결한다.",
    "checkPoint": "이용자·비이용자 정보와 처리 경로를 구분하세요."
  },
  {
    "questionId": "X-01",
    "caseId": "ks-duo-geumneung-2026",
    "relevance": "reference",
    "reason": "보유기간 경과 정보의 미파기 사례이며 완전파괴 등 특정 파기방법 위반을 입증한 것은 아니다.",
    "checkPoint": "파기 시점과 복원불가한 파기방법을 각각 확인하세요."
  },
  {
    "questionId": "M-14",
    "caseId": "ks-duo-geumneung-2026",
    "relevance": "reference",
    "reason": "파기 지침 수립 명령은 확인되나 시행 전 개정 계획항목 위반으로 소급하지 않는다.",
    "checkPoint": "현재 의무와 개정 준비평가를 구분하여 파기 계획을 확인하세요."
  },
  {
    "questionId": "N-01",
    "caseId": "luxury-saas-2026",
    "relevance": "direct",
    "reason": "세 명품브랜드사의 SaaS 접속 IP 제한 미적용이 확인되었다.",
    "checkPoint": "외부 SaaS에도 접속 제한 정책을 적용했는지 확인하세요."
  },
  {
    "questionId": "N-03",
    "caseId": "luxury-saas-2026",
    "relevance": "direct",
    "reason": "루이비통이 취급자 외부접속에 안전한 인증수단을 적용하지 않았다.",
    "checkPoint": "SaaS 외부접속 인증을 확인하세요."
  },
  {
    "questionId": "L-06",
    "caseId": "luxury-saas-2026",
    "relevance": "direct",
    "reason": "디올이 다운로드 등 접속기록을 월 1회 이상 점검하지 않았다. 당시 월 1회 기준을 현행 계획기반 주기로 바꿔 표현하지 않는다.",
    "checkPoint": "현재 적용되는 점검 주기와 다운로드 점검 이력을 확인하세요."
  },
  {
    "questionId": "A-01",
    "caseId": "luxury-saas-2026",
    "relevance": "reference",
    "reason": "대량 다운로드 도구 제한 미흡과 최소권한 필요성을 설명한 사례다. 현재 세부 차등부여 요건의 처분 여부는 추가 확인이 필요하다.",
    "checkPoint": "역할별 권한과 대량 다운로드 기능을 검토하세요."
  },
  {
    "questionId": "N-05",
    "caseId": "online-services-2024",
    "relevance": "direct",
    "reason": "한화호텔앤드리조트가 예약 절차 변경 후 타인 정보 조회 가능성을 검증하지 않았다.",
    "checkPoint": "기능 변경 시 다른 정보주체 데이터가 노출되는지 시험하세요."
  },
  {
    "questionId": "V-04",
    "caseId": "online-services-2024",
    "relevance": "direct",
    "reason": "현대자동차 고객지원 앱의 상용소프트웨어 보안패치 지연이 확인되었다.",
    "checkPoint": "상용소프트웨어의 패치 적용 이력을 확인하세요."
  },
  {
    "questionId": "L-01",
    "caseId": "online-services-2024",
    "relevance": "direct",
    "reason": "띵스플로우의 취급자 시스템 접속기록 미보존이 확인되었다.",
    "checkPoint": "접속기록의 실제 생성과 보관을 확인하세요."
  }
];
