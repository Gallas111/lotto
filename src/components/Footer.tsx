export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-sm text-gray-400">
        <p>본 사이트는 로또 당첨을 보장하지 않으며, 오락 목적으로만 제공됩니다.</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} Lotto6/45 번호 생성기</p>
      </div>
    </footer>
  );
}
