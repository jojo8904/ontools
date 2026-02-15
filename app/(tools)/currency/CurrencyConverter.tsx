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
  const { input, result, convert, updateInput, swapCurrencies, reset } =
    useCurrencyConverter()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Converter (Left 60%) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>환율 변환</CardTitle>
            <CardDescription>
              실시간 환율로 통화를 변환하세요
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
              <Button onClick={convert} className="flex-1">
                환율 계산
              </Button>
              <Button onClick={reset} variant="outline">
                초기화
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>환전 결과</CardTitle>
              <CardDescription>
                {result.lastUpdated}
                {result.isWeekend && (
                  <span className="ml-2 text-amber-600">
                    (주말/공휴일 - 최근 영업일 환율 기준)
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
                    1 {result.fromCurrency} = {result.rate.toFixed(2)}{' '}
                    {result.toCurrency}
                  </p>
                </div>
              </div>

              {/* 안내 메시지 */}
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>안내</strong>
                  <br />• 환율은 매일 오전 11시에 업데이트됩니다
                  <br />• 실제 환전 시 은행/환전소 수수료가 추가될 수 있습니다
                  <br />• Phase 2부터 한국수출입은행 API 실시간 환율 제공 예정
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Related News (Right 40%) */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">환율 뉴스</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              뉴스 시스템은 Phase 2에서 구현됩니다
            </p>
          </CardContent>
        </Card>

        {/* Ad Placeholder */}
        <Card>
          <CardContent className="p-6">
            <div className="bg-muted h-60 rounded flex items-center justify-center text-muted-foreground">
              [Google AdSense]
              <br />
              Phase 3
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
