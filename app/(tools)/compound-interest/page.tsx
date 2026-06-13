import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'
import { CompoundInterestCalculator } from './CompoundInterestCalculator'

export const metadata: Metadata = {
  title: '복리 계산기 - ontools',
  description: '초기 원금과 매월 납입액, 이율, 기간을 입력하면 복리로 불어나는 미래 금액과 이자를 계산합니다.',
  keywords: ['복리계산기', '복리', '복리이자', '투자수익', '72의법칙'],
}

const GUIDE = [
  { h: '복리란?', p: ['복리는 원금뿐 아니라 이미 붙은 이자에도 다시 이자가 붙는 방식입니다. 시간이 지날수록 이자가 이자를 낳아 단리보다 훨씬 빠르게 자산이 불어납니다. "복리는 세계 8대 불가사의"라는 말이 있을 정도죠.'] },
  { h: '단리 vs 복리', p: ['단리는 원금에만 이자가 붙지만, 복리는 매 기간 누적된 금액 전체에 이자가 붙습니다. 기간이 길고 이율이 높을수록 둘의 차이는 크게 벌어집니다. 본 계산기는 월복리 기준으로 매월 추가 납입까지 반영합니다.'] },
  { h: '72의 법칙', p: ['"72 ÷ 연이율(%)"을 하면 원금이 약 2배가 되는 데 걸리는 햇수를 어림할 수 있습니다. 예를 들어 연 6%라면 약 12년 후 두 배가 됩니다.'] },
]

const FAQ = [
  { q: '월복리와 연복리는 뭐가 다른가요?', a: '복리를 계산하는 주기 차이입니다. 같은 연이율이라도 더 자주 복리가 적용될수록(월복리) 최종 금액이 조금 더 커집니다. 본 계산기는 월복리 기준입니다.' },
  { q: '이자에 세금이 붙나요?', a: '계산 결과는 세전입니다. 실제 이자에는 이자소득세 15.4%가 부과될 수 있습니다.' },
]

export default function CompoundInterestPage() {
  return (
    <ToolShell title="복리 계산기" description="복리로 불어나는 미래 금액과 이자를 계산합니다." breadcrumb="금융" current="/compound-interest">
      <CompoundInterestCalculator />
      <ToolGuide sections={GUIDE} />
      <FaqSection items={FAQ} />
    </ToolShell>
  )
}
