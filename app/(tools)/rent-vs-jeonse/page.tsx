import type { Metadata } from 'next'
import { RentVsJeonseCalculator } from './RentVsJeonseCalculator'

export const metadata: Metadata = {
  title: '전세 vs 월세 비교 계산기 - ontools',
  description: '전세와 월세 중 어느 것이 유리한지 비교 계산하세요. 기회비용을 고려한 합리적인 주거 선택을 도와드립니다.',
  keywords: ['전세월세비교', '전세vs월세', '주거비계산', '전월세비교계산기', '기회비용'],
  openGraph: { title: '전세 vs 월세 비교 계산기 - ontools', description: '전세와 월세 비교 계산', url: 'https://ontools.co.kr/rent-vs-jeonse', siteName: 'ontools', type: 'website' },
}

export default function RentVsJeonsePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b"><div className="container mx-auto px-4 py-4"><a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"><img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" /><span className="text-xl font-bold">ontools</span></a></div></header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6"><a href="/" className="hover:text-foreground">홈</a>{' > '}<span className="text-foreground">금융</span>{' > '}<span className="text-foreground font-medium">전세 vs 월세 비교 계산기</span></div>
        <div className="mb-8"><h1 className="text-3xl font-bold mb-2">전세 vs 월세 비교 계산기</h1><p className="text-muted-foreground">기회비용을 고려하여 전세와 월세 중 어느 것이 유리한지 비교하세요.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2"><RentVsJeonseCalculator /></div>
          <aside className="space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">기회비용이란?</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>전세 보증금을 투자했을 때 얻을 수 있는 수익을 의미합니다. 전세가 월세보다 보증금이 크므로, 그 차액을 투자했을 때의 수익을 비교합니다.</p>
                <p>예: 3억 전세 보증금 × 연 3.5% = 연 1,050만원의 기회비용</p>
              </div>
            </section>
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">월세 세액공제</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>총급여 7,000만원 이하 무주택 세대주는 월세의 15~17% 세액공제 가능 (연 최대 750만원 한도).</p>
                <p>총급여 5,500만원 이하: 17% 공제</p>
                <p>총급여 5,500만~7,000만원: 15% 공제</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
      <footer className="border-t mt-auto"><div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div></footer>
    </div>
  )
}
