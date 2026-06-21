import type { Metadata } from 'next'
import { FreelancerTaxCalculator } from './FreelancerTaxCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'

const FREELANCER_GUIDE = [
  { h: '프리랜서 3.3% 원천징수란?', p: ['프리랜서·인적용역 사업소득자는 대금을 받을 때 소득세 3%와 지방소득세 0.3%(소득세의 10%)를 합한 3.3%를 떼고 받습니다. 이를 원천징수라고 합니다.'] },
  { h: '3.3% 떼면 끝일까?', p: ['아닙니다. 미리 떼인 3.3%는 일종의 선납이며, 다음 해 5월 종합소득세 신고로 최종 정산합니다. 경비가 많거나 소득이 적으면 환급받고, 소득이 크면 추가로 납부할 수 있습니다.'] },
  { h: '경비 처리와 절세', p: ['업무에 쓴 비용(필요경비)을 증빙과 함께 인정받으면 과세 대상 소득이 줄어 세금이 줄거나 환급이 늘어납니다. 영수증·계좌내역 등 증빙을 잘 보관하세요.'] },
  { h: '주의사항', p: ['본 계산기는 원천징수 금액 계산용입니다. 최종 세액은 연간 총소득·경비·공제에 따라 달라집니다.'] },
]

const FREELANCER_FAQ = [
  { q: '3.3%는 무엇인가요?', a: '사업소득 원천징수로, 소득세 3% + 지방소득세 0.3%(소득세의 10%)를 합한 비율입니다.' },
  { q: '3.3% 떼고 끝인가요?', a: '아닙니다. 다음해 5월 종합소득세 신고로 정산하며, 경비·공제에 따라 환급받거나 추가 납부할 수 있습니다.' },
  { q: '누가 3.3% 대상인가요?', a: '프리랜서·인적용역 사업소득자입니다. 4대보험에 가입하는 근로소득과는 과세 방식이 다릅니다.' },
]

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
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">3.3% 원천징수란?</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>프리랜서(사업소득자)에게 대가를 지급할 때, 지급자가 소득세 3%와 지방소득세 0.3%를 미리 원천징수하여 국세청에 납부하는 제도입니다.</p>
                <p>프리랜서는 다음 해 5월 종합소득세 신고 시 이미 납부한 3.3%를 기납부세액으로 공제받을 수 있습니다.</p>
              </div>
            </section>
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">종합소득세 신고</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>프리랜서 수입이 연 2,400만원 이하이면 단순경비율 적용 가능. 필요경비를 공제하면 실제 세금이 줄어들거나 환급받을 수 있습니다.</p>
                <p>신고 기간: 매년 5월 1일 ~ 5월 31일 (성실신고 대상자는 6월 30일까지)</p>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={FREELANCER_GUIDE} />
        <FaqSection items={FREELANCER_FAQ} />
        <RelatedTools current="/freelancer-tax" />
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div>
      </footer>
    </div>
  )
}
