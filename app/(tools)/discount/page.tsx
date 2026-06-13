import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { DiscountCalculator } from './DiscountCalculator'

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
    </ToolShell>
  )
}
