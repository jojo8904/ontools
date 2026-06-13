import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'
import { AlcoholCalculator } from './AlcoholCalculator'

export const metadata: Metadata = {
  title: '음주 알코올 분해 시간 계산기 - ontools',
  description: '위드마크 공식으로 마신 술의 예상 혈중알코올농도와 분해(해독)되기까지 걸리는 시간을 추정합니다. 음주운전은 절대 금지입니다.',
  keywords: ['알코올분해시간', '술 깨는 시간', '혈중알코올농도', '위드마크', '음주측정'],
}

const GUIDE = [
  { h: '위드마크 공식이란?', p: ['위드마크(Widmark) 공식은 마신 술의 양과 체중·성별로 혈중알코올농도(BAC)를 추정하는 방법입니다. 순수 알코올 양(g)을 "체중 × 체내 수분비율(남 0.68·여 0.55)"로 나눠 계산합니다.'] },
  { h: '분해 시간 계산', p: ['혈중알코올농도는 보통 시간당 약 0.015%씩 감소합니다. 현재 농도를 이 값으로 나누면 완전히 분해되기까지의 대략적인 시간을 추정할 수 있습니다. 한국 기준 면허정지는 0.03%, 면허취소는 0.08%입니다.'] },
  { h: '꼭 알아두세요', p: ['이 계산은 평균값에 기반한 추정일 뿐, 실제 수치는 공복 여부·간 기능·체질·약물 등에 따라 크게 달라집니다. 계산상 분해 시간이 지났더라도 몸에 알코올이 남아 있을 수 있으니, 어떤 경우에도 음주 후 운전은 하지 마세요.'] },
]

const FAQ = [
  { q: '계산 결과대로 시간이 지나면 운전해도 되나요?', a: '절대 안 됩니다. 본 계산은 추정치이며 개인차가 매우 큽니다. 음주운전은 시간과 무관하게 하지 마세요.' },
  { q: '혈중알코올농도 면허 기준은?', a: '한국은 0.03% 이상이면 면허정지, 0.08% 이상이면 면허취소 대상입니다.' },
  { q: '술이 빨리 깨는 방법이 있나요?', a: '알코올 분해 속도는 사람마다 거의 일정해서 커피·해장 등으로 크게 빨라지지 않습니다. 충분한 시간과 수면이 가장 확실합니다.' },
]

export default function AlcoholPage() {
  return (
    <ToolShell
      title="음주 알코올 분해 시간 계산기"
      description="마신 술의 예상 혈중알코올농도와 분해 시간을 추정합니다. (음주운전 절대 금지)"
      breadcrumb="건강"
      current="/alcohol"
    >
      <AlcoholCalculator />
      <ToolGuide sections={GUIDE} />
      <FaqSection items={FAQ} />
    </ToolShell>
  )
}
