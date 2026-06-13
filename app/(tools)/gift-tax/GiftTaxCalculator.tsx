'use client'

import { useState } from 'react'

type Relation = 'spouse' | 'adultChild' | 'minorChild' | 'other'

const DEDUCTION: Record<Relation, number> = {
  spouse: 600_000_000, // 배우자 6억
  adultChild: 50_000_000, // 직계존비속 성인 5천만
  minorChild: 20_000_000, // 미성년 2천만
  other: 10_000_000, // 기타 친족 1천만
}
const RELATION_LABEL: Record<Relation, string> = {
  spouse: '배우자',
  adultChild: '성인 자녀(직계)',
  minorChild: '미성년 자녀(직계)',
  other: '기타 친족',
}

const BRACKETS = [
  { limit: 100_000_000, rate: 0.1, deduct: 0 },
  { limit: 500_000_000, rate: 0.2, deduct: 10_000_000 },
  { limit: 1_000_000_000, rate: 0.3, deduct: 60_000_000 },
  { limit: 3_000_000_000, rate: 0.4, deduct: 160_000_000 },
  { limit: Infinity, rate: 0.5, deduct: 460_000_000 },
]

export function GiftTaxCalculator() {
  const [amount, setAmount] = useState('') // 만원
  const [relation, setRelation] = useState<Relation>('adultChild')

  const a = parseFloat(amount) * 10000
  const valid = !isNaN(a) && a > 0

  const ded = DEDUCTION[relation]
  const base = valid ? Math.max(0, a - ded) : 0
  const bracket = BRACKETS.find((b) => base <= b.limit) ?? BRACKETS[BRACKETS.length - 1]
  const calculated = Math.floor(base * bracket.rate - bracket.deduct)
  const filingCredit = Math.floor(calculated * 0.03) // 신고세액공제 3%
  const payable = Math.max(0, calculated - filingCredit)

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[#333]">증여 재산가액 (만원)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="예: 10000 (=1억)" className="w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-[#333]">증여자와의 관계</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(RELATION_LABEL) as Relation[]).map((r) => (
              <button key={r} onClick={() => setRelation(r)} className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${relation === r ? 'bg-[#2563eb] text-white' : 'bg-[#f4effa] text-[#666]'}`}>
                {RELATION_LABEL[r]}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#aaa] mt-1">10년간 합산 공제: 배우자 6억 · 성인자녀 5천만 · 미성년 2천만 · 기타 1천만</p>
        </div>
      </div>

      {valid && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
          <div className="text-center bg-[#eef4ff] rounded-xl p-6">
            <p className="text-sm text-[#5a6aa8] mb-1">예상 납부세액 (신고세액공제 후)</p>
            <p className="text-4xl font-bold text-[#2563eb]">{payable.toLocaleString()}원</p>
          </div>
          <div className="space-y-1.5 text-sm px-2">
            <div className="flex justify-between"><span className="text-[#999]">증여재산공제</span><span className="font-medium text-[#241a33]">{ded.toLocaleString()}원</span></div>
            <div className="flex justify-between"><span className="text-[#999]">과세표준</span><span className="font-medium text-[#241a33]">{base.toLocaleString()}원</span></div>
            <div className="flex justify-between"><span className="text-[#999]">산출세액 (세율 {Math.round(bracket.rate * 100)}%)</span><span className="font-medium text-[#241a33]">{calculated.toLocaleString()}원</span></div>
            <div className="flex justify-between"><span className="text-[#999]">신고세액공제 (3%)</span><span className="font-medium text-emerald-600">-{filingCredit.toLocaleString()}원</span></div>
          </div>
          <p className="text-xs text-[#aaa]">간이 추정치입니다. 10년 내 증여 합산, 가산세, 특수 공제 등은 반영되지 않으니 정확한 신고는 세무 전문가와 상담하세요.</p>
        </div>
      )}
    </div>
  )
}
