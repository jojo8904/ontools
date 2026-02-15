# ontools

> 실생활 유틸리티 도구와 AI 자동 뉴스 포털

## 프로젝트 소개

ontools는 실생활에 필요한 계산기 도구와 관련 뉴스를 AI로 자동 매칭하여 제공하는 한국형 포털 사이트입니다.

**핵심 기능**:
- 🧮 8개 유틸리티 도구 (연봉/환율/퇴직금/BMI/단위변환/D-day/전기요금)
- 📰 AI 자동 뉴스 요약 및 도구별 매칭
- 💰 Google AdSense 수익화

## 기술 스택

**Frontend**:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand

**Backend (BaaS)**:
- bkend.ai (Collections, REST API)

**Automation**:
- n8n (NAS) - RSS 크롤링
- Claude Haiku 4.5 - 뉴스 요약

**Deployment**:
- Vercel (무료 티어)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local.example`을 복사하여 `.env.local` 생성:

```bash
cp .env.local.example .env.local
```

필수 환경변수:
- `NEXT_PUBLIC_BKEND_PROJECT_ID`: bkend.ai 프로젝트 ID
- `NEXT_PUBLIC_SITE_URL`: 사이트 URL

### 3. bkend.ai 설정

1. [bkend.ai](https://bkend.ai) 회원가입
2. 프로젝트 생성
3. MCP 연결 (Claude Code):
   ```bash
   claude mcp add bkend --transport http https://api.bkend.ai/mcp
   ```
4. Collections 생성:
   - News (제목, 요약, 카테고리, 관련도구 등)
   - ExchangeRate (통화코드, 환율, 날짜 등)

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── (tools)/           # 도구 페이지 (연봉, 환율 등)
│   ├── news/              # 뉴스 피드
│   └── layout.tsx
├── components/            # UI 컴포넌트
│   ├── layout/           # Header, Footer
│   ├── tools/            # 계산기 컴포넌트
│   └── news/             # 뉴스 컴포넌트
├── features/              # 기능별 모듈
│   ├── salary/           # 연봉 계산기
│   ├── currency/         # 환율 계산기
│   └── news/             # 뉴스 API
├── lib/
│   ├── bkend.ts          # bkend.ai 클라이언트
│   └── utils.ts
└── types/                 # TypeScript 타입
```

## 개발 로드맵

- [x] **Phase 1**: 프로젝트 초기화
- [ ] **Phase 1**: 기본 도구 3개 (연봉/환율/BMI) + Vercel 배포
- [ ] **Phase 2**: 뉴스 시스템 + n8n 워크플로우
- [ ] **Phase 3**: Google AdSense 수익화
- [ ] **Phase 4**: 추가 도구 5개

상세 계획: [docs/01-plan/features/ontools.plan.md](docs/01-plan/features/ontools.plan.md)

## 문서

- **Plan**: [ontools.plan.md](docs/01-plan/features/ontools.plan.md)
- **Design**: [ontools.design.md](docs/02-design/features/ontools.design.md)
- **Coding Guidelines**: [CLAUDE.md](CLAUDE.md)

## 라이선스

MIT
