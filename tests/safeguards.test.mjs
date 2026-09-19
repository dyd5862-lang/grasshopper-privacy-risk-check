import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadTypeScript } from './helpers/load-typescript.mjs';
const load=p=>loadTypeScript(p,import.meta.url);
const {questions,applicabilityQuestions,generalQuestions,publicQuestions,riskQuestions}=await load('../data/safeguards/index.ts');
const {initialState,parseState,clearState,storageKey}=await load('../lib/safeguards/storage.ts');
const {conditions,contextKey,gate}=await load('../lib/safeguards/applicability-engine.ts');
const {evaluate,summarize,activeRows,riskConclusion}=await load('../lib/safeguards/evaluation-engine.ts');
const {createReport}=await load('../lib/safeguards/report.ts');
const q=id=>questions.find(q=>q.id===id);
const sample=(facts={},date='2026-11-01')=>({...initialState(date),facts:{entity:'public',count:'120000',system:'YES',designated:'NO',riskIntent:'NO',...facts}});
const response=(s,id,answer,reason='',evidenceRef='')=>{s.responses[id]={answer,reason,evidenceRef,checkedAt:s.profile.date,context:contextKey(s)};return s;};
const scope=(s,id,value='YES')=>{s.scopes[id]={value,reason:'대상범위 확인',evidenceRef:'내부 확인문서',context:contextKey(s)};return s;};
const riskState=()=>sample({riskIntent:'YES',riskSubject:'nonuser',riskType:'otherUid',riskLocation:'internal',nonUserInfo:'YES',otherUid:'YES',internal:'YES',dpia:'NO',outsourcing:'YES',web:'YES'});

