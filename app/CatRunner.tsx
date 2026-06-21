'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

type Phase = 'idle' | 'playing' | 'over'
type ObsType = 'cactus' | 'rock' | 'log'
type Weather = 'clear' | 'rain' | 'snow'

const H = 200
const GROUND = H - 30
const CAT = 52
const GRAVITY = 0.6
const JUMP_V = -11.8
const DAY_CYCLE = 1500 // 프레임 (낮↔밤 한 바퀴)
const LB_KEEP = 10 // 저장하는 순위 수 (이 안에 들면 이름 등록)
const LB_SHOW = 5 // 순위표에 보여주는 수

interface Obstacle {
  x: number
  type: ObsType
  size: number
}
interface Cloud {
  x: number
  y: number
  s: number
  v: number
}
interface Particle {
  x: number
  y: number
  v: number
  d: number
  r: number
}
interface Score {
  name: string
  score: number
  id: number
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
  worldTime: number
  clouds: Cloud[]
  weather: Weather
  weatherIntensity: number
  weatherTimer: number
  particles: Particle[]
  stars: { x: number; y: number; r: number }[]
}

const OBS_SIZE: Record<ObsType, [number, number]> = {
  cactus: [48, 58],
  rock: [40, 50],
  log: [44, 54],
}

// 기본 순위(가짜) — 새 방문자에게 도전 목표를 보여주기 위한 시드
const SEED: Score[] = [
  { name: '야옹대장', score: 9870, id: -1 },
  { name: '츄르도둑', score: 6320, id: -2 },
  { name: '점프왕', score: 3940, id: -3 },
  { name: '골골송', score: 1880, id: -4 },
  { name: '발냥이', score: 760, id: -5 },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function mix(c1: number[], c2: number[], t: number) {
  return `rgb(${Math.round(lerp(c1[0], c2[0], t))},${Math.round(lerp(c1[1], c2[1], t))},${Math.round(lerp(c1[2], c2[2], t))})`
}

const DAY_TOP = [150, 220, 255]
const DAY_BOT = [253, 246, 236]
const NIGHT_TOP = [22, 28, 52]
const NIGHT_BOT = [50, 60, 98]

function makeClouds(W: number): Cloud[] {
  const arr: Cloud[] = []
  for (let i = 0; i < 4; i++) {
    arr.push({ x: Math.random() * W, y: 18 + Math.random() * 60, s: 0.7 + Math.random() * 0.7, v: 0.2 + Math.random() * 0.3 })
  }
  return arr
}
function makeStars(W: number) {
  const arr = []
  for (let i = 0; i < 26; i++) arr.push({ x: Math.random() * W, y: 8 + Math.random() * (GROUND - 50), r: Math.random() * 1.3 + 0.4 })
  return arr
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
    worldTime: Math.random() * DAY_CYCLE,
    clouds: makeClouds(width),
    weather: 'clear',
    weatherIntensity: 0,
    weatherTimer: 360,
    particles: [],
    stars: makeStars(width),
  }
}

