# 홈 AdFit 배치 변경 검토

기준: main `92e236b575e7f27caca6f11edb15c70adc928a94` (PR4 상품사진 설명 수정 보존).
저장소/상위의 AGENTS.md 및 .agents/skills를 검색했으며 해당 파일은 없고 /workspace/.agents는 비어 있었다. README, 기존 광고 코드, CI, Playwright 설정 및 기존 운영 문서를 확인했다. GetLuckyLab 저장소는 수정하지 않는다.

## 기존 설정과 재사용

| 크기 | 기존 발급 단위 | 기존/변경 위치 |
| --- | --- | --- |
| PC 728×90 | DAN-YmhVtuLiN5Q2MJ3K | 홈 도구목록 아래 → 고양이 점프 아래 한 칸 |
| 모바일 320×100 | DAN-TMWlzezuMlSsAZtt | 홈 도구목록 아래 → 고양이 점프 아래 한 칸 |

`ResponsiveAdFit`는 viewport 768px 기준으로 선택하고 resize 시 교체한다. `AdFitUnit`는 production 마운트마다 ins와 비동기 `https://t1.kakaocdn.net/kas/static/ba.min.js`를 삽입하고 해제 시 비운다. NEXT_PUBLIC_ADFIT_UNIT_ID는 기본 AdFitUnit의 override이며 ResponsiveAdFit처럼 이번 홈도 위의 명시적 PC/모바일 단위를 사용한다.

이번에는 같은 매체/홈의 기존 단위를 이동하므로 새 단위·계정 연결·인증·토큰·보안설정 변경이 필요하지 않다. 승인 사실은 사용자 제공 범위이며 계정 내부의 현재 매체 승인/단위 활성/도메인 등록 상태는 접근권한 부재로 별도 확인 대상이다. 필요하면 소유자가 기존 Kakao AdFit 계정에서 ontools.co.kr 매체와 위 두 단위의 크기·활성상태·보고서를 읽기 전용 확인해야 한다. 새 ID는 만들지 않는다.

## 변경과 실패 처리

- 사용자의 후속 요청에 따라 소개 → 고양이 점프 → 광고 → 도구 순서다. 게임 아래 광고 라벨을 둔 한 칸이며 실제 광고 내용은 게임에서 48px 이상 떨어진다. 스크롤 힌트는 첫 viewport 하단의 안전한 위치에만 표시한다. 도구 제목이 이미 보이거나 스크롤/게임 조작을 시작하면 숨기고 계속 따라다니지 않는다. 광고 예약 영역·검색 버튼·게임 조작 문구와 16px 이상 떨어진 위치를 찾고, 없으면 숨긴다. 창/visualViewport 크기 변경을 반영하며 reduced-motion에서는 부드러운 스크롤과 전환 애니메이션을 사용하지 않는다. sticky/floating 광고, 팝업, 클릭 유도 문구, 강제 클릭은 없다.
- 최초 HTML부터 광고 내용 100px + 라벨/여백을 예약한다(전체 172px). 미송출·차단·실패에도 이 공간은 유지해 도구가 움직이지 않는다. 기존 대형 프로모션 영역을 제거하므로 상단 전체는 줄어든다. 메뉴의 도구 바로가기는 첫 화면에서 유지한다.
- 홈 전용 HomeAdFit은 실제 컨테이너 폭이 확보되면 한 단위만 선택하고, SDK 로드 전에도 호스트에 해당 728px/320px 폭을 명시한다. 이후 ResizeObserver를 즉시 해제한다. SPA 뒤로가기로 처음 숨겨진 트리에 마운트되어도 폭이 확보되면 초기화한다. 리사이즈로 재요청하지 않는다. PC 광고가 좁은 폭으로 바뀌면 CSS로 숨겨 잘리지 않게 하고 새로 요청하지 않는다. 다시 넓어지면 같은 광고가 보인다.
- 기존 하단 AdFit과 향후 AdSense home 수동 슬롯 호출을 제거해 홈의 수동 광고는 한 칸이다. root의 기존 AdSense 스크립트 및 계정의 자동광고 설정은 변경하지 않았다. 계정 자동광고 설정은 저장소에서 확인할 수 없다.
- 홍보는 도구 목록 뒤 작은 텍스트 카드, 주 메뉴와 푸터의 행운연구소 링크를 유지한다.
- 일반 자동 테스트는 모든 외부 광고/분석을 차단하거나 합성 SDK를 사용한다. 운영 관찰만 데스크톱/모바일 각각 한 번 요청하고 클릭·갱신·재시도하지 않는다. iframe/영역 존재와 실제 유료 광고 송출을 동일시하지 않는다.

## 정책 근거

