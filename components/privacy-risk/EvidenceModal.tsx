"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { localDateKey } from "../../lib/privacy-risk/dates";
import type { CheckItem,Evidence } from "../../lib/privacy-risk/types";
import { MiniIcon } from "./Icons";

export function EvidenceModal({ item, onClose, onSave }: { item: CheckItem; onClose: () => void; onSave: (entry: Evidence) => void }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [owner, setOwner] = useState("");
  const [date, setDate] = useState(localDateKey());
  const submit = (event: FormEvent) => { event.preventDefault(); if (title.trim()) onSave({ title: title.trim(), note: note.trim(), owner: owner.trim(), date }); };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><form className="modal-card evidence-modal" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="evidence-title"><button className="modal-close" type="button" onClick={onClose} aria-label="닫기"><MiniIcon name="close" /></button><span className="modal-kicker">{item.id}번 항목</span><h2 id="evidence-title">증적자료 기록</h2><p>파일 자체가 아닌 확인한 자료의 명칭과 위치를 기록합니다. 입력 내용은 이 기기에만 저장됩니다.</p><div className="suggested-evidence"><b>안내서의 증적 예시</b>{item.evidence.map((text) => <button type="button" key={text} onClick={() => setTitle(text)}>{text}<span>+</span></button>)}</div><label>증적명<input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 2026년 개인정보보호 교육결과 보고" /></label><label>문서·화면 설명<textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="문서 위치, 시스템 메뉴, 확인한 설정 등을 입력하세요." /></label><div className="form-grid"><label>담당부서<input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="예: 정보보호팀" /></label><label>확인일자<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>취소</button><button className="primary-button" disabled={!title.trim()}>증적 기록하기</button></div></form></div>;
}

