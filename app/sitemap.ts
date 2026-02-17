import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ontools.co.kr'

  // 정적 페이지
  const routes = ['', '/salary', '/currency', '/bmi', '/severance-pay', '/loan', '/savings', '/calorie', '/weekly-holiday-pay', '/unemployment', '/vat', '/unit-converter', '/character-counter', '/qr-generator', '/d-day', '/electricity', '/games', '/games/2048', '/games/tetris', '/games/snake', '/games/minesweeper', '/games/solitaire', '/games/blackjack', '/games/memory', '/games/flappy', '/games/typing', '/games/gomoku'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
