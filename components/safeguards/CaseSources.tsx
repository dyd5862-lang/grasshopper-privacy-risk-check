import type { RelatedCase } from '../../lib/safeguards/related-cases';
import styles from './related-cases.module.css';
export function OfficialLink({href,children}:{href:string;children:React.ReactNode}) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}<span className={styles.newWindow}> (새 창)</span></a>;
}
export function CaseSources({entry,compact=false}:{entry:RelatedCase;compact?:boolean}) {
  const documents=<>
    {!compact && <h4>공개 의결서 · 기존 연결자료 {entry.decisions.length}개</h4>}
    {entry.decisions.length === 0 ? <p>의결서 미확보 · 공개 여부 확인 필요. 검색·접근 결과만으로 비공개라고 판단하지 않습니다.</p> : <>
      <p>PDF 본문은 이번 확인에서 접근 오류로 재검증하지 못했습니다. 공식 첨부페이지에서도 확인할 수 있습니다.</p>
      <ul>{entry.decisions.map(({document:d,review:v})=><li key={d.decisionNo}>
        <b>{d.decisionNo} · {d.organization}</b>
        <span>{v?.listingStatus === 'confirmed' ? '공식 첨부 목록 확인' : '첨부 목록 재확인 필요'} · 본문 사실관계 미검증</span>
        {!compact && <p>{v?.note ?? '사건 동일성과 본문을 추가 확인해야 합니다.'}</p>}
        <div><OfficialLink href={d.agendaUrl}>공식 첨부페이지</OfficialLink>{d.linkType!=='agenda' && <> · <OfficialLink href={d.url}>기존 PDF 원문 링크 · 열림 미확인</OfficialLink></>}</div>
      </li>)}</ul>
    </>}
  </>;
  return <div className={styles.sources}>
    <OfficialLink href={entry.record.source}>개인정보위 공식 보도자료</OfficialLink>
    {!compact && <p>보도자료 본문 확인 · {entry.review.checkedAt} · {entry.review.sourceLocator}</p>}
    {compact ? <details><summary>공개 의결서 · 기존 연결자료 {entry.decisions.length}개 — 확인 상태와 원문 링크</summary>{documents}</details> : documents}
  </div>;
}
