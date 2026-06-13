# ontools 작업 노트 / 핸드오프

> 이 문서는 작업 맥락을 빠르게 복원하기 위한 요약본입니다.
> (비밀키 값은 적지 않음 — 키는 GitHub Secrets / Vercel 환경변수 / 코드 내 공개키로 관리)

## 한 줄 요약
방치돼 있던 한국형 유틸리티 계산기 + AI 뉴스 포털 **ontools**(Next.js 14 + Supabase + Vercel).
디자인 전면 개편 + 뉴스 자동화 복구 + 계산기 ~40개 + 수익화(애드핏/애드센스) + 분석(GA4)까지 완료.

---

## 기술 스택
- Next.js 14 (App Router), TypeScript, Tailwind
- Supabase (뉴스/환율 데이터), Vercel(호스팅, main 브랜치 자동배포)
- GitHub Actions cron (뉴스/환율/유튜브 크롤러)
- 도메인: www.ontools.co.kr

## 완료된 작업 (큰 줄기)
1. **코드 정리/버그**: zustand 제거, AdSense ID 환경변수화, salary zod 검증, 적금 단리 off-by-one 수정, 연차수당 세금 라벨 수정 등
2. **뉴스 자동화 복구** (4개월 멈춤 → 정상): 원인 3중 — ①GitHub 60일 cron 자동비활성 ②Anthropic 크레딧 소진 ③`news` 테이블 `image_url` 컬럼 누락. 모두 해결. og:image 스크래핑으로 썸네일 100% 채움. 0건 저장 시 빨간불+텔레그램 알림(재발 방지).
3. **디자인 개편(힉스필드 AI)**: 마스코트 업그레이드(`/public/mascot.png`), 카테고리 일러스트 6종(`/public/images/cat-*.webp`), 히어로/OG, 밝은 테마.
4. **계산기 ~40개**: 전부 설명 가이드(ToolGuide) + FAQ(FaqSection, FAQPage JSON-LD).
   - 신규: 만나이·평수·시급↔월급·할인율·중개수수료·적정체중·수면·음주분해·자동차세·증여세·복리·날짜·출산예정일·4대보험
5. **편의기능**: 플로팅 검색 위젯(우하단, 즐겨찾기+최근본 통합), 카카오톡 공유, 관련도구, FavoriteStar.
6. **페이지**: /privacy, /terms, /about, ads.txt.

## 수익화 현황
- **카카오 애드핏**: 노출 중. 광고단위 PC `DAN-YmhVtuLiN5Q2MJ3K`(728x90), 모바일 `DAN-TMWlzezuMlSsAZtt`(320x100). `ResponsiveAdFit`이 화면폭 768 기준 자동전환. 매체 카테고리=도구>금융.
- **Google AdSense**: pub `ca-pub-8367801233123288`. **재심사 중**(이전 "가치 없는 콘텐츠" 거절 → 콘텐츠 보강 후 재신청). 승인되면 광고단위 슬롯 ID 발급받아 코드의 `slot="0000000000"` 교체 필요.
- **카카오톡 공유**: JS키 `03120f5849190844457b510f457232ee`(코드 기본값). Kakao Developers에 Web 플랫폼/JS SDK 도메인 등록 완료.
- **GA4**: 측정 ID `G-JMXBEHHQ4K` (GoogleAnalytics 컴포넌트, 전역).

### 광고 배치 규칙
- 긴 2단 계산기(연봉·칼로리·환율·대출·종소세·적금·양도세·퇴직금): **제목 밑 카카오 + 오른쪽 사이드바 sticky 구글 + 하단 구글**.
- 그 외(짧은/1단): **결과 직후 카카오(ToolGuide) + 하단 구글(RelatedTools)**.
- 전 계산기: 플로팅 "더보기" 버튼(주황 #f97316), 스크롤 감지 표시/숨김.
- ToolGuide `hideAd` prop = 상단에 광고 따로 둔 페이지의 중복 방지.

## 검색/분석 등록
- 네이버 서치어드바이저: 사이트맵 제출 완료(sitemap.xml).
- 구글 서치콘솔: 사이트맵 제출 확인 권장.
- sitemap.ts = app 디렉토리 자동 스캔(새 페이지 자동 포함).

## 운영 주의 (뉴스가 또 멈추면)
1. Anthropic 크레딧 잔액 확인(console.anthropic.com) — 크롤러는 Claude Haiku로 요약.
2. GitHub Actions에서 News Crawler "Run workflow" → Saved 숫자 확인.
3. Secrets 유효성: `CLAUDE_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
4. 외부 cron(cron-job.org → repository_dispatch)으로 60일 자동비활성 우회 가능(docs/SETUP-CRON.md).

## 알려진 약점 (전략 논의)
- **레드오션**: 연봉/환율 계산기 시장은 이미 강자 다수 + 네이버는 자체 콘텐츠 우선 → 후발주자 SEO 불리.
- **한국 한정**: 시장 작고 AdSense 단가 낮음. 통용 계산기(BMI·칼로리·단위·복리·나이 등 ~12개)는 영어화하면 글로벌·고단가 시장 가능.

## 다음 할 일 / 아이디어
- 데이터 미세 갱신: 실업급여 상한액, 전기요금 한전 단가표(최신화 필요 — 값만).
- AdSense 승인 시 슬롯 ID 연결.
- **글로벌 신규 사이트 구상** (논의됨): "글로벌 올인원 툴 사이트"
  - #1 이미지/파일 툴(압축·변환·리사이즈·배경제거·PDF) = 언어무관, 트래픽 볼륨
  - #5 영어 금융/건강 계산기(모기지·대출·투자) = 고CPM
  - #4 프로그래매틱 SEO(단위/통화 변환 등 조합별 자동 페이지 수천 개)
  - 추정: 코드 MVP 1~2주 / 상용 완성도 2~4주 / 의미있는 수익은 SEO로 3~6개월.
  - (#2 AI 이미지 SaaS는 건당비용 리스크로 보류)

## 작업 방식 메모
- main에 push → Vercel 자동배포. 커밋 전 `node_modules/.bin/tsc --noEmit`로 타입체크.
- 로컬 dev: 더미 Supabase env로 실행 가능(뉴스만 빈 채로 디자인 확인).
