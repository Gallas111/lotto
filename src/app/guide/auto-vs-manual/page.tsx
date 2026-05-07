import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getGuide } from "@/lib/guides";
import { SITE_URL } from "@/lib/constants";

const guide = getGuide("auto-vs-manual")!;

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
        <span className="inline-block text-xs font-medium px-2 py-1 rounded-full border bg-orange-50 text-orange-600 border-orange-200">
          구매
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
          판매점에서 로또를 살 때 종이에 &ldquo;자동&rdquo;, &ldquo;수동&rdquo;, &ldquo;반자동&rdquo;이라는 선택지가 있습니다. 막연히 자동을 누르는 분들이 많지만, 각 방식의 정의와 차이, 그리고 실제 1등 당첨자들의 구매 방식 분포를 알면 더 의식적인 선택이 가능합니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          1. 자동, 수동, 반자동의 정확한 차이
        </h2>
        <ul className="space-y-3 list-disc list-inside pl-2">
          <li>
            <strong>자동</strong>: 6개 번호 모두 컴퓨터 난수 생성기가 무작위로 선택합니다. 구매자는 게임 수만 정하고 번호는 일절 관여하지 않습니다.
          </li>
          <li>
            <strong>수동</strong>: 6개 번호를 모두 구매자가 직접 마킹합니다. 자신의 직감, 통계 분석, 의미 있는 숫자(생일·기념일) 등을 활용합니다.
          </li>
          <li>
            <strong>반자동</strong>: 일부 번호(1~5개)는 직접 마킹하고 나머지는 자동으로 채웁니다. 예를 들어 본인이 좋아하는 숫자 3개만 고정하고 나머지 3개는 자동으로 받는 방식입니다.
          </li>
        </ul>
        <p>
          본질적으로 모든 방식은 <strong>통계적으로 동일한 1/8,145,060 확률</strong>을 가집니다. 어떤 방식으로 번호가 결정되든 추첨기에서 그 조합이 나올 확률은 같습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          2. 역대 1등 당첨자의 구매 방식 분포
        </h2>
        <p>
          동행복권 공식 발표 기준 한국 로또 1등 당첨자의 구매 방식 분포는 대략 다음과 같습니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-3 font-semibold">구매 방식</th>
                <th className="text-right p-3 font-semibold">1등 당첨 비율</th>
                <th className="text-right p-3 font-semibold">전체 판매 비율</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">자동</td>
                <td className="p-3 text-right">약 55%</td>
                <td className="p-3 text-right">약 60%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">수동</td>
                <td className="p-3 text-right">약 30%</td>
                <td className="p-3 text-right">약 25%</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">반자동</td>
                <td className="p-3 text-right">약 15%</td>
                <td className="p-3 text-right">약 15%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          전체 판매 비율과 1등 당첨 비율을 비교하면 <strong>수동이 약간 더 높은 적중률</strong>을 보입니다. 다만 이 차이는 통계적으로 유의미한 수준이라 보기 어렵고, 회차별로 변동이 큽니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          3. 왜 수동이 미세하게 높을까
        </h2>
        <p>
          수동 당첨률이 약간 높게 나오는 이유는 두 가지로 추정됩니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            <strong>한 번호 조합의 다중 구매</strong>: 수동 구매자는 같은 번호를 여러 게임 사거나 여러 회차에 걸쳐 사는 경향이 있습니다. 한 회차에 같은 번호를 5게임 사면 1게임 산 사람보다 5배 당첨 확률이 높습니다.
          </li>
          <li>
            <strong>분석 기반 번호 선택</strong>: 통계 데이터(빈도, 홀짝, 합계)를 활용해서 통계적으로 흔한 영역의 조합을 의도적으로 선택하는 경우가 많습니다. 이는 결과적으로 1등 번호 패턴과 가까울 가능성을 약간 올립니다.
          </li>
        </ul>
        <p>
          그러나 이 두 효과를 합쳐도 1~5%포인트 정도의 차이로, 한 번의 구매에서 의미 있는 차이라고 보기는 어렵습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          4. 부분식과 다중식 - 더 많이 사는 방식
        </h2>
        <p>
          기본 구매 외에 &ldquo;부분식&rdquo;, &ldquo;다중식&rdquo; 같은 옵션이 있습니다. 한 게임이 아닌 여러 조합을 자동으로 묶어서 사는 방식입니다.
        </p>
        <ul className="space-y-3 list-disc list-inside pl-2">
          <li>
            <strong>부분식 7</strong>: 7개 번호를 고르면 가능한 6개 조합 7개를 모두 사는 방식. 7,000원에 7게임 자동 생성.
          </li>
          <li>
            <strong>부분식 8</strong>: 8개 번호 → 28개 조합. 28,000원.
          </li>
          <li>
            <strong>부분식 9</strong>: 9개 번호 → 84개 조합. 84,000원.
          </li>
          <li>
            <strong>부분식 10</strong>: 10개 번호 → 210개 조합. 210,000원.
          </li>
          <li>
            <strong>다중식</strong>: 같은 번호 조합을 여러 게임 사는 방식. 5게임 한 번에 5,000원.
          </li>
        </ul>
        <p>
          부분식의 장점은 <strong>고른 번호 중 6개 일치 시 반드시 1등을 잡는다</strong>는 것입니다. 단점은 비용입니다. 부분식 10은 1게임이 아니라 21만 원 한 번에 지출되는 셈입니다. 합리적 수준에서는 부분식 7 정도가 무리 없습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          5. 어떤 방식이 자신에게 맞는가
        </h2>
        <p>
          자신의 성향과 목적에 따라 다음과 같이 추천할 수 있습니다.
        </p>
        <ul className="space-y-3 list-disc list-inside pl-2">
          <li>
            <strong>편하게 구경하고 싶다면</strong>: 자동. 매주 5게임씩 자동으로 사고 가볍게 추첨을 즐기는 방식. 정신적 부담 없이 가성비 좋습니다.
          </li>
          <li>
            <strong>분석하면서 즐기고 싶다면</strong>: 수동. 통계 데이터를 보고 자신만의 기준으로 번호를 고르는 과정 자체가 재미입니다. 회차별로 같은 번호를 유지할지, 매번 새로 고를지도 본인 결정.
          </li>
          <li>
            <strong>의미 있는 숫자에 운을 더하고 싶다면</strong>: 반자동. 가족 생일이나 기념일을 1~3개 고정하고 나머지는 자동으로 받습니다.
          </li>
          <li>
            <strong>한 회차에 더 강한 도전을 하고 싶다면</strong>: 부분식 7~8 또는 다중식. 단, 한 번에 큰 금액이 나가므로 평소 구매 예산의 1~2배 안에서만.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          마무리: 방식보다 중요한 건 지속성과 예산
        </h2>
        <p>
          통계적으로 어떤 방식이 명백히 우월하다고 말할 수는 없습니다. 자동, 수동, 반자동 모두 같은 1/8,145,060 확률 게임입니다. 정말 중요한 건 <strong>매주 자신의 예산 한도 안에서 즐기는 것</strong>입니다. 한 달 식비를 빼서 로또에 쓰지 않는 것, 그것이 가장 합리적인 구매 전략입니다.
        </p>
      </section>

      <aside className="mt-10 p-5 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="font-bold text-gray-900 mb-3">관련 도구로 직접 만들어보기</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/generator/" className="text-blue-600 hover:underline">
              번호 생성기
            </Link>
            <span className="text-gray-600"> — 자동/제외/고정 3가지 모드로 직접 번호 생성</span>
          </li>
          <li>
            <Link href="/saved/" className="text-blue-600 hover:underline">
              저장한 번호
            </Link>
            <span className="text-gray-600"> — 자신만의 번호 조합 저장 및 관리</span>
          </li>
        </ul>
      </aside>

      <aside className="mt-6 p-5 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed">
        <p className="font-medium text-gray-700 mb-2">📌 다른 가이드</p>
        <ul className="space-y-1">
          <li>
            <Link href="/guide/number-strategy/" className="text-blue-600 hover:underline">
              로또 번호 선택 5가지 통계 전략
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
