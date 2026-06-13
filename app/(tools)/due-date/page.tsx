import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'
import { DueDateCalculator } from './DueDateCalculator'

export const metadata: Metadata = {
  title: '출산예정일 계산기 - ontools',
  description: '마지막 생리 시작일을 입력하면 출산예정일과 현재 임신 주수, D-day를 계산합니다.',
  keywords: ['출산예정일', '출산예정일계산기', '임신주수', '임신계산기', '분만예정일'],
}

const GUIDE = [
  { h: '출산예정일은 어떻게 계산하나요?', p: ['가장 널리 쓰이는 방법은 "네겔레 법칙"으로, 마지막 생리 시작일(LMP)에 280일(40주)을 더해 출산예정일을 구합니다. 본 계산기는 이 방식으로 예정일과 현재 임신 주수를 함께 보여줍니다.'] },
  { h: '임신 주수란?', p: ['임신 주수는 보통 마지막 생리 시작일을 0주 0일로 보고 셉니다. 실제 수정일보다 약 2주 앞선 기준이라, "임신 6주"는 수정 후 약 4주를 의미합니다.'] },
  { h: '주의사항', p: ['이 계산은 생리 주기가 28일로 규칙적이라는 가정에 기반한 추정입니다. 주기가 다르거나 불규칙하면 오차가 있을 수 있으니, 정확한 예정일은 초음파 검사 등 의료진의 진단을 따르세요.'] },
]

const FAQ = [
  { q: '생리 주기가 불규칙하면 정확한가요?', a: '네겔레 법칙은 28일 주기를 가정하므로, 주기가 다르면 오차가 생깁니다. 정확한 예정일은 산부인과 초음파 검사로 확인하는 것이 가장 정확합니다.' },
  { q: '실제 출산일과 같나요?', a: '예정일에 정확히 출산하는 경우는 오히려 드뭅니다. 예정일 전후 약 2주 이내 출산이 일반적입니다.' },
]

export default function DueDatePage() {
  return (
    <ToolShell title="출산예정일 계산기" description="마지막 생리 시작일로 출산예정일과 임신 주수를 계산합니다." breadcrumb="건강" current="/due-date">
      <DueDateCalculator />
      <ToolGuide sections={GUIDE} />
      <FaqSection items={FAQ} />
    </ToolShell>
  )
}
