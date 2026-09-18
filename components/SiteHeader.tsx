import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-gray-900">
          <img src="/mascot.png" alt="" width={40} height={40} className="rounded-full" />
          <span className="text-xl">ontools</span>
        </Link>
        <nav aria-label="주 메뉴" className="flex gap-5 text-sm text-gray-600">
          <Link href="/">도구</Link><Link href="/games">게임</Link><Link href="/guide">가이드</Link>
        </nav>
      </div>
    </header>
  )
}
