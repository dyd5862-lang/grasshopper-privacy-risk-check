import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "메뚜기가 만든 개인정보 위험도 분석 자가 점검 도구",
  description: "개인정보 보호조치를 26개 항목으로 점검하고 법령·안내서·증적자료·개인정보위 공식 조사·처분 사례와 개선방법까지 확인하는 지원 서비스",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
