import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { PyeongCalculator } from './PyeongCalculator'

export const metadata: Metadata = {
  title: '평수 ↔ ㎡ 변환기 - ontools',
  description: '평과 제곱미터(㎡)를 양방향으로 즉시 변환합니다. 아파트 면적, 부동산 평수 계산에 딱. 1평 = 3.3058㎡ 기준.',
  keywords: ['평수계산기', '평 제곱미터 변환', '㎡ 평 변환', '면적 계산', '아파트 평수'],
}

export default function PyeongPage() {
  return (
    <ToolShell
      title="평수 ↔ ㎡ 변환기"
      description="평과 제곱미터(㎡)를 양방향으로 변환합니다."
      breadcrumb="생활·유틸"
      current="/pyeong"
    >
      <PyeongCalculator />
    </ToolShell>
  )
}
