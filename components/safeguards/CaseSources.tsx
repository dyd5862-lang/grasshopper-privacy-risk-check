import type { RelatedCase } from '../../lib/safeguards/related-cases';
import styles from './related-cases.module.css';
export function OfficialLink({href,children}:{href:string;children:React.ReactNode}) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}<span className={styles.newWindow}> (새 창)</span></a>;
}
export function CaseSources({entry,compact=false}:{entry:RelatedCase;compact?:boolean}) {
  const documents=<>
    {!compact && <h4>공개 의결서 {entry.decisions.length}개</h4>}
    {entry.decisions.length === 0 ? <p>의결서 미확보 · 공개 여부 확인 필요. 검색·접근 결과만으로 비공개라고 판단하지 않습니다.</p> : <>
      <p>개인정보보호위원회 공식 의결서 페이지에서 문서번호에 해당하는 첨부파일을 열람·다운로드할 수 있습니다.</p>
      <ul>{entry.decisions.map(({document:d})=><li key={d.decisionNo}>
        <b>{d.decisionNo} · {d.organization}</b>
        <div><OfficialLink href={d.agendaUrl}>공식 의결서 페이지 · 원문 열람·다운로드</OfficialLink></div>
      </li>)}</ul>
    </>}
  </>;
  return <div className={styles.sources}>
    <OfficialLink href={entry.record.source}>개인정보위 공식 보도자료</OfficialLink>
    {!compact && <p>보도자료 본문 확인 · {entry.review.checkedAt} · {entry.review.sourceLocator}</p>}
    {compact ? <details><summary>공개 의결서 {entry.decisions.length}개 — 공식 원문 링크</summary>{documents}</details> : documents}
  </div>;
}
