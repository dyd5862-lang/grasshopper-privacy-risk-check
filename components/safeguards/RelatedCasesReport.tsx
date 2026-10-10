"use client";
import { useState } from 'react';
import type { Evaluated, Question } from '../../lib/safeguards/types';
import { groupAttentionCases, relevanceLabels } from '../../lib/safeguards/related-cases';
import { RelatedCasesDialog } from './RelatedCasesDialog';
import { CaseSources, OfficialLink } from './CaseSources';
import styles from './related-cases.module.css';
export function RelatedCasesReport({rows}:{rows:Evaluated[]}) {
  const groups=groupAttentionCases(rows);
  const [selection,setSelection]=useState<{question:Question;caseId:string}|null>(null);
  return <section className={styles.report} data-testid="related-cases-report"><h2>미흡·추가 확인 사항의 관련 사례</h2>
    <p>명시적 미흡·추가 확인 응답과 시스템의 재확인 판단을 구분합니다. 미답변은 미흡으로 취급하지 않습니다. 같은 사건은 한 번만 표시합니다.</p>
    {groups.length===0 ? <p>현재 결과에 연결된 사례가 없습니다. 점검 문항에서는 응답과 관계없이 사례를 확인할 수 있습니다.</p> : groups.map(({entry,items})=><article key={entry.record.id} className={styles.reportCase} data-case-id={entry.record.id}>
      <h3>{entry.record.targets}</h3><p>{entry.record.title} · 의결일 {entry.review.decisionDate}</p>
      <ul>{items.map(({row,link,attention})=><li key={row.question.id}><b>{row.question.id} · {row.question.article} · {relevanceLabels[link.relevance]}</b><p>{attention}{row.bucket==='readiness'?' · 개정 준비평가':''}</p><p className="no-print">{link.reason}</p><button className={`${styles.textButton} no-print`} onClick={()=>setSelection({question:row.question,caseId:entry.record.id})}>이 문항의 사례 상세 보기 · {row.question.id}</button></li>)}</ul>
      <div className="no-print"><CaseSources entry={entry} compact/></div>
      <div className={styles.printSources}><OfficialLink href={entry.record.source}>공식 보도자료</OfficialLink><p className={styles.url}>{entry.record.source}</p>{[...new Set(entry.decisions.map(x=>x.document.agendaUrl))].map(url=><p className={styles.url} key={url}>의결서 첨부페이지: {url}</p>)}<p>{entry.decisions.length?'의결서 원문은 공식 첨부페이지에서 확인할 수 있습니다.':'의결서 미확보 · 공개 여부 확인 필요.'} 사례 설명은 참고자료이며 현재 법 위반을 확정하지 않습니다.</p></div>
    </article>)}
    {selection && <RelatedCasesDialog question={selection.question} initialCaseId={selection.caseId} onClose={()=>setSelection(null)}/>}
  </section>;
}
