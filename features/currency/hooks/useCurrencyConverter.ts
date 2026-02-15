import { useState } from 'react'
import { CurrencyInput, CurrencyResult, CurrencyCode } from '@/types/tools'
import { convertCurrency } from '../utils'

export function useCurrencyConverter() {
  const [input, setInput] = useState<CurrencyInput>({
    amount: 1000000,
    fromCurrency: 'KRW',
    toCurrency: 'USD',
  })

  const [result, setResult] = useState<CurrencyResult | null>(null)

  const convert = () => {
    const conversionResult = convertCurrency(input)
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
