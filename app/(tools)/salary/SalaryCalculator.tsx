'use client'

import { useSalaryCalculator } from '@/features/salary/hooks/useSalaryCalculator'
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

export function SalaryCalculator() {
  const { input, result, calculate, updateInput, reset } = useSalaryCalculator()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculator (Left 60%) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>정보 입력</CardTitle>
            <CardDescription>
              연봉과 부양가족 정보를 입력하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 연봉 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                연봉 (원)
              </label>
              <Input
                type="number"
                value={input.annualSalary}
                onChange={(e) =>
                  updateInput({ annualSalary: Number(e.target.value) })
                }
                placeholder="30000000"
                step="1000000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                예: 3,000만원 = 30000000
              </p>
            </div>

            {/* 부양가족 수 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                부양가족 수 (본인 제외)
              </label>
              <Input
                type="number"
                value={input.dependents}
                onChange={(e) =>
                  updateInput({ dependents: Number(e.target.value) })
                }
                placeholder="0"
                min="0"
              />
            </div>

            {/* 장애인 여부 */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasDisability"
                checked={input.hasDisability}
                onChange={(e) =>
                  updateInput({ hasDisability: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label htmlFor="hasDisability" className="text-sm font-medium">
                장애인 공제 적용
              </label>
            </div>

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
              <CardDescription>월 실수령액 및 상세 내역</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 주요 결과 */}
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  월 실수령액
                </p>
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(result.monthlyTakeHome)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  연 실수령액: {formatCurrency(result.yearlyTakeHome)}
                </p>
              </div>

              {/* 상세 내역 */}
              <div>
                <h4 className="font-semibold mb-3">상세 내역</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">월급 (세전)</span>
                    <span className="font-medium">
                      {formatCurrency(result.monthlySalary)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-red-600">
                      <span>소득세</span>
                      <span>-{formatCurrency(result.incomeTax)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>주민세</span>
                      <span>-{formatCurrency(result.residentTax)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>국민연금</span>
                      <span>-{formatCurrency(result.nationalPension)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>건강보험</span>
                      <span>-{formatCurrency(result.healthInsurance)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>장기요양</span>
                      <span>-{formatCurrency(result.longTermCare)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>고용보험</span>
                      <span>-{formatCurrency(result.employmentInsurance)}</span>
                    </div>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-primary">
                    <span>실수령액</span>
                    <span>{formatCurrency(result.monthlyTakeHome)}</span>
                  </div>
                </div>
              </div>

              {/* 실수령률 */}
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">실수령률</p>
                <p className="text-2xl font-semibold">
                  {(
                    (result.monthlyTakeHome / result.monthlySalary) *
                    100
                  ).toFixed(1)}
                  %
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
            <CardTitle className="text-lg">관련 뉴스</CardTitle>
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
