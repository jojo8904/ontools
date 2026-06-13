import Link from 'next/link'
import { NewsList } from '@/features/news/components/NewsList'
import { NewsTicker } from './NewsTicker'
import { FadeInSection } from './FadeInSection'
import { ScrollDownButton } from './ScrollDownButton'
import { PromoBanner } from '@/components/PromoBanner'
import { AdUnit } from '@/components/AdUnit'
import { AdFitUnit } from '@/components/AdFitUnit'
import { FavoriteStar } from './FavoriteStar'
import { fetchLatestNews, fetchNewsList } from '@/features/news/services/newsApi'

export const revalidate = 3600

const CATEGORY_LINK_HOVER: Record<string, string> = {
  'Salary & Tax': 'hover:text-emerald-600',
  Finance: 'hover:text-blue-600',
  Health: 'hover:text-rose-600',
  Utility: 'hover:text-blue-600',
  Game: 'hover:text-violet-600',
  News: 'hover:text-red-600',
}

// 카테고리별 마스코트 일러스트 배너 (AI 생성, 캐릭터 일관성 유지)
const CATEGORY_IMAGES: Record<string, string> = {
  'Salary & Tax': '/images/cat-salary.webp',
  Finance: '/images/cat-finance.webp',
  Health: '/images/cat-health.webp',
  Utility: '/images/cat-utility.webp',
  Game: '/images/cat-game.webp',
  News: '/images/cat-news.webp',
}

const TOOL_CATEGORIES = [
  {
    title: 'Salary & Tax',
    description: '연봉, 퇴직금, 세금 관련 계산',
    color: 'bg-emerald-500',
    tools: [
      { href: '/salary', label: '연봉 실수령액 계산기', badge: '인기' },
      { href: '/severance-pay', label: '퇴직금 계산기' },
      { href: '/weekly-holiday-pay', label: '주휴수당 계산기' },
      { href: '/unemployment', label: '실업급여 계산기' },
      { href: '/vat', label: '부가세(VAT) 계산기' },
      { href: '/freelancer-tax', label: '프리랜서 세금 계산기 (3.3%)', badge: 'NEW' },
      { href: '/annual-leave-pay', label: '연차 수당 계산기', badge: 'NEW' },
      { href: '/income-tax', label: '종합소득세 계산기', badge: 'NEW' },
      { href: '/hourly-wage', label: '시급 ↔ 월급 환산기', badge: 'NEW' },
      { href: '/four-insurances', label: '4대보험 계산기', badge: 'NEW' },
    ],
  },
  {
    title: 'Finance',
    description: '환율, 대출, 투자 관련 금융 계산',
    color: 'bg-blue-500',
    tools: [
      { href: '/currency', label: '환율 계산기', badge: '인기' },
      { href: '/loan', label: '대출이자 계산기' },
      { href: '/savings', label: '적금/예금 이자 계산기' },
      { href: '/rent-vs-jeonse', label: '전세 vs 월세 비교 계산기', badge: 'NEW' },
      { href: '/used-car-tax', label: '중고차 취등록세 계산기', badge: 'NEW' },
      { href: '/capital-gains-tax', label: '양도소득세 계산기', badge: 'NEW' },
      { href: '/brokerage-fee', label: '부동산 중개수수료 계산기', badge: 'NEW' },
      { href: '/car-tax', label: '자동차세 계산기', badge: 'NEW' },
      { href: '/gift-tax', label: '증여세 계산기', badge: 'NEW' },
      { href: '/compound-interest', label: '복리 계산기', badge: 'NEW' },
    ],
  },
  {
    title: 'Health',
    description: '건강 지표를 간편하게 확인',
    color: 'bg-rose-500',
    tools: [
      { href: '/bmi', label: 'BMI 계산기' },
      { href: '/calorie', label: '일일 칼로리(TDEE) 계산기', badge: '인기' },
      { href: '/ideal-weight', label: '적정체중 계산기', badge: 'NEW' },
      { href: '/sleep', label: '수면 시간 계산기', badge: 'NEW' },
      { href: '/alcohol', label: '음주 알코올 분해 계산기', badge: 'NEW' },
      { href: '/due-date', label: '출산예정일 계산기', badge: 'NEW' },
      { href: '/water-intake', label: '물 섭취량 계산기' },
    ],
  },
  {
    title: 'Utility',
    description: '일상에서 자주 쓰는 변환/계산 도구',
    color: 'bg-blue-500',
    tools: [
      { href: '/age', label: '만 나이 계산기', badge: 'NEW' },
      { href: '/unit-converter', label: '단위 변환기' },
      { href: '/pyeong', label: '평수 ↔ ㎡ 변환기', badge: 'NEW' },
      { href: '/d-day', label: 'D-day 계산기' },
      { href: '/electricity', label: '전기요금 계산기' },
      { href: '/discount', label: '할인율 계산기', badge: 'NEW' },
      { href: '/date-calc', label: '날짜 계산기', badge: 'NEW' },
      { href: '/character-counter', label: '글자수 세기', badge: '인기' },
      { href: '/qr-generator', label: 'QR코드 생성기' },
      { href: '/password-generator', label: '비밀번호 생성기' },
    ],
  },
  {
    title: 'Game',
    description: '브라우저에서 바로 즐기는 캐주얼 게임',
    color: 'bg-violet-500',
    tools: [
      { href: '/games/2048', label: '2048' },
      { href: '/games/tetris', label: '테트리스' },
      { href: '/games/snake', label: '스네이크' },
      { href: '/games/minesweeper', label: '지뢰찾기' },
      { href: '/games/solitaire', label: '솔리테어' },
      { href: '/games/blackjack', label: '블랙잭' },
      { href: '/games/memory', label: '메모리 카드' },
      { href: '/games/flappy', label: 'Flappy Bird' },
      { href: '/games/typing', label: '타자연습' },
      { href: '/games/gomoku', label: '오목' },
    ],
  },
  {
    title: 'News',
    description: 'AI가 매칭한 도구 관련 최신 뉴스',
    color: 'bg-red-500',
    tools: [],
  },
]

