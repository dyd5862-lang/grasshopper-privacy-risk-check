export type AssessmentCounts = {
  yes: number;
  no: number;
  unknown: number;
  na: number;
  evidenceMissing: number;
};

export function evaluateAssessment(counts: AssessmentCounts, total: number) {
  const unanswered = Math.max(0, total - counts.yes - counts.no - counts.unknown - counts.na);
  if (counts.no > 0) {
    return { unanswered, level: "high", priority: "높음", symbol: "!", message: "보완이 필요한 보호조치가 있습니다" } as const;
  }
  if (counts.unknown > 0 || counts.evidenceMissing > 0 || unanswered > 0) {
    return { unanswered, level: "medium", priority: "보통", symbol: "△", message: "추가 확인과 증적 보완이 필요합니다" } as const;
  }
  return { unanswered, level: "low", priority: "낮음", symbol: "✓", message: "입력 기준 보호조치가 충족되었습니다" } as const;
}
