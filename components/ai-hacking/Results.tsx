import { useState } from "react";
import { formatRate, improvements, summarize } from "../../lib/ai-hacking/assessment";
import { areaKeys, areas, labels, techKeys, techNames } from "../../lib/ai-hacking/model";
import type { Profile, Row } from "../../lib/ai-hacking/model";
import { passages, sources } from "../../lib/ai-hacking/sources";
import styles from "./assessment.module.css";

export function Results({ rows, profile, onEdit }: { rows: Row[]; profile: Profile; onEdit: (row: Row) => void }) {
  const [failOnly, setFailOnly] = useState(false);
  const counts = summarize(rows), tasks = improvements(rows);
  const metrics = [
    ["전체", counts.total], ["적용 대상", counts.applicable], ["이행", counts.pass], ["미이행", counts.fail],
    ["확인 필요", counts.review], ["해당 없음", counts.na], ["점검 전", counts.pending],
  ] as const;
  return <section className={styles.report} aria-label="AI 해킹 예방 점검 결과">
    <header className={styles.reportHead}><p>AI 해킹 관련 점검 도구</p><h2 tabIndex={-1} id="ai-result-heading">점검 결과보고서</h2>
      <p>{profile.date || "점검일 미입력"} · {profile.organization || "기관 유형 미선택"} · {profile.scope || "범위 미선택"}</p>
      <p>{techKeys.map(key => techNames[key] + " " + (profile[key] === "unknown" ? "확인 필요" : key === "vendor"
        ? (profile[key] === "yes" ? "있음" : "없음") : (profile[key] === "yes" ? "사용" : "미사용"))).join(" · ")}</p>
    </header>
    <div className={styles.rateGrid}>
      <div><span>점검 진행률</span><strong>{formatRate(counts.progress)}</strong><p>응답 {counts.answered} / 적용 {counts.applicable}문항</p></div>
      <div><span>적용 문항 이행률</span><strong>{formatRate(counts.compliance)}</strong><p>이행 {counts.pass} / 적용 {counts.applicable}문항</p></div>
    </div>
    <dl className={styles.metrics}>{metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <p>진행률에는 이행·미이행·확인 필요 응답이 포함됩니다. 이행률은 적용 문항 중 이행한 비율입니다. 두 비율 모두 ‘해당 없음’을 제외합니다.</p>

    <h3>영역별 점검 결과</h3>
    <div className={styles.tableWrap} role="region" aria-label="영역별 점검 결과 표" tabIndex={0}>
      <table><thead><tr>{["영역","적용","이행","미이행","확인 필요","해당 없음","점검 전","이행률"].map(x => <th scope="col" key={x}>{x}</th>)}</tr></thead>
        <tbody>{areaKeys.map(key => {
          const c = summarize(rows.filter(row => row.question.area === key));
          return <tr key={key}><th scope="row">{key}. {areas[key]}</th>
            {[c.applicable,c.pass,c.fail,c.review,c.na,c.pending,formatRate(c.compliance)].map((v,i) => <td key={i}>{v}</td>)}</tr>;
        })}</tbody></table>
    </div>

    <h3>우선 개선 및 확인 사항</h3>
    <p>미이행 {counts.fail}건은 개선조치가 필요합니다. 확인 필요 {counts.review}건은 이행 여부를 먼저 확인하세요.
      긴급·높음·보통은 실무상 개선 순서이며 법 위반, 침해 가능성이나 피해 규모를 판정하는 등급이 아닙니다.</p>
    <label className={styles.filter + " no-print"}><input type="checkbox" checked={failOnly} onChange={e => setFailOnly(e.target.checked)}/>미이행 항목만 모아보기</label>
    {tasks.length === 0 && <p className={styles.note}>{counts.pending ? "현재 응답에서 개선·확인 과제가 집계되지 않았습니다. 점검 전 문항을 확인하세요." : "현재 응답에서 미이행 또는 확인 필요로 표시된 항목이 없습니다."}</p>}
    {failOnly && !counts.fail && tasks.length > 0 && <p className="no-print">미이행으로 응답한 항목이 없습니다.</p>}
    <ol className={styles.taskList}>{tasks.map(row => <li key={row.question.id} className={failOnly && row.status !== "fail" ? styles.filtered : undefined}>
      <div className={styles.meta}><b data-priority={row.question.priority}>{row.question.priority}</b><span>{labels[row.status]} · {row.question.id}</span></div>
      <h4>{row.question.title}</h4>
      {row.status === "review" && <p><b>먼저 확인</b>　{row.question.method}</p>}
      <p><b>{row.status === "review" ? "미이행으로 확인되면" : "개선조치"}</b>　{row.question.action}</p>
      <button className={styles.textButton + " no-print"} onClick={() => onEdit(row)}>문항 다시 보기</button>
    </li>)}</ol>

    <h3>문항별 응답과 제외 사유</h3>
    {failOnly && !counts.fail && <p className="no-print">표시할 미이행 문항이 없습니다.</p>}
    <ul className={styles.detailList}>{rows.map(row => <li key={row.question.id} className={failOnly && row.status !== "fail" ? styles.filtered : undefined}>
      <div><b>{row.question.id}</b> {row.question.title}<small>근거 {Array.from(new Set(row.question.refs.map(ref => passages[ref].source))).join(" · ")}</small>
        {row.status === "na" && <p>{row.automatic ? "기본정보에 따른 제외" : "직접 선택한 제외"} · {row.reason || "사유 미기록"}</p>}
      </div><span className={styles.status} data-status={row.status}>{labels[row.status]}</span>
    </li>)}</ul>
    <h3>근거자료</h3><ul className={styles.sources}>{Object.entries(sources).map(([id, s]) => <li key={id}><a href={s.url} target="_blank" rel="noreferrer">{id} · {s.title}</a> · {s.date}</li>)}</ul>
    <p className={styles.note}>개인정보위 보도자료를 바탕으로 작성한 자가점검 결과입니다. 확인 방법과 증적 예시는 실무 참고자료입니다. 접속기록의 법정 보존기간 등은 적용 법령을 별도로 확인하세요.</p>
  </section>;
}
