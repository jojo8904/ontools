import { KOREA_POLICY } from '@/lib/korea-policy'

export function PolicySources() {
  return (
    <p className="mt-4 text-xs leading-relaxed text-gray-500">
      기준 확인: {KOREA_POLICY.reviewedAt} · 근로자 부담 추정치 · 소득세는 연간 세액을 월로 나눈 예상액입니다.
      {' '}<a className="underline" href={KOREA_POLICY.sources.pension} target="_blank" rel="noopener noreferrer">국민연금공단</a>
      {' / '}<a className="underline" href={KOREA_POLICY.sources.health} target="_blank" rel="noopener noreferrer">건강보험공단</a>
      {' / '}<a className="underline" href={KOREA_POLICY.sources.healthLimits} target="_blank" rel="noopener noreferrer">건강보험 상·하한</a>
      {' / '}<a className="underline" href={KOREA_POLICY.sources.incomeTax} target="_blank" rel="noopener noreferrer">국세청</a>
    </p>
  )
}
