# 의존성 업그레이드 계획 (2026-09-24)

2026-09-24 정기 점검 결과와 남은 업그레이드 항목을 정리한다.

## 점검 결과 요약

| 항목 | 결과 |
| --- | --- |
| 라이브 사이트 | 홈·sitemap 99개 URL 전부 200 |
| 환율 수집 (exchange-rate-updater) | 최근 5회 성공, 9/23자 데이터 저장 확인 |
| 유튜브 수집 (youtube-crawler) | 최근 5회 성공, 9/21 수집분 93건 |
| CI (ci.yml) | 최근 5회 성공 |
| DB 권한 | anon 키 INSERT → 401 (SELECT 전용 유지) |
| 로컬 검증 | lint, typecheck, vitest 93개, build 통과 |
| `npm audit --omit=dev` | 취약점 0건 |

## 이번에 적용한 것 (마이너·패치, semver 범위 내)

`npm update`로 `package.json` 범위 안에서 최신으로 올렸다. `package.json`은 변경 없음, `package-lock.json`만 갱신.

| 패키지 | 이전 | 이후 |
| --- | --- | --- |
| next / eslint-config-next | 16.3.5 | 16.3.6 |
| @supabase/supabase-js | 2.95.3 | 2.117.1 |
| lucide-react | 1.47.0 | 1.48.0 |
| tsx | 4.21.0 | 4.23.15 |
| autoprefixer | 10.4.24 | 10.6.1 |
| postcss | 8.5.23 | 8.5.28 |
| jszip | 3.10.1 | 3.10.2 |
| @types/node | 20.19.33 | 20.19.43 |
| @types/react | 18.3.28 | 18.3.31 |
| @vitejs/plugin-react | 5.1.4 | 5.2.0 |

## 남은 메이저 업그레이드 (별도 작업 필요)

우선순위 순. 각 항목은 독립 브랜치에서 진행하고 lint → typecheck → test → build → e2e를 모두 통과한 뒤 main에 합친다.

### 1. Zod 3 → 4 (난이도: 낮음, 우선 진행 권장)

- 입력 검증에 사용. 에러 메시지 API(`error.errors` → `error.issues`)와 일부 메서드명이 바뀜.
- `grep -rn "from 'zod'"`로 사용처를 찾아 하나씩 확인. 사용 범위가 좁아 반나절 이내.
- 참고: https://zod.dev/v4/changelog

### 2. tailwind-merge 2 → 3 (난이도: 낮음)

- Tailwind 4 대응 버전. Tailwind 3을 유지하는 동안은 굳이 올릴 필요 없음.
- **Tailwind 4 업그레이드와 같이 진행**한다.

### 3. ESLint 9 → 10 (난이도: 중간, 블로커 있음)

- `eslint-config-next`가 ESLint 10을 공식 지원하는지 먼저 확인. 현재 9.39.x로 고정한 이유가 이것.
- `npm info eslint-config-next peerDependencies`로 peer 범위 확인 후 진행.
- 지원 전까지는 건드리지 않는다.

### 4. React 18 → 19 (난이도: 중간)

- Next 16은 React 19를 지원하지만 이 프로젝트는 18에 고정돼 있음.
- 영향: `@types/react`, `@types/react-dom`도 19로 동시 상향. `@testing-library/react` 16은 React 19 호환.
- 확인 포인트: `forwardRef` 사용처(19에서는 ref가 일반 prop), `useFormState` → `useActionState`, 게임 컴포넌트의 이벤트 핸들러 타입.
- 이미지·PDF 워크플로우는 브라우저 API 의존이 커서 e2e(`e2e/workflows.spec.ts`)까지 반드시 실행.

### 5. Tailwind CSS 3 → 4 (난이도: 높음)

- 설정 방식이 `tailwind.config.ts`에서 CSS `@theme`로 바뀜. `tailwindcss-animate`도 대체 필요.
- 68개 도구 페이지 + 게임 + 가이드의 시각 회귀를 전부 봐야 하므로 Playwright 스크린샷 비교를 먼저 준비.
- 공식 업그레이드 도구(`npx @tailwindcss/upgrade`)를 브랜치에서 돌려보고 diff 규모를 먼저 파악한다.
- 단독으로 가장 큰 작업. 급하지 않으면 뒤로 미뤄도 된다.

### 6. TypeScript 5 → 7 (난이도: 중간, 대기)

- TS 7은 Go 기반 새 컴파일러. Next 16 / vitest / eslint typescript 플러그인의 공식 지원 확인 후 진행.
- 그 전까지 5.9.x 유지.

### 7. 기타 devDependencies

| 패키지 | 현재 | 최신 | 메모 |
| --- | --- | --- | --- |
| vitest | 4.x | 5.x | `@vitejs/plugin-react` 6과 같이. 설정 파일을 `.mts`로 바꾸면 현재 경고도 사라짐 |
| jsdom | 28 | 29 | vitest 5와 같이 |
| @testing-library/jest-dom | 6 | 7 | 단독 진행 가능, 영향 적음 |
| @types/node | 20 | 26 | 런타임은 Node 24이므로 24 계열로 맞추는 것이 정확. `engines` 최소 22.13 유지 |

## 운영 참고 사항

