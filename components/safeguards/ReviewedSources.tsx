import { reviewedPress } from '../../data/pipc/press-2026-11-24';
import { safeguardPressLinks } from '../../data/safeguards/press-links';
import { reviewedDecisions } from '../../data/pipc/decisions-2026-11-24';
import { safeguardDecisionLinks } from '../../data/safeguards/decision-links';
import styles from './safeguards.module.css';

export function ReviewedSources({ questionId }: { questionId: string }) {
  const links = safeguardPressLinks.filter(link => link.questionId === questionId);
  const decisions = safeguardDecisionLinks.filter(link => link.questionId === questionId);
  return <>
    {links.length > 0 && <details className={styles.help}>
    <summary>관련 보도자료 ({links.length}건)</summary>
    <ul>{links.map(link => {
      const source = reviewedPress[link.nttId];
      return <li key={source.id}>
        <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
        <p className={styles.meta}>{source.date} · {source.kind} · {link.relevance}</p>
        <p>{link.reason}</p>
        <p className={styles.meta}>본문 위치 · {link.location}</p>
      </li>;
    })}</ul>
  </details>}
  {decisions.length > 0 && <details className={styles.help}>
    <summary>관련 공개용 의결서 ({decisions.length}건)</summary>
    <ul>{decisions.map(link => {
      const source = reviewedDecisions[link.decision];
      return <li key={source.id}>
        <a href={source.url} target="_blank" rel="noreferrer">{source.title} · {source.organization}</a>
        <p className={styles.meta}>{source.decisionNo} · 의결일 {source.date} · {link.relevance}</p>
        <p>{link.reason}</p>
        <p className={styles.meta}>{source.applicableLaw} · 본문 위치 {link.location}</p>
      </li>;
    })}</ul>
  </details>}
  </>;
}
