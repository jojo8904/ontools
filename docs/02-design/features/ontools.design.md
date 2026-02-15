# ontools Design Document

> **Summary**: 실생활 유틸리티 도구와 AI 자동 뉴스 포털 - 상세 설계
>
> **Project**: ontools
> **Version**: 0.1.0
> **Author**: User
> **Date**: 2026-02-15
> **Status**: Draft
> **Planning Doc**: [ontools.plan.md](../../01-plan/features/ontools.plan.md)

### Pipeline References

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 | [Schema Definition](../../01-plan/schema.md) | ❌ N/A |
| Phase 2 | [Coding Conventions](../../01-plan/conventions.md) | ❌ N/A |
| Phase 3 | [Mockup](../mockup/ontools.md) | ❌ N/A |
| Phase 4 | [API Spec](../api/ontools.md) | ❌ N/A |

> **Note**: 이 Design 문서가 Schema/Convention/Mockup/API 역할을 통합합니다.

---

## 1. Overview

### 1.1 Design Goals

1. **SEO 최적화**: 각 도구 페이지를 검색 엔진에 최적화하여 자연 유입 확보
2. **재방문 유도**: 도구 사용 시 관련 뉴스를 자동 제공하여 재방문율 증가
3. **무료 인프라**: Vercel + bkend.ai 무료 티어로 초기 비용 최소화
4. **확장 가능성**: 새로운 도구와 뉴스 소스를 쉽게 추가 가능한 구조

### 1.2 Design Principles

- **단일 책임**: 각 도구는 독립적인 페이지와 컴포넌트로 분리
- **재사용성**: 공통 UI 컴포넌트 (카드, 입력, 결과 표시) 재사용
- **성능 우선**: 클라이언트 사이드 계산으로 서버 부하 최소화, ISR로 뉴스 캐싱
- **타입 안전성**: TypeScript 엄격 모드로 런타임 에러 방지

---

## 2. Architecture

### 2.1 System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│  Next.js 14 App Router + Tailwind CSS + Zustand + React Query   │
└────────────┬─────────────────────────────────────┬───────────────┘
             │                                     │
             │ REST API                            │ AdSense SDK
             │                                     │
┌────────────▼──────────────────┐      ┌──────────▼──────────────┐
│   bkend.ai BaaS Platform      │      │   Google AdSense API    │
│   - News Collection           │      │   - Ad Units            │
│   - ExchangeRate Collection   │      │   - Revenue Tracking    │
└────────────▲──────────────────┘      └─────────────────────────┘
             │
             │ Cron Jobs (n8n on NAS)
             │
