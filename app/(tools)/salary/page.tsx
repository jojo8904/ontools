import type { Metadata } from 'next'
import { SalaryCalculator } from './SalaryCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

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

        {/* Calculator + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <SalaryCalculator />
            <div className="mt-10">
              <YouTubeSection category="salary" />
            </div>
          </div>

          <aside className="space-y-8">
            {/* 4대보험 요율표 */}
            <section>
              <h2 className="text-xl font-bold mb-4">2026년 4대보험 요율표</h2>
              <p className="text-sm text-gray-500 mb-3">
                근로자 부담분 기준. 사업주도 동일 비율을 부담합니다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold">항목</th>
                      <th className="text-right py-2 font-semibold">요율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2 pr-4">국민연금</td>
                      <td className="py-2 text-right font-medium">4.5%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">건강보험</td>
                      <td className="py-2 text-right font-medium">3.545%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">장기요양보험</td>
                      <td className="py-2 text-right font-medium">0.4591%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">고용보험</td>
                      <td className="py-2 text-right font-medium">0.9%</td>
                    </tr>
                    <tr className="border-t-2 border-gray-200 font-bold">
                      <td className="py-2 pr-4">합계</td>
                      <td className="py-2 text-right">9.4041%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 소득세율 구간표 */}
            <section>
              <h2 className="text-xl font-bold mb-4">소득세율 구간표</h2>
              <p className="text-sm text-gray-500 mb-3">
                2026년 귀속 종합소득세 기준. 과세표준 구간별 세율입니다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold">과세표준</th>
                      <th className="text-right py-2 font-semibold">세율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2 pr-4">1,200만원 이하</td>
                      <td className="py-2 text-right font-medium">6%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">1,200만 ~ 4,600만</td>
                      <td className="py-2 text-right font-medium">15%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">4,600만 ~ 8,800만</td>
                      <td className="py-2 text-right font-medium">24%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">8,800만 ~ 1.5억</td>
                      <td className="py-2 text-right font-medium">35%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">1.5억 ~ 3억</td>
                      <td className="py-2 text-right font-medium">38%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">3억 ~ 5억</td>
                      <td className="py-2 text-right font-medium">40%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">5억 ~ 10억</td>
                      <td className="py-2 text-right font-medium">42%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">10억 초과</td>
                      <td className="py-2 text-right font-medium">45%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 연봉별 실수령액 비교표 */}
            <section>
              <h2 className="text-xl font-bold mb-4">연봉별 실수령액 비교표</h2>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">
                부양가족 1인(본인) 기준 월 실수령액 (근사치)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold">연봉</th>
                      <th className="text-right py-2 pr-4 font-semibold">월 실수령액</th>
                      <th className="text-right py-2 font-semibold">공제율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2 pr-4">3,000만원</td>
                      <td className="py-2 pr-4 text-right font-medium">~221만원</td>
                      <td className="py-2 text-right text-gray-500">~11.5%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">3,500만원</td>
                      <td className="py-2 pr-4 text-right font-medium">~255만원</td>
                      <td className="py-2 text-right text-gray-500">~12.5%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">4,000만원</td>
                      <td className="py-2 pr-4 text-right font-medium">~288만원</td>
                      <td className="py-2 text-right text-gray-500">~13.5%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">4,500만원</td>
                      <td className="py-2 pr-4 text-right font-medium">~320만원</td>
                      <td className="py-2 text-right text-gray-500">~14.5%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">5,000만원</td>
                      <td className="py-2 pr-4 text-right font-medium">~351만원</td>
                      <td className="py-2 text-right text-gray-500">~15.7%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">5,500만원</td>
                      <td className="py-2 pr-4 text-right font-medium">~381만원</td>
                      <td className="py-2 text-right text-gray-500">~16.8%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">6,000만원</td>
                      <td className="py-2 pr-4 text-right font-medium">~411만원</td>
                      <td className="py-2 text-right text-gray-500">~17.8%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">7,000만원</td>
                      <td className="py-2 pr-4 text-right font-medium">~469만원</td>
                      <td className="py-2 text-right text-gray-500">~19.6%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">8,000만원</td>
                      <td className="py-2 pr-4 text-right font-medium">~524만원</td>
                      <td className="py-2 text-right text-gray-500">~21.4%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">9,000만원</td>
                      <td className="py-2 pr-4 text-right font-medium">~578만원</td>
                      <td className="py-2 text-right text-gray-500">~22.9%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">1억원</td>
                      <td className="py-2 pr-4 text-right font-medium">~630만원</td>
                      <td className="py-2 text-right text-gray-500">~24.4%</td>
                    </tr>
                  </tbody>
                </table>
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
