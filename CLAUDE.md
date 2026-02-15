# ontools - Project Guidelines

> **Level**: Dynamic (Fullstack with BaaS)
> **Framework**: Next.js 14 + bkend.ai
> **Status**: Initial Setup Phase

## Project Overview

ontools is a Korean utility tools portal combined with AI-powered news aggregation.
- **Core Feature**: 8 utility calculators + automated news matching
- **Revenue Model**: Google AdSense
- **Infrastructure**: Next.js (Vercel) + bkend.ai (BaaS) + n8n (NAS cron jobs)

## Architecture (Dynamic Level)

```
src/
├── app/                    # Next.js 14 App Router
├── components/             # UI Components
│   ├── layout/            # Header, Footer, AdUnit
│   ├── tools/             # Calculator components
│   └── news/              # News feed components
├── features/               # Feature modules (Dynamic pattern)
│   ├── salary/
│   │   ├── hooks/         # useSalaryCalculator
│   │   └── utils.ts       # Calculation logic
│   ├── currency/
│   │   ├── hooks/
│   │   ├── services/      # exchangeRateApi
│   │   └── utils.ts       # getLatestRate (weekend fallback)
│   └── news/
│       ├── hooks/         # useNewsList
│       └── services/      # newsApi (bkend.ai)
├── lib/
│   ├── bkend.ts           # bkend.ai BaaS client
│   └── utils.ts           # Common utilities
└── types/                  # TypeScript types
    ├── news.ts
    └── tools.ts
```

## Coding Conventions

### Naming

- **Components**: PascalCase (`NewsCard`, `CalculatorLayout`)
- **Hooks**: camelCase + `use` prefix (`useSalaryCalculator`)
- **Functions**: camelCase (`calculateTakeHome()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_SALARY`)
- **Types**: PascalCase (`News`, `SalaryInput`)
- **Files**: PascalCase.tsx (components), camelCase.ts (utils)
- **Folders**: kebab-case (`salary-calculator/`)

### Import Order

```typescript
// 1. React
import { useState } from 'react'

// 2. Next.js
import Link from 'next/link'

// 3. External
import { useQuery } from '@tanstack/react-query'

// 4. Internal (@/ alias)
import { Button } from '@/components/ui/Button'
import { newsApi } from '@/features/news/services/newsApi'

// 5. Relative
import { useSalaryCalculator } from './hooks/useSalaryCalculator'

// 6. Types
import type { News } from '@/types'
```

### Environment Variables

- **Client-side**: `NEXT_PUBLIC_` prefix
- **Server-side**: No prefix (n8n only)

## bkend.ai Integration

### Collections

**News Collection**:
- `title`, `summary` (AI 요약 200자), `source`, `published_at`
- `categories[]`, `related_tools[]` (Claude API 추출)
- `url` (unique) - 중복 체크 키

**ExchangeRate Collection**:
- `currency_code`, `rate`, `date`, `source`
- Compound Index: `{currency_code: 1, date: -1}`

### API Usage

```typescript
// News 조회
const news = await bkend.data.list('News', {
  filter: JSON.stringify({ related_tools: 'salary' }),
  sort: JSON.stringify({ published_at: -1 }),
  limit: '10'
})

// 환율 조회 (최신)
const exchangeRate = await bkend.data.list('ExchangeRate', {
  filter: JSON.stringify({ currency_code: 'USD' }),
  sort: JSON.stringify({ date: -1 }),
  limit: '1'
})
```

## Implementation Priorities

### Phase 1: 기본 도구 (2주) - CURRENT

1. ✅ Project setup
2. [ ] 3개 핵심 도구
   - [ ] 연봉 실수령액 계산기 (`features/salary/`)
   - [ ] 환율 계산기 (`features/currency/`)
   - [ ] BMI 계산기 (`features/bmi/`)
3. [ ] SEO 인프라
   - [ ] `app/sitemap.xml/route.ts`
   - [ ] `app/robots.txt/route.ts`
   - [ ] 각 페이지 metadata
4. [ ] Vercel 배포

### Phase 2: 뉴스 시스템 (2주)

1. [ ] bkend.ai Collections 생성 (MCP)
2. [ ] Frontend 뉴스 기능
3. [ ] n8n 워크플로우 (NAS)
4. [ ] 도구-뉴스 매칭

### Phase 3: 수익화 (1주)

1. [ ] Google AdSense 신청
2. [ ] AdUnit 컴포넌트
3. [ ] **AdSense 호환 CSP 설정**

### Phase 4: 추가 도구 (1주)

1. [ ] 퇴직금, 단위변환, D-day, 전기요금 계산기

## Key Design Decisions

1. **Claude API Model**: Haiku 4.5 (비용 90% 절감, 뉴스 요약 충분)
2. **환율 오프라인 폴백**: 주말/공휴일 시 기준일 명시 (`ExchangeRateDisplay`)
3. **CSP**: Phase 3에서 AdSense와 함께 적용 (MVP는 미적용)
4. **뉴스 상세 페이지**: 제거 (카드→원문 직접 연결)
5. **테스트**: Phase 1은 계산 로직 유닛 테스트만 (컴포넌트/E2E는 Phase 2+)

## Security Checklist

- [x] Input Validation (Zod)
- [x] XSS Prevention (Next.js escape)
- [x] API Key Protection (환경변수)
- [x] HTTPS (Vercel 자동)
- [ ] CSP (Phase 3)

## Performance Goals

- **Lighthouse**: 90+ (Desktop)
- **ISR**: 뉴스 페이지 5분마다 재생성
- **Bundle Size**: Tailwind purge, tree-shaking

## External Services

- **bkend.ai**: Backend (Collections, Auth - 미사용 in MVP)
- **Vercel**: Frontend hosting
- **n8n (NAS)**: 뉴스 크롤링 + Claude API 요약
- **Claude API**: Haiku 4.5 (`claude-haiku-4-5-20251001`)
- **한국수출입은행 API**: 환율 데이터

## Commands

```bash
# Development
npm install
npm run dev         # http://localhost:3000

# Build
npm run build
npm run start

# Test
npm run test
```

## Related Documents

- Plan: [docs/01-plan/features/ontools.plan.md](docs/01-plan/features/ontools.plan.md)
- Design: [docs/02-design/features/ontools.design.md](docs/02-design/features/ontools.design.md)