┌────────────▼──────────────────────────────────────────────────────┐
│                     n8n Workflow Automation                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ IT/Tech News │  │ Finance News │  │ Exchange Rate Update │   │
│  │ (6h interval)│  │ (6h interval)│  │ (Weekday 11:00 KST)  │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────────────┘   │
│         │                 │                 │                     │
│         │ RSS Fetch       │ RSS Fetch       │ API Call            │
│         ▼                 ▼                 ▼                     │
│  ┌────────────────────────────────────────────────────┐          │
│  │           Claude API (Summarization)               │          │
│  └────────────────┬───────────────────────────────────┘          │
│                   │ Save to bkend.ai                             │
│                   ▼                                              │
│  ┌────────────────────────────────────────────────────┐          │
│  │         Telegram Error Notification                │          │
│  └────────────────────────────────────────────────────┘          │
└───────────────────────────────────────────────────────────────────┘
```

### 2.2 Frontend Architecture (Next.js)

```
src/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx                # Root layout (Header, Footer, Analytics)
│   ├── page.tsx                  # 홈페이지 (도구 목록 + IT 뉴스 피드)
│   ├── (tools)/                  # Route Group (공통 레이아웃)
│   │   ├── layout.tsx            # 도구 페이지 레이아웃 (AdSense 포함)
│   │   ├── salary/page.tsx       # 연봉 실수령액 계산기
│   │   ├── currency/page.tsx     # 환율 계산기
│   │   ├── retirement/page.tsx   # 퇴직금 계산기
│   │   ├── bmi/page.tsx          # BMI 계산기
│   │   ├── unit/page.tsx         # 단위 변환기
│   │   ├── dday/page.tsx         # D-day 카운터
│   │   └── electricity/page.tsx  # 전기요금 계산기
│   ├── news/                     # 뉴스 피드 페이지
│   │   └── page.tsx              # 전체 뉴스 목록 (상세 페이지 제거)
│   ├── sitemap.xml/route.ts      # Dynamic sitemap generator
│   └── robots.txt/route.ts       # robots.txt generator
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # 네비게이션
│   │   ├── Footer.tsx            # 링크 + 정보
│   │   └── AdUnit.tsx            # Google AdSense 광고 컴포넌트
│   ├── ui/                       # shadcn/ui 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── tools/                    # 도구별 공통 컴포넌트
│   │   ├── ToolCard.tsx          # 도구 소개 카드
│   │   ├── CalculatorLayout.tsx  # 계산기 레이아웃
│   │   └── ResultCard.tsx        # 결과 표시 카드
│   └── news/
│       ├── NewsCard.tsx          # 뉴스 카드
│       ├── NewsFeed.tsx          # 뉴스 피드 리스트
│       └── NewsFilter.tsx        # 카테고리 필터
├── features/                     # 기능별 모듈 (Dynamic 레벨)
│   ├── salary/
│   │   ├── hooks/
│   │   │   └── useSalaryCalculator.ts  # 연봉 계산 로직
│   │   ├── types.ts              # 연봉 관련 타입
│   │   └── utils.ts              # 계산 유틸리티
│   ├── currency/
│   │   ├── hooks/
│   │   │   └── useCurrencyConverter.ts
│   │   ├── services/
│   │   │   └── exchangeRateApi.ts  # bkend.ai 환율 API
│   │   ├── utils.ts              # getLatestRate() - 주말 폴백 로직
│   │   └── types.ts
│   └── news/
│       ├── hooks/
│       │   ├── useNewsList.ts    # React Query 훅
│       │   └── useNewsDetail.ts
│       ├── services/
│       │   └── newsApi.ts        # bkend.ai News API
│       └── types.ts
├── lib/
│   ├── bkend.ts                  # bkend.ai MCP 클라이언트
│   ├── queryClient.ts            # React Query 설정
│   └── utils.ts                  # 공통 유틸리티 (cn, formatDate 등)
├── stores/
│   └── toolsStore.ts             # Zustand 전역 상태 (최근 사용 도구 등)
└── types/
    ├── news.ts                   # News 타입
    ├── tools.ts                  # 도구 공통 타입
    └── index.ts
```

### 2.3 Data Flow

**도구 사용 플로우 (클라이언트 사이드)**
```
User Input → Validation → Calculation (client-side) → Display Result
                                    ↓
                              Save to Local Storage (최근 계산)
```

**뉴스 표시 플로우**
```
Page Load → React Query Fetch → bkend.ai API → ISR Cache (5min) → Display
                                                      ↓
                                              Tool-based filtering
```

**n8n 자동 뉴스 수집 플로우**
```
Cron Trigger → RSS Fetch → Parse XML → Check Duplicates (bkend.ai query)
    ↓
Claude API Summarize (JSON: summary, categories, related_tools)
    ↓
Save to bkend.ai News Collection
    ↓
(on error) → Telegram Notification
```

---

## 3. Data Model

### 3.1 bkend.ai Collections

#### News Collection

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| _id | ObjectId | auto | auto | - | System generated |
| title | String | ✅ | ❌ | - | 뉴스 제목 |
| summary | String | ✅ | ❌ | - | AI 요약 (200자) |
| original_content | String | ✅ | ❌ | - | 원본 내용 (일부) |
| source | String | ✅ | ❌ | - | RSS 출처 (IT조선, 한국경제 등) |
| published_at | Date | ✅ | ❌ | - | 원본 발행일 |
| categories | Array[String] | ✅ | ❌ | [] | ['tech', 'finance', 'labor'] |
| related_tools | Array[String] | ✅ | ❌ | [] | ['salary', 'currency'] |
| url | String | ✅ | ✅ | - | 원문 링크 (중복 체크 키) |
| createdAt | Date | auto | - | NOW() | 수집 시간 |
| updatedAt | Date | auto | - | NOW() | 업데이트 시간 |

**Index**:
- `url` (unique): 중복 방지
- `categories`, `related_tools`: 필터링 성능
- `published_at` (desc): 최신 순 정렬

#### ExchangeRate Collection

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| _id | ObjectId | auto | auto | - | System generated |
| currency_code | String | ✅ | ❌ | - | 통화 코드 (USD, JPY, EUR) |
| rate | Number | ✅ | ❌ | - | 환율 (원화 기준) |
| date | Date | ✅ | ❌ | - | 환율 기준일 |
| source | String | ✅ | ❌ | "한국수출입은행" | 데이터 출처 |
| createdAt | Date | auto | - | NOW() | 수집 시간 |

**Compound Index**: `{ currency_code: 1, date: -1 }` (최신 환율 조회)

### 3.2 TypeScript Types

```typescript
// types/news.ts
export interface News {
  _id: string
  title: string
  summary: string
  original_content: string
  source: string
  published_at: Date
  categories: NewsCategory[]
  related_tools: ToolId[]
  url: string
  createdAt: Date
  updatedAt: Date
}