- **환율 크론 지연**: 워크플로우는 `0 2 * * 1-5`(UTC)인데 실제 실행은 07:00 UTC 근처. GitHub 스케줄 지연이며 하루 1회 갱신은 유지됨. 정확한 시각이 중요해지면 cron을 `0 1 * * 1-5`처럼 앞당기거나 외부 트리거(workflow_dispatch 호출)를 검토.
- **CLAUDE.md**: 2026-09-24에 현재 구현(Next 16, ExchangeRate-API, 도구 68종) 기준으로 재작성. 초기 기획 문서(`docs/01-plan`, `docs/02-design`)는 기록용.
- **vitest 설정 경고**: `vitest.config.ts`가 CommonJS로 로드되며 ESM 문법 경고 발생. `vitest.config.mts`로 이름을 바꾸면 해결. 기능 영향 없음.
- **AdSense**: 승인 대기. 승인 후 CSP 적용과 슬롯 ID 등록이 필요.

## 배포 기록

| 일시 (UTC) | 커밋 | 결과 |
| --- | --- | --- |
| 2026-09-24 06:28 | ddbd5b2 | Vercel Production 성공, GitHub CI(database, verify) 성공, 배포 후 sitemap 99개 URL·robots·OG 이미지 전부 200 |
| 2026-09-24 07:20 | 4f88c2a | 가이드 13편 추가(총 24편), 전기요금 가이드 연중형 개편, 종합소득세 연도 문구 수정, 가이드 목록 최신순. Vercel·CI 성공, 신규 가이드 13개 URL 전부 200, sitemap 112개 |
| 2026-09-24 07:50 | a230b4a | 가이드 10편 추가(총 34편): 대출·예적금·자동차세·중고차 취득세·부가세·출산예정일·TDEE·2027 공휴일·글자수·평수. Vercel·CI 성공 |
| 2026-09-27 | 51e35b3 | 연봉 계산기: 비과세 입력, 보험료 하한 유지(Codex 리뷰 반영), 10원 절사, NaN 버그 수정, 테스트 11개 추가. Vercel·CI·Playwright 성공 |

## 검색엔진 색인 자동화 (2026-09-27 설정)

- **사이트맵 lastmod**: `lib/guides.ts`의 `GUIDE_DATES`, `app/sitemap.ts`의 `ROUTE_UPDATED`에 날짜 기록. 페이지를 크게 바꾸면 갱신.
- **IndexNow(네이버·빙)**: main 푸시 시 `.github/workflows/indexnow.yml`이 변경 URL을 자동 제출. 키 `public/df1d40d783b5f68375200b544645f432.txt`. 수동: `npm run indexnow -- <url...>` 또는 `--all`.
- **Google Search Console 색인 요청**: 공식 API가 없어 로컬 전용 크롬 프로필(`~/.ontools-gsc-profile`)로 URL 검사 → 색인 생성 요청을 자동 클릭.
  - 대기열 `.gsc-queue.txt`(git 제외)를 작업 스케줄러 `ontools-gsc-index`가 로그온 3분 후 하루 1회 8건씩 처리 (`~/.ontools-gsc-profile/last-run.txt`로 중복 방지). 로그 `~/.ontools-gsc-profile/request-log.txt`.
  - 새 페이지 배포 후 큐 파일에 URL 추가. 즉시 요청: `npm run gsc:index -- <url...>`. 일일 한도 약 10건.
  - 구글 세션이 풀리면 `npm run gsc:index -- --login`으로 창을 띄워 다시 로그인.
- **2026-09-27 현황**: 색인 35 / 미색인 59 (리디렉션 오류 19는 6월 기록, 현재 308 정상; 발견됨-미크롤링 35; 크롤링됨-미색인 5). 당일 /salary, /guide/holidays-2027, /income-tax, /currency, /savings, /severance-pay, /unemployment, /loan, /bg-remove, /image-convert 요청 완료.

## 애드센스 "가치가 별로 없는 콘텐츠" 대응 (2026-10-05)

- 재심사 거절 사유: 저가치 콘텐츠. 원인 진단: 122페이지 중 96개가 본문 1,500자 미만(중앙값 955자), 게임 페이지 300~450자.
- 조치:
  1. 게임 11개 라우트 noindex + 사이트맵 제외. noindex였던 /youth-savings도 사이트맵·색인 대기열에서 제외.
  2. 소개 페이지 전면 재작성(운영 목적, 도구·가이드 수 동적 표시, 계산 근거, 파일 처리 방식, 업데이트 원칙, 광고 정책).
  3. 도구 50개 페이지에 안내 섹션 4개(계산 예시·제도·흔한 실수)와 FAQ 4개씩 추가. 예시 숫자는 계산기 코드로 검산.
     - 콘텐츠 원본: `scripts/content/batch1~5*.json`, 삽입 도구: `node scripts/add-tool-content.mjs <json>` (중복 제목·질문은 건너뜀).
- 남은 도구(미확충 18개): image-split, image-stitch, text-image, gif-maker, favicon, kor-eng, ladder, special-chars, photo-submit, receipt-pdf, table-to-excel, product-photo-batch, selling-price, shift-pay-calendar, resignation-compare, pyeong, character-counter, hourly-wage 외 가이드 11편(초기분 800자대).
- 재심사 시점: 새 본문이 색인된 뒤(2~4주 후, 대기열 소진 확인 후) 애드센스 "검토 요청". 심사 중 광고 코드·ads.txt 변경 금지.
