# Phase 2: Testing Guide - News System

> **Feature**: News Feed UI with bkend.ai Integration
> **Date**: 2026-02-15

---

## 1. Quick Start

### Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 2. Test Data Setup

Since the news table is empty, you need to add test data to see the news feed in action.

### Option 1: Using bkend.ai Console (Manual)

1. Visit https://console.bkend.ai
2. Select **ontools** project
3. Go to **Tables** → **news**
4. Click **"Insert Row"** or **"Add Data"**
5. Insert the following test data:

**Test News Item 1**:
```json
{
  "title": "최저임금 2026년 1만 30원 확정",
  "summary": "최저임금위원회가 2026년 적용 최저임금을 시간당 1만 30원으로 의결했다. 전년 대비 3.2% 인상된 금액이다.",
  "original_content": "최저임금위원회가 2026년 적용 최저임금을 시간당 1만 30원으로 의결했다. 이는 전년(9,720원) 대비 310원(3.2%) 인상된 금액이다.",
  "source": "한국경제",
  "published_at": "2026-02-15T09:00:00Z",
  "categories": ["labor", "finance"],
  "related_tools": ["salary", "retirement"],
  "url": "https://example.com/news/minimum-wage-2026"
}
```

**Test News Item 2**:
```json
{
  "title": "원-달러 환율 1,380원 마감... 2주 만에 최고",
  "summary": "원-달러 환율이 1,380원대로 상승하며 2주 만에 최고치를 기록했다. 미국 연준의 긴축 기조가 지속될 것이라는 전망이 영향을 미쳤다.",
  "original_content": "15일 서울 외환시장에서 원-달러 환율은 전 거래일 대비 15원 상승한 1,380원에 거래를 마쳤다.",
  "source": "매일경제",
  "published_at": "2026-02-15T16:30:00Z",
  "categories": ["finance"],
  "related_tools": ["currency", "salary"],
  "url": "https://example.com/news/usd-krw-rate-1380"
}
```

**Test News Item 3**:
```json
{
  "title": "Claude 4.5 출시... AI 요약 성능 대폭 향상",
  "summary": "Anthropic이 Claude 4.5를 공식 출시했다. 뉴스 요약, 문서 분석 등에서 이전 버전 대비 30% 성능 향상을 보였다.",
  "original_content": "Anthropic이 차세대 AI 모델 Claude 4.5를 출시했다. 특히 한국어 요약 품질이 크게 개선됐다.",
  "source": "IT조선",
  "published_at": "2026-02-14T10:00:00Z",
  "categories": ["tech"],
  "related_tools": [],
  "url": "https://example.com/news/claude-4-5-release"
}
```

**Test News Item 4**:
```json
{
  "title": "비만 기준 개정... BMI 23 이상 '과체중'",
  "summary": "대한비만학회가 BMI 기준을 재검토하고 있다. 아시아인의 체형 특성을 반영한 새로운 기준이 논의 중이다.",
  "original_content": "대한비만학회는 현재 BMI 23 이상을 과체중으로 분류하는 기준을 유지하기로 했다.",
  "source": "헬스조선",
  "published_at": "2026-02-13T14:00:00Z",
  "categories": ["health"],
  "related_tools": ["bmi"],
  "url": "https://example.com/news/bmi-standard-review"
}
```

**Test News Item 5**:
```json
{
  "title": "전기요금 누진제 개편안 발표",
  "summary": "정부가 전기요금 누진제 개편안을 발표했다. 4단계에서 3단계로 간소화하고 누진 폭을 완화한다.",
  "original_content": "산업통상자원부는 전기요금 누진제를 4단계에서 3단계로 개편하는 방안을 발표했다.",
  "source": "에너지경제",
  "published_at": "2026-02-12T11:00:00Z",
  "categories": ["energy"],
  "related_tools": ["electricity"],
  "url": "https://example.com/news/electricity-rate-reform"
}
```

**Test News Item 6**:
```json
{
  "title": "2026년 공휴일 총 16일... D-day 계산 필수",
  "summary": "2026년 공휴일은 총 16일로 확정됐다. 대체공휴일 3일이 포함되어 있어 연휴 계획에 참고가 필요하다.",
  "original_content": "정부는 2026년 공휴일을 총 16일로 확정했다. 설 연휴 3일, 추석 연휴 3일이 포함된다.",
  "source": "연합뉴스",
  "published_at": "2026-02-11T09:00:00Z",
  "categories": ["general"],
  "related_tools": ["dday"],
  "url": "https://example.com/news/2026-holidays"
}
```

### Option 2: Using API Route (Programmatic)

Create a temporary API route to seed test data:

