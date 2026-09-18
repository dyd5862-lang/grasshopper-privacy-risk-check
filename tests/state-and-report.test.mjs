import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTypeScript } from './helpers/load-typescript.mjs';
const load=(path)=>loadTypeScript(path,import.meta.url);
const {loadAssessment,saveAssessment,clearAssessment,assessmentStorageKey,loadReaderPreferences,saveReaderPreferences}=await load('../lib/privacy-risk/storage.ts');
const {initialProfile}=await load('../lib/privacy-risk/constants.ts');
const {checks}=await load('../lib/privacy-risk/checks.ts');
const {createResultData}=await load('../lib/privacy-risk/report.ts');
const {filterCases}=await load('../lib/privacy-risk/case-search.ts');
const {caseRecords}=await load('../app/cases-data.ts');
const {privacyNoticeArticleLinks,privacyLawReaderArticleLinks}=await load('../lib/privacy-risk/legal-links.ts');
function store(){const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};}
test('restores answers, evidence, blank profile and screen with legacy key',()=>{
 const s=store(),state={profile:initialProfile,answers:{1:'yes'},evidence:{1:[{title:'테스트 증적',note:'',owner:'',date:'2026-09-18'}]},screen:'check'};
 saveAssessment(s,state);assert.deepEqual(loadAssessment(s),state);
});
test('reset removes assessment even after automatic save; reader preferences survive',()=>{
 const s=store();saveAssessment(s,{profile:initialProfile,answers:{1:'no'},evidence:{},screen:'result'});
 saveReaderPreferences(s,{theme:'dark',fontSize:20,lineHeight:1.8});clearAssessment(s);
 saveAssessment(s,{profile:initialProfile,answers:{},evidence:{},screen:'intro'});
 assert.equal(s.getItem(assessmentStorageKey),null);assert.equal(loadReaderPreferences(s).theme,'dark');
});
test('malformed storage and unavailable storage do not crash',()=>{
 const s=store();s.setItem(assessmentStorageKey,'{bad');assert.equal(loadAssessment(s),null);assert.equal(s.getItem(assessmentStorageKey),null);
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')},removeItem(){throw Error('blocked')}};
 assert.equal(loadAssessment(blocked),null);assert.doesNotThrow(()=>saveAssessment(blocked,{profile:initialProfile,answers:{1:'yes'},evidence:{},screen:'check'}));
});
test('JSON export retains 26 rows, evidence and explicit unanswered with blank names',()=>{
 const result=createResultData(initialProfile,{1:'yes',2:'na'},{1:[{title:'테스트'}]},checks,new Date('2028-01-02T00:00:00Z'));
 assert.equal(result.createdAt,'2028-01-02T00:00:00.000Z');assert.equal(result.results.length,26);assert.equal(result.profile.organization,'');assert.equal(result.results[0].evidence[0].title,'테스트');assert.equal(result.results[1].answer,'해당 없음');assert.equal(result.results[25].answer,'미답변');
});
test('case search preserves all records, combines filters and handles current-year boundary',()=>{
 const f={caseTopic:'전체',caseInstitution:'전체',caseDisposition:'전체',casePeriod:'all',caseQuery:'',caseYear:'all'};
 assert.equal(filterCases(caseRecords,f).length,109);
 const recent=filterCases(caseRecords,{...f,casePeriod:'1'},new Date(2026,8,18));assert.ok(recent.every(r=>r.date>='2025-09-18'));
 const record=caseRecords[0];assert.ok(filterCases(caseRecords,{...f,caseQuery:record.title,caseYear:record.date.slice(0,4)}).some(r=>r.id===record.id));
});
test('legal link builders retain article and subarticle references',()=>{
 assert.ok(privacyNoticeArticleLinks('제5조 · 제8조')[1].url.includes('section=8'));
 assert.ok(privacyLawReaderArticleLinks('privacy-law','개인정보 보호법 제29조 · 시행령 제30조')[0].url.includes('article=law-29'));
});
