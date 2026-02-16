'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const WIDTH = 320
const HEIGHT = 480
const BIRD_SIZE = 24
const GRAVITY = 0.45
const JUMP = -7
const PIPE_WIDTH = 52
const PIPE_GAP = 140
const PIPE_SPEED = 2.5
const PIPE_INTERVAL = 1800

const HS_KEY = 'ontools-flappy-highscore'

type Pipe = { x: number; topH: number }

export function GameFlappy() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const birdRef = useRef({ y: HEIGHT / 2, vy: 0 })
  const pipesRef = useRef<Pipe[]>([])
  const scoreRef = useRef(0)
  const gameOverRef = useRef(false)
  const frameRef = useRef<number>(0)
  const lastPipeRef = useRef(0)

  useEffect(() => {
    const stored = localStorage.getItem(HS_KEY)
    if (stored) setHighScore(parseInt(stored, 10))
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT)
    grad.addColorStop(0, '#87CEEB')
    grad.addColorStop(1, '#E0F0FF')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Ground
    ctx.fillStyle = '#8B6914'
    ctx.fillRect(0, HEIGHT - 40, WIDTH, 40)
    ctx.fillStyle = '#4CAF50'
    ctx.fillRect(0, HEIGHT - 40, WIDTH, 8)

    // Pipes
    const pipes = pipesRef.current
    pipes.forEach((pipe) => {
      // Top pipe
      ctx.fillStyle = '#2E7D32'
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topH)
      ctx.fillStyle = '#388E3C'
      ctx.fillRect(pipe.x - 3, pipe.topH - 24, PIPE_WIDTH + 6, 24)

      // Bottom pipe
      const bottomY = pipe.topH + PIPE_GAP
      ctx.fillStyle = '#2E7D32'
      ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, HEIGHT - 40 - bottomY)
      ctx.fillStyle = '#388E3C'
      ctx.fillRect(pipe.x - 3, bottomY, PIPE_WIDTH + 6, 24)
    })

    // Bird
    const bird = birdRef.current
    const angle = Math.min(Math.max(bird.vy * 3, -30), 60) * (Math.PI / 180)
    ctx.save()
    ctx.translate(60, bird.y)
    ctx.rotate(angle)
    // Body
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.ellipse(0, 0, BIRD_SIZE / 2, BIRD_SIZE / 2 - 2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#E6A800'
    ctx.lineWidth = 1.5
    ctx.stroke()
    // Eye
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(6, -4, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(7, -4, 2.5, 0, Math.PI * 2)
    ctx.fill()
    // Beak
    ctx.fillStyle = '#FF6B00'
    ctx.beginPath()
    ctx.moveTo(BIRD_SIZE / 2 - 2, -1)
    ctx.lineTo(BIRD_SIZE / 2 + 7, 2)
    ctx.lineTo(BIRD_SIZE / 2 - 2, 5)
    ctx.closePath()
    ctx.fill()
    // Wing
    ctx.fillStyle = '#FFC107'
    ctx.beginPath()
    ctx.ellipse(-4, 3, 7, 5, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }, [])

  const checkCollision = useCallback(() => {
    const bird = birdRef.current
    const birdLeft = 60 - BIRD_SIZE / 2
    const birdRight = 60 + BIRD_SIZE / 2
    const birdTop = bird.y - BIRD_SIZE / 2
    const birdBottom = bird.y + BIRD_SIZE / 2

    // Ground / ceiling
    if (birdBottom >= HEIGHT - 40 || birdTop <= 0) return true

    // Pipes
    for (const pipe of pipesRef.current) {
      if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
        if (birdTop < pipe.topH || birdBottom > pipe.topH + PIPE_GAP) {
          return true
        }
      }
    }
    return false
  }, [])

  const gameLoop = useCallback(
    (time: number) => {
      if (gameOverRef.current) return

      const bird = birdRef.current
      bird.vy += GRAVITY
      bird.y += bird.vy

      // Spawn pipes
      if (time - lastPipeRef.current > PIPE_INTERVAL) {
        const minTop = 60
        const maxTop = HEIGHT - 40 - PIPE_GAP - 60
        const topH = Math.floor(Math.random() * (maxTop - minTop)) + minTop
        pipesRef.current.push({ x: WIDTH, topH })
        lastPipeRef.current = time
      }

      // Move pipes
      pipesRef.current = pipesRef.current.filter((p) => p.x + PIPE_WIDTH > -10)
      pipesRef.current.forEach((p) => {
        // Score when passing
        if (p.x > 56 && p.x - PIPE_SPEED <= 56) {
          scoreRef.current++
          setScore(scoreRef.current)
        }
        p.x -= PIPE_SPEED
      })

      if (checkCollision()) {
        gameOverRef.current = true
        setGameOver(true)
        const stored = parseInt(localStorage.getItem(HS_KEY) || '0', 10)
        if (scoreRef.current > stored) {
          localStorage.setItem(HS_KEY, String(scoreRef.current))
          setHighScore(scoreRef.current)
        }
        draw()
        return
      }

      draw()
      frameRef.current = requestAnimationFrame(gameLoop)
    },
    [draw, checkCollision]
  )

  const jump = useCallback(() => {
    if (gameOverRef.current) return
    birdRef.current.vy = JUMP
  }, [])

  const startGame = useCallback(() => {
    birdRef.current = { y: HEIGHT / 2, vy: 0 }
    pipesRef.current = []
    scoreRef.current = 0
    gameOverRef.current = false
    lastPipeRef.current = 0
    setScore(0)
    setGameOver(false)
    setStarted(true)
    draw()
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(gameLoop)
  }, [draw, gameLoop])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault()
        if (!started) return
        if (gameOverRef.current) {
          startGame()
        } else {
          jump()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [started, jump, startGame])

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  useEffect(() => {
    draw()
  }, [draw])

  const handleCanvasClick = () => {
    if (!started) {
      startGame()
    } else if (gameOverRef.current) {
      startGame()
    } else {
      jump()
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-3">
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-center min-w-[80px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">점수</p>
            <p className="text-xl font-bold">{score}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-center min-w-[80px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">최고</p>
            <p className="text-xl font-bold">{highScore}</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          {started ? '다시하기' : '시작'}
        </button>
      </div>

      <div className="relative flex justify-center">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="rounded-xl border-2 border-gray-200 cursor-pointer"
          onClick={handleCanvasClick}
          onTouchStart={(e) => {
            e.preventDefault()
            handleCanvasClick()
          }}
        />

        {!started && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startGame}
              className="px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl text-lg hover:bg-yellow-300 transition-colors shadow-lg"
            >
              게임 시작
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-white mb-1">게임 오버</p>
            <p className="text-white/70 mb-4">{score}점</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              다시하기
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        탭 또는 스페이스바로 조작
      </p>
    </div>
  )
}
