import { TOOLS } from '@/lib/tools'
import type { Metadata } from 'next'
export const metadata: Metadata = { alternates: { canonical: '/' } }
import Link from 'next/link'
import { FadeInSection } from './FadeInSection'
import { ScrollDownButton } from './ScrollDownButton'
import { PromoBanner } from '@/components/PromoBanner'
import { AdUnit } from '@/components/AdUnit'
import { ResponsiveAdFit } from '@/components/ResponsiveAdFit'
import { FavoriteStar } from './FavoriteStar'
import { CatRunner } from './CatRunner'

export const revalidate = 3600

const CATEGORY_LINK_HOVER: Record<string, string> = {
  'Salary & Tax': 'hover:text-emerald-600',
  Finance: 'hover:text-blue-600',
  Health: 'hover:text-rose-600',
  Utility: 'hover:text-blue-600',
  Game: 'hover:text-violet-600',
  Image: 'hover:text-teal-600',
}

// 카테고리별 마스코트 일러스트 배너 (AI 생성, 캐릭터 일관성 유지)
const CATEGORY_IMAGES: Record<string, string> = {
  'Salary & Tax': '/images/cat-salary.webp',
  Finance: '/images/cat-finance.webp',
  Health: '/images/cat-health.webp',
  Utility: '/images/cat-utility.webp',
  Game: '/images/cat-game.webp',
  Image: '/images/cat-image.webp',
}

const TOOL_CATEGORIES = [
  { title: "Salary & Tax", description: "연봉, 퇴직금, 세금 관련 계산", color: "bg-emerald-500", tools: TOOLS.filter((tool) => tool.category === 'salary-tax') },
  { title: "Finance", description: "환율, 대출, 투자 관련 금융 계산", color: "bg-blue-500", tools: TOOLS.filter((tool) => tool.category === 'finance') },
  { title: "Health", description: "건강 지표를 간편하게 확인", color: "bg-rose-500", tools: TOOLS.filter((tool) => tool.category === 'health') },
  { title: "Utility", description: "일상에서 자주 쓰는 변환/계산 도구", color: "bg-blue-500", tools: TOOLS.filter((tool) => tool.category === 'utility') },
  { title: "Game", description: "브라우저에서 바로 즐기는 캐주얼 게임", color: "bg-violet-500", tools: TOOLS.filter((tool) => tool.category === 'game') },
  { title: "Image", description: "사진 용량·캡처·변환을 브라우저에서 바로 (서버 전송 없음)", color: "bg-teal-500", tools: TOOLS.filter((tool) => tool.category === 'image') }
]

