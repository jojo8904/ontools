'use client'

import { useState } from 'react'
import {
  ElectricityMode,
  ElectricityResult,
  calculateFromUsage,
  calculateFromAmount,
} from '../utils'

export function useElectricityCalculator() {
  const [mode, setMode] = useState<ElectricityMode>('usage')
  const [usage, setUsage] = useState<number>(300)
  const [amount, setAmount] = useState<number>(50000)
  const [result, setResult] = useState<ElectricityResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculate = () => {
    setError(null)
    try {
      setResult(mode === 'usage' ? calculateFromUsage(usage) : calculateFromAmount(amount))
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : '입력값을 확인해주세요.')
    }
  }

  const changeMode = (newMode: ElectricityMode) => {
    setMode(newMode)
    setResult(null)
    setError(null)
  }

  const reset = () => {
    setUsage(300)
    setAmount(50000)
    setResult(null)
    setError(null)
  }

  return {
    mode,
    usage,
    amount,
    result,
    error,
    changeMode,
    setUsage: (value: number) => { setUsage(value); setResult(null) },
    setAmount: (value: number) => { setAmount(value); setResult(null) },
    calculate,
    reset,
  }
}
