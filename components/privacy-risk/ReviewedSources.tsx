import { riskReviewedLinks, riskReviewedSources } from "../../lib/privacy-risk/reviewed-links";
import { MiniIcon } from "./Icons";

export function ReviewedSources({ itemId }: { itemId: number }) {
  const links = riskReviewedLinks.filter(link => link.itemId === itemId);
  if (!links.length) return null;

  return (
    <section>
      <h3><MiniIcon name="news" /> 문항별 공식자료 ({links.length}건)</h3>
      <div className="legal-links">
        {links.map(link => {
          const source = riskReviewedSources[link.sourceKey];
          const label = "decisionNo" in source
            ? `공개용 의결서 · ${source.decisionNo} · 의결일 ${source.date}`
            : `보도자료 · ${source.kind} · 게시일 ${source.date}`;
          return (
            <div key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer">
                <span>{label}</span>
                <b>{"organization" in source ? `${source.organization} · ${source.title}` : source.title}</b>
                <MiniIcon name="arrow" />
              </a>
              <p><b>{link.level}</b> · {link.reason}</p>
              <small>근거 위치 · {link.location}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}
