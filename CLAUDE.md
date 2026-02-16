# ontools - Project Guidelines

> **Level**: Dynamic (Fullstack with BaaS)
> **Framework**: Next.js 14 + Supabase
> **Status**: Phase 2 - News System

## Project Overview

ontools is a Korean utility tools portal combined with AI-powered news aggregation.
- **Core Feature**: 8 utility calculators + automated news matching
- **Revenue Model**: Google AdSense
- **Infrastructure**: Next.js (Vercel) + Supabase (BaaS) + GitHub Actions (cron)

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
│       └── services/      # newsApi (Supabase)
├── lib/
│   ├── supabase.ts        # Supabase client
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

## Supabase Integration

### Tables

**news**:
- `id` (UUID PK), `title`, `summary` (AI 요약 200자), `source`, `published_at`
- `categories` (text[]), `related_tools` (text[]) - Claude API 추출
- `url` (unique) - 중복 체크 키
- `created_at`, `updated_at`

**exchange_rates**:
- `id` (UUID PK), `currency_code`, `rate` (numeric), `date`, `is_weekend`
- Index: `(currency_code, date DESC)`

### API Usage

```typescript
import { supabase } from '@/lib/supabase'

// News 조회
const { data } = await supabase
  .from('news')
  .select('*')
  .contains('related_tools', ['salary'])
  .order('published_at', { ascending: false })
  .limit(10)

// 환율 조회 (최신)
const { data } = await supabase
  .from('exchange_rates')
  .select('*')
  .eq('currency_code', 'USD')
  .order('date', { ascending: false })
  .limit(1)
```

### Environment Variables

```bash
# Frontend (anon key, public read)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Server-side scripts (service_role, full access)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### SQL Migration

`supabase/migrations/001_create_tables.sql` 참조

## Implementation Priorities

### Phase 1: 기본 도구 (2주) - DONE

1. ✅ Project setup
2. ✅ 3개 핵심 도구 (연봉, 환율, BMI)
3. ✅ SEO 인프라 (sitemap, robots, metadata)
4. ✅ Vercel 배포

### Phase 2: 뉴스 시스템 (2주) - CURRENT

1. ✅ Supabase 테이블 생성 (news, exchange_rates)
2. ✅ Frontend 뉴스 기능 (mock data)
3. ✅ GitHub Actions 워크플로우 (뉴스 크롤러, 환율 업데이트)
4. [ ] USE_MOCK_DATA → false 전환 (Supabase 연동 테스트 후)

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

- **Supabase**: Backend (PostgreSQL, RLS, Auth - 미사용 in MVP)
- **Vercel**: Frontend hosting
- **GitHub Actions**: 뉴스 크롤링 + Claude API 요약 (3시간마다), 환율 업데이트 (평일 11시)
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
