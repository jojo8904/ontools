import type { Metadata } from 'next'
import { AnnualLeaveDaysCalculator } from './AnnualLeaveDaysCalculator'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '연차는 어떻게 발생하나요?',
    p: [
      '근로기준법상 1년 미만 근로자는 1개월 개근 시 1일씩(최대 11일), 1년 이상 근무하고 80% 이상 출근하면 15일의 연차가 발생합니다.',
      '3년 이상 근속부터는 2년마다 1일씩 늘어나 최대 25일까지 발생합니다. 예: 만 1~2년 15일, 만 3~4년 16일, 만 5~6년 17일….',
    ],
  },
  {
    h: '입사일 기준 vs 회계연도 기준',
    p: [
      '법은 입사일 기준이 원칙이지만, 관리 편의상 회계연도(1월 1일) 기준으로 일괄 부여하는 회사도 많습니다. 이 경우 입사 첫해에는 비례 부여되어 이 계산기와 다를 수 있습니다.',
      '퇴사 시점에는 입사일 기준으로 다시 정산해, 회계연도 기준으로 부여받은 것이 법정 기준보다 적으면 그 차이를 보전받을 수 있습니다.',
    ],
  },
  {
    h: '알아두면 좋은 것',
    p: [
      '연차는 발생일로부터 1년 안에 사용하는 것이 원칙이며, 회사가 사용촉진 절차를 지키지 않아 못 쓴 연차는 수당으로 받을 수 있습니다.',
      '미사용 연차의 수당 금액은 "연차 수당 계산기"로 확인해 보세요.',
    ],
  },
]

const FAQ = [
  { q: '알바·계약직도 연차가 있나요?', a: '주 15시간 이상 근무하면 고용 형태와 무관하게 연차가 발생합니다. 1년 미만은 1개월 개근마다 1일씩입니다.' },
  { q: '1년 딱 채우고 퇴사하면 연차는 몇 개인가요?', a: '1년 미만 기간의 최대 11일에 더해, 1년을 채운 시점에 15일이 발생한다는 것이 대법원 판례(만 1년+1일 근무 시)입니다. 퇴사 시점에 따라 달라질 수 있으니 정확한 산정은 회사·노무사와 확인하세요.' },
  { q: '연차를 다 못 쓰면 어떻게 되나요?', a: '회사가 연차사용촉진을 적법하게 하지 않았다면 미사용분은 연차수당으로 지급받을 수 있습니다.' },
]

export const metadata: Metadata = {
  title: '연차 개수 계산기 (입사일 기준) - ontools',
  description:
    '입사일만 넣으면 지금 내 연차가 며칠인지 계산합니다. 1년 미만 월 1일 발생, 1년 이상 15일+2년마다 1일(최대 25일). 근로기준법 기준.',
  keywords: ['연차 계산기', '연차 개수', '입사일 연차', '연차 발생 기준', '1년 연차', '연차 계산', '알바 연차'],
  openGraph: {
    title: '연차 개수 계산기 (입사일 기준) - ontools',
    description: '입사일로 내 연차 일수 바로 확인. 근로기준법 기준.',
    url: 'https://ontools.co.kr/annual-leave-days',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function AnnualLeaveDaysPage() {
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
          <a href="/" className="hover:text-foreground">홈</a>
          {' > '}
          <span className="text-foreground">연봉·세금</span>
          {' > '}
          <span className="text-foreground font-medium">연차 개수 계산기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">연차 개수 계산기</h1>
          <p className="text-muted-foreground">
            입사일만 넣으면 지금 내 연차가 며칠인지 근로기준법 기준으로 계산합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <AnnualLeaveDaysCalculator />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">근속연수별 연차일수</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold">근속</th>
                      <th className="text-right py-2 font-semibold">연차</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="py-1.5 pr-4">1년 미만</td><td className="py-1.5 text-right font-medium">월 1일 (최대 11일)</td></tr>
                    <tr><td className="py-1.5 pr-4">만 1~2년</td><td className="py-1.5 text-right font-medium">15일</td></tr>
                    <tr><td className="py-1.5 pr-4">만 3~4년</td><td className="py-1.5 text-right font-medium">16일</td></tr>
                    <tr><td className="py-1.5 pr-4">만 5~6년</td><td className="py-1.5 text-right font-medium">17일</td></tr>
                    <tr><td className="py-1.5 pr-4">만 7~8년</td><td className="py-1.5 text-right font-medium">18일</td></tr>
                    <tr><td className="py-1.5 pr-4">만 9~10년</td><td className="py-1.5 text-right font-medium">19일</td></tr>
                    <tr><td className="py-1.5 pr-4">만 15~16년</td><td className="py-1.5 text-right font-medium">22일</td></tr>
                    <tr><td className="py-1.5 pr-4">만 21년 이상</td><td className="py-1.5 text-right font-medium">25일 (최대)</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">함께 보면 좋아요</h2>
              <div className="space-y-2 text-sm leading-relaxed">
                <p><a href="/annual-leave-pay" className="font-semibold text-blue-700 hover:underline">연차 수당 계산기</a> — 못 쓴 연차, 돈으로 얼마?</p>
                <p><a href="/severance-pay" className="font-semibold text-blue-700 hover:underline">퇴직금 계산기</a> — 퇴사 전 필수 확인</p>
                <p><a href="/salary" className="font-semibold text-blue-700 hover:underline">연봉 실수령액 계산기</a></p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <FaqSection items={FAQ} />
        <RelatedTools current="/annual-leave-days" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
