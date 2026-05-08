import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로또 당첨금 세금 계산기 - 실수령액 계산",
  description:
    "로또 당첨금 세금 계산기. 1등부터 5등까지 당첨금에 대한 소득세, 주민세를 계산하고 실수령액을 확인하세요.",
  keywords: ["로또 세금", "당첨금 계산기", "실수령액", "로또 소득세"],
  alternates: { canonical: "/calculator/" },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
