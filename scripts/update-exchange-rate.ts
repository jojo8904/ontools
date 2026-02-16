#!/usr/bin/env tsx
/**
 * Exchange Rate Updater Script
 * Fetches exchange rates from Korea Eximbank API and saves to Supabase
 */

// Disable SSL verification for Korea Eximbank API (self-signed certificate)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { createClient } from '@supabase/supabase-js'

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY!

// Supabase client (service_role for server-side writes)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Currency codes (Korea Eximbank API format)
const CURRENCIES = [
  { code: 'USD', name: '미국 달러' },
  { code: 'JPY(100)', name: '일본 엔화 (100엔 기준)' },
  { code: 'EUR', name: '유럽연합 유로' },
  { code: 'CNH', name: '중국 위안' },
]

// Check if today is weekend
function isWeekend(): boolean {
  const day = new Date().getDay()
  return day === 0 || day === 6
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

    const rate = parseFloat(rateData.deal_bas_r.replace(/,/g, ''))
    return isNaN(rate) ? null : rate
  } catch (error) {
    console.error(`Error fetching ${currencyCode}:`, error)
    return null
  }
}

// Get latest rate from database (for weekend fallback)
async function getLatestRate(currencyCode: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('rate')
    .eq('currency_code', currencyCode.replace('(100)', ''))
    .eq('is_weekend', false)
    .order('date', { ascending: false })
    .limit(1)

  if (error) {
    console.error(`Error getting latest rate for ${currencyCode}:`, error.message)
    return null
  }

  return data?.[0]?.rate ?? null
}

// Save exchange rate to Supabase
async function saveExchangeRate(record: {
  currency_code: string
  rate: number
  date: string
  is_weekend: boolean
}) {
  const { error } = await supabase.from('exchange_rates').insert(record)
  if (error) throw new Error(`Supabase insert error: ${error.message}`)
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
        console.log('  📌 Weekend detected, using latest weekday rate')
        rate = await getLatestRate(code)

        if (!rate) {
          console.error(`  ❌ No latest rate found for ${code}`)
          totalErrors++
          continue
        }
      } else {
        rate = await fetchExchangeRate(code)

        if (!rate) {
          console.error(`  ❌ Failed to fetch rate for ${code}`)
          totalErrors++
          continue
        }
      }

      await saveExchangeRate({
        currency_code: code.replace('(100)', ''),
        rate,
        date: today,
        is_weekend: weekend,
      })

      console.log(`  ✅ Saved ${code}: ${rate.toLocaleString('ko-KR')} KRW`)
      totalUpdated++

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
