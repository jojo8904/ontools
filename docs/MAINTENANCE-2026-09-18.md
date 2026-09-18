# 2026-09-18 유지보수 기록

기존 진단 문서는 수정 전 상태를 기록한다. 이 문서는 구현 범위, 실제 배포 결과와 남은 일을 구분한다.

## 구현

- 공개 역할의 DB 쓰기 권한·정책 제거 마이그레이션. 카테고리/영상 복합 유일 키와 트랜잭션 교체 RPC.
- Next.js 16, PDF.js 6, 로컬 worker 및 의존성 보안 업데이트. 사용하지 않는 Query Provider와 SDK 제거.
- 공통 2026 보험료·최저임금 기준, 상·하반기 연금 한도, 건강보험 상·하한, 요율·급여표 갱신. 근로소득 세액공제 보완.
- 보험료 절사 전 부동소수점 오차 수정. 급여 계산 기준을 바꾸면 이전 결과 무효화.
- 환율의 실제 제공기관·기준시각·오래됨·대체 값 표시, 원화→외화 단위 환율 수정.
- 마스킹·증명사진 편집 후 이전 내보내기 무효화, 배경 제거의 오래된 비동기 작업 결과 무시.
- Object URL 초기화·교체·언마운트 정리. PDF 이미지의 크기/페이지/픽셀 제한 및 취소.
- 큰 PDF 범위 입력을 실제 페이지 수로 제한. 비밀번호 문자 선택·셔플을 crypto 난수로 통일.
- YouTube 실패를 작업 실패로 보고, 원자적 갱신 RPC 사용 및 선택적 Telegram 알림.
- 공통 헤더·푸터, 중앙 도구 목록, 게임 검색 등록, 페이지 canonical, 부정확한 sitemap 수정일 제거.
- 모바일 긴 홈 목록이 계속 투명하게 남는 오류 수정. 첫 화면에서 도구 우선, 작동하지 않던 스크롤 버튼 대상 수정.
- 일부 게임의 프레임 시간 보정과 저장 점수 동기화. OG 이미지는 로컬 PNG를 사용해 외부 요청/미지원 WebP 문제 제거.
- AdSense 위치별 실제 슬롯 환경변수 준비. 미승인 상태에서 수동 광고 비표시 유지. GA 도구 이벤트 기반 추가.
- 전기요금 기금 2.7% 및 반올림 수정, 지원 범위를 기타계절 저압 0~1,000kWh로 명시.
- 기존 청년내일채움공제 계산기 제공 중단. 신규 가입 중단 안내와 공식 확인 경로만 유지하고 noindex 적용.
- README/환경변수 정리, lint·빌드·단위·DB·브라우저 CI 추가.

## 확인한 근거

