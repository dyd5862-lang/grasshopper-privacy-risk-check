"use client";

import { officialCaseSearchUrl } from "../../app/cases-data";
import { publicDecisionsByCase } from "../../app/decision-data";
import { relevanceFor } from "../../lib/privacy-risk/constants";
import { CASE_DATA_VERIFIED_AT,formatVerifiedDate } from "../../lib/privacy-risk/dates";
import type { CasePeriod,CaseYear } from "../../lib/privacy-risk/types";
import { MiniIcon } from "./Icons";
import type { AssessmentController } from "./useAssessment";

export function CasesScreen({ setScreen, setSelectedCase, caseTopic, setCaseTopic, caseInstitution, setCaseInstitution, caseDisposition, setCaseDisposition, casePeriod, setCasePeriod, caseYear, setCaseYear, caseQuery, setCaseQuery, completed, filteredCases }: Pick<AssessmentController, "setScreen" | "setSelectedCase" | "caseTopic" | "setCaseTopic" | "caseInstitution" | "setCaseInstitution" | "caseDisposition" | "setCaseDisposition" | "casePeriod" | "setCasePeriod" | "caseYear" | "setCaseYear" | "caseQuery" | "setCaseQuery" | "completed" | "filteredCases">) {
  return (<section className="workspace cases-workspace">
          <div className="cases-heading">
            <div>
              <button className="back-link" onClick={() => setScreen(completed ? "check" : "intro")}>← {completed ? "자가점검으로 돌아가기" : "서비스 안내"}</button>
              <span className="step-label">개인정보위 공식자료 연계</span>
              <h1>조사·처분 사례 찾아보기</h1>
              <p>보도자료 본문에서 실제 위반사실이 확인된 사례만 연결했습니다. 제목의 키워드만으로 관련성을 판단하지 않습니다.</p>
            </div>
            <div className="verified-card"><span>공식자료 확인일</span><b>{formatVerifiedDate(CASE_DATA_VERIFIED_AT)}</b><small>개인정보보호위원회 보도자료 기준</small></div>
          </div>

          <div className="case-principle">
            <MiniIcon name="case" />
            <div><b>사례는 처벌정보가 아니라 사고 예방을 위한 참고자료입니다.</b><p>사례 당시 법령과 현재 규정이 다를 수 있으며, 동일한 미흡사항이 있다는 이유만으로 같은 처분이 내려지는 것은 아닙니다.</p></div>
            <a href="https://www.pipc.go.kr/np/cop/bbs/selectBoardList.do?bbsId=BS074&mCode=C020010000" target="_blank" rel="noreferrer">개인정보위 최신 보도자료 <MiniIcon name="arrow" /></a>
          </div>

          <div className="case-filter-card">
            <label className="case-search"><MiniIcon name="search" /><input value={caseQuery} onChange={(event) => setCaseQuery(event.target.value)} placeholder="사건명, 기관명, 위반내용 검색" aria-label="조사·처분 사례 검색" /></label>
            <label><span>보호조치 유형</span><select value={caseTopic} onChange={(event) => setCaseTopic(event.target.value)}>{["전체", "개인정보 보호책임자", "내부 관리계획", "수탁자 관리·감독", "접근권한", "접근통제", "인증", "접속기록", "악성프로그램", "보안패치", "취약점 점검", "파기", "암호화", "웹 보안", "모니터링"].map((topic) => <option key={topic}>{topic}</option>)}</select></label>
            <label><span>기관 유형</span><select value={caseInstitution} onChange={(event) => setCaseInstitution(event.target.value)}>{["전체", "공공기관", "민간기업"].map((value) => <option key={value}>{value}</option>)}</select></label>
            <label><span>처분 유형</span><select value={caseDisposition} onChange={(event) => setCaseDisposition(event.target.value)}>{["전체", "과징금", "과태료", "시정명령", "시정권고", "개선권고", "징계권고", "공표명령"].map((value) => <option key={value}>{value}</option>)}</select></label>
            <label><span>연도</span><select value={caseYear} onChange={(event) => setCaseYear(event.target.value as CaseYear)}>{["all", "2026", "2025", "2024", "2023", "2022", "2021", "2020"].map((value) => <option key={value} value={value}>{value === "all" ? "전체 연도" : `${value}년`}</option>)}</select></label>
            <label><span>기간</span><select value={casePeriod} onChange={(event) => setCasePeriod(event.target.value as CasePeriod)}><option value="1">최근 1년</option><option value="3">최근 3년</option><option value="5">최근 5년</option><option value="all">전체 기간</option></select></label>
          </div>

          <div className="case-results-heading"><div><b>공식 조사·처분 사례</b><span>{filteredCases.length}건</span></div><button onClick={() => { setCaseTopic("전체"); setCaseInstitution("전체"); setCaseDisposition("전체"); setCaseYear("all"); setCasePeriod("all"); setCaseQuery(""); }}>필터 초기화</button></div>
          <div className="case-list">
            {filteredCases.map((record) => {
              const decisionCount = publicDecisionsByCase[record.id]?.length ?? 0;
              return <article className="case-list-card" key={record.id}>
                <div className="case-date"><b>{record.date.slice(0, 4)}</b><span>{record.date.slice(5).replace("-", ".")}</span></div>
                <div className="case-list-copy">
                  <div className="case-badges"><span className="direct-badge">{relevanceFor(record)}</span><span>{record.institution}</span>{decisionCount > 0 && <span className="decision-badge">공개용 의결서 {decisionCount}건</span>}{record.topics.slice(0, 3).map((topic) => <span key={topic}>{topic}</span>)}</div>
                  <h2>{record.title}</h2>
                  <p className="case-targets">처분 대상 · {record.targets}</p>
                  <p>{record.summary}</p>
                  <div className="case-dispositions">{record.dispositions.map((value) => <span key={value}>{value}</span>)}</div>
                </div>
                <div className="case-card-actions"><button onClick={() => setSelectedCase(record)}>{decisionCount > 0 ? `사례·의결서 ${decisionCount}건` : "사례 자세히 보기"} <MiniIcon name="arrow" /></button><a href={record.source} target="_blank" rel="noreferrer"><MiniIcon name="news" /> 공식 원문</a></div>
              </article>;
            })}
            {filteredCases.length === 0 && <div className="empty-state case-empty"><MiniIcon name="search" /><h2>직접 관련된 공개 사례를 찾지 못했습니다</h2><p>필터를 넓혀 유사 사례를 확인하거나 개인정보위 공식 보도자료에서 최신 자료를 검색하세요.</p><a className="primary-button" href={officialCaseSearchUrl(caseQuery || caseTopic)} target="_blank" rel="noreferrer">개인정보위에서 다시 검색 <MiniIcon name="arrow" /></a></div>}
          </div>

          <div className="case-search-footer"><div><MiniIcon name="news" /><p><b>더 최신 자료가 필요하신가요?</b><br />공식 보도자료 검색화면에서 현재 검색어로 다시 확인할 수 있습니다.</p></div><a className="secondary-button" href={officialCaseSearchUrl(caseQuery || (caseTopic === "전체" ? "안전조치" : caseTopic))} target="_blank" rel="noreferrer">공식자료 최신 검색 <MiniIcon name="arrow" /></a></div>
        </section>);
}
