import type { Metadata } from 'next'
import { FreelancerTaxCalculator } from './FreelancerTaxCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

export const metadata: Metadata = {
  title: '프리랜서 세금 계산기 (3.3%) - ontools',
  description: '프리랜서 원천징수 3.3% 세금을 계산하세요. 계약 금액에서 소득세 3%와 지방소득세 0.3%를 자동 계산합니다.',
  keywords: ['프리랜서세금', '3.3%계산기', '원천징수', '프리랜서소득세', '사업소득세'],
  openGraph: {
    title: '프리랜서 세금 계산기 (3.3%) - ontools',
    description: '프리랜서 원천징수 3.3% 세금을 계산하세요.',
    url: 'https://ontools.co.kr/freelancer-tax',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function FreelancerTaxPage() {
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
          <span className="text-foreground font-medium">프리랜서 세금 계산기 (3.3%)</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">프리랜서 세금 계산기 (3.3%)</h1>
          <p className="text-muted-foreground">계약 금액에서 원천징수 3.3%를 자동 계산하여 실수령액을 확인하세요.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <FreelancerTaxCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="freelancer-tax" />
            </div>
          </div>
          <aside className="space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">3.3% 원천징수란?</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>프리랜서(사업소득자)에게 대가를 지급할 때, 지급자가 소득세 3%와 지방소득세 0.3%를 미리 원천징수하여 국세청에 납부하는 제도입니다.</p>
                <p>프리랜서는 다음 해 5월 종합소득세 신고 시 이미 납부한 3.3%를 기납부세액으로 공제받을 수 있습니다.</p>
              </div>
            </section>
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">종합소득세 신고</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>프리랜서 수입이 연 2,400만원 이하이면 단순경비율 적용 가능. 필요경비를 공제하면 실제 세금이 줄어들거나 환급받을 수 있습니다.</p>
                <p>신고 기간: 매년 5월 1일 ~ 5월 31일 (성실신고 대상자는 6월 30일까지)</p>
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
