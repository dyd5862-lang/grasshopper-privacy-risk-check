"use client";

import Image from "next/image";
import { privacyLawReaderBase } from "../../lib/privacy-risk/legal-links";
import { MiniIcon } from "./Icons";
import type { AssessmentController } from "./useAssessment";

export function IntroScreen({ openCases, startCheck }: Pick<AssessmentController, "openCases" | "startCheck">) {
  return (<>
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><span /> 개인정보보호위원회 안내서 기반</div>
              <span className="hero-maker">메뚜기가 만든</span>
              <h1>
                <span className="hero-title-line">개인정보 위험도 분석</span>
                <em className="hero-title-line">자가 점검 도구</em>
              </h1>
              <p>
                <b>
                  <span className="hero-text-line">개인정보 보호조치가 제대로 이루어지고 있는지 26개</span>{" "}
                  <span className="hero-text-line">점검항목을 통해 직접 확인해 보세요.</span>
                </b><br />
                <span className="hero-text-line">법적 근거, 개인정보보호위원회 안내서, 실제 조사·처분 사례와</span>{" "}
                <span className="hero-text-line">개선방법까지 함께 확인할 수 있습니다.</span>
              </p>
              <div className="hero-actions">
                <button className="primary-button" onClick={startCheck}>자가점검 시작하기 <MiniIcon name="arrow" /></button>
                <a className="secondary-button" href="#about-risk">위험도 분석 알아보기</a>
                <button className="secondary-button" onClick={() => openCases()}><MiniIcon name="case" /> 조사·처분 사례 찾기</button>
              </div>
              <div className="trust-line">
                <span><MiniIcon name="check" /> 입력정보 기기 내 저장</span>
                <span><MiniIcon name="check" /> 공식 법령·사례 연계</span>
                <span><MiniIcon name="check" /> 결과보고서 제공</span>
              </div>
            </div>
            <div className="hero-panel mascot-hero" aria-label="체크리스트를 점검하는 메뚜기 안내자">
              <div className="mascot-orbit" />
              <Image src="/images/grasshopper-hero.webp" alt="체크리스트와 돋보기를 든 전문적인 메뚜기 안내자" width={1254} height={1254} priority />
              <div className="mascot-caption">
                <span>🦗 메뚜기 도움말</span>
                <b>어려운 보호조치도 한 항목씩<br />근거와 함께 확인해 드립니다.</b>
                <small>개인이 제작한 비공식 참고 도구이며, 개인정보보호위원회가 운영하거나 보증하는 서비스가 아닙니다.</small>
              </div>
              <span className="floating-note note-one"><b>26개 점검항목</b><small>기관 11 · 시스템 15</small></span>
              <span className="floating-note note-two"><b>공식자료 연계</b><small>법령 · 안내서 · 처분사례</small></span>
            </div>
          </section>

          <section className="hero-capabilities" aria-label="이 도구로 확인할 수 있는 내용">
            <div><span className="section-kicker">이 도구로 확인할 수 있습니다</span><h2>판단 근거부터 개선방법까지 한곳에서</h2></div>
            <div className="capability-grid">
              {["⚖️|관련 개인정보 보호법", "📘|안전성 확보조치 기준", "📖|개인정보위 안내서", "📎|필요한 증적자료", "📋|실제 조사·처분 사례", "📰|개인정보위 보도자료", "🛠|미흡사항 개선방법"].map((item) => { const [icon, label] = item.split("|"); return <article key={label}><span>{icon}</span><b>{label}</b></article>; })}
            </div>
          </section>

          <section className="process-section" id="about-risk">
            <div className="section-heading">
              <span className="section-kicker">점검 흐름</span>
              <h2>체크리스트를 넘어,<br />개선계획까지 이어집니다</h2>
              <p>안내서의 점검항목과 참고 설명을 확인하고, 공식 안내서 원문으로 연결합니다.</p>
            </div>
            <div className="process-grid">
              {[
                ["01", "대상 확인", "개인정보 처리 현황을 먼저 확인합니다."],
                ["02", "보호조치 점검", "기관 11개, 시스템 15개 원문 항목에 답하고 증적을 기록합니다."],
                ["03", "자동 판정", "충족, 미흡, 추가 확인 등으로 구분하여 안내합니다."],
                ["04", "결과보고서", "법적 근거와 개선 우선순위를 포함한 보고서를 인쇄합니다."],
              ].map(([number, title, body]) => (
                <article key={number} className="process-card"><span>{number}</span><h3>{title}</h3><p>{body}</p></article>
              ))}
            </div>
          </section>

          <section className="coverage-section">
            <div className="coverage-copy">
              <span className="section-kicker light">점검 범위</span>
              <h2>보호조치의 핵심을<br />빠짐없이 살펴봅니다</h2>
              <p>기관 정책부터 실제 데이터베이스와 웹서버 운영까지, 안내서 부록의 26개 항목을 그대로 담았습니다.</p>
              <button className="text-button" onClick={startCheck}>내 시스템 점검하기 <MiniIcon name="arrow" /></button>
            </div>
            <div className="coverage-list">
              {["개인정보 보호책임자·내부 관리계획", "외주인력·교육·소프트웨어 정책", "네트워크 접근통제·보안패치", "DB 접근권한·인증·접속기록", "물리적 통제·보조저장매체·파기", "웹 취약점 점검·웹서버 보호"].map((item, index) => (
                <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b><MiniIcon name="arrow" /></div>
              ))}
            </div>
          </section>

          <section className="disclaimer-band">
            <div><MiniIcon name="scale" /></div>
            <p><b>자가점검 결과는 공식적인 법 위반 판단이 아닙니다.</b><br />위험도 표시는 개선 우선순위를 정하기 위한 보조지표입니다. 실제 의무와 제재는 구체적 사실관계와 점검일 현재의 현행 법령을 확인해야 합니다.</p>
            <a href={`${privacyLawReaderBase}?document=privacy-law`} target="_blank" rel="noreferrer">보-편에서 현행 법령 보기 <MiniIcon name="arrow" /></a>
          </section>
        </>);
}
