'use client'

import { useState } from 'react'

function ccRate(cc: number): number {
  if (cc <= 1000) return 80
  if (cc <= 1600) return 140
  return 200
}

// 차령별 경감률 (3년차 5%부터 매년 5%, 최대 50%)
function reduction(age: number): number {
  if (age < 3) return 0
  return Math.min((age - 2) * 0.05, 0.5)
}

export function CarTaxCalculator() {
  const [isEv, setIsEv] = useState(false)
  const [cc, setCc] = useState('')
  const [age, setAge] = useState('0')

  const ccNum = parseFloat(cc)
  const ageNum = parseFloat(age) || 0
  const valid = isEv || (!isNaN(ccNum) && ccNum > 0)

  let base = 0
  if (valid) base = isEv ? 100000 : ccNum * ccRate(ccNum)
  const red = reduction(ageNum)
  const baseAfter = Math.floor(base * (1 - red))
  const eduTax = Math.floor(baseAfter * 0.3)
  const total = baseAfter + eduTax

  const field =
    'w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all'

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-[#333]">
          <input type="checkbox" checked={isEv} onChange={(e) => setIsEv(e.target.checked)} className="w-4 h-4" />
          전기차 (배기량 없음, 정액)
        </label>
        {!isEv && (
          <div>
            <label className="block text-sm font-medium mb-2 text-[#333]">배기량 (cc)</label>
            <input type="number" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="예: 1998" className={field} />
            <p className="text-xs text-[#aaa] mt-1">1000cc 이하 80원/cc · 1600cc 이하 140원/cc · 초과 200원/cc</p>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#333]">차령 (년)</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="예: 3" className={field} />
          <p className="text-xs text-[#aaa] mt-1">3년차부터 매년 5%씩 경감(최대 50%)</p>
        </div>
      </div>

      {valid && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
          <div className="text-center bg-[#eef4ff] rounded-xl p-6">
            <p className="text-sm text-[#5a6aa8] mb-1">연간 자동차세 (지방교육세 포함)</p>
            <p className="text-4xl font-bold text-[#2563eb]">{total.toLocaleString()}원</p>
          </div>
          <div className="space-y-1.5 text-sm px-2">
            <div className="flex justify-between"><span className="text-[#999]">자동차세 본세{red > 0 ? ` (경감 ${Math.round(red * 100)}%)` : ''}</span><span className="font-medium text-[#241a33]">{baseAfter.toLocaleString()}원</span></div>
            <div className="flex justify-between"><span className="text-[#999]">지방교육세 (30%)</span><span className="font-medium text-[#241a33]">{eduTax.toLocaleString()}원</span></div>
          </div>
          <p className="text-xs text-[#aaa]">비영업용 승용차 기준 연세액입니다. 연납 시 할인, 영업용·기타 차종은 세율이 다릅니다.</p>
        </div>
      )}
    </div>
  )
}
