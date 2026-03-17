import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로또 당첨번호 통계 - 번호별 출현 빈도 분석",
  description:
    "최근 로또 6/45 당첨번호 통계와 분석. 자주 나오는 번호, 적게 나오는 번호, 번호별 출현 빈도를 확인하세요.",
  alternates: { canonical: "/stats/" },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
