import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'
import { PyeongCalculator } from './PyeongCalculator'

const PYEONG_GUIDE = [
  { h: '평과 제곱미터(㎡)', p: ['1평은 약 3.3058㎡입니다. 부동산 면적은 법적으로 ㎡로 표기하지만, 실생활에서는 평으로 가늠하는 경우가 많아 변환이 자주 필요합니다.'] },
  { h: '공급면적 vs 전용면적', p: ['아파트 "분양 평수"는 보통 공급면적(전용면적 + 주거공용면적) 기준이라, 실제 사용하는 전용면적은 그보다 작습니다. 예를 들어 "34평"이라도 전용면적은 약 25~26평 수준인 경우가 많습니다.'] },
  { h: '활용', p: ['아파트·상가 면적 비교, 가구 배치, 부동산 매물 비교 시 평↔㎡ 변환으로 감을 잡을 수 있습니다.'] },
]

const PYEONG_FAQ = [
  { q: '1평은 몇 ㎡인가요?', a: '1평은 약 3.3058㎡입니다. 반대로 1㎡는 약 0.3025평입니다.' },
  { q: '분양 평수와 실제 면적이 왜 다른가요?', a: '분양 평수는 공용면적이 포함된 공급면적 기준인 경우가 많아, 실제 사용하는 전용면적은 더 작습니다.' },
]

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
      <ToolGuide sections={PYEONG_GUIDE} />
      <FaqSection items={PYEONG_FAQ} />
    </ToolShell>
  )
}
