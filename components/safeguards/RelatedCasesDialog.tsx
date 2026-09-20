"use client";
import { useEffect, useId, useRef, useState } from 'react';
import type { Question } from '../../lib/safeguards/types';
import { relatedCases, relevanceLabels } from '../../lib/safeguards/related-cases';
import { CaseSources } from './CaseSources';
import styles from './related-cases.module.css';

export function RelatedCasesDialog({question,initialCaseId,onClose}:{question:Question;initialCaseId?:string;onClose:()=>void}) {
  const entries=relatedCases(question.id);
  const [caseId,setCaseId]=useState(initialCaseId ?? entries[0]?.record.id);
  const entry=entries.find(x=>x.record.id===caseId) ?? entries[0];
  const dialogRef=useRef<HTMLDialogElement>(null), detailRef=useRef<HTMLElement>(null);
  const titleId=useId();
  useEffect(()=>{
    const opener=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const dialog=dialogRef.current!;
    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';dialog.showModal();
    return ()=>{dialog.close();document.body.style.overflow=overflow;opener?.focus({preventScroll:true});};
  },[]);
  return <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}} onKeyDown={e=>{
    if(e.key!=='Tab')return;
    const controls=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')).filter(el=>el.getClientRects().length>0);
    const first=controls[0],last=controls.at(-1);
    if(e.shiftKey && (document.activeElement===first || document.activeElement===e.currentTarget)){e.preventDefault();last?.focus();}
    else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first?.focus();}
  }}>
    <div className={styles.dialogInner}>
      <header className={styles.dialogHeader}><div><span className={styles.kicker}>{question.id} · {question.article}</span><h2 id={titleId}>관련 조사·처분 사례</h2><p>{question.question}</p></div><button className={styles.close} onClick={onClose} aria-label="사례창 닫기">닫기 ×</button></header>
      <p className={styles.notice}>사례는 보호조치를 이해하기 위한 참고자료입니다. 현재 점검의 법 위반 여부나 제재 금액을 예측하지 않습니다.</p>
      {entries.length===0 ? <p className={styles.empty}>현재 연결된 사례가 없습니다. 관련 선례·의무·위험이 없다는 뜻은 아닙니다.</p> : <>
        <nav className={styles.caseList} aria-label="관련 사례 목록">{entries.map(x=><button key={x.record.id} aria-pressed={x.record.id===entry.record.id} onClick={()=>{setCaseId(x.record.id);requestAnimationFrame(()=>detailRef.current?.focus({preventScroll:true}));}}><span className={styles.badge}>{relevanceLabels[x.link.relevance]}</span><b>{x.record.targets}</b><small>의결일 {x.review.decisionDate}</small></button>)}</nav>
        <article ref={detailRef} className={styles.detail} tabIndex={-1} aria-label="선택한 사례 상세">
          <span className={styles.badge}>{relevanceLabels[entry.link.relevance]}</span><h3>{entry.record.title}</h3>
          <p><b>처분 대상</b> {entry.record.targets}</p><p>의결일(보도자료 기준) {entry.review.decisionDate} · 보도자료 게시일 {entry.record.date}</p>
          <section className={styles.relation}><h4>현재 문항과 연결한 이유</h4><p>{entry.link.reason}</p><h4>점검 시 확인할 사항 · 도구가 정리한 설명</h4><p>{entry.link.checkPoint}</p></section>
          <section><h4>사건 개요 · 공식 보도자료 요약</h4><p>{entry.record.summary}</p><ul>{entry.record.problems.map(text=><li key={text}>{text}</li>)}</ul></section>
          <section><h4>처분 결과</h4><p>{entry.record.dispositionSummary}</p><p className={styles.muted}>여러 기관·위반행위의 처분 총액을 현재 문항 하나의 제재 금액으로 해석하지 마세요.</p></section>
          <section><h4>처분 당시 적용 법령·조문 확인 범위</h4><p>{entry.review.lawNote}</p><h4>현재 점검 조문과의 구분</h4><p>{entry.review.historicalNote}</p>{question.effectiveFrom && <p>이 문항의 개정 문구 시행일: {question.effectiveFrom}. 시행 전에는 준비평가로 구분합니다.</p>}</section>
          <CaseSources entry={entry}/>
        </article>
      </>}
      <footer className={styles.dialogFooter}><button className={styles.action} onClick={onClose}>점검으로 돌아가기</button></footer>
    </div>
  </dialog>;
}
