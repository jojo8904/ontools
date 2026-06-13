import type { Metadata } from 'next'
import { IncomeTaxCalculator } from './IncomeTaxCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'

const INCOME_TAX_GUIDE = [
  { h: '종합소득세란?', p: ['종합소득세는 1년간 발생한 종합소득(사업·프리랜서·임대·이자·배당·근로 외 소득 등)을 합산해 부과하는 세금으로, 매년 5월에 신고·납부합니다.'] },
  { h: '세율과 계산 구조', p: ['과세표준(소득에서 각종 공제를 뺀 금액)에 6%~45%의 누진세율을 적용하고, 산출세액에 지방소득세 10%가 더해집니다. 누진공제액을 빼는 방식으로 간편하게 계산할 수 있습니다.'] },
  { h: '절세 팁', p: ['필요경비를 빠짐없이 반영하고, 소득공제·세액공제(연금저축, 노란우산공제 등)를 활용하면 세금을 줄일 수 있습니다. 5월 신고를 놓치면 무신고가산세가 부과되니 기한을 지키세요.'] },
  { h: '주의사항', p: ['본 계산기는 과세표준 기준 근사치입니다. 실제 세액은 소득 종류·공제 항목에 따라 달라지므로 정확한 신고는 홈택스 또는 세무사를 통해 확인하세요.'] },
]

const INCOME_TAX_FAQ = [
  { q: '종합소득세는 누가 내나요?', a: '사업·프리랜서·임대·금융 등 종합소득이 있는 사람이 매년 5월에 신고·납부합니다.' },
  { q: '세율은 어떻게 되나요?', a: '과세표준에 따라 6%~45%의 누진세율이 적용되며, 여기에 지방소득세 10%가 추가됩니다.' },
  { q: '계산 결과가 실제와 다를 수 있나요?', a: '각종 소득공제·세액공제·필요경비에 따라 달라집니다. 본 계산기는 과세표준 기준 근사치이니 참고용으로 활용하세요.' },
]

export const metadata: Metadata = {
  title: '종합소득세 계산기 - ontools',
  description: '종합소득세를 간편하게 계산하세요. 2025년 기준 세율 구간 적용, 소득공제 반영, 지방소득세 포함.',
  keywords: ['종합소득세계산기', '소득세', '세율구간', '종소세', '소득세신고'],
  openGraph: {
    title: '종합소득세 계산기 - ontools',
    description: '종합소득세를 간편하게 계산하세요.',
    url: 'https://ontools.co.kr/income-tax',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function IncomeTaxPage() {
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
          <a href="/" className="hover:text-foreground">홈</a>{' > '}
          <span className="text-foreground">급여/세금</span>{' > '}
          <span className="text-foreground font-medium">종합소득세 계산기</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">종합소득세 계산기</h1>
          <p className="text-muted-foreground">총 수입금액과 공제액을 입력하면 예상 종합소득세를 계산합니다.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <IncomeTaxCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="income-tax" />
            </div>
          </div>
          <aside className="space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">종합소득세 세율 (2025)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-1.5 pr-2 font-semibold">과세표준</th>
                      <th className="text-right py-1.5 font-semibold">세율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600">
                    <tr><td className="py-1.5 pr-2">~1,400만</td><td className="py-1.5 text-right">6%</td></tr>
                    <tr><td className="py-1.5 pr-2">~5,000만</td><td className="py-1.5 text-right">15%</td></tr>
                    <tr><td className="py-1.5 pr-2">~8,800만</td><td className="py-1.5 text-right">24%</td></tr>
                    <tr><td className="py-1.5 pr-2">~1.5억</td><td className="py-1.5 text-right">35%</td></tr>
                    <tr><td className="py-1.5 pr-2">~3억</td><td className="py-1.5 text-right">38%</td></tr>
                    <tr><td className="py-1.5 pr-2">~5억</td><td className="py-1.5 text-right">40%</td></tr>
                    <tr><td className="py-1.5 pr-2">~10억</td><td className="py-1.5 text-right">42%</td></tr>
                    <tr><td className="py-1.5 pr-2">10억 초과</td><td className="py-1.5 text-right">45%</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">신고 기간</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>매년 5월 1일 ~ 5월 31일 (성실신고확인 대상자는 6월 30일)</p>
                <p>홈택스(hometax.go.kr)에서 전자신고 가능</p>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={INCOME_TAX_GUIDE} />
        <FaqSection items={INCOME_TAX_FAQ} />
        <RelatedTools current="/income-tax" />
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div>
      </footer>
    </div>
  )
}
