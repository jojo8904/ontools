'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

const ROWS = 12
const COL_GAP = 88
const PAD_X = 48
const PAD_Y = 16
const ROW_H = 26
const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

type Phase = 'setup' | 'play'

function makeRungs(n: number): boolean[][] {
  const rungs: boolean[][] = []
  for (let r = 0; r < ROWS; r++) {
    const row: boolean[] = new Array(Math.max(0, n - 1)).fill(false)
    for (let c = 0; c < n - 1; c++) {
      if (c > 0 && row[c - 1]) continue
      if (Math.random() < 0.36) row[c] = true
    }
    rungs.push(row)
  }
  // 각 세로줄 쌍에 최소 1개 보장 (없으면 경로가 직선이라 재미없음)
  for (let c = 0; c < n - 1; c++) {
    if (!rungs.some((row) => row[c])) {
      const candidates = []
      for (let r = 0; r < ROWS; r++) {
        if (!(c > 0 && rungs[r][c - 1]) && !(c < n - 2 && rungs[r][c + 1])) candidates.push(r)
      }
      const r = candidates[Math.floor(Math.random() * candidates.length)] ?? 0
      rungs[r][c] = true
    }
  }
  return rungs
}

/** 시작 열 → 경로 좌표들과 도착 열 */
function tracePath(rungs: boolean[][], start: number) {
  const x = (c: number) => PAD_X + c * COL_GAP
  const yTop = PAD_Y
  const yBot = PAD_Y + (ROWS + 1) * ROW_H
  let col = start
  const pts: [number, number][] = [[x(col), yTop]]
  for (let r = 0; r < ROWS; r++) {
    const y = PAD_Y + (r + 1) * ROW_H
    if (rungs[r][col]) {
      pts.push([x(col), y], [x(col + 1), y])
      col++
    } else if (col > 0 && rungs[r][col - 1]) {
      pts.push([x(col), y], [x(col - 1), y])
      col--
    }
  }
  pts.push([x(col), yBot])
  return { pts, end: col }
}

