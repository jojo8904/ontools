import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { FaqSection } from '@/components/FaqSection'
import { TravelInternetCalculator } from './TravelInternetCalculator'

export const metadata: Metadata = {
  title: '해외여행 인터넷 비용 비교 - eSIM·로밍·포켓와이파이 | ontools',
  description: '직접 입력한 eSIM·통신사 로밍·포켓와이파이 요금으로 여행 전체와 1인당 비용을 무료 비교합니다. 인원, 과금 일수, 유효기간, 공용 기기와 추가 비용을 구분합니다.',
  alternates: { canonical: '/travel-internet' },
  keywords: ['해외여행 인터넷 비용 비교', 'eSIM', '로밍 요금 비교', '포켓와이파이', '여행 통신비'],
  openGraph: { title: '해외여행 인터넷 비용 비교', description: '입력한 요금으로 eSIM·로밍·포켓와이파이의 여행 비용을 비교하세요.', url: 'https://ontools.co.kr/travel-internet', type: 'website' },
}
export default function TravelInternetPage() {
  return <ToolShell title="해외여행 인터넷 비용 비교" description="eSIM·통신사 로밍·포켓와이파이, 인원과 여행 기간에 맞춰 직접 비교하세요." breadcrumb="생활·유틸" current="/travel-internet"><TravelInternetCalculator /><FaqSection items={[
    { q: '실시간 최저가를 검색하나요?', a: '아니요. 자동 요금 수집 없이 사용자가 확인한 요금만 계산합니다. 완전 무료이며 가입·결제·유료 API가 필요하지 않습니다.' },
    { q: '포켓와이파이 비용은 어떻게 나누나요?', a: '기기당 요금에 기기 수와 과금 일수를 적용하고 추가 비용을 더합니다. 전체 비용을 여행 인원으로 균등 분담합니다. 기기당 사용 인원과 따로 이동할 때의 연결 제약을 확인하세요.' },
    { q: '패키지 유효기간이 짧으면 자동으로 추가하나요?', a: '1회 구매 비용만 반영하며 자동 재구매하지 않습니다. 유효기간 부족 경고가 표시되면 여행 전체를 커버하는 실제 견적을 확인하세요.' },
  ]} /></ToolShell>
}
