import type { Metadata } from "next";
import NumberGenerator from "@/components/NumberGenerator";

export const metadata: Metadata = {
  title: "로또 번호 생성기 - 랜덤, 제외, 고정 모드",
  description:
    "다양한 모드로 로또 6/45 번호를 생성하세요. 랜덤 생성, 특정 번호 제외, 고정 번호 포함 등 원하는 방식으로 번호를 만들 수 있습니다.",
  alternates: { canonical: "/generator/" },
};

export default function GeneratorPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          로또 번호 생성기
        </h1>
        <p className="text-gray-500 text-sm">
          원하는 모드를 선택하고 번호를 생성하세요
        </p>
      </section>

      <NumberGenerator />

      <section className="prose prose-sm max-w-none text-gray-500">
        <h2 className="text-lg font-bold text-gray-700">생성 모드 안내</h2>
        <h3 className="text-base font-semibold text-gray-600">랜덤 생성</h3>
        <p>
          1부터 45까지 모든 번호 중에서 6개를 완전히 무작위로 선택합니다. 가장
          기본적인 방식으로, 모든 번호가 동일한 확률로 선택됩니다.
        </p>
        <h3 className="text-base font-semibold text-gray-600">번호 제외</h3>
        <p>
          특정 번호를 제외하고 나머지 번호 중에서 생성합니다. 최근 자주 나온
          번호를 피하고 싶거나, 개인적으로 원하지 않는 번호가 있을 때
          유용합니다.
        </p>
        <h3 className="text-base font-semibold text-gray-600">고정 번호</h3>
        <p>
          반드시 포함하고 싶은 번호(최대 5개)를 선택하면, 나머지 자리를
          무작위로 채워줍니다. 행운의 번호나 기념일 관련 번호를 고정하고 싶을 때
          사용하세요.
        </p>
      </section>
    </div>
  );
}
