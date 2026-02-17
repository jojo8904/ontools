import type { Metadata } from 'next'
import Link from 'next/link'
import { NewsList } from '@/features/news/components/NewsList'
import { fetchNewsList } from '@/features/news/services/newsApi'
import type { News } from '@/types/news'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '최신 뉴스 - ontools',
  description: 'AI가 매칭한 도구 관련 최신 뉴스를 확인하세요.',
}

export default async function NewsPage() {
  let news: News[] = []
  try {
    const response = await fetchNewsList({
      limit: 100,
      sortBy: 'published_at',
    })
    news = response.data
  } catch {
    news = []
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#eee] sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-2xl font-bold tracking-tight text-[#111]">ontools</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/#tools" className="text-sm font-medium text-[#666] hover:text-[#111] transition-colors">
              도구
            </Link>
            <Link href="/news" className="text-sm font-medium text-[#111] transition-colors">
              뉴스
            </Link>
          </nav>
        </div>
      </header>

      {/* News Content */}
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-[2rem] font-[800] tracking-tight text-[#111] mb-8">최신 뉴스</h1>
          <NewsList news={news} title="" showCategories={true} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] mt-auto">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-[#888]">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
