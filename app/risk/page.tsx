import type { Metadata } from "next";
import RiskApp from "./RiskApp";
export const metadata: Metadata = {
  title: "메뚜기가 만든 개인정보 위험도 분석 자가 점검 도구",
  description: "개인정보 처리 현황을 바탕으로 26개 항목의 위험요인과 보호조치를 점검합니다.",
};
export default function Page() { return <RiskApp/>; }
