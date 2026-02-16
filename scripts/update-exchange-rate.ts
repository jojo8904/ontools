#!/usr/bin/env tsx
/**
 * Exchange Rate Updater Script
 * Fetches exchange rates from Korea Eximbank API and saves to bkend.ai
 */

// Environment variables
const BKEND_API_URL = process.env.BKEND_API_URL || 'https://api-client.bkend.ai/v1'
const BKEND_PROJECT_ID = process.env.BKEND_PROJECT_ID!
const BKEND_ENV = process.env.BKEND_ENV || 'production'
const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY!

// Currency codes (Korea Eximbank API format)
const CURRENCIES = [
  { code: 'USD', name: '미국 달러' },
  { code: 'JPY(100)', name: '일본 엔화 (100엔 기준)' },
  { code: 'EUR', name: '유럽연합 유로' },
  { code: 'CNH', name: '중국 위안' },
]

// bkend.ai API client
async function bkendFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BKEND_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-project-id': BKEND_PROJECT_ID,
      'x-environment': BKEND_ENV,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`bkend.ai API error: ${res.status} ${errorText}`)
  }

  return res.json()
}

// Check if today is weekend
function isWeekend(): boolean {
  const day = new Date().getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

// Fetch exchange rate from Korea Eximbank API
async function fetchExchangeRate(currencyCode: string): Promise<number | null> {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${EXCHANGE_RATE_API_KEY}&searchdate=${today}&data=AP01`

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (!Array.isArray(data)) {
      console.error('Unexpected API response format:', data)
      return null
    }

    const rateData = data.find((item: any) => item.cur_unit === currencyCode)

    if (!rateData) {
      console.warn(`Currency ${currencyCode} not found in API response`)
      return null
    }

    // Parse rate (remove commas and convert to number)
    const rate = parseFloat(rateData.deal_bas_r.replace(/,/g, ''))
    return isNaN(rate) ? null : rate
  } catch (error) {
    console.error(`Error fetching ${currencyCode}:`, error)
    return null
  }
}

// Get latest rate from database (for weekend fallback)
async function getLatestRate(currencyCode: string): Promise<number | null> {
  try {
    const filter = JSON.stringify({
      currency_code: currencyCode.replace('(100)', ''),
      is_weekend: false
    })
    const sort = '-date'
    const limit = '1'

    const response = await bkendFetch(`/data/exchange_rates?filter=${encodeURIComponent(filter)}&sort=${sort}&limit=${limit}`)

    if (response.data && response.data.length > 0) {
      return response.data[0].rate
    }
  } catch (error) {
    console.error(`Error getting latest rate for ${currencyCode}:`, error)
  }

  return null
}

// Save exchange rate to bkend.ai
async function saveExchangeRate(data: {
  currency_code: string
  rate: number
  date: string
  is_weekend: boolean
}) {
  return bkendFetch('/data/exchange_rates', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Main updater function
async function updateExchangeRates() {
  const today = new Date().toISOString()
  const weekend = isWeekend()

  console.log('💱 Starting exchange rate updater...')
  console.log(`📅 Date: ${today.split('T')[0]}`)
  console.log(`🗓️  Weekend: ${weekend ? 'Yes' : 'No'}`)

  let totalUpdated = 0
  let totalErrors = 0

  for (const { code, name } of CURRENCIES) {
    console.log(`\n💵 Processing ${name} (${code})...`)

    try {
      let rate: number | null = null

      if (weekend) {
        // Weekend: Use latest weekday rate
        console.log('  📌 Weekend detected, using latest weekday rate')
        rate = await getLatestRate(code)

        if (!rate) {
          console.error(`  ❌ No latest rate found for ${code}`)
          totalErrors++
          continue
        }
      } else {
        // Weekday: Fetch from API
        rate = await fetchExchangeRate(code)

        if (!rate) {
          console.error(`  ❌ Failed to fetch rate for ${code}`)
          totalErrors++
          continue
        }
      }

      // Save to database
      await saveExchangeRate({
        currency_code: code.replace('(100)', ''), // Remove (100) for JPY
        rate,
        date: today,
        is_weekend: weekend,
      })

      console.log(`  ✅ Saved ${code}: ${rate.toLocaleString('ko-KR')} KRW`)
      totalUpdated++

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`  ❌ Error processing ${code}:`, error)
      totalErrors++
    }
  }

  console.log(`\n📊 Update Summary:`)
  console.log(`  Updated: ${totalUpdated}/${CURRENCIES.length}`)
  console.log(`  Errors: ${totalErrors}`)

  if (totalErrors > 0) {
    throw new Error(`Exchange rate update completed with ${totalErrors} errors`)
  }
}

// Run updater
updateExchangeRates().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
