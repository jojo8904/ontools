'use client'

import { useState } from 'react'
import { SeveranceInput, SeveranceResult } from '@/types/tools'
import { calculateSeverancePay } from '../utils'

export function useSeveranceCalculator() {
  const [input, setInput] = useState<SeveranceInput>({
    startDate: '',
    endDate: '',
    monthlyAvgWage: 3_000_000,
  })

  const [result, setResult] = useState<SeveranceResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculate = () => {
    setError(null)

    if (!input.startDate || !input.endDate) {
      setError('입사일과 퇴사일을 모두 입력해주세요.')
      return
    }

    if (new Date(input.endDate) <= new Date(input.startDate)) {
      setError('퇴사일은 입사일 이후여야 합니다.')
      return
    }

    const days = Math.floor(
      (new Date(input.endDate).getTime() - new Date(input.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
    if (days < 365) {
      setError('퇴직금은 1년 이상 근무한 경우에만 발생합니다.')
      return
    }

    if (input.monthlyAvgWage <= 0) {
      setError('월 평균임금은 0보다 커야 합니다.')
      return
    }

    setResult(calculateSeverancePay(input))
  }

  const updateInput = (partial: Partial<SeveranceInput>) => {
    setInput((prev) => ({ ...prev, ...partial }))
  }

  const reset = () => {
    setInput({
      startDate: '',
      endDate: '',
      monthlyAvgWage: 3_000_000,
    })
    setResult(null)
    setError(null)
  }

  return {
    input,
    result,
    error,
    calculate,
    updateInput,
    reset,
  }
}
