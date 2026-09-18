# ontools

브라우저에서 사용하는 계산기, 이미지·PDF 도구, 게임, 한국어 가이드 모음입니다.
Next.js 16 App Router, React 18, TypeScript, Tailwind CSS, Supabase를 사용합니다.
도구 목록은 `lib/tools.ts`, 정책 기준은 `lib/korea-policy.ts`에서 관리합니다.

## 로컬 실행

Node.js 24 LTS를 권장합니다. 최소 버전은 22.13입니다.

```sh
npm ci
npm run dev
```

기본 주소는 http://localhost:3000 입니다. 포트가 사용 중이면 `npm run dev -- --port 3001`로 실행합니다.
기본 계산기와 파일 도구는 환경변수 없이 실행됩니다.
`npm ci`는 설치된 PDF.js와 같은 버전의 worker를 public에 복사합니다. worker는 Git에 포함하지 않습니다.

## 환경변수

`.env.example`이 기준 문서이며, 로컬 설정 파일은 `.env.local`입니다.
실제 키는 Git에 넣지 않습니다. `NEXT_PUBLIC_*`는 브라우저에 노출됩니다.

| 변수 | 용도 |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY | 환율·영상 공개 읽기. 미설정 시 환율은 명시적 참고용 고정 값, 영상은 비표시 |
| SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY | GitHub Actions의 서버 쓰기. 브라우저 변수로 사용 금지 |
| YOUTUBE_API_KEY | YouTube 수집 작업 전용 |
| NEXT_PUBLIC_GA_ID | GA4. 기존 측정 ID 기본값 유지, 개발 모드에서는 비활성 |
| NEXT_PUBLIC_ADSENSE_CLIENT_ID | 본인 게시자 ID. 심사 연결과 실제 광고 승인은 별개 |
| NEXT_PUBLIC_ADSENSE_SLOT_HOME / TOOL / RELATED | 승인 후 발급된 위치별 광고 슬롯. 미설정이면 수동 광고 비표시 |
| NEXT_PUBLIC_ADFIT_UNIT_ID | 애드핏 기본 단위 override. 기존 발급 ID 기본값 유지 |
| TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID | 선택 사항, 수집 실패 알림 |

서비스의 canonical 기준 주소는 `https://ontools.co.kr`입니다.
애드센스는 아직 승인 전이며 이 변경이 승인이나 수익을 보장하지 않습니다.

## 배포 순서

1. 운영 DB를 백업하고 현재 RLS/GRANT를 확인합니다. 운영 DB는 이번 로컬 작업에서 변경하지 않았습니다.
2. 기존 DB에는 `supabase/migrations/004_secure_public_data.sql`, `005_align_legacy_schema.sql` 순서로 한 번씩 적용합니다. 새 DB는 001~005 순서입니다. 운영 DB에는 2026-09-19 두 변경을 적용했으므로 중복 실행하지 않습니다.
3. 새 마이그레이션의 SELECT 전용 공개 권한, service_role 전용 RPC, 환율 출처 컬럼을 검증합니다.
4. 프런트엔드와 수집기를 배포한 후 GitHub Actions에서 환율·영상 수집을 수동 실행합니다.
5. 실제 환율 날짜/출처와 실패 알림, GA4 이벤트 수신을 확인합니다.
6. Search Console에서 사이트 소유권과 `/sitemap.xml` 색인 상태를 확인합니다. 계정 연결은 별도입니다.

마이그레이션은 중복 실행용 스크립트가 아닙니다. 적용 이력을 관리하세요.
service_role 키는 RLS를 우회하므로 서버의 비밀 저장소에만 둡니다.
수집기는 Actions secrets를 사용하며 로컬 tsx 실행 시 환경변수를 명시적으로 주입해야 합니다.

## 검증

```sh
npm run lint
npm run typecheck
npm test -- --run
npm run build
npx playwright install chromium
npm run test:e2e
npm audit
```

Playwright는 127.0.0.1:4127에서 임시 운영 모드 서버를 시작하고 종료합니다.
DB 검증은 로컬 PGlite와 CI PostgreSQL 17에 같은 SQL을 적용합니다.
CI는 lint, 단위·DB 테스트, 빌드, 데스크톱·모바일 브라우저 검사, 운영 의존성 보안 검사를 실행합니다.
ESLint는 현재 Next 플러그인과 호환되는 9.39.x로 고정 범위를 유지합니다.
ESLint 10 지원은 플러그인 호환성 확인 후 올려야 합니다.

## 계산 범위와 운영

- 급여는 선택한 2026년 상·하반기 보험 기준 및 연간 세액 기반 월 추정치입니다. 간이세액표 원천징수, 비과세 수당, 모든 연말정산 공제를 재현하지 않습니다.
- 전기요금은 기타계절 주택용 저압 0~1,000kWh만 추정합니다. 하계·고압·할인·수신료는 미반영하며 연료비 5원/kWh는 고정 가정입니다.
- PDF 이미지 변환은 파일 50MB, 50페이지, 페이지당 16MP, 전체 40MP 제한입니다.
- 환율은 제공기관의 실제 기준시각을 표시하고 36시간 초과 데이터 및 고정 대체 값을 구분합니다.
- `tool_view`는 등록 도구 전체, 완료 이벤트는 연봉·환율·PDF 변환부터 적용했습니다. 파일명, 급여, 비밀번호, 이미지 내용은 자체 이벤트에 넣지 않습니다.
- 운영 데이터, 광고 승인, 실제 기기 전체의 성능, 모든 세무·건강 도구의 제도 적합성은 별도 점검 대상입니다.

## 문서

- [기존 코드 진단](docs/CODE-REVIEW-2026-09-18.md)
- [수정 내역과 운영 확인사항](docs/MAINTENANCE-2026-09-18.md)
- [유입·수익화 기능 제안](docs/GROWTH-IDEAS-2026-09-18.md)

기존 plan/design 문서는 초기 기획 기록이며 현재 구현 설명과 다를 수 있습니다.
