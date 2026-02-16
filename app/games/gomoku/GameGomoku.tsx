'use client'

import { useCallback, useState } from 'react'

const SIZE = 15
const CELL = 32
const BOARD_PX = SIZE * CELL

type Stone = 0 | 1 | 2 // 0=empty, 1=black(player), 2=white(AI)
type Board = Stone[][]

function createBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0) as Stone[])
}

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
]

function checkWin(board: Board, r: number, c: number, stone: Stone): boolean {
  for (const [dr, dc] of DIRECTIONS) {
    let count = 1
    for (let i = 1; i < 5; i++) {
      const nr = r + dr * i
      const nc = c + dc * i
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break
      if (board[nr][nc] !== stone) break
      count++
    }
    for (let i = 1; i < 5; i++) {
      const nr = r - dr * i
      const nc = c - dc * i
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break
      if (board[nr][nc] !== stone) break
      count++
    }
    if (count >= 5) return true
  }
  return false
}

// AI: simple heuristic scoring
function scoreDirection(
  board: Board,
  r: number,
  c: number,
  dr: number,
  dc: number,
  stone: Stone
): number {
  let count = 0
  let open = 0

  // Forward
  let blocked = false
  for (let i = 1; i <= 4; i++) {
    const nr = r + dr * i
    const nc = c + dc * i
    if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) {
      blocked = true
      break
    }
    if (board[nr][nc] === stone) {
      count++
    } else if (board[nr][nc] === 0) {
      open++
      break
    } else {
      blocked = true
      break
    }
  }
  if (!blocked) open = Math.min(open, 1)

  // Backward
  blocked = false
  for (let i = 1; i <= 4; i++) {
    const nr = r - dr * i
    const nc = c - dc * i
    if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) {
      blocked = true
      break
    }
    if (board[nr][nc] === stone) {
      count++
    } else if (board[nr][nc] === 0) {
      open++
      break
    } else {
      blocked = true
      break
    }
  }

  const total = count + 1 // including self

  if (total >= 5) return 100000
  if (total === 4 && open >= 2) return 10000
  if (total === 4 && open >= 1) return 5000
  if (total === 3 && open >= 2) return 1000
  if (total === 3 && open >= 1) return 100
  if (total === 2 && open >= 2) return 50
  if (total === 2 && open >= 1) return 10
  return count
}

function evaluatePosition(board: Board, r: number, c: number, stone: Stone): number {
  let score = 0
  for (const [dr, dc] of DIRECTIONS) {
    score += scoreDirection(board, r, c, dr, dc, stone)
  }
  return score
}

function aiMove(board: Board): [number, number] | null {
  let bestScore = -1
  let bestMoves: [number, number][] = []

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] !== 0) continue

      // Only consider positions near existing stones
      let hasNeighbor = false
      for (let dr = -2; dr <= 2 && !hasNeighbor; dr++) {
        for (let dc = -2; dc <= 2 && !hasNeighbor; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] !== 0) {
            hasNeighbor = true
          }
        }
      }
      if (!hasNeighbor) continue

      // AI attack score + defense score
      const attackScore = evaluatePosition(board, r, c, 2)
      const defenseScore = evaluatePosition(board, r, c, 1)
      const totalScore = attackScore * 1.1 + defenseScore

      if (totalScore > bestScore) {
        bestScore = totalScore
        bestMoves = [[r, c]]
      } else if (totalScore === bestScore) {
        bestMoves.push([r, c])
      }
    }
  }

  if (bestMoves.length === 0) {
    // First move: center
    if (board[7][7] === 0) return [7, 7]
    return null
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)]
}

const STATS_KEY = 'ontools-gomoku-stats'

