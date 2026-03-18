"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/generator/", label: "생성기" },
  { href: "/stats/", label: "통계" },
  { href: "/calculator/", label: "계산기" },
  { href: "/simulator/", label: "시뮬레이터" },
  { href: "/saved/", label: "저장함" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900 shrink-0">
          로또<span className="text-blue-500">한판</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-3 text-sm font-medium text-gray-600">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-blue-500 transition ${
                pathname === item.href || pathname === item.href.slice(0, -1)
                  ? "text-blue-500"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden p-2 text-gray-600 hover:text-gray-900 transition cursor-pointer"
          aria-label="메뉴"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="sm:hidden border-t border-gray-100 bg-white">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 text-sm font-medium transition ${
                pathname === item.href || pathname === item.href.slice(0, -1)
                  ? "text-blue-500 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
