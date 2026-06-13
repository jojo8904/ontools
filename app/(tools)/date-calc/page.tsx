import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'
import { DateCalcCalculator } from './DateCalcCalculator'

export const metadata: Metadata = {
  title: '날짜 계산기 - ontools',
  description: '두 날짜 사이의 일수, 특정 날짜로부터 며칠 후·전의 날짜를 계산합니다. 근무일·기념일·마감일 계산에 편리.',
  keywords: ['날짜계산기', '날짜계산', '며칠후', '일수계산', '날짜 사이'],
}

const GUIDE = [
  { h: '날짜 계산기란?', p: ['두 날짜 사이가 며칠인지, 또는 특정 날짜로부터 며칠 후·전이 무슨 요일·날짜인지 계산하는 도구입니다. 계약 기간, 근무일수, 기념일, 마감일 계산 등에 활용됩니다.'] },
  { h: '두 가지 모드', p: ['"날짜 사이 일수"는 시작일과 종료일을 넣으면 그 사이 일수를 알려줍니다. "며칠 후/전"은 기준일에 일수를 더하거나(양수) 빼서(음수) 해당 날짜와 요일을 보여줍니다.'] },
  { h: '양 끝 포함 계산', p: ['일수 계산 시 "양 끝 포함"은 시작일과 종료일을 모두 하루로 세는 방식입니다. 계약 기간처럼 시작일도 포함해 세야 할 때 참고하세요.'] },
]

const FAQ = [
  { q: '"양 끝 포함"은 무슨 뜻인가요?', a: '시작일과 종료일을 모두 1일로 세는 방식입니다. 예를 들어 1일~3일은 단순 차이로는 2일이지만, 양 끝 포함이면 3일입니다.' },
  { q: 'D-day 계산기와 뭐가 다른가요?', a: 'D-day는 오늘 기준 목표일까지 남은 일수에 초점을 두고, 날짜 계산기는 임의의 두 날짜 사이나 며칠 후/전 날짜를 구하는 데 쓰입니다.' },
]

export default function DateCalcPage() {
  return (
    <ToolShell title="날짜 계산기" description="날짜 사이 일수와 며칠 후·전의 날짜를 계산합니다." breadcrumb="생활·유틸" current="/date-calc">
      <DateCalcCalculator />
      <ToolGuide sections={GUIDE} />
      <FaqSection items={FAQ} />
    </ToolShell>
  )
}
