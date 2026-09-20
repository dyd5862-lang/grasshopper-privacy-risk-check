"use client";
import { useState } from 'react';
import type { Evaluated, Question } from '../../lib/safeguards/types';
import { caseAttention, relatedCases } from '../../lib/safeguards/related-cases';
import { RelatedCasesDialog } from './RelatedCasesDialog';
import styles from './related-cases.module.css';
export function CaseEntryPoint({question,row}:{question:Question;row?:Evaluated}) {
  const [open,setOpen]=useState(false);
  const count=relatedCases(question.id).length,attention=row?caseAttention(row):null;
  return <div className={`${styles.entry} no-print`} data-case-entry={question.id}>
    {count>0 && attention && <div className={styles.notice}><b>{attention}</b><p>이 보호조치와 관련된 조사·처분 사례가 있습니다. 위반 내용과 확인사항을 참고하세요.</p></div>}
    <button className={styles.action} aria-haspopup="dialog" onClick={()=>setOpen(true)}>관련 조사·처분 사례 보기{count>0?` (${count}건)`:''}</button>
    {count===0 && <p className={styles.muted}>현재 연결된 사례가 없습니다. 선례·의무·위험이 없다는 뜻은 아닙니다.</p>}
    {open && <RelatedCasesDialog question={question} onClose={()=>setOpen(false)}/>}
  </div>;
}
