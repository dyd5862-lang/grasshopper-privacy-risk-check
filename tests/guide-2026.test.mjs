import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypeScript } from './helpers/load-typescript.mjs';
const load=p=>loadTypeScript(p,import.meta.url);
const {questions,sourceVersion,legacySourceVersion}=await load('../data/safeguards/index.ts');
const {initialState,parseState}=await load('../lib/safeguards/storage.ts');
const {contextKey,conditions}=await load('../lib/safeguards/applicability-engine.ts');
const {evaluate,summarize}=await load('../lib/safeguards/evaluation-engine.ts');
const {createReport}=await load('../lib/safeguards/report.ts');
const {initialProfile}=await load('../lib/privacy-risk/constants.ts');
const {encryptionConclusion}=await load('../lib/privacy-risk/evaluation.ts');
const {loadAssessment,assessmentStorageKey}=await load('../lib/privacy-risk/storage.ts');
const publicState=(date)=>({...initialState(date),facts:{entity:'public',system:'YES',designated:'YES',operator:'YES',userAgency:'NO'},factNotes:{'F-11':'지정통보-테스트'}});
const ids=['S-11','W-01','W-02','W-03'];
const q=id=>questions.find(q=>q.id===id);
function answer(s,id,value){s.responses[id]={answer:value,reason:'테스트',evidenceRef:'내부기록',checkedAt:s.profile.date,context:contextKey(s)};}
test('2026-10-30 / 2026-11-07 / 2027-01-01 boundaries never penalize future duties',()=>{
 for(const date of ['2026-10-30','2026-11-07','2027-01-01']){
  const s=publicState(date);ids.forEach(id=>answer(s,id,'FAIL'));
  const rows=ids.map(id=>evaluate(q(id),s));
  for(const row of rows){assert.equal(row.applicable,'YES');assert.equal(row.bucket,date<'2027-01-01'?'readiness':'public');assert.equal(row.response.answer,'FAIL');assert.equal(row.answer,date<'2027-01-01'?'UNANSWERED':'FAIL');}
  const report=createReport(s,rows);
  assert.equal(report.improvements.length,date<'2027-01-01'?0:4);
  assert.equal(summarize(rows.filter(r=>r.bucket!=='readiness')).counts.FAIL,date<'2027-01-01'?0:4);
 }
 // No supplied annual result on January 1 is UNANSWERED, never an automatic FAIL.
 const s=publicState('2027-01-01');assert.equal(evaluate(q('W-01'),s).answer,'UNANSWERED');assert.equal(evaluate(q('W-02'),s).answer,'UNANSWERED');
 assert.match(q('S-01').question,/수립·시행/);
 assert.equal(evaluate(q('A-01'),publicState('2026-10-30')).bucket,'readiness');
 assert.equal(evaluate(q('A-01'),publicState('2026-11-07')).bucket,'general');
});
test('designation and operator status are required; user agency and general public entity excluded',()=>{
 for(const facts of [{designated:'NO'},{operator:'NO',userAgency:'YES'},{entity:'large'}]){
  const s=publicState('2027-01-01');Object.assign(s.facts,facts);for(const id of ids)assert.equal(evaluate(q(id),s).applicable,'NO');
 }
 const s=publicState('2027-01-01');s.factNotes={};assert.equal(conditions(s).P.value,'UNKNOWN');answer(s,'W-01','PASS');assert.equal(evaluate(q('W-01'),s).answer,'NEEDS_REVIEW');
 // Internal-only is not an exception to a designated public system's Article 18 duties.
 s.factNotes={'F-11':'지정통보'};s.facts.internal='YES';s.facts.external='NO';assert.equal(evaluate(q('W-02'),s).applicable,'YES');
});
test('legacy safeguard migration preserves raw snapshot, old version, ID and evidence; requires review',()=>{
 const legacy=publicState('2026-11-07');legacy.sourceVersion=legacySourceVersion;answer(legacy,'S-01','PASS');legacy.responses['S-01'].context='legacy-context';
 const migrated=parseState(JSON.stringify(legacy));assert.equal(migrated.sourceVersion,sourceVersion);assert.equal(migrated.migratedFrom,legacySourceVersion);assert.deepEqual(migrated.previousAssessment,legacy);assert.deepEqual(migrated.responses,legacy.responses);assert.equal(evaluate(q('S-01'),migrated).answer,'NEEDS_REVIEW');
 assert.equal(migrated.responses['W-01'],undefined);assert.deepEqual(parseState(JSON.stringify(migrated)),migrated);
 assert.throws(()=>parseState(JSON.stringify({...legacy,sourceVersion:'unrecognized'})));
 const report=createReport(migrated,questions.map(q=>evaluate(q,migrated)));assert.equal(report.results.length,146);assert.ok(ids.every(id=>report.results.some(r=>r.id===id)));assert.equal(report.previousSourceVersion,legacySourceVersion);
});
const base={...initialProfile,assessmentDate:'2026-11-07',identifiers:['여권번호'],subjectType:'nonuser',storageLocation:'internal',dpia:'no',storage:'none'};
const yes=Object.fromEntries(Array.from({length:26},(_,i)=>[i+1,'yes']));
test('risk scope and encryption conclusion separate legal result from improvement priority',()=>{
 assert.match(encryptionConclusion(base,{...yes,5:'no'}),/암호화하여야/);
 assert.match(encryptionConclusion({...base,identifiers:['주민등록번호','여권번호']},yes),/주민등록번호.*별도로 암호화/);
 for(const profile of [{...base,subjectType:'user'},{...base,storageLocation:'internet'},{...base,storageLocation:'dmz'}])assert.match(encryptionConclusion(profile,yes),/예외를 적용할 수 없/);
 assert.match(encryptionConclusion({...base,dpia:'yes'},yes),/영향평가 결과/);
 assert.match(encryptionConclusion({...base,storageLocation:'unknown'},yes),/추가 확인/);
 assert.match(encryptionConclusion(base,{...yes,26:'unknown'}),/점검 미완료/);
 assert.match(encryptionConclusion(base,{...yes,25:'na',26:'na'}),/‘해당 없음’은 ‘예’/);
 assert.match(encryptionConclusion(base,yes),/운영환경 변경 시 재분석/);
 assert.match(encryptionConclusion({...base,assessmentDate:'2026-02-31'},yes),/유효한 점검 기준일/);
});
test('old risk storage retains responses but missing scope defaults to unknown with old provenance',()=>{
 const raw=JSON.stringify({profile:{identifiers:['여권번호'],storage:'none'},answers:yes,evidence:{1:[{title:'원본증적'}]},screen:'result'});
 const s=loadAssessment({getItem:k=>k===assessmentStorageKey?raw:null,removeItem(){throw Error('must preserve')},setItem(){}});
 assert.deepEqual(s.answers,yes);assert.equal(s.evidence[1][0].title,'원본증적');assert.equal(s.originalSourceVersion,'2025.11');assert.equal(s.profile.storageLocation,'unknown');
});
