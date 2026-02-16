'use client'

import { useElectricityCalculator } from '@/features/electricity/hooks/useElectricityCalculator'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

const modeTabs = [
  { key: 'usage' as const, label: '사용량 → 요금' },
  { key: 'amount' as const, label: '금액 → 사용량' },
]

const tierLabels = ['1구간 (0~200kWh)', '2구간 (201~400kWh)', '3구간 (401kWh~)']

export function ElectricityCalculator() {
  const {
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
  } = useElectricityCalculator()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculator (Left 60%) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Mode Tabs */}
        <div className="flex flex-wrap gap-2">
          {modeTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => changeMode(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                mode === tab.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'usage' ? '전기 사용량 입력' : '요금 금액 입력'}
            </CardTitle>
            <CardDescription>
              {mode === 'usage'
                ? '월 사용량(kWh)을 입력하면 예상 요금을 계산합니다'
                : '요금을 입력하면 대략적인 사용량을 역계산합니다'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === 'usage' ? (
              <div>
                <label className="block text-sm font-medium mb-2">
                  월 사용량 (kWh)
                </label>
                <Input
                  type="number"
                  value={usage}
                  onChange={(e) => setUsage(Number(e.target.value))}
                  placeholder="300"
                  step="10"
                  min="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  1인 가구 평균 약 200kWh, 4인 가구 평균 약 350kWh
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">
                  요금 (원)
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="50000"
                  step="1000"
                  min="0"
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={calculate} className="flex-1">
                계산하기
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
              <CardTitle>계산 결과</CardTitle>
              <CardDescription>
                {mode === 'amount' && '입력 금액에 해당하는 대략적인 사용량입니다'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 주요 결과 */}
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                {mode === 'usage' ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-1">
                      예상 전기요금 ({result.usage}kWh)
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {formatCurrency(result.total)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-1">
                      예상 사용량
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      약 {result.usage.toLocaleString()}kWh
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      예상 요금: {formatCurrency(result.total)}
                    </p>
                  </>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  적용 구간: {tierLabels[result.tier - 1]}
                </p>
              </div>

              {/* 구간별 전력량요금 */}
              <div>
                <h4 className="font-semibold mb-3">구간별 전력량요금</h4>
                <div className="space-y-2 text-sm">
                  {result.tierBreakdown.map((tb) => (
                    <div key={tb.tier} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {tierLabels[tb.tier - 1]}: {tb.kwh}kWh x{' '}
                        {tb.rate}원
                      </span>
                      <span className="font-medium">
                        {formatCurrency(tb.charge)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 상세 내역 */}
              <div>
                <h4 className="font-semibold mb-3">요금 상세</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">기본료</span>
                    <span className="font-medium">
                      {formatCurrency(result.basicCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">전력량요금</span>
                    <span className="font-medium">
                      {formatCurrency(result.usageCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      기후환경요금 (9원/kWh)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(result.climateCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      연료비조정요금 (5원/kWh)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(result.fuelCharge)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-muted-foreground">소계</span>
                    <span className="font-medium">
                      {formatCurrency(result.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      부가가치세 (10%)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(result.vat)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      전력산업기반기금 (3.7%)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(result.fund)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-primary">
                    <span>총 요금</span>
                    <span>{formatCurrency(result.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">전기요금 안내</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              한국전력 <strong>주택용 전기요금</strong> 누진제 기준으로
              계산합니다.
            </p>
            <p>
              <strong>누진 구간</strong>: 사용량에 따라 1~3구간으로 나뉘며,
              구간이 높을수록 단가가 올라갑니다.
            </p>
            <p>
              실제 요금은 계절별 할인/할증, 복지 할인 등에 따라 다를 수
              있습니다.
            </p>
          </CardContent>
        </Card>

        {/* 누진 구간 표 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">누진 구간표</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-muted-foreground font-medium">구간</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">기본료</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">단가</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-2">1구간 (0~200)</td>
                  <td className="text-right">910원</td>
                  <td className="text-right">120.0원</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">2구간 (201~400)</td>
                  <td className="text-right">1,600원</td>
                  <td className="text-right">214.6원</td>
                </tr>
                <tr>
                  <td className="py-2">3구간 (401~)</td>
                  <td className="text-right">7,300원</td>
                  <td className="text-right">307.3원</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">관련 도구</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/salary"
              className="block p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <p className="font-medium text-sm">연봉 실수령액 계산기</p>
              <p className="text-xs text-muted-foreground">
                세금 제외 실수령액 계산
              </p>
            </a>
            <a
              href="/unit-converter"
              className="block p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <p className="font-medium text-sm">단위 변환기</p>
              <p className="text-xs text-muted-foreground">
                길이, 무게, 온도, 시간 변환
              </p>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
