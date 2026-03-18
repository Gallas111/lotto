"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import LottoBall from "@/components/LottoBall";
import {
  getSavedNumbers,
  deleteSavedNumbers,
  clearAllSaved,
  type SavedSet,
} from "@/lib/storage";

interface DrawResult {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
}

type Rank = "1등" | "2등" | "3등" | "4등" | "5등" | "미당첨";

interface CheckedEntry extends SavedSet {
  matchedNumbers: number[];
  bonusMatched: boolean;
  rank: Rank;
  matchCount: number;
}

const rankOrder: Record<Rank, number> = {
  "1등": 0,
  "2등": 1,
  "3등": 2,
  "4등": 3,
  "5등": 4,
  "미당첨": 5,
};

const rankConfig: Record<
  Rank,
  { color: string; bg: string; border: string; glow: string; label: string }
> = {
  "1등": {
    color: "text-yellow-700",
    bg: "bg-gradient-to-r from-yellow-100 via-amber-50 to-yellow-100",
    border: "border-yellow-400",
    glow: "shadow-[0_0_20px_rgba(251,196,0,0.5)]",
    label: "🎉 1등 (6개 일치)",
  },
  "2등": {
    color: "text-blue-700",
    bg: "bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50",
    border: "border-blue-400",
    glow: "shadow-[0_0_16px_rgba(59,130,246,0.4)]",
    label: "2등 (5개 + 보너스)",
  },
  "3등": {
    color: "text-indigo-700",
    bg: "bg-gradient-to-r from-indigo-50 via-violet-50 to-indigo-50",
    border: "border-indigo-300",
    glow: "shadow-[0_0_12px_rgba(99,102,241,0.3)]",
    label: "3등 (5개 일치)",
  },
  "4등": {
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-300",
    glow: "shadow-[0_0_8px_rgba(34,197,94,0.25)]",
    label: "4등 (4개 일치)",
  },
  "5등": {
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    glow: "",
    label: "5등 (3개 일치)",
  },
  "미당첨": {
    color: "text-gray-400",
    bg: "bg-white",
    border: "border-gray-100",
    glow: "",
    label: "미당첨",
  },
};

