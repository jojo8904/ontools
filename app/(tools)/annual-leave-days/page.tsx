
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
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
  {"h":"계산 예시: 2025년 3월 10일 입사자","p":["입사일 기준으로는 2025년 4월 10일부터 2026년 2월 10일까지 매월 개근 시 1일씩 11일이 생기고, 2026년 3월 10일에 15일이 한꺼번에 생깁니다. 2026년 안에 쓸 수 있는 연차는 최대 약 17일(1년 미만분 잔여 + 15일)입니다.","회계연도(1월 1일) 기준 회사라면 2026년 1월 1일에 2025년 재직일수 비례분 15 × (297 ÷ 365) ≈ 12.2일이 생기고, 2026년 1~2월 개근분 2일이 더해집니다. 2027년 1월 1일에 15일, 2028년 1월 1일에도 15일, 3년차 가산은 2028년부터입니다.","두 방식의 연도별 개수는 다르지만 퇴직 시 입사일 기준으로 정산하므로 총량은 같거나 회계연도 쪽이 많습니다."]},
  {"h":"근속에 따른 가산 연차표","p":["1년 이상 2년 미만 15일, 3년차 16일, 5년차 17일, 7년차 18일, 9년차 19일, 11년차 20일, 13년차 21일, 15년차 22일, 17년차 23일, 19년차 24일, 21년차 이상 25일입니다. 2년마다 1일씩 늘고 25일이 상한입니다.","가산 연차도 80% 이상 출근이 조건입니다. 출근율이 80% 미만이면 그해는 개근한 달에 1일씩만 생깁니다."]},
  {"h":"출근율 80% 계산에서 빠지는 날","p":["출산전후휴가, 육아휴직, 업무상 재해로 쉰 기간, 예비군·민방위 훈련일은 출근한 것으로 봅니다. 연차를 쓴 날도 출근으로 칩니다.","개인 질병으로 쉰 병가, 무단결근, 정직 기간은 결근으로 보거나 소정근로일에서 제외하는 방식이 회사마다 달라 취업규칙 확인이 필요합니다."]},
  {"h":"1년 계약직과 연차","p":["1년 계약이 끝나면서 퇴사하면 1년 미만 기간의 11일만 인정되고, 1년을 채운 날 생기는 15일은 발생하지 않습니다(대법원 2021년 판결). 15일을 받으려면 1년이 되는 날 이후에도 근로관계가 이어져야 합니다.","계약을 연장해 1년 하루라도 더 일하면 15일이 생기므로, 계약 만료일과 연차 발생일의 관계를 확인하세요."]},
]

const FAQ = [
  { q: '알바·계약직도 연차가 있나요?', a: '주 15시간 이상 근무하면 고용 형태와 무관하게 연차가 발생합니다. 1년 미만은 1개월 개근마다 1일씩입니다.' },
  { q: '1년 딱 채우고 퇴사하면 연차는 몇 개인가요?', a: '1년 미만 기간의 최대 11일에 더해, 1년을 채운 시점에 15일이 발생한다는 것이 대법원 판례(만 1년+1일 근무 시)입니다. 퇴사 시점에 따라 달라질 수 있으니 정확한 산정은 회사·노무사와 확인하세요.' },
  { q: '연차를 다 못 쓰면 어떻게 되나요?', a: '회사가 연차사용촉진을 적법하게 하지 않았다면 미사용분은 연차수당으로 지급받을 수 있습니다.' },
  {"q":"입사 첫 달에 연차를 쓸 수 있나요?","a":"법적으로는 한 달을 개근해야 첫 1일이 생기므로 입사 첫 달에는 없습니다. 회사가 선지급하거나 다음 달 연차를 당겨 쓰게 해주는 것은 회사 재량입니다."},
  {"q":"반차·반반차도 연차에서 빠지나요?","a":"법은 '일' 단위로 정하지만 회사가 취업규칙으로 반차(0.5일)나 시간 단위 연차를 허용할 수 있습니다. 쓴 시간만큼 비례해 차감하는 것이 보통입니다."},
  {"q":"연차를 다음 해로 이월할 수 있나요?","a":"법정 연차는 발생 후 1년 안에 써야 하고 이월은 의무가 아닙니다. 못 쓴 연차는 수당으로 받거나(촉진 절차가 없을 때), 회사 규정으로 이월을 허용하기도 합니다."},
  {"q":"주 4일 근무자는 연차가 적나요?","a":"주 40시간 미만 단시간 근로자는 통상 근로자의 연차 일수에 비례해 시간 단위로 받습니다. 주 32시간이면 15일 × (32 ÷ 40) × 8시간 = 96시간, 하루 8시간 기준 12일입니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/annual-leave-days' },
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
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
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
                <p><Link href="/annual-leave-pay" className="font-semibold text-blue-700 hover:underline">연차 수당 계산기</Link> — 못 쓴 연차, 돈으로 얼마?</p>
                <p><Link href="/severance-pay" className="font-semibold text-blue-700 hover:underline">퇴직금 계산기</Link> — 퇴사 전 필수 확인</p>
                <p><Link href="/salary" className="font-semibold text-blue-700 hover:underline">연봉 실수령액 계산기</Link></p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <FaqSection items={FAQ} />
        <RelatedTools current="/annual-leave-days" />
      </main>

      <SiteFooter />
    </div>
  )
}