test('157 IDs and exact counts: 15 + 89 + 24 + 26 + 3; 113 core',()=>{
 assert.deepEqual([applicabilityQuestions.length,generalQuestions.length,publicQuestions.length,riskQuestions.filter(q=>Number(q.id.slice(2))<=26).length,riskQuestions.filter(q=>Number(q.id.slice(2))>=27).length],[15,89,24,26,3]);
 const all=[...applicabilityQuestions,...questions];assert.equal(all.length,157);assert.equal(new Set(all.map(q=>q.id)).size,157);assert.equal(generalQuestions.length+publicQuestions.length,113);
 const expected={F:15,B:1,M:27,A:7,N:8,I:6,E:14,L:8,V:4,P:4,D:3,O:3,X:4,S:10,H:6,T:3,G:5,R:29};
 assert.deepEqual(all.map(q=>q.id).sort(),Object.entries(expected).flatMap(([p,n])=>Array.from({length:n},(_,i)=>`${p}-${String(i+1).padStart(2,'0')}`)).sort());
});
test('every source cell is preserved exactly, including question, ID, article, applicability, evidence and criteria',()=>{
 const lines=fs.readFileSync(new URL('../data/safeguards/source.md',import.meta.url),'utf8').split('\n').filter(l=>/^\|[A-Z]-\d\d\|/.test(l));
 for(const row of [...applicabilityQuestions,...questions]){
  assert.ok(lines.includes(row.sourceRow),row.id);
  const c=row.sourceRow.slice(1,-1).split('|');assert.deepEqual([row.id,row.article,row.question,row.applicability,row.evidenceExamples],c.slice(0,5));
  if(!row.id.startsWith('F-')){assert.equal(row.criteria,c[5]);assert.ok(row.passCriteria&&row.failCriteria,row.id);}
  for(const key of ['sourceVersion','basisType','sourcePages','scopeKey','question','applicability'])assert.ok(row[key],`${row.id}:${key}`);
 }
});
test('general institution does not acquire public-system obligations from size',()=>{
 const s=sample({count:'5000000',operator:'YES',userAgency:'YES',directAccounts:'YES',developer:'YES'});
 assert.equal(conditions(s).G.value,'YES');assert.equal(conditions(s).P.value,'NO');assert.equal(conditions(s).U.value,'NO');
 for(const q of publicQuestions)assert.equal(gate(q,s).value,'NO',q.id);
});
test('M exception: small operator under 10k; education and vendor duties not automatically excluded',()=>{
 const s=sample({entity:'small',count:'9999',education:'YES',outsourcing:'YES'});
 assert.equal(conditions(s).M.value,'NO');assert.equal(gate(q('M-01'),s).value,'NO');
 assert.equal(gate(q('M-20'),s).value,'YES');assert.equal(gate(q('M-21'),s).value,'YES');assert.equal(gate(q('M-27'),s).value,'YES');
 s.facts.count='10000';assert.equal(conditions(s).M.value,'YES');
});
test('G thresholds for public and SME, unknown count is not false',()=>{
 for(const [entity,count,value] of [['public','99999','NO'],['public','100000','YES'],['sme','999999','NO'],['sme','1000000','YES'],['sme','','UNKNOWN']])assert.equal(conditions(sample({entity,count})).G.value,value);
});
test('I uses stored-user daily average, not general size; admin rights branch',()=>{
 const s=sample({millionUsers:'YES',adminRights:'YES',downloadRights:'NO'});
 assert.equal(gate(q('I-01'),s).value,'YES');assert.equal(gate(q('I-02'),s).value,'NO');
 s.facts.millionUsers='UNKNOWN';assert.equal(conditions(s).I.value,'UNKNOWN');
});
test('designation requires evidence; P gets S/H/T and U gets only applicable H',()=>{
 const s=sample({designated:'YES',operator:'YES',userAgency:'NO',directAccounts:'NO'});
 assert.equal(conditions(s).P.value,'UNKNOWN');s.factNotes['F-11']='지정 통보 내부문서';
 assert.equal(gate(q('S-01'),s).value,'YES');assert.equal(gate(q('H-01'),s).value,'YES');assert.equal(gate(q('T-01'),s).value,'YES');
 s.facts.operator='NO';s.facts.userAgency='YES';s.facts.directAccounts='YES';
 assert.equal(conditions(s).U.value,'YES');assert.equal(gate(q('H-02'),s).value,'YES');assert.equal(gate(q('H-06'),s).value,'YES');
 assert.equal(gate(q('H-01'),s).value,'NO');assert.equal(gate(q('S-01'),s).value,'NO');assert.equal(gate(q('T-01'),s).value,'NO');
});
test('non-account-managing user agency still retains G-05 event scope',()=>{
 const s=sample({designated:'YES',operator:'NO',userAgency:'YES',directAccounts:'NO'});s.factNotes['F-11']='지정문서';scope(s,'G-05');
 assert.equal(conditions(s).U.value,'NO');assert.equal(gate(q('G-05'),s).value,'YES');
});
test('public development/distribution role preserves G-02',()=>{
 const s=sample({designated:'YES',operator:'NO',developer:'YES'});s.factNotes['F-11']='지정문서';assert.equal(gate(q('G-02'),s).value,'YES');
});
test('R enabled only for qualified non-user other UID internal risk route',()=>{
 const s=riskState();assert.equal(conditions(s).R.value,'YES');assert.equal(gate(q('R-01'),s).value,'YES');
 for(const [key,value] of [['riskType','rrn'],['riskType','other'],['riskSubject','user'],['riskLocation','internet'],['riskLocation','dmz'],['dpia','YES'],['riskIntent','NO']]){
  const v=riskState();v.facts[key]=value;assert.equal(conditions(v).R.value,'NO',key);for(const rq of riskQuestions)assert.equal(gate(rq,v).value,'NO',rq.id);
 }
});
test('unknown R does not expose the 29-item module or produce an exemption conclusion',()=>{
 const s=riskState();s.facts.dpia='UNKNOWN';assert.equal(conditions(s).R.value,'UNKNOWN');
 assert.equal(activeRows(riskQuestions.map(q=>evaluate(q,s)),s).length,0);assert.match(riskConclusion([],s),/대상이 확인되지/);
});
test('mixed organization does not exclude properly separated non-user R scope',()=>{
 const s=riskState();s.facts.rrn='YES';s.facts.userInfo='YES';assert.equal(conditions(s).R.value,'YES');
});
test('L1/L2 mutually exclusive and both retained unknown when eligibility unresolved',()=>{
 const s=sample({system50k:'NO',rrn:'NO',otherUid:'NO',sensitive:'NO',telco:'NO'});
 assert.equal(gate(q('L-03'),s).value,'YES');assert.equal(gate(q('L-04'),s).value,'NO');
 s.facts.telco='YES';assert.equal(gate(q('L-03'),s).value,'NO');assert.equal(gate(q('L-04'),s).value,'YES');
 s.facts.telco='UNKNOWN';assert.equal(gate(q('L-03'),s).value,'UNKNOWN');assert.equal(gate(q('L-04'),s).value,'UNKNOWN');
});
test('exactly 13 delayed rows switch on 2026-11-01; R-20 never delayed',()=>{
 const expected=['M-13','M-14','A-01','A-07','N-03','N-04',...Array.from({length:7},(_,i)=>`L-0${i+1}`)].sort();
 assert.deepEqual(questions.filter(q=>q.effectiveFrom).map(q=>q.id).sort(),expected);
 for(const id of expected){assert.equal(evaluate(q(id),sample({},'2026-10-31')).bucket,'readiness');assert.equal(evaluate(q(id),sample({},'2026-11-01')).bucket,'general');}
 assert.equal(evaluate(q('R-20'),riskState()).bucket,'risk');
});
test('initial unanswered is never pass or NA; zero failures with unanswered remains incomplete',()=>{
 const s=sample(),r=evaluate(q('B-01'),s),sum=summarize([r]);assert.equal(r.answer,'UNANSWERED');assert.equal(sum.counts.PASS,0);assert.equal(sum.counts.NOT_APPLICABLE,0);assert.equal(sum.message,'점검 미완료');
});
test('needs review and unknown applicability never count as passed',()=>{
 const s=sample();response(s,'B-01','NEEDS_REVIEW');assert.equal(summarize([evaluate(q('B-01'),s)]).message,'점검 미완료');
 s.facts.system='UNKNOWN';response(s,'A-01','PASS');assert.equal(evaluate(q('A-01'),s).answer,'NEEDS_REVIEW');
});
test('NA requires both reason and reference; conditions-based exclusion remains separate',()=>{
 const s=sample();response(s,'B-01','NOT_APPLICABLE');assert.equal(evaluate(q('B-01'),s).answer,'NEEDS_REVIEW');
 response(s,'B-01','NOT_APPLICABLE','사유','내부근거');assert.equal(evaluate(q('B-01'),s).answer,'NOT_APPLICABLE');
 const excluded=evaluate(q('S-01'),s);assert.equal(excluded.applicable,'NO');assert.equal(excluded.response.answer,'UNANSWERED');assert.equal(summarize([excluded]).total,0);
});
test('missing evidence alone does not turn a confirmed affirmative response into a failure',()=>{
 const s=response(sample(),'B-01','PASS');assert.equal(evaluate(q('B-01'),s).answer,'PASS');
});
test('failure retains unanswered and review counts; completion is cautiously worded',()=>{
 const s=sample();response(s,'B-01','FAIL');response(s,'M-01','NEEDS_REVIEW');
 const sum=summarize(['B-01','M-01','M-02'].map(id=>evaluate(q(id),s)));assert.equal(sum.counts.FAIL,1);assert.equal(sum.counts.NEEDS_REVIEW,1);assert.equal(sum.counts.UNANSWERED,1);assert.equal(sum.message,'미흡 사항 우선 개선');
 response(s,'B-01','PASS');assert.equal(summarize([evaluate(q('B-01'),s)]).message,'확인한 적용항목 충족');
});
test('condition/date changes retain raw answer but require recheck; note edit cannot confirm stale answer',()=>{
 const s=response(sample(),'B-01','PASS');s.profile.date='2026-10-31';assert.equal(evaluate(q('B-01'),s).answer,'NEEDS_REVIEW');assert.equal(s.responses['B-01'].answer,'PASS');
 s.responses['B-01'].reason='메모 변경';assert.equal(evaluate(q('B-01'),s).answer,'NEEDS_REVIEW');
 response(s,'B-01','PASS');assert.equal(evaluate(q('B-01'),s).answer,'PASS');s.facts.count='500000';assert.equal(evaluate(q('B-01'),s).answer,'NEEDS_REVIEW');
});
test('residual scope exclusion requires evidence and unknown remains review',()=>{
 const s=sample();assert.equal(gate(q('M-24'),s).value,'UNKNOWN');scope(s,'M-24','NO');s.scopes['M-24'].evidenceRef='';assert.equal(gate(q('M-24'),s).value,'UNKNOWN');s.scopes['M-24'].evidenceRef='검토근거';assert.equal(gate(q('M-24'),s).value,'NO');
});
test('R refuses conclusions with unanswered/review/failure; all confirmed never guarantees exemption',()=>{
 const s=riskState();let rows=riskQuestions.map(q=>evaluate(q,s));assert.match(riskConclusion(rows,s),/점검 미완료/);
 for(const rq of riskQuestions){scope(s,rq.id);response(s,rq.id,'PASS');}
 rows=riskQuestions.map(q=>evaluate(q,s));assert.match(riskConclusion(rows,s),/함께 검토해야/);assert.doesNotMatch(riskConclusion(rows,s),/암호화하지 않아도|미적용 가능/);
 response(s,'R-29','NEEDS_REVIEW');assert.match(riskConclusion(riskQuestions.map(q=>evaluate(q,s)),s),/점검 미완료/);
 response(s,'R-10','FAIL');assert.match(riskConclusion(riskQuestions.map(q=>evaluate(q,s)),s),/보호조치를 시행하거나/);
});
test('four reporting buckets separated with no legal score and 142 detailed rows retained',()=>{
 const s=sample({},'2026-10-31');const report=createReport(s,questions.map(q=>evaluate(q,s)));assert.deepEqual(Object.keys(report.summary),['general','public','risk','readiness']);assert.equal(report.results.length,142);assert.equal(report.state.profile.organization,'');assert.equal(report.state.profile.systemName,'');assert.equal(report.state.profile.fileName,'');assert.ok(report.results.some(r=>r.mode==='준비평가'));assert.equal(report.score,undefined);
});
test('storage roundtrip and reset isolation retain original risk data',()=>{
 const s=response(sample(),'B-01','PASS','근거','문서번호');assert.deepEqual(parseState(JSON.stringify(s)),s);
 const m=new Map([[storageKey,JSON.stringify(s)],['privacy-risk-self-check-v1','original']]);clearState({removeItem:k=>m.delete(k)});assert.equal(m.has(storageKey),false);assert.equal(m.get('privacy-risk-self-check-v1'),'original');
 assert.throws(()=>parseState('{bad'));assert.throws(()=>parseState(JSON.stringify({...s,schemaVersion:2})));
});
test('new tool has no upload controls, analytics, fetch or external transmission',()=>{
 const dirs=['components/safeguards','lib/safeguards'];for(const dir of dirs)for(const name of fs.readdirSync(new URL('../'+dir+'/',import.meta.url))){if(!/tsx?$/.test(name))continue;const text=fs.readFileSync(new URL('../'+dir+'/'+name,import.meta.url),'utf8');assert.doesNotMatch(text,/\bfetch\s*\(|sendBeacon|XMLHttpRequest|type=["']file["']|localStorage\.clear\s*\(/,name);}
});
