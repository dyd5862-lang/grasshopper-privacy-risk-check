import type { reviewedDecisions } from '../pipc/decisions-2026-11-24';

type DecisionLink = {
  questionId: string;
  decision: keyof typeof reviewedDecisions;
  relevance: '직접 관련' | '실질 관련';
  location: string;
  reason: string;
};

export const safeguardDecisionLinks: DecisionLink[] = [
  {"questionId": "M-15", "decision": "2026-222-459", "relevance": "직접 관련", "location": "주문 1.가·Ⅲ.2.가·Ⅳ.2", "reason": "앵커노드가 유출 통지·신고를 지연한 데 대해 통지 절차를 포함한 사고 대응체계를 마련하도록 명령했다."},
  {"questionId": "R-02", "decision": "2026-222-459", "relevance": "직접 관련", "location": "주문 1.가·Ⅲ.2.가·Ⅳ.2", "reason": "앵커노드가 유출 통지·신고를 지연한 데 대해 통지 절차를 포함한 사고 대응체계를 마련하도록 명령했다."},
  {"questionId": "M-15", "decision": "2026-220-441", "relevance": "직접 관련", "location": "주문 1.가·Ⅲ.2.가·Ⅳ.1", "reason": "티씨소프트가 유출 인지 후 이용자 통지를 지연해 위원회가 통지 절차를 포함한 대응체계 마련을 명령했다."},
  {"questionId": "R-02", "decision": "2026-220-441", "relevance": "직접 관련", "location": "주문 1.가·Ⅲ.2.가·Ⅳ.1", "reason": "티씨소프트가 유출 인지 후 이용자 통지를 지연해 위원회가 통지 절차를 포함한 대응체계 마련을 명령했다."},
  {"questionId": "A-01", "decision": "2026-217-384", "relevance": "직접 관련", "location": "Ⅲ.2.가", "reason": "업무에 필요한 최소 범위로 취급자 권한을 차등 부여하지 않은 행위를 당시 고시 제5조제1항 위반으로 판단했다."},
  {"questionId": "A-06", "decision": "2026-217-384", "relevance": "직접 관련", "location": "Ⅲ.2.가", "reason": "정당한 권한을 가진 취급자만 접속하도록 안전한 인증수단을 적용·관리하지 않았다."},
  {"questionId": "M-15", "decision": "2026-217-384", "relevance": "실질 관련", "location": "Ⅲ.2.나", "reason": "임직원과 고객사 임직원에게 유출을 늦게 통지했다. 이 사건은 유출 대응계획에서 통지 책임과 기한을 점검할 필요성을 보여준다."},
  {"questionId": "R-02", "decision": "2026-217-384", "relevance": "실질 관련", "location": "Ⅲ.2.나", "reason": "임직원과 고객사 임직원에게 유출을 늦게 통지했다. 이 사건은 유출 대응계획에서 통지 책임과 기한을 점검할 필요성을 보여준다."},
];