export function LadderGame() {
  const [count, setCount] = useState(4)
  const [names, setNames] = useState<string[]>(['참가자1', '참가자2', '참가자3', '참가자4'])
  const [results, setResults] = useState<string[]>(['당첨 🎉', '꽝', '꽝', '꽝'])
  const [phase, setPhase] = useState<Phase>('setup')
  const [rungs, setRungs] = useState<boolean[][]>([])
  const [revealed, setRevealed] = useState<Record<number, number>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const animating = useRef(false)

  const changeCount = (n: number) => {
    setCount(n)
    setNames((prev) => Array.from({ length: n }, (_, i) => prev[i] || `참가자${i + 1}`))
    setResults((prev) => Array.from({ length: n }, (_, i) => prev[i] || (i === 0 ? '당첨 🎉' : '꽝')))
  }

  const width = PAD_X * 2 + (count - 1) * COL_GAP
  const height = PAD_Y * 2 + (ROWS + 1) * ROW_H

  const drawBase = useCallback(
    (ctx: CanvasRenderingContext2D, currentRungs: boolean[][], currentRevealed: Record<number, number>) => {
      ctx.clearRect(0, 0, width, height)
      const x = (c: number) => PAD_X + c * COL_GAP
      const yTop = PAD_Y
      const yBot = PAD_Y + (ROWS + 1) * ROW_H
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      for (let c = 0; c < count; c++) {
        ctx.beginPath()
        ctx.moveTo(x(c), yTop)
        ctx.lineTo(x(c), yBot)
        ctx.stroke()
      }
      for (let r = 0; r < ROWS; r++) {
        const y = PAD_Y + (r + 1) * ROW_H
        for (let c = 0; c < count - 1; c++) {
          if (currentRungs[r]?.[c]) {
            ctx.beginPath()
            ctx.moveTo(x(c), y)
            ctx.lineTo(x(c + 1), y)
            ctx.stroke()
          }
        }
      }
      // 이미 공개된 경로들
      for (const [startStr] of Object.entries(currentRevealed)) {
        const start = parseInt(startStr, 10)
        const { pts } = tracePath(currentRungs, start)
        ctx.strokeStyle = COLORS[start % COLORS.length]
        ctx.lineWidth = 3.5
        ctx.beginPath()
        pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)))
        ctx.stroke()
      }
    },
    [count, width, height],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || phase !== 'play') return
    const ctx = canvas.getContext('2d')!
    drawBase(ctx, rungs, revealed)
  }, [phase, rungs, revealed, drawBase])

  const start = () => {
    cancelAnimationFrame(animRef.current)
    animating.current = false
    setRungs(makeRungs(count))
    setRevealed({})
    setPhase('play')
  }

  const reveal = (startCol: number) => {
    if (animating.current || revealed[startCol] !== undefined) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const { pts, end } = tracePath(rungs, startCol)
    const segs: number[] = []
    let total = 0
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
      segs.push(d)
      total += d
    }
    animating.current = true
    let t0: number | null = null
    const dur = 900
    const tick = (now: number) => {
      t0 ??= now
      const p = Math.min(1, (now - t0) / dur)
      let dist = p * total
      drawBase(ctx, rungs, revealed)
      ctx.strokeStyle = COLORS[startCol % COLORS.length]
      ctx.lineWidth = 3.5
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      for (let i = 1; i < pts.length && dist > 0; i++) {
        const d = segs[i - 1]
        if (dist >= d) {
          ctx.lineTo(pts[i][0], pts[i][1])
          dist -= d
        } else {
          const t = dist / d
          ctx.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t)
          dist = 0
        }
      }
      ctx.stroke()
      if (p < 1) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        animating.current = false
        setRevealed((prev) => ({ ...prev, [startCol]: end }))
      }
    }
    animRef.current = requestAnimationFrame(tick)
  }

  const revealAll = () => {
    if (animating.current) return
    const all: Record<number, number> = {}
    for (let c = 0; c < count; c++) all[c] = tracePath(rungs, c).end
    setRevealed(all)
  }

  if (phase === 'setup') {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <span className="mb-2 block text-sm font-medium text-gray-700">인원 수</span>
          <div className="flex gap-2">
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button
                key={n}
                onClick={() => changeCount(n)}
                className={`h-10 w-10 rounded-lg text-sm font-bold ${count === n ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <span className="mb-2 block text-sm font-medium text-gray-700">참가자 이름</span>
            <div className="space-y-2">
              {names.map((n, i) => (
                <input
                  key={i}
                  type="text"
                  value={n}
                  onChange={(e) => setNames((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400"
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <span className="mb-2 block text-sm font-medium text-gray-700">결과 (당첨·꽝·벌칙 등)</span>
            <div className="space-y-2">
              {results.map((r, i) => (
                <input
                  key={i}
                  type="text"
                  value={r}
                  onChange={(e) => setResults((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400"
                />
              ))}
            </div>
          </div>
        </div>

        <Button onClick={start} size="lg" className="w-full">
          사다리 만들기
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        <strong>이름을 클릭</strong>하면 사다리를 타고 내려가요. 결과는 아래에서 확인!
      </p>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div style={{ width }} className="mx-auto">
          {/* 이름 (클릭) */}
          <div className="flex">
            {names.map((n, i) => (
              <div key={i} style={{ width: i === 0 ? PAD_X + COL_GAP / 2 : COL_GAP }} className={i === 0 ? 'pl-0' : ''}>
                <button
                  onClick={() => reveal(i)}
                  style={{ borderColor: COLORS[i % COLORS.length], marginLeft: i === 0 ? PAD_X - COL_GAP / 2 + 4 : 4 }}
                  className={`w-[80px] truncate rounded-lg border-2 bg-white px-1 py-1.5 text-xs font-bold ${
                    revealed[i] !== undefined ? 'opacity-60' : 'hover:bg-blue-50'
                  }`}
                >
                  {n || `참가자${i + 1}`}
                </button>
              </div>
            ))}
          </div>
          <canvas ref={canvasRef} width={width} height={height} className="block" />
          {/* 결과 */}
          <div className="flex">
            {results.map((r, i) => {
              const winner = Object.entries(revealed).find(([, end]) => end === i)?.[0]
              return (
                <div key={i} style={{ width: i === 0 ? PAD_X + COL_GAP / 2 : COL_GAP }}>
                  <div
                    style={{ marginLeft: i === 0 ? PAD_X - COL_GAP / 2 + 4 : 4 }}
                    className={`w-[80px] truncate rounded-lg px-1 py-1.5 text-center text-xs font-bold ${
                      winner !== undefined ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {r || '결과'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 공개된 결과 요약 */}
      {Object.keys(revealed).length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
          {Object.entries(revealed).map(([s, e]) => (
            <p key={s} className="py-0.5">
              <strong style={{ color: COLORS[parseInt(s, 10) % COLORS.length] }}>{names[parseInt(s, 10)]}</strong>
              {' → '}
              <strong>{results[e]}</strong>
            </p>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={revealAll} variant="outline" className="flex-1">
          전체 결과 한 번에 보기
        </Button>
        <Button onClick={start} variant="outline" className="flex-1">
          사다리 새로 섞기
        </Button>
        <Button onClick={() => setPhase('setup')} variant="ghost">
          설정으로
        </Button>
      </div>
    </div>
  )
}
