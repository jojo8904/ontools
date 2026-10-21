export const ACTIVITIES = {
  sedentary: { label: '비활동', factor: 1.2, guide: '하루 대부분 앉아서 지내며 별도 운동이 거의 없는 생활' },
  light: { label: '가벼운 활동', factor: 1.375, guide: '앉아서 지내는 시간이 길고 가벼운 걷기·운동을 주 1~3회 하는 생활' },
  moderate: { label: '보통 활동', factor: 1.55, guide: '일상에서도 자주 움직이며 중간 강도 운동을 주 3~5회 하는 생활' },
  active: { label: '활발한 활동', factor: 1.725, guide: '신체 활동이 많은 일이나 강도 높은 운동을 거의 매일 하는 생활' },
  very_active: { label: '매우 활발한 활동', factor: 1.9, guide: '강한 육체노동과 훈련을 병행하거나 하루 두 차례 훈련하는 수준' },
} as const
export type ActivityLevel = keyof typeof ACTIVITIES
export type Gender = 'male' | 'female'
export function calculateCalorie(gender: Gender, age: number, height: number, weight: number, activity: ActivityLevel) {
  if (![age, height, weight].every(Number.isFinite) || !Number.isInteger(age) || age < 18 || age > 120 || height < 100 || height > 250 || weight < 25 || weight > 350 || !ACTIVITIES[activity] || !['male', 'female'].includes(gender)) throw new RangeError('나이 18~120세(정수), 키 100~250cm, 체중 25~350kg을 입력해주세요. 성인 참고용 입력 범위입니다.')
  const bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161)
  return { bmr: Math.round(bmr), tdee: Math.round(bmr * ACTIVITIES[activity].factor) }
}
