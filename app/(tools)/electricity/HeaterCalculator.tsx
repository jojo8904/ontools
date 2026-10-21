'use client'
import { useState } from 'react'
import { calculateHeater, type HeaterInput } from '@/features/electricity/heater'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

const fields: { key: keyof HeaterInput; label: string; min: number; max?: number; step?: string }[] = [
  { key: 'baseline', label: '난방기 제외 월 사용량 (kWh)', min: 0, max: 1000, step: 'any' },
  { key: 'watts', label: '히터·온풍기 소비전력 (W)', min: 1, max: 10000, step: 'any' },
  { key: 'hours', label: '하루 켜 두는 시간', min: 0, max: 24, step: 'any' },
  { key: 'days', label: '월 사용 일수', min: 1, max: 31 },
  { key: 'duty', label: '실제 발열 가동률 (%)', min: 1, max: 100, step: 'any' },
  { key: 'budget', label: '추가요금 예산 (원)', min: 0, step: 'any' },
]
export function HeaterCalculator() {
  const defaults = { baseline: '300', watts: '2000', hours: '4', days: '30', duty: '100', budget: '30000' }
  const [values, setValues] = useState(defaults)
  const [result, setResult] = useState<ReturnType<typeof calculateHeater> | null>(null)
  const [error, setError] = useState('')
  return <Card>
    <CardHeader><CardTitle>히터·온풍기 추가요금과 예산</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm text-gray-600">주택용 저압·기타계절(1~6월, 9~12월)·합계 0~1,000kWh만 지원합니다. 하계·고압·할인·TV 수신료는 제외합니다. 기존 사용량은 난방기 사용분을 빼고 입력하세요.</p>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setError(''); try { setResult(calculateHeater(Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim() ? Number(v) : NaN])) as unknown as HeaterInput)) } catch (err) { setResult(null); setError((err as Error).message) } }}>
        <div className="grid gap-4 sm:grid-cols-2">{fields.map(({ key, label, ...attrs }) => <div key={key}><label htmlFor={`heater-${key}`} className="mb-1 block text-sm font-medium">{label}</label><Input id={`heater-${key}`} type="number" required {...attrs} value={values[key]} onChange={(e) => { setValues({ ...values, [key]: e.target.value }); setResult(null); setError('') }} /></div>)}</div>
        <p className="text-sm text-gray-600">가동률은 켜 둔 시간 중 정격 소비전력으로 발열하는 비율에 대한 사용자 가정입니다. 100%는 계속 발열, 50%는 절반 동안 발열을 가정합니다. 대기·송풍 전력은 별도이며 온도·방 크기에서 가동률을 예측하지 않습니다.</p>
        <div className="flex gap-2"><Button type="submit">난방 추가요금 계산</Button><Button type="button" variant="outline" onClick={() => { setValues(defaults); setResult(null); setError('') }}>난방 입력 초기화</Button></div>
      </form>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {result && <div role="status" className="space-y-2 rounded-lg bg-blue-50 p-4 text-sm">
        <p>추가 사용량: {result.added.toLocaleString(undefined, { maximumFractionDigits: 3 })}kWh</p>
        <p>기존 {result.before.total.toLocaleString()}원 → 합계 {result.after.total.toLocaleString()}원 ({result.after.usage.toLocaleString(undefined, { maximumFractionDigits: 3 })}kWh)</p>
        <p className="text-lg font-bold">예상 추가요금: {result.incremental.toLocaleString()}원</p>
        <p>예산 내 켜 둘 수 있는 총 시간: {Math.floor(result.budgetMinutes / 60)}시간 {result.budgetMinutes % 60}분 · 하루 평균 {(Math.floor(result.budgetMinutes / Number(values.days)) / 60).toFixed(2)}시간 이하</p>
        <p>입력한 전력·가동률·일수 기준, 1분 단위 내림입니다. {result.capped ? '하루 24시간 또는 합계 1,000kWh 지원 한도에 도달했습니다. 남은 예산을 범위 밖으로 환산하지 않습니다.' : '기존 요금과의 차액으로 예산을 역산하며 누진 구간을 반영합니다.'}</p>
      </div>}
      <p className="text-xs text-gray-500">기존 요금 엔진 적용: 기후환경 9원/kWh, 연료비 5원/kWh 가정, 부가세 10%, 기금 2.7%(2025년 7월 이후 기준). 실제 청구액과 다를 수 있습니다. <a className="underline" href="https://cyber.kepco.co.kr/ckepco/front/jsp/CY/D/C/CYDCHP00401.jsp" target="_blank" rel="noreferrer">한국전력 월간 요금표</a> · <a className="underline" href="https://law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=118786" target="_blank" rel="noreferrer">기금 부과기준</a> · <a className="underline" href="https://online.kepco.co.kr/" target="_blank" rel="noreferrer">한전ON 실제 요금 확인</a></p>
    </CardContent>
  </Card>
}
