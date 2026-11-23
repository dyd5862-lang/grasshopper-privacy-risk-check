import type { Metadata } from "next";
import AssessmentApp from "../../components/ai-hacking/AssessmentApp";

export const metadata: Metadata = {
  title: "AI 해킹 관련 점검 도구 | 메뚜기가 만든 개인정보 보호 자가 점검 도구",
  description: "기업·기관의 개인정보 유출 예방을 위한 보안 취약점 및 보호조치 자가 점검",
};

export default function Page() {
  return <AssessmentApp/>;
}
