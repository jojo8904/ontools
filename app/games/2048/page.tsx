import type { Metadata } from 'next'
import { Game2048 } from './Game2048'

export const metadata: Metadata = {
  title: '2048 게임 - ontools',
  description: '숫자 타일을 합쳐 2048을 만들어보세요. 방향키/스와이프로 조작.',
  openGraph: {
    title: '2048 게임 - ontools',
    description: '숫자 타일을 합쳐 2048을 만들어보세요.',
    url: 'https://ontools.com/games/2048',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function Game2048Page() {
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
          <a href="/games" className="hover:text-foreground">
            게임
          </a>
          {' > '}
          <span className="text-foreground font-medium">2048</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">2048</h1>
          <p className="text-muted-foreground">
            같은 숫자 타일을 합쳐서 2048을 만들어보세요.
          </p>
        </div>

        <Game2048 />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
