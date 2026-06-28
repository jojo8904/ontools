import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GUIDES, getGuide } from '@/lib/guides'
import { RelatedTools } from '@/components/RelatedTools'

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = getGuide(params.slug)
  if (!g) return { title: '가이드 - ontools' }
  return {
    title: `${g.title} - ontools`,
    description: g.description,
    keywords: g.keywords,
    openGraph: {
      title: `${g.title} - ontools`,
      description: g.description,
      url: `https://ontools.co.kr/guide/${g.slug}`,
      siteName: 'ontools',
      type: 'article',
    },
  }
}

export default function GuideArticlePage({ params }: { params: { slug: string } }) {
  const g = getGuide(params.slug)
  if (!g) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold">ontools</span>
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">홈</a>
          {' > '}
          <Link href="/guide" className="hover:text-foreground">가이드</Link>
          {' > '}
          <span className="text-foreground font-medium">{g.category}</span>
        </div>

        <article>
          <h1 className="text-3xl font-bold mb-5 leading-tight text-[#241a33]">{g.title}</h1>

          <div className="space-y-4 text-[15px] leading-relaxed text-gray-700">
            {g.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {g.tool && (
            <div className="my-7 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <p className="text-sm text-gray-600 mb-2">바로 사용해 보기</p>
              <Link
                href={g.tool.href}
                className="inline-flex items-center gap-1 text-lg font-bold text-blue-700 hover:underline"
              >
                {g.tool.label} →
              </Link>
            </div>
          )}

          {g.sections.map((s, i) => (
            <section key={i} className="mt-8">
              <h2 className="text-xl font-bold mb-3 text-[#241a33]">{s.h}</h2>
              <div className="space-y-3 text-[15px] leading-relaxed text-gray-700">
                {s.p.map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </div>
            </section>
          ))}

          {g.tool && (
            <div className="mt-10 rounded-xl border border-gray-200 bg-[#F2EEE6] p-6 text-center">
              <p className="text-gray-700 mb-3">이 글에서 소개한 도구를 무료로 사용해 보세요.</p>
              <Link
                href={g.tool.href}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white hover:bg-blue-700"
              >
                {g.tool.label} 열기
              </Link>
            </div>
          )}
        </article>

        {g.tool && <RelatedTools current={g.tool.href} />}
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
