import type { State, Evaluated, Response, ScopeConfirmation } from '../../lib/safeguards/types';
import { ChecklistItem } from './ChecklistItem';
import { contextKey, conditions } from '../../lib/safeguards/applicability-engine';
import styles from './safeguards.module.css';
export function ChecklistSection({rows,state,onResponse,onScope}:{rows:Evaluated[];state:State;onResponse:(id:string,r:Response,confirm?:boolean)=>void;onScope:(id:string,s:ScopeConfirmation)=>void}) {
 const active=rows.filter(r=>r.applicable!=='NO' && (r.bucket!=='risk'||conditions(state).R.value==='YES'));
 const excluded=rows.filter(r=>r.applicable==='NO');
 return <section>
 {active.length===0&&<p className={styles.empty}>현재 조건에서 활성화된 문항이 없습니다. 적용대상이 불명확하면 대상 확인 단계에서 ‘추가 확인’으로 기록하세요.</p>}
 {active.map(row=><ChecklistItem key={row.question.id} row={row} scope={state.scopes[row.question.id]?.context===contextKey(state)?state.scopes[row.question.id]:undefined} onResponse={(r,confirm)=>onResponse(row.question.id,r,confirm)} onScope={s=>onScope(row.question.id,s)}/>)}
 {excluded.length>0&&<details className={styles.panel}><summary>비적용 문항 {excluded.length}개 · 사유 및 보존 답변</summary><p className={styles.muted}>사용자의 ‘해당 없음’ 응답과 구분하며 결과 집계에서 제외합니다.</p>{excluded.map(r=><div className={styles.fact} key={r.question.id}><b>{r.question.id} · {r.question.question}</b><p>{r.applicabilityReason}</p>{state.scopes[r.question.id]&&<p>{state.scopes[r.question.id].reason} · {state.scopes[r.question.id].evidenceRef}</p>}<p>기존 입력은 데이터 저장 시 함께 보존됩니다.</p>{r.needsScope&&<button className={styles.secondary} onClick={()=>onScope(r.question.id,{value:'UNKNOWN',reason:'',evidenceRef:'',context:''})}>문항별 적용조건 다시 확인</button>}</div>)}</details>}
 </section>;
}
