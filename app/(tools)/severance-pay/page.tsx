import type { Metadata } from 'next'
import { SeveranceCalculator } from './SeveranceCalculator'
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
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold">ontools</span>
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

        {/* Calculator + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <SeveranceCalculator />
            <div className="mt-10">
              <YouTubeSection category="severance" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 퇴직금 계산 방법 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">퇴직금 계산 방법</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">기본 공식</h3>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs">
                    퇴직금 = 1일 평균임금 x 30일 x (재직일수 / 365)
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">1일 평균임금 산정</h3>
                  <p>퇴직 전 3개월간 지급된 임금 총액을 해당 기간의 총 일수로 나눕니다. 상여금, 연차수당 등도 포함됩니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">지급 조건</h3>
                  <p>1년 이상 근무한 근로자에게 지급됩니다. 주 15시간 미만 단시간 근로자는 제외됩니다. 퇴직일로부터 14일 이내에 지급해야 합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">포함 임금 항목</h3>
                  <p>기본급, 고정 수당, 상여금(정기), 연차수당이 포함됩니다. 실비 변상적 급여(식대, 교통비 등)는 회사 규정에 따라 다를 수 있습니다.</p>
                </div>
              </div>
            </section>

            {/* 퇴직소득세 계산법 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">퇴직소득세 계산법</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">계산 순서</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>퇴직급여액에서 근속연수공제를 차감</li>
                    <li>환산급여 산출 (공제 후 금액 x 12 / 근속연수)</li>
                    <li>환산급여에 환산급여공제 적용</li>
                    <li>산출세액 계산 후 근속연수로 환산</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">근속연수공제</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-1.5 pr-3 font-semibold">근속연수</th>
                          <th className="text-right py-1.5 font-semibold">공제액</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-1.5 pr-3">5년 이하</td>
                          <td className="py-1.5 text-right">30만원 x 근속연수</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">5~10년</td>
                          <td className="py-1.5 text-right">150만 + 50만 x (근속-5)</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">10~20년</td>
                          <td className="py-1.5 text-right">400만 + 80만 x (근속-10)</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">20년 초과</td>
                          <td className="py-1.5 text-right">1,200만 + 120만 x (근속-20)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">절세 팁</h3>
                  <p>퇴직금을 IRP(개인형 퇴직연금)로 이전하면 퇴직소득세가 이연되며, 연금으로 수령 시 퇴직소득세의 60~70%만 부과됩니다.</p>
                </div>
              </div>
            </section>
          </aside>
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
