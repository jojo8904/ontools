// Reviewed 2026-09-18. Periods are explicit so a new year cannot silently reuse old rates.
export const KOREA_POLICY = {
  year: 2026,
  defaultDate: '2026-07-01',
  reviewedAt: '2026-09-18',
  minimumWage: 10_320,
  unemploymentDailyUpper: 68_100,
  unemploymentDailyLower: 66_048,
  pensionEmployeeRate: 0.0475,
  healthEmployeeRate: 0.03595,
  healthEmployeeMin: 10_080,
  healthEmployeeMax: 4_591_740,
  careToHealthRatio: 0.9448 / 7.19,
  employmentEmployeeRate: 0.009,
  periods: [
    { from: '2026-01-01', until: '2026-07-01', pensionMin: 400_000, pensionMax: 6_370_000, label: '2026년 1~6월' },
    { from: '2026-07-01', until: '2027-01-01', pensionMin: 410_000, pensionMax: 6_590_000, label: '2026년 7~12월' },
  ],
  sources: {
    pension: 'https://www.nps.or.kr/eng/ntnlpnsplan/cntb/getOHAI0013M0.do',
    health: 'https://edi.nhis.or.kr/portal/images/popup/20251204_pop01longdesc.html',
    healthLimits: 'https://www.nhis.or.kr/lm/lmxsrv/law/lawFullContent.do?SEQ=39',
    minimumWage: 'https://www.moel.go.kr/mainpop2.do',
    unemployment: 'https://www.work.go.kr/buyeo/ctrIntro/ctrWork/ctrWorkDetail.do?menuCd=40207',
    incomeTax: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7873&mi=6594',
  },
} as const

export function getPolicyPeriod(date: string = KOREA_POLICY.defaultDate) {
  const timestamp = Date.parse(`${date}T00:00:00Z`)
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== date) throw new RangeError('올바른 날짜를 입력해주세요.')
  const period = KOREA_POLICY.periods.find((p) => date >= p.from && date < p.until)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !period) throw new RangeError('지원하지 않는 적용일입니다.')
  return period
}

export function calculateEmployeeInsurance(monthlySalary: number, date: string = KOREA_POLICY.defaultDate) {
  if (!Number.isFinite(monthlySalary) || monthlySalary < 0) throw new RangeError('급여는 0 이상의 유한한 숫자여야 합니다.')
  const period = getPolicyPeriod(date)
  const pensionBase = monthlySalary === 0 ? 0 : Math.min(period.pensionMax, Math.max(period.pensionMin, Math.floor(monthlySalary / 1000) * 1000))
  // Multiply integer rate numerators first to avoid truncating 27000 to 26990.
  const nationalPension = Math.floor(pensionBase * Math.round(KOREA_POLICY.pensionEmployeeRate * 10_000) / 10_000)
  const healthAmount = Math.floor(monthlySalary * Math.round(KOREA_POLICY.healthEmployeeRate * 100_000) / 1_000_000) * 10
  const healthInsurance = monthlySalary === 0 ? 0 : Math.max(KOREA_POLICY.healthEmployeeMin, Math.min(KOREA_POLICY.healthEmployeeMax, healthAmount))
  const longTermCare = Math.floor(healthInsurance * KOREA_POLICY.careToHealthRatio / 10) * 10
  const employmentInsurance = Math.floor(monthlySalary * Math.round(KOREA_POLICY.employmentEmployeeRate * 1000) / 10_000) * 10
  return { nationalPension, healthInsurance, longTermCare, employmentInsurance }
}
