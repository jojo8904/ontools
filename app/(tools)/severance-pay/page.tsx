import type { Metadata } from 'next'
import { SeveranceCalculator } from './SeveranceCalculator'
import { NewsSidebar } from '@/features/news/components/NewsSidebar'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

export const metadata: Metadata = {
  title: '퇴직금 계산기 - ontools',
  description:
    '입사일, 퇴사일, 월 평균임금을 입력하면 근로기준법에 따른 퇴직금을 계산합니다. 1일 평균임금, 재직일수 기반 정확한 퇴직금 산정.',
  keywords: [
    '퇴직금계산기',
    '퇴직금',
    '퇴직금계산',
    '퇴직금산정',
    '1일평균임금',
    '근로기준법',
    '퇴직금지급',
    '퇴직소득',
  ],
  openGraph: {
    title: '퇴직금 계산기 - ontools',
    description: '입사일, 퇴사일, 월 평균임금으로 퇴직금을 간편하게 계산하세요.',
    url: 'https://ontools.com/severance-pay',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function SeverancePayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-xl font-bold hover:text-primary">
            ontools
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">
            홈
          </a>
          {' > '}
          <span className="text-foreground">금융</span>
          {' > '}
          <span className="text-foreground font-medium">퇴직금 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">퇴직금 계산기</h1>
          <p className="text-muted-foreground">
            근로기준법 기준. 입사일, 퇴사일, 월 평균임금으로 퇴직금을
            계산합니다.
          </p>
        </div>

        {/* Calculator Component */}
        <SeveranceCalculator />

        {/* Bottom Sections */}
        <div className="mt-12 space-y-10">
          <NewsSidebar toolId="severance" title="관련 뉴스" />
          <YouTubeSection category="severance" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
