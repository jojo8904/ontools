'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

const ROWS = 9
const COLS = 9
const MINES = 10

type CellState = {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}

function createBoard(safeR: number, safeC: number): CellState[][] {
  const board: CellState[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  )

  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (board[r][c].mine) continue
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue
    board[r][c].mine = true
    placed++
  }

  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue
      let count = 0
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine)
            count++
        }
      board[r][c].adjacent = count
    }

  return board
}

function cloneBoard(board: CellState[][]): CellState[][] {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

function reveal(board: CellState[][], r: number, c: number): CellState[][] {
  const b = cloneBoard(board)
  const stack: [number, number][] = [[r, c]]
  while (stack.length > 0) {
    const [cr, cc] = stack.pop()!
    if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) continue
    if (b[cr][cc].revealed || b[cr][cc].flagged) continue
    b[cr][cc].revealed = true
    if (b[cr][cc].adjacent === 0 && !b[cr][cc].mine) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) stack.push([cr + dr, cc + dc])
    }
  }
  return b
}

function checkWin(board: CellState[][]): boolean {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (!board[r][c].mine && !board[r][c].revealed) return false
  return true
}

const NUM_COLORS = [
  '',
  'text-blue-600',
  'text-green-600',
  'text-red-600',
  'text-purple-700',
  'text-amber-700',
  'text-cyan-600',
  'text-gray-800',
  'text-gray-500',
]

const HS_KEY = 'ontools-minesweeper-besttime'

export function GameMinesweeper() {
  const [board, setBoard] = useState<CellState[][] | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(0)
  const [bestTime, setBestTime] = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(HS_KEY)
    if (stored) setBestTime(parseInt(stored, 10))
  }, [])

  useEffect(() => {
    if (!started || gameOver || won) return
    const id = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [started, gameOver, won])

  const flagCount = useMemo(() => {
    if (!board) return 0
    return board.flat().filter((c) => c.flagged).length
  }, [board])

  const handleClick = useCallback(
    (r: number, c: number) => {
      if (gameOver || won) return

      if (!board) {
        const newBoard = createBoard(r, c)
        const revealed = reveal(newBoard, r, c)
        setBoard(revealed)
        setStarted(true)
        setTime(0)
        if (checkWin(revealed)) {
          setWon(true)
          if (bestTime === null || 0 < bestTime) {
            setBestTime(0)
            localStorage.setItem(HS_KEY, '0')
          }
        }
        return
      }

      const cell = board[r][c]
      if (cell.revealed || cell.flagged) return

      if (cell.mine) {
        const b = cloneBoard(board)
        for (let rr = 0; rr < ROWS; rr++)
          for (let cc = 0; cc < COLS; cc++)
            if (b[rr][cc].mine) b[rr][cc].revealed = true
        setBoard(b)
        setGameOver(true)
        return
      }

      const newBoard = reveal(board, r, c)
      setBoard(newBoard)
      if (checkWin(newBoard)) {
        setWon(true)
        if (bestTime === null || time < bestTime) {
          setBestTime(time)
          localStorage.setItem(HS_KEY, String(time))
        }
      }
    },
    [board, gameOver, won, time, bestTime]
  )

  const handleRightClick = useCallback(
    (e: React.MouseEvent, r: number, c: number) => {
      e.preventDefault()
      if (!board || gameOver || won) return
      const cell = board[r][c]
      if (cell.revealed) return
      const b = cloneBoard(board)
      b[r][c].flagged = !b[r][c].flagged
      setBoard(b)
    },
    [board, gameOver, won]
  )

  const restart = () => {
    setBoard(null)
    setGameOver(false)
    setWon(false)
    setStarted(false)
    setTime(0)
  }

  const displayBoard = board || Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  )

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[70px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">
              💣
            </p>
            <p className="text-lg font-bold">{MINES - flagCount}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[70px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">
              시간
            </p>
            <p className="text-lg font-bold">{time}s</p>
          </div>
          {bestTime !== null && (
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[70px]">
              <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">
                최고
              </p>
              <p className="text-lg font-bold">{bestTime}s</p>
            </div>
          )}
        </div>
        <button
          onClick={restart}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          다시하기
        </button>
      </div>

      <div className="relative inline-block">
        <div
          className="grid bg-gray-300 rounded-lg overflow-hidden border-2 border-gray-400"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 32px)`,
          }}
        >
          {displayBoard.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
                className={`w-8 h-8 flex items-center justify-center text-sm font-bold border border-gray-300/50 transition-colors ${
                  cell.revealed
                    ? cell.mine
                      ? 'bg-red-200'
                      : 'bg-gray-100'
                    : 'bg-gray-300 hover:bg-gray-200 active:bg-gray-100'
                }`}
              >
                {cell.revealed
                  ? cell.mine
                    ? '💣'
                    : cell.adjacent > 0
                      ? (
                          <span className={NUM_COLORS[cell.adjacent]}>
                            {cell.adjacent}
                          </span>
                        )
                      : ''
                  : cell.flagged
                    ? '🚩'
                    : ''}
              </button>
            ))
          )}
        </div>

        {(gameOver || won) && (
          <div className="absolute inset-0 bg-black/40 rounded-lg flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-white mb-2">
              {won ? `클리어! ${time}초` : '게임 오버'}
            </p>
            <button
              onClick={restart}
              className="px-5 py-2 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              다시하기
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        클릭으로 열기 · 우클릭으로 깃발
      </p>
    </div>
  )
}
