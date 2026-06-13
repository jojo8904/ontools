import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'
import { SleepCalculator } from './SleepCalculator'

export const metadata: Metadata = {
  title: '수면 시간 계산기 - ontools',
  description: '90분 수면 주기를 기준으로 개운하게 일어날 수 있는 취침·기상 시각을 추천합니다. 지금 자면 몇 시에 일어나야 할지 알려드려요.',
  keywords: ['수면계산기', '취침시간', '기상시간', '수면주기', '꿀잠'],
}

const GUIDE = [
  { h: '수면 주기란?', p: ['잠은 얕은 수면과 깊은 수면이 약 90분 단위로 반복됩니다. 이 주기가 끝나는 시점(얕은 수면)에 일어나면 같은 시간을 자도 훨씬 개운합니다. 반대로 깊은 수면 중에 깨면 더 피곤하게 느껴집니다.'] },
  { h: '계산 방법', p: ['잠드는 데 걸리는 평균 시간(약 14분)을 더한 뒤, 90분 주기가 끝나는 시각들을 계산합니다. 보통 5~6주기(7.5~9시간)를 권장하며, 최소 4주기(6시간)도 함께 제안합니다.'] },
  { h: '활용 팁', p: ['"기상 시각 기준"은 일어날 시간을 정해두고 언제 자면 좋은지, "지금 자면?"은 지금 누우면 언제 일어나는 게 좋은지 알려줍니다. 수면 주기는 개인차가 있으니 참고용으로 활용하세요.'] },
]

const FAQ = [
  { q: '왜 7시간이 아니라 7시간 30분을 추천하나요?', a: '90분 수면 주기에 맞추기 위해서입니다. 7.5시간(5주기), 9시간(6주기)처럼 주기가 끝날 때 일어나면 덜 피곤합니다.' },
  { q: '잠드는 시간 14분은 뭔가요?', a: '평균적으로 누운 뒤 실제 잠들기까지 걸리는 시간입니다. 더 정확히 맞추기 위해 반영했습니다.' },
]

export default function SleepPage() {
  return (
    <ToolShell
      title="수면 시간 계산기"
      description="90분 수면 주기로 개운하게 일어날 취침·기상 시각을 추천합니다."
      breadcrumb="건강"
      current="/sleep"
    >
      <SleepCalculator />
      <ToolGuide sections={GUIDE} />
      <FaqSection items={FAQ} />
    </ToolShell>
  )
}
