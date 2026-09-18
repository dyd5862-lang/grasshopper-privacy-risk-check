"use client";

import Image from "next/image";
import { answerLabel,serviceName } from "../../lib/privacy-risk/constants";
import { CASE_DATA_VERIFIED_AT,formatVerifiedDate } from "../../lib/privacy-risk/dates";
import { privacyNoticeUrl } from "../../lib/privacy-risk/legal-links";
import { BrandMark,MiniIcon } from "./Icons";
import type { AssessmentController } from "./useAssessment";

export function ResultScreen({ setScreen, profile, answers, evidence, setExpanded, setSelectedCase, applicableChecks, completed, counts, evaluation, attentionItems, casesForItem, openCases, exportData }: Pick<AssessmentController, "setScreen" | "profile" | "answers" | "evidence" | "setExpanded" | "setSelectedCase" | "applicableChecks" | "completed" | "counts" | "evaluation" | "attentionItems" | "casesForItem" | "openCases" | "exportData">) {
  return (<section className="workspace result-workspace">
          <div className="result-heading no-print">
            <div><button className="back-link" onClick={() => setScreen("check")}>← 점검항목 돌아가기</button><span className="step-label">3 / 3 · 결과 및 개선계획</span><h1>메뚜기 개인정보 위험도 분석 결과</h1><p>{profile.organization || "기관명 미입력"} · {profile.systemName || "시스템명 미입력"} · {new Date().toLocaleDateString("ko-KR")}</p></div>
            <div className="result-actions"><button className="secondary-button" onClick={exportData}>결과 데이터 저장</button><button className="primary-button" onClick={() => window.print()}><MiniIcon name="file" /> 결과보고서 인쇄</button></div>
          </div>

          <div className={`overall-card ${evaluation.level}`}>
            <div className="overall-mascot"><Image src="/images/grasshopper-success.webp" alt="점검 완료 문서와 방패를 든 메뚜기 안내자" width={1254} height={1254} /><span>{evaluation.symbol}</span></div>
            <div className="overall-copy"><span className="target-kicker">종합 판정</span><h2>{evaluation.message}</h2><p>{counts.no > 0 ? "안내서상 점검항목 중 하나라도 ‘아니요’이면 암호화에 상응하는 충분한 안전조치가 있다고 보기 어렵습니다. 해당 개인정보파일을 암호화하거나 미흡 조치를 보완해야 합니다." : "현재 답변을 기준으로 한 자가점검 결과입니다. 실제 설정과 증적, 최신 현행 법령을 최종 확인하세요."}</p></div>
            <div className="overall-level"><small>우선순위</small><b>{evaluation.priority}</b><span>자가점검 보조지표</span></div>
          </div>

          <div className="metric-grid">
            <article><span className="metric-dot green" /><div><small>충족</small><b>{counts.yes - counts.evidenceMissing}</b></div><p>답변과 증적 확인</p></article>
            <article><span className="metric-dot yellow" /><div><small>증적 미확인</small><b>{counts.evidenceMissing}</b></div><p>‘예’이나 증적 없음</p></article>
            <article><span className="metric-dot red" /><div><small>미흡</small><b>{counts.no}</b></div><p>개선조치 필요</p></article>
            <article><span className="metric-dot gray" /><div><small>확인 필요</small><b>{counts.unknown + (applicableChecks.length - completed)}</b></div><p>미답변 포함</p></article>
          </div>

          <div className="result-grid">
            <article className="result-panel priorities-panel">
              <div className="panel-heading"><div><span className="section-kicker">개선 우선순위</span><h2>먼저 조치할 항목</h2></div><span>{attentionItems.length}건</span></div>
              <div className="priority-list">
                {attentionItems.length === 0 ? <div className="complete-state"><span>✓</span><h3>확인할 항목이 없습니다</h3><p>현재 입력한 답변과 증적 기준입니다.</p></div> : attentionItems.sort((a, b) => (a.priority === "즉시" ? -1 : b.priority === "즉시" ? 1 : a.id - b.id)).slice(0, 8).map((item) => {
                  const answer = answers[item.id];
                  const reason = answer === "no" ? "미흡" : answer === "unknown" || !answer ? "추가 확인" : "증적 미확인";
                  return <button key={item.id} onClick={() => { setScreen("check"); setExpanded(item.id); setTimeout(() => document.querySelector(`.question-card:nth-child(${item.id})`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 100); }}><span className={`priority-badge ${item.priority === "즉시" ? "urgent" : "short"}`}>{item.priority}</span><div><b>{item.id}. {item.question}</b><small>{reason} · {item.action}</small></div><MiniIcon name="arrow" /></button>;
                })}
              </div>
            </article>

            <aside className="result-panel status-panel">
              <div className="panel-heading"><div><span className="section-kicker">항목 구성</span><h2>점검 상태</h2></div></div>
              <div className="donut-wrap"><div className="donut" style={{ background: `conic-gradient(#158467 0 ${((counts.yes - counts.evidenceMissing) / applicableChecks.length) * 100}%, #e4ad3a 0 ${((counts.yes) / applicableChecks.length) * 100}%, #c54b49 0 ${((counts.yes + counts.no) / applicableChecks.length) * 100}%, #d9dfe3 0)` }}><span><b>{completed}</b><small>/{applicableChecks.length}</small></span></div></div>
              <ul className="legend"><li><span className="metric-dot green" />충족<b>{counts.yes - counts.evidenceMissing}</b></li><li><span className="metric-dot yellow" />증적 미확인<b>{counts.evidenceMissing}</b></li><li><span className="metric-dot red" />미흡<b>{counts.no}</b></li><li><span className="metric-dot gray" />확인·미답변<b>{counts.unknown + applicableChecks.length - completed}</b></li></ul>
              <button className="secondary-button full" onClick={() => setScreen("check")}>점검 내용 보완하기</button>
            </aside>
          </div>

          <section className="result-cases no-print">
            <div className="panel-heading"><div><span className="section-kicker">실제 조사·처분 사례</span><h2>현재 미흡사항과 관련된 공식 사례</h2></div><button onClick={() => openCases()}>전체 사례 검색 <MiniIcon name="arrow" /></button></div>
            <div className="result-case-grid">
              {Array.from(new Map(attentionItems.flatMap((item) => casesForItem(item.id)).map((record) => [record.id, record])).values()).map((record) => {
                const related = attentionItems.filter((item) => record.itemIds.includes(item.id));
                return <button key={record.id} onClick={() => setSelectedCase(record)}><div className="case-badges"><span className="direct-badge">직접 관련</span><span>{record.date}</span></div><h3>{record.title}</h3><p>{related.slice(0, 2).map((item) => `${item.id}번 ${item.category}`).join(" · ") || record.topics.slice(0, 2).join(" · ")}</p><span className="result-case-more">사례 보기 <MiniIcon name="arrow" /></span></button>;
              })}
              {attentionItems.length === 0 && <div className="result-case-empty"><MiniIcon name="case" /><p><b>현재 미흡사항과 직접 연결된 추천사례가 없습니다.</b><br />전체 사례검색에서는 보호조치가 왜 중요한지 확인할 수 있습니다.</p><button onClick={() => openCases()}>사례 찾아보기</button></div>}
            </div>
          </section>

          <div className="legal-note"><MiniIcon name="scale" /><div><b>법적 판단과 구분해 주세요</b><p>위험도와 우선순위는 자가점검을 위한 보조지표이며 개인정보보호위원회의 공식 평가등급이나 법 위반 판단을 의미하지 않습니다. 관련 법령·사례 확인일: {formatVerifiedDate(CASE_DATA_VERIFIED_AT)}</p></div><a href={privacyNoticeUrl} target="_blank" rel="noreferrer">보-편에서 현행 기준 확인 <MiniIcon name="arrow" /></a></div>

          <section className="print-report">
            <header><BrandMark /><div><span>개인정보 보호조치 자가점검 및 위험도 분석 지원 서비스</span><h1>{serviceName} 결과보고서</h1></div><p>작성일 {new Date().toLocaleDateString("ko-KR")}</p></header>
            <h2>Ⅰ. 위험도 분석 개요</h2>
            <table><tbody><tr><th>기관명</th><td>{profile.organization || "-"}</td><th>기관 유형</th><td>{profile.organizationType}</td></tr><tr><th>대상 시스템</th><td>{profile.systemName || "-"}</td><th>개인정보파일</th><td>{profile.fileName || "-"}</td></tr><tr><th>처리 목적</th><td colSpan={3}>{profile.purpose || "-"}</td></tr><tr><th>정보주체 수</th><td>{profile.dataSubjects ? `${Number(profile.dataSubjects).toLocaleString()}명` : "-"}</td><th>취급자 수</th><td>{profile.handlers ? `${Number(profile.handlers).toLocaleString()}명` : "-"}</td></tr></tbody></table>
            <h2>Ⅱ. 개인정보파일 현황</h2>
            <table><tbody><tr><th>고유식별정보</th><td>{profile.identifiers.join(", ") || "해당 없음"}</td><th>저장 방식</th><td>{{ all: "모두 암호화", partial: "일부 암호화", none: "암호화하지 않음", unknown: "확인 필요" }[profile.storage]}</td></tr><tr><th>민감정보</th><td>{profile.sensitive ? "처리" : "미처리"}</td><th>홈페이지</th><td>{profile.website ? "운영" : "미운영"}</td></tr></tbody></table>
            <h2>Ⅲ. 점검 결과</h2>
            <div className="report-summary"><span>충족 <b>{counts.yes - counts.evidenceMissing}</b></span><span>증적 미확인 <b>{counts.evidenceMissing}</b></span><span>미흡 <b>{counts.no}</b></span><span>확인 필요 <b>{counts.unknown + applicableChecks.length - completed}</b></span></div>
            <table className="report-table"><thead><tr><th>번호</th><th>점검항목</th><th>결과</th><th>증적</th><th>안내서</th></tr></thead><tbody>{applicableChecks.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.question}</td><td>{answers[item.id] ? answerLabel[answers[item.id]] : "미답변"}</td><td>{(evidence[item.id] ?? []).map((entry) => entry.title).join(", ") || "-"}</td><td>{item.page}</td></tr>)}</tbody></table>
            <h2>Ⅳ. 주요 미흡사항 및 개선계획</h2>
            {attentionItems.length ? attentionItems.map((item) => { const relatedCases = casesForItem(item.id); return <div className="report-action" key={item.id}><h3>{item.id}. {item.question}</h3><p><b>현재 상태</b> {answers[item.id] === "no" ? "미흡" : answers[item.id] === "yes" ? "증적 미확인" : "추가 확인 필요"}</p><p><b>개선 우선순위</b> {item.priority}</p><p><b>권고 조치</b> {item.action}</p><p><b>관련 근거</b> {item.law} / {item.standard} / {item.page}</p>{relatedCases.length > 0 && <div><b>참고 조사·처분 사례 ({relatedCases.length}건)</b><ul>{relatedCases.map((record) => <li key={record.id}>{record.title} ({record.date}, {record.sourceType}) — {record.relation}</li>)}</ul></div>}</div>; }) : <p>현재 입력 기준 주요 미흡사항 없음.</p>}
            <h2>Ⅴ. 위험도 분석 결과</h2>
            <p>{evaluation.message} · 우선순위 {evaluation.priority}</p>
            <p>{counts.no > 0 ? "위험도 분석 점검항목에 ‘아니요’가 존재합니다. 안내서에 따라 암호화에 상응하는 충분한 안전조치가 이루어졌다고 보기 어려우므로 미흡조치를 이행하거나 해당 개인정보파일을 암호화해야 합니다." : "현재 입력 기준 ‘아니요’ 항목은 없습니다. 다만 증적의 적정성과 실제 보호조치 이행 여부를 개인정보 보호책임자 또는 해당 부서장이 최종 확인해야 합니다."}</p>
            <footer>본 결과는 개인정보처리자의 개인정보 보호조치 이행 현황을 스스로 확인하기 위한 자가점검 결과입니다. 행정기관의 공식적인 법 위반 판단 또는 처분 결과를 의미하지 않습니다. 법령은 점검일 현재 시행 중인 규정을 기준으로 확인하여야 합니다.</footer>
          </section>
        </section>);
}
