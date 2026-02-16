#!/usr/bin/env tsx
/**
 * Exchange Rate Updater Script
 * Fetches exchange rates from open.er-api.com and saves to Supabase
 */

import { createClient } from '@supabase/supabase-js'

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Supabase client (service_role for server-side writes)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Currency codes to fetch (er-api uses ISO codes, KRW base)
const CURRENCIES = [
  { code: 'USD', erApiCode: 'USD', name: '미국 달러', multiply: 1 },
  { code: 'JPY', erApiCode: 'JPY', name: '일본 엔화 (100엔 기준)', multiply: 100 },
  { code: 'EUR', erApiCode: 'EUR', name: '유럽연합 유로', multiply: 1 },
  { code: 'CNY', erApiCode: 'CNY', name: '중국 위안', multiply: 1 },
]

// Fetch all exchange rates from open.er-api.com (KRW base)
async function fetchAllRates(): Promise<Record<string, number> | null> {
  const url = 'https://open.er-api.com/v6/latest/KRW'

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (data.result !== 'success') {
      console.error('API returned error:', data)
      return null
    }

    return data.rates
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    return null
  }
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
  const day = new Date().getDay()
  const weekend = day === 0 || day === 6

  console.log('💱 Starting exchange rate updater...')
  console.log(`📅 Date: ${today.split('T')[0]}`)
  console.log(`🗓️  Weekend: ${weekend ? 'Yes' : 'No'}`)

  // Fetch all rates in one call
  const rates = await fetchAllRates()

  if (!rates) {
    throw new Error('Failed to fetch exchange rates from API')
  }

  let totalUpdated = 0
  let totalErrors = 0

  for (const { code, erApiCode, name, multiply } of CURRENCIES) {
    console.log(`\n💵 Processing ${name} (${code})...`)

    try {
      const foreignPerKrw = rates[erApiCode]

      if (!foreignPerKrw || foreignPerKrw === 0) {
        console.error(`  ❌ Rate not found for ${erApiCode}`)
        totalErrors++
        continue
      }

      // 1 KRW = foreignPerKrw foreign currency → 1 foreign currency = 1/foreignPerKrw KRW
      const krwPerUnit = (1 / foreignPerKrw) * multiply
      const rate = Math.round(krwPerUnit * 100) / 100

      await saveExchangeRate({
        currency_code: code,
        rate,
        date: today,
        is_weekend: weekend,
      })

      console.log(`  ✅ Saved ${code}: ${rate.toLocaleString('ko-KR')} KRW`)
      totalUpdated++
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
