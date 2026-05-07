import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getGuide } from "@/lib/guides";
import { SITE_URL } from "@/lib/constants";

const guide = getGuide("lotto-odds")!;

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
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-500">홈</Link>
        <span className="mx-2">/</span>
        <Link href="/guide/" className="hover:text-blue-500">가이드</Link>
      </nav>

      <header className="space-y-3">
        <span className="inline-block text-xs font-medium px-2 py-1 rounded-full border bg-blue-50 text-blue-600 border-blue-200">
          확률
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
          로또 6/45 1등 당첨 확률은 <strong>약 8,145,060분의 1</strong>입니다. 자주 인용되는 숫자지만, 막상 이 수가 얼마나 큰지 직관적으로 와닿기는 어렵습니다. 이 글에서는 1등부터 5등까지의 확률을 수학적으로 계산해보고, 일상에서 마주칠 수 있는 다양한 사건의 확률과 비교해서 직관적으로 풀어 설명합니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          1. 1등 확률은 어떻게 계산되는가
        </h2>
        <p>
          로또 6/45는 1부터 45까지의 숫자 중 6개를 선택하는 방식입니다. 순서는 상관없이 어떤 6개를 뽑느냐만 중요하므로, 수학적으로는 <strong>조합(combination)</strong> 문제입니다.
        </p>
        <p>
          전체 가능한 조합 수는 C(45, 6)으로 표현되며, 계산하면 다음과 같습니다.
        </p>
        <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
{`C(45, 6) = 45! / (6! × 39!)
        = (45 × 44 × 43 × 42 × 41 × 40) / (6 × 5 × 4 × 3 × 2 × 1)
        = 5,864,443,200 / 720
        = 8,145,060`}
        </pre>
        <p>
          즉, 가능한 모든 번호 조합이 8,145,060가지이며, 그 중 정확히 한 조합만 당첨됩니다. 따라서 1등 확률은 1/8,145,060이 되는 것입니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          2. 1등부터 5등까지 등수별 확률
        </h2>
        <p>
          로또 6/45의 등수 체계는 1등(6개 일치), 2등(5개 + 보너스), 3등(5개 일치), 4등(4개 일치), 5등(3개 일치)로 나뉩니다. 각 등수의 확률은 다음과 같습니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-3 font-semibold">등수</th>
                <th className="text-left p-3 font-semibold">조건</th>
                <th className="text-right p-3 font-semibold">확률</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">1등</td>
                <td className="p-3">6개 번호 일치</td>
                <td className="p-3 text-right tabular-nums">1 / 8,145,060</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">2등</td>
                <td className="p-3">5개 번호 + 보너스 번호</td>
                <td className="p-3 text-right tabular-nums">1 / 1,357,510</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">3등</td>
                <td className="p-3">5개 번호 일치</td>
                <td className="p-3 text-right tabular-nums">1 / 35,724</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">4등</td>
                <td className="p-3">4개 번호 일치</td>
                <td className="p-3 text-right tabular-nums">1 / 733</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">5등</td>
                <td className="p-3">3개 번호 일치</td>
                <td className="p-3 text-right tabular-nums">1 / 45</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          5등은 약 45분의 1로 비교적 흔하게 당첨됩니다. 이는 한 게임당 5,000원의 5등 당첨금을 노린다면 평균적으로 45게임에 한 번꼴로 당첨된다는 의미입니다. 다만 4등(733분의 1)부터는 체감상 거의 만나기 힘든 수준이 됩니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          3. 8,145,060분의 1을 직관적으로 비교하기
        </h2>
        <p>
          숫자만 봐서는 와닿지 않습니다. 일상에서 일어나는 다양한 사건의 확률과 비교해보겠습니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            <strong>벼락에 맞을 확률</strong>: 연간 약 100만분의 1. 로또 1등 확률보다 약 8배 높습니다.
          </li>
          <li>
            <strong>비행기 사고로 사망할 확률</strong>: 1회 탑승당 약 1,100만분의 1. 로또보다 약간 낮은 수준입니다.
          </li>
          <li>
            <strong>한 해 동안 운석에 맞을 확률</strong>: 약 17억분의 1. 로또 1등이 운석보다 200배 더 가능성 있습니다.
          </li>
          <li>
            <strong>자연 임신으로 일란성 네 쌍둥이 출산</strong>: 약 1,500만분의 1. 로또보다 더 어렵습니다.
          </li>
          <li>
            <strong>동전을 던져 23번 연속 앞면이 나올 확률</strong>: 약 838만분의 1. 로또 1등 확률과 거의 같습니다.
          </li>
        </ul>
        <p>
          즉, 한 게임 1,000원짜리 로또를 한 장 사는 것은 동전을 23번 던져 모두 앞면이 나오기를 기대하는 것과 거의 같은 수준의 시도라 할 수 있습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          4. 매주 1게임씩 사면 평균 몇 년 만에 당첨될까
        </h2>
        <p>
          단순 계산하면 8,145,060을 52(연간 회차 수)로 나눈 값이 평균 당첨까지 걸리는 햇수입니다. 약 <strong>156,635년</strong>이 됩니다. 인간의 평균 수명을 80년으로 보면 약 1,958번을 살아야 한 번 당첨된다는 의미입니다.
        </p>
        <p>
          한 회차에 5게임씩(5,000원어치) 산다면 31,327년, 100게임씩(10만원어치)을 사도 1,566년이 평균입니다. 물론 이건 평균값일 뿐 일부 사람은 운 좋게 짧은 기간에 당첨될 수도, 더 오래 걸릴 수도 있습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          5. 같은 번호가 다시 나올 확률은 같다
        </h2>
        <p>
          많은 분들이 오해하는 부분입니다. 지난주 1등 번호 조합이 이번 주에 또 나올 확률과, 한 번도 나온 적 없는 새 조합이 나올 확률은 <strong>완전히 동일</strong>합니다. 로또는 매 회차 독립 사건이며, 과거 결과가 미래 결과에 영향을 주지 않습니다.
        </p>
        <p>
          따라서 &ldquo;이번엔 안 나왔던 번호로 골라야 한다&rdquo;나 &ldquo;자주 나온 번호가 또 나올 거다&rdquo; 같은 직관은 통계적으로 근거가 없습니다. 단, 번호 선택에 통계 데이터를 참고하는 건 심리적 만족이나 패턴 분석 차원에서는 의미가 있습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          마무리: 확률을 이해하면 더 즐겁게 할 수 있다
        </h2>
        <p>
          로또 1등은 객관적으로 거의 일어나지 않을 사건입니다. 하지만 그 희박한 가능성에 1,000원이라는 작은 비용을 지불하는 것은 일종의 &ldquo;감정의 보험&rdquo;이라 볼 수 있습니다. 일주일간 1등 당첨을 상상하는 즐거움 자체에 가치가 있다면, 그 가치만큼만 지출하는 게 합리적입니다.
        </p>
        <p>
          중요한 건 <strong>로또를 자산 증식 수단으로 보지 않는 것</strong>입니다. 매주 1만원 이내, 가족 외식 한 번 줄이는 정도의 금액에서 즐기는 게 건전한 활용법입니다.
        </p>
      </section>

      <aside className="mt-10 p-5 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="font-bold text-gray-900 mb-3">관련 도구로 직접 확인해보기</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/generator/" className="text-blue-600 hover:underline">
              번호 생성기
            </Link>
            <span className="text-gray-600"> — 8,145,060가지 조합 중 하나를 즉시 생성</span>
          </li>
          <li>
            <Link href="/simulator/" className="text-blue-600 hover:underline">
              평생 구매 시뮬레이터
            </Link>
            <span className="text-gray-600"> — 매주 같은 금액 평생 사면 결과가 어떻게 될지 시뮬레이션</span>
          </li>
          <li>
            <Link href="/stats/" className="text-blue-600 hover:underline">
              번호 통계
            </Link>
            <span className="text-gray-600"> — 1등 번호의 빈도·홀짝·합계 분포 확인</span>
          </li>
        </ul>
      </aside>

      <aside className="mt-6 p-5 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed">
        <p className="font-medium text-gray-700 mb-2">📌 다른 가이드</p>
        <ul className="space-y-1">
          <li>
            <Link href="/guide/lotto-tax-guide/" className="text-blue-600 hover:underline">
              로또 1등 세금 완벽 가이드: 33% 원천징수와 실수령액 계산법
            </Link>
          </li>
          <li>
            <Link href="/guide/number-strategy/" className="text-blue-600 hover:underline">
              로또 번호 선택 5가지 통계 전략
            </Link>
          </li>
        </ul>
      </aside>
    </article>
  );
}
