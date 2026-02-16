'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

type Gender = 'male' | 'female'
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: '비활동 (운동 거의 안 함)',
  light: '가벼운 활동 (주 1~3회)',
  moderate: '보통 활동 (주 3~5회)',
  active: '활발한 활동 (주 6~7회)',
  very_active: '매우 활발 (하루 2회 이상)',
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

interface CalorieResult {
  bmr: number
  tdee: number
  dietCalorie: number
  maintainCalorie: number
  bulkCalorie: number
}

function calculateBMR(gender: Gender, weight: number, height: number, age: number): number {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  }
  return 10 * weight + 6.25 * height - 5 * age - 161
}

export function CalorieCalculator() {
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState<ActivityLevel>('moderate')
  const [result, setResult] = useState<CalorieResult | null>(null)

  const handleCalculate = () => {
    const a = parseInt(age)
    const h = parseFloat(height)
    const w = parseFloat(weight)
    if (!a || a <= 0 || !h || h <= 0 || !w || w <= 0) return

    const bmr = calculateBMR(gender, w, h, a)
    const tdee = bmr * ACTIVITY_MULTIPLIERS[activity]

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dietCalorie: Math.round(tdee - 500),
      maintainCalorie: Math.round(tdee),
      bulkCalorie: Math.round(tdee + 500),
    })
  }

  const handleReset = () => {
    setAge('')
    setHeight('')
    setWeight('')
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>신체 정보 입력</CardTitle>
          <CardDescription>
            성별, 나이, 키, 체중, 활동량을 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 성별 */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">성별</label>
            <div className="flex gap-2">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  gender === 'male'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                남성
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  gender === 'female'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                여성
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">나이 (세)</label>
            <Input
              type="number"
              placeholder="예: 30"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">키 (cm)</label>
            <Input
              type="number"
              step="0.1"
              placeholder="예: 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">체중 (kg)</label>
            <Input
              type="number"
              step="0.1"
              placeholder="예: 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          {/* 활동량 */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">활동량</label>
            <div className="space-y-1.5">
              {(Object.entries(ACTIVITY_LABELS) as [ActivityLevel, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActivity(key)}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors ${
                      activity === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleCalculate} className="flex-1" size="lg">
              계산하기
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg">
              초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>계산 결과</CardTitle>
            <CardDescription>
              {gender === 'male' ? '남성' : '여성'} / {age}세 / {height}cm / {weight}kg / {ACTIVITY_LABELS[activity].split(' (')[0]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* BMR & TDEE Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-600 font-semibold mb-1">
                  기초대사량 (BMR)
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {result.bmr.toLocaleString()} kcal
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <p className="text-xs text-emerald-600 font-semibold mb-1">
                  일일 권장 칼로리 (TDEE)
                </p>
                <p className="text-xl font-bold text-emerald-900">
                  {result.tdee.toLocaleString()} kcal
                </p>
              </div>
            </div>

            {/* 목표별 칼로리 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">목표별 권장 칼로리</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-rose-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-rose-600 font-semibold mb-1">
                    다이어트 (-500)
                  </p>
                  <p className="text-lg font-bold text-rose-900">
                    {result.dietCalorie.toLocaleString()}
                  </p>
                  <p className="text-xs text-rose-500 mt-0.5">kcal/일</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center border-2 border-gray-200">
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    유지
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {result.maintainCalorie.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">kcal/일</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-amber-600 font-semibold mb-1">
                    증량 (+500)
                  </p>
                  <p className="text-lg font-bold text-amber-900">
                    {result.bulkCalorie.toLocaleString()}
                  </p>
                  <p className="text-xs text-amber-500 mt-0.5">kcal/일</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">기초대사량 (BMR)</span>
                <span className="font-medium">
                  {result.bmr.toLocaleString()} kcal
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">활동 계수</span>
                <span className="font-medium">
                  x {ACTIVITY_MULTIPLIERS[activity]}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-300 font-bold">
                <span>일일 소비 칼로리 (TDEE)</span>
                <span>{result.tdee.toLocaleString()} kcal</span>
              </div>
              <div className="flex justify-between py-2 border-b text-rose-600">
                <span>다이어트 목표 (TDEE - 500)</span>
                <span className="font-medium">{result.dietCalorie.toLocaleString()} kcal</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">유지 목표</span>
                <span className="font-medium">{result.maintainCalorie.toLocaleString()} kcal</span>
              </div>
              <div className="flex justify-between py-2 text-amber-600">
                <span>증량 목표 (TDEE + 500)</span>
                <span className="font-medium">{result.bulkCalorie.toLocaleString()} kcal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
