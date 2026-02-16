import type { Metadata } from 'next'
import { SalaryCalculator } from './SalaryCalculator'

export const metadata: Metadata = {
  title: '연봉 실수령액 계산기 - ontools',
  description:
    '2026년 최신 세율 적용. 연봉, 부양가족 수 입력으로 세금과 4대보험을 제외한 실수령액을 계산하세요. 최저임금, 연말정산 뉴스 제공.',
  keywords: [
    '연봉계산기',
    '실수령액',
    '세금계산',
    '4대보험',
    '국민연금',
    '건강보험',
    '소득세',
    '월급계산',
  ],
  openGraph: {
    title: '연봉 실수령액 계산기 - ontools',
    description: '연봉에서 세금 제외한 실수령액을 간편하게 계산하세요.',
    url: 'https://ontools.com/salary',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function SalaryCalculatorPage() {
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
          <span className="text-foreground font-medium">
            연봉 실수령액 계산기
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">연봉 실수령액 계산기</h1>
          <p className="text-muted-foreground">
            2026년 최신 세율 적용. 연봉에서 세금과 4대보험을 제외한 실수령액을
            계산합니다.
          </p>
        </div>

        {/* Calculator Component */}
        <SalaryCalculator />

      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