export default function HomePage() {
  const topCategories = TOOL_CATEGORIES.slice(0, 3)
  const bottomCategories = TOOL_CATEGORIES.slice(3)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#eee] sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="container mx-auto px-4 py-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-2xl font-bold tracking-tight text-[#111]">ontools</span>
          </Link>
          <nav aria-label="주 메뉴" className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-5">
            <a href="#tools" className="text-sm font-medium text-[#666] hover:text-[#111] transition-colors">
              도구
            </a>
            <a href="#games" className="text-sm font-medium text-[#666] hover:text-[#111] transition-colors">
              게임
            </a>
            <Link href="/guide" className="text-sm font-medium text-[#666] hover:text-[#111] transition-colors">
              가이드
            </Link>
            <a
              href="https://mallang-jo.tistory.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#666] hover:text-[#111] transition-colors"
            >
              블로그
            </a>
            <a
              href="https://getluckylab.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
            >
              🍀 행운연구소
            </a>
          </nav>
        </div>
      </header>

      {/* Brand introduction */}
      <section className="bg-[#f8f9fa]">
        <div className="container mx-auto px-4 py-5 min-h-[180px] flex items-center">
          <div className="flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/70 px-3 py-1 text-[0.8rem] font-semibold text-[#6b6276] ring-1 ring-[#e6def0] mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              계산기 · 게임 · 이미지 도구 50+
            </span>
            <h1 className="text-4xl sm:text-5xl leading-tight font-black tracking-normal text-[#241a33] mb-0">ontools</h1>
            <p className="text-[1.1rem] text-[#6b6276] mt-3 font-medium">
              연봉 계산부터 이미지 변환, 잠깐의 게임까지 — 필요한 도구를 한 곳에서.
            </p>
          </div>
        </div>
      </section>

      {/* Keep the game and partner banner above the growing tool directory. */}
      <section aria-label="게임과 행운연구소" className="relative bg-white">
        <div className="container mx-auto px-4 pt-5 pb-8 space-y-6">
          <CatRunner />
          <PromoBanner />
        </div>
        <ScrollDownButton />
      </section>

      {/* Tool Categories Section */}
      <FadeInSection>
        <section
          id="tools"
          className="scroll-mt-32 sm:scroll-mt-20"
          style={{ background: 'linear-gradient(180deg, #FBF7F2 0%, #F4EFFA 100%)' }}
        >
          <div className="container mx-auto px-4 pt-10 pb-10">
            <h2 className="text-[2rem] font-[800] mb-2 tracking-tight text-[#241a33]">도구 모음</h2>
            <p className="text-[#6b6276] mb-10">
              카테고리별로 필요한 계산기를 찾아보세요
            </p>

            {/* Top row: 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {topCategories.map((cat) => (
                <div
                  key={cat.title}
                  className="tool-card overflow-hidden flex flex-col"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={CATEGORY_IMAGES[cat.title]}
                      alt={`${cat.title} 일러스트`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute bottom-0 inset-x-0 h-[4px] ${cat.color}`} />
                  </div>
                  <div className="p-8 pt-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-1 text-[#111]">{cat.title}</h3>
                    <p className="text-sm text-[#999] mb-6">{cat.description}</p>
                    <ul className="space-y-3">
                      {cat.tools.map((tool) => (
                        <li key={tool.href} className="flex items-center justify-between gap-2">
                          <Link
                            href={tool.href}
                            className={`flex items-center gap-2 text-[#333] ${CATEGORY_LINK_HOVER[cat.title] || 'hover:text-blue-600'} transition-colors min-w-0 flex-1`}
                          >
                            <svg className="w-3.5 h-3.5 text-[#ccc] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-[15px]">{tool.label}</span>
                            {tool.badge && (
                              <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-full leading-none ${tool.badge === 'NEW' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                                {tool.badge}
                              </span>
                            )}
                          </Link>
                          <FavoriteStar href={tool.href} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom row: 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bottomCategories.map((cat) => (
                <div
                  key={cat.title}
                  id={cat.title === 'Game' ? 'games' : undefined}
                  className="tool-card scroll-mt-32 sm:scroll-mt-20 overflow-hidden flex flex-col"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={CATEGORY_IMAGES[cat.title]}
                      alt={`${cat.title} 일러스트`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute bottom-0 inset-x-0 h-[4px] ${cat.color}`} />
                  </div>
                  <div className="p-8 pt-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-1 text-[#111]">{cat.title}</h3>
                    <p className="text-sm text-[#999] mb-6">{cat.description}</p>
                    <ul className="space-y-3">
                      {cat.tools.map((tool) => (
                        <li key={tool.href} className="flex items-center justify-between gap-2">
                          <Link
                            href={tool.href}
                            className={`flex items-center gap-2 text-[#333] ${CATEGORY_LINK_HOVER[cat.title] || 'hover:text-blue-600'} transition-colors min-w-0 flex-1`}
                          >
                            <svg className="w-3.5 h-3.5 text-[#ccc] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-[15px]">{tool.label}</span>
                            {tool.badge && (
                              <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-full leading-none ${tool.badge === 'NEW' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                                {tool.badge}
                              </span>
                            )}
                          </Link>
                          <FavoriteStar href={tool.href} />
                        </li>
                      ))}
                    </ul>
                    {cat.title === 'Game' && (
                      <Link
                        href="/games"
                        className="mt-4 pt-3 border-t border-[#eee] text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1"
                      >
                        전체 게임 보기 →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>
      <section className="bg-white">
        <div className="container mx-auto px-4 py-5 space-y-6">
          <ResponsiveAdFit />
        </div>
      </section>

      {/* 광고 (AdSense 승인 후 슬롯 ID 입력) */}
      <div className="container mx-auto px-4">
        <AdUnit placement="home" />
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#ece6f2]" style={{ backgroundColor: '#F7F3FB' }}>
        <div className="container mx-auto px-4 py-8 text-center text-sm text-[#8a8290]">
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 mb-3">
            <Link href="/about" className="hover:text-[#241a33] transition-colors">소개</Link>
            <span className="text-[#ddd]">|</span>
            <Link href="/privacy" className="hover:text-[#241a33] transition-colors">개인정보처리방침</Link>
            <span className="text-[#ddd]">|</span>
            <Link href="/terms" className="hover:text-[#241a33] transition-colors">이용약관</Link>
            <span className="text-[#ddd]">|</span>
            <Link href="/guide" className="hover:text-[#241a33] transition-colors">가이드</Link>
            <span className="text-[#ddd]">|</span>
            <Link href="/about" className="hover:text-[#241a33] transition-colors">소개</Link>
            <span className="text-[#ddd]">|</span>
            <Link href="/contact" className="hover:text-[#241a33] transition-colors">문의</Link>
            <span className="text-[#ddd]">|</span>
            <a href="https://getluckylab.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#241a33] transition-colors">행운연구소</a>
            <span className="text-[#ddd]">|</span>
            <a href="https://mallang-jo.tistory.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#241a33] transition-colors">블로그</a>
          </div>
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>

    </div>
  )
}
