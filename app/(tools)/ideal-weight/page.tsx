import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'
import { IdealWeightCalculator } from './IdealWeightCalculator'

export const metadata: Metadata = {
  title: '적정체중 계산기 - ontools',
  description: '키를 입력하면 표준체중과 정상 체중 범위를 계산합니다. 대한비만학회 BMI 기준. 현재 체중과 비교도 가능.',
  keywords: ['적정체중', '표준체중', '정상체중', '표준체중계산기', '비만도'],
}

const GUIDE = [
  { h: '적정체중이란?', p: ['적정체중은 키 대비 건강에 이로운 체중 범위를 말합니다. 흔히 BMI(체질량지수) 22를 기준으로 한 "표준체중"과, 정상으로 보는 체중 "범위"로 표현합니다.'] },
  { h: '계산 방법', p: ['표준체중은 "키(m) × 키(m) × 22"로 구합니다. 정상 체중 범위는 BMI 18.5~22.9에 해당하는 체중입니다. 예를 들어 키 170cm는 표준체중 약 63.6kg, 정상 범위 약 53.5~66.2kg입니다.'] },
  { h: '주의사항', p: ['BMI 기반 계산은 근육량·체지방을 구분하지 못합니다. 운동선수나 근육량이 많은 사람은 표준보다 높게 나올 수 있으니 참고 지표로만 활용하세요.'] },
]

const FAQ = [
  { q: '표준체중과 적정체중은 같은가요?', a: '표준체중은 BMI 22에 해당하는 한 값이고, 적정(정상) 체중은 BMI 18.5~22.9에 해당하는 범위입니다.' },
  { q: '키만 알면 계산되나요?', a: '네, 키만 입력하면 표준체중과 정상 범위가 나옵니다. 현재 체중을 함께 넣으면 표준 대비 차이와 BMI도 보여줍니다.' },
]

export default function IdealWeightPage() {
  return (
    <ToolShell
      title="적정체중 계산기"
      description="키 기준 표준체중과 정상 체중 범위를 계산합니다."
      breadcrumb="건강"
      current="/ideal-weight"
    >
      <IdealWeightCalculator />
      <ToolGuide sections={GUIDE} />
      <FaqSection items={FAQ} />
    </ToolShell>
  )
}
