# ontools Planning Document

> **Summary**: 실생활 유틸리티 도구와 AI 자동 뉴스가 결합된 한국형 포털 사이트
>
> **Project**: ontools
> **Version**: 0.1.0
> **Author**: User
> **Date**: 2026-02-15
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

**ontools**는 실생활 유틸리티 도구와 AI 자동 뉴스를 결합한 한국형 포털 사이트입니다.
- 유틸리티 도구로 구글/네이버 검색 유입 확보
- 각 도구와 연관된 최신 뉴스를 자동 제공하여 재방문 유도
- Google AdSense를 통한 수익 창출

### 1.2 Background

기존 유틸리티 사이트들은 단순 도구 제공에 그쳐 재방문율이 낮습니다.
ontools는 도구 사용 시 관련 뉴스를 자동으로 제공하여 정보 소비와 유틸리티 사용을 동시에 만족시킵니다.

**핵심 차별점**:
- 도구마다 연관 뉴스 자동 매칭 (AI 요약)
- SEO 최적화로 검색 유입 확보
- 무료 인프라로 초기 비용 최소화 (Vercel + NAS)

### 1.3 Related Documents

- Requirements: TBD
- References:
  - [bkend.ai Documentation](https://docs.bkend.ai)
  - [Next.js App Router](https://nextjs.org/docs)

---

## 2. Scope

### 2.1 In Scope

- [x] **유틸리티 도구 (Phase 1 - MVP)**
  - [ ] 연봉 실수령액 계산기
  - [ ] 환율 계산기
  - [ ] 퇴직금 계산기
  - [ ] 단위 변환기 (길이/무게/온도)
  - [ ] D-day/공휴일 카운터
  - [ ] BMI 계산기
  - [ ] 전기요금 계산기
- [x] **자동 뉴스 시스템**
  - [ ] RSS 뉴스 크롤링 (n8n)
  - [ ] AI 요약 생성 (Claude API)
  - [ ] 도구별 뉴스 매칭 알고리즘
  - [ ] 메인 페이지 IT/테크 뉴스 피드
- [x] **수익화**
  - [ ] Google AdSense 통합
  - [ ] 도구 페이지별 광고 배치
- [x] **SEO 인프라**
  - [ ] sitemap.xml 자동 생성
  - [ ] robots.txt 설정
  - [ ] 네이버 서치어드바이저 등록
  - [ ] Google Search Console 등록
  - [ ] Open Graph 메타태그
- [x] **인프라**
  - [ ] Next.js 14+ App Router
  - [ ] Vercel 배포 (무료 티어)
  - [ ] NAS 기반 n8n 크론잡
  - [ ] bkend.ai BaaS (뉴스 저장)

### 2.2 Out of Scope

- 택배 배송 조회 (외부 API 연동 복잡도 높음 - Phase 2로 연기)
- 사용자 인증/로그인 (MVP에서 제외, 추후 북마크 기능 시 추가)
- 모바일 앱 (웹 반응형으로만 제공)
- 커뮤니티/댓글 기능

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 8개 유틸리티 도구 구현 (클라이언트 사이드 계산) | High | Pending |
| FR-02 | 각 도구 페이지에 SEO 메타태그 적용 | High | Pending |
| FR-03 | RSS 뉴스를 n8n으로 크롤링하여 DB 저장 | High | Pending |
| FR-04 | Claude API로 뉴스 요약 (200자 내외) | High | Pending |
| FR-05 | 도구 주제와 뉴스 키워드 자동 매칭 | Medium | Pending |
| FR-06 | 메인 페이지에 IT/테크 뉴스 피드 표시 | Medium | Pending |
| FR-07 | 각 도구 페이지에 Google AdSense 광고 배치 | Medium | Pending |
| FR-08 | 모바일 반응형 UI (Tailwind CSS) | High | Pending |
| FR-09 | 다크모드 지원 | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 초기 페이지 로드 < 2초 | Lighthouse, Vercel Analytics |
| SEO | Core Web Vitals 통과 (LCP < 2.5s, FID < 100ms, CLS < 0.1) | Google Search Console |
| Accessibility | 키보드 네비게이션 지원 | 수동 테스트 |
| Security | XSS/CSRF 방지, 환경변수로 API 키 관리 | OWASP ZAP |
| Scalability | Vercel 무료 티어 제한 내 운영 (월 100GB 대역폭) | Vercel Dashboard |

---

## 4. Success Criteria

### 4.1 Definition of Done (전체 프로젝트)

- [ ] 8개 유틸리티 도구 모두 정상 작동
- [ ] 뉴스 자동 크롤링/요약 시스템 동작 확인
- [ ] 모든 페이지 Lighthouse 성능 점수 90+ (Desktop)
- [ ] Google AdSense 광고 정상 표시
- [ ] Vercel 배포 완료 및 도메인 연결

### 4.1.1 Phase별 완료 기준

**Phase 1 (기본 도구, 2주)**
- [ ] 3개 핵심 도구 완료 (연봉/환율/BMI 계산기)
- [ ] SEO 메타태그 + sitemap.xml 자동 생성
- [ ] Vercel 배포 완료
- [ ] Lighthouse 성능 90+

**Phase 2 (뉴스 시스템, 2주)**
- [ ] bkend.ai News 테이블 생성
- [ ] n8n 워크플로우 3개 정상 작동 (IT뉴스, 금융뉴스, 환율)
- [ ] 뉴스 피드 UI 구현
- [ ] 도구-뉴스 매칭 알고리즘 작동

**Phase 3 (수익화, 1주)**
- [ ] Google AdSense 승인 완료
- [ ] 광고 단위 생성 및 배치
- [ ] 광고 표시 확인 (3일 테스트)

**Phase 4 (추가 도구, 1주)**
- [ ] 나머지 5개 도구 완료
- [ ] 모든 도구에 뉴스 매칭 적용

### 4.2 Quality Criteria

- [ ] Zero TypeScript 오류
- [ ] ESLint 경고 0개
- [ ] 모바일/데스크톱 반응형 테스트 통과
- [ ] 크롬/사파리/파이어폭스 크로스 브라우징 테스트

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Vercel 무료 티어 대역폭 초과 | High | Medium | Cloudflare CDN 추가, 이미지 최적화 |
| n8n 크론잡 NAS 장애 시 뉴스 업데이트 중단 | Medium | Low | **텔레그램 알림 설정** + 백업 워크플로우 (GitHub Actions) |
| Claude API 비용 과다 | Medium | Medium | 요약 캐싱, 배치 처리로 API 호출 최소화 |
| Google AdSense 승인 거부 | Low | Low | 충분한 콘텐츠 준비 (각 도구 설명 페이지) |
| RSS 피드 구조 변경으로 크롤링 실패 | Medium | Medium | **텔레그램 에러 알림** + Fallback RSS 소스 추가 |
| n8n 워크플로우 실행 실패 감지 안 됨 | Medium | Medium | **Health check API + 6시간마다 Uptime Robot 모니터링** |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | ☐ |
| **Dynamic** | Feature-based modules, BaaS integration (bkend.ai) | Web apps with backend, SaaS MVPs, fullstack apps | ☑ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems, complex architectures | ☐ |

**선택 이유**: 뉴스 데이터를 DB에 저장하고 크론잡으로 자동 업데이트해야 하므로 Dynamic 레벨 필요. bkend.ai BaaS를 사용하여 백엔드 인프라 관리 최소화.

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React / Vue | **Next.js 14+** | App Router, SSG/ISR 지원, Vercel 최적화 |
| State Management | Context / Zustand / Redux / Jotai | **Zustand** | 가볍고 간단, 도구별 상태 관리 |
| API Client | fetch / axios / react-query | **react-query (TanStack Query)** | 뉴스 데이터 캐싱, 자동 리페칭 |
| Form Handling | react-hook-form / formik / native | **native** | 계산기는 간단한 입력만 필요 |
| Styling | Tailwind / CSS Modules / styled-components | **Tailwind CSS** | 빠른 프로토타이핑, 반응형 유틸리티 |
| Testing | Jest / Vitest / Playwright | **Vitest** | 빠르고 ESM 지원 |
| Backend | BaaS (bkend.ai) / Custom Server / Serverless | **bkend.ai** | Dynamic 레벨 권장, 무료 티어 제공 |
| Deployment | Vercel / Netlify / AWS | **Vercel** | Next.js 최적화, 무료 SSL, 자동 배포 |

### 6.3 Clean Architecture Approach

```
Selected Level: Dynamic

Folder Structure Preview:
src/
├── app/                      # Next.js App Router
│   ├── (tools)/              # 도구 페이지 그룹
│   │   ├── salary/           # 연봉 계산기
│   │   ├── currency/         # 환율 계산기
│   │   └── ...
│   ├── news/                 # 뉴스 피드 페이지
│   └── layout.tsx
├── components/               # 공통 컴포넌트
│   ├── ui/                   # shadcn/ui 컴포넌트
│   ├── layout/               # Header, Footer
│   └── ad/                   # AdSense 컴포넌트
├── features/                 # 기능별 모듈
│   ├── tools/                # 도구 로직
│   │   ├── salary/
│   │   ├── currency/
│   │   └── ...
│   └── news/                 # 뉴스 관련 로직
│       ├── services/         # API 호출
│       ├── hooks/            # React Query 훅
│       └── types/
├── lib/
│   ├── bkend.ts              # bkend.ai MCP 클라이언트
│   └── utils.ts
└── types/                    # 전역 타입 정의

External:
NAS/
└── n8n/
    └── workflows/
        └── news-crawler.json # RSS 크롤링 + Claude 요약
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

Check which conventions already exist in the project:

- [ ] `CLAUDE.md` has coding conventions section
- [ ] `docs/01-plan/conventions.md` exists (Phase 2 output)
- [ ] `CONVENTIONS.md` exists at project root
- [ ] ESLint configuration (`.eslintrc.*`)
- [ ] Prettier configuration (`.prettierrc`)
- [ ] TypeScript configuration (`tsconfig.json`)

### 7.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **Naming** | Missing | 컴포넌트 PascalCase, 함수 camelCase, 상수 UPPER_SNAKE_CASE | High |
| **Folder structure** | Missing | Dynamic 레벨 구조 (features/, components/, app/) | High |
| **Import order** | Missing | React → Next.js → 외부 라이브러리 → 내부 모듈 → 타입 | Medium |
| **Environment variables** | Missing | NEXT_PUBLIC_ 접두사 규칙, .env.example 제공 | High |
| **Error handling** | Missing | try-catch + toast 알림 패턴 통일 | Medium |

### 7.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `NEXT_PUBLIC_BKEND_PROJECT_ID` | bkend.ai 프로젝트 ID | Client | ☑ |
| `BKEND_API_KEY` | bkend.ai API 키 | Server | ☑ |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense 클라이언트 ID | Client | ☑ |
| `CLAUDE_API_KEY` | Claude API 키 (n8n에서 사용) | Server | ☑ |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL (OG 이미지용) | Client | ☑ |
| `TELEGRAM_BOT_TOKEN` | 텔레그램 봇 토큰 (n8n 알림) | Server | ☑ |
| `TELEGRAM_CHAT_ID` | 텔레그램 채팅 ID (알림 수신) | Server | ☑ |
| `EXCHANGE_RATE_API_KEY` | 한국수출입은행 API 키 | Server | ☑ |

### 7.4 Pipeline Integration

Development Pipeline 사용 시:

| Phase | Status | Document Location | Command |
|-------|:------:|-------------------|---------|
| Phase 1 (Schema) | ☐ | `docs/01-plan/schema.md` | `/development-pipeline next` |
| Phase 2 (Convention) | ☐ | `docs/01-plan/conventions.md` | `/development-pipeline next` |
| Phase 3 (Mockup) | ☐ | `docs/02-design/mockup/` | `/development-pipeline next` |

**추천**: Phase 1(용어 정의), Phase 2(컨벤션)를 먼저 진행하여 일관된 개발 환경 구축.

---

## 8. Technical Stack Details

### 8.1 Frontend

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.17.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0"
  }
}
```

### 8.2 Backend (n8n Workflow)

**RSS 소스 목록 (카테고리별)**

| 카테고리 | RSS 소스 | URL | 관련 도구 |
|----------|---------|-----|-----------|
| **IT/Tech** | IT조선 | `https://it.chosun.com/site/data/rss/rss.xml` | - |
| | 전자신문 | `https://www.etnews.com/rss.xml` | - |
| | ZDNet Korea | `https://zdnet.co.kr/rss/news.xml` | - |
| **Finance** | 한국경제 | `https://www.hankyung.com/feed/economy` | salary, currency |
| | 매일경제 | `https://www.mk.co.kr/rss/30100041/` | salary, currency |
| | 서울경제 | `https://www.sedaily.com/RSS/S11.xml` | salary, retirement |
| **Labor** | 고용노동부 | `https://www.moel.go.kr/rss/news.xml` | salary, retirement |
| | 노동신문 | `https://www.labortoday.co.kr/rss/allArticle.xml` | salary, retirement |
| **Health** | 헬스조선 | `https://health.chosun.com/rss/health.xml` | bmi |
| | 메디컬투데이 | `https://www.mdtoday.co.kr/rss/clickTop.xml` | bmi |
| **Energy** | 에너지경제 | `https://www.ekn.kr/rss/economy.xml` | electricity |
| | 전기신문 | `https://www.electimes.com/rss/allArticle.xml` | electricity |
| **General** | 연합뉴스 경제 | `https://www.yna.co.kr/rss/economy.xml` | - |

**데이터 소스 (API)**

| 데이터 | API | 업데이트 주기 | 관련 도구 |
|--------|-----|--------------|-----------|
| 환율 | 한국수출입은행 환율 API | 영업일 11시 | currency |
| 공휴일 | 공공데이터포털 특일정보 API | 월 1회 | dday |
| 택배 조회 | 스윗트래커 API (Phase 2) | 실시간 | delivery |

**n8n 워크플로우 구성 (3개)**

**1. IT/테크 뉴스 크롤링** (매 6시간)
- Cron: `0 */6 * * *` (00:00, 06:00, 12:00, 18:00)
- RSS 소스: IT조선, 전자신문, ZDNet Korea
- 카테고리: ['tech', 'it', 'ai']

**2. 금융/노동 뉴스 크롤링** (매 6시간)
- Cron: `0 */6 * * *`
- RSS 소스: 한국경제, 매일경제, 고용노동부
- 카테고리: ['finance', 'labor', 'economy']

**3. 환율 데이터 업데이트** (영업일 오전 11시)
- Cron: `0 11 * * 1-5` (월~금 11:00 KST)
- API: 한국수출입은행 환율 API
- 저장: bkend.ai ExchangeRate 테이블

**공통 노드 구조**:
1. **Cron Trigger**
2. **HTTP Request** (RSS/API fetch)
3. **XML to JSON** / **JSON Parse**
4. **Code** (중복 체크: bkend.ai에서 URL 조회)
5. **HTTP Request** (Claude API - 요약 + 카테고리/도구 추출)
6. **HTTP Request** (bkend.ai에 저장)
7. **IF** (에러 발생 시)
8. **Telegram** (에러 알림)

**에러 모니터링 노드**:
- n8n Error Trigger → Telegram 알림
- 텔레그램 봇 메시지 포맷:
  ```
  ⚠️ n8n 워크플로우 실패
  워크플로우: IT 뉴스 크롤링
  시간: 2026-02-15 12:00
  에러: RSS 피드 fetch timeout
  ```

### 8.3 Data Model (bkend.ai)

```typescript
// News Table
interface News {
  id: string
  title: string
  summary: string          // AI 요약 (200자)
  original_content: string
  source: string           // RSS 출처
  published_at: Date
  categories: string[]     // Claude API가 추출한 카테고리 태그
                           // ['finance', 'tech', 'health', 'labor', 'energy']
  related_tools: string[]  // 여러 도구와 연관 가능
                           // ['salary', 'currency'] - 최저임금 뉴스는 두 도구 모두
  url: string
  created_at: Date
}

// Tools View Statistics (optional)
interface ToolStats {
  tool_id: string
  views: number
  last_accessed: Date
}
```

**Claude API 요약 시 JSON 응답 포맷**:
```json
{
  "summary": "최저임금 2026년 1만 30원으로 확정. 전년 대비 3.2% 인상...",
  "categories": ["labor", "finance"],
  "related_tools": ["salary", "retirement"]
}
```

---

## 9. MVP Roadmap

### Phase 1: 기본 도구 (2주)
- [ ] Next.js + Tailwind 프로젝트 셋업
- [ ] 연봉/환율/BMI 계산기 구현 (클라이언트 사이드)
- [ ] SEO 메타태그 적용
- [ ] Vercel 배포

### Phase 2: 뉴스 시스템 (2주)
- [ ] bkend.ai 프로젝트 생성 및 News 테이블 정의
- [ ] n8n 워크플로우 구성 (RSS → Claude → bkend.ai)
- [ ] 뉴스 피드 UI 구현
- [ ] 도구-뉴스 매칭 알고리즘

### Phase 3: 수익화 (1주)
- [ ] Google AdSense 승인 신청
- [ ] 광고 컴포넌트 통합
- [ ] 광고 배치 최적화

### Phase 4: 추가 도구 (1주)
- [ ] 퇴직금/단위변환/D-day/전기요금 계산기 추가

---

## 10. Next Steps

1. [ ] Design 문서 작성 (`/pdca design ontools`)
2. [ ] Phase 1 (Schema) 진행 - 용어 정의 (`/development-pipeline start`)
3. [ ] Phase 2 (Convention) 진행 - 코딩 규칙 정의
4. [ ] bkend.ai 프로젝트 생성 및 MCP 설정
5. [ ] Next.js 프로젝트 초기화

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-15 | Initial draft - ontools planning document | User |