export type NewsCategory =
  | 'tech' | 'finance' | 'labor' | 'health' | 'energy' | 'general'

export type ToolId =
  | 'salary' | 'currency' | 'retirement' | 'bmi'
  | 'unit' | 'dday' | 'electricity'

// types/tools.ts
export interface ToolMetadata {
  id: ToolId
  name: string
  description: string
  icon: string
  path: string
  category: 'finance' | 'health' | 'utility'
}

export interface SalaryInput {
  annualSalary: number      // 연봉 (원)
  dependents: number         // 부양가족 수
  hasDisability: boolean     // 장애인 여부
}

export interface SalaryResult {
  annualSalary: number       // 연봉
  monthlySalary: number      // 월급 (세전)
  monthlyTakeHome: number    // 실수령액
  yearlyTakeHome: number     // 연 실수령액
  incomeTax: number          // 소득세
  residentTax: number        // 주민세
  nationalPension: number    // 국민연금
  healthInsurance: number    // 건강보험
  longTermCare: number       // 장기요양
  employmentInsurance: number // 고용보험
}

// types/exchange.ts
export interface ExchangeRate {
  _id: string
  currency_code: string
  rate: number
  date: Date              // 환율 기준일 (주말/공휴일 대응 위해 필수 표시)
  source: string
  createdAt: Date
}

// UI에서 환율 표시 시 날짜 포맷
export interface ExchangeRateDisplay {
  rate: number
  displayDate: string     // "2026-02-14(금)" 형식
  updateTime: string      // "11:00" 또는 "최종 업데이트: 02-14(금) 11시"
  isWeekend: boolean      // 주말/공휴일 여부 (경고 표시)
}
```

---

## 4. API Specification

### 4.1 bkend.ai Auto-Generated REST API

**Base URL**: `https://api.bkend.ai/v1/projects/{PROJECT_ID}`

#### News Endpoints

| Method | Path | Description | Query Params |
|--------|------|-------------|--------------|
| GET | `/collections/News/records` | 뉴스 목록 조회 | `filter`, `sort`, `limit`, `skip` |
| GET | `/collections/News/records/:id` | 뉴스 상세 조회 | - |
| POST | `/collections/News/records` | 뉴스 생성 (n8n 전용) | - |

**GET /collections/News/records 예시**

Request:
```http
GET /collections/News/records?filter={"related_tools":"salary"}&sort={"published_at":-1}&limit=10
Authorization: Bearer {BKEND_API_KEY}
```

Response (200):
```json
{
  "data": [
    {
      "_id": "65f8...",
      "title": "2026년 최저임금 1만 30원 확정",
      "summary": "내년도 최저임금이 시간당 1만 30원으로 결정됐다. 전년 대비 3.2% 인상...",
      "source": "한국경제",
      "published_at": "2026-02-14T10:00:00Z",
      "categories": ["labor", "finance"],
      "related_tools": ["salary", "retirement"],
      "url": "https://example.com/news/123",
      "createdAt": "2026-02-14T12:00:00Z"
    }
  ],
  "total": 42,
  "limit": 10,
  "skip": 0
}
```

#### ExchangeRate Endpoints

| Method | Path | Description | Query Params |
|--------|------|-------------|--------------|
| GET | `/collections/ExchangeRate/records` | 환율 조회 | `filter`, `sort` |
| POST | `/collections/ExchangeRate/records` | 환율 생성 (n8n 전용) | - |

**최신 환율 조회**
```http
GET /collections/ExchangeRate/records?filter={"currency_code":"USD"}&sort={"date":-1}&limit=1
```

### 4.2 Custom API Routes (Next.js)

#### GET /api/sitemap

동적 sitemap.xml 생성

```typescript
// app/sitemap.xml/route.ts
export async function GET() {
  const tools = [
    'salary', 'currency', 'retirement', 'bmi',
    'unit', 'dday', 'electricity'
  ]

  const urls = [
    { url: '/', lastmod: new Date(), priority: 1.0 },
    ...tools.map(tool => ({
      url: `/${tool}`,
      lastmod: new Date(),
      priority: 0.8
    })),
    { url: '/news', lastmod: new Date(), priority: 0.7 }
  ]

  return new Response(generateSitemap(urls), {
    headers: { 'Content-Type': 'application/xml' }
  })
}
```