function calculateRank(
  userNumbers: number[],
  winningNumbers: number[],
  bonus: number
): { rank: Rank; matchedNumbers: number[]; bonusMatched: boolean; matchCount: number } {
  const matchedNumbers = userNumbers.filter((n) => winningNumbers.includes(n));
  const bonusMatched = userNumbers.includes(bonus);
  const matchCount = matchedNumbers.length;

  let rank: Rank;
  if (matchCount === 6) {
    rank = "1등";
  } else if (matchCount === 5 && bonusMatched) {
    rank = "2등";
  } else if (matchCount === 5) {
    rank = "3등";
  } else if (matchCount === 4) {
    rank = "4등";
  } else if (matchCount === 3) {
    rank = "5등";
  } else {
    rank = "미당첨";
  }

  return { rank, matchedNumbers, bonusMatched, matchCount };
}

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedSet[]>([]);
  const [draws, setDraws] = useState<DrawResult[]>([]);
  const [checking, setChecking] = useState(false);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);

  useEffect(() => {
    setSaved(getSavedNumbers());
  }, []);

  useEffect(() => {
    fetch("/data/winning-numbers.json")
      .then((res) => res.json())
      .then((data: DrawResult[]) => {
        setDraws(data);
        if (data.length > 0) {
          setSelectedRound(data[0].round);
        }
      })
      .catch(() => {});
  }, []);

  const selectedDraw = useMemo(
    () => draws.find((d) => d.round === selectedRound) ?? null,
    [draws, selectedRound]
  );

  const checkedEntries: CheckedEntry[] = useMemo(() => {
    if (!checking || !selectedDraw) return [];
    return saved
      .map((entry) => {
        const result = calculateRank(
          entry.numbers,
          selectedDraw.numbers,
          selectedDraw.bonus
        );
        return { ...entry, ...result };
      })
      .sort((a, b) => rankOrder[a.rank] - rankOrder[b.rank]);
  }, [checking, selectedDraw, saved]);

  const handleDelete = (id: string) => {
    deleteSavedNumbers(id);
    setSaved(getSavedNumbers());
  };

  const handleClearAll = () => {
    if (confirm("저장된 모든 번호를 삭제하시겠습니까?")) {
      clearAllSaved();
      setSaved([]);
    }
  };

  const displayEntries = checking ? checkedEntries : saved;

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">저장한 번호</h1>
        <p className="text-gray-500 text-sm">
          생성기에서 저장한 번호를 확인하세요
        </p>
      </section>

      {saved.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">저장된 번호가 없습니다</p>
          <Link
            href="/generator/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            번호 생성하러 가기
          </Link>
        </div>
      ) : (
        <>
          {/* 당첨 확인 버튼 / 패널 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {!checking ? (
              <button
                onClick={() => setChecking(true)}
                className="w-full py-4 px-6 text-center font-bold text-lg bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 hover:from-amber-500 hover:via-yellow-500 hover:to-amber-500 text-white transition-all cursor-pointer active:scale-[0.98]"
              >
                <span className="drop-shadow-sm">당첨 확인하기</span>
              </button>
            ) : (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-gray-800">당첨 확인</h2>
                  <button
                    onClick={() => setChecking(false)}
                    className="text-sm text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    닫기
                  </button>
                </div>

                {/* 회차 선택 */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    회차 선택
                  </label>
                  <select
                    value={selectedRound ?? ""}
                    onChange={(e) => setSelectedRound(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
                  >
                    {draws.map((d) => (
                      <option key={d.round} value={d.round}>
                        {d.round}회 ({d.date})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 선택된 당첨번호 표시 */}
                {selectedDraw && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-2">
                      {selectedDraw.round}회 당첨번호
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedDraw.numbers.map((num) => (
                        <LottoBall key={num} number={num} size="sm" />
                      ))}
                      <span className="text-gray-300 text-lg">+</span>
                      <LottoBall number={selectedDraw.bonus} size="sm" />
                    </div>
                  </div>
                )}

                {/* 결과 요약 */}
                {checkedEntries.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {(["1등", "2등", "3등", "4등", "5등"] as Rank[]).map((r) => {
                      const count = checkedEntries.filter(
                        (e) => e.rank === r
                      ).length;
                      if (count === 0) return null;
                      return (
                        <span
                          key={r}
                          className={`px-2 py-1 rounded-full font-bold ${rankConfig[r].bg} ${rankConfig[r].color} border ${rankConfig[r].border}`}
                        >
                          {r}: {count}건
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleClearAll}
              className="text-xs text-red-400 hover:text-red-500 transition cursor-pointer"
            >
              전체 삭제
            </button>
          </div>

          {/* 번호 목록 */}
          <div className="space-y-3">
            {displayEntries.map((entry) => {
              const isChecked = checking && "rank" in entry;
              const checked = isChecked ? (entry as CheckedEntry) : null;
              const config = checked ? rankConfig[checked.rank] : null;
              const isWinner = checked && checked.rank !== "미당첨";

              return (
                <div
                  key={entry.id}
                  className={`rounded-xl p-4 border transition-all duration-500 ${
                    config
                      ? `${config.bg} ${config.border} ${config.glow}`
                      : "bg-white border-gray-100 shadow-sm"
                  } ${isWinner ? "animate-[fadeGlow_1s_ease-in-out]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        {entry.numbers.map((num) => {
                          const isMatched =
                            checked?.matchedNumbers.includes(num);
                          return (
                            <div
                              key={num}
                              className={`relative ${
                                isMatched
                                  ? "animate-[matchPop_0.4s_ease-out]"
                                  : ""
                              }`}
                            >
                              {isMatched && (
                                <div className="absolute inset-0 rounded-full bg-yellow-300/60 animate-ping" />
                              )}
                              <div
                                className={`relative ${
                                  isMatched
                                    ? "ring-3 ring-yellow-400 rounded-full shadow-[0_0_10px_rgba(251,196,0,0.6)]"
                                    : ""
                                } ${
                                  checking && !isMatched
                                    ? "opacity-40"
                                    : ""
                                }`}
                              >
                                <LottoBall number={num} size="sm" />
                              </div>
                            </div>
                          );
                        })}
                        {checked?.bonusMatched && (
                          <div className="flex items-center gap-1 ml-1">
                            <span className="text-gray-300 text-sm">+</span>
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                              보너스
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {entry.date}
                        </span>
                        {checked && (
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${config!.color} ${
                              isWinner
                                ? `${config!.bg} border ${config!.border}`
                                : "text-gray-400"
                            }`}
                          >
                            {checked.rank === "미당첨"
                              ? `미당첨 (${checked.matchCount}개 일치)`
                              : config!.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition cursor-pointer flex-shrink-0 ml-2"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Custom keyframes via style tag */}
      <style>{`
        @keyframes matchPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        @keyframes fadeGlow {
          0% { opacity: 0.5; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.01); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
