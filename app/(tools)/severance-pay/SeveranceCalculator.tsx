'use client'

import { useSeveranceCalculator } from '@/features/retirement/hooks/useSeveranceCalculator'
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

export function SeveranceCalculator() {
  const { input, result, error, calculate, updateInput, reset } =
    useSeveranceCalculator()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculator (Left 60%) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>정보 입력</CardTitle>
            <CardDescription>
              입사일, 퇴사일, 월 평균임금을 입력하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 입사일 */}
            <div>
              <label className="block text-sm font-medium mb-2">입사일</label>
              <Input
                type="date"
                value={input.startDate}
                onChange={(e) => updateInput({ startDate: e.target.value })}
              />
            </div>

            {/* 퇴사일 */}
            <div>
              <label className="block text-sm font-medium mb-2">퇴사일</label>
              <Input
                type="date"
                value={input.endDate}
                onChange={(e) => updateInput({ endDate: e.target.value })}
              />
            </div>

            {/* 월 평균임금 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                퇴직 전 3개월 월 평균임금 (원)
              </label>
              <Input
                type="number"
                value={input.monthlyAvgWage}
                onChange={(e) =>
                  updateInput({ monthlyAvgWage: Number(e.target.value) })
                }
                placeholder="3000000"
                step="100000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                기본급 + 고정수당 + 상여금(연간 1/12) 포함
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Buttons */}
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
              <CardDescription>퇴직금 산정 내역</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 주요 결과 */}
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  예상 퇴직금
                </p>
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(result.severancePay)}
                </p>
              </div>

              {/* 상세 내역 */}
              <div>
                <h4 className="font-semibold mb-3">산정 내역</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">입사일</span>
                    <span className="font-medium">{result.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">퇴사일</span>
                    <span className="font-medium">{result.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">총 재직일수</span>
                    <span className="font-medium">
                      {result.totalDays.toLocaleString()}일 ({result.totalYears}
                      년)
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        월 평균임금
                      </span>
                      <span className="font-medium">
                        {formatCurrency(result.monthlyAvgWage)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        1일 평균임금
                      </span>
                      <span className="font-medium">
                        {formatCurrency(result.dailyAvgWage)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-primary">
                    <span>퇴직금</span>
                    <span>{formatCurrency(result.severancePay)}</span>
                  </div>
                </div>
              </div>

              {/* 산정 공식 */}
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">산정 공식</p>
                <p className="text-sm font-medium">
                  1일 평균임금 x 30일 x (재직일수 / 365)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(result.dailyAvgWage)} x 30 x (
                  {result.totalDays} / 365) ={' '}
                  {formatCurrency(result.severancePay)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar (Right 40%) */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">퇴직금 안내</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              퇴직금은 <strong>1년 이상</strong> 근무한 근로자가 퇴직 시
              받을 수 있습니다.
            </p>
            <p>
              <strong>월 평균임금</strong>에는 기본급, 고정수당, 상여금(연간
              합계의 1/12)이 포함됩니다.
            </p>
            <p>
              퇴직소득세는 별도로 공제되며, 실수령액은 다를 수 있습니다.
            </p>
          </CardContent>
        </Card>

        {/* Related Tools */}
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
              href="/currency"
              className="block p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <p className="font-medium text-sm">환율 계산기</p>
              <p className="text-xs text-muted-foreground">
                실시간 환율 변환
              </p>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
