

export type Screen = "intro" | "profile" | "check" | "result" | "cases";

export type Answer = "yes" | "no" | "unknown" | "na";

export type Filter = "all" | "institution" | "system" | "unanswered" | "attention";

export type CasePeriod = "1" | "3" | "5" | "all";

export type CaseYear = "all" | "2020" | "2021" | "2022" | "2023" | "2024" | "2025" | "2026";

export type ReaderTheme = "light" | "dark";

export type ReaderPreferences = {
  theme: ReaderTheme;
  fontSize: number;
  lineHeight: number;
};

export type Evidence = {
  title: string;
  note: string;
  owner: string;
  date: string;
};

export type Profile = {
  organization: string;
  organizationType: string;
  systemName: string;
  purpose: string;
  fileName: string;
  dataSubjects: string;
  handlers: string;
  identifiers: string[];
  storage: "all" | "partial" | "none" | "unknown";
  sensitive: boolean;
  website: boolean;
  externalNetwork: boolean;
  outsourced: boolean;
};

export type CheckItem = {
  id: number;
  scope: "institution" | "system";
  category: string;
  question: string;
  easy: string;
  page: string;
  standard: string;
  law: string;
  evidence: string[];
  action: string;
  priority: "즉시" | "단기" | "중장기";
};

