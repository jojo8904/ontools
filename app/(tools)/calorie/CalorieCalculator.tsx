'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ACTIVITIES, calculateCalorie, type ActivityLevel, type Gender } from '@/features/calorie/utils'

export function CalorieCalculator() {
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState<ActivityLevel>('sedentary')
  const [result, setResult] = useState<ReturnType<typeof calculateCalorie> | null>(null)
  const [error, setError] = useState('')
  const clear = () => { setResult(null); setError('') }
  const reset = () => { setAge(''); setHeight(''); setWeight(''); setGender('male'); setActivity('sedentary'); clear() }
  return <div className="space-y-6">
    <Card>
      <CardHeader><CardTitle>1. 신체 정보 입력</CardTitle><CardDescription>성인용 하루 에너지 소비량 추정입니다. 임신·수유 중이거나 치료·성장기에는 적용하지 마세요.</CardDescription></CardHeader>
      <CardContent>
        <form className="space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); clear(); try { setResult(calculateCalorie(gender, age.trim() ? Number(age) : NaN, height.trim() ? Number(height) : NaN, weight.trim() ? Number(weight) : NaN, activity)) } catch (err) { setError((err as Error).message) } }}>
          <fieldset><legend className="mb-2 text-sm font-medium">공식에 적용할 성별</legend><div className="flex gap-2">{(['male', 'female'] as const).map((g) => <button key={g} type="button" aria-pressed={gender === g} onClick={() => { setGender(g); clear() }} className={`flex-1 rounded-lg p-3 ${gender === g ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>{g === 'male' ? '남성' : '여성'}</button>)}</div></fieldset>
          {([{ key: 'age', label: '나이 (세)', value: age, set: setAge, min: 18, max: 120, step: '1', placeholder: '30' }, { key: 'height', label: '키 (cm)', value: height, set: setHeight, min: 100, max: 250, step: 'any', placeholder: '175' }, { key: 'weight', label: '체중 (kg)', value: weight, set: setWeight, min: 25, max: 350, step: 'any', placeholder: '75' }]).map((f) => <div key={f.key}><label htmlFor={`calorie-${f.key}`} className="mb-1.5 block text-sm font-medium">{f.label}</label><Input id={`calorie-${f.key}`} type="number" required min={f.min} max={f.max} step={f.step} placeholder={f.placeholder} value={f.value} onChange={(e) => { f.set(e.target.value); clear() }} /></div>)}
          <fieldset className="space-y-2"><legend className="mb-2 font-semibold">2. 평소 활동량 선택</legend>
            <p id="activity-help" className="text-sm text-gray-600">운동 횟수만 보지 말고 직업·이동·앉아 있는 시간을 함께 고려하세요. 아래 계수는 간편 추정용 가정이며 개인의 활동을 측정한 값이 아닙니다. 운동 소비량을 다시 더하면 중복될 수 있어요.</p>
            {(Object.entries(ACTIVITIES) as [ActivityLevel, typeof ACTIVITIES[ActivityLevel]][]).map(([key, item]) => <label key={key} className={`flex cursor-pointer gap-3 rounded-lg border p-3 ${activity === key ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}><input type="radio" name="activity" value={key} checked={activity === key} aria-describedby="activity-help" onChange={() => { setActivity(key); clear() }} /><span><span className="block text-sm font-medium">{item.label} · ×{item.factor}</span><span className="text-sm text-gray-600">{item.guide}</span></span></label>)}
          </fieldset>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <div className="flex gap-2"><Button type="submit" className="flex-1" size="lg">TDEE 계산하기</Button><Button type="button" variant="outline" onClick={reset}>초기화</Button></div>
        </form>
      </CardContent>
    </Card>
    {result && <Card><CardHeader><CardTitle>3. 하루 소비량 추정 결과</CardTitle><CardDescription>{gender === 'male' ? '남성' : '여성'} / {age}세 / {height}cm / {weight}kg / {ACTIVITIES[activity].label}</CardDescription></CardHeader>
      <CardContent className="space-y-4" role="status">
        <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-blue-50 p-4"><p className="text-sm">안정 시 대사량 추정 (BMR)</p><p className="text-2xl font-bold">{result.bmr.toLocaleString()} kcal/일</p></div><div className="rounded-lg bg-emerald-50 p-4"><p className="text-sm">하루 총 소비량 추정 (TDEE)</p><p className="text-2xl font-bold">{result.tdee.toLocaleString()} kcal/일</p></div></div>
        <p className="text-sm">Mifflin-St Jeor 간편식 × 활동 계수 {ACTIVITIES[activity].factor}. 중간값은 반올림하지 않고 최종 결과만 정수로 표시합니다.</p>
        <p className="text-sm text-gray-600">TDEE는 체중 유지에 필요한 에너지의 출발점으로 보는 추정치이며 섭취 처방이나 감량 보장이 아닙니다. 체성분·건강 상태·실제 활동량에 따라 달라집니다. 일정 기간의 생활·체중 기록과 비교해 해석하고 개인별 식사 계획은 전문가와 상의하세요.</p>
      </CardContent></Card>}
    <p className="text-xs text-gray-500">계산식: <a className="underline" href="https://pubmed.ncbi.nlm.nih.gov/2305711/" target="_blank" rel="noreferrer">Mifflin 등 원문</a> · 대상·한계 참고: <a className="underline" href="https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner" target="_blank" rel="noreferrer">NIH NIDDK</a>. 활동 계수는 위 원문의 검증식 자체에 포함되지 않는 별도 가정입니다.</p>
  </div>
}
