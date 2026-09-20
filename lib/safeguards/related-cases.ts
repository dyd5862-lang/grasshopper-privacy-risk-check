import { caseRecords } from '../../app/cases-data';
import { publicDecisionsByCase } from '../../app/decision-data';
import { caseLinks, caseReviews, decisionReviews } from '../../data/safeguards/case-links';
import type { Evaluated } from './types';

const records = new Map(caseRecords.map(record => [record.id, record]));
export const relevanceLabels = {direct:'직접 관련', reference:'참고 사례'};
export function relatedCases(questionId: string) {
  return caseLinks.filter(link => link.questionId === questionId).map(link => ({
    link, record: records.get(link.caseId)!, review: caseReviews[link.caseId],
    decisions: (publicDecisionsByCase[link.caseId] ?? []).map(document => ({document, review: decisionReviews[document.decisionNo]})),
  })).sort((a,b) => Number(b.link.relevance === 'direct') - Number(a.link.relevance === 'direct') || b.review.decisionDate.localeCompare(a.review.decisionDate));
}
export type RelatedCase = ReturnType<typeof relatedCases>[number];
export function caseAttention(row: Evaluated): string | null {
  if (row.applicable === 'NO' || row.response.answer === 'UNANSWERED') return null;
  if (row.response.answer === 'FAIL') return '사용자 응답: 미흡';
  if (row.response.answer === 'NEEDS_REVIEW') return '사용자 응답: 추가 확인';
  if (row.answer === 'NEEDS_REVIEW') return '시스템 판단: 조건·시행일·근거 또는 이전 응답 재확인 필요';
  return null;
}
export function groupAttentionCases(rows: Evaluated[]) {
  const groups = new Map<string, { entry: RelatedCase; items: { row: Evaluated; link: RelatedCase['link']; attention: string }[] }>();
  for (const row of rows) {
    const attention = caseAttention(row);
    if (!attention) continue;
    for (const entry of relatedCases(row.question.id)) {
      const group = groups.get(entry.record.id) ?? {entry, items: []};
      group.items.push({row,link:entry.link,attention}); groups.set(entry.record.id,group);
    }
  }
  return [...groups.values()];
}
