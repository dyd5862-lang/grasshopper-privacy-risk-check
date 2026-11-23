import { localDateKey } from "../privacy-risk/dates";
import { areas, labels, orgOptions, scopeOptions, steps, techKeys } from "./model";
import type { Assessment } from "./model";
import { questions } from "./questions";

export const storageKey = "grasshopper-ai-hacking-check-v1";
const validIds = new Set(questions.map(q => q.id));
export const reasonLimit = 200;

export function initialState(date = localDateKey()): Assessment {
  return {
    tool: "grasshopper-ai-hacking", version: 1, step: "intro", area: "A",
    profile: { organization: "", scope: "", java: "unknown", php: "unknown", db: "unknown", vendor: "unknown", date },
    answers: {},
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function hasKey<T extends object>(object: T, key: unknown): key is Extract<keyof T, string> {
  return typeof key === "string" && Object.prototype.hasOwnProperty.call(object, key);
}
function inList<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (list as readonly string[]).includes(value);
}
function validDate(value: unknown): value is string {
  if (value === "") return true;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T12:00:00Z");
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function parseAssessment(raw: string): Assessment {
  const parsed: unknown = JSON.parse(raw);
  if (!isRecord(parsed) || parsed.tool !== "grasshopper-ai-hacking" || parsed.version !== 1) {
    throw new Error("AI 해킹 관련 점검 도구의 버전 1 저장 파일을 선택하세요.");
  }
  const profile = parsed.profile;
  if (!isRecord(profile) || !validDate(profile.date) || !inList(["", ...orgOptions] as const, profile.organization)
    || !inList(["", ...scopeOptions] as const, profile.scope) || !isRecord(parsed.answers)
    || !hasKey(steps, parsed.step) || !hasKey(areas, parsed.area)) {
    throw new Error("점검 기본정보 또는 저장 형식을 확인하세요.");
  }
  const restored = initialState(profile.date);
  restored.step = parsed.step;
  restored.area = parsed.area;
  restored.profile.organization = profile.organization;
  restored.profile.scope = profile.scope;
  for (const key of techKeys) {
    const value = profile[key];
    if (!inList(["yes", "no", "unknown"] as const, value)) throw new Error("기술 사용 여부 값이 올바르지 않습니다.");
    restored.profile[key] = value;
  }
  for (const [id, answer] of Object.entries(parsed.answers)) {
    if (!validIds.has(id) || !isRecord(answer) || !hasKey(labels, answer.status)
      || typeof answer.reason !== "string" || answer.reason.length > reasonLimit) {
      throw new Error("점검문항의 응답 또는 사유 형식이 올바르지 않습니다.");
    }
    restored.answers[id] = { status: answer.status, reason: answer.status === "na" ? answer.reason : "" };
  }
  return restored;
}
