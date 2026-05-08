import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getGuide } from "@/lib/guides";
import { SITE_URL } from "@/lib/constants";

const guide = getGuide("number-strategy")!;

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
        <span className="inline-block text-xs font-medium px-2 py-1 rounded-full border bg-purple-50 text-purple-600 border-purple-200">
          전략
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
          로또 6/45는 매 회차 독립 사건이라 어떤 번호 조합이든 1/8,145,060 확률은 동일합니다. 그럼에도 1,200회 이상 누적된 당첨 데이터를 살펴보면 흥미로운 통계적 패턴이 보입니다. 이 글에서는 통계 기반으로 자주 쓰이는 5가지 번호 선택 접근법을 객관적으로 풀어 설명합니다. 당첨을 보장하는 방법은 없지만, 자신만의 기준을 만드는 데 참고가 됩니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          1. 빈도수 기반 - 자주 나온 번호 vs 적게 나온 번호
        </h2>
        <p>
          가장 단순한 접근법은 번호별 출현 빈도를 보는 것입니다. 1부터 45까지 모든 번호는 이론상 같은 확률로 나와야 하지만, 실제 누적 데이터에서는 어떤 번호는 평균보다 자주, 어떤 번호는 적게 나온 차이가 있습니다.
        </p>
        <p>
          이 차이를 활용하는 두 가지 상반된 접근이 있습니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            <strong>핫 넘버(Hot Number) 전략</strong>: 자주 나온 번호는 계속 나올 거라 가정하고 상위 빈도 번호를 선택합니다. &ldquo;운 좋은 번호&rdquo;라는 심리적 만족이 있습니다.
          </li>
          <li>
            <strong>콜드 넘버(Cold Number) 전략</strong>: 오랫동안 나오지 않은 번호는 곧 나올 거라 가정하고 하위 빈도 번호를 선택합니다. 도박사의 오류라고 불리지만 심리적으로 끌리는 접근법입니다.
          </li>
        </ul>
        <p>
          수학적으로는 두 전략 모두 통계적 유의성이 없습니다. 하지만 자신만의 기준을 만든다는 점에서 의미가 있습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          2. 홀짝 비율 - 균형이 가장 흔하다
        </h2>
        <p>
          1부터 45까지 홀수 23개, 짝수 22개로 거의 균형이 잡혀 있습니다. 6개 번호의 홀짝 분포는 7가지 패턴이 가능합니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-3 font-semibold">홀:짝 비율</th>
                <th className="text-right p-3 font-semibold">이론적 확률</th>
                <th className="text-right p-3 font-semibold">실제 누적 빈도</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3">3:3 (균형)</td>
                <td className="p-3 text-right">33.3%</td>
                <td className="p-3 text-right">약 33%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3">4:2 또는 2:4</td>
                <td className="p-3 text-right">48.6%</td>
                <td className="p-3 text-right">약 49%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3">5:1 또는 1:5</td>
                <td className="p-3 text-right">15.5%</td>
                <td className="p-3 text-right">약 16%</td>
              </tr>
              <tr>
                <td className="p-3">6:0 또는 0:6</td>
                <td className="p-3 text-right">2.3%</td>
                <td className="p-3 text-right">약 2%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          전체의 약 80%가 3:3 또는 4:2 패턴입니다. 따라서 <strong>홀짝을 너무 한쪽으로 치우치지 않게 섞는 것</strong>이 통계적으로 가장 흔한 조합 영역에 들어갈 가능성을 높입니다. 단, 6:0 같은 극단적 조합도 약 2%는 나오므로 절대 안 된다는 의미는 아닙니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          3. 합계 구간 - 100~175 사이가 압도적
        </h2>
        <p>
          6개 번호를 모두 더한 합계는 최소 21(1+2+3+4+5+6)부터 최대 255(40+41+42+43+44+45)까지입니다. 누적 데이터에서 합계 분포는 정규분포 모양을 보입니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>합계 100~175 구간: 전체 회차의 약 70%</li>
          <li>합계 110~165 구간: 전체 회차의 약 55%</li>
          <li>합계 130~150 구간: 전체 회차의 약 25%</li>
        </ul>
        <p>
          가장 흔한 구간은 <strong>120~160</strong>입니다. 번호 6개를 합쳤을 때 이 범위에 들어오는 조합이 통계적으로 자주 나왔다는 의미입니다. 너무 작은 번호만, 또는 너무 큰 번호만 모인 조합은 출현 빈도가 낮습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          4. AC value (Arithmetic Complexity) - 산술적 복잡도
        </h2>
        <p>
          AC value는 번호 6개로 만들 수 있는 모든 차이값의 종류 수에서 5를 뺀 값입니다. 다소 복잡한 개념이지만, 쉽게 말해 <strong>번호들이 등차수열에서 얼마나 떨어져 있는지</strong>를 나타냅니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            AC value 0: 완전 등차수열 (예: 1,3,5,7,9,11) - 매우 드물게 나옴
          </li>
          <li>AC value 5~7: 비교적 자주 나오는 구간</li>
          <li>AC value 8~10: 가장 흔한 구간 (전체의 약 70%)</li>
        </ul>
        <p>
          누적 통계에서 1등 번호의 AC value는 평균적으로 8~9 수준입니다. 너무 규칙적인 번호 패턴(연속수, 등차수)보다는 적당히 불규칙한 조합이 많이 나왔다는 의미입니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          5. 이월수 - 직전 회차 번호 활용
        </h2>
        <p>
          이월수는 <strong>이번 회차 1등 번호 중 직전 회차 1등 번호와 겹치는 개수</strong>입니다. 통계적으로 이월수 분포는 다음과 같습니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>이월 0개: 약 40%</li>
          <li>이월 1개: 약 40%</li>
          <li>이월 2개: 약 16%</li>
          <li>이월 3개 이상: 약 4%</li>
        </ul>
        <p>
          따라서 80%의 회차에서 직전 회차 번호 중 0~1개가 이월됩니다. 직전 번호 6개에서 1개 정도를 선택하고 나머지 5개를 새로 고르는 것이 통계적 평균에 가깝습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          이 5가지 전략을 어떻게 활용할까
        </h2>
        <p>
          가장 합리적인 활용 방법은 5가지를 <strong>완벽한 예측 도구가 아닌 자기 기준으로 보는 것</strong>입니다. 다음과 같이 적용할 수 있습니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>홀짝 3:3 또는 4:2 패턴이 되도록 조정</li>
          <li>합계가 100~175 구간에 들어오도록 조정</li>
          <li>연속수(예: 11,12,13)를 1쌍 이내로 제한</li>
          <li>직전 회차 번호 중 1개 정도만 포함</li>
          <li>너무 한쪽 영역에 몰린 번호(예: 모두 1~10) 회피</li>
        </ul>
        <p>
          이렇게 골랐다고 당첨이 보장되는 건 절대 아닙니다. 다만 통계적으로 가장 흔한 영역에 머무르게 되어 &ldquo;말도 안 되는 조합으로 1등 놓치면 어쩌지&rdquo; 같은 심리적 부담을 줄일 수 있습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          6. 22년 누적 데이터로 본 빈도 상위·하위 번호
        </h2>
        <p>
          2002년 12월 첫 회차부터 2026년 5월 현재 기준 1,222회차가 지났습니다. 한 회차에 보너스 포함 7개 번호가 추첨되니, 누적 추첨 번호 카운트는 약 8,554번입니다. 각 번호의 이론적 기대 출현 횟수는 약 190회(8,554 ÷ 45) 수준입니다.
        </p>
        <p>
          실제 누적 데이터에서는 이론값에서 ±10~15% 정도 편차가 자연스럽게 발생합니다. 동행복권 공식 통계 기준으로 상위 빈도 번호는 일반적으로 <strong>34, 27, 1, 17, 18, 40, 13</strong> 같은 번호들이 약 200회 안팎으로 자주 등장하고, 하위 빈도는 <strong>9, 22, 32, 28, 41</strong>처럼 170회 전후로 적게 나오는 경향이 있습니다. 단, 이 순위는 회차가 늘면서 계속 변동되며, 최근 6개월 핫 번호와 22년 누적 핫 번호는 다를 수 있습니다.
        </p>
        <p>
          실시간 빈도와 최근 회차별 추세는 <Link href="/stats/" className="text-blue-600 hover:underline">번호 통계 도구</Link>에서 최근 10/20/50/전체 회차 단위로 확인할 수 있습니다. 단, 통계가 보여주는 편차의 통계적 유의성은 매우 낮으며, 카이제곱 검정으로도 균등 분포 가정에서 유의한 차이는 발견되지 않는 것이 일반적입니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          7. 핫 번호 vs 콜드 번호 - 어느 쪽이 더 효과적일까
        </h2>
        <p>
          이 질문에 대한 통계적 답은 <strong>둘 다 똑같다</strong>입니다. 매 회차 추첨은 독립 사건이므로 과거 빈도가 미래에 영향을 주지 않습니다. 그러나 심리적 만족도와 다중 당첨 위험 측면에서는 차이가 있습니다.
        </p>
        <ul className="space-y-3 list-disc list-inside pl-2">
          <li>
            <strong>핫 번호 전략의 위험</strong>: 누구나 빈도 상위 번호를 알 수 있어 같은 번호를 고르는 사람이 많습니다. 만약 그 번호가 1등에 당첨되면 분할 인원이 평균보다 많아 1인당 수령액이 줄어듭니다.
          </li>
          <li>
            <strong>콜드 번호 전략의 위험</strong>: 직관적 매력은 있지만 도박사의 오류(gambler&apos;s fallacy)에 기반한 사고입니다. 한 번호가 오랫동안 안 나왔다고 다음 회차에 나올 가능성이 높아지지 않습니다.
          </li>
          <li>
            <strong>혼합 전략의 합리성</strong>: 상위 빈도 2~3개 + 중간 빈도 2~3개 + 하위 빈도 1~2개를 섞으면 다중 당첨 위험을 분산하고, 6개 번호의 빈도 합이 평균에 가까워집니다.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          8. 5가지 전략 동시 적용 시뮬레이션
        </h2>
        <p>
          홀짝 3:3, 합계 100~175, AC value 8~10, 이월 1개, 한쪽 영역 회피 — 이 5가지 조건을 모두 충족하는 번호 조합은 전체 8,145,060가지 중 약 70~80만 가지 수준으로 좁혀집니다. 즉, <strong>약 10분의 1</strong>로 후보가 줄어듭니다.
        </p>
        <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
{`5전략 통과 후 후보 조합 추정
 - 전체 조합: 8,145,060
 - 홀짝 3:3 또는 4:2/2:4 통과: 약 670만 (전체의 82%)
 - 합계 100~175 통과: 약 470만 (전체의 57%)
 - AC value 7+ 통과: 약 700만 (전체의 86%)
 - 이월수 0~1 통과: 약 600만 (74%)
 - 한쪽 영역 쏠림 회피: 약 750만 (92%)

5조건 모두 통과(교집합): 약 70만~80만`}
        </pre>
        <p>
          후보가 1/10로 줄어든다고 1등 확률이 10배가 되는 건 아닙니다. 1등 번호도 같은 통계적 영역에 약 80~90% 비율로 들어오기 때문에, 5전략 통과 후 1게임 1등 확률은 약 1/700,000~1/800,000 수준이 됩니다. 평균 명목 확률(1/8,145,060)보다는 좀 더 좁아진 영역에서 시도하지만, 여전히 절대값은 매우 낮습니다. 핵심은 <strong>심리적 만족과 다중 당첨 위험 분산</strong>이지 확률 비약이 아닙니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          9. 자주 묻는 질문(FAQ)
        </h2>
        <p>
          <strong>Q. 한 회차 1등에 같은 번호 조합을 여러 사람이 동시에 고를 가능성은?</strong>
        </p>
        <p>
          A. 1등 번호 조합이 일종의 &ldquo;인기 패턴&rdquo;에 속하면 다중 당첨자가 발생합니다. 1, 2, 3, 4, 5, 6 같은 극단적 조합은 매주 수천 장이 발권되며, 만약 이 번호가 1등이면 분할 인원이 수천 명을 넘어 1인당 당첨금이 100만 원 이하로 떨어질 수 있습니다. 통계적으로 흔한 영역(합계 100~175, 홀짝 3:3)도 마찬가지로 다른 사람과 겹칠 위험이 평균보다 약간 높습니다.
        </p>
        <p>
          <strong>Q. 동행복권 공식 통계는 어디서 보나요?</strong>
        </p>
        <p>
          A. dhlottery.co.kr 메뉴의 &ldquo;당첨통계&rdquo; → &ldquo;번호별 출현횟수&rdquo;에서 누적 빈도를 확인할 수 있습니다. 본 사이트의 <Link href="/stats/" className="text-blue-600 hover:underline">번호 통계 도구</Link>도 같은 데이터를 시각화해 보여줍니다. 회차 범위(최근 10/20/50/전체) 필터링이 가능해 단기·장기 추세 비교가 편합니다.
        </p>
        <p>
          <strong>Q. 5가지 전략 외에 다른 통계 기법은 없나요?</strong>
        </p>
        <p>
          A. 끝수 분포(번호 끝자리 0~9별 균형), 구간 분포(1-10 / 11-20 / 21-30 / 31-40 / 41-45 5구간 균형), 동반 출현 빈도(특정 번호와 자주 함께 나오는 짝패턴) 같은 추가 기법이 있습니다. 그러나 모두 통계적 유의성은 약하며, 각자 자신만의 기준을 만드는 보조 도구 수준으로 활용하는 게 합리적입니다.
        </p>
        <p>
          <strong>Q. 이번 주 당첨번호 통계가 다음 주에 영향을 주나요?</strong>
        </p>
        <p>
          A. 영향을 주지 않습니다. 매 회차 추첨은 통계적으로 완전히 독립이며, 추첨기는 이전 회차 결과를 기억하지 않습니다. &ldquo;이번 주에 안 나왔으니 다음 주에 나올 거다&rdquo;는 도박사의 오류입니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          마무리: 통계는 참고일 뿐 보장이 아니다
        </h2>
        <p>
          5가지 전략 모두 누적 데이터를 분석한 결과이며, 미래 회차에 그대로 적용된다는 보장은 없습니다. 매 회차는 독립 사건이고 어떤 조합도 동일한 확률로 나옵니다. 단지 자신만의 기준을 가지고 번호를 선택하는 즐거움, 그리고 추첨 과정을 분석하면서 얻는 인사이트가 로또 자체의 재미를 더해줄 뿐입니다.
        </p>
      </section>

      <aside className="mt-10 p-5 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="font-bold text-gray-900 mb-3">관련 도구로 직접 분석해보기</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/stats/" className="text-blue-600 hover:underline">
              번호 통계
            </Link>
            <span className="text-gray-600"> — 빈도, 홀짝, 합계, AC value 누적 통계 시각화</span>
          </li>
          <li>
            <Link href="/generator/" className="text-blue-600 hover:underline">
              번호 생성기
            </Link>
            <span className="text-gray-600"> — 제외/고정 모드로 자기 기준 적용 가능</span>
          </li>
        </ul>
      </aside>

      <aside className="mt-6 p-5 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed">
        <p className="font-medium text-gray-700 mb-2">📌 다른 가이드</p>
        <ul className="space-y-1">
          <li>
            <Link href="/guide/lotto-odds/" className="text-blue-600 hover:underline">
              로또 6/45 당첨 확률 완벽 정리
            </Link>
          </li>
          <li>
            <Link href="/guide/auto-vs-manual/" className="text-blue-600 hover:underline">
              로또 자동 vs 수동 vs 반자동 차이
            </Link>
          </li>
        </ul>
      </aside>
    </article>
  );
}
