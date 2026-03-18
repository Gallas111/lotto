"use client";

import { useState, useRef, useCallback } from "react";
import LottoBall from "@/components/LottoBall";

type RankKey = "1st" | "2nd" | "3rd" | "4th" | "5th" | "none";

interface SimState {
  attempts: number;
  spent: number;
  ranks: Record<RankKey, number>;
  prizes: number;
  myNumbers: number[];
  currentDraw: number[];
  currentBonus: number;
  bestRank: RankKey;
  running: boolean;
  won1st: boolean;
  years: number;
}

const RANK_LABELS: Record<RankKey, string> = {
  "1st": "1등",
  "2nd": "2등",
  "3rd": "3등",
  "4th": "4등",
  "5th": "5등",
  none: "미당첨",
};

const RANK_PRIZES: Record<RankKey, number> = {
  "1st": 2_000_000_000,
  "2nd": 60_000_000,
  "3rd": 1_500_000,
  "4th": 50_000,
  "5th": 5_000,
  none: 0,
};

const RANK_COLORS: Record<RankKey, string> = {
  "1st": "text-yellow-500",
  "2nd": "text-blue-500",
  "3rd": "text-red-500",
  "4th": "text-green-500",
  "5th": "text-gray-500",
  none: "text-gray-400",
};

function pickRandom6(): number[] {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 7).sort((a, b) => a - b); // 6 numbers + 1 bonus
}

function checkRank(my: number[], draw: number[], bonus: number): RankKey {
  const matched = my.filter((n) => draw.includes(n)).length;
  const bonusMatch = my.includes(bonus);
  if (matched === 6) return "1st";
  if (matched === 5 && bonusMatch) return "2nd";
  if (matched === 5) return "3rd";
  if (matched === 4) return "4th";
  if (matched === 3) return "5th";
  return "none";
}

const RANK_ORDER: RankKey[] = ["1st", "2nd", "3rd", "4th", "5th", "none"];

function formatMoney(n: number): string {
  if (n >= 100_000_000) {
    const eok = Math.floor(n / 100_000_000);
    const man = Math.floor((n % 100_000_000) / 10_000);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
  }
  if (n >= 10_000) {
    return `${Math.floor(n / 10_000).toLocaleString()}만원`;
  }
  return `${n.toLocaleString()}원`;
}

