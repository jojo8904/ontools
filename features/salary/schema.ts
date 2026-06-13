import { z } from 'zod'

/**
 * 연봉 계산기 입력 검증 스키마
 * - 음수/과대값/비정상 입력을 계산 전에 차단
 */
export const salaryInputSchema = z.object({
  annualSalary: z
    .number({ invalid_type_error: '연봉을 숫자로 입력해주세요' })
    .min(0, '연봉은 0원 이상이어야 합니다')
    .max(100_000_000_000, '연봉 입력값이 너무 큽니다 (1,000억원 이하)'),
  dependents: z
    .number({ invalid_type_error: '부양가족 수를 숫자로 입력해주세요' })
    .int('부양가족 수는 정수로 입력해주세요')
    .min(0, '부양가족 수는 0명 이상이어야 합니다')
    .max(20, '부양가족 수가 너무 많습니다 (20명 이하)'),
  hasDisability: z.boolean(),
})

export type ValidatedSalaryInput = z.infer<typeof salaryInputSchema>
