import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900">
          Lotto<span className="text-blue-500">6</span>/45
        </Link>
        <nav className="flex gap-4 text-sm font-medium text-gray-600">
          <Link href="/generator/" className="hover:text-blue-500 transition">
            생성기
          </Link>
          <Link href="/stats/" className="hover:text-blue-500 transition">
            통계
          </Link>
          <Link href="/saved/" className="hover:text-blue-500 transition">
            저장함
          </Link>
        </nav>
      </div>
    </header>
  );
}
