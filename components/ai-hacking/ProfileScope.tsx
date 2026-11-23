import { areaKeys, areas, orgOptions, scopeOptions, techKeys, techNames } from "../../lib/ai-hacking/model";
import type { Profile, Row, Use } from "../../lib/ai-hacking/model";
import styles from "./assessment.module.css";

export function ProfileForm({ profile, onChange }: { profile: Profile; onChange: (value: Profile) => void }) {
  return <div className={styles.panel}>
    <p>선택한 범위 전체를 기준으로 답하세요. 수탁업체와 내장 구성요소의 사용 여부가 불분명하면 ‘확인 필요’를 선택하세요.</p>
    <div className={styles.formGrid}>
      <label>기관·기업 유형<select value={profile.organization} onChange={e => onChange({ ...profile, organization: e.target.value as Profile["organization"] })}>
        <option value="">선택 전</option>{orgOptions.map(v => <option key={v}>{v}</option>)}</select></label>
      <label>점검 대상 범위<select value={profile.scope} onChange={e => onChange({ ...profile, scope: e.target.value as Profile["scope"] })}>
        <option value="">선택 전</option>{scopeOptions.map(v => <option key={v}>{v}</option>)}</select></label>
      <label>점검일<input type="date" value={profile.date} onChange={e => onChange({ ...profile, date: e.target.value })}/></label>
    </div>
    <h3>대상 기술과 운영 환경</h3>
    <div className={styles.formGrid}>{techKeys.map(key =>
      <label key={key}>{techNames[key]} {key === "vendor" ? "존재 여부" : "사용 여부"}
        <select value={profile[key]} onChange={e => onChange({ ...profile, [key]: e.target.value as Use })}>
          <option value="unknown">확인 필요</option><option value="yes">{key === "vendor" ? "있음" : "사용"}</option>
          <option value="no">{key === "vendor" ? "없음" : "미사용"}</option>
        </select>
      </label>)}</div>
  </div>;
}

export function ScopeSummary({ rows }: { rows: Row[] }) {
  const excluded = rows.filter(row => row.status === "na");
  return <section className={styles.panel}>
    <h3>전체 {rows.length}문항 중 {rows.length - excluded.length}문항 적용</h3>
    <p>미사용으로 확인된 기술에만 연결된 문항은 사유와 함께 제외합니다. ‘확인 필요’인 기술은 점검 대상에 포함합니다. 조건을 다시 변경하면 이전의 직접 응답을 확인할 수 있습니다.</p>
    <ul className={styles.scopeList}>{areaKeys.map(area => {
      const group = rows.filter(row => row.question.area === area);
      const active = group.filter(row => row.status !== "na");
      return <li key={area}><b>{area}. {areas[area]}</b><span>적용 {active.length} / {group.length}</span></li>;
    })}</ul>
    {excluded.length > 0 && <details className={styles.details}><summary>해당 없음 {excluded.length}문항과 사유</summary>
      <ul>{excluded.map(row => <li key={row.question.id}><b>{row.question.id}</b> {row.question.title} · {row.reason || "사유 미기록"} ({row.automatic ? "기본정보 기준" : "직접 선택"})</li>)}</ul>
    </details>}
  </section>;
}
