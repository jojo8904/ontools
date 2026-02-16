import { bkend } from '@/lib/bkend'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const testNews = {
      title: '최저임금 2026년 1만 30원 확정',
      summary: '최저임금위원회가 2026년 적용 최저임금을 시간당 1만 30원으로 의결했다',
      original_content:
        '최저임금위원회가 2026년 적용 최저임금을 시간당 1만 30원으로 의결했다. 이는 전년(9,720원) 대비 310원(3.2%) 인상된 금액이다. 위원회는 물가상승률과 경제성장률을 고려하여 이번 인상률을 결정했다고 밝혔다.',
      source: '한국경제',
      published_at: new Date('2026-02-15T09:00:00Z').toISOString(),
      categories: ['labor', 'finance'],
      related_tools: ['salary', 'retirement'],
      url: 'https://example.com/news/minimum-wage-2026',
    }

    const result = await bkend.data.create('news', testNews)

    return NextResponse.json({
      success: true,
      message: '테스트 뉴스가 성공적으로 추가되었습니다',
      data: result,
    })
  } catch (error) {
    console.error('Failed to seed test news:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST 요청을 사용하여 테스트 데이터를 추가하세요',
    usage: 'POST http://localhost:3000/api/seed-test-news',
  })
}
