'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'

type Scale = 4.5 | 4.3

const GRADES_45: Record<string, number> = { 'A+': 4.5, A0: 4.0, 'B+': 3.5, B0: 3.0, 'C+': 2.5, C0: 2.0, 'D+': 1.5, D0: 1.0, F: 0 }
const GRADES_43: Record<string, number> = { 'A+': 4.3, A0: 4.0, 'A-': 3.7, 'B+': 3.3, B0: 3.0, 'B-': 2.7, 'C+': 2.3, C0: 2.0, 'C-': 1.7, 'D+': 1.3, D0: 1.0, F: 0 }

interface Row {
  id: number
  name: string
  credit: number
  grade: string
}

let _seq = 4

export function GpaCalculator() {
  const [scale, setScale] = useState<Scale>(4.5)
  const [rows, setRows] = useState<Row[]>([
    { id: 1, name: '', credit: 3, grade: 'A0' },
    { id: 2, name: '', credit: 3, grade: 'B+' },
    { id: 3, name: '', credit: 2, grade: 'A+' },
    { id: 4, name: '', credit: 3, grade: 'B0' },
  ])

  const grades = scale === 4.5 ? GRADES_45 : GRADES_43
  const gradeKeys = [...Object.keys(grades), 'P']

  const update = (id: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const addRow = () => {
    _seq += 1
    setRows((prev) => [...prev, { id: _seq, name: '', credit: 3, grade: 'A0' }])
  }
  const removeRow = (id: number) => setRows((prev) => prev.filter((r) => r.id !== id))

  const result = useMemo(() => {
    let gradedCredits = 0
    let points = 0
    let totalCredits = 0
    for (const r of rows) {
      if (r.credit <= 0) continue
      totalCredits += r.credit
      if (r.grade === 'P') continue // Pass는 학점만 인정, 평점 제외
      const p = grades[r.grade]
      if (p === undefined) continue
      gradedCredits += r.credit
      points += r.credit * p
    }
    return {
      totalCredits,
      gpa: gradedCredits > 0 ? points / gradedCredits : 0,
      gradedCredits,
    }
  }, [rows, grades])

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-400">만점 기준</span>
        {([4.5, 4.3] as Scale[]).map((s) => (
          <button
            key={s}
            onClick={() => setScale(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${scale === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {s} 만점
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="px-3 py-2.5 text-left font-medium">과목명 (선택)</th>
              <th className="w-24 px-2 py-2.5 text-left font-medium">학점</th>
              <th className="w-28 px-2 py-2.5 text-left font-medium">성적</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={r.name}
                    onChange={(e) => update(r.id, { name: e.target.value })}
                    placeholder="예: 미시경제학"
                    className="w-full rounded border border-gray-200 px-2 py-1.5 outline-none focus:border-blue-400"
                  />
                </td>
                <td className="px-2 py-2">
                  <select
                    value={r.credit}
                    onChange={(e) => update(r.id, { credit: parseFloat(e.target.value) })}
                    className="w-full rounded border border-gray-200 px-2 py-1.5 outline-none"
                  >
                    {[0.5, 1, 1.5, 2, 2.5, 3, 4].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <select
                    value={r.grade}
                    onChange={(e) => update(r.id, { grade: e.target.value })}
                    className="w-full rounded border border-gray-200 px-2 py-1.5 outline-none"
                  >
                    {gradeKeys.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-2 text-center">
                  <button onClick={() => removeRow(r.id)} disabled={rows.length <= 1} className="text-red-400 hover:text-red-600 disabled:opacity-30">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button onClick={addRow} variant="outline" size="sm">
        + 과목 추가
      </Button>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <p className="text-sm text-gray-600">
          취득 학점 <strong>{result.totalCredits}학점</strong>
          {result.totalCredits !== result.gradedCredits && ` (평점 반영 ${result.gradedCredits}학점, P 제외)`}
        </p>
        <p className="mt-1 text-3xl font-bold text-blue-700">
          평점 {result.gpa.toFixed(2)} <span className="text-lg font-medium text-gray-500">/ {scale}</span>
        </p>
      </div>

      <p className="text-xs text-gray-400">
        평점 = Σ(학점 × 성적점수) ÷ 평점 반영 학점. P(Pass)는 학점만 인정되고 평점에서 제외됩니다. 학교마다 등급별 점수가 다를 수 있어요.
      </p>
    </div>
  )
}
