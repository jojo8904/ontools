import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { GUIDES, getGuideDate } from '@/lib/guides'

// 도구·정적 페이지의 최종 수정일. 페이지를 크게 바꾸면 여기 날짜를 갱신한다.
// 없는 경로는 2026-09 유지보수 릴리스 날짜를 쓴다.
const DEFAULT_UPDATED = '2026-09-19'
// noindex 페이지는 사이트맵에서 제외
const EXCLUDED_ROUTES = new Set(['/youth-savings'])
const ROUTE_UPDATED: Record<string, string> = {
  '/': '2026-09-27',
  '/guide': '2026-09-24',
  '/salary': '2026-09-27',
  '/income-tax': '2026-09-24',
}

function getPages(dir: string, base = ''): string[] {
  const routes: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  const hasPage = entries.some((e) => e.isFile() && e.name === 'page.tsx')
  if (hasPage) {
    routes.push(base || '/')
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    // skip private folders, api, _next
    if (entry.name.startsWith('_') || entry.name === 'api') continue
    // 동적 라우트 폴더([slug] 등)는 건너뛰고 아래에서 실제 경로를 직접 추가
    if (entry.name.startsWith('[')) continue

    let segment = entry.name
    // route groups: (tools) → strip parentheses, no segment added
    if (segment.startsWith('(') && segment.endsWith(')')) {
      routes.push(...getPages(path.join(dir, entry.name), base))
    } else {
      routes.push(...getPages(path.join(dir, entry.name), `${base}/${segment}`))
    }
  }

  return routes
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ontools.co.kr'
  const appDir = path.join(process.cwd(), 'app')
  const routes = getPages(appDir).filter((r) => !EXCLUDED_ROUTES.has(r))

  const entries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route === '/' ? '' : route}`,
    lastModified: new Date(`${ROUTE_UPDATED[route] ?? DEFAULT_UPDATED}T00:00:00+09:00`),
    changeFrequency: route === '/' ? ('daily' as const) : ('weekly' as const),
    priority: route === '/' ? 1 : 0.8,
  }))

  // 가이드 동적 글 경로 추가 (게시일 기준 lastmod)
  for (const g of GUIDES) {
    entries.push({
      url: `${baseUrl}/guide/${g.slug}`,
      lastModified: new Date(`${getGuideDate(g.slug)}T00:00:00+09:00`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })
  }

  return entries
}
