import { guideTitle, guideVersion, noticeTitle, officialGuideUrl, officialNoticeUrl } from "../../app/guide-pages";
import { encryptionConclusion } from "./evaluation";
import { answerLabel,serviceName } from "./constants";
import type { Answer,CheckItem,Evidence,Profile } from "./types";

export function createResultData(profile: Profile, answers: Record<number, Answer>, evidence: Record<number, Evidence[]>, items: CheckItem[], now = new Date(), originalSourceVersion = guideVersion) {
  return {
      title: `${serviceName} 결과`,
      createdAt: now.toISOString(),
      assessmentDate: profile.assessmentDate || null, sourceVersion:guideVersion, originalSourceVersion, guideTitle, noticeTitle, officialGuideUrl, officialNoticeUrl, encryptionConclusion:encryptionConclusion(profile,answers),
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
