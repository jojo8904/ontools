'use client'

import { useState } from 'react'
import { calculatePlan, EMPTY_PLAN, validatePlan, warnings, type Plan } from '@/features/travel-internet/utils'

const names = ['eSIM', '통신사 로밍', '포켓와이파이']
const money = (n: number) => `${n.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}원`
type NumberKey = { [K in keyof Plan]: Plan[K] extends number ? K : never }[keyof Plan]
const inputClass = 'mt-1 block w-full min-w-0 rounded-lg border bg-white p-2'
export function TravelInternetCalculator() {
  const [people, setPeople] = useState(2)
  const [days, setDays] = useState(5)
  const [plans, setPlans] = useState<Plan[]>(() => names.map(() => ({ ...EMPTY_PLAN })))
  const [ready, setReady] = useState(false)
  const [example, setExample] = useState(false)
  const valid = plans.every(p => validatePlan(p, people, days))
  function update(index: number, key: keyof Plan, value: string | number) {
    setPlans(prev => prev.map((p, i) => i === index ? { ...p, [key]: value } : p))
    setReady(false)
  }
  function numeric(value: number, label: string, min: number, max: number, onChange: (value: number) => void) {
    return <label className="block text-sm">{label}<input className={inputClass} type="number" min={min} max={max} step="1" value={Number.isNaN(value) ? '' : value} onChange={e => onChange(e.target.value === '' ? NaN : Number(e.target.value))} /></label>
  }
  function field(i: number, key: NumberKey, label: string, min = 0, max = 100000000) {
    return numeric(plans[i][key], label, min, max, value => update(i, key, value))
  }
  function reset(sample: boolean) {
    setPeople(2); setDays(5); setReady(false); setExample(sample)
    setPlans(names.map((_, i) => sample ? { ...EMPTY_PLAN, mode: i === 0 ? 'package' : 'daily', price: [12000, 4000, 3000][i], capacity: i === 2 ? 2 : 1, data: '합성 예제 3 GB', dataBasis: i === 0 ? 'total' : 'daily', sharing: i === 2 ? 'yes' : 'unknown', sharedExtra: i === 2 ? 5000 : 0 } : { ...EMPTY_PLAN }))
  }
  return <div className="space-y-6">
    <section className="rounded-xl border bg-white p-5 text-sm space-y-2"><p>완전 무료 · 가입·결제·유료 API 불필요. 입력은 브라우저에서만 계산하며 저장·전송하지 않습니다.</p><p>실시간 최저가 검색이나 자동 요금 수집 서비스가 아닙니다. 직접 확인한 부가세 포함 최종 요금을 원(KRW)으로 입력하세요. 외화는 직접 환산한 금액을 입력하며 환율을 자동 적용하지 않습니다.</p><p>각 방식으로 여행 인원 전체가 이용하는 대안을 비교합니다. eSIM·로밍은 모든 사람이 같은 개인 요금을 구매한다고 가정합니다. 개인별로 다른 상품을 섞는 구성은 계산하지 않습니다. 추가 비용 0은 포함/무료를 확인했을 때만 사용하세요.</p></section>
    <section className="rounded-xl border bg-white p-5 grid sm:grid-cols-2 gap-4" aria-label="여행 조건">
      {numeric(people, '여행 인원 (명)', 1, 100, n => { setPeople(n); setReady(false) })}
      {numeric(days, '여행 기간 (일)', 1, 365, n => { setDays(n); setReady(false) })}
    </section>
    <div className="flex flex-wrap gap-3"><button className="rounded-lg border px-4 py-2" onClick={() => reset(true)}>합성 예제 넣기</button><button className="rounded-lg border px-4 py-2" onClick={() => reset(false)}>초기화</button></div>
    {example && <p className="text-sm text-amber-800">합성 예제 기반 입력입니다. 실제 판매 가격·환율·상품 조건이 아닙니다. 수정 후에도 실제 견적을 확인하세요.</p>}
    {plans.map((p, i) => <fieldset key={i} className="min-w-0 rounded-xl border bg-white p-5 space-y-4"><legend className="px-2 font-bold text-lg">{names[i]} 요금</legend>
      <p className="text-sm">{i === 2 ? '공용 기기 기준 · 일행이 가까이 있어야 연결할 수 있습니다. 따로 이동하면 연결이 끊길 수 있습니다.' : '개인 기준 · 여행 인원만큼 각각 구매합니다. 별도 이동 가능 여부와 지원 기기를 확인하세요.'}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="text-sm">요금 방식<select className={inputClass} value={p.mode} onChange={e => update(i, 'mode', e.target.value)}><option value="package">패키지 총액 (1회 구매)</option><option value="daily">일 요금</option></select></label>
        {field(i, 'price', `${i === 2 ? '기기' : '1인'}당 ${p.mode === 'daily' ? '일 요금' : '패키지 총액'} (원)`)}
        {p.mode === 'daily' ? field(i, 'billedDays', '실제 요금 적용 일수 (일)', 1, 365) : field(i, 'validity', '패키지 유효기간 (일)', 1, 365)}
        {i === 2 && <>{field(i, 'units', '공용 기기 수 (대)', 1, 100)}{field(i, 'capacity', '기기당 사용 인원 (명)', 1, 100)}</>}
        {field(i, 'perUnitExtra', `${i === 2 ? '기기' : '1인'}당 추가 비용 합계 (원)`)}
        {field(i, 'sharedExtra', '일행 전체 추가 비용 합계 (원)')}
      </div>
      <p className="text-xs text-gray-600">발급·설정·배송·수령·반납 등 추가 비용을 한 번만 입력하세요. 기기당 비용과 일행 전체 비용에 중복 입력하지 마세요. 환급되는 보증금은 제외하고 반환되지 않는 비용만 포함합니다.</p>
      <details><summary className="cursor-pointer font-medium">데이터·공유 조건 확인</summary><div className="grid sm:grid-cols-2 gap-4 mt-3">
        <label className="text-sm">데이터 용량·조건 (자유 입력)<input className={inputClass} maxLength={200} placeholder="예: 용량, 소진 후 속도, 통화 포함 여부" value={p.data} onChange={e => update(i, 'data', e.target.value)} /></label>
        <label className="text-sm">데이터 용량 기준<select className={inputClass} value={p.dataBasis} onChange={e => update(i, 'dataBasis', e.target.value)}><option value="unknown">미확인</option><option value="daily">매일 제공</option><option value="total">패키지·대여 전체 제공</option></select></label>
        <label className="text-sm">테더링·공유 가능 여부<select className={inputClass} value={p.sharing} onChange={e => update(i, 'sharing', e.target.value)}><option value="unknown">미확인</option><option value="yes">가능 (상세 제한 별도 확인)</option><option value="no">불가</option></select></label>
      </div></details>
    </fieldset>)}
    {!valid && <p role="alert" className="text-red-700">빈 요금을 입력하세요. 인원·기기·사용 인원은 1~100, 일수는 1~365, 금액은 0~1억의 정수여야 합니다.</p>}
    <button disabled={!valid} onClick={() => setReady(true)} className="rounded-lg bg-[#241a33] text-white px-5 py-3 disabled:opacity-50">여행 전체 비용 비교하기</button>
    {ready && valid && <section aria-label="비교 결과" aria-live="polite" className="space-y-4"><h2 className="text-xl font-bold">{people}명 · {days}일 여행 비용 비교</h2>
      {plans.map((p, i) => { const r = calculatePlan(p, people, days, i === 2); return <article key={i} className="rounded-xl border bg-white p-5 space-y-2 break-words"><h3 className="font-bold">{names[i]}</h3><p className="font-bold text-lg">입력 기준 총비용 {money(r.total)}</p><p>1인당 균등 분담 {money(r.perPerson)}</p><p className="text-sm">요금 {money(p.price)} × {r.multiplier}{p.mode === 'daily' ? '일' : '회'} × {r.units}{i === 2 ? '대' : '명'} = {money(r.service)}<br />추가 비용: {money(p.perUnitExtra)} × {r.units} + {money(p.sharedExtra)} = {money(r.extras)}</p><p className="text-sm">{p.mode === 'package' ? `1회 패키지 유효기간 ${p.validity}일` : `요금 적용 ${p.billedDays}일`} · {i === 2 ? `${p.units}대 / 기기당 ${p.capacity}명 · 따로 이동 제약 확인` : '개인별 구매 / 동일 요금 가정'}</p><p className="text-sm">데이터: {p.data || '미확인'} · {p.dataBasis === 'daily' ? '매일 제공' : p.dataBasis === 'total' ? '전체 제공' : '기준 미확인'} · 공유 {p.sharing === 'yes' ? '가능' : p.sharing === 'no' ? '불가' : '미확인'}</p>{warnings(p, people, days, i === 2).map(w => <p className="text-sm text-amber-800" key={w}>{w}</p>)}</article> })}
      <p className="text-sm">표시한 값은 입력한 요금의 합계입니다. 기간·인원 부족 경고가 있으면 여행 전체 이용 비용으로 확정할 수 없습니다. 1인당 비용은 일행 전체의 균등 분담이며 실제 개인 청구액과 다를 수 있습니다. 소수는 최대 둘째 자리로 반올림합니다.</p>
    </section>}
    <section className="rounded-xl border p-5 text-sm space-y-3"><h2 className="font-bold text-lg">가격과 함께 확인할 조건</h2><p>데이터의 일 기준과 전체 용량, 소진 후 속도, 공정사용정책, 통화·문자, 테더링, 지원 국가·기기, 개통 시작 시각과 현지 날짜 기준을 실제 상품에서 확인하세요. 무제한 표시는 고속 데이터·핫스팟 무제한을 뜻하지 않습니다. 개인 회선의 잔여 데이터가 자동 합산된다고 가정하지 않습니다. 가격만으로 동등한 상품이라 단정하거나 최저가를 추천하지 않습니다.</p><p>패키지는 1회 구매만 계산하며 유효기간 부족 시 자동 재구매·연장하지 않습니다. 일 요금의 과금 일수는 여행 일수와 독립적으로 입력합니다. 배송·수령·반납일 과금과 무료 적용일은 견적에 맞게 반영하세요. 데이터 용량을 합산하거나 일 용량과 전체 용량을 환산하지 않습니다.</p></section>
  </div>
}
