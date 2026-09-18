import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import Link from 'next/link'
import { RelatedTools } from './RelatedTools'

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
      <SiteHeader />

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

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-[#241a33]">{title}</h1>
          {description && <p className="text-[#6b6276]">{description}</p>}
        </div>

        {children}

        {current && <RelatedTools current={current} />}
      </main>

      <SiteFooter />
    </div>
  )
}