공식 [AdFit Web SDK](https://github.com/adfit/adfit-web-sdk)는 발급 ID/크기의 보존, ins 및 SDK 설치와 NO-AD 콜백을 설명한다. [현재 운영정책](https://adfit.kakao.com/web/html/use_kakao.html) 5.3의 광고와 조작 버튼 분리, 콘텐츠 비가림, 광고공간 고정, 오클릭/클릭유도 금지를 기준으로 검토했다. 이번 배치 변경으로 계정 차원의 최종 심사를 대신할 수는 없다.

## 개별 도구 광고: 읽기 전용 검토

개별 도구 및 공통 AdFitUnit/ResponsiveAdFit/ToolGuide는 수정하지 않았다. salary, currency, loan, savings, severance-pay, capital-gains-tax, income-tax, calorie 등에 명시적 ResponsiveAdFit과 ToolGuide 기본 광고가 함께 있어 같은 페이지에서 두 마운트/스크립트가 발생할 수 있다. 다중 광고가 곧 정책 위반이라는 뜻은 아니지만 아래 사항은 후속 과제다.

1. 실제 컨테이너 폭 기준 크기 선택, 초기 높이 예약(현재 hydration/송출 때 공간이 생길 수 있음).
2. resize 임계점 왕복에 따른 재요청과 다중 마운트의 SDK 실행/SPA 해제를 공식 SDK 동작에 맞게 통합 검토.
3. 계산/다운로드/이전·다음 버튼과 광고 간격을 실제 송출 상태에서 점검.

## 현재 비교 가능한 측정 수단

- 기존 GA4 `G-JMXBEHHQ4K`(배포환경 override 가능)의 page_view와 등록 도구 전체 tool_view, 일부 calculation_complete/conversion_complete/tool_error/download. 홈 방문 대비 도구 유입과 일부 완료율을 전후 비교할 수 있다.
- AdFit 기존 계정 보고서의 단위별 요청/노출/클릭/수익 수치는 소유자가 확인 가능하다. 단위가 도구에서도 공유되어 홈만의 노출·수익을 코드만으로 분리할 수 없다. 기존 단위 재사용 시 일별 전후 비교는 트래픽·매체 차이의 영향을 받는다.
- GA4 향상된 측정의 아웃바운드 click이 기존 계정에서 켜져 있다면 link_domain=getluckylab.com 또는 link_url로 이동량을 조회할 수 있다. 기존 코드에는 홈 메뉴/카드/푸터를 구분하는 프로모션 클릭 이벤트나 홈 광고 노출 이벤트가 없다. 실제 설정/데이터는 미확인이다.
- 기존 계정 보고서 접근이 없으므로 수치·효과 향상을 주장하지 않는다. 새 추적 서비스, 맞춤 이벤트, 개인정보 수집을 추가하지 않았다. 운영 CI 관찰은 쿼리·쿠키·응답본문을 저장하지 않는다.

## 검증 및 공개 관찰

lint, typecheck, 전체 단위 테스트, production build, 데스크톱/모바일 E2E를 실행한다. 홈 회귀는 320/390/1366/1440px, 태블릿 740px, JS 비활성, SDK 차단/빈 응답/지연 합성 송출, 크기변경과 SPA 왕복, 메뉴 접근, 작은 카드 순서·높이, 가로 넘침 및 중복 ins/스크립트를 검사한다.

이 실행환경은 공개 ontools.co.kr 직접 접속 시 프록시 CONNECT HTTP 403으로 실패했다(브라우저 ERR_TUNNEL_CONNECTION_FAILED도 확인). 이는 설치·송출 실패의 증거는 아니다. 기존 운영 CI에서 기능 배포 대기 후 차단 E2E와 scripts/verify-home-adfit.mjs를 실행하고 production-browser-results 아티팩트에 관찰 JSON/스크린샷을 남긴다. 최종 PR/commit/CI와 실제 관찰 결과는 배포 기록을 참조한다.

후속 사용자 증거: 소유자 제공 스크린샷에서 LG 그램 프로 16인치 광고 소재의 실제 송출을 확인했다는 보고를 받았다. 이는 GitHub Actions의 첫 5초 관찰(소재 비표시)과 별개이며 관찰 환경/시점에 따라 송출이 다를 수 있다. 최종 순서 식별자는 홈 루트의 `data-home-layout="game-ad-tools"`다.

IndexNow 읽기 전용 조사: [run 39804042872](https://github.com/jojo8904/ontools/actions/runs/39804042872)는 잘못 추출된 `https://ontools.co.kr/page` 1건을 6분 기다린 뒤 제외하고 제출 없이 실패했다. scripts/indexnow-submit.mjs의 일반 app TSX 정규식이 app/page.tsx를 `/page`로 먼저 해석하고 continue하여 아래의 홈 `/` 전용 처리를 건너뛴다. 같은 commit 범위의 --dry-run으로 `/page` 추출을 재현했다. 이는 검색엔진 통지 작업의 URL 선택 문제이며 성공한 Vercel/Quality Checks 운영 배포와 별개다. 요청대로 스크립트·workflow를 수정하거나 재제출하지 않았다.
