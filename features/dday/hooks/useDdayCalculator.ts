'use client'

import { useState } from 'react'
import {
  DdayMode,
  CountdownResult,
  BetweenResult,
  calculateCountdown,
  calculateBetween,
} from '../utils'

export function useDdayCalculator() {
  const [mode, setMode] = useState<DdayMode>('countdown')
  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [countdownResult, setCountdownResult] = useState<CountdownResult | null>(null)
  const [betweenResult, setBetweenResult] = useState<BetweenResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculate = () => {
    setError(null)

    if (mode === 'countdown') {
      if (!targetDate) {
        setError('목표 날짜를 입력해주세요.')
        return
      }
      setCountdownResult(calculateCountdown({ targetDate, title }))
      setBetweenResult(null)
    } else {
      if (!startDate || !endDate) {
        setError('시작일과 종료일을 모두 입력해주세요.')
        return
      }
      setBetweenResult(calculateBetween({ startDate, endDate }))
      setCountdownResult(null)
    }
  }

  const changeMode = (newMode: DdayMode) => {
    setMode(newMode)
    setCountdownResult(null)
    setBetweenResult(null)
    setError(null)
  }

  const reset = () => {
    setTitle('')
    setTargetDate('')
    setStartDate('')
    setEndDate('')
    setCountdownResult(null)
    setBetweenResult(null)
    setError(null)
  }

  return {
    mode,
    title,
    targetDate,
    startDate,
    endDate,
    countdownResult,
    betweenResult,
    error,
    changeMode,
    setTitle,
    setTargetDate,
    setStartDate,
    setEndDate,
    calculate,
    reset,
  }
}