---

## 5. UI/UX Design

### 5.1 Screen Layout (Desktop)

**홈페이지**
```
┌────────────────────────────────────────────────────────────┐
│  Header [ontools 로고] [도구] [뉴스] [검색]                │
├────────────────────────────────────────────────────────────┤
│  Hero Section                                              │
│  "필요한 계산, 관련 뉴스까지 한 번에"                      │
│  [연봉 계산] [환율 변환] [퇴직금] ...                      │
├────────────────────────────────────────────────────────────┤
│  도구 카테고리                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                  │
│  │ 💰 금융  │ │ 💪 건강  │ │ 🔧 유틸  │                  │
│  │ 연봉계산 │ │ BMI계산  │ │ 단위변환 │                  │
│  │ 환율변환 │ │          │ │ D-day    │                  │
│  └──────────┘ └──────────┘ └──────────┘                  │
├────────────────────────────────────────────────────────────┤
│  IT/테크 뉴스 피드                                         │
│  ┌────────────────────────────────────────────┐           │
│  │ [뉴스 제목]                      2시간 전   │           │
│  │ AI 요약 내용...                            │           │
│  │ #tech #ai                       [더보기→]  │           │
│  └────────────────────────────────────────────┘           │
│  ┌────────────────────────────────────────────┐           │
│  │ ...                                        │           │
│  └────────────────────────────────────────────┘           │
├────────────────────────────────────────────────────────────┤
│  Footer: About | Contact | Privacy | © 2026 ontools       │
└────────────────────────────────────────────────────────────┘
```

**도구 페이지 (예: 연봉 계산기)**
```
┌────────────────────────────────────────────────────────────┐
│  Header                                                    │
├────────────────────────────────────────────────────────────┤
│  Breadcrumb: 홈 > 금융 > 연봉 실수령액 계산기             │
├──────────────────────┬─────────────────────────────────────┤
│  계산기 (좌측 60%)   │  관련 뉴스 (우측 40%)              │
│  ┌──────────────────┐│  ┌──────────────────────────────┐ │
│  │ 연봉 입력        ││  │ [뉴스 1: 최저임금 인상]      │ │
│  │ [12,000,000원]   ││  │ AI 요약...                   │ │
│  │                  ││  └──────────────────────────────┘ │
│  │ 부양가족 수      ││  ┌──────────────────────────────┐ │
│  │ [1명] ☐ 장애인   ││  │ [뉴스 2: 연말정산 팁]        │ │
│  │                  ││  │ AI 요약...                   │ │
│  │ [계산하기]       ││  └──────────────────────────────┘ │
│  └──────────────────┘│                                    │
│  ┌──────────────────┐│  [AdSense 광고]                   │
│  │ 결과             ││                                    │
│  │ 월 실수령액:     ││                                    │
│  │ 950,000원        ││                                    │
│  │                  ││                                    │
│  │ [상세 내역 ▼]   ││                                    │
│  └──────────────────┘│                                    │
├──────────────────────┴─────────────────────────────────────┤
│  관련 도구: [퇴직금 계산기] [국민연금 계산기]              │
├────────────────────────────────────────────────────────────┤
│  Footer                                                    │
└────────────────────────────────────────────────────────────┘
```

### 5.2 User Flow

```
┌─────────┐
│  홈페이지 │
└────┬────┘
     │ (검색 유입 or 직접 방문)
     ▼
┌──────────────┐
│  도구 선택   │ (카테고리 or 검색)
└──────┬───────┘
       │
       ▼
┌────────────────────┐
│  도구 페이지       │
│  - 입력값 입력     │
│  - 계산 실행       │
│  - 결과 확인       │
│  - 관련 뉴스 읽기  │ ← 재방문 유도 포인트
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  뉴스 상세 or      │
│  다른 도구 이동    │
└────────────────────┘
```

### 5.3 Component List

| Component | Location | Props | Responsibility |
|-----------|----------|-------|----------------|
| `Header` | `components/layout/` | - | 네비게이션 메뉴 |
| `Footer` | `components/layout/` | - | 사이트 정보 |
| `AdUnit` | `components/layout/` | `slot: string` | AdSense 광고 표시 |
| `ToolCard` | `components/tools/` | `tool: ToolMetadata` | 도구 소개 카드 |
| `CalculatorLayout` | `components/tools/` | `children, relatedNews` | 계산기 공통 레이아웃 |
| `ResultCard` | `components/tools/` | `result: SalaryResult` | 계산 결과 표시 |
| `NewsCard` | `components/news/` | `news: News` | 뉴스 카드 |
| `NewsFeed` | `components/news/` | `news: News[], filter?` | 뉴스 피드 리스트 |
| `NewsFilter` | `components/news/` | `categories, onFilter` | 카테고리 필터 |

