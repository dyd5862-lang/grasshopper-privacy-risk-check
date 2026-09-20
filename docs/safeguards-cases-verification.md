# 안전성 확보조치 관련 사례 기능 검증 기록

검증일: 2026-09-20. 기준 커밋: `dbb8b9665d483a0de04f07a3efcaa976e312f2cc`.
작업 범위는 로컬 코드 수정·자료 확인·동작 검증이며 커밋·푸시·운영 배포는 하지 않았다.

## 구현 범위

- 142개 점검 문항에 관련 사례 진입점을 제공하고, 32개 문항에 6개 기존 사례 레코드를 연결했다. 43개 문항–사례 연결 중 직접 관련 29개, 참고 사례 14개다. 사례 레코드 하나가 복수 기관 처분을 묶을 수 있어 개별 처분 사건 수와는 다르다.
- 나머지 110개 문항은 연결 없음으로 표시한다. 사전확인 15개는 별도다.
- 원본은 `app/cases-data.ts`와 `app/decision-data.ts`를 그대로 재사용한다. 기존 위험도 분석의 연결 정보는 변경하지 않았다.
- 연결 정보와 검증 상태는 `data/safeguards/case-links.ts`에 별도로 두었다.
- 사용자 응답과 시스템의 추가 확인 판단을 구분한다. 미답변은 미흡 안내 대상이 아니다. 사례 조회는 판정 엔진을 호출해 값을 바꾸거나 응답·증적을 저장하지 않는다.
- 결과에서 같은 사례를 묶고 연결된 각 문항과 이유를 표시한다. 인쇄에는 사례·관련 문항·출처 요약을 남기고, JSON 저장 형식은 변경하지 않았다.

## 자료 확인 범위와 한계

자세한 대응표와 문서별 공식 URL: [safeguards-case-map.md](safeguards-case-map.md).

- 최신 원본 자료에는 사례 109개, 공개 의결서 연결 72개(31개 사례)가 있었다.
- 이번에는 기존 사례 6개의 공식 보도자료 HTML 본문을 확인했다. 나머지 103개 사례와 링크는 전수 재검증하지 않았다.
- 연결된 기존 의결서 12개 중 7개는 공식 첨부 목록·의결번호·게시판 의결일을 확인했다. 그중 5개는 첨부명의 기관명도 확인했다. 2개 게시판의 5개 문서는 목록 접근 오류로 남았다.
- 12개 PDF 모두 이번 원문 열람 시도에서 접근 오류가 있어 본문 사실관계와 개별 문서의 의결일·당시 세부 조문·고시 버전은 재검증하지 못했다. 기존 원문 링크와 공식 첨부페이지를 확인 상태와 함께 제공한다. 접근 오류를 비공개나 자료 부재로 판단하지 않았다.
- 명품브랜드 사례는 기존 의결서가 미확보이며 공개 여부 확인이 필요하다.
- 공무원연금공단 문서의 의결번호 연도와 공식 게시판 의결일 차이는 대응표에 기록하고 임의로 수정하지 않았다.

## 자동 검사

| 명령 | 결과 |
|---|---|
| `npm run lint` | 통과 |
| `npm run typecheck` | 통과 |
| `npm test` | 57/57 통과 |
| `npm run build` | 프로덕션 빌드 통과: `/`, `/risk`, `/safeguards` |
| `npm run test:render` | 2/2 통과 |
| `git diff --check` | 통과 |

새 회귀검사 `tests/safeguards-cases.test.mjs`는 ID 존재·중복, 원본 자료 및 복수 의결서 유지, 정렬, 명시적/시스템 상태, 미답변·비적용 처리, 사건별 묶음, 시행 준비평가, 비활성 위험 모듈 제외, 판정·응답·증적·내보내기 불변, 대응표와 구현의 일치를 확인한다.
대응표는 `node scripts/generate-safeguards-case-map.mjs`로 갱신하고, `--check`로 차이를 확인한다.

## 실제 브라우저 확인

로컬 프로덕션 서버, Chromium headless, PC 1440×1000 및 모바일 뷰포트 390×844. 가상 기관명·가상 증적만 사용했다. 아래 19개 시나리오가 통과했으며 페이지 JavaScript 예외는 0건이었다.

- PASS: unlinked question opens neutral empty state
- PASS: question links, direct-case list and both decision links
- PASS: official sources explicitly open new windows safely
- PASS: native modal keyboard focus wraps
- PASS: Escape returns focus and preserves response, evidence and scroll position
- PASS: result merges same event across N-01 and N-04 and retains readiness label
- PASS: result detail opens with the correct question context
- PASS: download retains schema v1, 142 rows and original inputs
- PASS: print report shows compact case/source summaries
- PASS: home round-trip restores safeguards answers
- PASS: 390px mobile page and modal have no horizontal overflow
- PASS: mobile result has no horizontal overflow
- PASS: missing decision is shown as uncollected, not non-public
- PASS: reference-only connection is labelled separately
- PASS: original risk answer, related-case list and case detail still work
- PASS: original risk result and 26-item download retained
- PASS: original risk print action retained
- PASS: safeguards reset leaves original risk responses intact
- PASS: risk restore/reset preserves safeguards responses and reader preferences

## 미확인 사항

- 공식 PDF 원문 전체, 처분 당시 세부 법조항·고시 버전 및 범위 밖 사례의 링크 전체.
- 실제 iOS Safari·Android 기기 및 Firefox. 모바일은 Chromium의 화면 크기로 확인했다.
- 실물 프린터 출력과 OS 인쇄 대화상자. 안전성 확보조치 보고서는 브라우저 인쇄 스타일·PDF 생성·사례 요약 표시를, 기존 위험도 도구는 인쇄 호출을 확인했다.
- 운영 배포 후 화면·동작은 이번 범위에서 확인하지 않았다.

최신 코드에서 별도의 언어 전환·방문자 집계 구현은 발견되지 않았다. 기존 한국어 화면과 위험도 분석의 Light/Dark·글자/행간 설정 코드는 유지했고, 초기화 후 화면 설정 저장 유지도 브라우저에서 확인했다.
