import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로또 가이드 - 확률·세금·전략 완벽 정리",
  description:
    "로또 6/45 당첨 확률, 1등 세금, 번호 선택 통계 전략, 자동·수동 차이, 연금복권 비교까지. 객관 데이터 기반 가이드 모음.",
  alternates: { canonical: "/guide/" },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
