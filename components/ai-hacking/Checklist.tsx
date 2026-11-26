import { areaKeys, areas, labels } from "../../lib/ai-hacking/model";
import type { Answer, Area, Question, Row, Status } from "../../lib/ai-hacking/model";
import { advisories, passages, sources } from "../../lib/ai-hacking/sources";
import { materialLinks, relatedMaterials } from "../../lib/ai-hacking/related-materials";
import { reasonLimit } from "../../lib/ai-hacking/storage";
import styles from "./assessment.module.css";

const choices: Status[] = ["pass", "fail", "review", "na", "pending"];

function QuestionHelp({ q }: { q: Question }) {
  const sourceIds = [...new Set(q.refs.map(key => passages[key].source))];
  const cases = materialLinks.filter(link => link.questionIds.includes(q.id));
  return <details className={styles.details}>
    <summary>확인 방법·판단 기준·공식 근거자료</summary>
    <div className={styles.helpBody}>
      <dl className={styles.definition}>
        <dt>점검 목적과 위험</dt><dd>{q.risk}</dd>
        <dt>확인 방법</dt><dd>{q.method}</dd>
        <dt>이행 판단 기준</dt><dd>{q.criterion}</dd>
        <dt>증적 예시</dt><dd>{q.evidence}</dd>
        <dt>개선조치</dt><dd>{q.action}</dd>
        <dt>적용 범위</dt><dd>{q.target}. {q.na}</dd>
      </dl>
      <h4>예방 권고 보도자료</h4>
      <ul className={styles.sources}>{sourceIds.map(id => {
        const s = sources[id];
        return <li key={id}><a href={s.url} target="_blank" rel="noreferrer">{id} · {s.title}</a>
          <small>{s.date}</small>{q.refs.filter(ref => passages[ref].source === id).map(ref =>
            <p key={ref}>{passages[ref].location} · {passages[ref].summary}</p>)}</li>;
      })}</ul>
      {(["보도자료", "공개용 의결서"] as const).map(kind => {
        const matches = cases.filter(link => relatedMaterials[link.source].kind === kind);
        return matches.length > 0 && <div key={kind}>
          <h4>{kind === "보도자료" ? "관련 보도자료" : kind}</h4>
          <ul className={styles.sources}>{matches.map(link => {
            const source = relatedMaterials[link.source];
            return <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
              <small>{source.label} · {source.date} · {link.relevance}</small>
              <p>{link.location} · {link.reason}</p></li>;
          })}</ul></div>;
      })}
      {q.extension && <p className={styles.note}><b>실무 보완</b> {q.extension}</p>}
      {q.notices && <><h4>공식 보안공지</h4><ul className={styles.sources}>{q.notices.map(key =>
        <li key={key}><a href={advisories[key].url} target="_blank" rel="noreferrer">{advisories[key].title}</a></li>)}</ul>
        <p>운영 중인 배포판·제품·빌드를 공지의 영향 범위 및 조치 방법과 대조하세요. 제품명만으로 취약 여부를 판정할 수 없습니다.</p></>}
    </div>
  </details>;
}

function QuestionCard({ row, onAnswer }: { row: Row; onAnswer: (id: string, answer: Answer) => void }) {
  const q = row.question;
  return <article className={styles.question} tabIndex={-1} id={"item-" + q.id}>
    <div className={styles.meta}><span>{q.id} · {q.target}</span><span data-priority={q.priority}>개선 우선순위 {q.priority}</span></div>
    <h4 id={"label-" + q.id}>{q.title}</h4>
    {row.automatic ? <p className={styles.note}><b>해당 없음</b> · {row.reason} (기본정보 기준)</p> :
      <fieldset className={styles.choices} aria-labelledby={"label-" + q.id}>{choices.map(status =>
        <label key={status} data-selected={row.status === status} data-status={status}>
          <input type="radio" name={q.id} value={status} checked={row.status === status}
            onChange={() => onAnswer(q.id, { status, reason: "" })}/>{labels[status]}
        </label>)}</fieldset>}
    {row.status === "na" && !row.automatic && <label className={styles.reason}>
      해당 없음 사유 (선택)<span>{q.na} 개인정보·주소·인증정보를 적지 마세요.</span>
      <input maxLength={reasonLimit} value={row.reason} placeholder="예: 점검 범위에 외부 연계 API가 없음"
        onChange={e => onAnswer(q.id, { status: "na", reason: e.target.value })}/>
    </label>}
    <QuestionHelp q={q}/>
  </article>;
}

export function Checklist({ area, rows, onArea, onAnswer, onResult }: {
  area: Area; rows: Row[]; onArea: (area: Area) => void; onAnswer: (id: string, answer: Answer) => void; onResult: () => void;
}) {
  const group = rows.filter(row => row.question.area === area);
  const index = areaKeys.indexOf(area);
  return <div className={styles.workbench}>
    <nav className={styles.areaNav} aria-label="점검 영역">{areaKeys.map(key => {
      const group = rows.filter(r => r.question.area === key && r.status !== "na");
      return <button key={key} aria-current={area === key ? "step" : undefined} onClick={() => onArea(key)}>
        <span>{key}. {areas[key]}</span><small>{group.filter(r => r.status !== "pending").length}/{group.length}</small>
      </button>;
    })}</nav>
    <div className={styles.group} aria-label="현재 점검 영역">
      <h3 tabIndex={-1} id="ai-area-heading">{area}. {areas[area]} <small>{group.length}문항</small></h3>
      {group.map(row => <QuestionCard key={row.question.id} row={row} onAnswer={onAnswer}/>)}
      <div className={styles.actions}>
        {index > 0 && <button className={styles.secondary} onClick={() => onArea(areaKeys[index-1])}>이전 영역</button>}
        <button className={styles.primary} onClick={() => index + 1 === areaKeys.length ? onResult() : onArea(areaKeys[index+1])}>
          {index + 1 === areaKeys.length ? "점검 결과 보기" : "다음 영역"}</button>
      </div>
    </div>
  </div>;
}
