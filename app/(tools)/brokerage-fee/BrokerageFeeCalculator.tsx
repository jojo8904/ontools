'use client'

import { useState } from 'react'

type DealType = 'sale' | 'jeonse' | 'wolse'

interface Bracket {
  limit: number // 미만 (원)
  rate: number
  cap?: number
}

// 주택 중개보수 상한 요율표 (원 기준)
const SALE_BRACKETS: Bracket[] = [
  { limit: 50_000_000, rate: 0.006, cap: 250_000 },
  { limit: 200_000_000, rate: 0.005, cap: 800_000 },
  { limit: 900_000_000, rate: 0.004 },
  { limit: 1_200_000_000, rate: 0.005 },
  { limit: 1_500_000_000, rate: 0.006 },
  { limit: Infinity, rate: 0.007 },
]
const RENT_BRACKETS: Bracket[] = [
  { limit: 50_000_000, rate: 0.005, cap: 200_000 },
  { limit: 100_000_000, rate: 0.004, cap: 300_000 },
  { limit: 600_000_000, rate: 0.003 },
  { limit: 1_200_000_000, rate: 0.004 },
  { limit: 1_500_000_000, rate: 0.005 },
  { limit: Infinity, rate: 0.006 },
]

function calcFee(amount: number, brackets: Bracket[]) {
  const b = brackets.find((x) => amount < x.limit) ?? brackets[brackets.length - 1]
  const raw = amount * b.rate
  const fee = b.cap ? Math.min(raw, b.cap) : raw
  return { fee: Math.floor(fee), rate: b.rate, cap: b.cap }
}

const MAN = 10_000

export function BrokerageFeeCalculator() {
  const [type, setType] = useState<DealType>('sale')
  const [amount, setAmount] = useState('') // 만원
  const [deposit, setDeposit] = useState('') // 보증금, 만원
  const [monthly, setMonthly] = useState('') // 월세, 만원

  let dealAmount = 0 // 원
  let valid = false
  if (type === 'wolse') {
    const d = parseFloat(deposit) * MAN
    const m = parseFloat(monthly) * MAN
    if (!isNaN(d) && d >= 0 && !isNaN(m) && m >= 0 && (d > 0 || m > 0)) {
      valid = true
      // 거래금액 = 보증금 + 월세×100 (단, 5천만원 미만이면 ×70)
      let base = d + m * 100
      if (base < 50_000_000) base = d + m * 70
      dealAmount = base
    }
  } else {
    const a = parseFloat(amount) * MAN
    if (!isNaN(a) && a > 0) {
      valid = true
      dealAmount = a
    }
  }

  const brackets = type === 'sale' ? SALE_BRACKETS : RENT_BRACKETS
  const result = valid ? calcFee(dealAmount, brackets) : null

  const field =
    'w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all'

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
        <div className="flex gap-2">
          {([['sale', '매매'], ['jeonse', '전세'], ['wolse', '월세']] as const).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                type === t ? 'bg-[#2563eb] text-white' : 'bg-[#f4effa] text-[#666]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {type === 'wolse' ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#333]">보증금 (만원)</label>
              <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="예: 1000" className={field} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#333]">월세 (만원)</label>
              <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="예: 50" className={field} />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2 text-[#333]">
              {type === 'sale' ? '매매가' : '전세보증금'} (만원)
            </label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="예: 30000 (=3억)" className={field} />
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
          <div className="text-center bg-[#f4effa] rounded-xl p-6">
            <p className="text-sm text-[#6b6276] mb-1">중개보수 상한 (부가세 별도)</p>
            <p className="text-4xl font-bold text-[#2563eb]">{result.fee.toLocaleString()}원</p>
          </div>
          <div className="space-y-1.5 text-sm px-2">
            <div className="flex justify-between"><span className="text-[#999]">거래금액</span><span className="font-medium text-[#241a33]">{dealAmount.toLocaleString()}원</span></div>
            <div className="flex justify-between"><span className="text-[#999]">적용 상한요율</span><span className="font-medium text-[#241a33]">{(result.rate * 100).toFixed(1)}%{result.cap ? ` (한도 ${result.cap.toLocaleString()}원)` : ''}</span></div>
          </div>
          <p className="text-xs text-[#aaa]">
            주택 기준 <b>상한요율</b>입니다. 실제 보수는 상한 내에서 <b>협의</b>로 정하며, 부가세(10%)는 별도(일반과세 중개사)입니다. 오피스텔·상가 및 일부 지자체는 요율이 다를 수 있습니다.
          </p>
        </div>
      )}
    </div>
  )
}