---

## 6. Error Handling

### 6.1 Error Code Definition

| Code | Message | Cause | Handling |
|------|---------|-------|----------|
| NEWS_FETCH_ERROR | 뉴스를 불러올 수 없습니다 | bkend.ai API 장애 | Fallback UI (캐시된 데이터) |
| EXCHANGE_RATE_ERROR | 환율 정보를 불러올 수 없습니다 | API 장애 | **최신 환율 표시 + "기준일: YYYY-MM-DD(요일)" 명시** |
| EXCHANGE_RATE_WEEKEND | (주말/공휴일 접속 시) | 영업일에만 업데이트 | **금요일 환율 + "최종 업데이트: 2026-02-14(금) 11시" 표시** |
| VALIDATION_ERROR | 입력값을 확인해주세요 | 클라이언트 검증 실패 | Toast 알림 |
| ADSENSE_BLOCKED | 광고 차단 감지 | 광고 차단 플러그인 | (무시, 수익 감소만) |

### 6.2 Error Response Format (bkend.ai)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid filter parameter",
    "details": {
      "field": "filter",
      "reason": "JSON parse error"
    }
  }
}
```

### 6.3 Client-side Error Handling

**뉴스 API 에러**
```typescript
// features/news/hooks/useNewsList.ts
export function useNewsList(toolId?: ToolId) {
  return useQuery({
    queryKey: ['news', toolId],
    queryFn: () => newsApi.getList({ related_tools: toolId }),
    staleTime: 5 * 60 * 1000, // 5분 캐시
    retry: 2,
    onError: (error) => {
      toast.error('뉴스를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.')
      console.error('News fetch error:', error)
    }
  })
}
```

**환율 API 오프라인 폴백 (주말/공휴일 대응)**
```typescript
// features/currency/utils.ts
export async function getLatestRate(currencyCode: string): Promise<ExchangeRateDisplay> {
  // 1. 최신 환율 조회 (date 내림차순)
  const rate = await exchangeRateApi.getLatest(currencyCode)

  const now = new Date()
  const rateDate = new Date(rate.date)
  const diffDays = Math.floor((now - rateDate) / (1000 * 60 * 60 * 24))

  return {
    rate: rate.rate,
    displayDate: formatDate(rateDate, 'YYYY-MM-DD(ddd)'), // "2026-02-14(금)"
    updateTime: diffDays === 0
      ? '11:00'
      : `최종 업데이트: ${formatDate(rateDate, 'MM-DD(ddd) 11시')}`,
    isWeekend: diffDays > 0 // 기준일이 과거면 주말/공휴일로 판단
  }
}
```

**환율 표시 컴포넌트**
```tsx
// UI에서 사용 예시
<div className="exchange-rate">
  <p>1 USD = {exchangeRate.rate.toFixed(2)} KRW</p>
  <p className={exchangeRate.isWeekend ? 'text-amber-600' : 'text-gray-500'}>
    기준일: {exchangeRate.displayDate}
    {exchangeRate.isWeekend && ' (영업일 환율)'}
  </p>
