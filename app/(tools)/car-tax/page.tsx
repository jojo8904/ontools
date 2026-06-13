import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'
import { CarTaxCalculator } from './CarTaxCalculator'

export const metadata: Metadata = {
  title: '자동차세 계산기 - ontools',
  description: '배기량과 차령을 입력하면 연간 자동차세(지방교육세 포함)를 계산합니다. 비영업용 승용차·전기차 기준.',
  keywords: ['자동차세', '자동차세계산기', '자동차세조회', '차량세금', '연납'],
}

const GUIDE = [
  { h: '자동차세란?', p: ['자동차세는 차량을 소유한 사람에게 부과되는 지방세입니다. 매년 6월과 12월에 나눠 부과되며, 연초에 한 번에 내는 연납을 신청하면 일부 할인을 받을 수 있습니다.'] },
  { h: '계산 방법', p: ['비영업용 승용차는 배기량(cc)에 cc당 세액(1000cc 이하 80원, 1600cc 이하 140원, 초과 200원)을 곱하고, 여기에 지방교육세 30%를 더합니다. 차량이 오래될수록(3년차부터) 매년 5%씩 최대 50%까지 세금이 줄어듭니다.'] },
  { h: '절약 팁', p: ['1월에 연납을 신청하면 자동차세를 할인받을 수 있습니다. 전기차는 배기량이 없어 정액(비영업용 약 10만원 + 교육세)으로 부과됩니다.'] },
]

const FAQ = [
  { q: '자동차세는 언제 내나요?', a: '정기분은 6월과 12월에 나눠 부과됩니다. 1월에 연납 신청 시 한 번에 내고 할인을 받을 수 있습니다.' },
  { q: '오래된 차는 세금이 줄어드나요?', a: '네. 차령 3년차부터 매년 5%씩, 최대 50%(12년차 이상)까지 자동차세가 경감됩니다.' },
  { q: '전기차도 자동차세를 내나요?', a: '네, 배기량이 없어 비영업용 승용 기준 정액(약 10만원 + 지방교육세)으로 부과됩니다.' },
]

export default function CarTaxPage() {
  return (
    <ToolShell title="자동차세 계산기" description="배기량·차령으로 연간 자동차세를 계산합니다." breadcrumb="금융" current="/car-tax">
      <CarTaxCalculator />
      <ToolGuide sections={GUIDE} />
      <FaqSection items={FAQ} />
    </ToolShell>
  )
}
