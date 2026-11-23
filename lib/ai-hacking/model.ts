import type { advisories, passages } from "./sources";

export const areas = {
  A: "정보자산 현황 파악 및 관리", B: "불필요한 시스템·서비스 정리",
  C: "Java·PHP 보안 취약점 점검", D: "API 및 인증정보 보안 관리",
  E: "개인정보 DB 접근통제", F: "개인정보 대량유출 방지 및 접속기록 점검",
  G: "수탁업체 관리 및 침해사고 대응",
} as const;
export type Area = keyof typeof areas;
export const areaKeys = Object.keys(areas) as Area[];

export const techNames = { java: "Java", php: "PHP", db: "개인정보 DB", vendor: "외주·수탁·호스팅 환경" } as const;
export type Technology = keyof typeof techNames;
export const techKeys = Object.keys(techNames) as Technology[];
export const orgOptions = ["공공기관", "민간기업", "기타"] as const;
export const scopeOptions = ["기관 전체", "특정 시스템", "특정 서비스"] as const;
export type Use = "yes" | "no" | "unknown";
export type Profile = Record<Technology, Use> & {
  organization: "" | typeof orgOptions[number]; scope: "" | typeof scopeOptions[number]; date: string;
};
export const labels = { pending: "점검 전", pass: "이행", fail: "미이행", review: "확인 필요", na: "해당 없음" } as const;
export type Status = keyof typeof labels;
export const priorities = ["긴급", "높음", "보통"] as const;
export const steps = { intro: "이용 안내", profile: "기본정보", scope: "적용 문항", check: "영역별 점검", result: "결과보고서" } as const;
export type Step = keyof typeof steps;

export interface Question {
  id: string; area: Area; title: string; risk: string; method: string; criterion: string;
  evidence: string; action: string; target: string; requires: Technology[]; na: string;
  priority: typeof priorities[number]; refs: (keyof typeof passages)[];
  extension?: string; notices?: (keyof typeof advisories)[];
}
export interface Answer { status: Status; reason: string }
export interface Assessment {
  tool: "grasshopper-ai-hacking"; version: 1; profile: Profile;
  answers: Record<string, Answer>; step: Step; area: Area;
}
export interface Row {
  question: Question; status: Status; reason: string; automatic: boolean;
}
