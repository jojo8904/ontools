import Link from 'next/link'
import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide, type GuideSection } from '@/components/ToolGuide'
import { FaqSection, type FaqItem } from '@/components/FaqSection'

// Same page structure as the existing image tools, shared by the compound workflows.
export function ImageWorkflowPage({
  title,
  description,
  current,
  children,
  notes,
  guide,
  faq,
}: {
  title: string
  description: string
  current: string
  children: ReactNode
  notes: string[]
  guide: GuideSection[]
  faq: FaqItem[]
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            홈
          </Link>
          {' > '}이미지·파일{' > '}
          <span className="font-medium text-foreground">{title}</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="min-w-0 lg:col-span-2">{children}</div>
          <aside className="space-y-6 text-sm text-gray-600">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="mb-4 text-lg font-bold text-gray-900">파일 기준</h2>
              <div className="space-y-3 leading-relaxed">
                {notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            </section>
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="mb-4 text-lg font-bold text-gray-900">개인정보</h2>
              <p className="leading-relaxed">
                사진과 인식된 내용은 서버로 전송하거나 분석 로그에 기록하지 않습니다. 새로고침하거나 페이지를
                떠나면 작업 내용이 사라집니다.
              </p>
            </section>
          </aside>
        </div>
        <ToolGuide sections={guide} showScrollHint={false} />
        <FaqSection items={faq} />
        <RelatedTools current={current} />
      </main>
      <SiteFooter />
    </div>
  )
}