</div>
```

---

## 7. Security Considerations

- [x] **Input Validation**: Zod schema로 클라이언트/서버 입력 검증
- [x] **XSS Prevention**: Next.js 기본 escape (뉴스는 요약만 표시, 원문 외부 링크)
- [x] **CSRF**: Next.js API Routes는 SameSite 쿠키 사용
- [x] **API Key Protection**: 환경변수로 관리, `.env.local` gitignore
- [x] **HTTPS Enforcement**: Vercel 자동 적용
- [x] **Rate Limiting**: bkend.ai 자체 제공 (무료 티어 제한)
- [ ] **Content Security Policy**: **Phase 3(AdSense)와 함께 적용**
  - AdSense inline script 허용 필요: `script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com`
  - MVP에서는 CSP 미적용, Phase 3 AdSense 통합 시 동시 설정
  - 또는 `next.config.js`에서 nonce 기반 CSP 구성

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool | Coverage | Phase |
|------|--------|------|----------|-------|
| Unit Test | 계산 로직 (features/*/utils.ts) | Vitest | **핵심 로직 100%** | Phase 1 |
| Component Test | UI 컴포넌트 | Vitest + Testing Library | **Phase 2 이후 (MVP 제외)** | Phase 2+ |
| Integration Test | API 호출 (newsApi, exchangeRateApi) | Vitest + MSW | **Phase 2** | Phase 2 |
| E2E Test | 사용자 시나리오 | Playwright | **Phase 3 이후** | Phase 3+ |

**MVP (Phase 1) 테스트 범위**:
- 계산 로직 유닛 테스트만 집중 (salary, currency, bmi utils)
- 컴포넌트/E2E는 Phase 2 이후로 연기
- 수동 테스트로 UI 검증

### 8.2 Test Cases (Key)

**연봉 계산기**
- [ ] Happy path: 연봉 3,000만원, 부양가족 1명 → 월 실수령액 계산
- [ ] Edge case: 연봉 0원 입력 → 에러 메시지
- [ ] Edge case: 연봉 100억원 초과 → 제한 메시지

**뉴스 API**
- [ ] Happy path: related_tools='salary' 필터 → 관련 뉴스 반환
- [ ] Error scenario: bkend.ai API 500 에러 → Fallback UI
- [ ] Cache test: 5분 내 재요청 → 캐시된 데이터 반환

**E2E**
- [ ] 연봉 계산기 사용 → 결과 확인 → 관련 뉴스 클릭 → 뉴스 상세 페이지
- [ ] 홈페이지 → 도구 검색 → 도구 사용 → AdSense 광고 표시 확인

---

## 9. Clean Architecture (Dynamic Level)

### 9.1 Layer Structure

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Presentation** | UI 컴포넌트, 페이지, 사용자 이벤트 | `app/`, `components/` |
| **Application** | 비즈니스 로직 오케스트레이션, React Hooks | `features/*/hooks/`, `features/*/services/` |
| **Domain** | 타입, 인터페이스, 계산 로직 (순수 함수) | `types/`, `features/*/utils.ts` |
| **Infrastructure** | 외부 API 클라이언트 (bkend.ai, Claude) | `lib/bkend.ts`, `features/*/services/*Api.ts` |

### 9.2 Dependency Rules

```
┌───────────────────────────────────────────────────────────┐
│  Presentation (app/, components/)                         │
│      ↓ uses                                               │
│  Application (features/*/hooks/, services/)               │
│      ↓ uses                    ↓ uses                     │
│  Domain (types/)          Infrastructure (lib/)           │
│                                ↓ calls                    │
│                           External APIs (bkend.ai)        │
└───────────────────────────────────────────────────────────┘

Rule: Domain은 외부 의존성 없음 (순수 타입/로직만)
      Infrastructure는 Application에서만 호출
```

### 9.3 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| `SalaryCalculatorPage` | Presentation | `app/(tools)/salary/page.tsx` |
| `useSalaryCalculator` | Application | `features/salary/hooks/` |
| `calculateTakeHome()` | Domain | `features/salary/utils.ts` |
| `SalaryInput, SalaryResult` | Domain | `types/tools.ts` |
| `newsApi.getList()` | Infrastructure | `features/news/services/newsApi.ts` |
| `bkendClient` | Infrastructure | `lib/bkend.ts` |

---

## 10. Coding Convention

### 10.1 Naming Conventions

| Target | Rule | Example |
|--------|------|---------|
| Components | PascalCase | `NewsCard`, `CalculatorLayout` |
| Hooks | camelCase (use-prefix) | `useSalaryCalculator`, `useNewsList` |
| Functions | camelCase | `calculateTakeHome()`, `formatCurrency()` |
| Constants | UPPER_SNAKE_CASE | `MAX_SALARY`, `DEFAULT_TAX_RATE` |
| Types/Interfaces | PascalCase | `News`, `SalaryInput`, `ToolMetadata` |
| Files (component) | PascalCase.tsx | `NewsCard.tsx` |
| Files (utility) | camelCase.ts | `salaryUtils.ts`, `newsApi.ts` |
| Folders | kebab-case | `salary-calculator/`, `news-feed/` |

### 10.2 Import Order

```typescript
// 1. React
import { useState, useEffect } from 'react'

// 2. Next.js
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// 3. External libraries
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// 4. Internal absolute imports (alias @/)
import { Button } from '@/components/ui/Button'
import { newsApi } from '@/features/news/services/newsApi'

// 5. Relative imports
import { useSalaryCalculator } from './hooks/useSalaryCalculator'

// 6. Type imports
import type { News, ToolId } from '@/types'