export default async function HomePage() {
  const topCategories = TOOL_CATEGORIES.slice(0, 3)
  const bottomCategories = TOOL_CATEGORIES.slice(3)
  let latestNews: { title: string; url: string; source: string }[] = []
  try {
    const news = await fetchLatestNews(6)
    latestNews = news.map((n) => ({ title: n.title, url: n.url, source: n.source }))
  } catch (error) {
    console.error('[HomePage] 최신 뉴스 티커 로딩 실패:', error)
    latestNews = []
  }

  // Pre-fetch news for the news section (ISR: revalidated every 3600s)
  let newsInitialData = null
  try {
    const newsResponse = await fetchNewsList({
      limit: 50,
      sortBy: 'published_at',
    })
    newsInitialData = newsResponse.data
  } catch (error) {
    console.error('[HomePage] 뉴스 목록 프리페치 실패:', error)
    newsInitialData = null
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#eee] sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-2xl font-bold tracking-tight text-[#111]">ontools</span>
          </a>
          <nav className="flex items-center gap-5">
            <a href="#tools" className="text-sm font-medium text-[#666] hover:text-[#111] transition-colors">
              도구
            </a>
            <a href="#news" className="text-sm font-medium text-[#666] hover:text-[#111] transition-colors">
              뉴스
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

      {/* Hero Section — 텍스트 중심의 깔끔한 그라데이션 (고양이는 카테고리 카드에 등장) */}
      <section
        className="relative overflow-hidden"
        style={{
          height: '220px',
          background: 'linear-gradient(120deg, #FFF6EE 0%, #F6F0FB 55%, #EDE7FA 100%)',
        }}
      >
        <div className="container mx-auto px-4 h-full relative z-[1]">
          <div className="flex flex-col justify-center h-full">
            <h2 className="text-[2.5rem] md:text-[3.5rem] leading-[1.1] font-[900] tracking-[-0.03em] text-[#241a33] mb-0">
              당신의 <span className="hero-gradient-text">스마트한</span> 일상 도구
            </h2>
            <p className="text-[1.1rem] text-[#6b6276] mt-3 font-medium">
              계산도, 뉴스도, 게임도 — 여기서 다.
            </p>
          </div>
        </div>
      </section>

      {/* News Ticker */}
      <NewsTicker />

      {/* Tool Categories Section */}
      <FadeInSection>
        <section
          id="tools"
          className="scroll-mt-20"
          style={{ background: 'linear-gradient(180deg, #FBF7F2 0%, #F4EFFA 100%)' }}
        >
          <div className="container mx-auto px-4 pt-10 pb-10">
            {/* 행운연구소 크로스 프로모션 */}
            <div className="mb-10">
              <PromoBanner />
            </div>

            {/* 카카오 애드핏 광고 */}
            <AdFitUnit />

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
                    {cat.title === 'Game' && (
                      <Link
                        href="/games"
                        className="mt-4 pt-3 border-t border-[#eee] text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1"
                      >
                        전체 게임 보기 →
                      </Link>
                    )}
                    {cat.title === 'News' && (
                      <>
                        <ul className="space-y-3">
                          {latestNews.map((news) => (
                            <li key={news.url}>
                              <a
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[#333] hover:text-red-600 transition-colors"
                              >
                                <svg className="w-3.5 h-3.5 text-[#ccc] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-[15px] line-clamp-1">{news.title}</span>
                              </a>
                            </li>
                          ))}
                          {latestNews.length === 0 && (
                            <li className="text-sm text-[#666]">뉴스를 불러오는 중...</li>
                          )}
                        </ul>
                        <Link
                          href="/news"
                          className="mt-4 pt-3 border-t border-[#eee] text-sm font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                        >
                          더 많은 뉴스 보기 →
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* 광고 (AdSense 승인 후 슬롯 ID 입력) */}
      <div className="container mx-auto px-4">
        <AdUnit slot="0000000000" />
      </div>

      {/* News Section */}
      <FadeInSection>
        <section id="news" className="bg-white scroll-mt-20">
          <div className="container mx-auto px-4" style={{ padding: '20px 1rem 40px' }}>
            <h2 className="text-[2rem] font-[800] tracking-tight text-[#111] mb-6">최신 뉴스</h2>
            <NewsList news={newsInitialData ?? []} title="" showCategories={true} />
          </div>
        </section>
      </FadeInSection>

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
            <a href="https://getluckylab.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#241a33] transition-colors">행운연구소</a>
          </div>
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>

      {/* Floating Scroll Down Button */}
      <ScrollDownButton />
    </div>
  )
}
