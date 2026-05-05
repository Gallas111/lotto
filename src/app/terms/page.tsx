import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "로또한판 이용약관 — 서비스 성격, 면책, 저작권, 책임 제한 안내",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <article className="prose prose-sm max-w-none">
      <h1 className="text-2xl font-bold mb-4">이용약관</h1>
      <p className="text-sm text-gray-500 mb-6">최종 갱신일: 2026년 5월 5일</p>

      <h2 className="text-lg font-bold mt-6 mb-2">1. 서비스의 성격</h2>
      <p>
        로또한판(lottohanpan.com, 이하 “본 사이트”)은 로또 6/45 번호 생성, 통계 시각화, 시뮬레이션,
        세금 계산 등 오락 및 정보 제공을 목적으로 운영되는 무료 웹 서비스입니다. 본 사이트는
        실제 복권 판매·구매·중개와 무관하며, 어떠한 형태의 당첨도 보장하지 않습니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">2. 면책 조항</h2>
      <ul className="list-disc pl-5">
        <li>
          제공되는 모든 번호 및 통계는 오락 목적이며, 이를 근거로 한 구매·투자 결정으로 발생한
          금전적 손실에 대해 본 사이트는 책임지지 않습니다.
        </li>
        <li>
          당첨번호 데이터는 동행복권 공식 데이터를 참조하지만, 실제 추첨 결과는 반드시{" "}
          <a
            href="https://www.dhlottery.co.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            동행복권 공식 사이트
          </a>
          에서 확인하시기 바랍니다.
        </li>
        <li>네트워크 장애, 데이터 갱신 지연, 시스템 점검 등으로 인한 서비스 중단·오류는 면책됩니다.</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">3. 책임 있는 이용</h2>
      <p>
        도박 중독은 가족과 사회에 심각한 영향을 미칩니다. 본 사이트는 만 19세 미만의 이용을 권장하지
        않으며, 이용자는 자신의 재정 상황에 맞게 합리적으로 복권을 구매하시기 바랍니다. 도박 중독
        상담은 한국도박문제예방치유원(국번 없이 1336)을 통해 받을 수 있습니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">4. 저작권 및 상표</h2>
      <p>
        본 사이트의 디자인·코드·구조는 운영자에게 저작권이 있으며, 무단 복제·배포·상업적 이용을
        금합니다. “로또”·“로또 6/45”의 명칭 및 관련 상표는 동행복권의 상표이며, 본 사이트는 이를
        설명적 용도로만 사용합니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">5. 광고 및 제3자 서비스</h2>
      <p>
        본 사이트는 Google AdSense 등 제3자 광고를 게재하며, 광고 콘텐츠 및 광고주의 행위에 대해
        본 사이트는 책임지지 않습니다. 자세한 사항은 개인정보처리방침을 참고하세요.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">6. 약관 변경</h2>
      <p>
        본 약관은 사전 통지 없이 변경될 수 있으며, 변경 사항은 본 페이지에 게시함으로써 효력이
        발생합니다. 이용자는 정기적으로 본 페이지를 확인할 책임이 있습니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">7. 분쟁 해결</h2>
      <p>
        본 약관과 관련하여 분쟁이 발생할 경우 대한민국 법률을 준거법으로 하며, 관할 법원은
        민사소송법에 따릅니다.
      </p>
    </article>
  );
}
