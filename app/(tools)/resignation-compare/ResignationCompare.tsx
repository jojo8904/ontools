'use client'

import { useState } from 'react'
import { Calculator, Plus, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  NumberField,
  ErrorMessage,
  IconButton,
  fieldClass,
  panelClass,
} from '@/components/tools/WorkflowFields'
import { compareExit, type ExitScenario } from '@/features/resignation/utils'
import { localToday, shiftMonth } from '@/lib/civil-date'
import { exportTable } from '@/lib/spreadsheet'
import { downloadBlob } from '@/lib/useObjectUrls'
import { trackToolEvent } from '@/lib/analytics'

const emptyScenario = (end: string): ExitScenario => ({
  end,
  wages: 9000000,
  bonus: 0,
  priorLeavePay: 0,
  ordinaryDaily: 100000,
  remainingLeave: 0,
})
const FIELDS: [keyof Omit<ExitScenario, 'end'>, string][] = [
  ['wages', '직전 3개월 실제 임금 합계 (원)'],
  ['bonus', '산입 대상 연간 상여금 (원)'],
  ['priorLeavePay', '산입 대상 전년도 연차수당 (원)'],
  ['ordinaryDaily', '1일 통상임금 (원)'],
  ['remainingLeave', '정산 대상 미사용 연차 (일)'],
]

export function ResignationCompare() {
  const [start, setStart] = useState('2023-01-01')
  const [scenarios, setScenarios] = useState<ExitScenario[]>(() => [
    emptyScenario(localToday()),
    emptyScenario(shiftMonth(localToday(), 1)),
  ])
  const [eligible, setEligible] = useState(true)
  const [results, setResults] = useState<ReturnType<typeof compareExit>[] | null>(null)
  const [error, setError] = useState('')
  function update(index: number, patch: Partial<ExitScenario>) {
    setScenarios(scenarios.map((s, i) => (i === index ? { ...s, ...patch } : s)))
    setResults(null)
  }
  const money = (n: number) => `${n.toLocaleString('ko-KR')}원`
  function rows(): (string | number)[][] {
    return [
      ['퇴직일', '재직일수', '직전3개월일수', '퇴직금', '연차정산', '세전합계'],
      ...(results ?? []).map((r, i) => [
        scenarios[i].end,
        r.tenure,
        r.periodDays,
        r.severance,
        r.leavePay,
        r.total,
      ]),
    ]
  }
  return (
    <div className="space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          try {
            setResults(scenarios.map((s) => compareExit(start, s, eligible)))
            setError('')
            trackToolEvent('calculation_complete', '/resignation-compare')
          } catch (e) {
            setResults(null)
            setError((e as Error).message)
          }
        }}
        className="space-y-5"
      >
        <div className={panelClass}>
          <label className="block text-sm font-medium">
            입사일
            <input
              className={`${fieldClass} mt-1.5`}
              type="date"
              required
              value={start}
              onChange={(e) => {
                setStart(e.target.value)
                setResults(null)
              }}
            />
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={eligible}
              onChange={(e) => {
                setEligible(e.target.checked)
                setResults(null)
              }}
              className="mt-1"
            />
            4주 평균 주 소정근로시간 15시간 이상
          </label>
        </div>
        {scenarios.map((s, i) => (
          <fieldset key={i} className={panelClass}>
            <legend className="px-2 text-sm font-bold">후보 {i + 1}</legend>
            <div className="flex items-end gap-2">
              <label className="min-w-0 flex-1 text-sm font-medium">
                퇴직일 (마지막 근무 다음 날)
                <input
                  required
                  className={`${fieldClass} mt-1.5`}
                  type="date"
                  value={s.end}
                  onChange={(e) => update(i, { end: e.target.value })}
                />
              </label>
              <IconButton
                label={`후보 ${i + 1} 삭제`}
                disabled={scenarios.length <= 2}
                onClick={() => {
                  setScenarios(scenarios.filter((_, index) => index !== i))
                  setResults(null)
                }}
              >
                <Trash2 size={18} />
              </IconButton>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELDS.map(([key, label]) => (
                <NumberField
                  key={key}
                  label={label}
                  value={s[key]}
                  max={key === 'remainingLeave' ? 366 : 1e12}
                  onChange={(value) => update(i, { [key]: value })}
                />
              ))}
            </div>
          </fieldset>
        ))}
        <p className="text-xs text-gray-500 leading-relaxed">
          일반 퇴직금·DB형의 단순 추정입니다. DC형, 중간정산, 휴직·평균임금 제외기간은 지원하지 않습니다. 연차
          발생·소멸·사용촉진 여부는 자동 판단하지 않으며, 회사에서 확인한 정산 대상 일수를 반영합니다.
        </p>
        <ErrorMessage error={error} />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 gap-2">
            <Calculator size={18} />
            퇴사일 비교
          </Button>
          <IconButton
            label="후보 추가"
            disabled={scenarios.length >= 5}
            onClick={() => {
              setScenarios([
                ...scenarios,
                emptyScenario(shiftMonth(scenarios.at(-1)!.end || localToday(), 1)),
              ])
              setResults(null)
            }}
          >
            <Plus size={18} />
          </IconButton>
        </div>
      </form>
      {results && (
        <section className={panelClass} aria-label="퇴사일 비교 결과">
          <h2 className="text-lg font-bold">세전 비교 결과</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">항목</th>
                  {scenarios.map((s, i) => (
                    <th key={i} className="p-2 text-right">
                      {s.end}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['재직일수', '3개월 산정기간', '퇴직금', '연차 정산', '세전 합계', '첫 후보 대비'].map(
                  (label, row) => (
                    <tr key={label} className="border-b">
                      <th className="p-2 text-left font-medium">{label}</th>
                      {results.map((r, i) => (
                        <td
                          key={i}
                          className={`p-2 text-right ${row === 4 ? 'font-bold text-blue-600' : ''}`}
                        >
                          {
                            [
                              `${r.tenure}일`,
                              `${r.periodStart}~ (${r.periodDays}일)`,
                              r.eligible ? money(r.severance) : '대상 아님',
                              money(r.leavePay),
                              money(r.total),
                              money(r.total - results[0].total),
                            ][row]
                          }
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">
            마지막 월 급여·퇴직소득세·4대보험 정산 제외. 미사용 연차수당은 입력한 통상임금 기준입니다.
          </p>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              downloadBlob(
                new Blob([exportTable(rows())], { type: 'text/csv;charset=utf-8' }),
                'ontools-exit-comparison.csv'
              )
            }
          >
            <Download size={18} />
            CSV 다운로드
          </Button>
        </section>
      )}
    </div>
  )
}
