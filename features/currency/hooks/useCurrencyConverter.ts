import { useState, useEffect, useMemo } from 'react'
import { CurrencyInput } from '@/types/tools'
import { convertCurrency, EXCHANGE_RATES } from '../utils'
import { getAllExchangeRates, fallbackQuotes } from '../services/exchangeRateApi'
import { trackToolEvent } from '@/lib/analytics'

const initial: CurrencyInput = { amount: 1000000, fromCurrency: 'KRW', toCurrency: 'USD' }

export function useCurrencyConverter() {
  const [input, setInput] = useState<CurrencyInput>(initial)
  const [submitted, setSubmitted] = useState<CurrencyInput | null>(null)
  const [quotes, setQuotes] = useState(fallbackQuotes)
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    getAllExchangeRates().then((next) => {
      if (active) { setQuotes(next); setLoading(false) }
    })
    return () => { active = false }
  }, [attempt])
  const result = useMemo(() => {
    if (!submitted) return null
    const rates = { ...EXCHANGE_RATES }
    for (const code of Object.keys(rates) as Array<keyof typeof rates>) rates[code] = quotes[code].rate
    return convertCurrency(submitted, rates, quotes)
  }, [submitted, quotes])
  const convert = () => {
    if (!Number.isFinite(input.amount) || input.amount < 0) { setError('0 이상의 금액을 입력해주세요.'); return }
    setError(null)
    setSubmitted({ ...input })
    trackToolEvent('calculation_complete', '/currency')
  }
  return {
    input, result, convert, loading, error,
    retry: () => { setLoading(true); setAttempt((n) => n + 1) },
    updateInput: (updates: Partial<CurrencyInput>) => { setInput((prev) => ({ ...prev, ...updates })); setSubmitted(null) },
    swapCurrencies: () => { setInput((prev) => ({ ...prev, fromCurrency: prev.toCurrency, toCurrency: prev.fromCurrency })); setSubmitted(null) },
    reset: () => { setInput(initial); setSubmitted(null); setError(null) },
  }
}
