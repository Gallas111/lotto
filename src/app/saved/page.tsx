"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LottoBall from "@/components/LottoBall";
import {
  getSavedNumbers,
  deleteSavedNumbers,
  clearAllSaved,
  type SavedSet,
} from "@/lib/storage";

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedSet[]>([]);

  useEffect(() => {
    setSaved(getSavedNumbers());
  }, []);

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
          <div className="flex justify-end">
            <button
              onClick={handleClearAll}
              className="text-xs text-red-400 hover:text-red-500 transition cursor-pointer"
            >
              전체 삭제
            </button>
          </div>
          <div className="space-y-3">
            {saved.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <div className="flex gap-2 mb-1">
                    {entry.numbers.map((num) => (
                      <LottoBall key={num} number={num} size="sm" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{entry.date}</span>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-xs text-gray-400 hover:text-red-500 transition cursor-pointer"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
