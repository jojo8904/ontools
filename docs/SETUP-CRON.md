# 자동화 크론 설정 가이드 (외부 스케줄러)

## 왜 이게 필요한가

GitHub Actions는 **저장소에 60일간 커밋 활동이 없으면 `schedule`(cron) 트리거를 자동으로 비활성화**한다.
ontools는 2026-02-17 마지막 커밋 이후 이 규칙에 걸려 뉴스 크롤러가 멈췄다.

해결책: 외부 스케줄러(무료 cron-job.org)가 GitHub API의 **`repository_dispatch`** 이벤트로
워크플로우를 주기적으로 깨운다. `repository_dispatch`는 `schedule`이 아니므로 자동 비활성화의 영향을 받지 않는다.

워크플로우 3종에는 이미 `repository_dispatch` 트리거가 추가되어 있다:

| 워크플로우 | event_type | 권장 주기 |
|---|---|---|
| News Crawler | `crawl-news` | 6시간마다 |
| Exchange Rate Updater | `update-exchange-rate` | 평일 1회 (오전) |
| YouTube Crawler | `crawl-youtube` | 주 1회 |

---

## 1단계: GitHub Actions 워크플로우 재활성화 (최초 1회, 필수)

이 변경사항을 푸시한 뒤:

1. https://github.com/jojo8904/ontools/actions 접속
2. 비활성화된 워크플로우마다 상단의 **"This workflow was disabled..."** 배너에서 **Enable workflow** 클릭
3. 각 워크플로우에서 **Run workflow** (workflow_dispatch)로 1회 수동 실행 → 초록불 확인
   - ❌ 빨간불이면: Settings → Secrets and variables → Actions 에서
     `CLAUDE_API_KEY`(4개월 지나 만료 가능), `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
     `YOUTUBE_API_KEY` 유효성 확인

---

## 2단계: GitHub Personal Access Token 발급

외부 스케줄러가 API를 호출하려면 토큰이 필요하다.

**Fine-grained token (권장):**
1. https://github.com/settings/tokens?type=beta → **Generate new token**
2. Repository access: **Only select repositories** → `jojo8904/ontools`
3. Permissions → **Contents: Read and write** (repository_dispatch 발생에 필요)
4. 만료일: 1년 또는 No expiration
5. 생성된 토큰(`github_pat_...`) 복사 — **한 번만 보임**

> Classic token을 쓰려면 `repo` 스코프만 체크하면 된다.

---

## 3단계: cron-job.org에 작업 등록

https://cron-job.org 가입 후 **Create cronjob** — 아래 3개를 각각 등록한다.

### 공통 설정 (모든 작업 동일)

- **URL**: `https://api.github.com/repos/jojo8904/ontools/dispatches`
- **Request method**: `POST`
- **Request headers**:
  ```
  Authorization: Bearer <2단계에서 발급한 토큰>
  Accept: application/vnd.github+json
  X-GitHub-Api-Version: 2022-11-28
  Content-Type: application/json
  User-Agent: ontools-cron
  ```
  > `User-Agent`는 GitHub API 필수 헤더다. 빠지면 403이 난다.

### 작업 ① 뉴스 크롤러 (6시간마다)

- **Schedule**: Every 6 hours (분: 0 / 시: `*/6` / 요일·일: every)
- **Request body**:
  ```json
  {"event_type": "crawl-news"}
  ```

### 작업 ② 환율 업데이트 (평일 오전 11시 KST)

- **Schedule**: 평일(월~금), 시 `2`, 분 `0` (UTC 기준 — cron-job.org는 타임존 설정 가능하니 KST로 11:00 지정해도 됨)
- **Request body**:
  ```json
  {"event_type": "update-exchange-rate"}
  ```

### 작업 ③ 유튜브 크롤러 (주 1회, 월요일)

- **Schedule**: 월요일, 시 `0`, 분 `0`
- **Request body**:
  ```json
  {"event_type": "crawl-youtube"}
  ```

---

## 4단계: 동작 확인

cron-job.org에서 작업의 **"Run now"** 또는 **TEST RUN** 실행 → 응답이 **204 No Content**면 성공.
GitHub Actions 탭에 해당 워크플로우 실행이 새로 뜨는지 확인.

### 터미널에서 직접 테스트 (선택)

```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -H "User-Agent: ontools-cron" \
  https://api.github.com/repos/jojo8904/ontools/dispatches \
  -d '{"event_type":"crawl-news"}'
```

204가 떨어지고 Actions 탭에 News Crawler 실행이 뜨면 완료.

---

## 모니터링

- 각 워크플로우에는 실패 시 텔레그램 알림 스텝이 있다.
  `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` 시크릿을 등록하면 실패를 즉시 통보받는다.
- 이걸 설정해두면 "또 4개월간 모르고 방치"되는 상황을 예방할 수 있다.
