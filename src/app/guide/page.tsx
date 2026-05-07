import Link from "next/link";
import { GUIDES } from "@/lib/guides";

const categoryColors: Record<string, string> = {
  확률: "bg-blue-50 text-blue-600 border-blue-200",
  세금: "bg-green-50 text-green-600 border-green-200",
  전략: "bg-purple-50 text-purple-600 border-purple-200",
  구매: "bg-orange-50 text-orange-600 border-orange-200",
  비교: "bg-pink-50 text-pink-600 border-pink-200",
};

export default function GuideIndexPage() {
  return (
    <div className="space-y-8">
      <section className="text-center pt-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">로또 가이드</h1>
        <p className="text-gray-500">
          확률, 세금, 통계 전략까지. 로또를 더 깊이 이해하는 데 필요한 모든 것
        </p>
      </section>

      <section>
        <ul className="space-y-4">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guide/${guide.slug}/`}
                className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span
                    className={`inline-block text-xs font-medium px-2 py-1 rounded-full border ${
                      categoryColors[guide.category] ?? ""
                    }`}
                  >
                    {guide.category}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {guide.readingTime}분 분량
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                  {guide.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {guide.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600 leading-relaxed">
        <p className="font-medium text-gray-700 mb-2">📌 가이드 작성 원칙</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>모든 수치는 동행복권 공식 통계와 수학적 계산을 기반으로 합니다.</li>
          <li>당첨 보장이나 매수 권유가 아닌 정보 제공이 목적입니다.</li>
          <li>로또 구매는 본인의 판단과 책임 하에 이루어져야 합니다.</li>
        </ul>
      </section>
    </div>
  );
}
