'use client'

import { useDdayCalculator } from '@/features/dday/hooks/useDdayCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
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
  { key: 'countdown' as const, label: 'D-day 카운트다운' },
  { key: 'between' as const, label: '날짜 간격 계산' },
]

export function DdayCalculator() {
  const {
    mode,
    title,
    targetDate,
    startDate,
    endDate,
    countdownResult,
    betweenResult,
    error,
    changeMode,
    setTitle,
    setTargetDate,
    setStartDate,
    setEndDate,
    calculate,
    reset,
  } = useDdayCalculator()

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
              {mode === 'countdown' ? 'D-day 카운트다운' : '날짜 간격 계산'}
            </CardTitle>
            <CardDescription>
              {mode === 'countdown'
                ? '목표 날짜까지 남은 일수를 계산합니다'
                : '두 날짜 사이의 일수를 계산합니다'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === 'countdown' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    제목 (선택)
                  </label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 시험일, 여행, 생일"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    목표 날짜
                  </label>
                  <Input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    시작일
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    종료일
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
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

        {/* Countdown Result */}
        {countdownResult && (
          <Card>
            <CardHeader>
              <CardTitle>계산 결과</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {countdownResult.title}
                </p>
                <p className="text-5xl font-bold text-primary">
                  {countdownResult.label}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {countdownResult.targetDate}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">상세 정보</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">목표 날짜</span>
                    <span className="font-medium">
                      {countdownResult.targetDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {countdownResult.isPast ? '경과 일수' : '남은 일수'}
                    </span>
                    <span className="font-medium">
                      {Math.abs(countdownResult.dday).toLocaleString()}일
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-muted-foreground">기간 분해</span>
                    <span className="font-medium">
                      {countdownResult.breakdown.label}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Between Result */}
        {betweenResult && (
          <Card>
            <CardHeader>
              <CardTitle>계산 결과</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  두 날짜 사이
                </p>
                <p className="text-5xl font-bold text-primary">
                  {Math.abs(betweenResult.totalDays).toLocaleString()}일
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">상세 정보</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">시작일</span>
                    <span className="font-medium">
                      {betweenResult.startDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">종료일</span>
                    <span className="font-medium">
                      {betweenResult.endDate}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-muted-foreground">총 일수</span>
                    <span className="font-medium">
                      {Math.abs(betweenResult.totalDays).toLocaleString()}일
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">기간 분해</span>
                    <span className="font-medium">
                      {betweenResult.breakdown.label}
                    </span>
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
            <CardTitle className="text-lg">D-day 안내</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>D-day 카운트다운</strong>: 오늘 기준으로 목표 날짜까지
              남은 일수 또는 경과 일수를 계산합니다.
            </p>
            <p>
              <strong>날짜 간격 계산</strong>: 두 날짜 사이의 일수를
              계산합니다.
            </p>
            <p>
              기간 분해는 약 1년=365일, 1개월=30일 기준으로 환산합니다.
            </p>
          </CardContent>
        </Card>

        <YouTubeSection category="dday" />
      </div>
    </div>
  )
}
