"use client";

import type { CaseRecord } from "../../app/cases-data";
import type { CheckItem } from "../../lib/privacy-risk/types";
import { MiniIcon } from "./Icons";

export function RelatedCasesModal({ item, cases, onClose, onCase }: { item: CheckItem; cases: CaseRecord[]; onClose: () => void; onCase: (record: CaseRecord) => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><article className="modal-card related-cases-modal" role="dialog" aria-modal="true" aria-labelledby="related-cases-title"><button className="modal-close" onClick={onClose} aria-label="닫기"><MiniIcon name="close" /></button><span className="modal-kicker">{item.id}번 · {item.category}</span><h2 id="related-cases-title">연결된 조사·처분 사례 {cases.length}건</h2><p>현재 사이트에 수록된 개인정보보호위원회 공식자료 중 이 점검항목과 직접 관련된 사례를 모두 표시합니다.</p><section className="linked-case-section related-case-list">{cases.map((record) => <button key={record.id} onClick={() => onCase(record)}><div><span>직접 관련 · {record.date} · {record.sourceType}</span><b>{record.title}</b><small>{record.targets}</small></div><MiniIcon name="arrow" /></button>)}</section><div className="modal-actions"><button className="secondary-button" onClick={onClose}>닫기</button></div></article></div>;
}

