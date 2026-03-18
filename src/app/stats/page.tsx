"use client";

import { useEffect, useState, useMemo } from "react";
import LottoBall from "@/components/LottoBall";
import RecentWinning from "@/components/RecentWinning";

interface DrawResult {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
}

type PeriodOption = 10 | 20 | 50 | 0; // 0 = 전체

const PERIOD_LABELS: { value: PeriodOption; label: string }[] = [
  { value: 10, label: "최근 10회" },
  { value: 20, label: "최근 20회" },
  { value: 50, label: "최근 50회" },
  { value: 0, label: "전체" },
];

function calcACValue(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const diffs = new Set<number>();
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      diffs.add(sorted[j] - sorted[i]);
    }
  }
  // AC = 서로 다른 차이값 수 - (번호 개수 - 1)
  return diffs.size - (sorted.length - 1);
}

export default function StatsPage() {
  const [allDraws, setAllDraws] = useState<DrawResult[]>([]);
  const [period, setPeriod] = useState<PeriodOption>(50);

  useEffect(() => {
    fetch("/data/winning-numbers.json")
      .then((res) => res.json())
      .then(setAllDraws)
      .catch(() => {});
  }, []);

  const draws = useMemo(
    () => (period === 0 ? allDraws : allDraws.slice(0, period)),
    [allDraws, period]
  );

  const periodLabel = period === 0 ? "전체" : `최근 ${period}회`;

  // ── Frequency ──
  const frequency = useMemo(() => {
    const freq = new Map<number, number>();
    for (let i = 1; i <= 45; i++) freq.set(i, 0);
    draws.forEach((d) =>
      d.numbers.forEach((n) => freq.set(n, (freq.get(n) || 0) + 1))
    );
    return freq;
  }, [draws]);

  const sorted = useMemo(
    () => [...frequency.entries()].sort((a, b) => b[1] - a[1]),
    [frequency]
  );
  const maxFreq = sorted.length > 0 ? sorted[0][1] : 1;
  const hot = sorted.slice(0, 6);
  const cold = sorted.slice(-6).reverse();

  // ── 홀짝 분석 ──
  const oddEvenStats = useMemo(() => {
    const results: { round: number; odd: number; even: number }[] = [];
    const dist = [0, 0, 0, 0, 0, 0, 0]; // index = odd 개수 (0~6)
    draws.forEach((d) => {
      const odd = d.numbers.filter((n) => n % 2 === 1).length;
      const even = 6 - odd;
      results.push({ round: d.round, odd, even });
      dist[odd]++;
    });
    return { results, dist, total: draws.length };
  }, [draws]);

  // ── 고저 분석 ──
  const highLowStats = useMemo(() => {
    const dist = [0, 0, 0, 0, 0, 0, 0]; // index = low 개수 (0~6)
    draws.forEach((d) => {
      const low = d.numbers.filter((n) => n <= 22).length;
      dist[low]++;
    });
    return { dist, total: draws.length };
  }, [draws]);

  // ── 번호합 분석 ──
  const sumStats = useMemo(() => {
    const sums = draws.map((d) => ({
      round: d.round,
      sum: d.numbers.reduce((a, b) => a + b, 0),
    }));
    const goldenCount = sums.filter((s) => s.sum >= 106 && s.sum <= 170).length;
    const avg =
      sums.length > 0
        ? Math.round(sums.reduce((a, s) => a + s.sum, 0) / sums.length)
        : 0;
    const min = sums.length > 0 ? Math.min(...sums.map((s) => s.sum)) : 0;
    const max = sums.length > 0 ? Math.max(...sums.map((s) => s.sum)) : 0;
    // 구간 분포
    const ranges = [
      { label: "~80", min: 0, max: 80, count: 0 },
      { label: "81~105", min: 81, max: 105, count: 0 },
      { label: "106~170", min: 106, max: 170, count: 0, golden: true },
      { label: "171~195", min: 171, max: 195, count: 0 },
      { label: "196~", min: 196, max: 999, count: 0 },
    ];
    sums.forEach((s) => {
      for (const r of ranges) {
        if (s.sum >= r.min && s.sum <= r.max) {
          r.count++;
          break;
        }
      }
    });
    return { sums, goldenCount, avg, min, max, ranges, total: sums.length };
  }, [draws]);

  // ── 연속번호 분석 ──
  const consecutiveStats = useMemo(() => {
    let withConsecutive = 0;
    const pairCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
    draws.forEach((d) => {
      const s = [...d.numbers].sort((a, b) => a - b);
      let pairs = 0;
      for (let i = 0; i < s.length - 1; i++) {
        if (s[i + 1] - s[i] === 1) pairs++;
      }
      if (pairs > 0) withConsecutive++;
      const key = Math.min(pairs, 3);
      pairCounts[key] = (pairCounts[key] || 0) + 1;
    });
    return { withConsecutive, pairCounts, total: draws.length };
  }, [draws]);

  // ── AC값 분석 ──
  const acStats = useMemo(() => {
    const acDist: Record<number, number> = {};
    const values: number[] = [];
    draws.forEach((d) => {
      const ac = calcACValue(d.numbers);
      values.push(ac);
      acDist[ac] = (acDist[ac] || 0) + 1;
    });
    const avg =
      values.length > 0
        ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
        : "0";
    return { acDist, avg, total: draws.length };
  }, [draws]);

  // ── 구간별 분석 ──
  const rangeStats = useMemo(() => {
    const ranges = [
      { label: "1~10", min: 1, max: 10, count: 0 },
      { label: "11~20", min: 11, max: 20, count: 0 },
      { label: "21~30", min: 21, max: 30, count: 0 },
      { label: "31~40", min: 31, max: 40, count: 0 },
      { label: "41~45", min: 41, max: 45, count: 0 },
    ];
    draws.forEach((d) => {
      d.numbers.forEach((n) => {
        for (const r of ranges) {
          if (n >= r.min && n <= r.max) {
            r.count++;
            break;
          }
        }
      });
    });
    const total = draws.length * 6;
    return { ranges, total };
  }, [draws]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          로또 당첨번호 통계
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          당첨번호 데이터를 기반으로 한 심층 분석
        </p>

        {/* Period Selector */}
        <div className="flex justify-center gap-2 flex-wrap">
          {PERIOD_LABELS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                period === p.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {draws.length > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            분석 대상: {draws.length}회차 ({draws[draws.length - 1]?.round}회 ~{" "}
            {draws[0]?.round}회)
          </p>
        )}
      </section>

      {draws.length === 0 && (
        <div className="text-center text-gray-400 py-12 text-sm">
          데이터를 불러오는 중...
        </div>
      )}

      {draws.length > 0 && (
        <>
          {/* Hot & Cold */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-red-500 mb-3 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                자주 나온 번호 ({periodLabel})
              </h3>
              <div className="flex flex-wrap gap-2">
                {hot.map(([num, cnt]) => (
                  <div key={num} className="text-center">
                    <LottoBall number={num} size="sm" />
                    <div className="text-xs text-gray-400 mt-1">{cnt}회</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-blue-500 mb-3 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                적게 나온 번호 ({periodLabel})
              </h3>
              <div className="flex flex-wrap gap-2">
                {cold.map(([num, cnt]) => (
                  <div key={num} className="text-center">
                    <LottoBall number={num} size="sm" />
                    <div className="text-xs text-gray-400 mt-1">{cnt}회</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Analysis Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 홀짝 분석 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-purple-600 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                  홀
                </span>
                홀짝 분석
              </h3>
              <div className="space-y-2">
                {[0, 1, 2, 3, 4, 5, 6].map((oddCount) => {
                  const cnt = oddEvenStats.dist[oddCount];
                  const pct =
                    oddEvenStats.total > 0
                      ? ((cnt / oddEvenStats.total) * 100).toFixed(1)
                      : "0";
                  const barPct =
                    oddEvenStats.total > 0
                      ? (cnt / oddEvenStats.total) * 100
                      : 0;
                  return (
                    <div key={oddCount} className="flex items-center gap-2 text-xs">
                      <span className="w-16 text-gray-600 font-medium shrink-0">
                        {oddCount}:{6 - oddCount}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden relative">
                        <div
                          className="h-full rounded-full bg-purple-400 transition-all"
                          style={{ width: `${barPct}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-600 font-medium">
                          {cnt}회 ({pct}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-3">
                * 홀수:짝수 비율 (예: 3:3 = 홀수 3개, 짝수 3개)
              </p>
            </div>

            {/* 고저 분석 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-teal-600 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold">
                  고
                </span>
                고저 분석
              </h3>
              <div className="space-y-2">
                {[0, 1, 2, 3, 4, 5, 6].map((lowCount) => {
                  const cnt = highLowStats.dist[lowCount];
                  const pct =
                    highLowStats.total > 0
                      ? ((cnt / highLowStats.total) * 100).toFixed(1)
                      : "0";
                  const barPct =
                    highLowStats.total > 0
                      ? (cnt / highLowStats.total) * 100
                      : 0;
                  return (
                    <div key={lowCount} className="flex items-center gap-2 text-xs">
                      <span className="w-16 text-gray-600 font-medium shrink-0">
                        {lowCount}:{6 - lowCount}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden relative">
                        <div
                          className="h-full rounded-full bg-teal-400 transition-all"
                          style={{ width: `${barPct}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-600 font-medium">
                          {cnt}회 ({pct}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-3">
                * 저(1~22):고(23~45) 비율
              </p>
            </div>

            {/* 번호합 분석 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-amber-600 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                  합
                </span>
                번호합 분석
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-gray-800">
                    {sumStats.avg}
                  </div>
                  <div className="text-[10px] text-gray-500">평균</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-gray-800">
                    {sumStats.min}
                  </div>
                  <div className="text-[10px] text-gray-500">최소</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-gray-800">
                    {sumStats.max}
                  </div>
                  <div className="text-[10px] text-gray-500">최대</div>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-center">
                <span className="text-xs text-amber-700 font-medium">
                  황금 구간 (106~170) 적중률
                </span>
                <div className="text-2xl font-bold text-amber-600 mt-1">
                  {sumStats.total > 0
                    ? ((sumStats.goldenCount / sumStats.total) * 100).toFixed(1)
                    : 0}
                  %
                </div>
                <span className="text-[10px] text-amber-500">
                  {sumStats.goldenCount}/{sumStats.total}회
                </span>
              </div>
              <div className="space-y-1.5">
                {sumStats.ranges.map((r) => {
                  const pct =
                    sumStats.total > 0
                      ? (r.count / sumStats.total) * 100
                      : 0;
                  return (
                    <div key={r.label} className="flex items-center gap-2 text-xs">
                      <span
                        className={`w-16 font-medium shrink-0 ${
                          "golden" in r && r.golden
                            ? "text-amber-600 font-bold"
                            : "text-gray-600"
                        }`}
                      >
                        {r.label}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            "golden" in r && r.golden
                              ? "bg-amber-400"
                              : "bg-gray-300"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-14 text-right text-gray-500 text-[10px]">
                        {r.count}회 ({pct.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 연속번호 분석 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-rose-600 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">
                  연
                </span>
                연속번호 분석
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-rose-600">
                    {consecutiveStats.total > 0
                      ? (
                          (consecutiveStats.withConsecutive /
                            consecutiveStats.total) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                  <div className="text-[10px] text-gray-500">
                    연속번호 출현율
                  </div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-800">
                    {consecutiveStats.withConsecutive}
                    <span className="text-sm text-gray-400">
                      /{consecutiveStats.total}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    연속번호 포함 횟수
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(consecutiveStats.pairCounts).map(
                  ([pairs, cnt]) => {
                    const pct =
                      consecutiveStats.total > 0
                        ? (cnt / consecutiveStats.total) * 100
                        : 0;
                    const label =
                      pairs === "0"
                        ? "연속번호 없음"
                        : pairs === "1"
                          ? "1쌍"
                          : pairs === "2"
                            ? "2쌍"
                            : "3쌍 이상";
                    return (
                      <div
                        key={pairs}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="w-24 text-gray-600 font-medium shrink-0">
                          {label}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden relative">
                          <div
                            className="h-full rounded-full bg-rose-400 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-600 font-medium">
                            {cnt}회 ({pct.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-3">
                * 연속번호: 차이가 1인 인접 번호 쌍 (예: 12, 13)
              </p>
            </div>

            {/* AC값 분석 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-indigo-600 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                  AC
                </span>
                AC값 분석
              </h3>
              <div className="text-center bg-indigo-50 rounded-lg p-3 mb-4">
                <span className="text-xs text-indigo-600 font-medium">
                  평균 AC값
                </span>
                <div className="text-2xl font-bold text-indigo-700">
                  {acStats.avg}
                </div>
              </div>
              <div className="space-y-1.5">
                {Object.entries(acStats.acDist)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([ac, cnt]) => {
                    const pct =
                      acStats.total > 0 ? (cnt / acStats.total) * 100 : 0;
                    const isCommon = Number(ac) >= 7 && Number(ac) <= 10;
                    return (
                      <div
                        key={ac}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className={`w-10 font-medium shrink-0 text-right ${
                            isCommon
                              ? "text-indigo-600 font-bold"
                              : "text-gray-500"
                          }`}
                        >
                          {ac}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isCommon ? "bg-indigo-500" : "bg-indigo-300"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-16 text-right text-gray-500 text-[10px]">
                          {cnt}회 ({pct.toFixed(0)}%)
                        </span>
                      </div>
                    );
                  })}
              </div>
              <p className="text-[10px] text-gray-400 mt-3">
                * AC값 = 번호간 차이값 종류 수 - 5 (높을수록 번호가 고르게
                분포)
              </p>
            </div>

            {/* 구간별 분석 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-emerald-600 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                  구
                </span>
                구간별 분석
              </h3>
              <div className="space-y-3">
                {rangeStats.ranges.map((r) => {
                  const pct =
                    rangeStats.total > 0
                      ? (r.count / rangeStats.total) * 100
                      : 0;
                  const expected =
                    r.max === 45
                      ? ((5 / 45) * 100).toFixed(1)
                      : ((10 / 45) * 100).toFixed(1);
                  const colors: Record<string, string> = {
                    "1~10": "#FBC400",
                    "11~20": "#69C8F2",
                    "21~30": "#FF7272",
                    "31~40": "#AAAAAA",
                    "41~45": "#B0D840",
                  };
                  return (
                    <div key={r.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">
                          {r.label}
                        </span>
                        <span className="text-gray-400">
                          {r.count}개 ({pct.toFixed(1)}%) / 기대
                          {expected}%
                        </span>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden relative">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: colors[r.label] || "#999",
                          }}
                        />
                        {/* Expected line */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-gray-800 opacity-30"
                          style={{ left: `${parseFloat(expected)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
                <span className="w-3 h-0.5 bg-gray-800 opacity-30 inline-block" />
                세로선 = 기대 비율
              </p>
            </div>
          </section>

          {/* Frequency Chart */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              번호별 출현 빈도 ({periodLabel})
            </h2>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-1">
              {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
                const cnt = frequency.get(num) || 0;
                const pct = maxFreq > 0 ? (cnt / maxFreq) * 100 : 0;
                return (
                  <div key={num} className="flex items-center gap-2 text-xs">
                    <span className="w-6 text-right text-gray-500 font-mono">
                      {num}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            num <= 10
                              ? "#FBC400"
                              : num <= 20
                                ? "#69C8F2"
                                : num <= 30
                                  ? "#FF7272"
                                  : num <= 40
                                    ? "#AAAAAA"
                                    : "#B0D840",
                        }}
                      />
                    </div>
                    <span className="w-6 text-gray-400">{cnt}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent Results */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              최근 당첨번호
            </h2>
            <RecentWinning count={20} />
          </section>
        </>
      )}
    </div>
  );
}
