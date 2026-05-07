export type Guide = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  category: "확률" | "세금" | "전략" | "구매" | "비교";
};

export const GUIDES: Guide[] = [
  {
    slug: "lotto-odds",
    title: "로또 6/45 당첨 확률 완벽 정리: 1등은 몇 번에 한 번 나올까",
    description:
      "로또 6/45 1등부터 5등까지 당첨 확률을 수학적으로 분석합니다. 번개에 맞을 확률, 교통사고 사망 확률과 비교해서 8,145,060분의 1이 얼마나 희박한지 직관적으로 이해해보세요.",
    date: "2026-05-07",
    readingTime: 8,
    category: "확률",
  },
  {
    slug: "lotto-tax-guide",
    title: "로또 1등 세금 완벽 가이드: 33% 원천징수와 실수령액 계산법",
    description:
      "당첨금 3억 원 이하와 초과 구간의 세율 차이, 22%·33% 원천징수 계산식, 실제 실수령액 사례, 절세 가능성까지 한 번에 정리했습니다.",
    date: "2026-05-07",
    readingTime: 7,
    category: "세금",
  },
  {
    slug: "number-strategy",
    title: "로또 번호 선택 5가지 통계 전략: 빈도·홀짝·합계·AC·이월수",
    description:
      "1,200회 이상 누적된 당첨 데이터로 검증된 5가지 번호 선택 접근법. 빈도수, 홀짝 비율, 합계 구간, AC value, 이월수까지 통계 기반으로 풀어 설명합니다.",
    date: "2026-05-07",
    readingTime: 9,
    category: "전략",
  },
  {
    slug: "auto-vs-manual",
    title: "로또 자동 vs 수동 vs 반자동: 1등 당첨 비율 통계로 본 진짜 차이",
    description:
      "자동·수동·반자동 구매 방식의 정의와 차이, 역대 1등 당첨자의 구매 방식 분포 데이터, 부분식·다중식 개념까지 객관 데이터 기반으로 비교합니다.",
    date: "2026-05-07",
    readingTime: 6,
    category: "구매",
  },
  {
    slug: "pension-vs-lotto",
    title: "연금복권 720+ vs 로또 6/45: 평생 월 700만 원과 일시금 어느 쪽이 유리한가",
    description:
      "연금복권 720+의 매월 700만 원 20년 수령과 로또 일시금을 세금·현재가치·수령 안정성 관점에서 객관적으로 비교합니다.",
    date: "2026-05-07",
    readingTime: 8,
    category: "비교",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
