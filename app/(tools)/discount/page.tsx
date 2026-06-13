import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'
import { DiscountCalculator } from './DiscountCalculator'

const DISCOUNT_GUIDE = [
  { h: '할인율 계산 방법', p: ['할인가는 "원가 × (1 − 할인율)", 할인 금액은 "원가 × 할인율"로 구합니다. 예를 들어 5만원 상품을 30% 할인하면 할인액 1.5만원, 할인가 3.5만원입니다.'] },
  { h: '중복 할인 주의', p: ['30% 할인 후 추가 10% 할인은 40% 할인이 아닙니다. 0.7 × 0.9 = 0.63, 즉 실제로는 37% 할인입니다. 중복 할인은 곱셈으로 계산해야 정확합니다.'] },
  { h: '활용', p: ['세일·쿠폰·카드 할인이 겹칠 때 실제 결제 금액을 빠르게 비교할 수 있습니다.'] },
]

const DISCOUNT_FAQ = [
  { q: '30% 할인 후 10% 추가 할인은 총 몇 %인가요?', a: '40%가 아니라 약 37%입니다. (1 − 0.7 × 0.9 = 0.37) 중복 할인은 곱해서 계산합니다.' },
  { q: '할인가에서 원가를 거꾸로 구할 수 있나요?', a: '할인가 ÷ (1 − 할인율)로 원가를 구할 수 있습니다. 예: 3.5만원이 30% 할인가면 원가는 5만원입니다.' },
]

export const metadata: Metadata = {
  title: '할인율 계산기 - ontools',
  description: '원가와 할인율만 입력하면 할인 적용가와 할인 금액을 바로 계산합니다. 세일·쿠폰 가격 비교에 편리.',
  keywords: ['할인율계산기', '할인계산', '세일가격', '퍼센트 계산', '할인가'],
}

export default function DiscountPage() {
  return (
    <ToolShell
      title="할인율 계산기"
      description="원가와 할인율로 할인가·할인 금액을 계산합니다."
      breadcrumb="생활·유틸"
      current="/discount"
    >
      <DiscountCalculator />
      <ToolGuide sections={DISCOUNT_GUIDE} />
      <FaqSection items={DISCOUNT_FAQ} />
    </ToolShell>
  )
}
