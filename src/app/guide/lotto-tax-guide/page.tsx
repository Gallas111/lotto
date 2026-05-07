import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getGuide } from "@/lib/guides";
import { SITE_URL } from "@/lib/constants";

const guide = getGuide("lotto-tax-guide")!;

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
        <span className="inline-block text-xs font-medium px-2 py-1 rounded-full border bg-green-50 text-green-600 border-green-200">
          세금
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
          로또 1등 당첨금은 발표된 금액 그대로 받지 못합니다. 한국에서는 복권 당첨금에 대해 <strong>기타소득세와 지방소득세</strong>가 원천징수되며, 당첨금 규모에 따라 세율이 달라집니다. 이 글에서는 정확한 세율 구조, 실수령액 계산식, 실제 사례까지 한 번에 정리합니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          1. 복권 당첨금에 적용되는 세금의 종류
        </h2>
        <p>
          복권 당첨금은 소득세법상 &ldquo;기타소득&rdquo;으로 분류됩니다. 적용되는 세금은 두 가지입니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            <strong>기타소득세</strong>: 당첨금 3억 원 이하는 20%, 초과분은 30%
          </li>
          <li>
            <strong>지방소득세</strong>: 기타소득세의 10% (즉, 당첨금 기준으로 2% 또는 3%)
          </li>
        </ul>
        <p>
          따라서 실제 적용되는 통합 세율은 <strong>22%(3억 이하 구간) 또는 33%(3억 초과 구간)</strong>입니다. 두 세금 모두 당첨금 수령 시점에 자동 원천징수되므로, 당첨자가 직접 신고하거나 납부할 필요는 없습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          2. 구간별 세율을 한 눈에
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-3 font-semibold">당첨금 구간</th>
                <th className="text-left p-3 font-semibold">기타소득세</th>
                <th className="text-left p-3 font-semibold">지방소득세</th>
                <th className="text-right p-3 font-semibold">통합 세율</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3">5만 원 이하</td>
                <td className="p-3">비과세</td>
                <td className="p-3">비과세</td>
                <td className="p-3 text-right font-medium">0%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3">5만 원 초과 ~ 3억 원 이하</td>
                <td className="p-3">20%</td>
                <td className="p-3">2%</td>
                <td className="p-3 text-right font-medium">22%</td>
              </tr>
              <tr>
                <td className="p-3">3억 원 초과</td>
                <td className="p-3">30%</td>
                <td className="p-3">3%</td>
                <td className="p-3 text-right font-medium">33%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          중요한 포인트는 <strong>3억 원 초과 구간은 초과분에만 33%가 적용된다는 것</strong>입니다. 즉, 5억 원이 당첨됐다고 해서 5억 원 전체에 33%를 곱하면 안 됩니다. 3억 원까지는 22%, 그 이상 2억 원분에는 33%를 각각 적용합니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          3. 실제 계산 사례 - 로또 1등 25억 원 당첨 시
        </h2>
        <p>
          최근 회차의 1등 평균 당첨금이 약 25억 원 수준인 경우를 가정해서 계산해보겠습니다.
        </p>
        <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
{`당첨금: 2,500,000,000원

[1] 3억 원 이하 구간
  300,000,000 × 22% = 66,000,000원

[2] 3억 원 초과 구간
  (2,500,000,000 - 300,000,000) × 33%
  = 2,200,000,000 × 33%
  = 726,000,000원

총 세금:  66,000,000 + 726,000,000
       = 792,000,000원

실수령액: 2,500,000,000 - 792,000,000
       = 1,708,000,000원`}
        </pre>
        <p>
          25억 원에 당첨되더라도 실수령액은 약 17억 원 정도이며, 약 7억 9천만 원이 세금으로 빠져나갑니다. 발표 금액의 68% 정도가 실제 손에 들어옵니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          4. 단순 계산 공식 (3억 초과 구간)
        </h2>
        <p>
          매번 두 단계로 계산하기 번거롭다면, 다음 공식을 활용하면 빠릅니다.
        </p>
        <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
{`실수령액 = (당첨금 × 0.67) + 33,000,000

설명:
- 3억 초과분에 33%가 빠지므로 67%가 남음
- 3억 이하 구간은 22%만 떼므로 11%(3,300만원) 추가
- 따라서 (당첨금 × 67%) + 3,300만 원 = 실수령액`}
        </pre>
        <p>
          예: 1,000,000,000원 × 0.67 + 33,000,000 = 703,000,000원 (실수령 약 7억 300만 원)
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          5. 받은 돈에 추가 세금이 또 붙나?
        </h2>
        <p>
          기타소득세는 <strong>분리과세 항목</strong>입니다. 즉, 당첨금 수령 시점에 원천징수로 모든 세금이 종결됩니다. 다음 해 5월 종합소득세 신고 시 합산해서 추가 과세하지 않으며, 종합소득과는 무관합니다.
        </p>
        <p>
          단, 당첨금을 가족이나 지인에게 나눠주면 그 시점에 <strong>증여세가 별도로 발생</strong>합니다. 배우자에게는 6억 원, 직계존비속에게는 5천만 원(미성년자 2천만 원)까지 10년간 증여세 비과세 한도가 있습니다. 그 이상은 10~50%의 증여세를 또 내야 합니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          6. 절세는 가능한가
        </h2>
        <p>
          기타소득세는 원천징수이므로 당첨자 본인이 줄일 방법은 없습니다. 다만 다음 두 가지는 절세 효과가 있습니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            <strong>당첨 신청 전 가족과 공동 구매로 약속한 경우</strong>: 분할 수령이 가능하다면 각자 22% 구간 안에 머물 수 있어 통합 세율이 낮아집니다. 단, 사전 합의를 객관적으로 입증할 자료(영수증 사진, 메시지 등)가 필요합니다.
          </li>
          <li>
            <strong>증여세 비과세 한도 활용</strong>: 배우자 6억, 자녀 5천만 원씩 10년 단위로 분할 증여하면 증여세를 줄일 수 있습니다.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          마무리: 발표 금액의 약 68%만 실수령
        </h2>
        <p>
          로또 1등 당첨이 발표될 때 보도되는 금액은 세전 금액입니다. 25억 원이라면 실제로는 약 17억 원, 10억 원이라면 약 7억 원 정도가 실수령액입니다. 당첨을 상상해볼 때도 이 점을 염두에 두면 더 현실적인 계획을 세울 수 있습니다.
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
            <span className="text-gray-600"> — 평생 누적 구매액 vs 기대 수익 비교</span>
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
            <Link href="/guide/pension-vs-lotto/" className="text-blue-600 hover:underline">
              연금복권 720+ vs 로또 6/45 비교
            </Link>
          </li>
        </ul>
      </aside>
    </article>
  );
}
