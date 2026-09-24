# ontools - Project Guidelines

> **Framework**: Next.js 16 (App Router, webpack) + React 18 + TypeScript + Tailwind CSS 3 + Supabase
> **Site**: https://ontools.co.kr (Vercel, `main` push = production deploy)
> **Status**: 운영 중. 2026-09 유지보수 릴리스 완료, AdSense 승인 대기

## Project Overview

브라우저에서 동작하는 한국어 유틸리티 포털.
- **도구 68종** (`lib/tools.ts`): finance 11, salary-tax 13, health 7, image 22, utility 15
- **이미지·PDF 워크플로우** (`lib/image-workflows.ts`, `lib/workflows.ts`): 파일은 브라우저 로컬에서만 처리, 서버 업로드 없음
- **게임 10종** (`app/games/`), **가이드** (`app/guide/[slug]`, `lib/guides.ts`), 연봉 실수령액 표 (`app/salary-table`)
- **외부 데이터**: 환율(ExchangeRate-API), 관련 유튜브 영상(YouTube Data API) → Supabase에 저장, 브라우저는 anon 키로 읽기만
- **수익**: 애드핏(운영 중), 애드센스(승인 전, 슬롯 미발급 시 비표시)

뉴스 시스템은 제거됨. 기존 `docs/01-plan`, `docs/02-design`은 초기 기획 기록이며 현재 구현과 다를 수 있음.

## Directory Layout

```
app/
├── (tools)/               # 도구 페이지 69 라우트 (route group, URL은 /<slug>)
├── games/                 # 브라우저 게임
├── guide/[slug]/          # 가이드 글
├── salary-table/          # 2026 연봉 실수령액 표
├── layout.tsx, page.tsx   # 루트 레이아웃, 홈
├── sitemap.ts, robots.ts, opengraph-image.tsx
└── about, contact, privacy, terms, id-photo-size
components/
├── SiteHeader, SiteFooter, ToolShell, ToolGuide, RelatedTools, FaqSection
├── AdUnit, AdFitUnit, ResponsiveAdFit, GoogleAnalytics, PromoBanner
├── ImageWorkflowPage.tsx  # 이미지 워크플로우 공용 페이지
├── PolicyPeriodSelect, PolicySources   # 2026 상·하반기 정책 기준 선택
├── tools/                 # 개별 계산기 컴포넌트
└── ui/
features/                  # 도메인 로직 (hooks/, services/, utils.ts)
├── salary, currency, bmi, dday, electricity, resignation, retirement,
│   selling-price, shift-pay, unit-converter, table-ocr, youtube
lib/
├── tools.ts               # 도구 레지스트리 (href, label, category, badge, keywords)
├── korea-policy.ts        # 2026 보험료율·세액 등 정책 상수
├── supabase.ts            # getSupabaseClient(): env 없으면 null 반환
├── analytics.ts           # GA4 이벤트 (tool_view, 완료 이벤트)
├── guides.ts, gameInfo.ts, image-workflows.ts, workflows.ts
├── safety.ts, pdf-ranges.ts, spreadsheet.ts, password.ts, civil-date.ts
└── useLocalTask, useObjectUrls, useStoredNumber (hooks)
scripts/
├── update-exchange-rate.ts   # 환율 수집 (GitHub Actions, service_role)
├── crawl-youtube.ts          # 유튜브 수집 (GitHub Actions, service_role)
├── copy-pdf-worker.mjs, copy-ocr-worker.mjs   # postinstall: worker를 public/으로 복사
└── backfill-images.ts
supabase/migrations/       # 001~005, 순서대로 1회씩만 적용. 운영 DB는 005까지 적용됨 (2026-09-19)
supabase/tests/            # PGlite로 RLS/GRANT 검증
e2e/                       # Playwright (desktop Chrome 1440px, Pixel 7)
docs/                      # 진단·유지보수·성장 아이디어·신규 도구 기록
```

## Coding Conventions

### Naming

- **Components**: PascalCase (`ToolShell`, `RelatedTools`)
- **Hooks**: camelCase + `use` prefix (`useSalaryCalculator`, `useLocalTask`)
- **Functions**: camelCase (`calculateTakeHome()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_SALARY`)
- **Types**: PascalCase (`SalaryInput`)
- **Files**: PascalCase.tsx (components), camelCase.ts (utils/hooks)
- **Folders / URL slugs**: kebab-case (`selling-price/`)

### Import Order

```typescript
// 1. React
import { useState } from 'react'

// 2. Next.js
import Link from 'next/link'

// 3. External
import { z } from 'zod'

// 4. Internal (@/ alias)
import { ToolShell } from '@/components/ToolShell'
import { TOOLS } from '@/lib/tools'

// 5. Relative
import { useSalaryCalculator } from './hooks/useSalaryCalculator'

// 6. Types
import type { SalaryInput } from './types'
```

### 새 도구 추가 절차

1. `lib/tools.ts`에 항목 추가 (href, label, category, keywords) → sitemap, 홈 목록, 검색에 자동 반영
2. `app/(tools)/<slug>/page.tsx` 생성, `ToolShell` + metadata(canonical) 사용
3. 계산 로직은 `features/<name>/utils.ts`에 두고 `utils.test.ts`로 단위 테스트
4. 파일 처리 도구는 `useLocalTask`/`useObjectUrls` 사용, 파일을 서버로 보내지 않음
5. 정책 상수(세율·보험료율·요금표)는 `lib/korea-policy.ts`에 근거 출처와 함께 추가

