import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '게임 모음 - ontools',
  description:
    '브라우저에서 바로 즐기는 하이퍼캐주얼 게임. 2048, 테트리스, 스네이크, 지뢰찾기, 솔리테어, 블랙잭, 메모리 카드, Flappy Bird, 타자연습, 오목.',
  openGraph: {
    title: '게임 모음 - ontools',
    description: '브라우저에서 바로 즐기는 하이퍼캐주얼 게임.',
    url: 'https://ontools.co.kr/games',
    siteName: 'ontools',
    type: 'website',
  },
}

const GAMES = [
  {
    id: '2048',
    title: '2048',
    description: '숫자 타일을 합쳐 2048을 만들어보세요',
    color: 'from-amber-400 to-orange-500',
    icon: '🧩',
  },
  {
    id: 'tetris',
    title: '테트리스',
    description: '블록을 쌓아 줄을 완성하는 클래식 퍼즐',
    color: 'from-cyan-400 to-blue-500',
    icon: '🧱',
  },
  {
    id: 'snake',
    title: '스네이크',
    description: '먹이를 먹고 점점 길어지는 뱀을 조종하세요',
    color: 'from-green-400 to-emerald-500',
    icon: '🐍',
  },
  {
    id: 'minesweeper',
    title: '지뢰찾기',
    description: '지뢰를 피해 모든 칸을 열어보세요',
    color: 'from-gray-500 to-gray-700',
    icon: '💣',
  },
  {
    id: 'solitaire',
    title: '솔리테어',
    description: '클론다이크 카드를 정리하는 클래식 게임',
    color: 'from-emerald-500 to-teal-600',
    icon: '🃏',
  },
  {
    id: 'blackjack',
    title: '블랙잭',
    description: '딜러와 대결! 21에 가까이 가세요',
    color: 'from-red-600 to-rose-800',
    icon: '🎰',
  },
  {
    id: 'memory',
    title: '메모리 카드',
    description: '카드를 뒤집어 같은 짝을 찾아보세요',
    color: 'from-purple-400 to-indigo-500',
    icon: '🧠',
  },
  {
    id: 'flappy',
    title: 'Flappy Bird',
    description: '탭해서 장애물을 피하며 날아가세요',
    color: 'from-sky-400 to-cyan-500',
    icon: '🐦',
  },
  {
    id: 'typing',
    title: '타자연습',
    description: '떨어지는 단어를 빠르게 타이핑하세요',
    color: 'from-yellow-400 to-amber-500',
    icon: '⌨️',
  },
  {
    id: 'gomoku',
    title: '오목',
    description: 'AI와 대결! 먼저 다섯 개를 놓으세요',
    color: 'from-stone-600 to-stone-800',
    icon: '⚫',
  },
]

export default function GamesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <a
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <img
              src="/mascot.png"
              alt="ontools"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-xl font-bold">ontools</span>
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">
            홈
          </a>
          {' > '}
          <span className="text-foreground font-medium">게임</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">게임 모음</h1>
          <p className="text-muted-foreground">
            브라우저에서 바로 즐기는 하이퍼캐주얼 게임
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {GAMES.map((game) => (
            <Link key={game.id} href={`/games/${game.id}`} className="group">
              <div className="rounded-xl border border-gray-100 bg-white overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div
                  className={`h-40 bg-gradient-to-br ${game.color} flex items-center justify-center`}
                >
                  <span className="text-6xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {game.icon}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors">
                    {game.title}
                  </h2>
                  <p className="text-sm text-gray-500">{game.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
