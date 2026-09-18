// Historical verification metadata; never use these dates as the search clock.
export const CASE_DATA_VERIFIED_AT = "2026-09-02";
export const PUBLIC_DECISION_COLLECTED_AT = CASE_DATA_VERIFIED_AT;
export const formatVerifiedDate = (date: string) => `${date.replaceAll("-", ".")}.`;

export function localDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function casePeriodCutoff(period: "1" | "3" | "5" | "all", now = new Date()): string | null {
  if (period === "all") return null;
  const year = now.getFullYear() - Number(period);
  const month = now.getMonth();
  const day = Math.min(now.getDate(), new Date(year, month + 1, 0).getDate());
  return localDateKey(new Date(year, month, day));
}
