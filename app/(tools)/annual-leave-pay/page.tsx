
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { AnnualLeavePayCalculator } from './AnnualLeavePayCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const ANNUAL_LEAVE_GUIDE = [
  { h: '연차수당이란?', p: ['연차수당은 발생한 연차 유급휴가를 사용하지 못하고 퇴직하거나 휴가가 소멸할 때, 사용하지 못한 일수만큼 보상하는 수당입니다.'] },
  { h: '계산 방법', p: ['연차수당은 "1일 통상임금 × 미사용 연차일수"로 계산합니다. 1일 통상임금은 보통 "월 통상임금 ÷ 209시간 × 8시간"으로 구합니다.'] },
  { h: '주의사항', p: ['연차수당은 근로소득으로 급여에 합산되어 근로소득세가 부과됩니다. 통상임금 산정 항목은 사업장마다 다를 수 있으니, 정확한 금액은 회사 또는 노무 전문가에게 확인하세요.'] },
  {"h":"계산 예시: 월급 300만 원, 미사용 연차 7일","p":["연차수당은 하루 통상임금 × 미사용 일수입니다. 통상임금은 월급을 209시간으로 나눈 시급에 8시간을 곱해 구합니다. 300만 원 ÷ 209 = 14,354원, × 8 = 114,832원이 하루치입니다.","미사용 연차 7일이면 114,832 × 7 = 803,824원입니다. 상여금이나 식대가 통상임금에 들어가는 회사라면 이보다 커집니다.","통상임금에는 기본급과 매월 고정적으로 주는 수당(직책수당, 고정 식대 등)이 포함되고, 연장근로수당·성과급처럼 달마다 변하는 금액은 제외됩니다. 2024년 대법원 판결 이후 정기 상여금도 통상임금에 포함하는 회사가 많아졌습니다."]},
  {"h":"연차수당이 발생하는 시점","p":["연차는 발생일로부터 1년 안에 써야 하고, 못 쓴 연차는 그 1년이 지난 다음 날 수당 청구권이 생깁니다. 2025년 7월 1일에 15일이 생겼다면 2026년 6월 30일까지 쓰고, 남은 일수는 2026년 7월 1일에 수당으로 확정됩니다.","퇴사할 때는 발생했지만 쓰지 않은 연차 전부를 정산받습니다. 입사일 기준으로 다시 계산해 회계연도 방식으로 받은 것보다 많으면 차액까지 받습니다."]},
  {"h":"연차 촉진 제도: 수당을 못 받는 경우","p":["회사가 법에 정한 절차로 연차 사용을 촉진했는데도 쓰지 않았다면 수당 지급 의무가 없어집니다. 절차는 사용 기한 6개월 전에 남은 연차를 알리고 사용 시기를 정하라고 서면 통보하고, 그래도 안 정하면 2개월 전에 회사가 시기를 지정해 통보하는 것입니다.","구두 통보나 공지 게시만으로는 촉진으로 인정되지 않습니다. 이메일·서면 개별 통보가 있어야 하므로, 수당을 못 준다는 회사가 있다면 통보 기록을 확인하세요."]},
  {"h":"연차수당과 세금","p":["연차수당은 근로소득이라 소득세와 4대보험이 적용되고, 지급된 달의 급여에 합산되어 원천징수됩니다. 퇴사 시 받는 연차수당은 퇴직금의 평균임금 산정에 일부 포함되기도 합니다.","전년도 발생 연차의 미사용 수당은 퇴직 전 3개월 급여에 3개월분(연 수당 ÷ 12 × 3)이 포함되어 퇴직금을 조금 올립니다."]},
]

const EXTRA_FAQ = [
  {"q":"연차수당 계산에 상여금도 들어가나요?","a":"매월 또는 정기적으로 고정 지급되는 상여금은 통상임금에 포함되어 하루치 금액이 올라갑니다. 실적에 따라 달라지는 성과급은 제외됩니다. 회사 취업규칙과 최근 판례를 함께 확인하세요."},
  {"q":"1년 미만 근무자도 연차수당이 있나요?","a":"네. 입사 후 매월 개근하면 1일씩 생기는 연차(최대 11일)를 입사 1년이 되는 날까지 못 쓰면 수당으로 받습니다. 퇴사하면 남은 일수를 정산받습니다."},
  {"q":"회사가 연차를 쓰라고 했는데 못 썼어요. 수당 받나요?","a":"회사가 서면으로 6개월 전·2개월 전 절차를 지켜 촉진했다면 수당이 없습니다. 절차 중 하나라도 빠졌거나 구두로만 했다면 수당을 청구할 수 있습니다."},
  {"q":"5인 미만 사업장도 연차수당이 있나요?","a":"연차휴가 제도 자체가 5인 이상 사업장에 적용되므로, 5인 미만 사업장은 법정 연차와 연차수당 의무가 없습니다. 회사 규정으로 연차를 주는 경우 그 규정을 따릅니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/annual-leave-pay' },
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
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>{' > '}
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
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">연차 발생 기준</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p><strong>1년 미만:</strong> 1개월 개근 시 1일 (최대 11일)</p>
                <p><strong>1년 이상:</strong> 1년 80% 이상 출근 시 15일</p>
                <p><strong>3년 이상:</strong> 2년마다 1일 추가 (최대 25일)</p>
              </div>
            </section>
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">연차수당 계산 공식</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs">연차수당 = 1일 통상임금 × 미사용 연차 일수</p>
                <p>통상임금에는 기본급, 고정수당이 포함됩니다. 연장·야간·휴일근로수당 등 비고정적 수당은 제외됩니다.</p>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={ANNUAL_LEAVE_GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/annual-leave-pay" />
      </main>
      <SiteFooter />
    </div>
  )
}