// 7. Styles (if any)
import './styles.css'
```

### 10.3 Environment Variables

| Variable | Scope | Example | Usage |
|----------|-------|---------|-------|
| `NEXT_PUBLIC_BKEND_PROJECT_ID` | Client | `proj_abc123` | bkend.ai 프로젝트 ID |
| `BKEND_API_KEY` | Server | `bk_live_xyz789` | bkend.ai API 인증 |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Client | `ca-pub-1234567890` | AdSense 클라이언트 ID |
| `NEXT_PUBLIC_SITE_URL` | Client | `https://ontools.com` | OG 이미지 URL |
| `TELEGRAM_BOT_TOKEN` | Server (n8n) | `123456:ABC-DEF` | 텔레그램 봇 토큰 |
| `TELEGRAM_CHAT_ID` | Server (n8n) | `-1001234567890` | 알림 채팅 ID |
| `CLAUDE_API_KEY` | Server (n8n) | `sk-ant-...` | Claude API 키 |
| `EXCHANGE_RATE_API_KEY` | Server (n8n) | `eximbank_key` | 한국수출입은행 API |

### 10.4 File Organization

**기능별 모듈 구조 (features/)**
```
features/salary/
├── hooks/
│   └── useSalaryCalculator.ts   # React Hook
├── utils.ts                      # 순수 계산 로직
└── types.ts                      # 로컬 타입 (exports to types/)
```

**컴포넌트 구조 (components/)**
```
components/tools/
├── ToolCard.tsx                  # 컴포넌트
├── ToolCard.test.tsx             # 테스트
└── index.ts                      # Re-export
```

---

## 11. Implementation Guide

### 11.1 Implementation Order (Phase별)

**Phase 1: 기본 도구 (2주)**
1. [ ] 프로젝트 초기화
   - Next.js 14 프로젝트 생성
   - Tailwind CSS 설정
   - ESLint + Prettier 설정
   - Git 저장소 생성
2. [ ] 공통 컴포넌트
   - Header, Footer
   - Button, Card, Input (shadcn/ui)
   - CalculatorLayout
3. [ ] 3개 핵심 도구
   - 연봉 실수령액 계산기 (features/salary/)
   - 환율 계산기 (features/currency/)
   - BMI 계산기 (features/bmi/)
4. [ ] SEO 인프라
   - sitemap.xml/route.ts
   - robots.txt/route.ts
   - 각 페이지 metadata 설정
5. [ ] Vercel 배포

**Phase 2: 뉴스 시스템 (2주)**
1. [ ] bkend.ai 프로젝트 생성
   - News Collection 생성 (MCP)
   - ExchangeRate Collection 생성
   - API 키 발급
2. [ ] Frontend 뉴스 기능
   - newsApi.ts (lib/)
   - useNewsList, useNewsDetail (hooks/)
   - NewsCard, NewsFeed (components/)
   - /news 페이지
3. [ ] n8n 워크플로우 (NAS)
   - IT/테크 뉴스 크롤링 (6h)
   - 금융/노동 뉴스 크롤링 (6h)
   - 환율 데이터 업데이트 (영업일 11시)
   - 텔레그램 에러 알림
4. [ ] 도구-뉴스 매칭
   - 각 도구 페이지에 관련 뉴스 표시
   - 카테고리 필터링

**Phase 3: 수익화 (1주)**
1. [ ] Google AdSense 신청
2. [ ] AdUnit 컴포넌트 구현
3. [ ] **AdSense 호환 CSP 설정** (next.config.js)
   - `script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com`
   - 또는 nonce 기반 CSP 구성
4. [ ] 도구 페이지별 광고 배치
5. [ ] 광고 표시 테스트 (CSP 충돌 확인)

**Phase 4: 추가 도구 (1주)**
1. [ ] 퇴직금 계산기
2. [ ] 단위 변환기
3. [ ] D-day 카운터
4. [ ] 전기요금 계산기

### 11.2 Critical Files to Create First

```
Priority 1 (Day 1-3):
├── lib/bkend.ts                      # bkend.ai 클라이언트
├── types/news.ts, types/tools.ts     # 전역 타입
├── components/layout/Header.tsx      # 레이아웃
├── components/ui/Button.tsx, Card.tsx # 기본 UI
└── app/layout.tsx, app/page.tsx      # 루트 레이아웃

Priority 2 (Day 4-7):
├── features/salary/utils.ts          # 계산 로직
├── features/salary/hooks/useSalaryCalculator.ts
├── app/(tools)/salary/page.tsx       # 연봉 계산기 페이지
└── components/tools/CalculatorLayout.tsx

Priority 3 (Week 2):
├── features/news/services/newsApi.ts # 뉴스 API
├── features/news/hooks/useNewsList.ts
├── components/news/NewsCard.tsx
└── app/news/page.tsx
```

### 11.3 Dependencies Installation

