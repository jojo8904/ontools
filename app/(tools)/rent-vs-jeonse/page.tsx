import type { Metadata } from 'next'
import { RentVsJeonseCalculator } from './RentVsJeonseCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const RENT_JEONSE_GUIDE = [
  { h: '전세 vs 월세, 무엇이 유리할까?', p: ['전세는 큰 보증금을 맡기는 대신 월 임대료가 없고, 월세는 적은 보증금에 매달 임대료를 냅니다. 어느 쪽이 유리한지는 보증금을 다른 곳에 투자했을 때의 수익(기회비용)과 월세를 비교해 판단합니다.'] },
  { h: '비교 원리', p: ['전세는 "보증금 × 기대수익률(또는 대출이자율)"이 연간 비용이 되고, 월세는 "연 월세 + 월세보증금 × 기대수익률"이 연간 비용이 됩니다. 두 값을 비교해 더 적은 쪽이 유리합니다.'] },
  { h: '주의사항', p: ['결과는 가정한 금리·수익률에 따라 달라집니다. 전월세전환율, 대출 가능 여부, 보증금 안정성(전세사기 위험) 등도 함께 고려하세요.'] },
]

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
          <div className="lg:col-span-2">
            <RentVsJeonseCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="rent-vs-jeonse" />
            </div>
          </div>
          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">기회비용이란?</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>전세 보증금을 투자했을 때 얻을 수 있는 수익을 의미합니다. 전세가 월세보다 보증금이 크므로, 그 차액을 투자했을 때의 수익을 비교합니다.</p>
                <p>예: 3억 전세 보증금 × 연 3.5% = 연 1,050만원의 기회비용</p>
              </div>
            </section>
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">월세 세액공제</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>총급여 7,000만원 이하 무주택 세대주는 월세의 15~17% 세액공제 가능 (연 최대 750만원 한도).</p>
                <p>총급여 5,500만원 이하: 17% 공제</p>
                <p>총급여 5,500만~7,000만원: 15% 공제</p>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={RENT_JEONSE_GUIDE} />
        <RelatedTools current="/rent-vs-jeonse" />
      </main>
      <footer className="border-t mt-auto"><div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div></footer>
    </div>
  )
}
