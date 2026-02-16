import type { Metadata } from 'next'
import { DdayCalculator } from './DdayCalculator'

export const metadata: Metadata = {
  title: 'D-day 계산기 - ontools',
  description:
    '목표 날짜까지 남은 일수 카운트다운, 두 날짜 사이 일수 계산. D-day를 간편하게 확인하세요.',
  keywords: [
    'D-day',
    '디데이',
    '디데이계산기',
    '날짜계산',
    '남은일수',
    '기간계산',
    '날짜간격',
    '카운트다운',
  ],
  openGraph: {
    title: 'D-day 계산기 - ontools',
    description: '목표 날짜까지 남은 일수, 두 날짜 사이 기간을 간편하게 계산하세요.',
    url: 'https://ontools.com/d-day',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function DdayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-xl font-bold hover:text-primary">
            ontools
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">
            홈
          </a>
          {' > '}
          <span className="text-foreground">유틸리티</span>
          {' > '}
          <span className="text-foreground font-medium">D-day 계산기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">D-day 계산기</h1>
          <p className="text-muted-foreground">
            목표 날짜까지 남은 일수 카운트다운, 두 날짜 사이 일수를 계산합니다.
          </p>
        </div>

        <DdayCalculator />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
