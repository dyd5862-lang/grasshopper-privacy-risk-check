import { applicabilityQuestions, sourceVersion } from '../../data/safeguards/index';
import { fields, triOptions } from '../../data/safeguards/fields';
import { conditions } from '../../lib/safeguards/applicability-engine';
import type { State, Tri } from '../../lib/safeguards/types';
import styles from './safeguards.module.css';
export const triLabels:Record<Tri,string>={YES:'해당',NO:'비해당',UNKNOWN:'추가 확인'};
export function ConditionSummary({state}:{state:State}) {
 return <div className={styles.conditions}>{Object.entries(conditions(state)).map(([key,c])=><div className={styles.condition} key={key}><b>{key} · {triLabels[c.value]}</b><p>{c.reason}</p></div>)}</div>;
}
export function ApplicabilityCheck({state,update}:{state:State;update:(s:State)=>void}) {
 return <section className={styles.panel}><h2>01. 점검대상 확인</h2><p className={styles.muted}>15개 사전 확인항목입니다. 모르는 값은 ‘추가 확인’으로 유지하세요. 같은 기관에 여러 유형이 있으면 각각 확인합니다. 실제 실적이 없다는 이유만으로 업무·체계를 ‘아니요’로 선택하지 마세요.</p>
 {applicabilityQuestions.map(q=><details className={styles.fact} key={q.id} open={['F-01','F-02','F-03','F-04'].includes(q.id)?true:undefined}>
 <summary><span className={styles.badge}>{q.id}</span>{q.question}</summary><p>{q.article} · {q.applicability}</p>
 <div className={styles.grid}>{fields[q.id].map(field=><label className={styles.field} key={field.key}>{field.label}{field.number?<input type="number" min="0" step="1" value={state.facts[field.key]??''} onChange={e=>update({...state,facts:{...state.facts,[field.key]:e.target.value}})}/>:<select aria-label={field.label} value={state.facts[field.key]??'UNKNOWN'} onChange={e=>update({...state,facts:{...state.facts,[field.key]:e.target.value}})}>{(field.options??triOptions).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select>}</label>)}</div>
 {q.id==='F-02'&&<p>내부 관리계획 수립 대상 M: <b>{triLabels[conditions(state).M.value]}</b> — 시스템별 인원으로 나누어 판단하지 않습니다.</p>}
 {q.id==='F-03'&&<p>F-01 유형과 F-02 인원을 이용한 규모조건 G: <b>{triLabels[conditions(state).G.value]}</b></p>}
 {q.id==='F-10'&&<p>F-06의 고유식별·민감정보 처리 여부도 함께 반영합니다. 해당 시스템 기준으로 응답하세요.</p>}
 {q.id==='F-14'&&<p className={styles.warning}>동일 기관에 여러 정보가 있어도 이번 암호화 판단 대상의 유형·저장 위치를 구분하세요. 영향평가 대상이면 부록 위험도 분석 대신 영향평가 결과 경로를 확인합니다.</p>}
 {q.id==='F-15'&&<p>점검일: {state.profile.date||'추가 확인'}<br/>적용 기준: {sourceVersion}</p>}
 <label className={styles.field}>{q.id==='F-11'?'지정 공고·통보의 확인근거 (지정 여부 판단에 필요)':'확인근거·내부 참조'}<textarea aria-label={q.id==='F-11'?'지정 공고·통보의 확인근거 (지정 여부 판단에 필요)':'확인근거·내부 참조'} value={state.factNotes[q.id]??''} placeholder={q.evidenceExamples} maxLength={2000} onChange={e=>update({...state,factNotes:{...state.factNotes,[q.id]:e.target.value}})}/></label>
 </details>)}
 </section>;
}
