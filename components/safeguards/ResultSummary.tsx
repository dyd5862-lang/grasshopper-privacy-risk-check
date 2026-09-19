import type { State, Evaluated, Answer } from '../../lib/safeguards/types';
import { activeRows, bucketLabels, labels, summarize, riskConclusion, validDate } from '../../lib/safeguards/evaluation-engine';
import { conditions } from '../../lib/safeguards/applicability-engine';
import { ConditionSummary } from './ApplicabilityCheck';
import { ImprovementTasks } from './ImprovementTasks';
import { fields, triOptions } from '../../data/safeguards/fields';
import { disclaimer, dateNotice, sourceVersion, applicabilityQuestions } from '../../data/safeguards/index';
import styles from './safeguards.module.css';
export function ResultSummary({state,rows}:{state:State;rows:Evaluated[]}) {
 const active=activeRows(rows,state), c=conditions(state);
 const unresolved=Object.entries(c).filter(([,v])=>v.value==='UNKNOWN');
 return <div data-testid="safeguards-report">
 <section className={styles.panel}><h2>개인정보 안전성 확보조치 점검 결과보고서</h2><div className={styles.grid}><p>기관·사업자명: {state.profile.organization||'미기재'}<br/>시스템명: {state.profile.systemName||'미기재'}<br/>개인정보파일명: {state.profile.fileName||'미기재'}</p><p>점검일: {state.profile.date||'추가 확인'}<br/>적용 기준: {sourceVersion}</p></div>
 <p className={styles.warning}>{dateNotice}</p>
 {(!validDate(state.profile.date)||unresolved.length>0)&&<p className={styles.warning}>점검 미완료 — {unresolved.map(([k])=>k).join('·')}{!validDate(state.profile.date)?' 점검일':''}의 추가 확인이 필요합니다. 숨겨진 모듈을 충족으로 간주하지 않습니다.</p>}
 <h3>적용대상과 판단 근거</h3><ConditionSummary state={state}/>
 <details className={styles.help}><summary>사전확인 입력·근거 확인</summary><FactDetails state={state}/></details></section>
 {Object.entries(bucketLabels).map(([bucket,title])=>{const rr=active.filter(r=>r.bucket===bucket),s=summarize(rr);return <section className={`${styles.panel} ${bucket==='readiness'?styles.preparation:''}`} key={bucket} data-bucket={bucket}><h2>{title}</h2><b>{bucket==='risk'&&c.R.value!=='YES'?(c.R.value==='NO'?'비적용 · 모듈 비활성':'적용대상 추가 확인 · 모듈 비활성'):s.message}</b><p className={styles.muted}>적용 확인 {s.applied} · 적용조건 추가 확인 {s.pending} · 집계 대상 {s.total}</p><div className={styles.metrics}>{Object.entries(labels).map(([key,label])=><div data-answer={key} key={key}>{label}<strong>{s.counts[key as Answer]}<small>건</small></strong></div>)}</div>{bucket==='risk'&&<p>{riskConclusion(rows,state)}</p>}{bucket==='readiness'&&<p className={styles.muted}>시행 전 개정 문언의 준비상태입니다. 현재 의무의 미흡 판정과 분리합니다.</p>}</section>;})}
 <ImprovementTasks rows={active}/>
 <section className={`${styles.panel} ${styles.printBreak}`}><h2>조문별 세부 결과</h2><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>ID·조문</th><th>점검질문·평가영역</th><th>판정·적용조건</th><th>판단 사유·증적 참조·확인일</th></tr></thead><tbody>{rows.map(r=><tr key={r.question.id}><td>{r.question.id}<br/>{r.question.article}</td><td>{r.question.question}<br/><small>{bucketLabels[r.bucket]}</small></td><td>{r.applicable==='NO'?'비적용 문항':r.bucket==='risk'&&c.R.value!=='YES'?'모듈 비활성':labels[r.answer]}<br/>{r.question.applicability}{r.applicable==='UNKNOWN'&&<p>적용조건 추가 확인</p>}</td><td className={styles.detailsText}>{r.response.reason||'사유 미기재'}<br/>{r.response.evidenceRef||'증적 참조 미기재'}<br/>{r.response.checkedAt||'확인일 미기재'}{r.stale&&<p>조건 변경: 이전 답변 재확인 필요</p>}{state.scopes[r.question.id]&&<p>범위 확인: {state.scopes[r.question.id].reason} · {state.scopes[r.question.id].evidenceRef}</p>}</td></tr>)}</tbody></table></div></section>
 <section className={styles.printOnly}><h2>사전 확인 정보·근거</h2><FactDetails state={state}/></section>
 <p className={styles.footer}>{disclaimer}</p>
 </div>;
}

function FactDetails({state}:{state:State}) {
 return <div>{applicabilityQuestions.map(q=><article key={q.id}><b>{q.id} · {q.question}</b>{fields[q.id].map(f=><p key={f.key}>{f.label}: {f.number?(state.facts[f.key]||'추가 확인'):(f.options??triOptions).find(([v])=>v===(state.facts[f.key]??'UNKNOWN'))?.[1]||'추가 확인'}</p>)}{q.id==='F-03'&&<p>F-01·F-02 유형 및 인원에 따른 규모조건: {conditions(state).G.value==='YES'?'해당':conditions(state).G.value==='NO'?'비해당':'추가 확인'}</p>}{q.id==='F-15'&&<p>{state.profile.date} · {sourceVersion}</p>}<p>확인근거: {state.factNotes[q.id]||'미기재'}</p></article>)}</div>;
}
