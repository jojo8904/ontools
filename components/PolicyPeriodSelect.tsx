import { KOREA_POLICY } from '@/lib/korea-policy'

export function PolicyPeriodSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium">
      적용 기간
      <select className="mt-2 w-full rounded-md border bg-white p-2 text-gray-900" value={value} onChange={(e) => onChange(e.target.value)}>
        {KOREA_POLICY.periods.map((period) => <option key={period.from} value={period.from}>{period.label}</option>)}
      </select>
    </label>
  )
}