- [국민연금 기준소득월액 기간](https://www.nps.or.kr/eng/ntnlpnsplan/cntb/getOHAI0013M0.do)
- [2026 건강·장기요양 요율](https://edi.nhis.or.kr/portal/images/popup/20251204_pop01longdesc.html)
- [건강보험 상·하한 고시](https://www.nhis.or.kr/lm/lmxsrv/law/lawFullContent.do?SEQ=39)
- [최저임금](https://www.moel.go.kr/mainpop2.do)
- [구직급여 상·하한](https://www.work.go.kr/buyeo/ctrIntro/ctrWork/ctrWorkDetail.do?menuCd=40207)
- [전기사업법 시행령 개정문](https://law.go.kr/LSW/lsRvsDocListP.do?chrClsCd=010102&lsId=004692)
- [청년내일채움공제 신규 신청 중단](https://1350.moel.go.kr/rtmview.do?id=1000298780)

## 2026-09-19 운영 배포

- 기능 배포 커밋: `87972ba` (기본 유지보수 `db644b7` 포함). 기존 GitHub `main`과 Vercel 프로젝트를 사용했으며 도메인과 DNS는 변경하지 않았다.
- [운영 사이트](https://ontools.co.kr), [Vercel 배포 성공 기록](https://vercel.com/830508jo-7319s-projects/ontools/5EnQLoSec7yeScSPw1nzNSU1obY6).
- 변경 직전 news 514건, exchange_rates 468건, youtube_videos 95건 및 테이블 구조·정책·권한·인덱스를 로컬 `%LOCALAPPDATA%/ontools-backups/2026-09-19-production-release`에 백업했다. 전체 Supabase 프로젝트 백업이 아닌 변경 대상 테이블 백업이다.
- 운영 DB는 초기 SQL과 달리 환율 날짜가 DATE이고 영상 필수 항목 제약이 없었다. 마이그레이션 005로 UTC 날짜를 보존하며 timestamptz로 전환하고 필수 항목·조회 인덱스를 맞췄다. 기존 데이터 삭제 없이 완료했다.
- 적용한 원격 마이그레이션: `20260918163519 secure_public_data` (로컬 004), `20260918163520 align_legacy_schema` (로컬 005). 원래 운영 테이블은 수동 생성되어 001~003 이력이 없으므로 초기 마이그레이션을 재실행하지 않는다.
- 운영 anon/authenticated 읽기 허용·쓰기 거부, service_role 갱신과 RPC 실행 권한을 확인했다. 트랜잭션 안에서 영상 교체 실패 시 원본 보존을 시험한 뒤 전체 롤백했으며 테스트 행은 남기지 않았다.
- [GitHub 품질 검사](https://github.com/jojo8904/ontools/actions/runs/35369474647)에서 앱 검사와 PostgreSQL 17 보안 검사가 모두 성공했다.
- [환율 갱신](https://github.com/jojo8904/ontools/actions/runs/35369526259), [영상 갱신](https://github.com/jojo8904/ontools/actions/runs/35369528496)을 수동 실행해 성공을 확인했다. 환율 4종의 출처/수집시각과 활성 19개 영상 카테고리의 갱신을 검증했다.
- 실제 운영 주소에서 Playwright 13개 성공, 중복 모바일 경로 검사 1개 제외. 71개 도구 경로 HTTP/canonical, 급여 기간 전환, 파일 재편집, PDF worker/출력 픽셀, 게임 canvas를 검사하고 데스크톱·모바일 캡처를 확인했다.
- 외부 광고 스크립트를 차단하지 않은 별도 브라우저 검사에서도 1440px/412px 가로 넘침 없음, 로컬 이미지 로딩, 실제 환율 API 응답과 출처 표시를 확인했다. sitemap, robots, OG 이미지, PDF worker 모두 HTTP 200이다.
- `PLAYWRIGHT_BASE_URL=https://ontools.co.kr`로 브라우저 검사를 다시 실행할 수 있다. 서비스 워커를 차단해 배포된 파일을 직접 확인하며 환율 fallback 테스트에서만 환율 요청을 의도적으로 차단한다.

## 운영 환경에서 남은 일

1. Telegram 실패 알림용 secrets가 없어 알림 전송은 미설정이다. 스케줄러 성공은 확인했지만 실패 알림 수신은 별도 설정 후 검증해야 한다.
2. GA4·Search Console 접근 및 실제 데이터 수신 확인. 광고 승인은 미완료이며 광고 노출·수익은 검증하지 않았다.
3. 모든 세금·건강 계산기의 제도 적합성 검토는 별도 작업이다. 급여는 간이세액표가 아닌 연간 추정치, 전기요금은 명시한 범위와 고정 연료비 가정만 지원한다.
4. 저사양 실제 휴대폰의 최대 파일 메모리, 배경 제거 모델의 실제 다운로드/추론, 모든 게임 규칙을 전수 검증하지 않았다.

## 검증 구성

로컬 최종 확인: `npm run lint`, `npm run typecheck`, `npm run build` 성공. Vitest 8파일 52개 성공, Playwright 13개 성공(중복 경로 검사 1개 모바일 제외), `npm audit` 보고 취약점 0개. 데스크톱·모바일 화면 캡처를 확인했다.

- Vitest: 기존 29개 외에 암호학적 난수, PDF 범위, 보험 기간·한도, 절사, 환율 출처, URL 해제, 크롤러 실패, DB 권한/롤백 검사 추가.
- PGlite: 실제 마이그레이션 적용, 공개 쓰기 거부, 다른 카테고리의 동일 영상 저장, 교체 실패 시 기존 영상 보존 확인.
- Playwright: 데스크톱·모바일 주요 흐름, 홈 노출·가로 넘침, 급여 기간 변경, 환율 fallback, 마스킹·사진 재편집, 로컬 worker와 PDF 출력 픽셀 검사.
- 모든 등록 도구 71개 경로의 HTTP 응답과 canonical을 검사한다. 모든 도구의 계산 정답·사용 흐름 전수 테스트라는 뜻은 아니다.
- CI에는 실제 PostgreSQL 17에서 같은 보안 SQL을 실행하는 별도 job을 추가했고 원격 실행 성공도 확인했다.
- ESLint 10은 현재 Next React 플러그인의 제거된 API 호출로 실행되지 않아 9.39.x 호환 버전을 사용한다. 지원 종료 경고는 남으며 플러그인 대응 후 재업데이트해야 한다.
