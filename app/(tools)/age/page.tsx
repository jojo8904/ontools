import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { AgeCalculator } from './AgeCalculator'

export const metadata: Metadata = {
  title: '만 나이 계산기 - ontools',
  description: '생년월일만 입력하면 만 나이, 연 나이, 살아온 날수, 다음 생일까지 D-day를 한 번에 계산합니다. 2023년 만 나이 통일 기준.',
  keywords: ['만나이', '만나이계산기', '나이계산기', '연나이', '생일계산'],
}

export default function AgePage() {
  return (
    <ToolShell
      title="만 나이 계산기"
      description="생년월일로 만 나이·연 나이·살아온 날수·다음 생일 D-day를 계산합니다."
      breadcrumb="생활·유틸"
      current="/age"
    >
      <AgeCalculator />
    </ToolShell>
  )
}
