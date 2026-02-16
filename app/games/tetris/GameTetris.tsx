'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const COLS = 10
const ROWS = 20
const BLOCK = 28

type Piece = { shape: number[][]; color: string }

const PIECES: Piece[] = [
  { shape: [[1, 1, 1, 1]], color: '#06b6d4' }, // I
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#eab308',
  }, // O
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: '#a855f7',
  }, // T
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: '#3b82f6',
  }, // J
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: '#f97316',
  }, // L
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: '#22c55e',
  }, // S
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: '#ef4444',
  }, // Z
]

type Grid = (string | null)[][]

function createGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function randomPiece(): Piece {
  return PIECES[Math.floor(Math.random() * PIECES.length)]
}

function rotate(shape: number[][]): number[][] {
  const rows = shape.length
  const cols = shape[0].length
  const rotated: number[][] = Array.from({ length: cols }, () =>
    Array(rows).fill(0)
  )
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) rotated[c][rows - 1 - r] = shape[r][c]
  return rotated
}

function collides(
  grid: Grid,
  shape: number[][],
  row: number,
  col: number
): boolean {
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue
      const nr = row + r
      const nc = col + c
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return true
      if (grid[nr][nc]) return true
    }
  return false
}

function merge(grid: Grid, shape: number[][], row: number, col: number, color: string): Grid {
  const newGrid = grid.map((r) => [...r])
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      if (shape[r][c]) newGrid[row + r][col + c] = color
  return newGrid
}

function clearLines(grid: Grid): { grid: Grid; cleared: number } {
  const remaining = grid.filter((row) => row.some((cell) => !cell))
  const cleared = ROWS - remaining.length
  const empty = Array.from({ length: cleared }, () =>
    Array<string | null>(COLS).fill(null)
  )
  return { grid: [...empty, ...remaining], cleared }
}

const HS_KEY = 'ontools-tetris-highscore'

