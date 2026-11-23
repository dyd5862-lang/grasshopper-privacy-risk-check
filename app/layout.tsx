import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "메뚜기가 만든 개인정보 보호 자가 점검 도구",
  description: "개인정보 위험도 분석, 안전성 확보조치 기준의 조문별 이행 점검, AI 해킹 관련 개인정보 유출 예방 점검을 지원합니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
