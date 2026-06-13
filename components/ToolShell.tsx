import Link from 'next/link'
import { RelatedTools } from './RelatedTools'
import { ShareButtons } from './ShareButtons'

interface ToolShellProps {
  title: string
  description?: string
  breadcrumb?: string
  /** 현재 도구 href — 관련 도구 추천에 사용 */
  current?: string
  children: React.ReactNode
}

/**
 * 도구 페이지 공통 셸 (헤더/브레드크럼/타이틀/공유/관련도구/푸터)
 * 신규 계산기 페이지에서 재사용
 */
export function ToolShell({ title, description, breadcrumb, current, children }: ToolShellProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf8fc' }}>
      <header className="bg-white border-b border-[#eee]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold text-[#111]">ontools</span>
          </a>
          <a
            href="https://getluckylab.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
          >
            🍀 행운연구소
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 w-full max-w-3xl">
        <div className="text-sm text-[#999] mb-4">
          <Link href="/" className="hover:text-[#333]">홈</Link>
          {breadcrumb && (
            <>
              {' › '}
              <span className="text-[#555]">{breadcrumb}</span>
            </>
          )}
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[#241a33]">{title}</h1>
            {description && <p className="text-[#6b6276]">{description}</p>}
          </div>
          <ShareButtons title={`${title} - ontools`} />
        </div>

        {children}

        {current && <RelatedTools current={current} />}
      </main>

      <footer className="mt-auto border-t border-[#ece6f2]" style={{ backgroundColor: '#F7F3FB' }}>
        <div className="container mx-auto px-4 py-6 text-center text-sm text-[#8a8290]">
          <div className="flex items-center justify-center gap-4 mb-3">
            <Link href="/privacy" className="hover:text-[#241a33] transition-colors">개인정보처리방침</Link>
            <span className="text-[#ddd]">|</span>
            <Link href="/terms" className="hover:text-[#241a33] transition-colors">이용약관</Link>
          </div>
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
