import type { State, Evaluated } from './types';
import { conditions } from './applicability-engine';
import { bucketLabels, summarize, riskConclusion, labels, activeRows } from './evaluation-engine';
import { disclaimer, dateNotice } from '../../data/safeguards/index';
export function createReport(state:State, rows:Evaluated[], now=new Date()) {
 const active=activeRows(rows,state);
 return { tool:'grasshopper-safeguards-check',createdAt:now.toISOString(),state,conditions:conditions(state),
  summary:Object.fromEntries(Object.keys(bucketLabels).map(k=>[k,summarize(active.filter(r=>r.bucket===k))])),
  riskConclusion:riskConclusion(rows,state),
  results:rows.map(r=>({id:r.question.id,article:r.question.article,question:r.question.question,sourceVersion:r.question.sourceVersion,bucket:r.bucket,applicability:r.applicable,applicabilityReason:r.applicabilityReason,mode:r.bucket==='readiness'?'준비평가':r.question.evaluationMode,displayAnswer:r.applicable==='NO'?'비적용 문항':r.bucket==='risk'&&conditions(state).R.value!=='YES'?'모듈 비활성':labels[r.answer],...r.response,evaluatedAnswer:r.answer,stale:r.stale})),
  improvements:active.filter(r=>['FAIL','NEEDS_REVIEW'].includes(r.answer)).map(r=>({id:r.question.id,article:r.question.article,issue:r.response.reason||r.question.question,action:r.question.passCriteria,evidence:r.question.evidenceExamples,bucket:r.bucket})),
  disclaimer,dateNotice};
}
