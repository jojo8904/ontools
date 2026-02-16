import type { Metadata } from 'next'
import { ElectricityCalculator } from './ElectricityCalculator'

export const metadata: Metadata = {
  title: '전기요금 계산기 - ontools',
  description:
    '한국전력 주택용 전기요금 누진제 기준. 사용량(kWh)으로 예상 요금 계산, 금액으로 사용량 역계산. 기본료, 전력량요금, 부가세, 전력산업기반기금 포함.',
  keywords: [
    '전기요금계산기',
    '전기요금',
    '전기세',
    '누진제',
    '전력량요금',
    '한국전력',
    'kWh',
    '전기요금누진',
  ],
  openGraph: {
    title: '전기요금 계산기 - ontools',
    description: '전기 사용량으로 예상 요금 계산, 금액으로 사용량 역계산.',
    url: 'https://ontools.com/electricity',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ElectricityPage() {
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
          <span className="text-foreground font-medium">전기요금 계산기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">전기요금 계산기</h1>
          <p className="text-muted-foreground">
            한국전력 주택용 누진제 기준. 사용량으로 요금 계산, 금액으로 사용량
            역계산을 지원합니다.
          </p>
        </div>

        <ElectricityCalculator />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
