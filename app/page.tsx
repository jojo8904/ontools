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
  {
    title: 'Salary & Tax',
    description: '연봉, 퇴직금, 세금 관련 계산',
    color: 'bg-emerald-500',
    tools: [
      { href: '/salary', label: '연봉 실수령액 계산기', badge: 'HOT' },
      { href: '/severance-pay', label: '퇴직금 계산기' },
      { href: '/weekly-holiday-pay', label: '주휴수당 계산기' },
      { href: '/unemployment', label: '실업급여 계산기' },
      { href: '/vat', label: '부가세(VAT) 계산기' },
      { href: '/freelancer-tax', label: '프리랜서 세금 계산기 (3.3%)' },
      { href: '/annual-leave-pay', label: '연차 수당 계산기' },
      { href: '/income-tax', label: '종합소득세 계산기', badge: 'NEW' },
      { href: '/hourly-wage', label: '시급 ↔ 월급 환산기' },
      { href: '/four-insurances', label: '4대보험 계산기', badge: 'NEW' },
    ],
  },
  {
    title: 'Finance',
    description: '환율, 대출, 투자 관련 금융 계산',
    color: 'bg-blue-500',
    tools: [
      { href: '/currency', label: '환율 계산기', badge: 'HOT' },
      { href: '/loan', label: '대출이자 계산기' },
      { href: '/savings', label: '적금/예금 이자 계산기' },
      { href: '/rent-vs-jeonse', label: '전세 vs 월세 비교 계산기' },
      { href: '/used-car-tax', label: '중고차 취등록세 계산기' },
      { href: '/capital-gains-tax', label: '양도소득세 계산기' },
      { href: '/brokerage-fee', label: '부동산 중개수수료 계산기' },
      { href: '/car-tax', label: '자동차세 계산기' },
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
      { href: '/calorie', label: '일일 칼로리(TDEE) 계산기', badge: 'HOT' },
      { href: '/ideal-weight', label: '적정체중 계산기' },
      { href: '/sleep', label: '수면 시간 계산기', badge: 'NEW' },
      { href: '/alcohol', label: '음주 알코올 분해 계산기' },
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
      { href: '/pyeong', label: '평수 ↔ ㎡ 변환기' },
      { href: '/d-day', label: 'D-day 계산기' },
      { href: '/electricity', label: '전기요금 계산기' },
      { href: '/discount', label: '할인율 계산기' },
      { href: '/date-calc', label: '날짜 계산기', badge: 'NEW' },
      { href: '/character-counter', label: '글자수 세기', badge: 'HOT' },
      { href: '/qr-generator', label: 'QR코드 생성기' },
      { href: '/password-generator', label: '비밀번호 생성기' },
    ],
  },
  {
    title: 'Game',
    description: '브라우저에서 바로 즐기는 캐주얼 게임',
    color: 'bg-violet-500',
    tools: [
      { href: '/games/2048', label: '2048', badge: 'HOT' },
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
    title: 'Image',
    description: '사진 용량·캡처·변환을 브라우저에서 바로 (서버 전송 없음)',
    color: 'bg-teal-500',
    tools: [
      { href: '/image-compress', label: '사진 용량 줄이기', badge: 'HOT' },
      { href: '/bg-remove', label: '배경 제거 (누끼)', badge: 'NEW' },
      { href: '/image-resize', label: '이미지 크기 조절', badge: 'NEW' },
      { href: '/image-convert', label: '이미지 형식 변환 (WEBP·PNG·JPG)', badge: 'NEW' },
      { href: '/image-crop', label: '이미지 자르기 (크롭)' },
      { href: '/pdf-to-image', label: 'PDF를 이미지로' },
      { href: '/image-stitch', label: '카톡 캡처 이어붙이기' },
      { href: '/image-mask', label: '민감정보 가리기 (모자이크)' },
      { href: '/exif-remove', label: '위치정보(GPS) 제거' },
      { href: '/image-split', label: '긴 이미지 분할' },
      { href: '/id-photo', label: '증명사진 만들기' },
      { href: '/heic-to-jpg', label: 'HEIC → JPG 변환' },
      { href: '/image-to-pdf', label: '이미지 PDF 변환' },
      { href: '/favicon', label: '파비콘 만들기' },
      { href: '/text-image', label: '텍스트 이미지 생성기' },
      { href: '/watermark', label: '워터마크 넣기' },
    ],
  },
]

export default function HomePage() {
  const topCategories = TOOL_CATEGORIES.slice(0, 3)
  const bottomCategories = TOOL_CATEGORIES.slice(3)

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
            <a href="#games" className="text-sm font-medium text-[#666] hover:text-[#111] transition-colors">
              게임
            </a>
            <a href="/guide" className="text-sm font-medium text-[#666] hover:text-[#111] transition-colors">
              가이드
            </a>
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
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/70 px-3 py-1 text-[0.8rem] font-semibold text-[#6b6276] ring-1 ring-[#e6def0] mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              계산기 · 게임 · 이미지 도구 50+
            </span>
            <h2 className="text-[2.5rem] md:text-[3.5rem] leading-[1.1] font-[900] tracking-[-0.03em] text-[#241a33] mb-0">
              당신의 <span className="hero-gradient-text">스마트한</span> 일상 도구
            </h2>
            <p className="text-[1.1rem] text-[#6b6276] mt-3 font-medium">
              연봉 계산부터 이미지 변환, 잠깐의 게임까지 — 필요한 도구를 한 곳에서.
            </p>
          </div>
        </div>
      </section>

      {/* 고양이 러너 게임 — 쉬어가기 (뉴스 티커 자리) */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-5">
          <CatRunner />
        </div>
      </section>

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

            {/* 카카오 애드핏 광고 (PC/모바일 자동 전환) */}
            <ResponsiveAdFit />

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
            <a href="/guide" className="hover:text-[#241a33] transition-colors">가이드</a>
            <span className="text-[#ddd]">|</span>
            <a href="https://getluckylab.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#241a33] transition-colors">행운연구소</a>
            <span className="text-[#ddd]">|</span>
            <a href="https://mallang-jo.tistory.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#241a33] transition-colors">블로그</a>
          </div>
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>

      {/* Floating Scroll Down Button */}
      <ScrollDownButton />
    </div>
  )
}
