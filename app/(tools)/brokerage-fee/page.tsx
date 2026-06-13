import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { BrokerageFeeCalculator } from './BrokerageFeeCalculator'

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
    </ToolShell>
  )
}
