import type { Metadata } from 'next'
import { ToolShell } from '@/components/ToolShell'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'
import { ResignationCompare } from './ResignationCompare'

export const metadata: Metadata = {
  title: '퇴사일 비교표 - 퇴직금·연차 정산 비교 - ontools',
  description:
    '퇴사 후보일별 재직일수, 실제 3개월 산정일수, 예상 퇴직금과 입력한 미사용 연차 정산액을 비교합니다.',
  alternates: { canonical: '/resignation-compare' },
  keywords: ['퇴사일 비교', '퇴직일 계산', '퇴직금 비교', '연차 정산'],
}

export default function Page() {
  return (
    <ToolShell
      title="퇴사일 비교표"
      description="후보일별 예상 퇴직금과 연차 정산액의 세전 비교."
      breadcrumb="연봉·세금"
      current="/resignation-compare"
    >
      <ResignationCompare />
      <ToolGuide
        showScrollHint={false}
        sections={[
          {
            h: '퇴직일과 산정기간',
            p: [
              '퇴직일은 마지막 근무일 다음 날이며 재직일수에 포함하지 않습니다. 직전 3개월은 후보일별 달력 일수로 계산합니다. 임금 합계도 각 후보일의 해당 기간과 일치해야 합니다. 휴직·중간정산·산정 제외기간이 있다면 이 단순 비교 대신 별도 산정이 필요합니다.',
            ],
          },
          {
            h: '평균임금과 통상임금',
            p: [
              '직전 3개월 임금에 산입 대상 연간 상여금과 전년도 연차수당의 각각 3/12를 더한 뒤 산정기간 일수로 나눕니다. 1일 통상임금이 더 높다면 그 금액을 퇴직금 산정에 사용합니다. 상여금 등이 이미 임금 합계에 들어갔다면 중복 입력하면 안 됩니다.',
            ],
          },
          {
            h: '연차 정산의 한계',
            p: [
              '연차 발생·소멸과 사용촉진, 회계연도 정산, 단시간 근로 여부는 회사별 확인이 필요합니다. 이 비교는 확인된 정산 대상 일수에 1일 통상임금을 곱합니다. 확정 지급액이나 가장 유리한 법적 퇴직일을 보장하지 않습니다.',
            ],
          },
        ]}
      />
      <p className="mt-4 text-xs text-gray-500">
        기준 확인: 2026-09-19 ·{' '}
        <a
          className="underline"
          href="https://www.moel.go.kr/retirementpayCal.do"
          target="_blank"
          rel="noreferrer"
        >
          고용노동부 퇴직금 계산 기준
        </a>
      </p>
      <FaqSection
        items={[
          {
            q: '1년 미만이면 퇴직금이 나오나요?',
            a: '일반적인 법정 퇴직금은 계속근로 1년 이상 등의 요건을 충족해야 합니다. 이 도구는 1년 미만 또는 주 소정근로시간 요건을 충족하지 않는다고 선택한 경우 퇴직금을 0원으로 표시합니다.',
          },
          {
            q: 'DC형 퇴직연금도 비교할 수 있나요?',
            a: 'DC형 적립금은 운용수익과 실제 부담금에 따라 달라지므로 이 계산 대상이 아닙니다. 퇴직소득세와 마지막 급여도 제외합니다.',
          },
        ]}
      />
    </ToolShell>
  )
}
