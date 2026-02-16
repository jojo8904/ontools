import Link from 'next/link'
import { NewsList } from '@/features/news/components/NewsList'

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
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-2xl font-bold tracking-tight">ontools</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0]">
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
            당신의 <span className="text-blue-600">스마트한</span> 일상 도구
          </h2>
          <p className="text-lg md:text-xl text-gray-400">
            계산도, 뉴스도, 게임도 — 여기서 다.
          </p>
        </div>
      </section>

      {/* Tool Categories Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-2xl font-bold mb-2 tracking-tight">도구 모음</h2>
          <p className="text-gray-500 mb-10">
            카테고리별로 필요한 계산기를 찾아보세요
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOOL_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="rounded-xl border border-gray-100 bg-white overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                {/* Color accent bar */}
                <div className={`h-1 ${cat.color}`} />

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{cat.title}</h3>
                  <p className="text-sm text-gray-500 mb-5">
                    {cat.description}
                  </p>
                  <ul className="space-y-2.5">
                    {cat.tools.map((tool) => (
                      <li key={tool.href}>
                        <Link
                          href={tool.href}
                          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                        >
                          <svg
                            className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors shrink-0"
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

      {/* News Section */}
      <section className="bg-gray-50/80">
        <div className="container mx-auto px-4 py-20">
          <NewsList limit={50} title="최신 뉴스" showCategories={true} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-400">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
