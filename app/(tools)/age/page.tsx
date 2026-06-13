import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { FaqSection } from '@/components/FaqSection'
import { AgeCalculator } from './AgeCalculator'

const AGE_FAQ = [
  { q: '만 나이는 어떻게 계산하나요?', a: '생일이 지났으면 (올해 − 출생연도), 아직 안 지났으면 거기서 1을 뺍니다. 2023년 6월부터 법적·사회적 나이가 만 나이로 통일됐습니다.' },
  { q: '만 나이와 연 나이의 차이는?', a: '연 나이는 단순히 올해 연도에서 출생연도를 뺀 값이고, 만 나이는 생일 경과 여부까지 반영한 값입니다.' },
  { q: '모든 나이가 만 나이 기준인가요?', a: '대부분 만 나이를 쓰지만, 일부(예: 청소년보호법의 연 나이 적용)는 예외가 있습니다.' },
]

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
      <FaqSection items={AGE_FAQ} />
    </ToolShell>
  )
}
