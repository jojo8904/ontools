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
| 2026-10-18 23:14 | 6383604 | 무료 자동차 구매·리스·장기렌트 동일 기간 총비용 비교. Vercel 및 Quality Checks(database/verify) 성공, unit 160개·E2E 40통과/조건부 2스킵·운영 audit 0. 기존 OCR도 실제 CI 통과. 운영 직접 HTTP/UI는 클라우드 프록시 403으로 미완료, 부모 라이브 QA 인계. 상세 `docs/CAR-COST-2026-10-18.md`. |
| 2026-10-18 11:36 | d3e1a09 | 무료 판매자 정산 XLSX/CSV 비교. Vercel 성공, Quality Checks(database/verify) 성공, 단위·통합 17파일/146개·E2E 38통과/기존 조건부 2건너뜀·운영 audit 0. 직접 운영 HTTP/UI는 클라우드 네트워크 403으로 부모 라이브 QA에 인계. |
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
- 2026-10-05 추가: 남은 도구 17개도 같은 방식으로 확충해 도구 67개 전체 완료(batch6). add-tool-content.mjs는 인라인 guide/sections·faq/items 배열도 지원. 남은 빈약 페이지: 초기 가이드 11편(800자대, lib/guides.ts 섹션 보강 필요).
- 재심사 시점: 새 본문이 색인된 뒤(2~4주 후, 대기열 소진 확인 후) 애드센스 "검토 요청". 심사 중 광고 코드·ads.txt 변경 금지.

## 2026-10-18 중복 줄 제거 도구 배포 (09:54 UTC 검증)

- 기능 커밋: 16761ea8891539550c406462cbc74864220ee6bb.
- 운영 URL: https://ontools.co.kr/remove-duplicate-lines
- 원본 순서 유지, 대소문자 구분, 선택적 앞뒤 공백/빈 줄 제거, 실시간 줄 수, 복사·실패 안내·초기화. 입력은 브라우저 메모리에서만 처리하며 서버·URL·저장소·분석 이벤트에 포함하지 않음.
- ToolShell, 도구 레지스트리/홈 검색, canonical, 안내 4개 섹션·FAQ 4개, 관련 도구, 사이트맵 날짜 반영.
- 기존 운영 의존성 감사의 high 3건 해소: Next.js/eslint-config-next 16.3.8, sharp 0.35.5, source-map-js 1.2.2. 메이저 변경 없음.
- 로컬: npm ci, lint, typecheck, 단위 테스트 14파일/108개, production build 통과. 운영 의존성 audit 0건. Playwright desktop/mobile 34 passed, 2 skipped(기존 프로젝트별 중복 제외).
- 해당 커밋 GitHub Quality Checks(database/verify) 성공: https://github.com/jojo8904/ontools/actions/runs/39116998440
- Vercel Production 성공: https://vercel.com/830508jo-7319s-projects/ontools/FYv1EN1Qsk5HaQ9kBHa5ymj7qEJE
- IndexNow 성공: https://github.com/jojo8904/ontools/actions/runs/39116998444
- 운영 전체 Playwright 재검증: 34 passed, 2 skipped. 신규 도구 desktop/mobile 원본 보존·옵션 재계산·반복 복사/초기화·클립보드 실패 안내·비전송 확인. 로컬 desktop/mobile 화면 캡처 시각 검토 완료.
- 운영 /, 새 도구, /sitemap.xml, /robots.txt, /opengraph-image 모두 HTTP 200. 등록 도구 전체 canonical 및 신규 사이트맵 항목 확인.
- 증거: test-results/local 및 test-results/production (Git 제외). Google 색인 요청은 기존 로컬 대기열에 신규 URL만 추가; 직접 색인 요청은 실행하지 않음.
- 광고, 정책 수치, DB 스키마 및 적용된 마이그레이션 변경 없음. 이 기록은 기능 커밋 검증 후 별도 문서 커밋으로 보관.


## 2026-10-18 무료 판매자 정산 비교 (클라우드)

