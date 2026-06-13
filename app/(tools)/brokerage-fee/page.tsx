import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { FaqSection } from '@/components/FaqSection'
import { BrokerageFeeCalculator } from './BrokerageFeeCalculator'

const BROKERAGE_FAQ = [
  { q: '중개수수료는 어떻게 정해지나요?', a: '거래금액 구간별 상한요율 내에서 공인중개사와 협의해 정합니다. 본 계산기는 주택 기준 상한을 보여줍니다.' },
  { q: '월세는 거래금액을 어떻게 계산하나요?', a: '보증금 + (월세 × 100)으로 계산합니다. 단 그 값이 5천만원 미만이면 월세에 70을 곱합니다.' },
  { q: '부가세는 별도인가요?', a: '일반과세 중개사무소는 중개보수에 부가세 10%가 별도로 붙을 수 있습니다.' },
]

export const metadata: Metadata = {
  title: '부동산 중개수수료 계산기 - ontools',
  description: '매매·전세·월세 거래금액으로 공인중개사 중개보수(복비) 상한을 계산합니다. 2024년 주택 중개보수 요율 기준.',
  keywords: ['중개수수료', '복비계산기', '중개보수', '부동산 수수료', '복비'],
}

export default function BrokerageFeePage() {
  return (
    <ToolShell
      title="부동산 중개수수료 계산기"
      description="매매·전세·월세 거래금액으로 중개보수(복비) 상한을 계산합니다."
      breadcrumb="금융"
      current="/brokerage-fee"
    >
      <BrokerageFeeCalculator />
      <FaqSection items={BROKERAGE_FAQ} />
    </ToolShell>
  )
}
