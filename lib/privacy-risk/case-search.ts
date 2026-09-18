import type { CaseRecord } from "../../app/cases-data";
import { casePeriodCutoff } from "./dates";
import type { CasePeriod,CaseYear } from "./types";

export type CaseFilters = {caseTopic: string; caseInstitution: string; caseDisposition: string; casePeriod: CasePeriod; caseQuery: string; caseYear: CaseYear};
export function filterCases(caseRecords: CaseRecord[], { caseTopic, caseInstitution, caseDisposition, casePeriod, caseQuery, caseYear }: CaseFilters, now = new Date()) {
    const cutoff = casePeriodCutoff(casePeriod, now);
    return caseRecords
      .filter((record) => !cutoff || record.date >= cutoff)
      .filter((record) => caseTopic === "전체" || record.topics.includes(caseTopic))
      .filter((record) => caseInstitution === "전체" || record.institution === caseInstitution)
      .filter((record) => caseDisposition === "전체" || record.dispositions.includes(caseDisposition))
      .filter((record) => caseYear === "all" || record.date.startsWith(caseYear))
      .filter((record) => `${record.title} ${record.targets} ${record.topics.join(" ")} ${record.problems.join(" ")}`.toLowerCase().includes(caseQuery.toLowerCase()))
      .sort((a, b) => b.date.localeCompare(a.date));
}
