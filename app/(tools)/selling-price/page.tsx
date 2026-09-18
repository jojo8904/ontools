import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'
import { SellingPriceCalculator } from './SellingPriceCalculator'

export const metadata: Metadata = {
  title: '목표 마진 판매가 계산기 - ontools',
  description: '상품 원가, 포장비, 배송비, 광고비와 수수료를 반영한 목표 판매가·손익분기점·건당 이익 계산.',
  alternates: { canonical: '/selling-price' },
  keywords: ['판매가 계산기', '마진율 계산기', '쇼핑몰 마진', '손익분기 판매가'],
}

export default function Page() {
  return (
    <ToolShell
      title="목표 마진 판매가 계산기"
      description="상품 한 건의 비용과 목표 마진을 기준으로 계산한 예상 판매가."
      breadcrumb="금융"
      current="/selling-price"
    >
      <SellingPriceCalculator />
      <ToolGuide
        showScrollHint={false}
        sections={[
          {
            h: '마진율과 원가 가산율',
            p: [
              '마진율은 판매가에서 모든 입력 비용과 수수료를 뺀 이익을 판매가로 나눈 비율입니다. 원가에 일정 비율을 더하는 원가 가산율과는 다릅니다. 원가 10,000원, 수수료 0%, 목표 마진 20%라면 판매가는 12,500원입니다.',
            ],
          },
          {
            h: '비용의 범위',
            p: [
              '배송비는 판매자가 실제 부담하는 순비용, 광고비는 주문 한 건에 배분한 비용입니다. 고객이 따로 내는 배송비 매출과 그 수수료는 자동 반영하지 않습니다. 고정 임대료, 반품, 부가세·소득세는 별도로 고려해야 합니다.',
            ],
          },
        ]}
      />
      <FaqSection
        items={[
          {
            q: '플랫폼 수수료가 자동 적용되나요?',
            a: '아니요. 판매 채널, 카테고리, 결제 방식에 따라 달라지는 실제 수수료를 직접 입력하는 방식입니다.',
          },
          {
            q: '부가세를 포함해야 하나요?',
            a: '원가와 각 비용의 세금 포함 여부를 같은 기준으로 맞춰 비교해야 합니다. 이 결과는 세무 신고 금액이나 확정 순이익이 아닙니다.',
          },
        ]}
      />
    </ToolShell>
  )
}
