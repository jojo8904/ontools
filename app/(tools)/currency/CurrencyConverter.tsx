'use client'

import { useCurrencyConverter } from '@/features/currency/hooks/useCurrencyConverter'
import { CURRENCY_NAMES, getCurrencySymbol } from '@/features/currency/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { CurrencyCode } from '@/types/tools'

const CURRENCIES: Array<'KRW' | CurrencyCode> = ['KRW', 'USD', 'JPY', 'EUR', 'CNY']

export function CurrencyConverter() {
  const { input, result, convert, updateInput, swapCurrencies, reset, loading, error, retry } =
    useCurrencyConverter()

  return (
    <div className="space-y-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>환율 변환</CardTitle>
            <CardDescription>
              제공기관의 최근 고시 환율을 기준으로 계산합니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 금액 입력 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                금액
              </label>
              <Input
                type="number"
                value={input.amount}
                onChange={(e) =>
                  updateInput({ amount: Number(e.target.value) })
                }
                placeholder="1000000"
                step="1000"
              />
            </div>

            {/* From Currency */}
            <div>
              <label className="block text-sm font-medium mb-2">
                보낼 통화
              </label>
              <select
                value={input.fromCurrency}
                onChange={(e) =>
                  updateInput({
                    fromCurrency: e.target.value as 'KRW' | CurrencyCode,
                  })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {getCurrencySymbol(currency)} {CURRENCY_NAMES[currency]} (
                    {currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                onClick={swapCurrencies}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                ⇅ 통화 교환
              </Button>
            </div>

            {/* To Currency */}
            <div>
              <label className="block text-sm font-medium mb-2">
                받을 통화
              </label>
              <select
                value={input.toCurrency}
                onChange={(e) =>
                  updateInput({
                    toCurrency: e.target.value as 'KRW' | CurrencyCode,
                  })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {getCurrencySymbol(currency)} {CURRENCY_NAMES[currency]} (
                    {currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={convert} className="flex-1" disabled={loading}>
                {loading ? '환율 확인 중...' : '환율 계산'}
              </Button>
              <Button onClick={reset} variant="outline">
                초기화
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {/* Result */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>환전 결과</CardTitle>
              <CardDescription>
                {result.lastUpdated}
                {result.status !== 'live' && (
                  <span className="ml-2 text-amber-600">
                    {result.status === 'fallback' ? '(조회 불가: 참고용 고정 환율)' : '(36시간 이상 지난 환율)'}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 주요 결과 */}
              <div className="bg-primary/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground mb-1">보내는 금액</p>
                    <p className="text-2xl font-bold">
                      {getCurrencySymbol(result.fromCurrency)}{' '}
                      {result.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {CURRENCY_NAMES[result.fromCurrency as 'KRW' | CurrencyCode]}
                    </p>
                  </div>
                  <div className="text-3xl text-muted-foreground">→</div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">받는 금액</p>
                    <p className="text-2xl font-bold text-primary">
                      {getCurrencySymbol(result.toCurrency)}{' '}
                      {result.convertedAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {CURRENCY_NAMES[result.toCurrency as 'KRW' | CurrencyCode]}
                    </p>
                  </div>
                </div>

                {/* 환율 정보 */}
                <div className="border-t pt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">적용 환율</p>
                  <p className="text-lg font-semibold">
                    1 {result.fromCurrency} = {result.rate.toLocaleString('ko-KR', { maximumSignificantDigits: 6 })}{' '}
                    {result.toCurrency}
                  </p>
                </div>
              </div>

              {/* 안내 메시지 */}
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>안내</strong>
                  <br />• 출처: {result.source}
                  <br />• 제공기관의 일별 환율이며 화면의 기준시각을 확인하세요
                  <br />• 실제 환전 시 은행/환전소 수수료가 추가될 수 있습니다
                </p>
              </div>
              <a className="text-xs underline" href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">Rates By ExchangeRate-API</a>
              {result.status !== 'live' && <Button onClick={retry} disabled={loading} variant="outline">다시 조회</Button>}
            </CardContent>
          </Card>
        )}
    </div>
  )
}
