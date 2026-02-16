import { News } from '@/types/news'

/**
 * Mock news data for Phase 2 development
 * TODO: Replace with bkend.ai API calls when ready
 */
export const MOCK_NEWS: News[] = [
  {
    _id: '1',
    title: '최저임금 2026년 1만 30원 확정',
    summary:
      '최저임금위원회가 2026년 적용 최저임금을 시간당 1만 30원으로 의결했다. 전년 대비 3.2% 인상된 금액이다.',
    original_content:
      '최저임금위원회가 2026년 적용 최저임금을 시간당 1만 30원으로 의결했다. 이는 전년(9,720원) 대비 310원(3.2%) 인상된 금액이다. 위원회는 물가상승률과 경제성장률을 고려하여 이번 인상률을 결정했다고 밝혔다.',
    source: '한국경제',
    published_at: new Date('2026-02-15T09:00:00Z'),
    categories: ['labor', 'finance'],
    related_tools: ['salary', 'retirement'],
    url: 'https://example.com/news/minimum-wage-2026',
    createdAt: new Date('2026-02-15T09:00:00Z'),
    updatedAt: new Date('2026-02-15T09:00:00Z'),
  },
  {
    _id: '2',
    title: '원-달러 환율 1,380원 마감... 2주 만에 최고',
    summary:
      '원-달러 환율이 1,380원대로 상승하며 2주 만에 최고치를 기록했다. 미국 연준의 긴축 기조가 지속될 것이라는 전망이 영향을 미쳤다.',
    original_content:
      '15일 서울 외환시장에서 원-달러 환율은 전 거래일 대비 15원 상승한 1,380원에 거래를 마쳤다. 이는 지난 2주간 가장 높은 수준이다. 시장 전문가들은 미국 연방준비제도의 고금리 기조 지속이 주요 원인이라고 분석했다.',
    source: '매일경제',
    published_at: new Date('2026-02-15T16:30:00Z'),
    categories: ['finance'],
    related_tools: ['currency', 'salary'],
    url: 'https://example.com/news/usd-krw-rate-1380',
    createdAt: new Date('2026-02-15T16:30:00Z'),
    updatedAt: new Date('2026-02-15T16:30:00Z'),
  },
  {
    _id: '3',
    title: 'Claude 4.5 출시... AI 요약 성능 대폭 향상',
    summary:
      'Anthropic이 Claude 4.5를 공식 출시했다. 뉴스 요약, 문서 분석 등에서 이전 버전 대비 30% 성능 향상을 보였다.',
    original_content:
      'Anthropic이 차세대 AI 모델 Claude 4.5를 출시했다. 특히 한국어 요약 품질이 크게 개선됐으며, 200자 내외 뉴스 요약에서 뛰어난 성능을 보인다. 이번 업데이트로 자동 뉴스 큐레이션 서비스의 품질 향상이 기대된다.',
    source: 'IT조선',
    published_at: new Date('2026-02-14T10:00:00Z'),
    categories: ['tech'],
    related_tools: [],
    url: 'https://example.com/news/claude-4-5-release',
    createdAt: new Date('2026-02-14T10:00:00Z'),
    updatedAt: new Date('2026-02-14T10:00:00Z'),
  },
  {
    _id: '4',
    title: "비만 기준 개정... BMI 23 이상 '과체중'",
    summary:
      '대한비만학회가 BMI 기준을 재검토하고 있다. 아시아인의 체형 특성을 반영한 새로운 기준이 논의 중이다.',
    original_content:
      '대한비만학회는 현재 BMI 23 이상을 과체중으로 분류하는 기준을 유지하기로 했다. 이는 WHO 국제 기준(25 이상)보다 엄격한 기준으로, 아시아인의 체형 특성과 건강 리스크를 고려한 결정이다.',
    source: '헬스조선',
    published_at: new Date('2026-02-13T14:00:00Z'),
    categories: ['health'],
    related_tools: ['bmi'],
    url: 'https://example.com/news/bmi-standard-review',
    createdAt: new Date('2026-02-13T14:00:00Z'),
    updatedAt: new Date('2026-02-13T14:00:00Z'),
  },
  {
    _id: '5',
    title: '전기요금 누진제 개편안 발표',
    summary:
      '정부가 전기요금 누진제 개편안을 발표했다. 4단계에서 3단계로 간소화하고 누진 폭을 완화한다.',
    original_content:
      '산업통상자원부는 전기요금 누진제를 4단계에서 3단계로 개편하는 방안을 발표했다. 월 300kWh 이하 구간의 요금 인상은 최소화하고, 고소비 구간의 누진율을 낮춰 가계 부담을 완화할 계획이다.',
    source: '에너지경제',
    published_at: new Date('2026-02-12T11:00:00Z'),
    categories: ['energy'],
    related_tools: ['electricity'],
    url: 'https://example.com/news/electricity-rate-reform',
    createdAt: new Date('2026-02-12T11:00:00Z'),
    updatedAt: new Date('2026-02-12T11:00:00Z'),
  },
  {
    _id: '6',
    title: '2026년 공휴일 총 16일... D-day 계산 필수',
    summary:
      '2026년 공휴일은 총 16일로 확정됐다. 대체공휴일 3일이 포함되어 있어 연휴 계획에 참고가 필요하다.',
    original_content:
      '정부는 2026년 공휴일을 총 16일로 확정했다. 설 연휴 3일, 추석 연휴 3일이 포함되며, 토요일과 겹치는 공휴일에 대해서는 대체공휴일이 적용된다. 장기 연휴 계획 시 D-day 계산기를 활용하면 편리하다.',
    source: '연합뉴스',
    published_at: new Date('2026-02-11T09:00:00Z'),
    categories: ['general'],
    related_tools: ['dday'],
    url: 'https://example.com/news/2026-holidays',
    createdAt: new Date('2026-02-11T09:00:00Z'),
    updatedAt: new Date('2026-02-11T09:00:00Z'),
  },
]

/**
 * Get mock news by category
 */
export function getMockNewsByCategory(category: string): News[] {
  return MOCK_NEWS.filter((news) => news.categories.includes(category as any))
}

/**
 * Get mock news by related tool
 */
export function getMockNewsByTool(toolId: string): News[] {
  return MOCK_NEWS.filter((news) => news.related_tools.includes(toolId as any))
}

/**
 * Get latest mock news
 */
export function getLatestMockNews(limit: number = 6): News[] {
  return MOCK_NEWS.slice(0, limit)
}
