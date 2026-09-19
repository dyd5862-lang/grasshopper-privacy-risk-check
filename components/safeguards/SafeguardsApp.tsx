'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { questions, dateNotice, disclaimer } from '../../data/safeguards/index';
import type { State, Response, ScopeConfirmation } from '../../lib/safeguards/types';
import { initialState, parseState, storageKey, today, clearState } from '../../lib/safeguards/storage';
import { contextKey, conditions } from '../../lib/safeguards/applicability-engine';
import { activeRows, evaluate, validDate } from '../../lib/safeguards/evaluation-engine';
import { createReport } from '../../lib/safeguards/report';
import { BrandMark } from '../privacy-risk/Icons';
import { ToolSwitcher } from './ToolSwitcher';
import { BasicInfo } from './BasicInfo';
import { ApplicabilityCheck, ConditionSummary } from './ApplicabilityCheck';
import { ChecklistSection } from './ChecklistSection';
import { Progress } from './Progress';
import { ResultSummary } from './ResultSummary';
import styles from './safeguards.module.css';

export default function SafeguardsApp() {
 const [state,setState]=useState<State>(()=>initialState(''));
 const [ready,setReady]=useState(false),[storageBlocked,setStorageBlocked]=useState(false),[saveStatus,setSaveStatus]=useState('기기 내 자동 저장');
 const [step,setStep]=useState<'profile'|'check'|'result'>('profile'),[section,setSection]=useState(questions[0].section);
 useEffect(()=>{let cancelled=false;queueMicrotask(()=>{
  if(cancelled)return;
  try { const raw=localStorage.getItem(storageKey);setState(raw?parseState(raw):initialState());if(raw)setSaveStatus('저장한 점검을 복원했습니다'); }
  catch {setState(initialState());setStorageBlocked(true);setSaveStatus('자동 저장·복원이 불가능합니다. 기존 저장값은 보존했습니다. 결과 데이터를 내려받거나 새 점검으로 초기화하세요.');}
  setReady(true);
 });return()=>{cancelled=true};},[]);
 const update=(next:State)=>{
  setState(next);
  if(storageBlocked)return;
  try {localStorage.setItem(storageKey,JSON.stringify(next));setSaveStatus('기기 내 자동 저장됨');}
  catch {setSaveStatus('자동 저장에 실패했습니다. 화면의 입력은 유지됩니다. 결과 데이터를 내려받으세요.');}
 };
 const rows=useMemo(()=>questions.map(q=>evaluate(q,state)),[state]);
 const active=activeRows(rows,state),c=conditions(state);
 const sections=[...new Set(questions.filter(q=>q.group!=='encryption-risk'||c.R.value==='YES').map(q=>q.section))];
 const selected=sections.includes(section)?section:sections[0];
 const changeStep=(next:typeof step)=>{setStep(next);window.scrollTo({top:0,behavior:'smooth'});};
 const onResponse=(id:string,response:Response,confirm=false)=>update({...state,responses:{...state.responses,[id]:{...response,context:confirm?contextKey(state):response.context,checkedAt:confirm?(response.checkedAt||today()):response.checkedAt}}});
 const onScope=(id:string,scope:ScopeConfirmation)=>update({...state,scopes:{...state.scopes,[id]:{...scope,context:contextKey(state)}},responses:state.responses[id]?{...state.responses,[id]:{...state.responses[id],context:''}}:state.responses});
 const reset=()=>{
  if(!window.confirm('안전성 확보조치 도구의 점검만 초기화할까요? 기존 위험도 분석 도구의 데이터는 유지됩니다.'))return;
  try{clearState(localStorage);setStorageBlocked(false);setSaveStatus('새 점검 · 아직 저장된 입력 없음');}catch{setSaveStatus('이 기기의 저장값을 삭제하지 못했습니다. 브라우저 저장 설정을 확인하세요.');}
  setState(initialState());setStep('profile');setSection(questions[0].section);
 };
 const exportData=()=>{
  const url=URL.createObjectURL(new Blob([JSON.stringify(createReport(state,rows),null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=`메뚜기-안전성확보조치-${state.profile.date||today()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 return <main className={styles.shell}>
 <ToolSwitcher active="safeguards"/>
 <header className={`${styles.header} ${styles.noPrint}`}><Link href="/"><BrandMark/>메뚜기 프로젝트</Link><span role="status" aria-live="polite">{saveStatus}</span></header>
 <div className={styles.content}>
 <div className={`${styles.title} ${styles.noPrint}`}><div><h1><small>메뚜기가 만든</small>개인정보 안전성 확보조치<br/>자가 점검 도구</h1><p>「개인정보의 안전성 확보조치 기준」에 따른 적용대상 확인 및 조문별 보호조치 자가점검</p></div><Image className={styles.mascot} src="/images/grasshopper-hero.webp" alt="메뚜기 점검 안내자" width={110} height={110}/></div>
 <p className={`${styles.note} ${styles.noPrint}`}><b>이 도구에는 실제 개인정보를 입력하지 마십시오.</b><br/>증적은 기관 내부에서 확인하고 증적명·내부 참조·확인일만 기록하세요. 비밀번호·인증토큰·암호키를 입력하지 마세요. 입력값은 이 브라우저에만 저장됩니다.</p>
 {!ready?<p>기기에 저장한 점검을 확인하고 있습니다…</p>:<>
 <nav className={`${styles.steps} ${styles.noPrint}`} aria-label="안전성 확보조치 점검 단계">{([['profile','01 대상 확인'],['check','02 조문별 점검'],['result','03 결과보고서']] as const).map(([key,label])=><button key={key} aria-current={step===key?'step':undefined} onClick={()=>changeStep(key)}>{label}</button>)}</nav>
 {!validDate(state.profile.date)&&<p className={styles.error} role="alert">유효한 점검일을 입력하세요. 시행시점을 판단할 수 없어 결과를 확정할 수 없습니다.</p>}
 <div className={styles.noPrint}>
 {step==='profile'&&<><BasicInfo state={state} update={profile=>update({...state,profile})}/><p className={styles.warning}>{dateNotice}</p><ApplicabilityCheck state={state} update={update}/><section className={styles.panel}><h2>적용대상 분석</h2><ConditionSummary state={state}/><p className={styles.muted}>사전조건이나 점검일을 변경하면 기존 응답을 보존하고 재확인을 요청합니다.</p><button className={styles.button} onClick={()=>changeStep('check')}>조문별 점검으로 이동</button></section></>}
 {step==='check'&&<><Progress rows={active}/>{c.R.value!=='YES'&&<p className={styles.note}>암호화 미적용 위험도 분석 모듈은 비활성입니다. F-14에서 대상과 평가경로가 확인된 경우에만 26개 분석항목과 3개 보고서 항목을 표시합니다.</p>}<div className={styles.workbench}><aside className={styles.sidebar} aria-label="조문별 분야">{sections.map(name=>{const rr=active.filter(r=>r.question.section===name);return <button key={name} aria-current={selected===name} onClick={()=>{setSection(name);window.scrollTo({top:220,behavior:'smooth'});}}>{name}<small>대상·확인필요 {rr.length} · 응답 {rr.filter(r=>r.answer!=='UNANSWERED').length}</small></button>})}</aside><section><h2>{selected}</h2><ChecklistSection rows={rows.filter(r=>r.question.section===selected)} state={state} onResponse={onResponse} onScope={onScope}/><div className={styles.actions}><button className={styles.secondary} onClick={()=>setSection(sections[Math.max(0,sections.indexOf(selected)-1)])}>이전 분야</button><button className={styles.button} onClick={()=>{const i=sections.indexOf(selected);if(i===sections.length-1)changeStep('result');else {setSection(sections[i+1]);window.scrollTo({top:220,behavior:'smooth'});}}}>{sections.indexOf(selected)===sections.length-1?'결과 확인':'다음 분야'}</button></div></section></div></>}
 </div>
 <div className={step==='result'?'':styles.printOnly}><ResultSummary state={state} rows={rows}/></div>
 <div className={`${styles.actions} ${styles.noPrint}`}><button className={styles.secondary} onClick={exportData}>결과 데이터 저장</button><button className={styles.secondary} onClick={()=>window.print()}>결과보고서 인쇄</button><button className={styles.secondary} onClick={reset}>점검 초기화</button>{step!=='result'&&<button className={styles.button} onClick={()=>changeStep('result')}>현재 결과 확인</button>}</div>
 </>}
 <footer className={`${styles.footer} ${styles.noPrint}`}>{disclaimer}<br/>기준 대응표의 문항·적용조건·판단기준을 바탕으로 구성했습니다. 기관·시스템·파일 등 서로 다른 범위는 별도 점검하고 기관 내부에서 증적과 연결해 확인하세요.</footer>
 </div></main>;
}
