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

  const [phase, setPhase] = useState<Phase>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)

  const setPhaseBoth = (p: Phase) => {
    phaseRef.current = p
    setPhase(p)
  }

  // 스프라이트 + best 로드
  useEffect(() => {
    ;['cat', 'cactus', 'rock', 'log'].forEach((name) => {
      const img = new Image()
      img.src = `/game/${name}.png`
      imgs.current[name] = img
    })
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

    // 낮↔밤 (0=낮, 1=밤)
    const night = (1 - Math.cos((g.worldTime / DAY_CYCLE) * Math.PI * 2)) / 2
    const grd = ctx.createLinearGradient(0, 0, 0, H)
    grd.addColorStop(0, mix(DAY_TOP, NIGHT_TOP, night))
    grd.addColorStop(1, mix(DAY_BOT, NIGHT_BOT, night))
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, W, H)

    // 별 (밤)
    if (night > 0.35) {
      ctx.fillStyle = `rgba(255,255,255,${(night - 0.35) * 1.3})`
      for (const s of g.stars) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    // 해/달
    const sunX = W * 0.82
    const sunY = 40
    ctx.beginPath()
    ctx.arc(sunX, sunY, 16, 0, Math.PI * 2)
    ctx.fillStyle = night < 0.5 ? `rgba(255,221,120,${1 - night})` : `rgba(240,240,225,${night})`
    ctx.fill()

    // 구름
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

    // 땅
    ctx.fillStyle = mix([214, 233, 196], [40, 55, 60], night)
    ctx.fillRect(0, GROUND, W, H - GROUND)
    ctx.strokeStyle = mix([150, 180, 130], [70, 85, 90], night)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, GROUND)
    ctx.lineTo(W, GROUND)
    ctx.stroke()

    // 장애물
    for (const o of g.obstacles) {
      const img = imgs.current[o.type]
      if (img && img.complete) {
        ctx.drawImage(img, o.x, GROUND - o.size + 2, o.size, o.size)
      } else {
        ctx.fillStyle = '#7c9a5e'
        ctx.fillRect(o.x + o.size * 0.25, GROUND - o.size * 0.7, o.size * 0.5, o.size * 0.7)
      }
    }

    // 고양이
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

    // 날씨 입자
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

    // 점수
    ctx.fillStyle = night > 0.5 ? 'rgba(255,255,255,0.85)' : 'rgba(90,80,100,0.85)'
    ctx.font = 'bold 15px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${Math.floor(g.distance / 10)}`, W - 14, 26)
  }, [])

  const stepWorld = (g: Game) => {
    g.worldTime += 1

    // 구름 이동
    for (const c of g.clouds) {
      c.x -= c.v
      if (c.x < -40) {
        c.x = g.width + 40
        c.y = 18 + Math.random() * 60
      }
    }

    // 날씨 전환
    g.weatherTimer -= 1
    if (g.weatherTimer <= 0) {
      const seq: Weather[] = ['clear', 'rain', 'clear', 'snow']
      g.weather = seq[Math.floor(Math.random() * seq.length)]
      g.weatherTimer = 420 + Math.floor(Math.random() * 360)
    }
    const target = g.weather === 'clear' ? 0 : 1
    g.weatherIntensity += (target - g.weatherIntensity) * 0.02

    // 입자
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

    // 물리
    g.vy += GRAVITY
    g.catY += g.vy
    if (g.catY >= GROUND - CAT) {
      g.catY = GROUND - CAT
      g.vy = 0
      g.jumping = false
    }

    g.distance += g.speed
    g.speed = 4.2 + g.distance / 2200

    // 스폰
    g.spawnIn -= 1
    if (g.spawnIn <= 0) {
      const types: ObsType[] = ['cactus', 'rock', 'log']
      const type = types[Math.floor(Math.random() * types.length)]
      const [lo, hi] = OBS_SIZE[type]
      const size = lo + Math.floor(Math.random() * (hi - lo))
      g.obstacles.push({ x: g.width + 10, type, size })
      const base = 72 + Math.floor(Math.random() * 55)
      g.spawnIn = Math.max(40, base - Math.floor(g.distance / 380))
    }

    // 이동 + 충돌
    const catX = 46
    const cb = { x: catX + CAT * 0.22, y: g.catY + CAT * 0.2, w: CAT * 0.56, h: CAT * 0.72 }
    for (const o of g.obstacles) {
      o.x -= g.speed
      const ob = { x: o.x + o.size * 0.22, y: GROUND - o.size * 0.72, w: o.size * 0.56, h: o.size * 0.72 }
      if (cb.x < ob.x + ob.w && cb.x + cb.w > ob.x && cb.y < ob.y + ob.h && cb.y + cb.h > ob.y) {
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
    g.obstacles = g.obstacles.filter((o) => o.x + o.size > -10)

    draw()
    raf.current = requestAnimationFrame(loop)
  }, [draw])

  // 대기 화면에서도 배경(구름/낮밤) 잔잔히 흐르게
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

  const handleAction = useCallback(() => {
    const p = phaseRef.current
    if (p === 'idle' || p === 'over') start()
    else jump()
  }, [start, jump])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (phaseRef.current === 'playing') e.preventDefault()
        handleAction()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleAction])

  // 캔버스 사이즈(반응형 + DPR) + 대기 애니메이션 시작
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

      {phase !== 'playing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[1px]">
          {phase === 'idle' ? (
            <>
              <p className="text-lg font-extrabold text-white drop-shadow">🐱 고양이 점프</p>
              <p className="mt-1 text-sm text-white/90 drop-shadow">스페이스 / 탭하면 시작 · 장애물을 뛰어넘으세요</p>
              <span className="mt-3 rounded-full bg-[#f97316] px-5 py-2 text-sm font-bold text-white shadow-lg">
                ▶ PRESS START
              </span>
            </>
          ) : (
            <>
              <p className="text-lg font-extrabold text-white drop-shadow">게임 오버!</p>
              <p className="mt-1 text-sm text-white/90 drop-shadow">
                점수 <b className="text-[#ffd45e]">{score}</b>
                {best > 0 && <span className="text-white/70"> · 최고 {best}</span>}
              </p>
              <span className="mt-3 rounded-full bg-[#f97316] px-5 py-2 text-sm font-bold text-white shadow-lg">
                다시 시작 ↻
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
