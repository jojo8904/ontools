import { describe, it, expect } from 'vitest'
import {
  calculateBmi,
  getBmiCategory,
  getCategoryLabel,
  getIdealWeight,
} from './utils'
import { BmiInput } from '@/types/tools'

describe('calculateBmi', () => {
  it('should calculate BMI correctly for normal weight', () => {
    const input: BmiInput = {
      height: 170, // 170cm
      weight: 70, // 70kg
    }

    const result = calculateBmi(input)

    // BMI = 70 / (1.7)² = 24.2
    expect(result.bmi).toBeCloseTo(24.2, 1)
    expect(result.category).toBe('overweight')
    expect(result.categoryLabel).toBe('과체중')
  })

  it('should classify underweight correctly', () => {
    const input: BmiInput = {
      height: 170,
      weight: 50,
    }

    const result = calculateBmi(input)

    // BMI = 50 / (1.7)² = 17.3
    expect(result.bmi).toBeLessThan(18.5)
    expect(result.category).toBe('underweight')
    expect(result.categoryLabel).toBe('저체중')
  })

  it('should classify normal weight correctly', () => {
    const input: BmiInput = {
      height: 170,
      weight: 60,
    }

    const result = calculateBmi(input)

    // BMI = 60 / (1.7)² = 20.8
    expect(result.bmi).toBeGreaterThanOrEqual(18.5)
    expect(result.bmi).toBeLessThan(23)
    expect(result.category).toBe('normal')
    expect(result.categoryLabel).toBe('정상')
  })

  it('should classify obesity correctly', () => {
    const input: BmiInput = {
      height: 170,
      weight: 85,
    }

    const result = calculateBmi(input)

    // BMI = 85 / (1.7)² = 29.4
    expect(result.category).toBe('obese')
    expect(result.categoryLabel).toBe('비만')
  })

  it('should classify severe obesity correctly', () => {
    const input: BmiInput = {
      height: 170,
      weight: 95,
    }

    const result = calculateBmi(input)

    // BMI = 95 / (1.7)² = 32.9
    expect(result.bmi).toBeGreaterThanOrEqual(30)
    expect(result.category).toBe('severe_obese')
    expect(result.categoryLabel).toBe('고도비만')
  })

  it('should include health status and recommendation', () => {
    const input: BmiInput = {
      height: 170,
      weight: 70,
    }

    const result = calculateBmi(input)

    expect(result.healthStatus).toBeTruthy()
    expect(result.healthStatus.length).toBeGreaterThan(0)
    expect(result.recommendation).toBeTruthy()
    expect(result.recommendation.length).toBeGreaterThan(0)
  })

  it('should include both Korea and WHO classifications', () => {
    const input: BmiInput = {
      height: 170,
      weight: 70, // BMI = 24.2
    }

    const result = calculateBmi(input)

    // 한국 기준: 과체중 (23 ≤ BMI < 25)
    expect(result.category).toBe('overweight')
    expect(result.categoryLabel).toBe('과체중')

    // WHO 기준: 정상 (18.5 ≤ BMI < 25)
    expect(result.categoryWho).toBe('normal')
    expect(result.categoryWhoLabel).toBe('정상')
  })
})

describe('getBmiCategory', () => {
  it('should return correct categories', () => {
    expect(getBmiCategory(17)).toBe('underweight')
    expect(getBmiCategory(20)).toBe('normal')
    expect(getBmiCategory(24)).toBe('overweight')
    expect(getBmiCategory(27)).toBe('obese')
    expect(getBmiCategory(32)).toBe('severe_obese')
  })

  it('should handle boundary values correctly', () => {
    expect(getBmiCategory(18.5)).toBe('normal')
    expect(getBmiCategory(23)).toBe('overweight')
    expect(getBmiCategory(25)).toBe('obese')
    expect(getBmiCategory(30)).toBe('severe_obese')
  })
})

describe('getCategoryLabel', () => {
  it('should return correct Korean labels', () => {
    expect(getCategoryLabel('underweight')).toBe('저체중')
    expect(getCategoryLabel('normal')).toBe('정상')
    expect(getCategoryLabel('overweight')).toBe('과체중')
    expect(getCategoryLabel('obese')).toBe('비만')
    expect(getCategoryLabel('severe_obese')).toBe('고도비만')
  })
})

describe('getIdealWeight', () => {
  it('should calculate ideal weight range for 170cm', () => {
    const result = getIdealWeight(170)

    // 170cm (1.7m)의 정상 체중 범위
    // Min: 18.5 * (1.7)² = 53.5kg
    // Max: 23 * (1.7)² = 66.5kg
    expect(result.min).toBeCloseTo(53.5, 1)
    expect(result.max).toBeCloseTo(66.5, 1)
  })

  it('should calculate ideal weight range for 180cm', () => {
    const result = getIdealWeight(180)

    // 180cm (1.8m)의 정상 체중 범위
    // Min: 18.5 * (1.8)² = 59.9kg
    // Max: 23 * (1.8)² = 74.5kg
    expect(result.min).toBeCloseTo(59.9, 1)
    expect(result.max).toBeCloseTo(74.5, 1)
  })
})
