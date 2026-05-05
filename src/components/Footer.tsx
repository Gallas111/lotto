import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-sm text-gray-400">
        <p>본 사이트는 로또 당첨을 보장하지 않으며, 오락 목적으로만 제공됩니다.</p>
        <p className="mt-1">당첨번호 데이터 출처: 동행복권</p>
        <p className="mt-3">
          <Link href="/privacy/" className="hover:text-gray-600 underline-offset-2 hover:underline">
            개인정보처리방침
          </Link>
          <span className="mx-2 text-gray-300">·</span>
          <Link href="/terms/" className="hover:text-gray-600 underline-offset-2 hover:underline">
            이용약관
          </Link>
        </p>
        <p className="mt-1">&copy; {new Date().getFullYear()} 로또한판 (lottohanpan.com)</p>
      </div>
    </footer>
  );
}
