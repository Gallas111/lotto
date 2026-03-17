"use client";

import { getBallColor, getBallTextColor } from "@/lib/constants";

interface LottoBallProps {
  number: number;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-11 h-11 text-base",
  lg: "w-14 h-14 text-xl",
};

export default function LottoBall({
  number,
  size = "md",
  selected,
  onClick,
}: LottoBallProps) {
  const bg = getBallColor(number);
  const color = getBallTextColor(number);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${sizeMap[size]} rounded-full font-bold inline-flex items-center justify-center shadow-md transition-all ${
        onClick ? "cursor-pointer hover:scale-110" : "cursor-default"
      } ${selected ? "ring-3 ring-blue-500 scale-110" : ""}`}
      style={{ backgroundColor: bg, color }}
    >
      {number}
    </button>
  );
}
