'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

type Phase = 'idle' | 'playing' | 'over'

const H = 180 // 게임 높이(px, 논리 좌표)
const GROUND = H - 26
const CAT = 46 // 고양이 크기
const GRAVITY = 0.62
const JUMP_V = -11.5

interface Obstacle {
  x: number
  w: number
  h: number
}

interface Game {
  catY: number
  vy: number
  jumping: boolean
  obstacles: Obstacle[]
  speed: number
  distance: number
  spawnIn: number
  width: number
}

function newGame(width: number): Game {
  return {
    catY: GROUND - CAT,
    vy: 0,
    jumping: false,
    obstacles: [],
    speed: 4.2,
    distance: 0,
    spawnIn: 60,
    width,
  }
}

export function CatRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const catImg = useRef<HTMLImageElement | null>(null)
  const game = useRef<Game>(newGame(800))
  const raf = useRef<number>(0)
  const phaseRef = useRef<Phase>('idle')

  const [phase, setPhase] = useState<Phase>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)

  const setPhaseBoth = (p: Phase) => {
    phaseRef.current = p
    setPhase(p)
  }

  // 마스코트 이미지 로드 + best 점수 로드
  useEffect(() => {
    const img = new Image()
    img.src = '/mascot.png'
    catImg.current = img
    try {
      const b = parseInt(localStorage.getItem('catRunnerBest') || '0', 10)
      if (b > 0) setBest(b)
    } catch {}
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const g = game.current
    const W = g.width

    // 배경 (브랜드 그라데이션)
    const grd = ctx.createLinearGradient(0, 0, 0, H)
    grd.addColorStop(0, '#FFF6EE')
    grd.addColorStop(1, '#EDE7FA')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, W, H)

    // 땅
    ctx.strokeStyle = '#c9b8e6'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, GROUND)
    ctx.lineTo(W, GROUND)
    ctx.stroke()

    // 장애물 (선인장 느낌의 둥근 막대)
    for (const o of g.obstacles) {
      ctx.fillStyle = '#7c9a5e'
      const r = 5
      const x = o.x
      const y = GROUND - o.h
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + o.w, y, x + o.w, y + o.h, r)
      ctx.arcTo(x + o.w, y + o.h, x, y + o.h, r)
      ctx.arcTo(x, y + o.h, x, y, r)
      ctx.arcTo(x, y, x + o.w, y, r)
      ctx.closePath()
      ctx.fill()
    }

    // 고양이
    const catX = 48
    if (catImg.current && catImg.current.complete) {
      ctx.drawImage(catImg.current, catX, g.catY, CAT, CAT)
    } else {
      ctx.fillStyle = '#f7a23b'
      ctx.beginPath()
      ctx.arc(catX + CAT / 2, g.catY + CAT / 2, CAT / 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // 점수
    ctx.fillStyle = '#8a8290'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${Math.floor(g.distance / 10)}`, W - 14, 24)
  }, [])

  const loop = useCallback(() => {
    const g = game.current
    if (phaseRef.current !== 'playing') return

    // 물리
    g.vy += GRAVITY
    g.catY += g.vy
    if (g.catY >= GROUND - CAT) {
      g.catY = GROUND - CAT
      g.vy = 0
      g.jumping = false
    }

    // 속도 점증
    g.distance += g.speed
    g.speed = 4.2 + g.distance / 2400

    // 장애물 스폰
    g.spawnIn -= 1
    if (g.spawnIn <= 0) {
      const h = 24 + Math.floor(Math.random() * 26)
      const w = 16 + Math.floor(Math.random() * 12)
      g.obstacles.push({ x: g.width + 10, w, h })
      // 다음 스폰 간격(속도 반영해 점프 가능하게)
      const base = 70 + Math.floor(Math.random() * 50)
      g.spawnIn = Math.max(38, base - Math.floor(g.distance / 400))
    }

    // 이동 + 충돌
    const catX = 48
    const catBox = { x: catX + 6, y: g.catY + 6, w: CAT - 12, h: CAT - 10 }
    for (const o of g.obstacles) {
      o.x -= g.speed
      const ox = o.x
      const oy = GROUND - o.h
      if (
        catBox.x < ox + o.w &&
        catBox.x + catBox.w > ox &&
        catBox.y < oy + o.h &&
        catBox.y + catBox.h > oy
      ) {
        // 충돌 → 게임오버
        const sc = Math.floor(g.distance / 10)
        setScore(sc)
        setBest((prev) => {
          const nb = Math.max(prev, sc)
          try {
            localStorage.setItem('catRunnerBest', String(nb))
          } catch {}
          return nb
        })
        setPhaseBoth('over')
        draw()
        return
      }
    }
    g.obstacles = g.obstacles.filter((o) => o.x + o.w > -10)

    draw()
    raf.current = requestAnimationFrame(loop)
  }, [draw])

  const start = useCallback(() => {
    const W = wrapRef.current?.clientWidth || 800
    game.current = newGame(W)
    setScore(0)
    setPhaseBoth('playing')
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(loop)
  }, [loop])

  const jump = useCallback(() => {
    const g = game.current
    if (!g.jumping && g.catY >= GROUND - CAT - 1) {
      g.vy = JUMP_V
      g.jumping = true
    }
  }, [])

  // 입력 처리
  const handleAction = useCallback(() => {
    const p = phaseRef.current
    if (p === 'idle' || p === 'over') start()
    else jump()
  }, [start, jump])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        // 게임 중일 때만 스크롤 방지
        if (phaseRef.current === 'playing' || document.activeElement === canvasRef.current) {
          e.preventDefault()
        }
        handleAction()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleAction])

  // 캔버스 사이즈(반응형 + DPR)
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      const wrap = wrapRef.current
      if (!canvas || !wrap) return
      const W = wrap.clientWidth
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.height = `${H}px`
      const ctx = canvas.getContext('2d')!
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      game.current.width = W
      draw()
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [draw])

  // 언마운트 정리
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <div
      ref={wrapRef}
      className="relative w-full select-none overflow-hidden rounded-2xl border border-[#ece6f2] shadow-sm"
      style={{ height: H }}
      onPointerDown={(e) => {
        e.preventDefault()
        handleAction()
      }}
      role="button"
      tabIndex={0}
      aria-label="고양이 점프 게임"
    >
      <canvas ref={canvasRef} className="block w-full" style={{ height: H }} />

      {/* 오버레이 */}
      {phase !== 'playing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/35 backdrop-blur-[1px]">
          {phase === 'idle' ? (
            <>
              <p className="text-lg font-extrabold text-[#241a33]">🐱 고양이 점프</p>
              <p className="mt-1 text-sm text-[#6b6276]">스페이스 / 탭하면 시작 · 장애물을 뛰어넘으세요</p>
              <span className="mt-3 rounded-full bg-[#f97316] px-5 py-2 text-sm font-bold text-white shadow">
                ▶ PRESS START
              </span>
            </>
          ) : (
            <>
              <p className="text-lg font-extrabold text-[#241a33]">게임 오버!</p>
              <p className="mt-1 text-sm text-[#6b6276]">
                점수 <b className="text-[#f97316]">{score}</b>
                {best > 0 && <span className="text-[#9a93a6]"> · 최고 {best}</span>}
              </p>
              <span className="mt-3 rounded-full bg-[#f97316] px-5 py-2 text-sm font-bold text-white shadow">
                다시 시작 ↻
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
