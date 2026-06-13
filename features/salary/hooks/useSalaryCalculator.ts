'use client'

import { useState } from 'react'
import { SalaryInput, SalaryResult } from '@/types/tools'
import { calculateSalaryTakeHome } from '../utils'
import { salaryInputSchema } from '../schema'

export function useSalaryCalculator() {
  const [input, setInput] = useState<SalaryInput>({
    annualSalary: 30_000_000, // 기본값: 3천만원
    dependents: 0,
    hasDisability: false,
  })

  const [result, setResult] = useState<SalaryResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculate = () => {
    const parsed = salaryInputSchema.safeParse(input)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? '입력값을 확인해주세요')
      setResult(null)
      return
    }
    setError(null)
    setResult(calculateSalaryTakeHome(parsed.data))
  }

  const updateInput = (partial: Partial<SalaryInput>) => {
    setInput((prev) => ({ ...prev, ...partial }))
  }

  const reset = () => {
    setInput({
      annualSalary: 30_000_000,
      dependents: 0,
      hasDisability: false,
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
