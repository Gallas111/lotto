"use client";

import { useEffect, useState } from "react";
import LottoBall from "@/components/LottoBall";
import RecentWinning from "@/components/RecentWinning";

interface DrawResult {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
}

export default function StatsPage() {
  const [draws, setDraws] = useState<DrawResult[]>([]);

  useEffect(() => {
    fetch("/data/winning-numbers.json")
      .then((res) => res.json())
      .then(setDraws)
      .catch(() => {});
  }, []);

  const frequency = new Map<number, number>();
  for (let i = 1; i <= 45; i++) frequency.set(i, 0);

  const recent50 = draws.slice(0, 50);
  recent50.forEach((d) => {
    d.numbers.forEach((n) => frequency.set(n, (frequency.get(n) || 0) + 1));
  });

  const sorted = [...frequency.entries()].sort((a, b) => b[1] - a[1]);
  const maxFreq = sorted.length > 0 ? sorted[0][1] : 1;
  const hot = sorted.slice(0, 6);
  const cold = sorted.slice(-6).reverse();

  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          로또 당첨번호 통계
        </h1>
        <p className="text-gray-500 text-sm">
          최근 당첨번호 데이터를 기반으로 한 분석
        </p>
      </section>

      {/* Hot & Cold */}
      {draws.length > 0 && (
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-red-500 mb-3">
              자주 나온 번호 (최근 50회)
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
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-blue-500 mb-3">
              적게 나온 번호 (최근 50회)
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
      )}

      {/* Frequency Chart */}
      {draws.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            번호별 출현 빈도 (최근 50회)
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
      )}

      {/* Recent Results */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          최근 당첨번호
        </h2>
        <RecentWinning count={20} />
      </section>
    </div>
  );
}
