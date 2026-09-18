"use client";

import { guideTitle,officialGuideUrl } from "../../app/guide-pages";
import type { CheckItem } from "../../lib/privacy-risk/types";
import { MiniIcon } from "./Icons";

export function GuidePageModal({ item, onClose }: { item: CheckItem; onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><article className="modal-card guide-page-modal" role="dialog" aria-modal="true" aria-labelledby="guide-page-title"><button className="modal-close" onClick={onClose} aria-label="닫기"><MiniIcon name="close" /></button><span className="modal-kicker">{item.id}번 점검항목 · 안내서 참고</span><h2 id="guide-page-title">{guideTitle}</h2><p>{item.question}</p><section className="guide-page-sheet" aria-label="점검항목 설명 및 공식 출처"><header><span>프로젝트의 점검항목 설명</span><b>{item.page}</b></header><div className="guide-page-copy"><p>{item.easy}</p><p>이 설명은 자가점검을 돕기 위한 참고 설명이며, 안내서 원문을 대체하지 않습니다. 상세 해설과 원문은 아래 개인정보보호위원회 안내서 게시판에서 문서 제목과 발행월(2025.11.)을 확인하여 열람하세요.</p></div><footer>출처: 개인정보보호위원회, 「개인정보의 안전성 확보조치 기준 안내서」, 2025.11., {item.page}. 원문 이용조건은 공식 게시물과 첨부문서를 확인하세요.</footer></section><div className="modal-actions"><button className="secondary-button" onClick={onClose}>닫기</button><a className="primary-button" href={officialGuideUrl} target="_blank" rel="noreferrer">공식 안내서 게시판 <MiniIcon name="arrow" /></a></div></article></div>;
}

