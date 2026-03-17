"use client";

import { useEffect, useState } from "react";
import LottoBall from "./LottoBall";

interface DrawResult {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
}

export default function RecentWinning({ count = 5 }: { count?: number }) {
  const [draws, setDraws] = useState<DrawResult[]>([]);

  useEffect(() => {
    fetch("/data/winning-numbers.json")
      .then((res) => res.json())
      .then((data: DrawResult[]) => setDraws(data.slice(0, count)))
      .catch(() => {});
  }, [count]);

  if (draws.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8 text-sm">
        당첨번호 데이터를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {draws.map((draw) => (
        <div
          key={draw.round}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-700">
              {draw.round}회
            </span>
            <span className="text-xs text-gray-400">{draw.date}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {draw.numbers.map((num) => (
              <LottoBall key={num} number={num} size="sm" />
            ))}
            <span className="text-gray-300 text-lg">+</span>
            <LottoBall number={draw.bonus} size="sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
