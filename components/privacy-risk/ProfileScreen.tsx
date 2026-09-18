"use client";

import type { Profile } from "../../lib/privacy-risk/types";
import { MiniIcon } from "./Icons";
import type { AssessmentController } from "./useAssessment";

export function ProfileScreen({ setScreen, profile, setProfile, targetStatus, updateIdentifier, beginQuestions }: Pick<AssessmentController, "setScreen" | "profile" | "setProfile" | "targetStatus" | "updateIdentifier" | "beginQuestions">) {
  return (<section className="workspace profile-workspace">
          <div className="workspace-heading">
            <button className="back-link" onClick={() => setScreen("intro")}>← 서비스 안내</button>
            <span className="step-label">1 / 3 · 사전 대상 확인</span>
            <h1>먼저 점검 대상을 알려주세요</h1>
            <p>위험도 분석 적용 여부와 점검 범위를 정하는 데 필요한 최소 정보입니다.<br />이 도구에는 실제 개인정보를 입력하지 마십시오.</p>
          </div>

          <div className="profile-layout">
            <div className="form-card">
              <div className="form-section">
                <div className="form-section-title"><span>01</span><div><h2>기본정보</h2><p>점검 결과보고서의 기본정보로 사용됩니다.</p></div></div>
                <div className="form-grid">
                  <label>기관명 또는 사업자명<input value={profile.organization} onChange={(e) => setProfile({ ...profile, organization: e.target.value })} placeholder="예: ○○기관" /></label>
                  <label>기관 유형<select value={profile.organizationType} onChange={(e) => setProfile({ ...profile, organizationType: e.target.value })}>{["공공기관", "대기업", "중견기업", "중소기업", "소상공인", "개인", "단체", "기타"].map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label>개인정보처리시스템명<input value={profile.systemName} onChange={(e) => setProfile({ ...profile, systemName: e.target.value })} placeholder="예: 민원관리시스템" /></label>
                  <label>개인정보파일명<input value={profile.fileName} onChange={(e) => setProfile({ ...profile, fileName: e.target.value })} placeholder="예: 민원처리기록" /></label>
                  <label className="full-field">처리 목적<textarea value={profile.purpose} onChange={(e) => setProfile({ ...profile, purpose: e.target.value })} placeholder="개인정보를 처리하는 주요 목적을 입력하세요." /></label>
                  <label>정보주체 수<input type="number" min="0" value={profile.dataSubjects} onChange={(e) => setProfile({ ...profile, dataSubjects: e.target.value })} placeholder="명" /></label>
                  <label>개인정보취급자 수<input type="number" min="0" value={profile.handlers} onChange={(e) => setProfile({ ...profile, handlers: e.target.value })} placeholder="명" /></label>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title"><span>02</span><div><h2>고유식별정보와 저장 방식</h2><p>해당하는 정보를 모두 선택하세요.</p></div></div>
                <div className="choice-grid">
                  {["주민등록번호", "여권번호", "운전면허번호", "외국인등록번호"].map((identifier) => (
                    <button key={identifier} className={profile.identifiers.includes(identifier) ? "selected" : ""} onClick={() => updateIdentifier(identifier)}><span>{profile.identifiers.includes(identifier) ? "✓" : ""}</span>{identifier}</button>
                  ))}
                </div>
                <label className="field-label">선택한 고유식별정보의 저장 방식</label>
                <div className="radio-cards">
                  {[
                    ["all", "모두 암호화", "대상 정보를 모두 암호화하여 저장"],
                    ["partial", "일부 암호화", "일부 항목만 암호화하여 저장"],
                    ["none", "암호화하지 않음", "대상 정보를 평문으로 저장"],
                    ["unknown", "확인 필요", "현재 저장 방식을 알 수 없음"],
                  ].map(([value, title, body]) => (
                    <button key={value} className={profile.storage === value ? "selected" : ""} onClick={() => setProfile({ ...profile, storage: value as Profile["storage"] })}><span className="radio-dot" /><div><b>{title}</b><small>{body}</small></div></button>
                  ))}
                </div>
              </div>

              <div className="form-section last">
                <div className="form-section-title"><span>03</span><div><h2>시스템 환경</h2><p>추가 위험요소와 적용 문항을 확인합니다.</p></div></div>
                <div className="toggle-list">
                  {[
                    ["sensitive", "민감정보를 처리합니다", "건강, 사상·신념 등 법에서 정한 민감정보"],
                    ["website", "인터넷 홈페이지를 운영합니다", "웹 기반 점검항목 25~26번 적용"],
                    ["externalNetwork", "외부망과 연결되어 있습니다", "인터넷 또는 외부 구간과 연결"],
                    ["outsourced", "외부 위탁인력이 접근합니다", "개발·유지보수 등 외부인력 포함"],
                  ].map(([key, title, body]) => (
                    <label className="toggle-row" key={key}><div><b>{title}</b><small>{body}</small></div><input type="checkbox" checked={profile[key as keyof Profile] as boolean} onChange={(e) => setProfile({ ...profile, [key]: e.target.checked })} /><span className="toggle" /></label>
                  ))}
                </div>
              </div>
            </div>

            <aside className={`target-card ${targetStatus.tone}`}>
              <span className="target-kicker">대상 여부 안내</span>
              <div className="target-symbol">{targetStatus.tone === "success" ? "✓" : targetStatus.tone === "danger" ? "!" : targetStatus.tone === "warning" ? "↗" : "i"}</div>
              <h2>{targetStatus.title}</h2>
              <p>{targetStatus.body}</p>
              <div className="target-note"><b>꼭 확인하세요</b><p>위험도 분석은 개인정보파일 단위로 실시합니다. ‘예’ 답변에는 해당 조치를 입증하는 증적자료가 필요합니다.</p></div>
              <button className="primary-button full" onClick={beginQuestions}>26개 보호조치 점검 <MiniIcon name="arrow" /></button>
              <small className="privacy-note">입력 내용은 현재 브라우저 기기에만 저장됩니다.</small>
            </aside>
          </div>
        </section>);
}
