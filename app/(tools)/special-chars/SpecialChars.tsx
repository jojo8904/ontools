'use client'

import { useState } from 'react'

const GROUPS: { name: string; chars: string[] }[] = [
  { name: '별·장식', chars: [...'★☆✦✧✩✪✫✬✭✮✯✰⁂❉❋❀❁❃❈✿'] },
  { name: '하트', chars: [...'♥♡❤🧡💛💚💙💜🤍🖤💕💖💗💘❣'] },
  { name: '도형', chars: [...'●○◎◉■□▣▤▥◆◇◈▲△▼▽◀◁▶▷'] },
  { name: '화살표', chars: [...'→←↑↓↔↕⇒⇐⇑⇓⇔↗↘↖↙➜➤➔⏎'] },
  { name: '체크·기호', chars: [...'✓✔✗✘✕✖☑☒✚＋－＝※¶§†‡＠＃'] },
  { name: '수학', chars: [...'±×÷√∞≠≒≈≤≥∴∵∑∏∫°′″％‰'] },
  { name: '원문자·숫자', chars: [...'①②③④⑤⑥⑦⑧⑨⑩ⓐⓑⓒⓓⓔ⑴⑵⑶¹²³½⅓¼'] },
  { name: '괄호·인용', chars: [...'「」『』《》〈〉【】〔〕（）｛｝""' + "''‥…—―"] },
  { name: '통화·단위', chars: [...'₩＄€￥£￠℃℉㎜㎝ｍ㎞㎡㎏ℓ®©™'] },
  { name: '날씨·음악·기타', chars: [...'☀☁☂☔☃❄☾☽☺☹☎☏♪♫♬♩⚑⚐'] },
]

export function SpecialChars() {
  const [copied, setCopied] = useState<string | null>(null)
  const [recent, setRecent] = useState<string[]>([])

  const copy = async (ch: string) => {
    try {
      await navigator.clipboard.writeText(ch)
      setCopied(ch)
      setRecent((prev) => [ch, ...prev.filter((c) => c !== ch)].slice(0, 12))
      setTimeout(() => setCopied((c) => (c === ch ? null : c)), 1000)
    } catch {
      /* clipboard 미지원 무시 */
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        문자를 <strong>클릭하면 바로 복사</strong>돼요. 붙여넣기(Ctrl+V)로 어디서든 사용하세요.
      </p>

      {recent.length > 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <span className="mb-2 block text-xs font-medium text-gray-500">최근 복사</span>
          <div className="flex flex-wrap gap-1.5">
            {recent.map((ch) => (
              <button
                key={ch}
                onClick={() => copy(ch)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg shadow-sm ring-1 ring-blue-100 hover:bg-blue-100"
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      )}

      {GROUPS.map((g) => (
        <div key={g.name}>
          <h2 className="mb-2 text-sm font-bold text-gray-700">{g.name}</h2>
          <div className="flex flex-wrap gap-1.5">
            {g.chars.map((ch) => (
              <button
                key={ch}
                onClick={() => copy(ch)}
                title="클릭하여 복사"
                className={`flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition-colors ${
                  copied === ch
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {copied === ch ? '✓' : ch}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
