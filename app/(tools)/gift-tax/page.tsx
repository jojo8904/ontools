import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'
import { GiftTaxCalculator } from './GiftTaxCalculator'

export const metadata: Metadata = {
  title: '증여세 계산기 - ontools',
  description: '증여 재산가액과 관계를 입력하면 증여재산공제·과세표준·증여세를 계산합니다. 신고세액공제 3% 반영.',
  keywords: ['증여세', '증여세계산기', '증여재산공제', '증여세율', '자녀증여'],
}

const GUIDE = [
  { h: '증여세란?', p: ['증여세는 타인(주로 가족)으로부터 재산을 무상으로 받았을 때 받는 사람이 내는 세금입니다. 증여받은 날이 속한 달의 말일부터 3개월 이내에 신고·납부해야 합니다.'] },
  { h: '계산 방법', p: ['증여액에서 관계별 증여재산공제(배우자 6억, 성인 직계자녀 5천만원, 미성년 2천만원, 기타 친족 1천만원)를 뺀 과세표준에 10~50% 누진세율을 적용합니다. 기한 내 자진신고하면 산출세액의 3%를 추가로 공제받습니다.'] },
  { h: '주의사항', p: ['증여재산공제는 10년간 합산 기준입니다. 같은 사람에게 10년 내 여러 번 증여하면 합산되어 공제 한도가 적용됩니다. 부담부증여, 가산세 등 변수가 많으니 큰 금액은 세무 전문가와 상담하세요.'] },
]

const FAQ = [
  { q: '자녀에게 얼마까지 세금 없이 증여할 수 있나요?', a: '성인 자녀는 10년간 5천만원, 미성년 자녀는 2천만원까지 증여재산공제로 세금 없이 증여할 수 있습니다.' },
  { q: '증여세 신고 기한은?', a: '증여받은 날이 속한 달의 말일부터 3개월 이내입니다. 기한 내 신고하면 3% 세액공제가 있습니다.' },
  { q: '공제는 매번 받나요?', a: '아니요. 10년간 합산한 금액에 대해 공제 한도가 적용됩니다.' },
]

export default function GiftTaxPage() {
  return (
    <ToolShell title="증여세 계산기" description="증여액·관계로 증여세를 계산합니다." breadcrumb="금융" current="/gift-tax">
      <GiftTaxCalculator />
      <ToolGuide sections={GUIDE} />
      <FaqSection items={FAQ} />
    </ToolShell>
  )
}
