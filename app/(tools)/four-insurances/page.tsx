import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'
import { FourInsurancesCalculator } from './FourInsurancesCalculator'

export const metadata: Metadata = {
  title: '4대보험 계산기 - ontools',
  description: '월 급여를 입력하면 국민연금·건강보험·장기요양·고용보험 등 4대보험 근로자 부담액을 계산합니다. 2026년 요율.',
  keywords: ['4대보험계산기', '4대보험', '국민연금', '건강보험', '고용보험'],
}

const GUIDE = [
  { h: '4대보험이란?', p: ['4대보험은 국민연금, 건강보험, 장기요양보험, 고용보험을 말합니다. 일정 요건의 사업장에서 일하면 의무 가입이며, 보험료는 근로자와 사업주가 나눠 부담합니다.'] },
  { h: '요율 (근로자 부담)', p: ['국민연금 4.5%, 건강보험 3.545%, 장기요양보험은 건강보험료의 12.95%, 고용보험 0.9%입니다. 국민연금과 건강보험은 사업주도 같은 비율을 부담하고, 고용보험은 사업주가 조금 더 냅니다(고용안정·직업능력개발 부담).'] },
  { h: '주의사항', p: ['국민연금은 기준소득월액 상한이 있어 일정 급여 이상은 더 늘지 않습니다. 실제 보험료는 보수월액 신고·연말정산에 따라 달라질 수 있습니다.'] },
]

const FAQ = [
  { q: '사업주도 같은 금액을 내나요?', a: '국민연금·건강보험은 사업주도 동일 비율을 부담합니다. 고용보험은 사업주가 고용안정 등 항목으로 조금 더 냅니다. 산재보험은 전액 사업주 부담입니다.' },
  { q: '국민연금 상한이 있나요?', a: '네. 기준소득월액 상한이 있어, 그 이상 급여라도 국민연금 보험료는 더 오르지 않습니다.' },
]

export default function FourInsurancesPage() {
  return (
    <ToolShell title="4대보험 계산기" description="월 급여 기준 4대보험 근로자 부담액을 계산합니다." breadcrumb="연봉·세금" current="/four-insurances">
      <FourInsurancesCalculator />
      <ToolGuide sections={GUIDE} />
      <FaqSection items={FAQ} />
    </ToolShell>
  )
}
