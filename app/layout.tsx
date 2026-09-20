import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "메뚜기가 만든 개인정보 보호 자가 점검 도구",
  description: "개인정보 위험도 분석과 안전성 확보조치 기준에 따른 조문별 이행 점검을 지원하는 자가 점검 도구",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
