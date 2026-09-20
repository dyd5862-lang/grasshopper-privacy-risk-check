"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "../components/privacy-risk/Icons";
import { defaultReaderPreferences } from "../lib/privacy-risk/constants";
import { loadReaderPreferences, saveReaderPreferences } from "../lib/privacy-risk/storage";
import type { ReaderPreferences } from "../lib/privacy-risk/types";

export default function Home() {
  const [preferences, setPreferences] = useState(defaultReaderPreferences);
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = loadReaderPreferences(localStorage);
      setPreferences(saved);
      document.documentElement.dataset.theme = saved.theme;
      document.documentElement.style.setProperty("--reader-text-delta", `${saved.fontSize - 17}px`);
      document.documentElement.style.setProperty("--reader-line-height", String(saved.lineHeight));
      if (location.hash === "#about-risk") location.replace("/risk#about-risk");
    });
    const changed = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", changed);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("fullscreenchange", changed); };
  }, []);
  function update(next: ReaderPreferences) {
    setPreferences(next);
    saveReaderPreferences(localStorage, next);
    document.documentElement.dataset.theme = next.theme;
    document.documentElement.style.setProperty("--reader-text-delta", `${next.fontSize - 17}px`);
    document.documentElement.style.setProperty("--reader-line-height", String(next.lineHeight));
  }
  return <main className="reader-shell home-shell">
    <div className="reader-toolbar no-print" aria-label="화면 보기 설정">
      <div className="reader-controls">
        <div className="theme-buttons" role="group" aria-label="색상 테마">
          <button className={preferences.theme === "light" ? "active" : ""} aria-pressed={preferences.theme === "light"} onClick={() => update({...preferences, theme: "light"})}>☼ Light</button>
          <button className={preferences.theme === "dark" ? "active" : ""} aria-pressed={preferences.theme === "dark"} onClick={() => update({...preferences, theme: "dark"})}>◐ Dark</button>
        </div>
        <button className="toolbar-button" aria-pressed={fullscreen} onClick={async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { /* Fullscreen may be unavailable in embedded previews. */ } }}>{fullscreen ? "전체 화면 종료" : "전체 화면"}</button>
        <label className="range-control"><span>글자</span><input aria-label="글자 크기" type="range" min="14" max="22" value={preferences.fontSize} onChange={e => update({...preferences, fontSize: Number(e.target.value)})}/><output>{preferences.fontSize}px</output></label>
        <label className="range-control"><span>행간</span><input aria-label="행간" type="range" min="1.4" max="2" step="0.1" value={preferences.lineHeight} onChange={e => update({...preferences, lineHeight: Number(e.target.value)})}/><output>{preferences.lineHeight.toFixed(1)}</output></label>
        <button className="toolbar-button" onClick={() => update(defaultReaderPreferences)}>초기화</button>
      </div>
      <div className="feedback-link"><span>오류제보 및 기능개선 요청 :</span><a href="mailto:lyh87@korea.kr">lyh87@korea.kr</a></div>
    </div>
    <header className="home-header no-print">
      <Link className="brand" href="/" aria-label="공통 첫 화면으로 이동"><BrandMark/><span><b>메뚜기 프로젝트</b><small>개인정보 보호 자가 점검 도구</small></span></Link>
      <nav aria-label="주요 메뉴"><a href="#tools">도구 소개</a><Link href="/risk">위험도 분석</Link><Link href="/safeguards">안전성 확보조치 점검</Link><a href="#usage">이용 안내</a></nav>
    </header>
    <div className="home-content">
      <section className="home-intro" aria-labelledby="home-title">
        <div><p className="section-kicker">메뚜기와 함께하는 개인정보 보호 점검</p><h1 id="home-title"><span>메뚜기가 만든</span>개인정보 보호<br/>자가 점검 도구</h1><p className="home-lead">개인정보 위험도 분석부터 안전성 확보조치 점검까지,<br/>우리 기관·사업자에 필요한 개인정보 보호조치를 확인해 보세요.</p></div>
        <Image src="/images/grasshopper-hero.webp" alt="체크리스트와 돋보기를 든 메뚜기 안내자" width={340} height={340} priority/>
      </section>
      <section id="tools" className="home-tools" aria-labelledby="tools-title">
        <h2 id="tools-title">점검 목적에 맞는 도구를 아래에서 선택하세요.</h2>
        <div className="home-card-grid">
          <article className="home-tool-card"><span className="home-card-label">위험과 보호조치 확인</span><h3>개인정보 위험도 분석<br/>자가 점검 도구</h3><p>개인정보 처리 현황을 바탕으로 위험요인과 필요한 보호조치를 점검합니다.</p><p className="home-choice">개인정보 처리에 따른 위험과 보호조치의 적정성을 살펴보고 싶을 때</p><Link className="home-start" href="/risk">위험도 분석 시작하기 <span aria-hidden="true">→</span></Link></article>
          <article className="home-tool-card"><span className="home-card-label">조문별 이행 상태 확인</span><h3>개인정보 안전성 확보조치<br/>자가 점검 도구</h3><p>「개인정보의 안전성 확보조치 기준」에 따른 보호조치 이행 여부를 점검합니다.</p><p className="home-choice">기준의 조문별로 우리 기관·사업자의 이행 상태를 확인하고 싶을 때</p><Link className="home-start" href="/safeguards">안전성 확보조치 점검 시작하기 <span aria-hidden="true">→</span></Link></article>
        </div>
      </section>
      <aside className="home-help" aria-labelledby="help-title"><span className="home-help-icon" aria-hidden="true">🦗</span><div><p className="section-kicker">메뚜기 도움말</p><h2 id="help-title">어떤 점검부터 시작할까요?</h2><p>개인정보 처리에 따른 위험과 필요한 보호조치를 살펴보려면 <b>‘위험도 분석’</b>을, 안전성 확보조치 기준의 조문별 이행 여부를 확인하려면 <b>‘안전성 확보조치 점검’</b>을 선택하세요.</p><p>필요한 도구부터 시작하고, 두 도구를 함께 활용해 점검 내용을 보완할 수 있습니다.</p></div></aside>
      <section id="usage" className="home-usage" aria-labelledby="usage-title"><h2 id="usage-title">이용 전 확인해 주세요</h2><p><strong>이 도구에는 실제 개인정보를 입력하지 마십시오.</strong></p><p>개인이 제작한 비공식 참고 도구이며, 개인정보보호위원회가 운영하거나 보증하는 서비스가 아닙니다. 점검 결과는 입력한 응답에 따른 참고자료이며, 법적 의무의 이행 여부나 법 위반 여부를 확정하는 판단은 아닙니다.</p></section>
    </div>
    <footer className="site-footer no-print"><div><BrandMark/><p><b>메뚜기가 만든 개인정보 보호 자가 점검 도구</b><br/>개인정보 위험도 분석 · 안전성 확보조치 점검</p></div></footer>
  </main>;
}
