import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "로또한판 개인정보처리방침 — 수집 항목, 이용 목적, 광고 쿠키, 권리 행사 안내",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-sm max-w-none">
      <h1 className="text-2xl font-bold mb-4">개인정보처리방침</h1>
      <p className="text-sm text-gray-500 mb-6">최종 갱신일: 2026년 5월 5일</p>

      <h2 className="text-lg font-bold mt-6 mb-2">1. 수집하는 개인정보</h2>
      <p>
        로또한판(이하 “본 사이트”)은 회원가입 절차가 없으며 직접적인 개인정보(이름·이메일·전화번호 등)를
        수집하지 않습니다. 다만 서비스 제공 과정에서 다음 정보가 자동으로 수집·이용될 수 있습니다.
      </p>
      <ul className="list-disc pl-5">
        <li>접속 IP, 브라우저 종류 및 OS, 방문 일시, 서비스 이용 기록 (서버 로그)</li>
        <li>쿠키 및 유사 기술을 통한 비식별 식별자 (광고 게재 및 통계 목적)</li>
        <li>로컬스토리지에 저장되는 사용자 설정 및 저장 번호 (사용자 단말 내 저장, 서버 전송 X)</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">2. 이용 목적</h2>
      <ul className="list-disc pl-5">
        <li>서비스 운영, 품질 개선, 통계 분석</li>
        <li>맞춤형 광고 게재 (Google AdSense)</li>
        <li>이용자 환경에 맞는 콘텐츠 제공</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">3. 보관 및 파기</h2>
      <p>
        서버 로그는 통계 분석 후 90일 이내 파기되며, 로컬스토리지 데이터는 사용자가 브라우저에서
        직접 삭제하기 전까지 사용자 단말에만 저장됩니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">4. 광고 및 쿠키</h2>
      <p>
        본 사이트는 Google AdSense 등 제3자 광고 서비스를 사용합니다. Google을 비롯한 제3자 공급업체는
        쿠키를 사용하여 사용자가 본 사이트 또는 다른 사이트를 방문한 기록을 기반으로 광고를 게재합니다.
        Google 광고 쿠키 사용을 원치 않으시면{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          광고 설정 페이지
        </a>
        에서 비활성화할 수 있습니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">5. 이용자 권리</h2>
      <p>
        이용자는 언제든 자신의 단말에 저장된 쿠키 및 로컬스토리지 데이터를 브라우저 설정을 통해
        삭제할 수 있습니다. 본 사이트는 회원 정보를 보유하지 않으므로 별도의 열람·정정·삭제 요청
        절차를 두지 않습니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">6. 책임자 및 문의</h2>
      <p>
        개인정보 관련 문의는 사이트 도메인 등록 정보를 통해 접수받습니다. 정책 변경 시 본 페이지에
        공지합니다.
      </p>
    </article>
  );
}
