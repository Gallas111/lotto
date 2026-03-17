import NumberGenerator from "@/components/NumberGenerator";
import RecentWinning from "@/components/RecentWinning";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center pt-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          로또 번호 생성기
        </h1>
        <p className="text-gray-500">
          랜덤, 제외, 고정 모드로 나만의 로또 번호를 만들어보세요
        </p>
      </section>

      {/* Generator */}
      <section>
        <NumberGenerator />
      </section>

      {/* Recent Winning Numbers */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          최근 당첨번호
        </h2>
        <RecentWinning count={5} />
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4">
          {[
            {
              q: "로또 번호 생성기는 어떤 원리로 작동하나요?",
              a: "암호학적으로 안전한 난수 생성기(crypto.getRandomValues)를 사용하여 1부터 45까지의 번호 중 6개를 무작위로 선택합니다. 매번 완전히 새로운 조합이 생성됩니다.",
            },
            {
              q: "생성된 번호로 당첨될 확률은 얼마나 되나요?",
              a: "로또 6/45의 1등 당첨 확률은 약 1/8,145,060입니다. 어떤 번호 조합을 선택하든 당첨 확률은 동일합니다. 본 서비스는 재미를 위한 것이며 당첨을 보장하지 않습니다.",
            },
            {
              q: "번호 제외 모드와 고정 번호 모드는 무엇인가요?",
              a: "번호 제외 모드는 선택한 번호를 제외하고 나머지에서 생성합니다. 고정 번호 모드는 선택한 번호(최대 5개)를 반드시 포함하고 나머지를 랜덤으로 채웁니다.",
            },
            {
              q: "생성한 번호를 저장할 수 있나요?",
              a: "네, 각 생성 결과 옆의 '저장' 버튼을 누르면 브라우저에 저장됩니다. '저장함' 페이지에서 저장한 번호를 확인하고 관리할 수 있습니다.",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 group"
            >
              <summary className="font-medium text-gray-700 cursor-pointer list-none flex items-center justify-between">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  &#9662;
                </span>
              </summary>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
