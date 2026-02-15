'use client'

import { useState } from 'react'
import { SalaryInput, SalaryResult } from '@/types/tools'
import { calculateSalaryTakeHome } from '../utils'

export function useSalaryCalculator() {
  const [input, setInput] = useState<SalaryInput>({
    annualSalary: 30_000_000, // 기본값: 3천만원
    dependents: 0,
    hasDisability: false,
  })

  const [result, setResult] = useState<SalaryResult | null>(null)

  const calculate = () => {
    const calculatedResult = calculateSalaryTakeHome(input)
    setResult(calculatedResult)
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
  }

  return {
    input,
    result,
    calculate,
    updateInput,
    reset,
  }
}
