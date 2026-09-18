'use client'

import { useState } from 'react'
import { Calculator, Download, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  NumberField,
  ErrorMessage,
  IconButton,
  panelClass,
  fieldClass,
} from '@/components/tools/WorkflowFields'
import { calculateSellingPrice, type PriceInput } from '@/features/selling-price/utils'
import { exportTable } from '@/lib/spreadsheet'
import { downloadBlob } from '@/lib/useObjectUrls'
import { trackToolEvent } from '@/lib/analytics'

const DEFAULT: PriceInput = {
  cost: 10000,
  packaging: 500,
  shipping: 3000,
  advertising: 1000,
  fee: 6,
  margin: 25,
  rounding: 100,
}
const LABELS: [keyof PriceInput, string][] = [
  ['cost', '상품 원가 (원)'],
  ['packaging', '포장비 (원)'],
  ['shipping', '판매자 부담 배송비 (원)'],
  ['advertising', '건당 광고·기타 비용 (원)'],
  ['fee', '판매가 기준 수수료율 (%)'],
  ['margin', '목표 마진율 (%)'],
]

export function SellingPriceCalculator() {
  const [input, setInput] = useState(DEFAULT)
  const [result, setResult] = useState<ReturnType<typeof calculateSellingPrice> | null>(null)
  const [error, setError] = useState('')
  const money = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`
  return (
    <div className="space-y-5">
      <form
        className={panelClass}
        onSubmit={(event) => {
          event.preventDefault()
          try {
            setResult(calculateSellingPrice(input))
            setError('')
            trackToolEvent('calculation_complete', '/selling-price')
          } catch (e) {
            setResult(null)
            setError((e as Error).message)
          }
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LABELS.map(([key, label]) => (
            <NumberField
              key={key}
              label={label}
              value={input[key]}
              max={key === 'fee' || key === 'margin' ? 99.99 : 1e12}
              onChange={(value) => {
                setInput({ ...input, [key]: value })
                setResult(null)
              }}
            />
          ))}
        </div>
        <label className="block text-sm font-medium">
          판매가 올림 단위
          <select
            className={`${fieldClass} mt-1.5`}
            value={input.rounding}
            onChange={(e) => {
              setInput({ ...input, rounding: Number(e.target.value) })
              setResult(null)
            }}
          >
            {[1, 10, 100, 1000].map((n) => (
              <option key={n} value={n}>
                {n.toLocaleString()}원
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-gray-500">
          세금·반품·할인 미포함. 비용은 동일한 세금 기준으로 입력하며, 수수료는 상품 판매가에만 적용합니다.
        </p>
        <ErrorMessage error={error} />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 gap-2">
            <Calculator size={18} />
            판매가 계산
          </Button>
          <IconButton
            label="초기화"
            onClick={() => {
              setInput(DEFAULT)
              setResult(null)
              setError('')
            }}
          >
            <RotateCcw size={18} />
          </IconButton>
        </div>
      </form>
      {result && (
        <section className={panelClass} aria-label="판매가 계산 결과">
          <h2 className="text-lg font-bold">목표 판매가</h2>
          <p className="text-3xl font-bold text-blue-600 break-all">{money(result.price)}</p>
          <dl className="space-y-3 text-sm">
            {[
              ['합계 비용', money(result.costs)],
              ['수수료', money(result.fees)],
              ['건당 예상 이익', money(result.profit)],
              ['판매가 대비 마진율', `${result.actualMargin.toFixed(2)}%`],
              ['손익분기 판매가', money(result.breakEven)],
            ].map(([label, value]) => (
              <div className="flex justify-between gap-4" key={label}>
                <dt className="text-gray-500">{label}</dt>
                <dd className="text-right font-medium break-all">{value}</dd>
              </div>
            ))}
          </dl>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              downloadBlob(
                new Blob(
                  [
                    exportTable([
                      ['항목', '값'],
                      ...LABELS.map(([key, label]) => [label, input[key]]),
                      ['목표 판매가', result.price],
                      ['예상 이익', result.profit],
                      ['마진율', result.actualMargin],
                    ]),
                  ],
                  { type: 'text/csv;charset=utf-8' }
                ),
                'ontools-selling-price.csv'
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
