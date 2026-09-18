import type { CaseRecord } from "../../app/cases-data";
import type { Answer,Profile,ReaderPreferences } from "./types";



export const defaultReaderPreferences: ReaderPreferences = {
  theme: "light",
  fontSize: 17,
  lineHeight: 1.6,
};

export const readerPreferencesKey = "grasshopper-reader-preferences-v1";

export const initialProfile: Profile = {
  organization: "",
  organizationType: "공공기관",
  systemName: "",
  purpose: "",
  fileName: "",
  dataSubjects: "",
  handlers: "",
  identifiers: [],
  storage: "unknown",
  sensitive: false,
  website: false,
  externalNetwork: true,
  outsourced: false,
};

export const answerLabel: Record<Answer, string> = {
  yes: "예",
  no: "아니요",
  unknown: "잘 모르겠음",
  na: "해당 없음",
};

export const serviceName = "메뚜기가 만든 개인정보 위험도 분석 자가 점검 도구";

export const answerOptions: Array<{ value: Answer; icon: string; title: string; description: string }> = [
  { value: "yes", icon: "✓", title: "예", description: "현재 조치를 이행하고 있음" },
  { value: "no", icon: "×", title: "아니요", description: "이행하지 않거나 충분하지 않음" },
  { value: "unknown", icon: "?", title: "잘 모르겠음", description: "자료와 설정을 추가 확인해야 함" },
  { value: "na", icon: "—", title: "해당 없음", description: "현재 점검대상에 적용되지 않음" },
];

export const getProgressMessage = (progress: number) => {
  if (progress === 100) return "점검이 완료되었습니다.";
  if (progress >= 76) return "거의 다 왔습니다.";
  if (progress >= 51) return "중요한 항목을 계속 확인하고 있습니다.";
  if (progress >= 26) return "절반을 향해 가고 있습니다.";
  return "점검을 시작했습니다.";
};

export const relevanceFor = (record: CaseRecord, itemId?: number) => {
  if (!itemId) return "직접 관련";
  return record.itemIds.includes(itemId) ? "직접 관련" : "유사 사례";
};

