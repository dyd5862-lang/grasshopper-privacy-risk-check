import type { State, Question, Evaluated, Answer, Response } from './types';
import { gate, contextKey, conditions } from './applicability-engine';
export const labels: Record<Answer,string> = {PASS:'충족',FAIL:'미흡',NEEDS_REVIEW:'추가 확인',NOT_APPLICABLE:'해당 없음',UNANSWERED:'미답변'};
export const emptyResponse = (): Response => ({answer:'UNANSWERED',reason:'',evidenceRef:'',checkedAt:'',context:''});
export function validDate(date:string): boolean { return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0,10)===date; }
export function evaluate(q: Question, state: State): Evaluated {
 const g=gate(q,state), response=state.responses[q.id]??emptyResponse();
 const stale=response.answer!=='UNANSWERED' && response.context!==contextKey(state);
 let answer=response.answer;
 if(answer !== 'UNANSWERED' && (stale || g.value==='UNKNOWN' || !validDate(state.profile.date)))answer='NEEDS_REVIEW';
 if(answer==='NOT_APPLICABLE' && (!response.reason.trim() || !response.evidenceRef.trim()))answer='NEEDS_REVIEW';
 const preparation=!!q.effectiveFrom && (!validDate(state.profile.date) || state.profile.date < q.effectiveFrom);
 return {question:q,applicable:g.value,applicabilityReason:g.reason,needsScope:g.needsScope,response,answer,stale,
  bucket:preparation?'readiness':q.group==='public-system'?'public':q.group==='encryption-risk'?'risk':'general'};
}
export const bucketLabels = {general:'일반 안전조치',public:'공공시스템 추가 조치',risk:'암호화 미적용 위험도 분석',readiness:'2026-11-01 개정 준비평가'};
export function activeRows(rows: Evaluated[], state: State): Evaluated[] {
 return rows.filter(r=>r.applicable!=='NO' && (r.bucket!=='risk' || conditions(state).R.value==='YES'));
}
export function summarize(rows: Evaluated[]) {
 const counts:Record<Answer,number>={PASS:0,FAIL:0,NEEDS_REVIEW:0,NOT_APPLICABLE:0,UNANSWERED:0};
 const included=rows.filter(r=>r.applicable!=='NO');
 for(const r of included) counts[r.answer]++;
 const pending=included.filter(r=>r.applicable==='UNKNOWN').length;
 const message=counts.FAIL ? '미흡 사항 우선 개선' : counts.UNANSWERED || counts.NEEDS_REVIEW || pending ? '점검 미완료' : !included.length ? '적용문항 없음' : counts.PASS ? '확인한 적용항목 충족' : '해당 없음 근거 확인 완료';
 return {counts,total:included.length,applied:included.filter(r=>r.applicable==='YES').length,pending,completed:included.length-counts.UNANSWERED,message};
}
export function riskConclusion(rows: Evaluated[], state: State): string {
 if(conditions(state).R.value!=='YES')return '암호화 미적용 위험도 분석 대상이 확인되지 않았습니다. F-14의 적용대상·평가경로를 확인하세요.';
 const r=rows.filter(r=>r.bucket==='risk' && r.applicable!=='NO');
 if(r.some(x=>x.answer==='FAIL'))return '필요한 보호조치를 시행하거나 해당 개인정보파일을 암호화하는 방향으로 검토해야 합니다. 미답변·추가 확인도 함께 해소하세요.';
 if(r.some(x=>x.applicable==='UNKNOWN' || ['UNANSWERED','NEEDS_REVIEW'].includes(x.answer)))return '점검 미완료 — 미답변·추가 확인 또는 적용조건 확인이 남아 있습니다. 암호화 미적용 가능 여부를 결론 내릴 수 없습니다.';
 return '위험도 분석 점검항목은 모두 확인되었습니다. 실제 암호화 적용 여부는 적용대상, 증적, 승인 및 운영환경 등을 함께 검토해야 합니다.';
}
