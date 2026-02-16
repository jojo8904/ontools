import { NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_BKEND_API_URL || 'https://api.bkend.ai/v1'
const PROJECT_ID = process.env.NEXT_PUBLIC_BKEND_PROJECT_ID!
const ENVIRONMENT = process.env.NEXT_PUBLIC_BKEND_ENV || 'dev'

export async function GET() {
  try {
    // Test 1: Check environment variables
    const envCheck = {
      API_BASE,
      PROJECT_ID,
      ENVIRONMENT,
      hasProjectId: !!PROJECT_ID,
    }

    // Test 2: Try to list tables (or any basic endpoint)
    const res = await fetch(`${API_BASE}/projects/${PROJECT_ID}/tables`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-project-id': PROJECT_ID,
        'x-environment': ENVIRONMENT,
      },
    })

    const responseText = await res.text()
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = responseText
    }

    return NextResponse.json({
      envCheck,
      apiResponse: {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: responseData,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
