"use client";

import { officialCaseSearchUrl } from "../../app/cases-data";
import { answerOptions,getProgressMessage } from "../../lib/privacy-risk/constants";
import { privacyLawReaderArticleLinks,privacyNoticeArticleLinks } from "../../lib/privacy-risk/legal-links";
import type { Filter } from "../../lib/privacy-risk/types";
import { MiniIcon } from "./Icons";
import type { AssessmentController } from "./useAssessment";

export function ChecklistScreen({ setScreen, profile, answers, evidence, setExpanded, setEvidenceFor, setDetailFor, setGuideFor, filter, setFilter, query, setQuery, setCaseListFor, showItemIndex, setShowItemIndex, showReferences, setShowReferences, applicableChecks, completed, progress, attentionItems, filteredChecks, activeCheck, casesForItem, openCases, setAnswer, goNextItem, goResult }: Pick<AssessmentController, "setScreen" | "profile" | "answers" | "evidence" | "setExpanded" | "setEvidenceFor" | "setDetailFor" | "setGuideFor" | "filter" | "setFilter" | "query" | "setQuery" | "setCaseListFor" | "showItemIndex" | "setShowItemIndex" | "showReferences" | "setShowReferences" | "applicableChecks" | "completed" | "progress" | "attentionItems" | "filteredChecks" | "activeCheck" | "casesForItem" | "openCases" | "setAnswer" | "goNextItem" | "goResult">) {
  return (<section className="workspace check-workspace">
          <div className="check-topbar">
            <div>
              <button className="back-link" onClick={() => setScreen("profile")}>← 대상 정보 수정</button>
              <span className="step-label">2 / 3 · 보호조치 점검</span>
              <h1>{profile.systemName || "개인정보처리시스템"}</h1>
              <p>{profile.organization || "기관명 미입력"} · {profile.fileName || "개인정보파일명 미입력"}</p>
            </div>
            <div className="progress-card">
              <div className="progress-copy"><span>전체 진행률</span><b>{completed}<small> / {applicableChecks.length}</small></b></div>
              <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
              <div className="progress-helper"><span aria-hidden="true">🦗</span><small><b>{getProgressMessage(progress)}</b><br />{progress}% 완료 · 답변은 자동으로 저장됩니다.</small></div>
            </div>
          </div>

          <div className="notice-strip"><span>i</span><p><b>‘예’는 증적이 있어야 최종 충족으로 표시됩니다.</b> 증적이 없으면 ‘충족 주장 / 증적 미확인’으로 구분됩니다.</p><button onClick={() => setDetailFor(17)}>증적 예시 보기</button></div>

          <div className="check-toolbar no-print">
            <div className="filter-tabs">
              {[
                ["all", "전체", applicableChecks.length],
                ["institution", "기관 기준", 11],
                ["system", "시스템 기준", applicableChecks.length - 11],
                ["unanswered", "미답변", applicableChecks.length - completed],
                ["attention", "확인 필요", attentionItems.length],
              ].map(([value, label, count]) => <button key={String(value)} className={filter === value ? "active" : ""} onClick={() => setFilter(value as Filter)}>{label}<span>{count}</span></button>)}
            </div>
            <label className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="항목 검색" aria-label="점검항목 검색" /></label>
          </div>

          <div className="assessment-layout">
            <aside className={`assessment-index ${showItemIndex ? "open" : ""}`}>
              <button className="assessment-panel-toggle" onClick={() => setShowItemIndex((current) => !current)} aria-expanded={showItemIndex}><span>점검 진행 목록</span><b>{activeCheck?.id ?? "-"} / {applicableChecks.length}</b></button>
              <div className="assessment-index-body">
                <div className="assessment-index-head"><span>점검 진행 목록</span><b>{completed}/{applicableChecks.length}</b></div>
                <div className="assessment-index-list">
                  {filteredChecks.map((indexItem) => {
                    const savedAnswer = answers[indexItem.id];
                    const savedEvidence = evidence[indexItem.id] ?? [];
                    const status = !savedAnswer ? "미답변" : savedAnswer === "yes" && savedEvidence.length ? "충족" : savedAnswer === "yes" ? "증적" : savedAnswer === "no" ? "미흡" : savedAnswer === "unknown" ? "확인" : "제외";
                    return <button key={indexItem.id} className={activeCheck?.id === indexItem.id ? "active" : ""} onClick={() => { setExpanded(indexItem.id); setShowItemIndex(false); }}><span>{String(indexItem.id).padStart(2, "0")}</span><div><b>{indexItem.question}</b><small>{indexItem.category}</small></div><em className={`index-status status-${savedAnswer ?? "empty"}`}>{status}</em></button>;
                  })}
                </div>
              </div>
            </aside>

            <div className="question-list focus-list">
              {filteredChecks.length > 0 && activeCheck && [activeCheck].map((item) => {
                const answer = answers[item.id];
                const itemEvidence = evidence[item.id] ?? [];
                const itemCases = casesForItem(item.id);
                const judgment = !answer ? "미답변" : answer === "yes" && itemEvidence.length ? "충족" : answer === "yes" ? "증적 미확인" : answer === "no" ? "미흡" : answer === "unknown" ? "추가 확인" : "해당 없음";
                return (
                  <article className={`question-card focus-question-panel expanded answer-${answer ?? "empty"}`} key={item.id}>
                    <div className="question-summary">
                      <span className="question-number">{String(item.id).padStart(2, "0")}</span>
                      <div className="question-copy"><span className="category-label">{item.scope === "institution" ? "기관 기준" : "시스템 기준"} · {item.category}</span><h2>{item.question}</h2></div>
                      <span className={`judgment judgment-${answer ?? "empty"}`}>{judgment}</span>
                    </div>
                    <div className="question-body">
                      <div className="grasshopper-tip"><span aria-hidden="true">🦗</span><p><b>메뚜기 도움말</b>{item.easy}</p></div>
                      <fieldset className="answer-fieldset"><legend>현재 상태를 선택하세요</legend><div className="answer-buttons answer-card-buttons">
                        {answerOptions.map((option) => <button type="button" key={option.value} className={answer === option.value ? `selected ${option.value}` : ""} onClick={() => setAnswer(item.id, option.value)}><span>{option.icon}</span><div><b>{option.title}</b><small>{option.description}</small></div></button>)}
                      </div></fieldset>
                      {answer === "yes" && itemEvidence.length === 0 && <div className="answer-hint warning"><span>!</span><p><b>충족 주장 / 증적 미확인</b><br />현재 답변상 충족이지만 이를 입증할 증적자료가 등록되지 않았습니다.</p></div>}
                      {answer === "no" && <><div className="answer-hint danger"><span>!</span><p><b>{item.priority} 개선 권고</b><br />{item.action}</p></div>{itemCases.length > 0 && <button className="case-alert" onClick={() => setCaseListFor(item.id)}><MiniIcon name="case" /><span><b>유사한 조치 미흡이 개인정보위 처분사례 {itemCases.length}건에서 확인됐습니다.</b><small>해당 항목에 연결된 사례를 모두 확인할 수 있습니다.</small></span><MiniIcon name="arrow" /></button>}</>}
                      {answer === "unknown" && <div className="answer-hint neutral"><span>?</span><p><b>이 자료를 확인해 보세요</b><br />{item.evidence.slice(0, 2).join(" · ")}</p></div>}
                      <div className="question-actions">
                        <button onClick={() => setDetailFor(item.id)}><MiniIcon name="book" /> 해설·근거 보기</button>
                        <button onClick={() => setEvidenceFor(item.id)}><MiniIcon name="clip" /> 증적 추가 {itemEvidence.length > 0 && <b>{itemEvidence.length}</b>}</button>
                        <button className="case-button" onClick={() => itemCases.length ? setCaseListFor(item.id) : openCases(item.id)}><MiniIcon name="case" /> 실제 사례 {itemCases.length > 0 && <b>{itemCases.length}</b>}</button>
                      </div>
                      {itemEvidence.length > 0 && <div className="evidence-chips">{itemEvidence.map((entry, index) => <span key={`${entry.title}-${index}`}><MiniIcon name="check" /> {entry.title}</span>)}</div>}
                      {answer && <div className={`answer-outcome outcome-${answer}`}><div className="answer-outcome-grid"><div><span>판정</span><b>{judgment}</b></div><div><span>증적 필요</span><b>{answer === "na" ? "적용 근거 기록" : answer === "yes" && itemEvidence.length ? "등록됨" : "확인·등록 필요"}</b></div><div><span>법적 근거</span><b>{item.law}</b></div><div><span>개선 필요</span><b>{answer === "no" ? `${item.priority} 조치` : answer === "unknown" ? "확인 후 결정" : answer === "yes" && !itemEvidence.length ? "증적 보완" : "현재 입력상 없음"}</b></div></div><button className="primary-button" onClick={() => goNextItem(item.id)}>{item.id === applicableChecks.at(-1)?.id ? "결과 확인" : "다음 항목"} <MiniIcon name="arrow" /></button></div>}
                    </div>
                  </article>
                );
              })}
              {filteredChecks.length === 0 && <div className="empty-state"><span>⌕</span><h2>조건에 맞는 항목이 없습니다</h2><p>검색어 또는 필터를 바꿔 보세요.</p></div>}
            </div>

            {activeCheck && <aside className={`reference-panel ${showReferences ? "open" : ""}`}>
              <button className="assessment-panel-toggle" onClick={() => setShowReferences((current) => !current)} aria-expanded={showReferences}><span>관련 정보</span><b>법령·안내서·사례</b></button>
              <div className="reference-panel-body">
                <div className="reference-head"><span aria-hidden="true">🦗</span><div><b>관련 정보 패널</b><small>{activeCheck.id}번 항목의 확인 근거</small></div></div>
                <section className="reference-legal-section"><span>⚖️ 법적 근거</span><div className="reference-provision-links">{privacyLawReaderArticleLinks("privacy-law", activeCheck.law).map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer"><b>{reference.label}</b><MiniIcon name="arrow" /></a>)}{privacyLawReaderArticleLinks("privacy-decree", activeCheck.law).map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer"><b>{reference.label}</b><MiniIcon name="arrow" /></a>)}{privacyNoticeArticleLinks(activeCheck.standard).map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer"><b>{reference.label}</b><MiniIcon name="arrow" /></a>)}</div></section>
                <section><span>📖 안내서</span><b>안전성 확보조치 기준 안내서</b><small>2025.11 개정본</small><button onClick={() => setGuideFor(activeCheck.id)}>{activeCheck.page} 바로 보기 <MiniIcon name="arrow" /></button></section>
                <section><span>📎 필요한 증적자료</span><ul>{activeCheck.evidence.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></section>
                <section><span>📋 조사·처분 사례</span><b>{casesForItem(activeCheck.id).length > 0 ? `${casesForItem(activeCheck.id).length}건 직접 연결` : "직접 연결 사례 없음"}</b><button onClick={() => casesForItem(activeCheck.id).length ? setCaseListFor(activeCheck.id) : openCases(activeCheck.id)}>전체 사례 확인 <MiniIcon name="arrow" /></button></section>
                <section><span>📰 개인정보위 보도자료</span><a href={officialCaseSearchUrl(activeCheck.category)} target="_blank" rel="noreferrer">공식자료 최신 검색 <MiniIcon name="arrow" /></a></section>
                <button className="secondary-button full" onClick={() => setDetailFor(activeCheck.id)}>해설과 근거 전체 보기</button>
              </div>
            </aside>}
          </div>

          <div className="check-footer no-print">
            <div><b>{completed}개 답변 완료</b><span>{applicableChecks.length - completed}개 항목이 남았습니다.</span></div>
            <button className="primary-button" onClick={goResult}>현재 결과 확인 <MiniIcon name="arrow" /></button>
          </div>
        </section>);
}
