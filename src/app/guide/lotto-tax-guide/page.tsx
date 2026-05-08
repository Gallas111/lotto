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
          7. 등수별 실수령액 시나리오 비교
        </h2>
        <p>
          1등만 세금 이슈가 있는 게 아닙니다. 5등(5,000원)부터 1등까지 각 등수별 세후 수령액을 정리하면 다음과 같습니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-3 font-semibold">등수</th>
                <th className="text-right p-3 font-semibold">발표 당첨금(예시)</th>
                <th className="text-right p-3 font-semibold">세금</th>
                <th className="text-right p-3 font-semibold">실수령액</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">5등</td>
                <td className="p-3 text-right tabular-nums">5,000원</td>
                <td className="p-3 text-right tabular-nums">0원 (5만 이하 비과세)</td>
                <td className="p-3 text-right tabular-nums font-medium">5,000원</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">4등</td>
                <td className="p-3 text-right tabular-nums">50,000원</td>
                <td className="p-3 text-right tabular-nums">0원 (5만 이하 비과세)</td>
                <td className="p-3 text-right tabular-nums font-medium">50,000원</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">3등</td>
                <td className="p-3 text-right tabular-nums">1,500,000원</td>
                <td className="p-3 text-right tabular-nums">330,000원 (22%)</td>
                <td className="p-3 text-right tabular-nums font-medium">1,170,000원</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">2등</td>
                <td className="p-3 text-right tabular-nums">70,000,000원</td>
                <td className="p-3 text-right tabular-nums">15,400,000원 (22%)</td>
                <td className="p-3 text-right tabular-nums font-medium">54,600,000원</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">1등</td>
                <td className="p-3 text-right tabular-nums">2,500,000,000원</td>
                <td className="p-3 text-right tabular-nums">792,000,000원</td>
                <td className="p-3 text-right tabular-nums font-medium">1,708,000,000원</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          5등(5,000원)과 4등(5만 원)은 5만 원 이하 비과세 규정 덕분에 세금이 전혀 발생하지 않습니다. 즉, 발표 금액 그대로가 실수령액입니다. 3등 약 150만 원 구간부터 22% 원천징수가 적용되며, 받는 즉시 세후 금액으로 입금됩니다. 정확한 임의 금액은 <Link href="/calculator/" className="text-blue-600 hover:underline">당첨금 세금 계산기</Link>에서 입력해 바로 확인할 수 있습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          8. 연금복권과 로또 세금 비교 - 분할 vs 일시
        </h2>
        <p>
          연금복권 720+의 1등은 월 700만 원씩 20년 지급 방식입니다. 매월 700만 원에 22% 원천징수가 적용되어 <strong>월 실수령 약 546만 원</strong>이 됩니다. 20년 누적 실수령은 약 13억 1,000만 원 수준입니다.
        </p>
        <p>
          왜 22%만 떼는가? 연금복권은 매월 분할 지급되어 월별로 계산되기 때문에 한 번도 3억 원 구간을 넘지 않습니다. 따라서 33% 구간이 발생할 일이 없고, 항상 22%(20% 기타소득세 + 2% 지방소득세)만 적용됩니다.
        </p>
        <p>
          반면 로또 1등은 한 번에 큰 금액이 들어오므로 3억 초과분에 33%가 적용됩니다. 25억 원 1등 시 약 7억 9,200만 원이 세금으로 빠집니다. 이 차이 때문에 <strong>총 발표 금액이 같아도 연금복권의 실수령 비율이 더 높습니다</strong>(약 78% vs 로또 약 68%). 단, 시간 가치를 고려하면 다른 결론이 나옵니다 — 자세한 비교는 <Link href="/guide/pension-vs-lotto/" className="text-blue-600 hover:underline">연금복권 vs 로또 가이드</Link> 참조.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          9. 받은 후 종합소득세 신고 시 주의점
        </h2>
        <p>
          기타소득세는 분리과세이므로 별도 종합소득세 신고가 필요 없습니다. 단 다음 두 가지 시나리오는 별도 점검이 필요합니다.
        </p>
        <ul className="space-y-2 list-disc list-inside pl-2">
          <li>
            <strong>금융소득 종합과세 대상</strong>: 당첨금을 예금이나 채권으로 운용해서 연간 이자·배당 소득이 2,000만 원을 넘으면, 그 이자·배당 부분에 대해 종합과세 대상이 됩니다. 17억 원을 연 4% 정기예금에 묶으면 연 6,800만 원의 이자가 발생해 자동으로 금융소득 종합과세 구간에 진입합니다. 종합소득 합산 시 최고 49.5%(소득세 45% + 지방세 4.5%)까지 누진세율이 적용됩니다.
          </li>
          <li>
            <strong>건강보험 피부양자 박탈</strong>: 큰 자산이 형성되면 건강보험 피부양자 자격이 떨어져 지역가입자로 전환됩니다. 추가 보험료가 매월 발생하므로 사전 계산이 필요합니다.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          10. 증여세 절세 - 10년 단위 분할 활용
        </h2>
        <p>
          당첨금을 가족에게 나눠줄 때 적용되는 증여세 비과세 한도는 10년 단위로 다시 적용됩니다. 즉, 한 번 한도를 사용해도 10년이 지나면 다시 같은 한도가 부활합니다.
        </p>
        <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
{`증여세 비과세 한도 (10년 누적)
  배우자: 6억 원
  자녀(성년): 5천만 원
  자녀(미성년): 2천만 원
  부모·조부모: 5천만 원
  형제자매: 1천만 원
  기타 친족: 1천만 원

증여세율 (한도 초과분)
  1억 이하: 10%
  1억~5억: 20%
  5억~10억: 30%
  10억~30억: 40%
  30억 초과: 50%

※ 모두 누진공제 별도 적용`}
        </pre>
        <p>
          예를 들어 17억 실수령액을 배우자와 성인 자녀 2명에게 분배한다면, 배우자에게 6억 + 자녀 각 5천만 원 = 7억 원까지 증여세 없이 이전 가능합니다. 나머지 10억 원은 본인 명의로 운용하다가 10년 후 다시 같은 한도를 활용하는 식으로 분할하면 누적 증여세를 크게 줄일 수 있습니다. 배우자 6억 한도는 매우 큰 절세 효과를 가지므로, 결혼 가정이라면 가장 우선 활용해야 합니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          11. 당첨 직후 첫 30일 동안 해야 할 5가지
        </h2>
        <p>
          큰 금액이 한 번에 들어왔을 때 첫 한 달 동안의 행동이 이후 자산 운용 결과를 좌우합니다. 동행복권 권장사항과 재무 상담 가이드라인에 따르면 다음 순서가 합리적입니다.
        </p>
        <ul className="space-y-3 list-disc list-inside pl-2">
          <li>
            <strong>1. 즉시 공개하지 않기</strong>: 가족·친척·지인에게도 당첨 사실을 즉시 공개하지 않는 것이 안전합니다. 친척의 돈 요청, 사기 시도, 언론 노출이 빠르게 시작될 수 있습니다. 동행복권은 익명 수령을 권장하며, 농협 등 일부 은행 본점에서 비공개 수령 절차를 안내받을 수 있습니다.
          </li>
          <li>
            <strong>2. 세후 실수령액 확인</strong>: 발표 금액의 약 67~68%가 실수령액임을 다시 한 번 계산기로 확인합니다. 25억 발표 → 17억 수령 식의 큰 차이가 나므로, 받기 전에 정확한 액수로 자산 계획을 세워야 합니다.
          </li>
          <li>
            <strong>3. 현금성 단기 보관</strong>: 받자마자 당장 큰 결정을 하지 않고, 우선 예금자보호 한도(은행당 5천만 원) 안에서 여러 은행에 분산 예치합니다. 30일 동안 침착하게 운용 계획을 세울 시간을 확보합니다.
          </li>
          <li>
            <strong>4. 세무사·재무 상담</strong>: 17억 이상 자산이라면 세무사 1~2명, 독립 재무 상담사(IFA) 1명과 상담을 받아 종합소득세·증여세 시뮬레이션을 받습니다. 비용은 보통 수십~수백만 원 수준이지만, 이 단계에서 절약되는 세금이 훨씬 큽니다.
          </li>
          <li>
            <strong>5. 큰 지출 30일 보류</strong>: 자동차·부동산·사업 같은 대형 지출은 최소 30일, 가능하면 90일 보류합니다. 충동 결정으로 부적절한 자산 매입을 막는 가장 효과적인 방어선입니다.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          마무리: 발표 금액의 약 68%만 실수령
        </h2>
        <p>
          로또 1등 당첨이 발표될 때 보도되는 금액은 세전 금액입니다. 25억 원이라면 실제로는 약 17억 원, 10억 원이라면 약 7억 원 정도가 실수령액입니다. 당첨을 상상해볼 때도 이 점을 염두에 두면 더 현실적인 계획을 세울 수 있습니다. 또한 받은 후에도 운용 방식에 따라 금융소득 종합과세나 증여세가 추가로 발생할 수 있으니, 큰 금액이 입금됐을 때는 받기 전에 세무사와 상담하는 것을 권장합니다.
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
