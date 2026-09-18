'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useStoredNumber } from '@/lib/useStoredNumber'

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']
const GRID = 4 // 4x4 = 16 cards = 8 pairs

type MemCard = {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

function createCards(): MemCard[] {
  const pairs = EMOJIS.slice(0, (GRID * GRID) / 2)
  const all = [...pairs, ...pairs].map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }))
  // Shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all
}

const HS_KEY = 'ontools-memory-bestmoves'

export function GameMemory() {
  const [cards, setCards] = useState<MemCard[]>(createCards)
  const [flippedIds, setFlippedIds] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [bestMoves, setBestMoves] = useStoredNumber(HS_KEY, null)
  const [won, setWon] = useState(false)
  const [time, setTime] = useState(0)
  const [started, setStarted] = useState(false)
  const lockRef = useRef(false)

  useEffect(() => {
    if (!started || won) return
    const id = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [started, won])

  const handleFlip = useCallback(
    (id: number) => {
      if (lockRef.current || won) return
      const card = cards.find((c) => c.id === id)
      if (!card || card.flipped || card.matched) return

      if (!started) setStarted(true)

      const newCards = cards.map((c) =>
        c.id === id ? { ...c, flipped: true } : c
      )
      setCards(newCards)

      const newFlipped = [...flippedIds, id]
      setFlippedIds(newFlipped)

      if (newFlipped.length === 2) {
        const newMoves = moves + 1
        setMoves(newMoves)
        lockRef.current = true

        const [first, second] = newFlipped
        const c1 = newCards.find((c) => c.id === first)!
        const c2 = newCards.find((c) => c.id === second)!

        if (c1.emoji === c2.emoji) {
          // Match!
          const matched = newCards.map((c) =>
            c.id === first || c.id === second ? { ...c, matched: true } : c
          )
          setCards(matched)
          setFlippedIds([])
          lockRef.current = false

          if (matched.every((c) => c.matched)) {
            setWon(true)
            if (bestMoves === null || newMoves < bestMoves) {
              setBestMoves(newMoves)
            }
          }
        } else {
          // No match - flip back
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first || c.id === second
                  ? { ...c, flipped: false }
                  : c
              )
            )
            setFlippedIds([])
            lockRef.current = false
          }, 800)
        }
      }
    },
    [won, cards, started, flippedIds, moves, bestMoves, setBestMoves]
  )

  const restart = () => {
    setCards(createCards())
    setFlippedIds([])
    setMoves(0)
    setWon(false)
    setTime(0)
    setStarted(false)
    lockRef.current = false
  }

  const matchedCount = cards.filter((c) => c.matched).length / 2

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">이동</p>
            <p className="text-lg font-bold">{moves}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">짝</p>
            <p className="text-lg font-bold">
              {matchedCount}/{EMOJIS.length}
            </p>
          </div>
          {bestMoves !== null && (
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
              <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">최고</p>
              <p className="text-lg font-bold">{bestMoves}</p>
            </div>
          )}
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[50px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">시간</p>
            <p className="text-lg font-bold">{time}s</p>
          </div>
        </div>
        <button
          onClick={restart}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors shrink-0"
        >
          다시하기
        </button>
      </div>

      <div className="relative">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
        >
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-xl text-3xl font-bold flex items-center justify-center transition-all duration-300 ${
                card.flipped || card.matched
                  ? 'bg-white border-2 border-gray-200 scale-100'
                  : 'bg-indigo-500 hover:bg-indigo-400 border-2 border-indigo-600 cursor-pointer hover:scale-105'
              } ${card.matched ? 'opacity-60' : ''}`}
            >
              {card.flipped || card.matched ? (
                <span className="drop-shadow-sm">{card.emoji}</span>
              ) : (
                <span className="text-indigo-300 text-lg">?</span>
              )}
            </button>
          ))}
        </div>

        {won && (
          <div className="absolute inset-0 bg-black/40 rounded-xl flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-white mb-1">클리어!</p>
            <p className="text-white/70 mb-4">
              {moves}번 이동 · {time}초
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
        카드를 뒤집어 같은 짝을 찾으세요
      </p>
    </div>
  )
}
