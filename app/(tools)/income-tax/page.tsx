import type { Metadata } from 'next'
import { IncomeTaxCalculator } from './IncomeTaxCalculator'

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
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div>
      </footer>
    </div>
  )
}
