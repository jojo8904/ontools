import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { CarCostCalculator } from './CarCostCalculator'

export const metadata: Metadata = {
  title: '자동차 구매·리스·장기렌트 총비용 비교 - ontools',
  description: '견적의 보증금·선납금·월 납부액·보험·세금·잔존가치를 구분해 동일 기간 자동차 총비용을 무료로 비교하세요. 가입 없이 브라우저에서 계산합니다.',
  alternates: { canonical: '/car-cost' },
  keywords: ['자동차 구매 리스 렌트 비교', '장기렌트 총비용', '리스 견적 비교', '자동차 총비용 계산기'],
  openGraph: { title: '자동차 구매·리스·장기렌트 총비용 비교', description: '입력한 견적의 동일 기간 총비용을 무료로 비교하세요.', url: 'https://ontools.co.kr/car-cost', type: 'website' },
}
export default function CarCostPage() {
  return <ToolShell title="자동차 구매·리스·장기렌트 총비용 비교" description="월 납부액부터 만기 반환·인수까지, 견적 조건을 직접 입력해 비교하세요." breadcrumb="금융" current="/car-cost"><CarCostCalculator /></ToolShell>
}
