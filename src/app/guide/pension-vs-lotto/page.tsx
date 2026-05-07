import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getGuide } from "@/lib/guides";
import { SITE_URL } from "@/lib/constants";

const guide = getGuide("pension-vs-lotto")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: `/guide/${guide.slug}/` },
  openGraph: {
    title: guide.title,
    description: guide.description,
    url: `${SITE_URL}/guide/${guide.slug}/`,
    type: "article",
  },
};

export default function Page() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    author: { "@type": "Organization", name: "로또한판" },
    publisher: { "@type": "Organization", name: "로또한판" },
    datePublished: guide.date,
    dateModified: guide.date,
    mainEntityOfPage: `${SITE_URL}/guide/${guide.slug}/`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "가이드", item: `${SITE_URL}/guide/` },
      { "@type": "ListItem", position: 3, name: guide.title, item: `${SITE_URL}/guide/${guide.slug}/` },
    ],
  };

  return (
    <article className="prose-article space-y-6">
      <Script id="article-jsonld" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Script id="breadcrumb-jsonld" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-500">홈</Link>
        <span className="mx-2">/</span>
        <Link href="/guide/" className="hover:text-blue-500">가이드</Link>
      </nav>

      <header className="space-y-3">
        <span className="inline-block text-xs font-medium px-2 py-1 rounded-full border bg-pink-50 text-pink-600 border-pink-200">
          비교
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          {guide.title}
        </h1>
        <p className="text-sm text-gray-500">
          {guide.date} · {guide.readingTime}분 분량
        </p>
      </header>

      <section className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          한국에서 가장 인기 있는 두 복권은 로또 6/45와 연금복권 720+입니다. 한쪽은 한 번에 큰 금액을 받는 일시금 방식, 다른 쪽은 매월 700만 원씩 20년을 받는 연금 방식입니다. 같은 1등이라도 받는 방식이 완전히 다른데, 어느 쪽이 더 유리할까요? 세금, 현재가치, 안정성을 따져 객관적으로 비교해보겠습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          1. 두 복권의 기본 구조
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-3 font-semibold">항목</th>
                <th className="text-left p-3 font-semibold">로또 6/45</th>
                <th className="text-left p-3 font-semibold">연금복권 720+</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">가격</td>
                <td className="p-3">1,000원/게임</td>
                <td className="p-3">1,000원/조</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">1등 당첨</td>
                <td className="p-3">평균 약 25억 원 일시금</td>
                <td className="p-3">월 700만 원 × 20년 (총 16.8억)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">1등 확률</td>
                <td className="p-3">1 / 8,145,060</td>
                <td className="p-3">1 / 5,000,000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">2등 당첨</td>
                <td className="p-3">5+보너스 (약 7천만 원)</td>
                <td className="p-3">월 100만 원 × 20년 (총 2.4억)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">추첨</td>
                <td className="p-3">매주 토요일</td>
                <td className="p-3">매주 목요일</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          로또 1등 확률(1/8,145,060)이 연금복권(1/5,000,000)보다 약 1.6배 더 어렵습니다. 그러나 발표 당첨금은 로또가 평균적으로 더 큽니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          2. 세금 후 실수령액 비교
        </h2>
        <p>
          <strong>로또 1등 25억 원 일시금</strong>의 경우:
        </p>
        <ul className="space-y-1 list-disc list-inside pl-2">
          <li>3억 이하: 6,600만 원 세금</li>
          <li>3억 초과 22억: 7억 2,600만 원 세금</li>
          <li>총 세금: 약 7억 9,200만 원</li>
          <li><strong>실수령액: 약 17억 800만 원 (한 번에)</strong></li>
        </ul>
        <p>
          <strong>연금복권 1등 월 700만 원 × 240회</strong>의 경우:
        </p>
        <ul className="space-y-1 list-disc list-inside pl-2">
          <li>월 700만 원에 22% 원천징수 → 월 실수령 약 546만 원</li>
          <li>20년 누적 실수령: 546만 × 240 = <strong>약 13억 1,000만 원</strong></li>
          <li>매월 안정적으로 입금</li>
        </ul>
        <p>
          단순 누적 합계로는 로또(17억) &gt; 연금복권(13.1억)이 더 많아 보입니다. 하지만 시간을 고려한 &ldquo;현재가치&rdquo;를 따지면 다른 결론이 나옵니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          3. 현재가치(Present Value) 관점에서 비교
        </h2>
        <p>
          내년에 받는 100만 원과 지금 받는 100만 원은 가치가 다릅니다. 인플레이션과 기회비용 때문입니다. 연 3% 할인율로 미래 수령액을 현재가치로 환산하면 다음과 같습니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            <strong>로또 17억 일시금</strong>: 현재가치 = 17억 (오늘 한 번에 받음)
          </li>
          <li>
            <strong>연금복권 매월 546만 원 × 20년</strong>: 현재가치 ≈ 약 9억 8천만 원 (3% 할인율 기준)
          </li>
        </ul>
        <p>
          시간 가치를 따지면 격차가 더 벌어집니다. 로또 17억은 20년 매월 안정적으로 받는 13억보다 현재가치 기준 약 7억 원 더 많습니다. 인플레이션이 5%를 넘기면 격차는 더 커집니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          4. 그래도 연금복권이 가지는 장점
        </h2>
        <p>
          현재가치만 따지면 로또가 우월하지만, 연금복권에는 다음과 같은 비재무적 장점이 있습니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            <strong>탕진 위험 회피</strong>: 한 번에 17억 원이 들어오면 갑작스런 큰돈에 휘둘려 부적절한 투자나 사기·낭비로 5~10년 안에 모두 잃는 사례가 많습니다. 미국 통계에서는 일시금 당첨자 약 70%가 5년 안에 파산했다는 연구도 있습니다. 매월 정해진 금액만 들어오면 이런 위험이 자연스럽게 차단됩니다.
          </li>
          <li>
            <strong>정신적 안정감</strong>: &ldquo;매월 546만 원이 들어온다&rdquo;는 사실은 직장 없이도 평생 안정된 생활을 보장해주는 심리적 안전망 역할을 합니다.
          </li>
          <li>
            <strong>가족 갈등 완화</strong>: 일시금이 들어오면 친척·지인의 돈 요청, 사기 시도가 즉각 시작됩니다. 매월 받는 구조는 &ldquo;당장 빌려줄 큰돈이 없다&rdquo;는 자연스러운 방어선이 됩니다.
          </li>
          <li>
            <strong>1등 확률 자체가 더 높음</strong>: 1/5,000,000으로 로또(1/8,145,060)보다 약 1.6배 더 잘 당첨됩니다.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          5. 로또의 결정적 장점 - 유연성
        </h2>
        <p>
          로또 일시금은 받자마자 당첨자가 자유롭게 활용할 수 있습니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            <strong>부동산·주식 즉시 매입</strong>: 17억으로 서울 아파트 구매, 배당주·ETF 분산 투자 등 즉시 자산 운용 가능
          </li>
          <li>
            <strong>사업 자본</strong>: 한 번에 큰 자본이 필요한 창업·투자에 활용 가능
          </li>
          <li>
            <strong>긴급 지출 대응</strong>: 가족 의료비 등 큰 지출에 즉시 대응 가능
          </li>
          <li>
            <strong>사망 시 상속 용이</strong>: 일시금은 자녀에게 통째로 물려줄 수 있습니다. 연금복권은 사망 시 잔여 회차에 대해 별도 일시 지급이 가능하지만 별도의 절차가 필요합니다.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          6. 어떤 사람에게 어느 쪽이 맞을까
        </h2>
        <p>
          개인 성향에 따라 추천이 갈립니다.
        </p>
        <ul className="space-y-3 list-disc list-inside pl-2">
          <li>
            <strong>금융 지식이 충분하고 자기 통제가 강한 사람</strong>: 로또. 17억을 안정적으로 운용해서 매년 7~9% 수익을 낼 수 있다면 연금복권보다 훨씬 유리합니다.
          </li>
          <li>
            <strong>일시 큰돈 관리 자신이 없는 사람</strong>: 연금복권. 매월 정해진 금액이 안정적 생활비로 들어오는 구조가 안전합니다.
          </li>
          <li>
            <strong>50~60대로 노후 대비가 우선인 사람</strong>: 연금복권. 평생 받을 수 있는 안정 소득이 더 큰 가치를 가집니다.
          </li>
          <li>
            <strong>20~40대로 자본 운용이 가능한 사람</strong>: 로또. 큰 자본을 자기 사업/투자에 즉시 활용할 수 있는 시기입니다.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          마무리: 두 복권은 서로 다른 게임이다
        </h2>
        <p>
          로또와 연금복권은 단순히 &ldquo;당첨금이 큰가 작은가&rdquo;의 문제가 아닙니다. 일시금의 유연성과 연금의 안정성, 두 가지 가치 중 무엇을 더 중시하느냐의 문제입니다. 본인의 금융 자기통제력, 나이, 가족 상황을 종합적으로 보고 자신에게 맞는 쪽을 즐기는 게 좋습니다. 두 복권 모두 매주 1만 원 이내의 가벼운 즐거움 수준에서 활용하는 게 가장 합리적입니다.
        </p>
      </section>

      <aside className="mt-10 p-5 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="font-bold text-gray-900 mb-3">관련 도구로 직접 계산해보기</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/calculator/" className="text-blue-600 hover:underline">
              당첨금 세금 계산기
            </Link>
            <span className="text-gray-600"> — 임의 당첨금 입력 시 세금과 실수령액 자동 계산</span>
          </li>
          <li>
            <Link href="/simulator/" className="text-blue-600 hover:underline">
              평생 구매 시뮬레이터
            </Link>
            <span className="text-gray-600"> — 평생 누적 비용 vs 기대 수익 비교</span>
          </li>
        </ul>
      </aside>

      <aside className="mt-6 p-5 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed">
        <p className="font-medium text-gray-700 mb-2">📌 다른 가이드</p>
        <ul className="space-y-1">
          <li>
            <Link href="/guide/lotto-tax-guide/" className="text-blue-600 hover:underline">
              로또 1등 세금 완벽 가이드
            </Link>
          </li>
          <li>
            <Link href="/guide/lotto-odds/" className="text-blue-600 hover:underline">
              로또 6/45 당첨 확률 완벽 정리
            </Link>
          </li>
        </ul>
      </aside>
    </article>
  );
}
