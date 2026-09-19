import type { Evaluated, Response, ScopeConfirmation } from '../../lib/safeguards/types';
import { labels } from '../../lib/safeguards/evaluation-engine';
import styles from './safeguards.module.css';
export function ChecklistItem({row,scope,onResponse,onScope}:{row:Evaluated;scope?:ScopeConfirmation;onResponse:(r:Response,confirm?:boolean)=>void;onScope:(s:ScopeConfirmation)=>void}) {
 const q=row.question,r=row.response;
 return <article id={q.id} className={`${styles.item} ${row.bucket==='readiness'?styles.preparation:''}`}>
 <span className={styles.badge}>{q.id}</span><span className={styles.badge}>{row.applicable==='UNKNOWN'?'적용조건 추가 확인':labels[row.answer]}</span>{row.bucket==='readiness'&&<span className={styles.badge}>2026.11.1 시행 예정 — 준비평가</span>}
 <p className={styles.meta}>{q.article}</p><h3>{q.question}</h3><p className={styles.meta}><b>적용조건</b> · {q.applicability}</p>
 {row.needsScope&&<div className={styles.note}><label className={styles.field}>이 문항의 대상·업무·예외 조건을 확인했나요?<select aria-label={`${q.id} 적용조건 확인`} value={scope?.value??'UNKNOWN'} onChange={e=>onScope({value:e.target.value as ScopeConfirmation['value'],reason:scope?.reason??'',evidenceRef:scope?.evidenceRef??'',context:''})}><option value="UNKNOWN">추가 확인</option><option value="YES">적용조건에 해당함</option><option value="NO">대상·업무 자체가 없어 비적용 (근거 필요)</option></select></label>
 <p>현재 실적이 없는 경우에도 절차·설정으로 준비상태를 확인하세요. 사전조건이 미확인이라면 이 선택만으로 적용 여부가 확정되지 않습니다.</p>
 {scope?.value==='NO'&&<div className={styles.grid}><label className={styles.field}>비적용 사유<input value={scope.reason} onChange={e=>onScope({...scope,reason:e.target.value})}/></label><label className={styles.field}>비적용 확인근거·내부 참조<input value={scope.evidenceRef} onChange={e=>onScope({...scope,evidenceRef:e.target.value})}/></label></div>}
 </div>}
 {row.stale&&<p className={styles.warning}>적용조건 또는 점검일이 변경되었습니다. 이전 입력은 보존했으며, 다시 확인하여 응답을 선택해 주세요.</p>}
 <fieldset className={styles.answers}><legend>{q.id} 점검 응답</legend>{Object.entries(labels).map(([value,label])=><label key={value}><input type="radio" name={`answer-${q.id}`} value={value} checked={!row.stale && r.answer===value} onChange={()=>onResponse({...r,answer:value as Response['answer']},true)}/>{label}</label>)}</fieldset>
 {r.answer==='NOT_APPLICABLE'&&<p className={styles.warning}>‘해당 없음’은 사유와 확인근거를 모두 기록해야 인정됩니다. 기록 전에는 결과에 ‘추가 확인’으로 집계합니다.</p>}
 {row.applicable==='UNKNOWN'&&<p className={styles.muted}>적용조건이 확정될 때까지 ‘충족’ 응답도 결과에서는 ‘추가 확인’으로 표시합니다.</p>}
 <div className={styles.grid}><label className={styles.field}>판단 사유·마스킹된 설명<textarea aria-label="판단 사유·마스킹된 설명" value={r.reason} maxLength={4000} onChange={e=>onResponse({...r,reason:e.target.value})}/></label><label className={styles.field}>증적명·내부 문서번호 또는 참조<textarea aria-label="증적명·내부 문서번호 또는 참조" value={r.evidenceRef} maxLength={2000} placeholder="실제 증적 파일은 업로드하지 않습니다." onChange={e=>onResponse({...r,evidenceRef:e.target.value})}/></label><label className={styles.field}>확인일<input type="date" value={r.checkedAt} onChange={e=>onResponse({...r,checkedAt:e.target.value})}/></label></div>
 <details className={styles.help}><summary>근거·증적·판단기준 펼쳐보기</summary><dl><dt>근거 성격</dt><dd>{q.basisType}</dd><dt>점검 단위</dt><dd>{q.scopeKey}</dd><dt>증적 예시</dt><dd>{q.evidenceExamples}</dd><dt>충족 기준</dt><dd>{q.passCriteria}</dd><dt>미흡 기준</dt><dd>{q.failCriteria}</dd><dt>출처 페이지</dt><dd>{q.sourcePages}</dd><dt>시행 시점</dt><dd>{q.effectiveFrom?`${q.effectiveFrom} 개정 문언 적용. 그 전에는 준비평가이며 종전 의무 별도 확인.`:'이 기준자료의 일반 평가항목. 과거 최초 시행일은 별도 이력 확인.'}</dd></dl></details>
 </article>;
}
