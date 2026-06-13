import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { FaqSection } from '@/components/FaqSection'
import { HourlyWageCalculator } from './HourlyWageCalculator'

const HOURLY_WAGE_FAQ = [
  { q: '시급을 월급으로 어떻게 환산하나요?', a: '주 근로시간에 주휴시간을 더한 월 환산시간(주 40시간이면 약 209시간)을 시급에 곱합니다.' },
  { q: '209시간은 어떻게 나오나요?', a: '(주 40시간 + 주휴 8시간) × 약 4.345주 ≈ 209시간입니다.' },
  { q: '결과가 실수령액인가요?', a: '아니요, 세전 기준입니다. 4대보험·세금 공제 후 실수령액은 연봉 계산기를 이용하세요.' },
]

export const metadata: Metadata = {
  title: '시급 ↔ 월급 환산기 - ontools',
  description: '시급을 월급·연봉으로, 월급을 시급으로 환산합니다. 주휴수당 포함(주 40시간 → 월 209시간) 기준. 알바·파트타임 급여 계산에 편리.',
  keywords: ['시급계산기', '월급환산', '시급 월급 변환', '주휴수당', '알바 급여'],
}

export default function HourlyWagePage() {
  return (
    <ToolShell
      title="시급 ↔ 월급 환산기"
      description="시급↔월급↔연봉을 주휴수당 포함 기준으로 환산합니다."
      breadcrumb="연봉·세금"
      current="/hourly-wage"
    >
      <HourlyWageCalculator />
      <FaqSection items={HOURLY_WAGE_FAQ} />
    </ToolShell>
  )
}
