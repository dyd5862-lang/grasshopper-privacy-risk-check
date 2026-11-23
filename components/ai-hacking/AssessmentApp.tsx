"use client";

import Image from "next/image";
import { useRef } from "react";
import { ReaderToolbar } from "../ReaderToolbar";
import { ToolSwitcher } from "../safeguards/ToolSwitcher";
import { areaKeys, steps } from "../../lib/ai-hacking/model";
import type { Answer, Area, Assessment, Row, Step } from "../../lib/ai-hacking/model";
import { evaluate, formatRate, improvements, summarize } from "../../lib/ai-hacking/assessment";
import { questions } from "../../lib/ai-hacking/questions";
import { sources } from "../../lib/ai-hacking/sources";
import { parseAssessment } from "../../lib/ai-hacking/storage";
import { useLocalAssessment } from "./useLocalAssessment";
import { Checklist } from "./Checklist";
import { ProfileForm, ScopeSummary } from "./ProfileScope";
import { Results } from "./Results";
import styles from "./assessment.module.css";

const focusHeading = (id: string) => requestAnimationFrame(() => {
  const el = document.getElementById(id);
  el?.focus({ preventScroll: true });
  el?.scrollIntoView({ block: "start", behavior: "instant" });
});

export default function AssessmentApp() {
  const { state, ready, message, save, clear, setMessage } = useLocalAssessment();
  const fileInput = useRef<HTMLInputElement>(null);
  const rows = evaluate(questions, state), counts = summarize(rows);
  function go(step: Step) {
    save({ ...state, step });
    focusHeading(step === "result" ? "ai-result-heading" : "ai-stage-heading");
  }
  function selectArea(area: Area) {
    save({ ...state, area });
    focusHeading("ai-area-heading");
  }
  function answer(id: string, value: Answer) {
    save({ ...state, answers: { ...state.answers, [id]: value } });
  }
  function edit(row: Row) {
    save({ ...state, step: "check", area: row.question.area });
    focusHeading("item-" + row.question.id);
  }
  function download() {
    const report = {
      ...state, summary: counts,
      byArea: Object.fromEntries(areaKeys.map(key => [key, summarize(rows.filter(row => row.question.area === key))])),
      items: rows.map(({ question, status, reason, automatic }) => ({ id: question.id, title: question.title, status, reason, automatic })),
      followUp: improvements(rows).map(({ question, status }) => ({
        id: question.id, priority: question.priority, status, verification: question.method, action: question.action,
      })),
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url; a.download = "메뚜기-AI해킹예방점검-" + (state.profile.date || "점검일미입력") + ".json";
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function restore(file?: File) {
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error("1MB 이하의 점검 결과 JSON 파일을 선택하세요.");
      const next: Assessment = parseAssessment(await file.text());
      if (!window.confirm("현재 AI 해킹 관련 점검을 선택한 파일의 응답으로 교체할까요?")) return;
      save(next, true);
      focusHeading(next.step === "result" ? "ai-result-heading" : "ai-stage-heading");
    } catch (error) {
      setMessage(error instanceof SyntaxError ? "JSON 형식이 올바르지 않습니다. 현재 응답을 유지합니다." :
        error instanceof Error ? error.message : "파일을 읽지 못했습니다. 현재 응답을 유지합니다.");
    }
  }

  const intro = state.step === "intro";
  return <main className={"reader-shell " + styles.shell}>
    <ToolSwitcher active="ai-hacking"/><ReaderToolbar/>
    <div className={styles.container}>
      <header className={styles.hero + " no-print"} data-intro={intro}>
        <div><p className={styles.kicker}>메뚜기가 만든 개인정보 보호 자가 점검 도구</p>
          <h1>AI 해킹 관련 점검 도구</h1>
          <p>기업·기관의 개인정보 유출 예방을 위한 보안 취약점 및 보호조치 자가 점검</p>
        </div>{intro && <Image src="/images/grasshopper-hero.webp" alt="" width={170} height={170} priority/>}
      </header>
      <nav className={styles.steps + " no-print"} aria-label="AI 해킹 예방 점검 단계">
        {(Object.keys(steps) as Step[]).map((step, i) => <button key={step} disabled={!ready} aria-current={state.step === step ? "step" : undefined} onClick={() => go(step)}>
          <span aria-hidden="true">{i+1}</span>{steps[step]}</button>)}
      </nav>
      <div className={styles.saveStatus + " no-print"} role="status" aria-live="polite">{message}</div>
      {state.step !== "result" && <div className="no-print">
        <h2 id="ai-stage-heading" className={styles.stageTitle} tabIndex={-1}>{steps[state.step]}</h2>
        {intro && <section className={styles.panel}><p className={styles.lead}>AI를 악용한 해킹 및 Java·PHP 등 시스템 보안 취약점으로 인한 개인정보 유출 위험을 사전에 확인하고, 정보자산·API·DB 접근통제 등의 보호조치 이행 상태를 점검합니다.</p>
          <p>공공기관·민간기업의 개인정보 보호책임자와 담당자, 시스템 개발·운영 및 정보보안 담당자, 수탁업체 관리 담당자가 이용할 수 있습니다.</p>
          <h3>점검하는 방법</h3><ol className={styles.instructions}>
            <li>기관 전체 또는 특정 서비스 등 점검 범위를 정하고 사용하는 기술을 선택합니다.</li>
            <li>7개 영역 34문항을 검토합니다. 증적은 기관 내부에서 확인하고 판단이 어려우면 ‘확인 필요’를 선택합니다.</li>
            <li>결과에서 시급한 개선조치와 확인할 항목을 검토하고, 파일로 보관하거나 인쇄합니다.</li></ol>
          <p className={styles.note}>응답은 현재 브라우저에 저장됩니다. 실제 개인정보·비밀번호·인증키·내부 주소·접속기록 원문을 입력하지 마세요.</p>
          <details className={styles.details}><summary>공식자료와 점검 기준</summary><div className={styles.helpBody}>
            <ul className={styles.sources}>{Object.entries(sources).map(([id,s]) => <li key={id}><a href={s.url} target="_blank" rel="noreferrer">{id} · {s.title}</a> · {s.date}</li>)}</ul>
            <p>AI 악용은 점검의 배경입니다. Java·PHP는 각각의 제품 공지에 따라 확인합니다. 문항 도움말에서 보도자료의 해당 대목과 실무 보완 내용을 확인할 수 있습니다.</p>
            <p>확인 방법·증적 예시·개선 우선순위는 실무 참고사항입니다. 법적 의무와 위반 여부는 적용 법령을 별도로 검토하세요.</p>
          </div></details>
          <button className={styles.primary} disabled={!ready} onClick={() => go("profile")}>기본정보 입력하기</button>
        </section>}
        {state.step === "profile" && <><ProfileForm profile={state.profile} onChange={profile => save({ ...state, profile })}/>
          <div className={styles.actions}><button className={styles.primary} onClick={() => go("scope")}>적용 대상 문항 확인</button></div></>}
        {state.step === "scope" && <><ScopeSummary rows={rows}/><div className={styles.actions}><button className={styles.secondary} onClick={() => go("profile")}>기본정보 수정</button>
          <button className={styles.primary} onClick={() => go("check")}>영역별 점검 시작</button></div></>}
        {state.step === "check" && <><div className={styles.progressBlock}>
          <div><b>점검 진행률 {formatRate(counts.progress)}</b><span>응답 {counts.answered} / 적용 {counts.applicable}문항</span></div>
          <progress aria-label="적용 문항 점검 진행률" max={counts.applicable || 1} value={counts.answered}/></div>
          <Checklist rows={rows} area={state.area} onArea={selectArea} onAnswer={answer} onResult={() => go("result")}/></>}
      </div>}
      {ready && <div className={state.step === "result" ? "" : styles.printOnly}><Results profile={state.profile} rows={rows} onEdit={edit}/></div>}
      {ready && <div className={styles.fileActions + " no-print"} aria-label="점검 결과 관리">
        <button className={styles.secondary} onClick={download}>결과 파일 저장</button>
        <button className={styles.secondary} onClick={() => fileInput.current?.click()}>저장 파일 복원</button>
        <input hidden type="file" accept=".json,application/json" ref={fileInput} aria-label="복원할 점검 파일" onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; void restore(file); }}/>
        <button className={styles.secondary} onClick={() => window.print()}>인쇄 / PDF 저장</button>
        <button className={styles.textButton} onClick={() => { if (clear()) focusHeading("ai-stage-heading"); }}>점검 초기화</button>
      </div>}
      <footer className={styles.footer + " no-print"}>메뚜기 프로젝트 · 기업·기관용 개인정보 유출 예방 자가 점검</footer>
    </div>
  </main>;
}