```bash
# Core
npm install next@14 react@18 react-dom@18
npm install typescript @types/react @types/node

# UI
npm install tailwindcss postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot @radix-ui/react-dialog # shadcn/ui peer deps

# State Management
npm install zustand
npm install @tanstack/react-query

# Validation
npm install zod

# Utils
npm install date-fns
npm install dompurify @types/dompurify

# Dev
npm install -D eslint prettier eslint-config-next
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

### 11.4 Claude API Model Selection

**모델 선택 이유**:
- **Haiku 4.5** (`claude-haiku-4-5-20251001`) 사용
- 200자 뉴스 요약은 간단한 작업이므로 Haiku로 충분
- 비용: Sonnet 대비 **90% 절감** (Input: $0.25/MTok → Haiku: $0.03/MTok)
- 속도: Haiku가 더 빠름 (크롤링 워크플로우 시간 단축)

**비용 추정** (1일 기준):
- 뉴스 크롤링: IT(10개) + 금융(10개) × 4회/일 = 80개 요약
- 평균 입력: 500 토큰/뉴스, 출력: 100 토큰
- Haiku: (500 × 80 / 1M × $0.03) + (100 × 80 / 1M × $0.075) = **$0.0018/일** ≈ **$0.65/년**
- Sonnet 대비 절감: ~$5/년

### 11.5 n8n Workflow Template (IT News)

```json
{
  "name": "IT News Crawler",
  "nodes": [
    {
      "type": "n8n-nodes-base.cron",
      "name": "Every 6 hours",
      "parameters": {
        "cronExpression": "0 */6 * * *"
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "name": "Fetch RSS",
      "parameters": {
        "url": "https://it.chosun.com/site/data/rss/rss.xml",
        "method": "GET"
      }
    },
    {
      "type": "n8n-nodes-base.xml",
      "name": "Parse XML"
    },
    {
      "type": "n8n-nodes-base.code",
      "name": "Check Duplicates",
      "parameters": {
        "code": "// Query bkend.ai to check if URL exists"
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "name": "Claude Summarize",
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages",
        "method": "POST",
        "headers": {
          "x-api-key": "={{$env.CLAUDE_API_KEY}}"
        },
        "body": {
          "model": "claude-haiku-4-5-20251001",
          "messages": [{
            "role": "user",
            "content": "다음 뉴스를 200자로 요약하고, categories와 related_tools를 JSON으로 반환:\n\n{{$json.content}}"
          }]
        }
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "name": "Save to bkend.ai",
      "parameters": {
        "url": "https://api.bkend.ai/v1/projects/{{$env.BKEND_PROJECT_ID}}/collections/News/records",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer {{$env.BKEND_API_KEY}}"
        }
      }
    },
    {
      "type": "n8n-nodes-base.telegram",
      "name": "Error Notification",
      "parameters": {
        "chatId": "={{$env.TELEGRAM_CHAT_ID}}",
        "text": "⚠️ IT 뉴스 크롤링 실패: {{$json.error}}"
      }
    }
  ]
}
```

---

## 12. Performance Optimization

### 12.1 Next.js Optimizations

- **ISR (Incremental Static Regeneration)**: 뉴스 페이지 5분마다 재생성
- **Image Optimization**: `next/image` 사용, WebP 자동 변환
- **Font Optimization**: `next/font` 사용 (Pretendard)
- **Code Splitting**: 도구별 페이지 lazy load
- **Bundle Size**: Tailwind CSS purge, tree-shaking

### 12.2 API Caching Strategy

```typescript
// app/news/page.tsx
export const revalidate = 300 // 5분마다 ISR

// features/news/hooks/useNewsList.ts
const { data } = useQuery({
  queryKey: ['news', toolId],
  queryFn: () => newsApi.getList({ related_tools: toolId }),
  staleTime: 5 * 60 * 1000,  // 5분 캐시
  cacheTime: 30 * 60 * 1000  // 30분 유지
})
```

### 12.3 SEO Optimizations

```typescript
// app/(tools)/salary/page.tsx
export const metadata: Metadata = {
  title: '연봉 실수령액 계산기 - ontools',
  description: '2026년 최신 세율 적용. 연봉, 부양가족 수 입력으로 실수령액 계산. 최저임금, 연말정산 뉴스 제공.',
  keywords: ['연봉계산기', '실수령액', '세금', '국민연금', '건강보험'],
  openGraph: {
    title: '연봉 실수령액 계산기',
    description: '연봉에서 세금 제외한 실수령액을 간편하게 계산하세요.',
    url: 'https://ontools.com/salary',
    siteName: 'ontools',
    images: ['/og-salary.png']
  }
}
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-15 | Initial design document | User |
