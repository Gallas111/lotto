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
          6. 부분식·다중식 손익 시뮬레이션
        </h2>
        <p>
          부분식이 정말 효율적인지 가격 대비 기대값으로 따져보면 다음과 같습니다. 한 게임 기대 회수율은 약 50%(매출의 50%가 당첨금 풀로 환원)이므로, 부분식 7~10도 같은 기대 회수율이 적용됩니다. 단, 한 회차에 더 많은 번호 칸을 채우는 효과로 1등 적중 시 보장된 당첨금이 발생합니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-3 font-semibold">방식</th>
                <th className="text-right p-3 font-semibold">금액</th>
                <th className="text-right p-3 font-semibold">기대 회수</th>
                <th className="text-right p-3 font-semibold">고른 번호 중 6개 적중 시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3">자동 1게임</td>
                <td className="p-3 text-right">1,000원</td>
                <td className="p-3 text-right">약 500원</td>
                <td className="p-3 text-right">1등 1게임</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3">다중식 5게임</td>
                <td className="p-3 text-right">5,000원</td>
                <td className="p-3 text-right">약 2,500원</td>
                <td className="p-3 text-right">1등 + 다중 가능성 0</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3">부분식 7</td>
                <td className="p-3 text-right">7,000원</td>
                <td className="p-3 text-right">약 3,500원</td>
                <td className="p-3 text-right">1등 1 + 2등 6</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3">부분식 8</td>
                <td className="p-3 text-right">28,000원</td>
                <td className="p-3 text-right">약 14,000원</td>
                <td className="p-3 text-right">1등 1 + 2등 12 + 3등 15</td>
              </tr>
              <tr>
                <td className="p-3">부분식 10</td>
                <td className="p-3 text-right">210,000원</td>
                <td className="p-3 text-right">약 105,000원</td>
                <td className="p-3 text-right">1등 1 + 다수 하위 등수</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          부분식의 진짜 가치는 <strong>고른 번호 안에 1등 6개가 모두 들어왔을 때 다른 등수도 동시에 잡는 효율성</strong>입니다. 부분식 7로 1등이 나오면 1등 + 2등 6게임이 동시에 발생해 추가 약 4억 원 이상의 당첨금이 합산됩니다. 다만 발생 확률이 1등 확률과 같으므로 실제 기대값은 일반 자동과 동일합니다. 본인이 골라본 직감의 7~10개 번호에 강한 확신이 있을 때만 활용 가치가 있습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          7. 1등 당첨자 인터뷰 데이터 - 자동 vs 수동 분포 디테일
        </h2>
        <p>
          동행복권은 매 회차 1등 당첨자 일부의 구매 방식·판매점·당첨 소감을 공식 사이트에 게시합니다. 누적 인터뷰 데이터를 살펴보면 다음과 같은 흐름이 보입니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            <strong>자동 당첨자 다수</strong>: &ldquo;특별한 번호가 있던 게 아니라 평소 자동으로 산 게 당첨됐다&rdquo;가 가장 흔한 멘트입니다. 자동 구매자의 절대수가 많기 때문에 1등 당첨자도 자동이 가장 많이 나옵니다.
          </li>
          <li>
            <strong>수동·반자동 당첨자의 공통점</strong>: 가족 생일이나 기념일을 6개 모두 또는 일부 사용한 경우가 많습니다. 30년 이상 같은 번호를 매주 산 사례, 꿈에서 본 번호, 통계 분석으로 고른 번호 등 다양한 사연이 있습니다.
          </li>
          <li>
            <strong>다중·부분식 당첨자</strong>: 한 회차에 같은 번호를 5게임 이상 산 다중식 당첨자가 한 회차에 1억~수억 원 단위 보너스를 받는 경우가 종종 있습니다. 이는 단순히 같은 번호를 여러 게임 산 결과로, 다중식 자체가 확률을 높이지는 않습니다.
          </li>
        </ul>
        <p>
          중요한 인사이트는 <strong>구매 방식보다 지속성이 더 결정적</strong>이라는 점입니다. 인터뷰에서 가장 자주 등장하는 패턴은 &ldquo;매주 일정한 금액으로 꾸준히 사다가 어느 날 당첨됐다&rdquo;입니다. 한 번에 큰돈을 거는 부분식 한 방보다, 매주 5,000원~1만 원 수준으로 30년 이상 꾸준히 산 사람들의 누적 시도 횟수가 결국 1등을 만들어내는 가장 큰 변수입니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          8. 반자동의 효과적인 활용 - 의미 있는 숫자 + 자동 보완
        </h2>
        <p>
          반자동은 의미 있는 숫자에 대한 심리적 만족과 자동의 무작위성을 결합한 방식입니다. 효과적으로 활용하려면 다음 원칙을 따르는 것이 좋습니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            <strong>고정 번호는 1~3개로 제한</strong>: 4개 이상 고정하면 자유도가 너무 줄어 자동 효과가 약해집니다. 1~3개 정도가 의미와 무작위성의 균형이 좋습니다.
          </li>
          <li>
            <strong>1~31 사이 숫자만 고집하지 않기</strong>: 생일·기념일은 모두 1~31 범위에 들어옵니다. 이 범위만 고정하면 32~45 번호가 1등에 포함됐을 때 무력해집니다. 의미 있는 숫자 1개만 고정하고 나머지 5개를 자동으로 두면 32~45 영역도 자연 커버됩니다.
          </li>
          <li>
            <strong>같은 반자동 패턴 유지</strong>: 매주 새로운 의미 숫자를 바꾸기보다 6개월~1년 동안 같은 패턴을 유지하면 누적 시도 횟수가 의미 있게 쌓입니다.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          9. 매주 자동 5게임 vs 한 달 1번 부분식 7 - 어느 쪽이 합리적?
        </h2>
        <p>
          한 달 예산을 약 2만 원으로 가정하고 두 패턴을 비교해보면 다음과 같습니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            <strong>패턴 A: 매주 자동 5게임</strong> (5,000원 × 4주 = 20,000원). 한 달 누적 20게임. 매 회차 추첨 결과 즉시 확인 가능. 분산 시도 효과로 5등(3개 일치) 1~2개 정도는 한 달에 평균적으로 만날 수 있습니다.
          </li>
          <li>
            <strong>패턴 B: 한 달에 1번 부분식 7</strong> (7,000원). 한 달에 7게임만 산다는 뜻이라 한 달 누적 시도가 적습니다. 부분식 7은 한 회차에 7개 번호 안에 1등 6개가 모두 포함될 때만 1등 + 2등 6개가 함께 보장됩니다. 1등 적중 자체는 1/8,145,060이라 패턴 A의 분산 시도와 통계적 가치는 거의 같습니다.
          </li>
        </ul>
        <p>
          순수한 게임 수와 분산 효과만 보면 <strong>패턴 A(매주 5게임)가 더 효율적</strong>입니다. 같은 예산으로 시도 횟수가 약 3배 많기 때문입니다. 부분식 7은 본인이 7개 번호 조합에 강한 확신이 있을 때, 또는 한 번의 1등 때 다른 등수도 함께 잡고 싶을 때만 의미가 있습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          10. 자주 묻는 질문(FAQ)
        </h2>
        <p>
          <strong>Q. 자동과 수동의 1등 확률이 정말 똑같나요?</strong>
        </p>
        <p>
          A. 네, 정확히 똑같습니다. 모든 번호 조합은 1/8,145,060의 동일 확률을 가지며, 자동(컴퓨터 난수)이든 수동(사람이 고르기)이든 그 조합이 1등에 적중할 확률에는 영향을 주지 않습니다. 자동·수동 1등 비율 차이는 단순히 자동 구매자가 더 많아서 절대수 비율이 그대로 반영된 결과입니다.
        </p>
        <p>
          <strong>Q. 부분식 7과 다중식 7게임은 무엇이 다른가요?</strong>
        </p>
        <p>
          A. 부분식 7은 7개 번호를 고르면 가능한 6개 조합 7개를 모두 산 결과(7,000원)입니다. 다중식 7게임은 같은 6개 번호 1조합을 7번 산 결과(7,000원)입니다. 부분식은 7개 번호 안에 1등이 다 들어오면 자동으로 1등 + 2등 다수 보장. 다중식은 1등 적중 시 1등 7배 당첨금. 본인 선호에 따라 다르지만, 수학적 기대값은 같습니다.
        </p>
        <p>
          <strong>Q. QR 자동복권 1게임에 1,000원과 모바일 구매는 같은 가격인가요?</strong>
        </p>
        <p>
          A. 네, 한국 로또 6/45는 모든 판매 채널에서 1게임 1,000원으로 통일되어 있습니다. 판매점 종이복권, 모바일 동행복권 앱, 인터넷 모두 가격은 같으며, 같은 회차에 추첨되는 동일 게임입니다. 모바일은 개인 인증 후 회당 5,000원 한도 안에서 구매 가능합니다.
        </p>

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
