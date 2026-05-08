import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로또 시뮬레이터 - 1등까지 몇 번?",
  description:
    "로또 6/45 당첨 시뮬레이터. 실제 확률로 1등에 당첨되기까지 얼마나 걸리는지 체험해보세요.",
  keywords: ["로또 시뮬레이터", "로또 확률", "로또 체험", "당첨 시뮬레이션"],
  alternates: { canonical: "/simulator/" },
};

export default function SimulatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
