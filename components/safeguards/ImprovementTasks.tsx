import type { Evaluated } from '../../lib/safeguards/types';
import { labels } from '../../lib/safeguards/evaluation-engine';
import styles from './safeguards.module.css';
export function ImprovementTasks({rows}:{rows:Evaluated[]}) {
 const tasks=rows.filter(r=>['FAIL','NEEDS_REVIEW'].includes(r.answer)||r.applicable==='UNKNOWN').sort((a,b)=>Number(b.answer==='FAIL')-Number(a.answer==='FAIL'));
 return <section className={styles.panel}><h2>개선 및 추가 확인 과제</h2>{tasks.length===0?<p>현재 기록된 미흡·추가 확인 과제가 없습니다. 미답변 여부는 결과 요약에서 별도로 확인하세요.</p>:tasks.map(r=><article className={styles.task} key={r.question.id}><b>{r.question.id} · {r.question.article} · {labels[r.answer]}{r.bucket==='readiness'?' · 준비평가':''}</b><p><b>문제·확인 내용:</b> {r.response.reason||r.question.question}</p>{r.applicable==='UNKNOWN'&&<p><b>적용조건 확인:</b> {r.question.applicability}</p>}<p><b>필요한 조치:</b> {r.question.passCriteria}</p><p><b>확인할 증적:</b> {r.question.evidenceExamples}</p></article>)}</section>;
}