export function GameTetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const gridRef = useRef<Grid>(createGrid())
  const pieceRef = useRef<Piece>(randomPiece())
  const posRef = useRef({ row: 0, col: 3 })
  const scoreRef = useRef(0)
  const linesRef = useRef(0)
  const levelRef = useRef(1)
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

    ctx.fillStyle = '#1e1e2e'
    ctx.fillRect(0, 0, COLS * BLOCK, ROWS * BLOCK)

    // Grid lines
    ctx.strokeStyle = '#2a2a3e'
    ctx.lineWidth = 0.5
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath()
      ctx.moveTo(0, r * BLOCK)
      ctx.lineTo(COLS * BLOCK, r * BLOCK)
      ctx.stroke()
    }
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath()
      ctx.moveTo(c * BLOCK, 0)
      ctx.lineTo(c * BLOCK, ROWS * BLOCK)
      ctx.stroke()
    }

    // Placed blocks
    const grid = gridRef.current
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = grid[r][c]!
          ctx.fillRect(c * BLOCK + 1, r * BLOCK + 1, BLOCK - 2, BLOCK - 2)
          ctx.fillStyle = 'rgba(255,255,255,0.15)'
          ctx.fillRect(c * BLOCK + 1, r * BLOCK + 1, BLOCK - 2, 4)
        }
      }

    // Current piece
    const piece = pieceRef.current
    const pos = posRef.current
    for (let r = 0; r < piece.shape.length; r++)
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const x = (pos.col + c) * BLOCK
          const y = (pos.row + r) * BLOCK
          ctx.fillStyle = piece.color
          ctx.fillRect(x + 1, y + 1, BLOCK - 2, BLOCK - 2)
          ctx.fillStyle = 'rgba(255,255,255,0.15)'
          ctx.fillRect(x + 1, y + 1, BLOCK - 2, 4)
        }
      }
  }, [])

  const spawnPiece = useCallback(() => {
    const piece = randomPiece()
    const col = Math.floor((COLS - piece.shape[0].length) / 2)
    if (collides(gridRef.current, piece.shape, 0, col)) {
      gameOverRef.current = true
      setGameOver(true)
      const s = scoreRef.current
      const stored = parseInt(localStorage.getItem(HS_KEY) || '0', 10)
      if (s > stored) {
        localStorage.setItem(HS_KEY, String(s))
        setHighScore(s)
      }
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    pieceRef.current = piece
    posRef.current = { row: 0, col }
  }, [])

  const lock = useCallback(() => {
    const piece = pieceRef.current
    const pos = posRef.current
    gridRef.current = merge(gridRef.current, piece.shape, pos.row, pos.col, piece.color)
    const { grid: newGrid, cleared } = clearLines(gridRef.current)
    gridRef.current = newGrid

    if (cleared > 0) {
      const points = [0, 100, 300, 500, 800][cleared] * levelRef.current
      scoreRef.current += points
      linesRef.current += cleared
      setScore(scoreRef.current)
      setLines(linesRef.current)

      const newLevel = Math.floor(linesRef.current / 10) + 1
      if (newLevel !== levelRef.current) {
        levelRef.current = newLevel
        setLevel(newLevel)
        // Restart interval with new speed
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(tick, Math.max(100, 800 - (newLevel - 1) * 70))
      }
    }

    spawnPiece()
  }, [spawnPiece])

  const tick = useCallback(() => {
    if (gameOverRef.current) return
    const pos = posRef.current
    const piece = pieceRef.current
    if (!collides(gridRef.current, piece.shape, pos.row + 1, pos.col)) {
      posRef.current = { ...pos, row: pos.row + 1 }
    } else {
      lock()
    }
    draw()
  }, [draw, lock])

  const moveDir = useCallback(
    (dc: number) => {
      if (gameOverRef.current) return
      const pos = posRef.current
      if (!collides(gridRef.current, pieceRef.current.shape, pos.row, pos.col + dc)) {
        posRef.current = { ...pos, col: pos.col + dc }
        draw()
      }
    },
    [draw]
  )

  const rotatePiece = useCallback(() => {
    if (gameOverRef.current) return
    const rotated = rotate(pieceRef.current.shape)
    const pos = posRef.current
    if (!collides(gridRef.current, rotated, pos.row, pos.col)) {
      pieceRef.current = { ...pieceRef.current, shape: rotated }
      draw()
    }
  }, [draw])

  const hardDrop = useCallback(() => {
    if (gameOverRef.current) return
    const pos = posRef.current
    const piece = pieceRef.current
    let r = pos.row
    while (!collides(gridRef.current, piece.shape, r + 1, pos.col)) r++
    posRef.current = { ...pos, row: r }
    lock()
    draw()
  }, [draw, lock])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!started || gameOverRef.current) return
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          moveDir(-1)
          break
        case 'ArrowRight':
          e.preventDefault()
          moveDir(1)
          break
        case 'ArrowUp':
          e.preventDefault()
          rotatePiece()
          break
        case 'ArrowDown':
          e.preventDefault()
          tick()
          break
        case ' ':
          e.preventDefault()
          hardDrop()
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [started, moveDir, rotatePiece, tick, hardDrop])

  const startGame = useCallback(() => {
    gridRef.current = createGrid()
    scoreRef.current = 0
    linesRef.current = 0
    levelRef.current = 1
    gameOverRef.current = false
    setScore(0)
    setLines(0)
    setLevel(1)
    setGameOver(false)
    setStarted(true)
    spawnPiece()
    draw()
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(tick, 800)
  }, [spawnPiece, draw, tick])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="max-w-sm mx-auto">
      {/* Score bar */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex gap-2">
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">
              점수
            </p>
            <p className="text-lg font-bold">{score.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">
              최고
            </p>
            <p className="text-lg font-bold">{highScore.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">
              Lv
            </p>
            <p className="text-lg font-bold">{level}</p>
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
          width={COLS * BLOCK}
          height={ROWS * BLOCK}
          className="rounded-xl border-2 border-gray-700"
        />

        {!started && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startGame}
              className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-xl text-lg hover:bg-cyan-400 transition-colors shadow-lg"
            >
              게임 시작
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-white mb-1">게임 오버</p>
            <p className="text-white/70 mb-4">
              {score.toLocaleString()}점 · {lines}줄
            </p>
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
        ← → 이동 · ↑ 회전 · ↓ 소프트드롭 · Space 하드드롭
      </p>
    </div>
  )
}
