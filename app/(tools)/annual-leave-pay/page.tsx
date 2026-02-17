import type { Metadata } from 'next'
import { AnnualLeavePayCalculator } from './AnnualLeavePayCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

export const metadata: Metadata = {
  title: '연차 수당 계산기 - ontools',
  description: '미사용 연차에 대한 연차수당을 계산하세요. 1일 통상임금과 미사용 연차 일수를 입력하면 자동 계산됩니다.',
  keywords: ['연차수당계산기', '미사용연차', '연차수당', '통상임금', '연차보상'],
  openGraph: {
    title: '연차 수당 계산기 - ontools',
    description: '미사용 연차에 대한 연차수당을 계산하세요.',
    url: 'https://ontools.co.kr/annual-leave-pay',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function AnnualLeavePayPage() {
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
          <span className="text-foreground font-medium">연차 수당 계산기</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">연차 수당 계산기</h1>
          <p className="text-muted-foreground">미사용 연차에 대한 연차수당을 계산하세요.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <AnnualLeavePayCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="annual-leave-pay" />
            </div>
          </div>
          <aside className="space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">연차 발생 기준</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p><strong>1년 미만:</strong> 1개월 개근 시 1일 (최대 11일)</p>
                <p><strong>1년 이상:</strong> 1년 80% 이상 출근 시 15일</p>
                <p><strong>3년 이상:</strong> 2년마다 1일 추가 (최대 25일)</p>
              </div>
            </section>
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">연차수당 계산 공식</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs">연차수당 = 1일 통상임금 × 미사용 연차 일수</p>
                <p>통상임금에는 기본급, 고정수당이 포함됩니다. 연장·야간·휴일근로수당 등 비고정적 수당은 제외됩니다.</p>
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
