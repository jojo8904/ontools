import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-white">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <nav aria-label="사이트 정보" className="mb-3 flex flex-wrap justify-center gap-4">
          <Link href="/about">소개</Link><Link href="/privacy">개인정보처리방침</Link>
          <Link href="/terms">이용약관</Link><Link href="/contact">문의</Link>
        </nav>
        &copy; 2026 ontools. All rights reserved.
      </div>
    </footer>
  )
}
