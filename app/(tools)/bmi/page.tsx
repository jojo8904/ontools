import type { Metadata } from 'next'
import { BmiCalculator } from './BmiCalculator'
import { Card, CardContent } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'BMI 계산기 - ontools',
  description:
    'BMI(체질량지수) 계산기로 당신의 건강 상태를 확인하세요. 신장과 체중만 입력하면 BMI 지수, 체중 분류, 표준 체중 범위를 알 수 있습니다.',
  keywords: [
    'BMI계산기',
    '체질량지수',
    '비만도',
    '표준체중',
    '적정체중',
    '건강체중',
    'BMI',
    '체중관리',
  ],
  openGraph: {
    title: 'BMI 계산기 - ontools',
    description: 'BMI 지수로 당신의 건강 상태를 확인하세요.',
    url: 'https://ontools.com/bmi',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function BmiPage() {
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
          <span className="text-foreground">건강</span>
          {' > '}
          <span className="text-foreground font-medium">BMI 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">BMI 계산기</h1>
          <p className="text-muted-foreground">
            신장과 체중으로 BMI(체질량지수)를 계산하고 건강 상태를
            확인하세요.
          </p>
        </div>

        {/* Calculator Component */}
        <BmiCalculator />

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
            <a href="/currency">
              <Card className="hover:border-primary cursor-pointer transition-colors">
                <CardContent className="p-6">
                  <p className="font-medium">환율 계산기</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    실시간 환율로 통화 변환
                  </p>
                </CardContent>
              </Card>
            </a>
            <Card className="hover:border-primary cursor-pointer transition-colors">
              <CardContent className="p-6">
                <p className="font-medium">칼로리 계산기</p>
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
