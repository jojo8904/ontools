import Link from 'next/link'
import { NewsList } from '@/features/news/components/NewsList'
import { NewsTicker } from './NewsTicker'
import { FadeInSection } from './FadeInSection'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  금융: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  건강: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  유틸리티: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  게임: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.491 48.491 0 01-4.163-.3c-1.18-.143-2.224-.632-2.995-1.37A3 3 0 002.25 8.25v1.5A2.25 2.25 0 004.5 12h.667c.278 0 .547.06.79.168l1.065.487c.488.223.86.637 1.07 1.114.23.525.325 1.068.325 1.606v0c0 1.183-.456 2.36-1.371 3.157A3.75 3.75 0 005.25 21h2.577c.614 0 1.22-.135 1.777-.4l1.036-.494A2.25 2.25 0 0112 19.5v0a2.25 2.25 0 011.36.606l1.036.494c.558.265 1.163.4 1.777.4h2.577a3.75 3.75 0 01-1.796-2.468C16.456 17.235 16 16.058 16 14.875v0c0-.538.095-1.081.325-1.606.21-.477.582-.891 1.07-1.114l1.065-.487c.243-.108.512-.168.79-.168h.667A2.25 2.25 0 0022.167 9.75v-1.5a3 3 0 00-1.435-2.561c-.771.738-1.815 1.227-2.995 1.37a48.474 48.474 0 01-4.163.3.64.64 0 01-.657-.643v0z" />
    </svg>
  ),
}

const CATEGORY_ICON_COLORS: Record<string, string> = {
  금융: 'text-emerald-500',
  건강: 'text-rose-500',
  유틸리티: 'text-blue-500',
  게임: 'text-violet-500',
}

const CATEGORY_LINK_HOVER: Record<string, string> = {
  금융: 'hover:text-emerald-600',
  건강: 'hover:text-rose-600',
  유틸리티: 'hover:text-blue-600',
  게임: 'hover:text-violet-600',
}

const TOOL_CATEGORIES = [
  {
    title: '금융',
    description: '연봉, 환율, 퇴직금 등 금융 관련 계산',
    color: 'bg-emerald-500',
    tools: [
      { href: '/salary', label: '연봉 실수령액 계산기' },
      { href: '/currency', label: '환율 계산기' },
      { href: '/severance-pay', label: '퇴직금 계산기' },
      { href: '/loan', label: '대출이자 계산기' },
      { href: '/savings', label: '적금/예금 이자 계산기' },
      { href: '/weekly-holiday-pay', label: '주휴수당 계산기' },
      { href: '/unemployment', label: '실업급여 계산기' },
      { href: '/vat', label: '부가세(VAT) 계산기' },
    ],
  },
  {
    title: '건강',
    description: '건강 지표를 간편하게 확인',
    color: 'bg-rose-500',
    tools: [
      { href: '/bmi', label: 'BMI 계산기' },
      { href: '/calorie', label: '일일 칼로리(TDEE) 계산기' },
    ],
  },
  {
    title: '유틸리티',
    description: '일상에서 자주 쓰는 변환/계산 도구',
    color: 'bg-blue-500',
    tools: [
      { href: '/unit-converter', label: '단위 변환기' },
      { href: '/d-day', label: 'D-day 계산기' },
      { href: '/electricity', label: '전기요금 계산기' },
      { href: '/character-counter', label: '글자수 세기' },
      { href: '/qr-generator', label: 'QR코드 생성기' },
    ],
  },
  {
    title: '게임',
    description: '브라우저에서 바로 즐기는 캐주얼 게임',
    color: 'bg-violet-500',
    tools: [
      { href: '/games', label: '게임 모음 보기' },
    ],
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#eee] sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-2xl font-bold tracking-tight text-[#111]">ontools</span>
          </a>
          <nav className="flex items-center gap-6">
            <a href="#tools" className="text-sm font-medium text-[#666] hover:text-[#111] transition-colors">
              도구
            </a>
            <a href="#news" className="text-sm font-medium text-[#666] hover:text-[#111] transition-colors">
              뉴스
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#000] relative overflow-hidden" style={{ padding: '40px 0' }}>
        <div className="container mx-auto px-4 relative z-[1]">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-[2.5rem] md:text-[3.5rem] leading-[1.1] font-[900] tracking-[-0.03em] text-white mb-0">
                당신의 <span className="hero-gradient-text">스마트한</span> 일상 도구
              </h2>
              <p className="text-[1.1rem] text-[rgba(255,255,255,0.85)] mt-3">
                계산도, 뉴스도, 게임도 — 여기서 다.
              </p>
            </div>
            <div className="hidden md:block shrink-0 w-[200px] h-[150px]">
              <img src="/hero-bg.png" alt="" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* News Ticker */}
      <NewsTicker />

      {/* Tool Categories Section */}
      <FadeInSection>
        <section id="tools" className="bg-gradient-to-b from-[#111] to-[#1a1a2e] scroll-mt-20">
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-[2rem] font-[800] mb-2 tracking-tight text-white">도구 모음</h2>
            <p className="text-[#888] mb-10">
              카테고리별로 필요한 계산기를 찾아보세요
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TOOL_CATEGORIES.map((cat) => (
                <div
                  key={cat.title}
                  id={cat.title === '게임' ? 'games' : undefined}
                  className="tool-card overflow-hidden"
                >
                  {/* Color accent bar */}
                  <div className={`h-[3px] ${cat.color}`} />

                  <div className="p-8">
                    {/* Icon */}
                    <div className={`mb-5 ${CATEGORY_ICON_COLORS[cat.title] || 'text-gray-400'}`}>
                      {CATEGORY_ICONS[cat.title]}
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-[#111]">{cat.title}</h3>
                    <p className="text-sm text-[#999] mb-6">
                      {cat.description}
                    </p>
                    <ul className="space-y-3">
                      {cat.tools.map((tool) => (
                        <li key={tool.href}>
                          <Link
                            href={tool.href}
                            className={`flex items-center gap-2 text-[#333] ${CATEGORY_LINK_HOVER[cat.title] || 'hover:text-blue-600'} transition-colors`}
                          >
                            <svg
                              className="w-3.5 h-3.5 text-[#ccc] shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            <span className="text-[15px]">{tool.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* News Section */}
      <FadeInSection>
        <section id="news" className="bg-white scroll-mt-20">
          <div className="container mx-auto px-4" style={{ padding: '40px 1rem' }}>
            <NewsList limit={50} title="최신 뉴스" showCategories={true} />
          </div>
        </section>
      </FadeInSection>

      {/* Footer */}
      <footer className="border-t border-[#eee] bg-white mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-[#999]">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
