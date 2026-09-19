import type { Evaluated } from '../../lib/safeguards/types';
import { summarize } from '../../lib/safeguards/evaluation-engine';
import styles from './safeguards.module.css';
export function Progress({rows}:{rows:Evaluated[]}) {
 const s=summarize(rows);
 return <div className={styles.progress}><b>응답 완료 {s.completed} / {s.total}</b><progress aria-label="점검 응답 진행률" max={Math.max(1,s.total)} value={s.completed}/><p>적용 확인 {s.applied} · 적용조건 추가 확인 {s.pending} · 미답변 {s.counts.UNANSWERED}</p><small>진행률은 응답 현황이며 법적 준수점수나 안전점수가 아닙니다.</small></div>;
}
