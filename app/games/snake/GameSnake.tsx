'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const GRID = 20
const CELL = 22
const SIZE = GRID * CELL

type Point = { x: number; y: number }
type Dir = 'up' | 'down' | 'left' | 'right'

function randomFood(snake: Point[]): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`))
  let p: Point
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
  } while (occupied.has(`${p.x},${p.y}`))
  return p
}

const HS_KEY = 'ontools-snake-highscore'

export function GameSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }])
  const dirRef = useRef<Dir>('right')
  const nextDirRef = useRef<Dir>('right')
  const foodRef = useRef<Point>(randomFood(snakeRef.current))
  const scoreRef = useRef(0)
  const gameOverRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(HS_KEY)
    if (stored) setHighScore(parseInt(stored, 10))
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, SIZE, SIZE)

    // Grid
    ctx.strokeStyle = '#22223a'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL, 0)
      ctx.lineTo(i * CELL, SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * CELL)
      ctx.lineTo(SIZE, i * CELL)
      ctx.stroke()
    }

    // Food
    const food = foodRef.current
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
    ctx.fill()

    // Snake
    const snake = snakeRef.current
    snake.forEach((seg, i) => {
      const brightness = 1 - (i / snake.length) * 0.5
      ctx.fillStyle = `hsl(142, 71%, ${Math.round(45 * brightness)}%)`
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2)
      if (i === 0) {
        // Head highlight
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, 5)
      }
    })
  }, [])

  const tick = useCallback(() => {
    if (gameOverRef.current) return

    dirRef.current = nextDirRef.current
    const snake = [...snakeRef.current]
    const head = { ...snake[0] }

    switch (dirRef.current) {
      case 'up':
        head.y--
        break
      case 'down':
        head.y++
        break
      case 'left':
        head.x--
        break
      case 'right':
        head.x++
        break
    }

    // Wall collision
    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
      gameOverRef.current = true
      setGameOver(true)
      const stored = parseInt(localStorage.getItem(HS_KEY) || '0', 10)
      if (scoreRef.current > stored) {
        localStorage.setItem(HS_KEY, String(scoreRef.current))
        setHighScore(scoreRef.current)
      }
      if (intervalRef.current) clearInterval(intervalRef.current)
      draw()
      return
    }

    // Self collision
    if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      gameOverRef.current = true
      setGameOver(true)
      const stored = parseInt(localStorage.getItem(HS_KEY) || '0', 10)
      if (scoreRef.current > stored) {
        localStorage.setItem(HS_KEY, String(scoreRef.current))
        setHighScore(scoreRef.current)
      }
      if (intervalRef.current) clearInterval(intervalRef.current)
      draw()
      return
    }

    snake.unshift(head)

    // Eat food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 10
      setScore(scoreRef.current)
      foodRef.current = randomFood(snake)
    } else {
      snake.pop()
    }

    snakeRef.current = snake
    draw()
  }, [draw])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!started || gameOverRef.current) return
      const opposites: Record<Dir, Dir> = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left',
      }
      const map: Record<string, Dir> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      }
      const dir = map[e.key]
      if (dir && dir !== opposites[dirRef.current]) {
        e.preventDefault()
        nextDirRef.current = dir
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [started])

  const startGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }]
    dirRef.current = 'right'
    nextDirRef.current = 'right'
    foodRef.current = randomFood(snakeRef.current)
    scoreRef.current = 0
    gameOverRef.current = false
    setScore(0)
    setGameOver(false)
    setStarted(true)
    draw()
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(tick, 120)
  }, [draw, tick])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Initial draw
  useEffect(() => {
    draw()
  }, [draw])

  return (
    <div className="max-w-md mx-auto">
      {/* Score bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-3">
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-center min-w-[80px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">
              점수
            </p>
            <p className="text-xl font-bold">{score.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-center min-w-[80px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">
              최고
            </p>
            <p className="text-xl font-bold">{highScore.toLocaleString()}</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          {started ? '다시하기' : '시작'}
        </button>
      </div>

      {/* Canvas */}
      <div className="relative flex justify-center">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="rounded-xl border-2 border-gray-700"
        />

        {!started && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startGame}
              className="px-8 py-3 bg-green-500 text-white font-bold rounded-xl text-lg hover:bg-green-400 transition-colors shadow-lg"
            >
              게임 시작
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-white mb-1">게임 오버</p>
            <p className="text-white/70 mb-4">{score.toLocaleString()}점</p>
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
        방향키로 조작
      </p>
    </div>
  )
}