export function GameGomoku() {
  const [board, setBoard] = useState<Board>(createBoard)
  const [turn, setTurn] = useState<1 | 2>(1) // 1=player, 2=AI
  const [winner, setWinner] = useState<0 | 1 | 2>(0)
  const [stats, setStats] = useState(() => {
    if (typeof window === 'undefined') return { wins: 0, losses: 0, draws: 0 }
    const stored = localStorage.getItem(STATS_KEY)
    return stored ? JSON.parse(stored) : { wins: 0, losses: 0, draws: 0 }
  })
  const [lastMove, setLastMove] = useState<[number, number] | null>(null)
  const [thinking, setThinking] = useState(false)

  const updateStats = useCallback(
    (result: 'wins' | 'losses' | 'draws') => {
      const newStats = { ...stats, [result]: stats[result] + 1 }
      setStats(newStats)
      localStorage.setItem(STATS_KEY, JSON.stringify(newStats))
    },
    [stats]
  )

  const handleClick = useCallback(
    (r: number, c: number) => {
      if (winner || turn !== 1 || board[r][c] !== 0 || thinking) return

      const newBoard = board.map((row) => [...row]) as Board
      newBoard[r][c] = 1
      setBoard(newBoard)
      setLastMove([r, c])

      if (checkWin(newBoard, r, c, 1)) {
        setWinner(1)
        updateStats('wins')
        return
      }

      // Check draw
      const hasEmpty = newBoard.some((row) => row.some((v) => v === 0))
      if (!hasEmpty) {
        setWinner(0)
        updateStats('draws')
        return
      }

      setTurn(2)
      setThinking(true)

      // AI move with slight delay
      setTimeout(() => {
        const move = aiMove(newBoard)
        if (move) {
          const [ar, ac] = move
          newBoard[ar][ac] = 2
          setBoard([...newBoard.map((row) => [...row])] as Board)
          setLastMove([ar, ac])

          if (checkWin(newBoard, ar, ac, 2)) {
            setWinner(2)
            updateStats('losses')
            setThinking(false)
            setTurn(1)
            return
          }
        }
        setTurn(1)
        setThinking(false)
      }, 300)
    },
    [board, turn, winner, thinking, updateStats]
  )

  const restart = () => {
    setBoard(createBoard())
    setTurn(1)
    setWinner(0)
    setLastMove(null)
    setThinking(false)
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">승</p>
            <p className="text-lg font-bold">{stats.wins}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">패</p>
            <p className="text-lg font-bold">{stats.losses}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">무</p>
            <p className="text-lg font-bold">{stats.draws}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">차례</p>
            <p className="text-lg font-bold">{thinking ? '...' : turn === 1 ? '●' : '○'}</p>
          </div>
        </div>
        <button
          onClick={restart}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors shrink-0"
        >
          다시하기
        </button>
      </div>

      <div className="relative flex justify-center">
        <div
          className="relative rounded-xl overflow-hidden border-2 border-gray-300"
          style={{ width: BOARD_PX, height: BOARD_PX }}
        >
          {/* Board background */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: '#DEB887' }}
          />

          {/* Grid lines */}
          <svg
            className="absolute inset-0"
            width={BOARD_PX}
            height={BOARD_PX}
          >
            {Array.from({ length: SIZE }).map((_, i) => (
              <g key={i}>
                <line
                  x1={CELL / 2}
                  y1={i * CELL + CELL / 2}
                  x2={BOARD_PX - CELL / 2}
                  y2={i * CELL + CELL / 2}
                  stroke="#8B6914"
                  strokeWidth={0.8}
                />
                <line
                  x1={i * CELL + CELL / 2}
                  y1={CELL / 2}
                  x2={i * CELL + CELL / 2}
                  y2={BOARD_PX - CELL / 2}
                  stroke="#8B6914"
                  strokeWidth={0.8}
                />
              </g>
            ))}
            {/* Star points */}
            {[3, 7, 11].map((r) =>
              [3, 7, 11].map((c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={c * CELL + CELL / 2}
                  cy={r * CELL + CELL / 2}
                  r={3}
                  fill="#8B6914"
                />
              ))
            )}
          </svg>

          {/* Stones (clickable cells) */}
          {Array.from({ length: SIZE }).map((_, r) =>
            Array.from({ length: SIZE }).map((_, c) => (
              <button
                key={`${r}-${c}`}
                className="absolute"
                style={{
                  left: c * CELL,
                  top: r * CELL,
                  width: CELL,
                  height: CELL,
                }}
                onClick={() => handleClick(r, c)}
              >
                {board[r][c] === 1 && (
                  <div
                    className="absolute rounded-full shadow-md"
                    style={{
                      left: 2,
                      top: 2,
                      width: CELL - 4,
                      height: CELL - 4,
                      background: 'radial-gradient(circle at 35% 35%, #555, #000)',
                      border:
                        lastMove && lastMove[0] === r && lastMove[1] === c
                          ? '2px solid #ef4444'
                          : 'none',
                    }}
                  />
                )}
                {board[r][c] === 2 && (
                  <div
                    className="absolute rounded-full shadow-md"
                    style={{
                      left: 2,
                      top: 2,
                      width: CELL - 4,
                      height: CELL - 4,
                      background: 'radial-gradient(circle at 35% 35%, #fff, #ccc)',
                      border:
                        lastMove && lastMove[0] === r && lastMove[1] === c
                          ? '2px solid #ef4444'
                          : '1px solid #aaa',
                    }}
                  />
                )}
              </button>
            ))
          )}

          {/* Winner overlay */}
          {winner !== 0 && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-white mb-1">
                {winner === 1 ? '승리!' : 'AI 승리'}
              </p>
              <p className="text-white/70 mb-4">
                {winner === 1 ? '축하합니다!' : '다시 도전하세요!'}
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
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        흑(●) = 나, 백(○) = AI
      </p>
    </div>
  )
}
