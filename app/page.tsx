"use client";

import { ToolSwitcher } from "../components/safeguards/ToolSwitcher";
import { CaseModal } from "../components/privacy-risk/CaseModal";
import { CasesScreen } from "../components/privacy-risk/CasesScreen";
import { ChecklistScreen } from "../components/privacy-risk/ChecklistScreen";
import { DetailModal } from "../components/privacy-risk/DetailModal";
import { EvidenceModal } from "../components/privacy-risk/EvidenceModal";
import { GuidePageModal } from "../components/privacy-risk/GuidePageModal";
import { BrandMark } from "../components/privacy-risk/Icons";
import { IntroScreen } from "../components/privacy-risk/IntroScreen";
import { ProfileScreen } from "../components/privacy-risk/ProfileScreen";
import { RelatedCasesModal } from "../components/privacy-risk/RelatedCasesModal";
import { ResultScreen } from "../components/privacy-risk/ResultScreen";
import { useAssessment } from "../components/privacy-risk/useAssessment";
import { checks } from "../lib/privacy-risk/checks";
import { serviceName } from "../lib/privacy-risk/constants";

export default function Home() {
  const controller = useAssessment();
  const { screen, setScreen, setExpanded, evidenceFor, setEvidenceFor, setDetailFor, setGuideFor, selectedCase, setSelectedCase, setCaseListFor, readerPreferences, isFullscreen, completed, casesForItem, openCases, addEvidence, resetAll, updateReaderPreference, resetReaderPreferences, toggleFullscreen, activeDetail, activeGuideItem, activeCaseListItem } = controller;
  return (
    <main className="reader-shell">
      <ToolSwitcher active="risk" />
      <div className="reader-toolbar no-print" aria-label="화면 보기 설정">
        <div className="reader-controls">
          <div className="theme-buttons" role="group" aria-label="색상 테마">
            <button className={readerPreferences.theme === "light" ? "active" : ""} aria-pressed={readerPreferences.theme === "light"} onClick={() => updateReaderPreference("theme", "light")}><span aria-hidden="true">☼</span> Light</button>
            <button className={readerPreferences.theme === "dark" ? "active" : ""} aria-pressed={readerPreferences.theme === "dark"} onClick={() => updateReaderPreference("theme", "dark")}><span aria-hidden="true">◐</span> Dark</button>
          </div>
          <button className="toolbar-button" onClick={toggleFullscreen} aria-pressed={isFullscreen}>{isFullscreen ? "전체 화면 종료" : "전체 화면"}</button>
          <label className="range-control"><span>글자</span><input type="range" min="14" max="22" step="1" value={readerPreferences.fontSize} onChange={(event) => updateReaderPreference("fontSize", Number(event.target.value))} aria-label="글자 크기" /><output>{readerPreferences.fontSize}px</output></label>
          <label className="range-control"><span>행간</span><input type="range" min="1.4" max="2" step="0.1" value={readerPreferences.lineHeight} onChange={(event) => updateReaderPreference("lineHeight", Number(event.target.value))} aria-label="행간" /><output>{readerPreferences.lineHeight.toFixed(1)}</output></label>
          <button className="toolbar-button" onClick={resetReaderPreferences}>초기화</button>
        </div>
        <div className="feedback-link" role="note">
          <span>오류제보 및 기능개선 요청 :</span>
          <a href="mailto:lyh87@korea.kr">lyh87@korea.kr</a>
        </div>
      </div>
      <header className="site-header no-print">
        <button className="brand" onClick={() => setScreen("intro")} aria-label="첫 화면으로 이동">
          <BrandMark />
          <span><b>메뚜기 프로젝트</b><small>Grasshopper Project</small></span>
        </button>
        <nav aria-label="주요 메뉴">
          <button className={screen === "intro" ? "active" : ""} onClick={() => setScreen("intro")}>서비스 안내</button>
          <button className={screen === "profile" ? "active" : ""} onClick={() => setScreen("profile")}>대상 확인</button>
          <button className={screen === "check" ? "active" : ""} onClick={() => setScreen("check")}>자가점검</button>
          <button className={screen === "result" ? "active" : ""} onClick={() => setScreen("result")}>결과</button>
          <button className={screen === "cases" ? "active" : ""} onClick={() => openCases()}>조사·처분 사례</button>
        </nav>
        <div className="header-actions">
          {completed > 0 && <span className="saved-pill"><span /> 자동 저장됨</span>}
          <button className="icon-button" onClick={resetAll} aria-label="점검 초기화" title="점검 초기화">↺</button>
        </div>
      </header>

      {screen === "intro" && <IntroScreen {...controller} />}

      {screen === "profile" && <ProfileScreen {...controller} />}

      {screen === "check" && <ChecklistScreen {...controller} />}

      {screen === "cases" && <CasesScreen {...controller} />}

      {screen === "result" && <ResultScreen {...controller} />}

      {evidenceFor && (
        <EvidenceModal item={checks.find((item) => item.id === evidenceFor)!} onClose={() => setEvidenceFor(null)} onSave={(entry) => addEvidence(evidenceFor, entry)} />
      )}

      {activeDetail && (
        <DetailModal item={activeDetail} cases={casesForItem(activeDetail.id)} onClose={() => setDetailFor(null)} onEvidence={() => { setDetailFor(null); setEvidenceFor(activeDetail.id); }} onGuidePage={() => { setDetailFor(null); setGuideFor(activeDetail.id); }} onCase={(record) => { setDetailFor(null); setSelectedCase(record); }} />
      )}

      {activeGuideItem && <GuidePageModal item={activeGuideItem} onClose={() => setGuideFor(null)} />}

      {activeCaseListItem && (
        <RelatedCasesModal item={activeCaseListItem} cases={casesForItem(activeCaseListItem.id)} onClose={() => setCaseListFor(null)} onCase={(record) => { setCaseListFor(null); setSelectedCase(record); }} />
      )}

      {selectedCase && <CaseModal record={selectedCase} onClose={() => setSelectedCase(null)} onOpenItem={(itemId) => { setSelectedCase(null); setScreen("check"); setExpanded(itemId); }} />}

      <footer className="site-footer no-print"><div><BrandMark /><p><b>{serviceName}</b><br />개인정보 보호조치 자가점검 및 위험도 분석 지원 서비스</p></div><p>「개인정보의 안전성 확보조치 기준 안내서」 2025.11 기반<br />본 서비스 결과는 공식적인 법률 자문이나 행정처분 판단이 아닙니다.</p></footer>
    </main>
  );
}
