import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES } from '@/lib/guides'

export const metadata: Metadata = {
  title: '가이드 - ontools',
  description:
    'ontools 도구를 활용하는 방법과 생활·이미지·세금 관련 실용 가이드 모음. HEIC 변환, 사진 용량 줄이기, 배경 제거, 연봉 실수령액, 만 나이 등.',
  keywords: ['이미지 가이드', '사진 변환 방법', '계산기 사용법', 'ontools 가이드'],
  openGraph: {
    title: '가이드 - ontools',
    description: '도구 활용법과 생활 실용 가이드 모음.',
    url: 'https://ontools.co.kr/guide',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function GuideIndexPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold">ontools</span>
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">홈</a>
          {' > '}
          <span className="text-foreground font-medium">가이드</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">가이드</h1>
          <p className="text-muted-foreground">
            도구를 활용하는 방법과 생활·이미지·세금에 관한 실용 가이드를 모았습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guide/${g.slug}`}
              className="block rounded-xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-300 hover:bg-blue-50/30"
            >
              <span className="text-xs font-semibold text-blue-600">{g.category}</span>
              <h2 className="mt-1.5 text-lg font-bold text-gray-900 leading-snug">{g.title}</h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">{g.description}</p>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