- 기능: `/seller-settlement`, 시트/키/금액 열을 직접 고르는 범용 XLSX/UTF-8 CSV 비교. 가입·결제 없이 무료. 마켓 자동 연동·공식 내보내기 호환·미지급 확정 기능은 없다.
- 기준 기능 커밋: `d3e1a09b9b392e0b3a943f2ff02ae58b837df813` (초기 `d13315d`, 후속 `42f9fbb`).
- [GitHub Quality Checks](https://github.com/jojo8904/ontools/actions/runs/39123712082): database/verify 성공. lint, 146 테스트, build, Chromium 설치, E2E 38통과/기존 조건부 2건너뜀, `npm audit --omit=dev --audit-level=high` 0건.
- [Vercel 배포](https://vercel.com/830508jo-7319s-projects/ontools/36pBpCNYWAKEr9b5Z8ztrdazgWQt): 위 SHA의 성공 상태를 GitHub 연결로 확인.
- 초기 E2E에서 독립 번들에 남은 Node `process.env` 참조를 발견해 수정했다. production bundle을 `process` 없는 브라우저 조건에서 실행하는 회귀 검사를 추가했다. CSV 여러 줄 셀 뒤의 참조 행 번호와 숫자 키의 내보내기 보존도 수정했다.
- 입력은 opaque-origin sandbox iframe에만 존재한다. 부모 광고/분석과 DOM·스토리지를 공유하지 않고, CSP로 작업 영역의 외부 연결/폼/제3자 스크립트를 차단한다. 공통 광고 코드는 바꾸지 않았다.
- 클라우드 npm ci/postinstall, lint/typecheck/146테스트/build(130정적페이지)/운영 audit 통과. 기존 OG 글꼴의 Google Fonts DNS 경고는 빌드 성공과 별개로 남는다.
- 컨테이너 직접 운영 도메인/API 요청은 네트워크 정책 403, 로컬 Chromium은 기존 실행 제한이 있으므로 우회하지 않았다. 운영 URL 실제 화면·HTTP·블로그용 2스크린샷은 부모의 승인된 클라우드 브라우저 QA로 인계한다. 이 기록은 직접 운영 UI 확인을 주장하지 않는다.
- 합성 예제/사용 제한/블로그 재현 절차: `docs/SELLER-SETTLEMENT-2026-10-18.md`. 티스토리는 이 작업에서 발행하지 않았다. 사용자 PC, GetLuckyLab, DB, 비밀값, 정책 수치 변경 없음.

## 2026-10-21 세 도구 개선

- `/image-split`: 기존 2~12등분·개별 이미지·ZIP 유지. 조각당 A4 세로 한 페이지 맞춤 미리보기, 0~30mm 여백과 PDF 저장. 실제 PDF 페이지 210×297mm 검증. 포스터 타일링/겹침 기능은 아니며 조각별 배율이 달라질 수 있음. 설정 변경·다른 사진 선택 시 이전 결과 무효화, 비동기 작업 취소 반영. 픽셀 높이 입력 기능이 있다는 잘못된 안내 수정.
- `/electricity`: 히터·온풍기 정격 W × 켜 두는 시간 × 일수 × 명시적 가동률 가정으로 추가 kWh 계산. 기존 요금 엔진의 가구 전체 전후 차액으로 추가요금 계산. 같은 엔진을 분 단위 이진 탐색하여 추가예산 내 총/일평균 시간 표시. 주택용 저압·기타계절·합계 0~1,000kWh 제한 유지. 하계·고압·할인·TV 수신료 제외, 초과 외삽 없음. 기존 단가와 기후 9원/연료 5원 가정 유지. 기금 2.7%는 2025-07 이후 기준이며 모든 최신 청구조건 재현을 주장하지 않음.
- `/calorie`: Mifflin-St Jeor 간편식과 최종 반올림 유지. 성인 입력 검증, 단계별 흐름, 직업·이동·좌식 시간을 포함한 활동량 설명, 라디오/레이블과 입력 변경 시 결과 무효화. 고정 감량·증량 목표 및 근거 없는 확신/획일적 식사 처방 문구를 제거하고 추정 한계 표시.
- 근거: [한전 요금표](https://cyber.kepco.co.kr/ckepco/front/jsp/CY/D/C/CYDCHP00401.jsp), [기금 법령](https://law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=118786), [2025-07 적용 정책 안내](https://www.korea.kr/news/policyNewsView.do?newsId=148929635), [Mifflin 원문](https://pubmed.ncbi.nlm.nih.gov/2305711/), [NIH 성인 대상/한계](https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner).
- 화면 예시: 301×1201 PNG → 3조각·20mm 여백·A4 3페이지. 전기 기존300kWh/2000W/4시간/30일/100% → 추가240kWh, 57,760원→140,640원, 추가82,880원; 추가예산30,000원→총50시간. TDEE 남성30세/175cm/75kg/가벼운활동1.375 → BMR1,699/TDEE2,336kcal; 여성은1,533/2,108kcal.
- 로컬 검증: lint, typecheck, 단위23파일/183개, production build, audit 취약점0개 통과. 새 기능 desktop/mobile 브라우저 검사와 전체 회귀 검사 실행. 최종 CI·배포 결과는 해당 PR 및 커밋 상태/production job에서 확인해야 하며 이 기록만으로 성공을 주장하지 않음.
- 기존 CI에 main 배포 커밋의 Vercel 상태 대기 및 실제 운영 desktop/mobile E2E·스크린샷 보관 단계를 추가. 공개 커밋 상태를 인증 없이 조회하며 추가 자격증명을 사용하지 않음. 광고/분석/DB/영구 권한 변경 없음.
- 최종 새 기능 E2E: desktop/mobile 8개 통과(중단 후 교체, PNG/JPEG, 2/12조각, 실제 PDF·ZIP·개별 저장, 난방 경계·예산·초기화, TDEE 검증·입력 변경 포함). 전체 로컬 회귀에서 기존 실제 OCR 테스트가 외부 언어 데이터 초기화 후 150초 기대값 시간 초과. 기능 검사 실패와 구분하며 CI에서 전체 검사를 재확인한다. 빌드는 Google Fonts DNS 경고가 있으나 종료 코드0이다.
