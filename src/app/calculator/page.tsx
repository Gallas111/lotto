"use client";

import { useState } from "react";

const RANK_INFO = [
  { rank: 1, label: "1등", desc: "6개 번호 일치", avgPrize: "약 20~30억원" },
  { rank: 2, label: "2등", desc: "5개 + 보너스", avgPrize: "약 5,000만~1억원" },
  { rank: 3, label: "3등", desc: "5개 번호 일치", avgPrize: "약 150만원" },
  { rank: 4, label: "4등", desc: "4개 번호 일치", avgPrize: "5만원 (고정)" },
  { rank: 5, label: "5등", desc: "3개 번호 일치", avgPrize: "5,000원 (고정)" },
];

function calculateTax(amount: number) {
  if (amount <= 0) return { income: 0, resident: 0, total: 0, net: 0, rate: 0 };

  // 200만원 이하 비과세
  if (amount <= 2_000_000) {
    return { income: 0, resident: 0, total: 0, net: amount, rate: 0 };
  }

  let incomeTax = 0;

  if (amount <= 300_000_000) {
    // 3억 이하: 소득세 20%
    incomeTax = amount * 0.2;
  } else {
    // 3억 이하분 20% + 초과분 30%
    incomeTax = 300_000_000 * 0.2 + (amount - 300_000_000) * 0.3;
  }

  // 주민세 = 소득세의 10%
  const residentTax = incomeTax * 0.1;
  const totalTax = incomeTax + residentTax;
  const net = amount - totalTax;
  const rate = (totalTax / amount) * 100;

  return {
    income: Math.floor(incomeTax),
    resident: Math.floor(residentTax),
    total: Math.floor(totalTax),
    net: Math.floor(net),
    rate: Math.round(rate * 10) / 10,
  };
}

function formatKRW(n: number) {
  if (n === 0) return "0원";
  const eok = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  const rest = n % 10_000;
  let s = "";
  if (eok > 0) s += `${eok}억 `;
  if (man > 0) s += `${man.toLocaleString()}만 `;
  if (rest > 0) s += `${rest.toLocaleString()}`;
  return s.trim() + "원";
}

export default function CalculatorPage() {
  const [selectedRank, setSelectedRank] = useState<number | null>(null);
  const [amount, setAmount] = useState("");

  const numAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
  const result = calculateTax(numAmount);

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    setAmount(cleaned ? parseInt(cleaned).toLocaleString() : "");
  };

  const presets = [
    { label: "5,000원", value: 5000 },
    { label: "5만원", value: 50000 },
    { label: "150만원", value: 1500000 },
    { label: "1억원", value: 100000000 },
    { label: "10억원", value: 1000000000 },
    { label: "30억원", value: 3000000000 },
  ];

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          당첨금 세금 계산기
        </h1>
        <p className="text-gray-500 text-sm">
          로또 당첨금의 세금과 실수령액을 계산해보세요
        </p>
      </section>

      {/* 등수 선택 */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-gray-700 mb-3">
          당첨 등수 (참고)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {RANK_INFO.map((r) => (
            <button
              key={r.rank}
              onClick={() => setSelectedRank(r.rank)}
              className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                selectedRank === r.rank
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-bold text-sm">{r.label}</div>
              <div className="text-xs text-gray-500">{r.desc}</div>
              <div className="text-xs text-blue-500 mt-1">{r.avgPrize}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 금액 입력 */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-gray-700 mb-3">당첨금 입력</h2>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="당첨금을 입력하세요"
            className="w-full text-2xl font-bold text-gray-900 border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            원
          </span>
        </div>
        {numAmount > 0 && (
          <p className="text-sm text-gray-500 mt-2">{formatKRW(numAmount)}</p>
        )}

        {/* 빠른 입력 */}
        <div className="flex flex-wrap gap-2 mt-3">
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => setAmount(p.value.toLocaleString())}
              className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* 계산 결과 */}
      {numAmount > 0 && (
        <section className="space-y-4">
          {/* 실수령액 */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
            <p className="text-sm opacity-80 mb-1">실수령액</p>
            <p className="text-3xl sm:text-4xl font-black">
              {formatKRW(result.net)}
            </p>
            {result.rate > 0 && (
              <p className="text-sm opacity-80 mt-2">
                실효세율 {result.rate}%
              </p>
            )}
          </div>

          {/* 상세 내역 */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
            <h2 className="text-sm font-bold text-gray-700">세금 상세</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">총 당첨금</span>
                <span className="font-medium">
                  {numAmount.toLocaleString()}원
                </span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">소득세 (20~30%)</span>
                <span className="text-red-500 font-medium">
                  -{result.income.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">주민세 (소득세의 10%)</span>
                <span className="text-red-500 font-medium">
                  -{result.resident.toLocaleString()}원
                </span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">총 세금</span>
                <span className="text-red-600 font-bold">
                  -{result.total.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-bold">실수령액</span>
                <span className="text-blue-600 font-bold">
                  {result.net.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* 세율 안내 */}
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1">
            <p className="font-medium text-gray-600">세율 안내</p>
            <p>- 200만원 이하: 비과세</p>
            <p>- 200만원 초과 ~ 3억원 이하: 22% (소득세 20% + 주민세 2%)</p>
            <p>- 3억원 초과분: 33% (소득세 30% + 주민세 3%)</p>
          </div>
        </section>
      )}
    </div>
  );
}
