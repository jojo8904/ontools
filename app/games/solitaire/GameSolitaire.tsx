'use client'

import { useCallback, useEffect, useState } from 'react'

type Suit = '♠' | '♥' | '♦' | '♣'
type Card = { suit: Suit; rank: number; faceUp: boolean }

const SUITS: Suit[] = ['♠', '♥', '♦', '♣']
const RANK_NAMES = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function isRed(suit: Suit) {
  return suit === '♥' || suit === '♦'
}

function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS)
    for (let rank = 1; rank <= 13; rank++)
      deck.push({ suit, rank, faceUp: false })
  return deck
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface GameState {
  tableau: Card[][] // 7 columns
  foundations: Card[][] // 4 piles (♠♥♦♣)
  stock: Card[]
  waste: Card[]
}

function initGame(): GameState {
  const deck = shuffle(createDeck())
  const tableau: Card[][] = Array.from({ length: 7 }, () => [])
  let idx = 0
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[idx++] }
      card.faceUp = row === col
      tableau[col].push(card)
    }
  }
  const stock = deck.slice(idx).map((c) => ({ ...c, faceUp: false }))
  return {
    tableau,
    foundations: [[], [], [], []],
    stock,
    waste: [],
  }
}

function cloneState(s: GameState): GameState {
  return {
    tableau: s.tableau.map((col) => col.map((c) => ({ ...c }))),
    foundations: s.foundations.map((f) => f.map((c) => ({ ...c }))),
    stock: s.stock.map((c) => ({ ...c })),
    waste: s.waste.map((c) => ({ ...c })),
  }
}

function canPlaceOnTableau(card: Card, target: Card[]): boolean {
  if (target.length === 0) return card.rank === 13
  const top = target[target.length - 1]
  if (!top.faceUp) return false
  return isRed(card.suit) !== isRed(top.suit) && card.rank === top.rank - 1
}

function canPlaceOnFoundation(card: Card, foundation: Card[]): boolean {
  if (foundation.length === 0) return card.rank === 1
  const top = foundation[foundation.length - 1]
  return card.suit === top.suit && card.rank === top.rank + 1
}

function checkWin(state: GameState): boolean {
  return state.foundations.every((f) => f.length === 13)
}

const HS_KEY = 'ontools-solitaire-wins'

function CardView({ card, onClick, small }: { card: Card; onClick?: () => void; small?: boolean }) {
  const red = isRed(card.suit)
  if (!card.faceUp) {
    return (
      <div
        onClick={onClick}
        className={`${small ? 'w-10 h-14' : 'w-14 h-20'} rounded-md bg-blue-600 border-2 border-blue-700 cursor-pointer flex items-center justify-center`}
      >
        <span className="text-blue-400 text-xs">✦</span>
      </div>
    )
  }
  return (
    <div
      onClick={onClick}
      className={`${small ? 'w-10 h-14 text-xs' : 'w-14 h-20 text-sm'} rounded-md bg-white border-2 border-gray-200 cursor-pointer flex flex-col p-1 hover:border-blue-400 transition-colors ${red ? 'text-red-500' : 'text-gray-800'}`}
    >
      <span className="font-bold leading-none">{RANK_NAMES[card.rank]}</span>
      <span className="leading-none">{card.suit}</span>
    </div>
  )
}

