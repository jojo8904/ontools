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

    if (mode === 'usage') {
      if (usage < 0) {
        setError('사용량은 0 이상이어야 합니다.')
        return
      }
      setResult(calculateFromUsage(usage))
    } else {
      if (amount <= 0) {
        setError('금액은 0보다 커야 합니다.')
        return
      }
      setResult(calculateFromAmount(amount))
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
    setUsage,
    setAmount,
    calculate,
    reset,
  }
}