### Environment Variables

`.env.example`이 기준. 로컬은 `.env.local` (Git 제외).

- **브라우저**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_ADSENSE_*`, `NEXT_PUBLIC_ADFIT_UNIT_ID`
- **GitHub Actions secrets만**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `YOUTUBE_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- service_role 키는 절대 `NEXT_PUBLIC_*`, Git, 빌드 산출물에 넣지 않음
- Supabase env가 없어도 기본 계산기·파일 도구는 동작. 환율은 고정 참고값 표시, 영상은 비표시

## Supabase

### Tables

**exchange_rates**: `currency_code`, `rate`, `date` (제공기관 기준시각, timestamptz), `source`, `fetched_at`
**youtube_videos**: `video_id`, `title`, `thumbnail_url`, `channel_name`, `view_count`, `tool_category`, `created_at`
  - (`tool_category`, `video_id`) unique. 카테고리 교체는 service_role 전용 RPC `replace_youtube_category`

### 권한

- `anon`, `authenticated`: SELECT만. INSERT/UPDATE/DELETE는 RLS로 차단 (anon POST → 401 확인됨)
- `service_role`: 수집 스크립트 전용, RLS 우회
- 변경 시 `supabase/tests/security.test.ts` 통과 필수

### 사용 예

```typescript
import { getSupabaseClient } from '@/lib/supabase'

const supabase = getSupabaseClient()
if (!supabase) return FALLBACK

const { data } = await supabase
  .from('exchange_rates')
  .select('currency_code, rate, date, source')
  .eq('currency_code', 'USD')
  .order('date', { ascending: false })
  .limit(1)
```

환율은 36시간 초과 시 "오래된 데이터", env 미설정 시 "고정 참고값"으로 구분 표시한다.

## Scheduled Jobs (GitHub Actions)

| Workflow | Cron (UTC) | 실제 실행 경향 | 비고 |
| --- | --- | --- | --- |
| exchange-rate-updater.yml | `0 2 * * 1-5` (KST 11시, 평일) | GitHub 지연으로 보통 07:00 UTC(KST 16시)경 | open.er-api.com KRW 기준, 4개 통화 |
| youtube-crawler.yml | `0 0 * * 1` (KST 월 09시) | 대체로 정시 근처 | 도구 카테고리별 검색 후 교체 저장 |
| ci.yml | push/PR | - | lint, typecheck, unit+DB 테스트, build, Playwright desktop/mobile, `npm audit --omit=dev` |

실패 시 Telegram 알림(선택). 수동 실행은 Actions 탭의 workflow_dispatch.

## Commands

```bash
npm ci               # postinstall이 PDF.js/OCR worker를 public/에 복사 (Git 미포함)
npm run dev          # http://localhost:3000 (webpack)
npm run build && npm run start

npm run lint
npm run typecheck
npm test -- --run    # vitest: features/**, lib/**, scripts/**, supabase/tests (PGlite)
npx playwright install chromium && npm run test:e2e   # 127.0.0.1:4127에 운영 모드 서버 자동 기동
PLAYWRIGHT_BASE_URL=https://ontools.co.kr npm run test:e2e   # 배포본 대상 검사
npm audit --omit=dev --audit-level=high
```

Node 24 LTS 권장(최소 22.13). 릴리스 절차와 DB 사전 조건은 `DEPLOYMENT.md`.

## Key Design Decisions

1. **브라우저 로컬 처리**: 이미지·PDF·OCR은 서버 없이 처리. 파일명·급여·비밀번호·이미지 내용은 분석 이벤트에 넣지 않음
2. **정책 기준 명시**: 급여·세금 도구는 2026 상·하반기 기준을 선택하게 하고 출처를 `PolicySources`로 표시. 간이세액표·비과세·연말정산 공제는 미재현
3. **환율 폴백**: 제공기관 기준시각 표시, 36시간 초과 및 고정값을 UI에서 구분
4. **canonical**: `https://ontools.co.kr` 단일 기준. 도구 페이지마다 metadata에 canonical 지정
5. **ESLint 9.39.x 고정**: Next ESLint 플러그인 호환 확인 전까지 ESLint 10 미적용
6. **CSP**: AdSense 승인 후 함께 적용 예정 (미적용)
7. **테스트 범위**: 계산 로직·워크플로우·DB 권한은 단위 테스트, 렌더링·네비게이션은 Playwright

## Security Checklist

- [x] Input Validation (Zod)
- [x] XSS Prevention (Next.js escape)
- [x] service_role 키 서버 비밀에만 보관
- [x] 공개 테이블 SELECT 전용 (migration 004/005)
- [x] HTTPS (Vercel)
- [ ] CSP (AdSense 승인 후)

## Related Documents

- 릴리스 절차: `DEPLOYMENT.md`
- 코드 진단: `docs/CODE-REVIEW-2026-09-18.md`
- 유지보수 내역: `docs/MAINTENANCE-2026-09-18.md`
- 신규 도구: `docs/NEW-TOOLS-2026-09-19.md`
- 성장 아이디어: `docs/GROWTH-IDEAS-2026-09-18.md`
- 의존성 업그레이드 계획: `docs/UPGRADE-PLAN-2026-09-24.md`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
