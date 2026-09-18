import { answerLabel,serviceName } from "./constants";
import type { Answer,CheckItem,Evidence,Profile } from "./types";

export function createResultData(profile: Profile, answers: Record<number, Answer>, evidence: Record<number, Evidence[]>, items: CheckItem[], now = new Date()) {
  return {
      title: `${serviceName} 결과`,
      createdAt: now.toISOString(),
      profile,
      results: items.map((item) => ({
        number: item.id,
        question: item.question,
        answer: answers[item.id] ? answerLabel[answers[item.id]] : "미답변",
        evidence: evidence[item.id] ?? [],
        guide: item.page,
        legalReference: `${item.law} / ${item.standard}`,
      })),
    };
}
