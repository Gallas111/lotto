import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "저장한 번호 - 내가 생성한 로또 번호 목록",
  description:
    "로또 번호 생성기에서 저장한 번호를 확인하고 관리하세요.",
  alternates: { canonical: "/saved/" },
};

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
