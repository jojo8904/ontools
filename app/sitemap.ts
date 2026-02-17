import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

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
  const routes = getPages(appDir)

  return routes.map((route) => ({
    url: `${baseUrl}${route === '/' ? '' : route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.8,
  }))
}
