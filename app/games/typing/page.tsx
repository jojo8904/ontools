
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GameGuide } from '@/components/GameGuide'
import { GameTyping } from './GameTyping'

export const metadata: Metadata = {
  alternates: { canonical: '/games/typing' },
  title: '타자연습 - ontools',
  description: '떨어지는 한글/영어 단어를 빠르게 타이핑하세요! 타자 속도 향상 게임.',
  openGraph: {
    title: '타자연습 - ontools',
    description: '떨어지는 단어를 빠르게 타이핑하세요!',
    url: 'https://ontools.co.kr/games/typing',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function TypingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>{' > '}
          <Link href="/games" className="hover:text-foreground">게임</Link>{' > '}
          <span className="text-foreground font-medium">타자연습</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">타자연습</h1>
          <p className="text-muted-foreground">떨어지는 한글/영어 단어를 빠르게 타이핑하세요! 레벨이 올라갈수록 빨라집니다.</p>
        </div>
        <GameTyping />
        <GameGuide slug="typing" />
      </main>
      <SiteFooter />
    </div>
  )
}
