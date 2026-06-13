import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { HourlyWageCalculator } from './HourlyWageCalculator'

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
    </ToolShell>
  )
}
