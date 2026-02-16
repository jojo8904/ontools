import { useState, useEffect } from 'react'
import { CurrencyInput, CurrencyResult, CurrencyCode } from '@/types/tools'
import { convertCurrency, EXCHANGE_RATES } from '../utils'
import { getAllExchangeRates } from '../services/exchangeRateApi'

export function useCurrencyConverter() {
  const [input, setInput] = useState<CurrencyInput>({
    amount: 1000000,
    fromCurrency: 'KRW',
    toCurrency: 'USD',
  })

  const [result, setResult] = useState<CurrencyResult | null>(null)
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(EXCHANGE_RATES)

  useEffect(() => {
    getAllExchangeRates().then(setRates)
  }, [])

  const convert = () => {
    const conversionResult = convertCurrency(input, rates)
    setResult(conversionResult)
  }

  const updateInput = (updates: Partial<CurrencyInput>) => {
    setInput((prev) => ({ ...prev, ...updates }))
  }

  const swapCurrencies = () => {
    setInput((prev) => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
    }))
  }

  const reset = () => {
    setInput({
      amount: 1000000,
      fromCurrency: 'KRW',
      toCurrency: 'USD',
    })
    setResult(null)
  }

  return {
    input,
    result,
    convert,
    updateInput,
    swapCurrencies,
    reset,
  }
}
