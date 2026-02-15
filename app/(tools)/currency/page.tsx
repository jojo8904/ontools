import type { Metadata } from 'next'
import { CurrencyConverter } from './CurrencyConverter'
import { Card, CardContent } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: '환율 계산기 - ontools',
  description:
    '실시간 환율 정보로 원화, 달러, 엔화, 유로, 위안화를 간편하게 변환하세요. 한국수출입은행 환율 기준, 최신 환율 뉴스 제공.',
  keywords: [
    '환율계산기',
    '환율변환',
    '원달러환율',
    '달러환율',
    '엔화환율',
    '유로환율',
    '위안화환율',
    '실시간환율',
  ],
  openGraph: {
    title: '환율 계산기 - ontools',
    description: '실시간 환율로 통화를 간편하게 변환하세요.',
    url: 'https://ontools.com/currency',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function CurrencyPage() {
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
          <span className="text-foreground font-medium">환율 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">환율 계산기</h1>
          <p className="text-muted-foreground">
            실시간 환율 정보로 원화, 달러, 엔화, 유로, 위안화를 간편하게
            변환하세요.
          </p>
        </div>

        {/* Converter Component */}
        <CurrencyConverter />

        {/* Related Tools */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">관련 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/salary">
              <Card className="hover:border-primary cursor-pointer transition-colors">
                <CardContent className="p-6">
                  <p className="font-medium">연봉 실수령액 계산기</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    세금과 4대보험 제외한 실수령액 계산
                  </p>
                </CardContent>
              </Card>
            </a>
            <Card className="hover:border-primary cursor-pointer transition-colors">
              <CardContent className="p-6">
                <p className="font-medium">퇴직금 계산기</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Phase 4에서 제공 예정
                </p>
              </CardContent>
            </Card>
            <Card className="hover:border-primary cursor-pointer transition-colors">
              <CardContent className="p-6">
                <p className="font-medium">단위 변환기</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Phase 4에서 제공 예정
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
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
