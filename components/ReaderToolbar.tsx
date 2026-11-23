"use client";

import { useEffect, useState } from "react";
import { defaultReaderPreferences } from "../lib/privacy-risk/constants";
import { loadReaderPreferences, saveReaderPreferences } from "../lib/privacy-risk/storage";
import type { ReaderPreferences } from "../lib/privacy-risk/types";

export function ReaderToolbar() {
  const [preferences, setPreferences] = useState(defaultReaderPreferences);
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let saved = defaultReaderPreferences;
      try { saved = loadReaderPreferences(window.localStorage); } catch { /* Browser storage may be unavailable. */ }
      setPreferences(saved);
      document.documentElement.dataset.theme = saved.theme;
      document.documentElement.style.setProperty("--reader-text-delta", `${saved.fontSize - 17}px`);
      document.documentElement.style.setProperty("--reader-line-height", String(saved.lineHeight));
    });
    const changed = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", changed);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("fullscreenchange", changed); };
  }, []);
  function update(next: ReaderPreferences) {
    setPreferences(next);
    try { saveReaderPreferences(window.localStorage, next); } catch { /* Keep the current display preference in memory. */ }
    document.documentElement.dataset.theme = next.theme;
    document.documentElement.style.setProperty("--reader-text-delta", `${next.fontSize - 17}px`);
    document.documentElement.style.setProperty("--reader-line-height", String(next.lineHeight));
  }
  return <div className="reader-toolbar no-print" aria-label="화면 보기 설정">
      <div className="reader-controls">
        <div className="theme-buttons" role="group" aria-label="색상 테마">
          <button className={preferences.theme === "light" ? "active" : ""} aria-pressed={preferences.theme === "light"} onClick={() => update({...preferences, theme: "light"})}>☼ Light</button>
          <button className={preferences.theme === "dark" ? "active" : ""} aria-pressed={preferences.theme === "dark"} onClick={() => update({...preferences, theme: "dark"})}>◐ Dark</button>
        </div>
        <button className="toolbar-button" aria-pressed={fullscreen} onClick={async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { /* Fullscreen may be unavailable in embedded previews. */ } }}>{fullscreen ? "전체 화면 종료" : "전체 화면"}</button>
        <label className="range-control"><span>글자</span><input aria-label="글자 크기" type="range" min="14" max="22" value={preferences.fontSize} onChange={e => update({...preferences, fontSize: Number(e.target.value)})}/><output>{preferences.fontSize}px</output></label>
        <label className="range-control"><span>행간</span><input aria-label="행간" type="range" min="1.4" max="2" step="0.1" value={preferences.lineHeight} onChange={e => update({...preferences, lineHeight: Number(e.target.value)})}/><output>{preferences.lineHeight.toFixed(1)}</output></label>
        <button className="toolbar-button" aria-label="화면 설정 초기화" onClick={() => update(defaultReaderPreferences)}>초기화</button>
      </div>
      <div className="feedback-link"><span>오류제보 및 기능개선 요청 :</span><a href="mailto:lyh87@korea.kr">lyh87@korea.kr</a></div>
    </div>;
}
