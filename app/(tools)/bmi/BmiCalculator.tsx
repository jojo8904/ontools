'use client'

import { useBmiCalculator } from '@/features/bmi/hooks/useBmiCalculator'
import {
  getCategoryColor,
  getCategoryBgColor,
  getIdealWeight,
} from '@/features/bmi/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

export function BmiCalculator() {
  const { input, result, calculate, updateInput, reset } = useBmiCalculator()

  const idealWeight = result ? getIdealWeight(result.height) : null

  return (
    <div className="space-y-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>신체 정보 입력</CardTitle>
            <CardDescription>
              키와 몸무게를 입력하여 BMI를 계산하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 신장 입력 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                신장 (cm)
              </label>
              <Input
                type="number"
                value={input.height}
                onChange={(e) =>
                  updateInput({ height: Number(e.target.value) })
                }
                placeholder="170"
                step="0.1"
                min="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                예: 170.5cm
              </p>
            </div>

            {/* 체중 입력 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                체중 (kg)
              </label>
              <Input
                type="number"
                value={input.weight}
                onChange={(e) =>
                  updateInput({ weight: Number(e.target.value) })
                }
                placeholder="70"
                step="0.1"
                min="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                예: 70.5kg
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={calculate} className="flex-1">
                BMI 계산
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
              <CardTitle>BMI 계산 결과</CardTitle>
              <CardDescription>당신의 체중 상태 분석</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 주요 결과 */}
              <div
                className={`${getCategoryBgColor(result.category)} rounded-lg p-6`}
              >
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-1">
                    BMI 지수
                  </p>
                  <p
                    className={`text-5xl font-bold ${getCategoryColor(result.category)}`}
                  >
                    {result.bmi}
                  </p>
                  <div className="mt-4 space-y-1">
                    <p
                      className={`text-lg font-semibold ${getCategoryColor(result.category)}`}
                    >
                      한국: {result.categoryLabel}
                    </p>
                    <p
                      className={`text-sm ${getCategoryColor(result.categoryWho)}`}
                    >
                      WHO: {result.categoryWhoLabel}
                    </p>
                  </div>
                </div>

                {/* BMI 분류 차트 (한국 기준 / WHO 기준) */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {/* 한국 기준 (대한비만학회) */}
                  <div className="space-y-2">
                    <p className="font-semibold text-xs text-muted-foreground mb-2">
                      한국 기준 (대한비만학회)
                    </p>
                    <div className="flex justify-between items-center">
                      <span>저체중</span>
                      <span className="text-muted-foreground text-xs">
                        &lt; 18.5
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-green-600">
                      <span>정상</span>
                      <span className="text-xs">18.5 ~ 23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>과체중</span>
                      <span className="text-muted-foreground text-xs">
                        23 ~ 25
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>비만</span>
                      <span className="text-muted-foreground text-xs">
                        25 ~ 30
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>고도비만</span>
                      <span className="text-muted-foreground text-xs">
                        ≥ 30
                      </span>
                    </div>
                  </div>

                  {/* WHO 국제 기준 */}
                  <div className="space-y-2">
                    <p className="font-semibold text-xs text-muted-foreground mb-2">
                      WHO 국제 기준
                    </p>
                    <div className="flex justify-between items-center">
                      <span>저체중</span>
                      <span className="text-muted-foreground text-xs">
                        &lt; 18.5
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-green-600">
                      <span>정상</span>
                      <span className="text-xs">18.5 ~ 25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>과체중</span>
                      <span className="text-muted-foreground text-xs">
                        25 ~ 30
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>비만</span>
                      <span className="text-muted-foreground text-xs">
                        30 ~ 35
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>고도비만</span>
                      <span className="text-muted-foreground text-xs">
                        ≥ 35
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 건강 상태 */}
              <div>
                <h4 className="font-semibold mb-2">건강 상태</h4>
                <p className="text-sm text-muted-foreground">
                  {result.healthStatus}
                </p>
              </div>

              {/* 권장사항 */}
              <div>
                <h4 className="font-semibold mb-2">권장사항</h4>
                <p className="text-sm text-muted-foreground">
                  {result.recommendation}
                </p>
              </div>

              {/* 표준 체중 */}
              {idealWeight && (
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm font-semibold mb-2">
                    신장 {result.height}cm의 표준 체중 범위
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {idealWeight.min}kg ~ {idealWeight.max}kg
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    * 한국 기준 정상 BMI (18.5~23) 적용
                  </p>
                </div>
              )}

              {/* 안내 */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  ⚠️ <strong>안내</strong>
                  <br />
                  BMI는 참고 지표일 뿐이며, 근육량, 체지방률 등은 고려하지
                  않습니다. 정확한 건강 상태는 전문의와 상담하세요.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  )
}