export default function SimulatorPage() {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [speed, setSpeed] = useState(100);
  const [state, setState] = useState<SimState>({
    attempts: 0,
    spent: 0,
    ranks: { "1st": 0, "2nd": 0, "3rd": 0, "4th": 0, "5th": 0, none: 0 },
    prizes: 0,
    myNumbers: [],
    currentDraw: [],
    currentBonus: 0,
    bestRank: "none",
    running: false,
    won1st: false,
    years: 0,
  });

  const runningRef = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

  const toggleNumber = (num: number) => {
    setSelectedNumbers((prev) => {
      if (prev.includes(num)) return prev.filter((n) => n !== num);
      if (prev.length >= 6) return prev;
      return [...prev, num].sort((a, b) => a - b);
    });
  };

  const runSimulation = useCallback(() => {
    let myNums: number[];
    if (mode === "manual") {
      if (selectedNumbers.length !== 6) return;
      myNums = [...selectedNumbers];
    } else {
      const pick = pickRandom6();
      myNums = pick.slice(0, 6);
    }

    runningRef.current = true;
    const ranks: Record<RankKey, number> = {
      "1st": 0,
      "2nd": 0,
      "3rd": 0,
      "4th": 0,
      "5th": 0,
      none: 0,
    };
    let attempts = 0;
    let prizes = 0;
    let bestRank: RankKey = "none";
    let won1st = false;

    setState((s) => ({
      ...s,
      myNumbers: myNums,
      running: true,
      won1st: false,
      attempts: 0,
      spent: 0,
      ranks: { ...ranks },
      prizes: 0,
      bestRank: "none",
      currentDraw: [],
      currentBonus: 0,
    }));

    const batchSize = speed >= 1000 ? 5000 : speed >= 100 ? 500 : speed >= 10 ? 50 : 1;

    const step = () => {
      if (!runningRef.current) return;

      let lastDraw: number[] = [];
      let lastBonus = 0;

      for (let i = 0; i < batchSize; i++) {
        if (won1st) break;
        const pick = pickRandom6();
        const draw = pick.slice(0, 6);
        const bonus = pick[6];
        lastDraw = draw;
        lastBonus = bonus;

        const rank = checkRank(myNums, draw, bonus);
        ranks[rank]++;
        attempts++;
        prizes += RANK_PRIZES[rank];

        if (
          RANK_ORDER.indexOf(rank) < RANK_ORDER.indexOf(bestRank)
        ) {
          bestRank = rank;
        }

        if (rank === "1st") {
          won1st = true;
          break;
        }
      }

      const spent = attempts * 1000;
      const years = Math.floor(attempts / 52);

      setState({
        attempts,
        spent,
        ranks: { ...ranks },
        prizes,
        myNumbers: myNums,
        currentDraw: lastDraw,
        currentBonus: lastBonus,
        bestRank,
        running: !won1st,
        won1st,
        years,
      });

      if (won1st) {
        runningRef.current = false;
        return;
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [mode, selectedNumbers, speed]);

  const stopSimulation = () => {
    runningRef.current = false;
    setState((s) => ({ ...s, running: false }));
  };

  const reset = () => {
    runningRef.current = false;
    setState({
      attempts: 0,
      spent: 0,
      ranks: { "1st": 0, "2nd": 0, "3rd": 0, "4th": 0, "5th": 0, none: 0 },
      prizes: 0,
      myNumbers: [],
      currentDraw: [],
      currentBonus: 0,
      bestRank: "none",
      running: false,
      won1st: false,
      years: 0,
    });
  };

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          로또 시뮬레이터
        </h1>
        <p className="text-gray-500 text-sm">
          실제 확률로 1등에 당첨되기까지 얼마나 걸리는지 체험해보세요
        </p>
      </section>

      {/* 모드 선택 */}
      {!state.running && !state.won1st && state.attempts === 0 && (
        <>
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 mb-3">
              시뮬레이션 모드
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("auto")}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition cursor-pointer ${
                  mode === "auto"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                자동 번호
              </button>
              <button
                onClick={() => setMode("manual")}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition cursor-pointer ${
                  mode === "manual"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                내 번호 선택
              </button>
            </div>
          </section>

          {/* 번호 선택 (수동 모드) */}
          {mode === "manual" && (
            <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-3">
                6개 번호를 선택하세요 ({selectedNumbers.length}/6)
              </p>
              <div className="flex flex-wrap gap-2">
                {allNumbers.map((num) => (
                  <LottoBall
                    key={num}
                    number={num}
                    size="sm"
                    selected={selectedNumbers.includes(num)}
                    onClick={() => toggleNumber(num)}
                  />
                ))}
              </div>
              {selectedNumbers.length > 0 && (
                <div className="mt-3 flex gap-2">
                  <span className="text-sm text-gray-500">선택:</span>
                  {selectedNumbers.map((n) => (
                    <LottoBall key={n} number={n} size="sm" />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 속도 설정 */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 mb-3">
              시뮬레이션 속도
            </h2>
            <div className="flex gap-2">
              {[
                { label: "1x", value: 1 },
                { label: "10x", value: 10 },
                { label: "100x", value: 100 },
                { label: "1000x", value: 1000 },
                { label: "MAX", value: 10000 },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSpeed(s.value)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    speed === s.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 시작/정지 버튼 */}
      <div className="flex gap-2">
        {!state.running && !state.won1st && state.attempts === 0 && (
          <button
            onClick={runSimulation}
            disabled={mode === "manual" && selectedNumbers.length !== 6}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-lg transition text-lg cursor-pointer disabled:cursor-not-allowed"
          >
            시뮬레이션 시작
          </button>
        )}
        {state.running && (
          <button
            onClick={stopSimulation}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition text-lg cursor-pointer"
          >
            정지
          </button>
        )}
        {(state.won1st || (!state.running && state.attempts > 0)) && (
          <button
            onClick={reset}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition text-lg cursor-pointer"
          >
            다시 시작
          </button>
        )}
      </div>

      {/* 1등 당첨! */}
      {state.won1st && (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 text-center animate-pulse">
          <p className="text-4xl font-black text-white mb-2">1등 당첨!</p>
          <p className="text-white text-lg">
            {state.attempts.toLocaleString()}번 만에 1등에 당첨되었습니다!
          </p>
          <p className="text-white/80 text-sm mt-1">
            약 {state.years.toLocaleString()}년 (매주 1회 구매 기준)
          </p>
        </div>
      )}

      {/* 실시간 현황 */}
      {(state.running || state.attempts > 0) && (
        <>
          {/* 내 번호 vs 추첨 번호 */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">내 번호</p>
                <div className="flex flex-wrap gap-1">
                  {state.myNumbers.map((n) => (
                    <LottoBall
                      key={n}
                      number={n}
                      size="sm"
                      selected={state.currentDraw.includes(n)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">추첨 번호</p>
                <div className="flex flex-wrap gap-1">
                  {state.currentDraw.map((n) => (
                    <LottoBall
                      key={n}
                      number={n}
                      size="sm"
                      selected={state.myNumbers.includes(n)}
                    />
                  ))}
                  {state.currentBonus > 0 && (
                    <>
                      <span className="text-gray-300 text-xs self-center">
                        +
                      </span>
                      <LottoBall number={state.currentBonus} size="sm" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 통계 카드 */}
          <section className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-xs text-gray-500">총 시도</p>
              <p className="text-2xl font-black text-gray-900">
                {state.attempts.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">
                약 {state.years.toLocaleString()}년
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-xs text-gray-500">총 구매 금액</p>
              <p className="text-2xl font-black text-red-500">
                {formatMoney(state.spent)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-xs text-gray-500">총 당첨금</p>
              <p className="text-2xl font-black text-blue-500">
                {formatMoney(state.prizes)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-xs text-gray-500">수익률</p>
              <p
                className={`text-2xl font-black ${
                  state.prizes >= state.spent
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {state.spent > 0
                  ? `${(((state.prizes - state.spent) / state.spent) * 100).toFixed(1)}%`
                  : "0%"}
              </p>
            </div>
          </section>

          {/* 최고 등수 */}
          <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-1">최고 등수</p>
            <p className={`text-3xl font-black ${RANK_COLORS[state.bestRank]}`}>
              {RANK_LABELS[state.bestRank]}
            </p>
          </section>

          {/* 등수별 당첨 횟수 */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 mb-3">
              등수별 당첨 횟수
            </h2>
            <div className="space-y-2">
              {RANK_ORDER.filter((r) => r !== "none").map((rank) => {
                const count = state.ranks[rank];
                const pct =
                  state.attempts > 0
                    ? ((count / state.attempts) * 100).toFixed(4)
                    : "0";
                return (
                  <div key={rank} className="flex items-center gap-3 text-sm">
                    <span
                      className={`w-8 font-bold ${RANK_COLORS[rank]}`}
                    >
                      {RANK_LABELS[rank]}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full bg-blue-400 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            (count / Math.max(state.attempts, 1)) * 100 * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="w-20 text-right text-gray-600 font-mono text-xs">
                      {count.toLocaleString()}회
                    </span>
                    <span className="w-16 text-right text-gray-400 text-xs">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* 확률 안내 */}
      {state.attempts === 0 && !state.running && (
        <section className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1">
          <p className="font-medium text-gray-600">로또 당첨 확률</p>
          <p>- 1등 (6개 일치): 1/8,145,060</p>
          <p>- 2등 (5개 + 보너스): 1/1,357,510</p>
          <p>- 3등 (5개 일치): 1/35,724</p>
          <p>- 4등 (4개 일치): 1/733</p>
          <p>- 5등 (3개 일치): 1/45</p>
          <p className="mt-2 text-gray-400">
            매주 1게임씩 구매 시 1등 당첨까지 평균 약 15만년이 소요됩니다.
          </p>
        </section>
      )}
    </div>
  );
}
