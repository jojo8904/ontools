import { BmiInput, BmiResult, BmiCategory } from '@/types/tools'

/**
 * BMI 계산 및 분류
 *
 * BMI = 체중(kg) / (신장(m))²
 *
 * 한국 기준 (대한비만학회):
 * - 저체중: BMI < 18.5
 * - 정상: 18.5 ≤ BMI < 23
 * - 과체중: 23 ≤ BMI < 25
 * - 비만: 25 ≤ BMI < 30
 * - 고도비만: BMI ≥ 30
 *
 * WHO 국제 기준:
 * - 저체중: BMI < 18.5
 * - 정상: 18.5 ≤ BMI < 25
 * - 과체중: 25 ≤ BMI < 30
 * - 비만: 30 ≤ BMI < 35
 * - 고도비만: BMI ≥ 35
 */
export function calculateBmi(input: BmiInput): BmiResult {
  const { height, weight } = input

  // 신장을 미터로 변환
  const heightInMeters = height / 100

  // BMI 계산
  const bmi = weight / (heightInMeters * heightInMeters)

  // 소수점 1자리까지 반올림
  const roundedBmi = Math.round(bmi * 10) / 10

  // BMI 분류 (한국 기준)
  const category = getBmiCategoryKorea(roundedBmi)
  const categoryLabel = getCategoryLabel(category)

  // BMI 분류 (WHO 국제 기준)
  const categoryWho = getBmiCategoryWho(roundedBmi)
  const categoryWhoLabel = getCategoryLabel(categoryWho)

  const healthStatus = getHealthStatus(category)
  const recommendation = getRecommendation(category)

  return {
    height,
    weight,
    bmi: roundedBmi,
    category,
    categoryLabel,
    categoryWho,
    categoryWhoLabel,
    healthStatus,
    recommendation,
  }
}

/**
 * BMI 값에 따른 카테고리 분류 (한국 기준 - 대한비만학회)
 */
export function getBmiCategoryKorea(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'underweight'
  if (bmi < 23) return 'normal'
  if (bmi < 25) return 'overweight'
  if (bmi < 30) return 'obese'
  return 'severe_obese'
}

/**
 * BMI 값에 따른 카테고리 분류 (WHO 국제 기준)
 */
export function getBmiCategoryWho(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25) return 'normal'
  if (bmi < 30) return 'overweight'
  if (bmi < 35) return 'obese'
  return 'severe_obese'
}

/**
 * 하위 호환성을 위한 별칭 (한국 기준 사용)
 */
export const getBmiCategory = getBmiCategoryKorea

/**
 * 카테고리별 한국어 라벨
 */
export function getCategoryLabel(category: BmiCategory): string {
  const labels: Record<BmiCategory, string> = {
    underweight: '저체중',
    normal: '정상',
    overweight: '과체중',
    obese: '비만',
    severe_obese: '고도비만',
  }
  return labels[category]
}

/**
 * 카테고리별 건강 상태 설명
 */
export function getHealthStatus(category: BmiCategory): string {
  const status: Record<BmiCategory, string> = {
    underweight:
      '현재 체중이 정상 범위보다 낮습니다. 영양 섭취에 신경 써야 합니다.',
    normal: '현재 체중이 정상 범위입니다. 건강한 체중을 유지하고 계십니다.',
    overweight:
      '현재 체중이 정상 범위보다 약간 높습니다. 체중 관리가 필요합니다.',
    obese:
      '비만 단계입니다. 건강을 위해 체중 감량이 필요합니다. 전문가 상담을 권장합니다.',
    severe_obese:
      '고도비만 단계입니다. 건강에 심각한 위험이 있을 수 있습니다. 반드시 전문가와 상담하세요.',
  }
  return status[category]
}

/**
 * 카테고리별 권장사항
 */
export function getRecommendation(category: BmiCategory): string {
  const recommendations: Record<BmiCategory, string> = {
    underweight:
      '균형 잡힌 식사와 적절한 운동으로 건강한 체중을 늘리는 것을 권장합니다.',
    normal:
      '현재 상태를 유지하기 위해 규칙적인 운동과 균형 잡힌 식사를 계속하세요.',
    overweight:
      '유산소 운동을 주 3-5회, 30분 이상 실시하고 식이조절을 병행하세요.',
    obese:
      '전문가와 상담하여 체계적인 체중 감량 계획을 수립하는 것이 좋습니다. 유산소 운동과 근력 운동을 병행하세요.',
    severe_obese:
      '의료진의 도움을 받아 체중 감량 프로그램을 시작하세요. 급격한 다이어트보다는 장기적인 생활습관 개선이 중요합니다.',
  }
  return recommendations[category]
}

/**
 * 표준 체중 계산 (Broca 공식 변형)
 */
export function getIdealWeight(height: number): {
  min: number
  max: number
} {
  // 신장을 미터로 변환
  const heightInMeters = height / 100

  // 정상 BMI 범위 (18.5 ~ 23)
  const minWeight = 18.5 * heightInMeters * heightInMeters
  const maxWeight = 23 * heightInMeters * heightInMeters

  return {
    min: Math.round(minWeight * 10) / 10,
    max: Math.round(maxWeight * 10) / 10,
  }
}

/**
 * 카테고리별 색상 (Tailwind CSS)
 */
export function getCategoryColor(category: BmiCategory): string {
  const colors: Record<BmiCategory, string> = {
    underweight: 'text-blue-600',
    normal: 'text-green-600',
    overweight: 'text-yellow-600',
    obese: 'text-orange-600',
    severe_obese: 'text-red-600',
  }
  return colors[category]
}

/**
 * 카테고리별 배경색 (Tailwind CSS)
 */
export function getCategoryBgColor(category: BmiCategory): string {
  const colors: Record<BmiCategory, string> = {
    underweight: 'bg-blue-50',
    normal: 'bg-green-50',
    overweight: 'bg-yellow-50',
    obese: 'bg-orange-50',
    severe_obese: 'bg-red-50',
  }
  return colors[category]
}
