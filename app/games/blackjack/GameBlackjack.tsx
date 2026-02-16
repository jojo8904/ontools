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
      deck.push({ suit, rank, faceUp: true })
  return deck
}

function shuffleDeck(): Card[] {
  const deck = createDeck()
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function handValue(cards: Card[]): number {
  let total = 0
  let aces = 0
  for (const c of cards) {
    if (!c.faceUp) continue
    if (c.rank === 1) {
      aces++
      total += 11
    } else if (c.rank >= 10) {
      total += 10
    } else {
      total += c.rank
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10
    aces--
  }
  return total
}

function isBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && handValue(cards) === 21
}

type GamePhase = 'betting' | 'playing' | 'dealer' | 'result'
type Result = 'win' | 'lose' | 'push' | 'blackjack' | null

const HS_KEY = 'ontools-blackjack-chips'

function CardView({ card }: { card: Card }) {
  const red = isRed(card.suit)
  if (!card.faceUp) {
    return (
      <div className="w-16 h-24 rounded-lg bg-blue-600 border-2 border-blue-700 flex items-center justify-center shadow-md">
        <span className="text-blue-400 text-lg">✦</span>
      </div>
    )
  }
  return (
    <div
      className={`w-16 h-24 rounded-lg bg-white border-2 border-gray-200 flex flex-col p-1.5 shadow-md ${red ? 'text-red-500' : 'text-gray-800'}`}
    >
      <span className="text-base font-bold leading-none">{RANK_NAMES[card.rank]}</span>
      <span className="text-sm leading-none">{card.suit}</span>
      <span className="flex-1 flex items-center justify-center text-2xl">{card.suit}</span>
    </div>
  )
}

export function GameBlackjack() {
  const [deck, setDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [dealerHand, setDealerHand] = useState<Card[]>([])
  const [phase, setPhase] = useState<GamePhase>('betting')
  const [result, setResult] = useState<Result>(null)
  const [chips, setChips] = useState(1000)
  const [bet, setBet] = useState(100)
  const [message, setMessage] = useState('')
  const [bestChips, setBestChips] = useState(1000)

  useEffect(() => {
    const stored = localStorage.getItem(HS_KEY)
    if (stored) {
      const val = parseInt(stored, 10)
      setBestChips(val)
    }
  }, [])

  const updateBest = useCallback(
    (newChips: number) => {
      if (newChips > bestChips) {
        setBestChips(newChips)
        localStorage.setItem(HS_KEY, String(newChips))
      }
    },
    [bestChips]
  )

  const deal = useCallback(() => {
    const d = shuffleDeck()
    const p = [d.pop()!, d.pop()!]
    const dl = [d.pop()!, { ...d.pop()!, faceUp: false }]
    setDeck(d)
    setPlayerHand(p)
    setDealerHand(dl)
    setResult(null)
    setMessage('')

    if (isBlackjack(p)) {
      dl[1].faceUp = true
      setDealerHand([...dl])
      if (isBlackjack(dl)) {
        setResult('push')
        setMessage('무승부 (둘 다 블랙잭)')
        setPhase('result')
      } else {
        const winnings = Math.floor(bet * 1.5)
        const newChips = chips + winnings
        setChips(newChips)
        updateBest(newChips)
        setResult('blackjack')
        setMessage(`블랙잭! +${winnings}`)
        setPhase('result')
      }
    } else {
      setPhase('playing')
    }
  }, [bet, chips, updateBest])

  const hit = useCallback(() => {
    if (phase !== 'playing') return
    const d = [...deck]
    const p = [...playerHand, d.pop()!]
    setDeck(d)
    setPlayerHand(p)

    if (handValue(p) > 21) {
      const dl = dealerHand.map((c) => ({ ...c, faceUp: true }))
      setDealerHand(dl)
      const newChips = chips - bet
      setChips(newChips)
      updateBest(newChips)
      setResult('lose')
      setMessage(`버스트! -${bet}`)
      setPhase('result')
    }
  }, [phase, deck, playerHand, dealerHand, chips, bet, updateBest])

  const stand = useCallback(() => {
    if (phase !== 'playing') return

    const d = [...deck]
    const dl = dealerHand.map((c) => ({ ...c, faceUp: true }))

    while (handValue(dl) < 17) {
      dl.push(d.pop()!)
    }

    setDeck(d)
    setDealerHand(dl)

    const pv = handValue(playerHand)
    const dv = handValue(dl)

    if (dv > 21 || pv > dv) {
      const newChips = chips + bet
      setChips(newChips)
      updateBest(newChips)
      setResult('win')
      setMessage(`승리! +${bet}`)
    } else if (pv < dv) {
      const newChips = chips - bet
      setChips(newChips)
      updateBest(newChips)
      setResult('lose')
      setMessage(`패배 -${bet}`)
    } else {
      setResult('push')
      setMessage('무승부')
    }
    setPhase('result')
  }, [phase, deck, dealerHand, playerHand, chips, bet, updateBest])

  const newRound = () => {
    if (chips <= 0) {
      setChips(1000)
    }
    setBet(Math.min(bet, Math.max(chips, 1000)))
    setPhase('betting')
    setPlayerHand([])
    setDealerHand([])
    setResult(null)
    setMessage('')
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Score bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[70px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">칩</p>
            <p className="text-lg font-bold">{chips.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[70px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">최고</p>
            <p className="text-lg font-bold">{bestChips.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[70px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">베팅</p>
            <p className="text-lg font-bold">{bet}</p>
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="bg-emerald-800 rounded-xl p-6 min-h-[380px] flex flex-col">
        {phase === 'betting' ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-emerald-200 font-medium">베팅 금액을 선택하세요</p>
            <div className="flex gap-2">
              {[50, 100, 200, 500].map((v) => (
                <button
                  key={v}
                  onClick={() => setBet(v)}
                  disabled={v > chips}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                    bet === v
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-emerald-700 text-emerald-200 hover:bg-emerald-600 disabled:opacity-40'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={deal}
              disabled={bet > chips}
              className="px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl text-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              딜
            </button>
          </div>
        ) : (
          <>
            {/* Dealer */}
            <div className="mb-6">
              <p className="text-emerald-300 text-sm font-medium mb-2">
                딜러{' '}
                {phase === 'result' && (
                  <span className="text-white font-bold">({handValue(dealerHand)})</span>
                )}
              </p>
              <div className="flex gap-2">
                {dealerHand.map((card, i) => (
                  <CardView key={i} card={card} />
                ))}
              </div>
            </div>

            {/* Result message */}
            {message && (
              <div className="text-center mb-4">
                <p
                  className={`text-xl font-bold ${
                    result === 'win' || result === 'blackjack'
                      ? 'text-yellow-400'
                      : result === 'lose'
                        ? 'text-red-400'
                        : 'text-white'
                  }`}
                >
                  {message}
                </p>
              </div>
            )}

            {/* Player */}
            <div className="mt-auto">
              <p className="text-emerald-300 text-sm font-medium mb-2">
                플레이어{' '}
                <span className="text-white font-bold">({handValue(playerHand)})</span>
              </p>
              <div className="flex gap-2 mb-4">
                {playerHand.map((card, i) => (
                  <CardView key={i} card={card} />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {phase === 'playing' && (
                  <>
                    <button
                      onClick={hit}
                      className="flex-1 py-2.5 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      히트
                    </button>
                    <button
                      onClick={stand}
                      className="flex-1 py-2.5 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
                    >
                      스탠드
                    </button>
                  </>
                )}
                {phase === 'result' && (
                  <button
                    onClick={newRound}
                    className="flex-1 py-2.5 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    다음 라운드
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        21에 가까이! 넘으면 버스트
      </p>
    </div>
  )
}
