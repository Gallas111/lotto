import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - 무료 로또 6/45 번호 추첨`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "로또 번호 생성기",
    "로또 번호 추천",
    "로또 번호 추첨기",
    "로또 당첨번호",
    "로또 통계",
    "로또 번호 조합",
    "로또 6/45",
  ],
  openGraph: {
    title: `${SITE_NAME} - 무료 로또 6/45 번호 추첨`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