```typescript
// app/api/seed-news/route.ts (temporary)
import { bkend } from '@/lib/bkend'

const testNews = [
  {
    title: "최저임금 2026년 1만 30원 확정",
    summary: "최저임금위원회가 2026년 적용 최저임금을 시간당 1만 30원으로 의결했다.",
    original_content: "...",
    source: "한국경제",
    published_at: new Date("2026-02-15T09:00:00Z").toISOString(),
    categories: ["labor", "finance"],
    related_tools: ["salary", "retirement"],
    url: "https://example.com/news/minimum-wage-2026"
  },
  // ... more items
]

export async function POST() {
  try {
    const results = await Promise.all(
      testNews.map(news => bkend.data.create('news', news))
    )
    return Response.json({ success: true, count: results.length })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

Then visit: `http://localhost:3000/api/seed-news` (POST request)

---

## 3. What to Check

### Homepage (/)

✅ **News Section**:
- [ ] "📰 최신 뉴스" 제목 표시
- [ ] 6개 뉴스 카드 표시 (3열 그리드)
- [ ] 각 카드에 카테고리 태그 표시
- [ ] 각 카드에 제목, 요약, 출처, 시간 표시
- [ ] 로딩 상태 (스켈레톤) 표시
- [ ] 에러 상태 메시지 표시 (데이터 없을 때)

✅ **Tool Categories**:
- [ ] 금융 카테고리 클릭 → `/salary` 이동
- [ ] 건강 카테고리 클릭 → `/bmi` 이동

✅ **Responsiveness**:
- [ ] 모바일: 1열 그리드
- [ ] 태블릿: 2열 그리드
- [ ] 데스크톱: 3열 그리드

### News Card

✅ **Display**:
- [ ] 카테고리 태그 색상 코딩 (tech=파랑, finance=초록, labor=보라, health=빨강)
- [ ] 제목 2줄 말줄임 (line-clamp-2)
- [ ] 요약 3줄 말줄임 (line-clamp-3)
- [ ] 상대 시간 표시 (예: "2시간 전", "1일 전")
- [ ] 호버 시 그림자 효과

✅ **Interaction**:
- [ ] 제목 클릭 → 원문 URL 새 탭 열기
- [ ] 호버 시 제목 파란색 변경

### API Integration

✅ **bkend.ai Connection**:
- [ ] 브라우저 콘솔에 네트워크 오류 없음
- [ ] `/v1/data/news` API 호출 성공 (Network 탭)
- [ ] 응답 데이터 형식 올바름

✅ **React Query**:
- [ ] 초기 로딩 시 스켈레톤 표시
- [ ] 5분 후 자동 리페칭 안 함 (staleTime 설정)
- [ ] 탭 전환 시 리페칭 안 함 (refetchOnWindowFocus: false)

---

## 4. Troubleshooting

### Issue: "뉴스를 불러오는데 실패했습니다"

**Possible Causes**:
1. bkend.ai project ID 오류
2. news 테이블이 생성되지 않음
3. CORS 설정 오류

**Solutions**:
```bash
# 1. Check environment variables
cat .env.local
# Verify: NEXT_PUBLIC_BKEND_PROJECT_ID=q70vosz84ihkg1s8g6rl

# 2. Check browser console
# Look for 401 Unauthorized or CORS errors

# 3. Register domain in bkend.ai console
# Add http://localhost:3000 to allowed origins
```

### Issue: "표시할 뉴스가 없습니다"

**Solution**: Add test data using Option 1 or Option 2 above.

### Issue: Network timeout or slow loading

**Solutions**:
1. Check internet connection
2. Verify bkend.ai API status
3. Increase React Query timeout:
   ```typescript
   // app/providers.tsx
   staleTime: 5 * 60 * 1000, // Increase to 5 minutes
   ```

### Issue: "Categories not showing colors"

**Check**: Make sure category values match exactly:
- ✅ `"finance"` → Green
- ❌ `"Finance"` → Gray (case-sensitive)

---

## 5. Performance Testing

### Lighthouse Score

```bash
# Build for production
npm run build
npm start

# Open Chrome DevTools → Lighthouse
# Target: http://localhost:3000
# Category: Performance, Accessibility, Best Practices, SEO
```

**Target Scores**:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### Load Time

- Initial page load: < 2 seconds
- News fetch: < 500ms
- News render: < 100ms

---

## 6. Next Steps

After verifying news UI works:

1. ✅ Phase 2.1: News UI (Current)
2. ⏭️ Phase 2.2: n8n Workflows (RSS crawling + Claude API)
3. ⏭️ Phase 2.3: ExchangeRate table + Currency tool integration
4. ⏭️ Phase 2.4: Tool-specific news sections

---

## 7. Clean Up Test Route

After testing, delete the temporary seed route:

```bash
rm app/api/seed-news/route.ts
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-15 | Initial Phase 2 testing guide |
