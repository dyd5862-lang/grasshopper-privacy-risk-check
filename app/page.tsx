"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { BrandMark } from "../components/privacy-risk/Icons";
import { ReaderToolbar } from "../components/ReaderToolbar";

export default function Home() {
  useEffect(() => {
    if (location.hash === "#about-risk") location.replace("/risk#about-risk");
  }, []);
  return <main className="reader-shell home-shell">
    <ReaderToolbar/>
    <header className="home-header no-print">
      <Link className="brand" href="/" aria-label="공통 첫 화면으로 이동"><BrandMark/><span><b>메뚜기 프로젝트</b><small>개인정보 보호 자가 점검 도구</small></span></Link>
      <nav aria-label="주요 메뉴"><a href="#tools">도구 소개</a><Link href="/risk">위험도 분석</Link><Link href="/safeguards">안전성 확보조치 점검</Link><Link href="/ai-hacking">AI 해킹 예방 점검</Link><a href="#usage">이용 안내</a></nav>
    </header>
    <div className="home-content">
      <section className="home-intro" aria-labelledby="home-title">
        <div><p className="section-kicker">메뚜기와 함께하는 개인정보 보호 점검</p><h1 id="home-title"><span>메뚜기가 만든</span>개인정보 보호<br/>자가 점검 도구</h1><p className="home-lead">개인정보 위험도 분석, 안전성 확보조치, AI 악용 해킹 예방까지,<br/>우리 기관·사업자에 필요한 개인정보 보호조치를 확인해 보세요.</p></div>
        <Image src="/images/grasshopper-hero.webp" alt="체크리스트와 돋보기를 든 메뚜기 안내자" width={340} height={340} priority/>
      </section>
      <section id="tools" className="home-tools" aria-labelledby="tools-title">
        <h2 id="tools-title">점검 목적에 맞는 도구를 아래에서 선택하세요.</h2>
        <div className="home-card-grid">
          <article className="home-tool-card"><span className="home-card-label">위험과 보호조치 확인</span><h3>개인정보 위험도 분석<br/>자가 점검 도구</h3><p>개인정보 처리 현황을 바탕으로 위험요인과 필요한 보호조치를 점검합니다.</p><p className="home-choice">개인정보 처리에 따른 위험과 보호조치의 적정성을 살펴보고 싶을 때</p><Link className="home-start" href="/risk">위험도 분석 시작하기 <span aria-hidden="true">→</span></Link></article>
          <article className="home-tool-card"><span className="home-card-label">조문별 이행 상태 확인</span><h3>개인정보 안전성 확보조치<br/>자가 점검 도구</h3><p>「개인정보의 안전성 확보조치 기준」에 따른 보호조치 이행 여부를 점검합니다.</p><p className="home-choice">기준의 조문별로 우리 기관·사업자의 이행 상태를 확인하고 싶을 때</p><Link className="home-start" href="/safeguards">안전성 확보조치 점검 시작하기 <span aria-hidden="true">→</span></Link></article>
          <article className="home-tool-card"><span className="home-card-label">보안 취약점과 유출 예방</span><h3>AI 해킹 관련 점검 도구</h3><p>AI 악용 해킹 및 Java·PHP 등 보안 취약점으로 인한 개인정보 유출 위험을 사전에 점검합니다.</p><p className="home-choice">정보자산, API, DB 접근권한과 대량반출 방지조치를 확인하고 싶을 때</p><Link className="home-start" href="/ai-hacking">AI 해킹 예방 점검 시작하기 <span aria-hidden="true">→</span></Link></article>
        </div>
        <div className="home-source-status" aria-label="점검 도구 업데이트">
          <p>적용 안내서: 개인정보의 안전성 확보조치 기준 안내서(2026.11.)<br/>적용 고시: 개인정보보호위원회 고시 제2026-9호</p>
            <p>점검 도구 업데이트 : <time dateTime="2026-11-26">2026. 11. 26.</time></p>
        </div>
      </section>
      <aside className="home-help" aria-labelledby="help-title"><span className="home-help-icon" aria-hidden="true">🦗</span><div><p className="section-kicker">메뚜기 도움말</p><h2 id="help-title">어떤 점검부터 시작할까요?</h2><p>개인정보 처리에 따른 위험과 필요한 보호조치를 살펴보려면 <b>‘위험도 분석’</b>을, 안전성 확보조치 기준의 조문별 이행 여부를 확인하려면 <b>‘안전성 확보조치 점검’</b>을 선택하세요.</p><p>Java·PHP 보안 업데이트, 연계 API와 DB의 접근통제를 확인하려면 <b>‘AI 해킹 관련 점검 도구’</b>에서 시작하세요.</p></div></aside>
      <section id="usage" className="home-usage" aria-labelledby="usage-title"><h2 id="usage-title">이용 전 확인해 주세요</h2><p><strong>이 도구에는 실제 개인정보를 입력하지 마십시오.</strong></p><p>개인이 제작한 비공식 참고 도구이며, 개인정보보호위원회가 운영하거나 보증하는 서비스가 아닙니다. 점검 결과는 입력한 응답에 따른 참고자료이며, 법적 의무의 이행 여부나 법 위반 여부를 확정하는 판단은 아닙니다.</p></section>
    </div>
    <footer className="site-footer no-print"><div><BrandMark/><p><b>메뚜기가 만든 개인정보 보호 자가 점검 도구</b><br/>개인정보 위험도 분석 · 안전성 확보조치 점검 · AI 해킹 예방 점검</p></div></footer>
  </main>;
}
