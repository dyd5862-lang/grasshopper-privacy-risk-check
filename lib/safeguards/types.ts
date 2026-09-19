export type Tri = 'YES' | 'NO' | 'UNKNOWN';
export type Answer = 'PASS' | 'FAIL' | 'NEEDS_REVIEW' | 'NOT_APPLICABLE' | 'UNANSWERED';
export type Question = {
  id: string; sourceVersion: string; basisType: string; article: string; sourcePages: string;
  question: string; applicability: string; effectiveFrom: string | null;
  evaluationMode: string; evidenceExamples: string; passCriteria: string; failCriteria: string;
  criteria: string; scopeKey: string; section: string; group: string; sourceRow: string;
};
export type Response = { answer: Answer; reason: string; evidenceRef: string; checkedAt: string; context: string };
export type ScopeConfirmation = { value: Tri; reason: string; evidenceRef: string; context: string };
export type State = {
  schemaVersion: 1; sourceVersion: string;
  profile: { organization: string; systemName: string; fileName: string; date: string };
  facts: Record<string, string>; factNotes: Record<string, string>;
  responses: Record<string, Response>; scopes: Record<string, ScopeConfirmation>;
};
export type Condition = { value: Tri; reason: string };
export type Conditions = Record<'M'|'G'|'I'|'P'|'U'|'R', Condition>;
export type Evaluated = {
  question: Question; applicable: Tri; applicabilityReason: string;
  bucket: 'general'|'public'|'risk'|'readiness'; answer: Answer;
  response: Response; needsScope: boolean; stale: boolean;
};
