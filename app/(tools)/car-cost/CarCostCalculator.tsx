'use client'

import { useState } from 'react'
import { calculateCost, comparisonWarnings, EMPTY_QUOTE, validateQuote, type Quote } from '@/features/car-cost/utils'

const names = ['구매', '리스', '장기렌트']
const money = (value: number) => `${Math.round(value).toLocaleString('ko-KR')}원`
type NumericKey = { [K in keyof Quote]: Quote[K] extends number ? K : never }[keyof Quote]
export function CarCostCalculator() {
  const [quotes, setQuotes] = useState<Quote[]>(() => names.map(() => ({ ...EMPTY_QUOTE })))
  const [buyout, setBuyout] = useState([false, false, false])
  const [coverage, setCoverage] = useState(() => names.map(() => ({ insurance: 'unknown', tax: 'unknown', maintenance: 'unknown' })))
  const [ready, setReady] = useState(false)
  const valid = quotes.every(validateQuote)
  const samePeriod = new Set(quotes.map(q => q.months)).size === 1
  function update(index: number, key: keyof Quote, value: number | boolean | null) {
    setQuotes(previous => previous.map((quote, i) => i === index ? { ...quote, [key]: value } : quote))
    setReady(false)
  }
  function field(index: number, key: NumericKey, label: string) {
    const value = quotes[index][key]
    return <label key={key} className="block text-sm">{label}<input type="number" min={key === 'months' ? 1 : 0} max={key === 'months' ? 120 : 1000000000} step="1" value={Number.isNaN(value) ? '' : value} onChange={e => update(index, key, e.target.value === '' ? NaN : Number(e.target.value))} className="mt-1 w-full min-w-0 rounded border bg-white p-2" /></label>
  }
  return <div className="space-y-6">
    <section className="rounded-xl border bg-white p-5 space-y-2 text-sm">
      <p>완전 무료 · 가입·결제·유료 API 없음. 입력한 견적은 브라우저에서만 계산하며 저장·전송하지 않습니다.</p>
      <p>모든 금액은 원 단위입니다. 실제 견적의 부가세 포함 최종 납부액을 입력하세요. 기본값 0은 무료라는 뜻이 아니며 미확인 비용은 직접 확인해야 합니다.</p>
      <p>구매 초기 납부액은 현금 구매 시 차량 대금, 할부 구매 시 계약 시 납부액입니다. 이후 월 할부금과 만기 미상환 원금을 입력하세요. 차량 가격 전체를 다시 더하지 않습니다.</p>
      <p>리스·렌트 초기 비용은 보증금·선납금 외 수수료입니다. 선납금은 반환되지 않는 비용이며 입력한 월 납부액에 이미 반영된 견적을 사용하세요. 보증금은 전액 반환 또는 인수대금에 충당된다고 가정합니다. 공제 예상액은 만기 비용에 추가하세요.</p>
    </section>
    <div className="space-y-5">
      {quotes.map((q, index) => <fieldset key={index} className="rounded-xl border bg-white p-5 min-w-0">
        <legend className="px-2 text-lg font-bold">{names[index]} 견적</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field(index, 'months', '견적 기간 (개월)')}{field(index, 'annualKm', '연간 주행거리 (km)')}
          {field(index, 'upfront', index === 0 ? '계약 시 차량 납부액·초기 부대비용 (원)' : '초기 수수료·부대비용 (원)')}
          {index > 0 && <>{field(index, 'prepaid', '소멸 선납금 (원)')}{field(index, 'deposit', '반환 보증금 (원)')}</>}
          {field(index, 'monthly', '월 납부액 (원)')}
          <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={q.paymentTotal !== null} onChange={e => update(index, 'paymentTotal', e.target.checked ? 0 : null)} />변동 납부: 기간 납부총액 직접 입력</label>
          {q.paymentTotal !== null && <label className="text-sm">기간 납부총액 (월 납부액 대신 적용, 원)<input type="number" min="0" max="1000000000" step="1" value={Number.isNaN(q.paymentTotal) ? '' : q.paymentTotal} onChange={e => update(index, 'paymentTotal', e.target.value === '' ? NaN : Number(e.target.value))} className="mt-1 w-full rounded border p-2" /></label>}
          {(['insurance', 'tax', 'maintenance'] as const).map(kind => <label key={kind} className="text-sm">{kind === 'insurance' ? '보험료' : kind === 'tax' ? '자동차세' : '정비비'} 포함 여부<select className="block w-full rounded border p-2 mt-1" value={coverage[index][kind]} onChange={e => {
            const status = e.target.value
            setCoverage(previous => previous.map((entry, i) => i === index ? { ...entry, [kind]: status } : entry))
            if (kind !== 'maintenance') update(index, kind === 'insurance' ? 'insuranceIncluded' : 'taxIncluded', status === 'included')
            setReady(false)
          }}><option value="unknown">미확인</option><option value="included">월 납부액에 포함</option><option value="separate">별도 부담</option></select></label>)}
          {!q.insuranceIncluded && field(index, 'annualInsurance', '별도 연 보험료 (원)')}
          {!q.taxIncluded && field(index, 'annualTax', '별도 연 자동차세 (원)')}
          {field(index, 'monthlyRunning', '월 유지비: 연료·정비 등 별도분 (원)')}
          {index > 0 && <label className="text-sm">만기 시나리오<select className="block w-full rounded border p-2 mt-1" value={buyout[index] ? 'buyout' : 'return'} onChange={e => { setBuyout(previous => previous.map((value, i) => i === index ? e.target.value === 'buyout' : value)); setReady(false) }}><option value="return">반환</option><option value="buyout">인수</option></select></label>}
          {index === 0 ? field(index, 'finalDebt', '만기 미상환 원금·정산액 (원)') : buyout[index] ? <>{field(index, 'buyout', '보증금 차감 전 인수대금 (원)')}{field(index, 'acquisitionCost', '인수 취득세·수수료·공제 등 (원)')}</> : field(index, 'returnCost', '반환 수수료·초과거리·손상·보증금 공제 (원)')}
          {(index === 0 || buyout[index]) && field(index, 'residual', '기간 종료 시 차량 매각 예상가 (원)')}
        </div>
      </fieldset>)}
    </div>
    <div aria-live="polite" className="space-y-2">
      {!valid && <p role="alert">기간은 1~120개월, 금액·주행거리는 0~10억의 정수로 입력하세요. 빈 입력을 확인하세요.</p>}
      {coverage.some(entry => Object.values(entry).includes('unknown')) && <p className="text-amber-800">보험·세금·정비 포함 여부가 미확인입니다. 미확인 비용은 입력한 별도 비용만 반영하며 견적에서 확인해 주세요.</p>}
      {comparisonWarnings(quotes).map(warning => <p key={warning} className="text-amber-800">{warning}</p>)}
    </div>
    <button className="rounded-lg bg-[#241a33] text-white px-5 py-3 disabled:opacity-50" disabled={!valid || !samePeriod} onClick={() => setReady(true)}>총비용 비교하기</button>
    {ready && valid && samePeriod && <section aria-label="비교 결과" aria-live="polite" className="space-y-4">
      <h2 className="text-xl font-bold">동일 {quotes[0].months}개월 비교 결과</h2>
      {quotes.map((q, index) => {
        const r = calculateCost(q, index === 0 ? 'purchase' : buyout[index] ? 'buyout' : 'return')
        return <article key={index} className="rounded-xl border bg-white p-5 space-y-2"><h3 className="font-bold">{names[index]} · {index === 0 ? '보유/매각 평가' : buyout[index] ? '인수' : '반환'}</h3>
          <p className="text-lg font-bold">잔존가치 반영 총비용 {money(r.net)}</p><p>월 환산 {money(r.monthlyEquivalent)} (실제 월 청구액과 다름)</p>
          <dl className="text-sm space-y-1">{[
            ['초기 필요 현금 (보증금 포함)', r.initialCash], ['기간 내 월 납부 합계', r.recurring], ['별도 보험·세금·유지비 합계', r.operating], ['만기 정산 비용', r.ending], ['총 현금 유출 (보증금 포함)', r.outflow], ['차감: 반환/충당 보증금 (한 번만)', r.depositReturned], ['보증금 정산 후 순현금지출', r.cashCost], ['차감: 매각 예상가', r.asset],
          ].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-2"><dt>{label}</dt><dd>{money(Number(value))}</dd></div>)}</dl></article>
      })}
      <p className="text-sm">잔존가치 반영 총비용 = 총 현금 유출 − 반환/충당 보증금 − 차량 매각 예상가. 차량을 계속 보유하면 매각 예상가는 현금 환급이 아닌 자산 평가입니다. 인수의 현금 유출은 보증금 반환 후 전액 납부 기준이며 실제 차액 정산 방식과 다를 수 있습니다. 음수 결과는 입력한 자산 평가가 지출보다 큰 경우입니다.</p>
    </section>}
    <section className="text-sm space-y-3 rounded-xl border p-5"><h2 className="text-lg font-bold">계산 범위와 견적 확인</h2><p>보험·세금은 별도 연 비용 × 기간/12로 단순 안분합니다. 실제 납부 일정·환급·세율은 적용하지 않습니다. 유지비는 월 납부액에 포함되지 않은 부분만 입력하세요.</p><p>동일 차종·등급·옵션·기간·주행조건으로 비교하세요. 약정거리, 초과거리 단가, 중도해지, 사고·반환 감가, 보증금 반환/충당 조건, 선납금 처리, 인수 선택권과 인수대금·이전 비용을 실제 계약서와 견적서에서 확인하세요. 만기 인수대금의 계약상 잔존가치와 차량의 예상 매각가는 별개입니다.</p><p>기회비용·물가·금리 변동·세금 공제·사업자 비용처리·중도해지는 계산하지 않습니다. 금리나 세율·약관을 자동 적용하거나 특정 상품을 추천하지 않으며 절감을 보장하지 않습니다. 입력 누락과 예상 매각가에 따라 결과가 달라집니다.</p><p>반환과 인수는 종료 시 자산 보유 여부가 다릅니다. 매각 예상가를 차감하는 경우 다른 비용 입력에 매각대금을 미리 차감하지 마세요. 기간 납부총액은 선납금·보증금·초기 비용·만기 정산을 제외한 납부액만 입력하세요.</p><p>공식 조건 확인: <a className="underline" href="https://www.hyundaicapital.com/nwcafn_new/gnssleasrtlc/CPNCGL0101.hc" target="_blank" rel="noreferrer">현대캐피탈 리스 안내</a> · <a className="underline" href="https://www.hyundaicapital.com/nwcafn/ltmrtlc/CPNCLC0101.hc" target="_blank" rel="noreferrer">현대캐피탈 장기렌트 안내</a>. 상품별 조건의 예시 자료이며 해당 페이지의 요율·광고 수치를 기본값으로 사용하지 않습니다. 실제 계약 조건을 우선 확인하세요.</p></section>
  </div>
}
