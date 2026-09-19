import type { State, Answer } from './types';
import { sourceVersion } from '../../data/safeguards/index';
export const storageKey='grasshopper-safeguards-check-v1';
export function today(now=new Date()) { return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; }
export function initialState(date=today()): State {
 return {schemaVersion:1,sourceVersion,profile:{organization:'',systemName:'',fileName:'',date},facts:{},factNotes:{},responses:{},scopes:{}};
}
export function parseState(raw:string): State {
 const p=JSON.parse(raw);
 if(p?.schemaVersion!==1 || p.sourceVersion!==sourceVersion)throw Error('저장된 점검 기준 버전이 다릅니다. 데이터를 보존하고 새 점검을 시작하거나 별도 검토하세요.');
 const s=initialState();
 for(const key of ['organization','systemName','fileName','date'] as const) if(typeof p.profile?.[key]==='string')s.profile[key]=p.profile[key];
 for(const key of ['facts','factNotes'] as const) for(const [k,v] of Object.entries(p[key]??{}))if(typeof v==='string')s[key][k]=v;
 const answers:Answer[]=['PASS','FAIL','NEEDS_REVIEW','NOT_APPLICABLE','UNANSWERED'];
 for(const [id,raw] of Object.entries(p.responses??{})) {
  if(!raw || typeof raw!=='object')continue;
  const r=raw as Record<string,unknown>;
  s.responses[id]={answer:answers.includes(r.answer as Answer)?r.answer as Answer:'UNANSWERED',reason:typeof r.reason==='string'?r.reason:'',evidenceRef:typeof r.evidenceRef==='string'?r.evidenceRef:'',checkedAt:typeof r.checkedAt==='string'?r.checkedAt:'',context:typeof r.context==='string'?r.context:''};
 }
 for(const [id,raw] of Object.entries(p.scopes??{})) {
  if(!raw || typeof raw!=='object')continue;
  const r=raw as Record<string,unknown>;
  s.scopes[id]={value:r.value==='YES'?'YES':r.value==='NO'?'NO':'UNKNOWN',reason:typeof r.reason==='string'?r.reason:'',evidenceRef:typeof r.evidenceRef==='string'?r.evidenceRef:'',context:typeof r.context==='string'?r.context:''};
 }
 return s;
}
export function clearState(store:Pick<Storage,'removeItem'>){store.removeItem(storageKey);}
