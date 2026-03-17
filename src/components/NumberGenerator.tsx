"use client";

import { useState } from "react";
import { generateNumbers, type GeneratorMode } from "@/lib/generator";
import { saveNumbers } from "@/lib/storage";
import LottoBall from "./LottoBall";

export default function NumberGenerator() {
  const [mode, setMode] = useState<GeneratorMode>("random");
  const [excludeNumbers, setExcludeNumbers] = useState<number[]>([]);
  const [fixedNumbers, setFixedNumbers] = useState<number[]>([]);
  const [results, setResults] = useState<number[][]>([]);
  const [setCount, setSetCount] = useState(1);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

  const toggleNumber = (num: number, type: "exclude" | "fixed") => {
    if (type === "exclude") {
      setExcludeNumbers((prev) =>
        prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
      );
    } else {
      setFixedNumbers((prev) => {
        if (prev.includes(num)) return prev.filter((n) => n !== num);
        if (prev.length >= 5) return prev;
        return [...prev, num];
      });
    }
  };

  const generate = () => {
    const sets: number[][] = [];
    for (let i = 0; i < setCount; i++) {
      const nums = generateNumbers(mode, excludeNumbers, fixedNumbers);
      if (nums.length > 0) sets.push(nums);
    }
    setResults(sets);
    setSavedMessage(null);
  };

  const handleSave = (numbers: number[]) => {
    saveNumbers(numbers);
    setSavedMessage(`${numbers.join(", ")} 저장됨!`);
    setTimeout(() => setSavedMessage(null), 2000);
  };

  const handleShare = async (numbers: number[]) => {
    const text = `로또 번호: ${numbers.join(", ")}`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      setSavedMessage("클립보드에 복사됨!");
      setTimeout(() => setSavedMessage(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2">
        {(
          [
            ["random", "랜덤 생성"],
            ["exclude", "번호 제외"],
            ["fixed", "고정 번호"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === m
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Number Grid for exclude/fixed modes */}
      {mode !== "random" && (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            {mode === "exclude"
              ? "제외할 번호를 선택하세요 (선택한 번호는 생성에서 제외됩니다)"
              : "고정할 번호를 선택하세요 (최대 5개, 항상 포함됩니다)"}
          </p>
          <div className="flex flex-wrap gap-2">
            {allNumbers.map((num) => (
              <LottoBall
                key={num}
                number={num}
                size="sm"
                selected={
                  mode === "exclude"
                    ? excludeNumbers.includes(num)
                    : fixedNumbers.includes(num)
                }
                onClick={() =>
                  toggleNumber(num, mode === "exclude" ? "exclude" : "fixed")
                }
              />
            ))}
          </div>
          {mode === "exclude" && excludeNumbers.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {excludeNumbers.length}개 제외 중 (남은 번호: {45 - excludeNumbers.length}개)
            </p>
          )}
          {mode === "fixed" && fixedNumbers.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {fixedNumbers.length}개 고정됨
            </p>
          )}
        </div>
      )}

      {/* Set Count & Generate */}
      <div className="flex items-center gap-3">
        <select
          value={setCount}
          onChange={(e) => setSetCount(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value={1}>1세트</option>
          <option value={3}>3세트</option>
          <option value={5}>5세트</option>
        </select>
        <button
          onClick={generate}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition text-lg cursor-pointer"
        >
          번호 생성
        </button>
      </div>

      {/* Saved Message */}
      {savedMessage && (
        <div className="text-center text-sm text-green-600 font-medium">
          {savedMessage}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((nums, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {nums.map((num) => (
                    <LottoBall key={num} number={num} size="md" />
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSave(nums)}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => handleShare(nums)}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                  >
                    공유
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