export function GameSolitaire() {
  const [state, setState] = useState<GameState>(initGame)
  const [wins, setWins] = useState(0)
  const [selected, setSelected] = useState<{ source: string; index: number } | null>(null)
  const [won, setWon] = useState(false)
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem(HS_KEY)
    if (stored) setWins(parseInt(stored, 10))
  }, [])

  const drawStock = useCallback(() => {
    const s = cloneState(state)
    if (s.stock.length === 0) {
      s.stock = s.waste.reverse().map((c) => ({ ...c, faceUp: false }))
      s.waste = []
    } else {
      const card = s.stock.pop()!
      card.faceUp = true
      s.waste.push(card)
    }
    setState(s)
    setSelected(null)
    setMoves((m) => m + 1)
  }, [state])

  const tryAutoFoundation = useCallback(
    (card: Card, source: string, sourceIdx: number): boolean => {
      const s = cloneState(state)
      for (let fi = 0; fi < 4; fi++) {
        if (canPlaceOnFoundation(card, s.foundations[fi])) {
          // Remove from source
          if (source === 'waste') {
            s.waste.pop()
          } else if (source.startsWith('tableau-')) {
            const col = parseInt(source.split('-')[1])
            s.tableau[col] = s.tableau[col].slice(0, sourceIdx)
            if (s.tableau[col].length > 0) {
              s.tableau[col][s.tableau[col].length - 1].faceUp = true
            }
          }
          s.foundations[fi].push({ ...card, faceUp: true })
          setState(s)
          setMoves((m) => m + 1)
          if (checkWin(s)) {
            setWon(true)
            const newWins = wins + 1
            setWins(newWins)
            localStorage.setItem(HS_KEY, String(newWins))
          }
          return true
        }
      }
      return false
    },
    [state, wins]
  )

  const handleClick = useCallback(
    (source: string, cardIndex: number) => {
      if (won) return

      if (!selected) {
        setSelected({ source, index: cardIndex })
        return
      }

      // Try to move selected to this target
      const s = cloneState(state)
      let cards: Card[] = []
      const src = selected.source

      if (src === 'waste') {
        if (s.waste.length === 0) { setSelected(null); return }
        cards = [s.waste[s.waste.length - 1]]
      } else if (src.startsWith('tableau-')) {
        const col = parseInt(src.split('-')[1])
        cards = s.tableau[col].slice(selected.index)
      }

      if (cards.length === 0) { setSelected(null); return }

      // Target is a tableau column
      if (source.startsWith('tableau-')) {
        const targetCol = parseInt(source.split('-')[1])
        if (canPlaceOnTableau(cards[0], s.tableau[targetCol])) {
          // Remove from source
          if (src === 'waste') {
            s.waste.pop()
          } else if (src.startsWith('tableau-')) {
            const srcCol = parseInt(src.split('-')[1])
            s.tableau[srcCol] = s.tableau[srcCol].slice(0, selected.index)
            if (s.tableau[srcCol].length > 0)
              s.tableau[srcCol][s.tableau[srcCol].length - 1].faceUp = true
          }
          s.tableau[targetCol].push(...cards.map((c) => ({ ...c, faceUp: true })))
          setState(s)
          setMoves((m) => m + 1)
          setSelected(null)
          return
        }
      }

      // Target is foundation
      if (source.startsWith('foundation-') && cards.length === 1) {
        const fi = parseInt(source.split('-')[1])
        if (canPlaceOnFoundation(cards[0], s.foundations[fi])) {
          if (src === 'waste') {
            s.waste.pop()
          } else if (src.startsWith('tableau-')) {
            const srcCol = parseInt(src.split('-')[1])
            s.tableau[srcCol] = s.tableau[srcCol].slice(0, selected.index)
            if (s.tableau[srcCol].length > 0)
              s.tableau[srcCol][s.tableau[srcCol].length - 1].faceUp = true
          }
          s.foundations[fi].push({ ...cards[0], faceUp: true })
          setState(s)
          setMoves((m) => m + 1)
          setSelected(null)
          if (checkWin(s)) {
            setWon(true)
            const newWins = wins + 1
            setWins(newWins)
            localStorage.setItem(HS_KEY, String(newWins))
          }
          return
        }
      }

      // Clicking same card = deselect, or select new
      setSelected({ source, index: cardIndex })
    },
    [selected, state, won, wins]
  )

  const handleDoubleClick = useCallback(
    (source: string, cardIndex: number) => {
      if (won) return
      let card: Card | null = null
      if (source === 'waste' && state.waste.length > 0) {
        card = state.waste[state.waste.length - 1]
      } else if (source.startsWith('tableau-')) {
        const col = parseInt(source.split('-')[1])
        const tableau = state.tableau[col]
        if (cardIndex === tableau.length - 1 && tableau[cardIndex].faceUp) {
          card = tableau[cardIndex]
        }
      }
      if (card) {
        tryAutoFoundation(card, source, cardIndex)
        setSelected(null)
      }
    },
    [state, won, tryAutoFoundation]
  )

  const restart = () => {
    setState(initGame())
    setSelected(null)
    setWon(false)
    setMoves(0)
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">이동</p>
            <p className="text-lg font-bold">{moves}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">승리</p>
            <p className="text-lg font-bold">{wins}</p>
          </div>
        </div>
        <button
          onClick={restart}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          다시하기
        </button>
      </div>

      {/* Top row: Stock/Waste + Foundations */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          {/* Stock */}
          <div onClick={drawStock} className="cursor-pointer">
            {state.stock.length > 0 ? (
              <div className="w-14 h-20 rounded-md bg-blue-600 border-2 border-blue-700 flex items-center justify-center">
                <span className="text-blue-400 text-sm font-bold">{state.stock.length}</span>
              </div>
            ) : (
              <div className="w-14 h-20 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-gray-300 text-lg">↻</span>
              </div>
            )}
          </div>
          {/* Waste */}
          <div
            onClick={() => {
              if (state.waste.length > 0)
                handleClick('waste', state.waste.length - 1)
            }}
            onDoubleClick={() => {
              if (state.waste.length > 0)
                handleDoubleClick('waste', state.waste.length - 1)
            }}
          >
            {state.waste.length > 0 ? (
              <div className={`${selected?.source === 'waste' ? 'ring-2 ring-blue-500 rounded-md' : ''}`}>
                <CardView card={state.waste[state.waste.length - 1]} />
              </div>
            ) : (
              <div className="w-14 h-20 rounded-md border-2 border-dashed border-gray-300" />
            )}
          </div>
        </div>

        {/* Foundations */}
        <div className="flex gap-1.5">
          {state.foundations.map((f, fi) => (
            <div
              key={fi}
              onClick={() => handleClick(`foundation-${fi}`, f.length - 1)}
            >
              {f.length > 0 ? (
                <CardView card={f[f.length - 1]} small />
              ) : (
                <div className="w-10 h-14 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-gray-300 text-xs">{SUITS[fi]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="flex gap-1.5">
        {state.tableau.map((col, ci) => (
          <div
            key={ci}
            className="flex-1 min-h-[80px]"
            onClick={() => {
              if (col.length === 0) handleClick(`tableau-${ci}`, 0)
            }}
          >
            {col.length === 0 ? (
              <div className="w-full h-20 rounded-md border-2 border-dashed border-gray-200" />
            ) : (
              <div className="relative">
                {col.map((card, idx) => (
                  <div
                    key={idx}
                    className={`${idx > 0 ? 'mt-[-52px]' : ''} relative ${
                      selected?.source === `tableau-${ci}` && idx >= selected.index
                        ? 'ring-2 ring-blue-500 rounded-md'
                        : ''
                    }`}
                    style={{ zIndex: idx }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (card.faceUp) handleClick(`tableau-${ci}`, idx)
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      if (card.faceUp) handleDoubleClick(`tableau-${ci}`, idx)
                    }}
                  >
                    <CardView card={card} small />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {won && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
            <p className="text-3xl font-bold mb-2">축하합니다!</p>
            <p className="text-gray-500 mb-4">{moves}번 이동으로 클리어</p>
            <button
              onClick={restart}
              className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
            >
              다시하기
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-gray-400 mt-4">
        클릭으로 선택/이동 · 더블클릭으로 자동 이동
      </p>
    </div>
  )
}
