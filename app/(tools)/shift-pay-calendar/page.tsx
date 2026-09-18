import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'
import { ShiftPayCalendar } from './ShiftPayCalendar'

export const metadata: Metadata = {
  title: '교대근무 급여 달력 - 야간·휴일 수당 계산 - ontools',
  description:
    '근무 달력에 출퇴근·휴게시간을 기록하고 일 연장, 야간, 휴일 가산을 구분한 세전 급여와 CSV를 확인합니다.',
  alternates: { canonical: '/shift-pay-calendar' },
  keywords: ['교대근무 급여', '알바 급여 달력', '야간수당 계산', '근무표'],
}

export default function Page() {
  return (
    <ToolShell
      title="교대근무 급여 달력"
      description="출근일 기준 근무 기록과 세전 급여 예상액."
      breadcrumb="연봉·세금"
      current="/shift-pay-calendar"
    >
      <ShiftPayCalendar />
      <ToolGuide
        showScrollHint={false}
        sections={[
          {
            h: '일 연장·야간·휴일 가산',
            p: [
              '일반 성인 근로자의 고정 근무시간을 가정합니다. 상시 5인 이상 사업장에서 일 8시간 초과 근로와 22시~다음 날 6시 야간근로는 각각 통상시급의 50%를 가산합니다. 휴일은 8시간 이내 50%, 초과분 100%를 가산하며 야간 가산은 별도로 더합니다.',
            ],
          },
          {
            h: '계산에서 제외되는 항목',
            p: [
              '주휴수당과 유급휴일 자체 임금, 보험·세금, 계약상 추가수당은 제외합니다. 주 40시간 초과분은 자동 판단하지 않으므로 일 연장·휴일 가산과 중복되지 않는 시간만 별도로 합산할 수 있습니다. 법정 휴게시간 준수 여부를 판정하는 도구는 아닙니다.',
            ],
          },
          {
            h: '월 경계와 휴일 지정',
            p: [
              '자정을 넘긴 근무는 전액 출근일에 집계하므로 사업장의 급여 마감과 다를 수 있습니다. 토·일요일이 항상 법정 휴일인 것은 아닙니다. 휴일 지정, 단시간·탄력·선택근로 및 자정에 휴일 성격이 바뀌는 근무는 별도 검토가 필요합니다.',
            ],
          },
        ]}
      />
      <p className="mt-4 text-xs text-gray-500">
        기준 확인: 2026-09-19 ·{' '}
        <a
          className="underline"
          href="https://www.moel.go.kr/minwon/fastcounsel/fastcounselView.do?inetDcssMngId=202407250522416610558"
          target="_blank"
          rel="noreferrer"
        >
          고용노동부 연장·야간·휴일 가산 안내
        </a>
      </p>
      <FaqSection
        items={[
          {
            q: '통장에 들어오는 실수령액인가요?',
            a: '아니요. 저장한 근무에 대한 세전 기본급과 가산액의 추정치입니다. 주휴수당 등 별도 임금과 공제액은 포함하지 않습니다.',
          },
          {
            q: '기록이 자동 저장되나요?',
            a: '서버나 브라우저 저장소에 보관하지 않습니다. 새로고침 전에 내려받은 CSV 파일은 기기에 남습니다.',
          },
        ]}
      />
    </ToolShell>
  )
}
