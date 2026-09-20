import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { loadTypeScript } from './helpers/load-typescript.mjs';
const load=p=>loadTypeScript(p,import.meta.url);
const {questions}=await load('../data/safeguards/index.ts');
const {caseRecords}=await load('../app/cases-data.ts');
const {publicDecisionsByCase}=await load('../app/decision-data.ts');
const {caseLinks,caseReviews,decisionReviews}=await load('../data/safeguards/case-links.ts');
const {relatedCases,caseAttention,groupAttentionCases}=await load('../lib/safeguards/related-cases.ts');
const {initialState}=await load('../lib/safeguards/storage.ts');
const {contextKey}=await load('../lib/safeguards/applicability-engine.ts');
const {evaluate,activeRows}=await load('../lib/safeguards/evaluation-engine.ts');
const {createReport}=await load('../lib/safeguards/report.ts');
const q=id=>questions.find(q=>q.id===id);
const state=()=>({...initialState('2026-09-20'),facts:{entity:'public',count:'120000',system:'YES',designated:'NO',riskIntent:'NO'}});
function answer(s,id,value){s.responses[id]={answer:value,reason:'내부 확인',evidenceRef:'테스트 문서',checkedAt:s.profile.date,context:contextKey(s)};return evaluate(q(id),s);}

test('all reviewed links reference real IDs and unique question/case pairs',()=>{
 const pairs=new Set();
 for(const link of caseLinks){
  assert.ok(q(link.questionId),link.questionId);assert.ok(caseRecords.some(c=>c.id===link.caseId),link.caseId);
  const pair=link.questionId+':'+link.caseId;assert.ok(!pairs.has(pair),pair);pairs.add(pair);
  assert.ok(['direct','reference'].includes(link.relevance));assert.ok(link.reason&&link.checkPoint);
  const review=caseReviews[link.caseId];assert.ok(review.sourceLocator&&review.lawNote&&review.historicalNote&&review.decisionDate);
 }
 assert.deepEqual([caseLinks.length,new Set(caseLinks.map(l=>l.questionId)).size,new Set(caseLinks.map(l=>l.caseId)).size],[43,32,6]);
 assert.equal(caseLinks.filter(l=>l.relevance==='direct').length,29);
});
test('case retrieval uses original records/documents, preserves all documents and prioritizes direct links',()=>{
 for(const question of questions){
  const entries=relatedCases(question.id);let referenceSeen=false;
  for(const entry of entries){
   assert.deepEqual(entry.record,caseRecords.find(c=>c.id===entry.record.id));
   assert.deepEqual(entry.decisions.map(d=>d.document),publicDecisionsByCase[entry.record.id]??[]);
   if(entry.link.relevance==='reference')referenceSeen=true;else assert.ok(!referenceSeen);
   for(const {document,review} of entry.decisions){assert.ok(review,document.decisionNo);assert.equal(review.bodyStatus,'unavailable');assert.equal(review.pdfStatus,'unavailable');}
  }
 }
 assert.equal(Object.keys(decisionReviews).length,12);assert.equal(relatedCases('B-01').length,0);
 assert.equal(relatedCases('N-01').find(e=>e.record.id==='geps-gangbuk-2026').decisions.length,2);
});
test('unanswered and excluded questions never produce failure guidance; raw and derived review are distinct',()=>{
 const s=state();let row=evaluate(q('N-01'),s);assert.equal(caseAttention(row),null);
 assert.equal(caseAttention({...row,answer:'NEEDS_REVIEW'}),null);
 row=answer(s,'N-01','FAIL');assert.equal(caseAttention(row),'사용자 응답: 미흡');
 assert.equal(caseAttention({...row,applicable:'NO'}),null);
 row=answer(s,'N-01','NEEDS_REVIEW');assert.equal(caseAttention(row),'사용자 응답: 추가 확인');
 s.scopes['N-01']={value:'YES',reason:'적용범위 확인',evidenceRef:'확인문서',context:contextKey(s)};
 row=answer(s,'N-01','PASS');assert.equal(caseAttention(row),null);
 s.facts.system='UNKNOWN';row=evaluate(q('N-01'),s);assert.equal(row.response.answer,'PASS');assert.match(caseAttention(row),/^시스템 판단:/);
});
test('report groups repeated cases, preserves readiness and excludes inactive risk module',()=>{
 const s=state();answer(s,'N-01','FAIL');answer(s,'N-04','NEEDS_REVIEW');answer(s,'R-20','FAIL');
 const rows=questions.map(q=>evaluate(q,s));const groups=groupAttentionCases(activeRows(rows,s));
 assert.equal(new Set(groups.map(g=>g.entry.record.id)).size,groups.length);
 const geps=groups.find(g=>g.entry.record.id==='geps-gangbuk-2026');assert.deepEqual(geps.items.map(i=>i.row.question.id),['N-01','N-04']);
 assert.equal(geps.items.find(i=>i.row.question.id==='N-04').row.bucket,'readiness');
 assert.ok(groups.every(g=>g.items.every(i=>i.row.question.id!=='R-20')));
});
test('case guidance leaves assessment, raw evidence, schema and export unchanged',()=>{
 const s=state();answer(s,'N-01','FAIL');const rows=questions.map(q=>evaluate(q,s));
 const now=new Date('2026-09-20T00:00:00Z');
 const before=JSON.stringify({s,rows,report:createReport(s,rows,now)});
 for(const row of rows){relatedCases(row.question.id);caseAttention(row);}groupAttentionCases(activeRows(rows,s));
 assert.equal(JSON.stringify({s,rows,report:createReport(s,rows,now)}),before);
 assert.equal(createReport(s,rows).results.length,142);assert.equal(s.schemaVersion,1);
});
test('review document is generated from the exact implementation mapping',()=>{
 execFileSync(process.execPath,['scripts/generate-safeguards-case-map.mjs','--check'],{cwd:new URL('../',import.meta.url),stdio:'pipe'});
});
