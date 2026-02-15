import { useState } from 'react'
import { BmiInput, BmiResult } from '@/types/tools'
import { calculateBmi } from '../utils'

export function useBmiCalculator() {
  const [input, setInput] = useState<BmiInput>({
    height: 170,
    weight: 70,
  })

  const [result, setResult] = useState<BmiResult | null>(null)

  const calculate = () => {
    const bmiResult = calculateBmi(input)
    setResult(bmiResult)
  }

  const updateInput = (updates: Partial<BmiInput>) => {
    setInput((prev) => ({ ...prev, ...updates }))
  }

  const reset = () => {
    setInput({
      height: 170,
      weight: 70,
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