export function CatRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgs = useRef<Record<string, HTMLImageElement>>({})
  const game = useRef<Game>(newGame(800))
  const raf = useRef<number>(0)
  const phaseRef = useRef<Phase>('idle')
  const nameInputRef = useRef<HTMLInputElement>(null)
  const awaitingName = useRef(false)
  const boardRef = useRef<Score[]>([])

  const [phase, setPhase] = useState<Phase>('idle')
  const [score, setScore] = useState(0)
  const [board, setBoard] = useState<Score[]>([])
  const [nameValue, setNameValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [myRow, setMyRow] = useState(-1)

  const setPhaseBoth = (p: Phase) => {
    phaseRef.current = p
    setPhase(p)
  }

  useEffect(() => {
    boardRef.current = board
  }, [board])

  // 스프라이트 + 순위 로드
  useEffect(() => {
    ;['cat', 'cactus', 'rock', 'log'].forEach((name) => {
      const img = new Image()
      img.src = `/game/${name}.png`
      imgs.current[name] = img
    })
    try {
      const raw = localStorage.getItem('catRunnerBoard')
      if (raw) {
        setBoard(JSON.parse(raw))
      } else {
        const oldBest = parseInt(localStorage.getItem('catRunnerBest') || '0', 10)
        const seed = [...SEED]
        if (oldBest > 0) seed.push({ name: '나', score: oldBest, id: 1 })
        setBoard(seed.sort((a, b) => b.score - a.score).slice(0, LB_KEEP))
      }
    } catch {
      setBoard([...SEED])
    }
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const g = game.current
    const W = g.width

    const night = (1 - Math.cos((g.worldTime / DAY_CYCLE) * Math.PI * 2)) / 2
    const grd = ctx.createLinearGradient(0, 0, 0, H)
    grd.addColorStop(0, mix(DAY_TOP, NIGHT_TOP, night))
    grd.addColorStop(1, mix(DAY_BOT, NIGHT_BOT, night))
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, W, H)

    if (night > 0.35) {
      ctx.fillStyle = `rgba(255,255,255,${(night - 0.35) * 1.3})`
      for (const s of g.stars) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    const sunX = W * 0.82
    ctx.beginPath()
    ctx.arc(sunX, 40, 16, 0, Math.PI * 2)
    ctx.fillStyle = night < 0.5 ? `rgba(255,221,120,${1 - night})` : `rgba(240,240,225,${night})`
    ctx.fill()

    for (const c of g.clouds) {
      ctx.fillStyle = `rgba(255,255,255,${0.85 - night * 0.45})`
      const r = 13 * c.s
      ctx.beginPath()
      ctx.arc(c.x, c.y, r, 0, Math.PI * 2)
      ctx.arc(c.x + r, c.y + 4, r * 0.85, 0, Math.PI * 2)
      ctx.arc(c.x - r, c.y + 5, r * 0.8, 0, Math.PI * 2)
      ctx.arc(c.x + r * 0.4, c.y - r * 0.5, r * 0.75, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = mix([214, 233, 196], [40, 55, 60], night)
    ctx.fillRect(0, GROUND, W, H - GROUND)
    ctx.strokeStyle = mix([150, 180, 130], [70, 85, 90], night)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, GROUND)
    ctx.lineTo(W, GROUND)
    ctx.stroke()

    for (const o of g.obstacles) {
      const img = imgs.current[o.type]
      if (img && img.complete) {
        ctx.drawImage(img, o.x, GROUND - o.size + 2, o.size, o.size)
      } else {
        ctx.fillStyle = '#7c9a5e'
        ctx.fillRect(o.x + o.size * 0.25, GROUND - o.size * 0.7, o.size * 0.5, o.size * 0.7)
      }
    }

    const catX = 46
    const bob = !g.jumping && phaseRef.current === 'playing' ? Math.sin(g.worldTime * 0.4) * 2 : 0
    const cat = imgs.current['cat']
    if (cat && cat.complete) {
      ctx.drawImage(cat, catX, g.catY + bob, CAT, CAT)
    } else {
      ctx.fillStyle = '#f7a23b'
      ctx.beginPath()
      ctx.arc(catX + CAT / 2, g.catY + CAT / 2, CAT / 2, 0, Math.PI * 2)
      ctx.fill()
    }

    if (g.weatherIntensity > 0.02 && g.weather !== 'clear') {
      if (g.weather === 'rain') {
        ctx.strokeStyle = `rgba(140,180,230,${0.5 * g.weatherIntensity})`
        ctx.lineWidth = 1.5
        for (const p of g.particles) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - 2, p.y + p.r * 3)
          ctx.stroke()
        }
      } else {
        ctx.fillStyle = `rgba(255,255,255,${0.85 * g.weatherIntensity})`
        for (const p of g.particles) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // 점수 + 속도
    ctx.textAlign = 'right'
    ctx.fillStyle = night > 0.5 ? 'rgba(255,255,255,0.9)' : 'rgba(90,80,100,0.9)'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText(`${Math.floor(g.distance / 10)}`, W - 14, 24)
    ctx.font = 'bold 11px sans-serif'
    ctx.fillStyle = night > 0.5 ? 'rgba(255,210,110,0.95)' : 'rgba(249,115,22,0.92)'
    ctx.fillText(`속도 x${(g.speed / 4.2).toFixed(1)}`, W - 14, 40)
  }, [])

  const stepWorld = (g: Game) => {
    g.worldTime += 1
    for (const c of g.clouds) {
      c.x -= c.v
      if (c.x < -40) {
        c.x = g.width + 40
        c.y = 18 + Math.random() * 60
      }
    }
    g.weatherTimer -= 1
    if (g.weatherTimer <= 0) {
      const seq: Weather[] = ['clear', 'rain', 'clear', 'snow']
      g.weather = seq[Math.floor(Math.random() * seq.length)]
      g.weatherTimer = 420 + Math.floor(Math.random() * 360)
    }
    const target = g.weather === 'clear' ? 0 : 1
    g.weatherIntensity += (target - g.weatherIntensity) * 0.02
    if (g.weather !== 'clear' && g.weatherIntensity > 0.05) {
      const want = g.weather === 'rain' ? 90 : 60
      while (g.particles.length < want * g.weatherIntensity) {
        g.particles.push({
          x: Math.random() * g.width,
          y: Math.random() * -H,
          v: g.weather === 'rain' ? 7 + Math.random() * 4 : 1 + Math.random() * 1.5,
          d: g.weather === 'snow' ? (Math.random() - 0.5) * 0.8 : -1.5,
          r: g.weather === 'rain' ? 2 + Math.random() * 2 : 1.2 + Math.random() * 1.8,
        })
      }
    }
    for (const p of g.particles) {
      p.y += p.v
      p.x += p.d
      if (p.y > GROUND) {
        p.y = Math.random() * -20
        p.x = Math.random() * g.width
      }
    }
    if (g.weather === 'clear') g.particles = g.particles.filter((_, i) => i < g.particles.length * 0.96)
  }

  const loop = useCallback(() => {
    const g = game.current
    if (phaseRef.current !== 'playing') return

    stepWorld(g)

    g.vy += GRAVITY
    g.catY += g.vy
    if (g.catY >= GROUND - CAT) {
      g.catY = GROUND - CAT
      g.vy = 0
      g.jumping = false
    }

    g.distance += g.speed
    g.speed = 4.2 + g.distance / 2200

    // 스폰 (간격 변주 + 가끔 2개 붙여서)
    g.spawnIn -= 1
    if (g.spawnIn <= 0) {
      const pick = (): Obstacle => {
        const types: ObsType[] = ['cactus', 'rock', 'log']
        const type = types[Math.floor(Math.random() * types.length)]
        const [lo, hi] = OBS_SIZE[type]
        return { x: g.width + 10, type, size: lo + Math.floor(Math.random() * (hi - lo)) }
      }
      const first = pick()
      g.obstacles.push(first)
      const doubleChance = g.speed < 7 ? 0.28 : 0.14
      let wasDouble = false
      if (Math.random() < doubleChance) {
        const second = pick()
        second.size = Math.min(second.size, 46)
        second.x = first.x + first.size + 3 + Math.floor(Math.random() * 6)
        g.obstacles.push(second)
        wasDouble = true
      }
      let base = 60 + Math.floor(Math.random() * 95)
      if (Math.random() < 0.18) base += 70
      if (wasDouble) base += 22
      g.spawnIn = Math.max(44, base - Math.floor(g.distance / 420))
    }

    const catX = 46
    const cb = { x: catX + CAT * 0.22, y: g.catY + CAT * 0.2, w: CAT * 0.56, h: CAT * 0.72 }
    for (const o of g.obstacles) {
      o.x -= g.speed
      const ob = { x: o.x + o.size * 0.22, y: GROUND - o.size * 0.72, w: o.size * 0.56, h: o.size * 0.72 }
      if (cb.x < ob.x + ob.w && cb.x + cb.w > ob.x && cb.y < ob.y + ob.h && cb.y + cb.h > ob.y) {
        const sc = Math.floor(g.distance / 10)
        setScore(sc)
        setSubmitted(false)
        setMyRow(-1)
        setNameValue('')
        const rank = boardRef.current.filter((e) => e.score > sc).length + 1
        awaitingName.current = sc > 0 && rank <= LB_KEEP
        if (awaitingName.current) setTimeout(() => nameInputRef.current?.focus(), 60)
        setPhaseBoth('over')
        draw()
        return
      }
    }
    g.obstacles = g.obstacles.filter((o) => o.x + o.size > -10)

    draw()
    raf.current = requestAnimationFrame(loop)
  }, [draw])

  const idleLoop = useCallback(() => {
    if (phaseRef.current !== 'idle') return
    const g = game.current
    g.worldTime += 0.5
    for (const c of g.clouds) {
      c.x -= c.v
      if (c.x < -40) c.x = g.width + 40
    }
    draw()
    raf.current = requestAnimationFrame(idleLoop)
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

  const submitName = useCallback(() => {
    const name = (nameValue.trim() || '냥이').slice(0, 8)
    const id = Date.now()
    setBoard((prev) => {
      const next = [...prev, { name, score, id }].sort((a, b) => b.score - a.score).slice(0, LB_KEEP)
      try {
        localStorage.setItem('catRunnerBoard', JSON.stringify(next))
      } catch {}
      setMyRow(next.findIndex((e) => e.id === id))
      return next
    })
    awaitingName.current = false
    setSubmitted(true)
  }, [nameValue, score])

  const handleAction = useCallback(() => {
    if (awaitingName.current) return
    const p = phaseRef.current
    if (p === 'idle' || p === 'over') start()
    else jump()
  }, [start, jump])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (document.activeElement === nameInputRef.current) return
        if (phaseRef.current === 'playing') e.preventDefault()
        handleAction()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleAction])

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
      canvas.getContext('2d')!.setTransform(dpr, 0, 0, dpr, 0, 0)
      game.current.width = W
      draw()
    }
    resize()
    window.addEventListener('resize', resize)
    raf.current = requestAnimationFrame(idleLoop)
    return () => window.removeEventListener('resize', resize)
  }, [draw, idleLoop])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const showNameEntry = phase === 'over' && awaitingName.current && !submitted

  return (
    <div
      ref={wrapRef}
      className="relative w-full select-none overflow-hidden rounded-2xl border border-[#ece6f2] shadow-sm"
      style={{ height: H }}
      onPointerDown={(e) => {
        if (phaseRef.current === 'playing') e.preventDefault()
        handleAction()
      }}
      role="button"
      tabIndex={0}
      aria-label="고양이 점프 게임"
    >
      <canvas ref={canvasRef} className="block w-full" style={{ height: H }} />

      {/* 대기 화면 */}
      {phase === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <p className="text-lg font-extrabold text-white drop-shadow">🐱 고양이 점프</p>
          <p className="mt-1 text-sm text-white/90 drop-shadow">스페이스 / 탭하면 시작 · 장애물을 뛰어넘으세요</p>
          <span className="mt-3 rounded-full bg-[#f97316] px-5 py-2 text-sm font-bold text-white shadow-lg">▶ PRESS START</span>
        </div>
      )}

      {/* 게임 오버 — 왼쪽 점수/등록, 오른쪽 순위표 */}
      {phase === 'over' && (
        <div className="absolute inset-0 flex items-stretch gap-2 bg-black/35 p-2 backdrop-blur-[1px] sm:p-3">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-base font-extrabold text-white drop-shadow sm:text-lg">게임 오버!</p>
            <p className="mt-0.5 text-sm text-white/90 drop-shadow">
              점수 <b className="text-[#ffd45e]">{score}</b>
            </p>
            {showNameEntry ? (
              <div
                className="mt-2 flex items-center gap-1.5"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <input
                  ref={nameInputRef}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitName()
                  }}
                  maxLength={8}
                  placeholder="이름 입력"
                  className="w-24 rounded-lg border border-white/60 px-2 py-1 text-sm outline-none"
                />
                <button onClick={submitName} className="rounded-lg bg-[#f97316] px-3 py-1 text-sm font-bold text-white">
                  등록
                </button>
              </div>
            ) : (
              <button
                onClick={() => start()}
                className="mt-2 rounded-full bg-[#f97316] px-5 py-1.5 text-sm font-bold text-white shadow-lg"
              >
                다시 시작 ↻
              </button>
            )}
          </div>

          <div className="w-32 shrink-0 self-center rounded-xl bg-white/85 p-2 text-[11px] shadow sm:w-40 sm:text-xs">
            <p className="mb-1 text-center font-extrabold text-[#241a33]">🏆 순위</p>
            {board.length === 0 ? (
              <p className="py-2 text-center text-gray-400">기록 없음</p>
            ) : (
              <ol className="space-y-0.5">
                {board.slice(0, LB_SHOW).map((e, i) => (
                  <li
                    key={e.id}
                    className={`flex items-center justify-between gap-1 rounded px-1 ${i === myRow ? 'bg-[#fde68a] font-bold' : ''}`}
                  >
                    <span className="min-w-0 truncate">
                      <b className="text-[#f97316]">{i + 1}</b> {e.name}
                    </span>
                    <span className="shrink-0 tabular-nums text-[#241a33]">{e.score}</span>
                  </li>
                ))}
              </ol>
            )}
            {showNameEntry && <p className="mt-1 text-center text-[10px] leading-tight text-[#9a93a6]">이름 등록하면 반영돼요</p>}
          </div>
        </div>
      )}
    </div>
  )
}
