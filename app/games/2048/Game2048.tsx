'use client'

import { useCallback, useEffect, useState } from 'react'

type Board = number[][]

function createEmpty(): Board {
  return Array.from({ length: 4 }, () => Array(4).fill(0))
}

function addRandom(board: Board): Board {
  const empty: [number, number][] = []
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) if (board[r][c] === 0) empty.push([r, c])
  if (empty.length === 0) return board
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  const next = board.map((row) => [...row])
  next[r][c] = Math.random() < 0.9 ? 2 : 4
  return next
}

function slideRow(row: number[]): { row: number[]; score: number } {
  const filtered = row.filter((v) => v !== 0)
  let score = 0
  const merged: number[] = []
  let i = 0
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2
      merged.push(val)
      score += val
      i += 2
    } else {
      merged.push(filtered[i])
      i++
    }
  }
  while (merged.length < 4) merged.push(0)
  return { row: merged, score }
}

function rotate90(board: Board): Board {
  const n = board.length
  const rotated = createEmpty()
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) rotated[c][n - 1 - r] = board[r][c]
  return rotated
}

function move(
  board: Board,
  direction: 'left' | 'right' | 'up' | 'down'
): { board: Board; score: number } {
  let b = board.map((r) => [...r])
  let rotations = 0
  if (direction === 'up') rotations = 1
  else if (direction === 'right') rotations = 2
  else if (direction === 'down') rotations = 3

  for (let i = 0; i < rotations; i++) b = rotate90(b)

  let totalScore = 0
  const newBoard = b.map((row) => {
    const { row: newRow, score } = slideRow(row)
    totalScore += score
    return newRow
  })

  let result = newBoard
  for (let i = 0; i < (4 - rotations) % 4; i++) result = rotate90(result)

  return { board: result, score: totalScore }
}

function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) if (a[r][c] !== b[r][c]) return false
  return true
}

function canMove(board: Board): boolean {
  for (const dir of ['left', 'right', 'up', 'down'] as const) {
    const { board: newBoard } = move(board, dir)
    if (!boardsEqual(board, newBoard)) return true
  }
  return false
}

const TILE_COLORS: Record<number, string> = {
  0: 'bg-gray-200',
  2: 'bg-amber-50 text-gray-700',
  4: 'bg-amber-100 text-gray-700',
  8: 'bg-orange-300 text-white',
  16: 'bg-orange-400 text-white',
  32: 'bg-orange-500 text-white',
  64: 'bg-red-500 text-white',
  128: 'bg-yellow-400 text-white',
  256: 'bg-yellow-500 text-white',
  512: 'bg-yellow-600 text-white',
  1024: 'bg-yellow-700 text-white',
  2048: 'bg-yellow-800 text-white',
}

function getTileClass(value: number): string {
  return TILE_COLORS[value] || 'bg-purple-600 text-white'
}

function getTileSize(value: number): string {
  if (value >= 1024) return 'text-lg'
  if (value >= 128) return 'text-xl'
  return 'text-2xl'
}

const HS_KEY = 'ontools-2048-highscore'

export function Game2048() {
  const [board, setBoard] = useState<Board>(() =>
    addRandom(addRandom(createEmpty()))
  )
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(HS_KEY)
    if (stored) setHighScore(parseInt(stored, 10))
  }, [])

  const updateHighScore = useCallback(
    (newScore: number) => {
      if (newScore > highScore) {
        setHighScore(newScore)
        localStorage.setItem(HS_KEY, String(newScore))
      }
    },
    [highScore]
  )

  const handleMove = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      if (gameOver) return
      const { board: newBoard, score: gained } = move(board, direction)
      if (boardsEqual(board, newBoard)) return

      const withRandom = addRandom(newBoard)
      const newScore = score + gained
      setBoard(withRandom)
      setScore(newScore)
      updateHighScore(newScore)

      if (!won && withRandom.some((row) => row.some((v) => v >= 2048))) {
        setWon(true)
      }
      if (!canMove(withRandom)) {
        setGameOver(true)
      }
    },
    [board, score, gameOver, won, updateHighScore]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, 'left' | 'right' | 'up' | 'down'> = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      }
      const dir = map[e.key]
      if (dir) {
        e.preventDefault()
        handleMove(dir)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleMove])

  // Touch/swipe support
  useEffect(() => {
    let startX = 0
    let startY = 0
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return
      if (Math.abs(dx) > Math.abs(dy)) {
        handleMove(dx > 0 ? 'right' : 'left')
      } else {
        handleMove(dy > 0 ? 'down' : 'up')
      }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [handleMove])

  const restart = () => {
    setBoard(addRandom(addRandom(createEmpty())))
    setScore(0)
    setGameOver(false)
    setWon(false)
  }

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
          onClick={restart}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          다시하기
        </button>
      </div>

      {/* Board */}
      <div className="relative bg-gray-300 rounded-xl p-2.5 aspect-square">
        <div className="grid grid-cols-4 gap-2.5 h-full">
          {board.flat().map((value, i) => (
            <div
              key={i}
              className={`flex items-center justify-center rounded-lg font-bold ${getTileSize(value)} ${getTileClass(value)} transition-all duration-100`}
            >
              {value !== 0 && value}
            </div>
          ))}
        </div>

        {/* Game Over / Won overlay */}
        {(gameOver || won) && (
          <div className="absolute inset-0 bg-black/40 rounded-xl flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-white mb-3">
              {won ? '2048 달성!' : '게임 오버'}
            </p>
            <button
              onClick={restart}
              className="px-6 py-2.5 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              다시하기
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        방향키 또는 스와이프로 조작
      </p>
    </div>
  )
}
