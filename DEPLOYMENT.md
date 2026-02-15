# Vercel 배포 가이드

## Phase 1 배포 (현재 단계)

Phase 1에서는 모든 데이터가 하드코딩되어 있어 환경변수 설정 없이 바로 배포 가능합니다.

### 1. GitHub 레포지토리 준비

```bash
# Git 초기화 (아직 안했다면)
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Phase 1: 연봉/환율/BMI 계산기 + SEO 인프라 완료"

# GitHub 레포지토리 생성 후 연결
git remote add origin https://github.com/YOUR_USERNAME/ontools.git
git branch -M main
git push -u origin main
```

### 2. Vercel 배포

1. **Vercel 웹사이트 접속**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **New Project 생성**
   - "Add New..." → "Project" 클릭
   - GitHub 레포지토리 선택 (ontools)

3. **프로젝트 설정**
   - Framework Preset: **Next.js** (자동 감지됨)
   - Root Directory: `.` (기본값)
   - Build Command: `npm run build` (기본값)
   - Output Directory: `.next` (기본값)

4. **환경변수 설정 (Phase 1에서는 선택사항)**
   - Phase 1에서는 환경변수 없이 배포 가능
   - Phase 2부터 필요:
     - `NEXT_PUBLIC_BKEND_API_URL`
     - `NEXT_PUBLIC_BKEND_PROJECT_ID`
     - `NEXT_PUBLIC_BKEND_ENV`

5. **Deploy 클릭**
   - 자동으로 빌드 시작
   - 1-2분 후 배포 완료

### 3. 배포 확인

배포 완료 후 Vercel이 제공하는 URL로 접속:
- `https://ontools.vercel.app` (또는 자동 생성된 URL)

확인 항목:
- [ ] 홈페이지 로딩
- [ ] `/salary` - 연봉 계산기 작동
- [ ] `/currency` - 환율 계산기 작동
- [ ] `/bmi` - BMI 계산기 작동
- [ ] `/sitemap.xml` - sitemap 생성 확인
- [ ] `/robots.txt` - robots.txt 확인

### 4. 커스텀 도메인 연결 (선택)

1. Vercel 프로젝트 → Settings → Domains
2. 도메인 추가: `ontools.com`
3. DNS 설정 (Vercel 가이드 따르기)
   - A 레코드: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`

### 5. Lighthouse 성능 테스트

배포 후 성능 확인:

```bash
# Chrome DevTools에서
1. 배포된 사이트 접속
2. F12 → Lighthouse 탭
3. "Analyze page load" 클릭
4. 성능 점수 확인 (목표: 90+)
```

최적화가 필요하면:
- 이미지 최적화 (Next.js Image 컴포넌트)
- 불필요한 JavaScript 제거
- CSS 최적화

## Phase 2 배포 (뉴스 시스템)

Phase 2부터는 환경변수 설정 필수:

1. **bkend.ai 프로젝트 생성**
   - console.bkend.ai 접속
   - 새 프로젝트 생성
   - Project ID 복사

2. **Vercel 환경변수 설정**
   - Settings → Environment Variables
   - `.env.example` 참고하여 값 입력

3. **재배포**
   - Deployments → Redeploy

## 트러블슈팅

### 빌드 실패 시

```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 확인 및 수정 후
git add .
git commit -m "Fix: 빌드 에러 수정"
git push
```

### 환경변수 미적용 시

- Vercel에서 환경변수 설정 후 **반드시 재배포** 필요
- Production, Preview, Development 모두 설정 확인

### 도메인 연결 안될 시

- DNS 전파 대기 (최대 48시간)
- `nslookup ontools.com` 으로 확인
- Vercel 대시보드에서 도메인 상태 확인

## 배포 완료 체크리스트

- [ ] GitHub 레포지토리 push 완료
- [ ] Vercel 프로젝트 생성 완료
- [ ] 빌드 성공 확인
- [ ] 모든 페이지 작동 확인
- [ ] sitemap.xml, robots.txt 확인
- [ ] Lighthouse 성능 90+ 확인
- [ ] (선택) 커스텀 도메인 연결

## Phase 1 완료!

축하합니다! Phase 1이 완료되었습니다. 🎉

다음 단계:
- **Phase 2**: bkend.ai + n8n 뉴스 시스템 구축
- **Phase 3**: Google AdSense 수익화
- **Phase 4**: 추가 도구 5개 구현
