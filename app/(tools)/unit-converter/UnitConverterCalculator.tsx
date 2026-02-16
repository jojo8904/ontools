'use client'

import { useUnitConverter } from '@/features/unit-converter/hooks/useUnitConverter'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { UNIT_CATEGORIES, UnitCategory } from '@/features/unit-converter/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

const categoryTabs: { key: UnitCategory; label: string }[] = [
  { key: 'length', label: '길이' },
  { key: 'weight', label: '무게' },
  { key: 'temperature', label: '온도' },
  { key: 'time', label: '시간' },
]

function formatResult(value: number): string {
  if (Number.isInteger(value)) return value.toLocaleString('ko-KR')
  // 소수점 이하 불필요한 0 제거
  const formatted = value.toFixed(6).replace(/\.?0+$/, '')
  const parts = formatted.split('.')
  parts[0] = Number(parts[0]).toLocaleString('ko-KR')
  return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0]
}

function getUnitLabel(category: UnitCategory, code: string): string {
  const unit = UNIT_CATEGORIES[category].units.find((u) => u.code === code)
  return unit?.label || code
}

export function UnitConverterCalculator() {
  const {
    category,
    value,
    fromUnit,
    toUnit,
    result,
    changeCategory,
    setValue,
    setFromUnit,
    setToUnit,
    swap,
    calculate,
    reset,
  } = useUnitConverter()

  const units = UNIT_CATEGORIES[category].units

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculator (Left 60%) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => changeCategory(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                category === tab.key
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
            <CardTitle>{UNIT_CATEGORIES[category].label} 변환</CardTitle>
            <CardDescription>값을 입력하고 단위를 선택하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 값 입력 */}
            <div>
              <label className="block text-sm font-medium mb-2">값</label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                placeholder="1"
                step="any"
              />
            </div>

            {/* From / Swap / To */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">변환 전</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {units.map((u) => (
                    <option key={u.code} value={u.code}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={swap}
                className="h-10 px-3 rounded-md border border-input hover:bg-muted transition-colors text-sm font-medium"
                title="단위 교환"
              >
                ⇄
              </button>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">변환 후</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {units.map((u) => (
                    <option key={u.code} value={u.code}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={calculate} className="flex-1">
                변환하기
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
              <CardTitle>변환 결과</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 주요 결과 */}
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {formatResult(result.value)} {getUnitLabel(category, result.fromUnit)}
                </p>
                <p className="text-4xl font-bold text-primary">
                  {formatResult(result.result)}
                </p>
                <p className="text-lg text-muted-foreground mt-1">
                  {getUnitLabel(category, result.toUnit)}
                </p>
              </div>

              {/* 시간 분해 표시 */}
              {result.timeBreakdown && (
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    시간 분해
                  </p>
                  <p className="text-2xl font-semibold">
                    {result.timeBreakdown.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    = {formatResult(result.value * (category === 'time' ? 1 : 0))}{' '}
                    {getUnitLabel(category, result.fromUnit)} 기준
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar (Right 40%) */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">단위 변환 안내</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>길이</strong>: cm, m, km, inch, ft, mile 간 변환
            </p>
            <p>
              <strong>무게</strong>: g, kg, lb(파운드), oz(온스) 간 변환
            </p>
            <p>
              <strong>온도</strong>: 섭씨(°C)와 화씨(°F) 간 변환
            </p>
            <p>
              <strong>시간</strong>: 초, 분, 시간, 일 간 변환 및 분해 표시
            </p>
          </CardContent>
        </Card>

        <YouTubeSection category="unit" />
      </div>
    </div>
  )
}
