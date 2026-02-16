'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const WORDS_KO = [
  '사과', '바나나', '컴퓨터', '프로그램', '자동차', '비행기', '도서관', '음악',
  '학교', '행복', '커피', '인터넷', '게임', '여행', '시간', '세계',
  '바다', '하늘', '산', '강', '꽃', '나무', '별', '달',
  '태양', '구름', '비', '눈', '바람', '봄', '여름', '가을',
  '겨울', '사랑', '친구', '가족', '마음', '꿈', '미래', '희망',
]

const WORDS_EN = [
  'apple', 'banana', 'computer', 'program', 'hello', 'world', 'game', 'music',
  'travel', 'coffee', 'school', 'happy', 'dream', 'future', 'ocean', 'river',
  'cloud', 'storm', 'light', 'night', 'space', 'earth', 'fire', 'water',
  'code', 'type', 'fast', 'word', 'play', 'star', 'moon', 'tree',
  'bird', 'fish', 'wind', 'rain', 'snow', 'sun', 'book', 'time',
]

type FallingWord = {
  id: number
  text: string
  x: number
  y: number
  speed: number
}

const HS_KEY = 'ontools-typing-highscore'
const CANVAS_W = 400
const CANVAS_H = 500

export function GameTyping() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [input, setInput] = useState('')
  const [lang, setLang] = useState<'ko' | 'en'>('ko')
  const [level, setLevel] = useState(1)

  const wordsRef = useRef<FallingWord[]>([])
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const gameOverRef = useRef(false)
  const frameRef = useRef<number>(0)
  const nextIdRef = useRef(0)
  const lastSpawnRef = useRef(0)
  const levelRef = useRef(1)

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
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    // Grid lines
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 0.5
    for (let i = 0; i < CANVAS_W; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, CANVAS_H)
      ctx.stroke()
    }

    // Danger zone
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)'
    ctx.fillRect(0, CANVAS_H - 60, CANVAS_W, 60)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, CANVAS_H - 60)
    ctx.lineTo(CANVAS_W, CANVAS_H - 60)
    ctx.stroke()
    ctx.setLineDash([])

    // Words
    ctx.textAlign = 'center'
    wordsRef.current.forEach((word) => {
      // Glow effect
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 8
      ctx.fillStyle = '#e0f2fe'
      ctx.font = 'bold 18px "Pretendard Variable", Pretendard, sans-serif'
      ctx.fillText(word.text, word.x, word.y)
      ctx.shadowBlur = 0
    })

    // Level indicator
    ctx.fillStyle = '#64748b'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`Lv.${levelRef.current}`, CANVAS_W - 10, 20)
  }, [])

  const spawnWord = useCallback(
    (time: number) => {
      const wordList = lang === 'ko' ? WORDS_KO : WORDS_EN
      const text = wordList[Math.floor(Math.random() * wordList.length)]
      const x = Math.random() * (CANVAS_W - 80) + 40
      const baseSpeed = 0.4 + levelRef.current * 0.1
      const speed = baseSpeed + Math.random() * 0.3
      wordsRef.current.push({
        id: nextIdRef.current++,
        text,
        x,
        y: -10,
        speed,
      })
      lastSpawnRef.current = time
    },
    [lang]
  )

  const gameLoop = useCallback(
    (time: number) => {
      if (gameOverRef.current) return

      // Spawn interval decreases with level
      const spawnInterval = Math.max(1200 - levelRef.current * 80, 500)
      if (time - lastSpawnRef.current > spawnInterval) {
        spawnWord(time)
      }

      // Move words
      const fallen: number[] = []
      wordsRef.current.forEach((w) => {
        w.y += w.speed
        if (w.y > CANVAS_H) {
          fallen.push(w.id)
        }
      })

      // Lose lives for fallen words
      if (fallen.length > 0) {
        wordsRef.current = wordsRef.current.filter((w) => !fallen.includes(w.id))
        livesRef.current = Math.max(0, livesRef.current - fallen.length)
        setLives(livesRef.current)

        if (livesRef.current <= 0) {
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
      }

      // Level up every 100 points
      const newLevel = Math.floor(scoreRef.current / 100) + 1
      if (newLevel !== levelRef.current) {
        levelRef.current = newLevel
        setLevel(newLevel)
      }

      draw()
      frameRef.current = requestAnimationFrame(gameLoop)
    },
    [draw, spawnWord]
  )

  const handleInput = useCallback(
    (value: string) => {
      setInput(value)
      if (!started || gameOverRef.current) return

      const trimmed = value.trim()
      const idx = wordsRef.current.findIndex(
        (w) => w.text.toLowerCase() === trimmed.toLowerCase()
      )
      if (idx !== -1) {
        wordsRef.current.splice(idx, 1)
        scoreRef.current += 10
        setScore(scoreRef.current)
        setInput('')
      }
    },
    [started]
  )

  const startGame = useCallback(() => {
    wordsRef.current = []
    scoreRef.current = 0
    livesRef.current = 3
    gameOverRef.current = false
    nextIdRef.current = 0
    lastSpawnRef.current = 0
    levelRef.current = 1
    setScore(0)
    setLives(3)
    setGameOver(false)
    setStarted(true)
    setLevel(1)
    setInput('')
    draw()
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(gameLoop)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [draw, gameLoop])

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">점수</p>
            <p className="text-lg font-bold">{score}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">최고</p>
            <p className="text-lg font-bold">{highScore}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[50px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">생명</p>
            <p className="text-lg font-bold">{'❤️'.repeat(lives)}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[50px]">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">레벨</p>
            <p className="text-lg font-bold">{level}</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors shrink-0"
        >
          {started ? '다시하기' : '시작'}
        </button>
      </div>

      {/* Language toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setLang('ko')}
          className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
            lang === 'ko'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          한글
        </button>
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
            lang === 'en'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          English
        </button>
      </div>

      <div className="relative flex justify-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-xl border-2 border-gray-700"
        />

        {!started && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startGame}
              className="px-8 py-3 bg-amber-400 text-gray-900 font-bold rounded-xl text-lg hover:bg-amber-300 transition-colors shadow-lg"
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

      {/* Input */}
      <div className="mt-4">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleInput(input)
            }
          }}
          placeholder={started ? '단어를 입력하세요...' : '시작 버튼을 누르세요'}
          disabled={!started || gameOver}
          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        떨어지는 단어를 타이핑하세요
      </p>
    </div>
  )
}
