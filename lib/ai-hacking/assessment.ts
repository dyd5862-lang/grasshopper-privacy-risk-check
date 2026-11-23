import { priorities, techNames } from "./model";
import type { Assessment, Profile, Question, Row } from "./model";

export function exclusionReason(question: Question, profile: Profile): string {
  return question.requires.filter(key => profile[key] === "no")
    .map(key => key === "vendor" ? "외주·수탁·호스팅 환경 없음" : techNames[key] + " 미사용").join(" · ");
}

export function evaluate(questions: Question[], state: Assessment): Row[] {
  return questions.map(question => {
    const reason = exclusionReason(question, state.profile);
    if (reason) return { question, status: "na", reason, automatic: true };
    const answer = state.answers[question.id];
    return { question, status: answer?.status ?? "pending", reason: answer?.status === "na" ? answer.reason : "", automatic: false };
  });
}

export function summarize(rows: Row[]) {
  const counts = { pass: 0, fail: 0, review: 0, na: 0, pending: 0 };
  for (const row of rows) counts[row.status]++;
  const total = rows.length;
  const applicable = total - counts.na;
  const answered = applicable - counts.pending;
  const percent = (n: number) => applicable ? Math.round(n / applicable * 100) : null;
  return { ...counts, total, applicable, answered, progress: percent(answered), compliance: percent(counts.pass) };
}

export function improvements(rows: Row[]): Row[] {
  return rows.filter(row => row.status === "fail" || row.status === "review").sort((a, b) =>
    priorities.indexOf(a.question.priority) - priorities.indexOf(b.question.priority)
    || Number(a.status === "review") - Number(b.status === "review")
    || a.question.id.localeCompare(b.question.id));
}

export function formatRate(value: number | null) {
  return value === null ? "산정 대상 없음" : value + "%";
}
