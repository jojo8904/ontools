'use client'

import { useState, useMemo } from 'react'

const ENG_TO_JAMO: Record<string, string> = {
  q: 'ㅂ', Q: 'ㅃ', w: 'ㅈ', W: 'ㅉ', e: 'ㄷ', E: 'ㄸ', r: 'ㄱ', R: 'ㄲ', t: 'ㅅ', T: 'ㅆ',
  y: 'ㅛ', Y: 'ㅛ', u: 'ㅕ', U: 'ㅕ', i: 'ㅑ', I: 'ㅑ', o: 'ㅐ', O: 'ㅒ', p: 'ㅔ', P: 'ㅖ',
  a: 'ㅁ', A: 'ㅁ', s: 'ㄴ', S: 'ㄴ', d: 'ㅇ', D: 'ㅇ', f: 'ㄹ', F: 'ㄹ', g: 'ㅎ', G: 'ㅎ',
  h: 'ㅗ', H: 'ㅗ', j: 'ㅓ', J: 'ㅓ', k: 'ㅏ', K: 'ㅏ', l: 'ㅣ', L: 'ㅣ',
  z: 'ㅋ', Z: 'ㅋ', x: 'ㅌ', X: 'ㅌ', c: 'ㅊ', C: 'ㅊ', v: 'ㅍ', V: 'ㅍ', b: 'ㅠ', B: 'ㅠ', n: 'ㅜ', N: 'ㅜ', m: 'ㅡ', M: 'ㅡ',
}
const JAMO_TO_ENG: Record<string, string> = {
  ㅂ: 'q', ㅃ: 'Q', ㅈ: 'w', ㅉ: 'W', ㄷ: 'e', ㄸ: 'E', ㄱ: 'r', ㄲ: 'R', ㅅ: 't', ㅆ: 'T',
  ㅛ: 'y', ㅕ: 'u', ㅑ: 'i', ㅐ: 'o', ㅒ: 'O', ㅔ: 'p', ㅖ: 'P',
  ㅁ: 'a', ㄴ: 's', ㅇ: 'd', ㄹ: 'f', ㅎ: 'g', ㅗ: 'h', ㅓ: 'j', ㅏ: 'k', ㅣ: 'l',
  ㅋ: 'z', ㅌ: 'x', ㅊ: 'c', ㅍ: 'v', ㅠ: 'b', ㅜ: 'n', ㅡ: 'm',
}
const CHO = [...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ']
const JUNG = [...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ']
const JONG = ['', ...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ']
const VOWEL_COMBO: Record<string, string> = { ㅗㅏ: 'ㅘ', ㅗㅐ: 'ㅙ', ㅗㅣ: 'ㅚ', ㅜㅓ: 'ㅝ', ㅜㅔ: 'ㅞ', ㅜㅣ: 'ㅟ', ㅡㅣ: 'ㅢ' }
const JONG_COMBO: Record<string, string> = { ㄱㅅ: 'ㄳ', ㄴㅈ: 'ㄵ', ㄴㅎ: 'ㄶ', ㄹㄱ: 'ㄺ', ㄹㅁ: 'ㄻ', ㄹㅂ: 'ㄼ', ㄹㅅ: 'ㄽ', ㄹㅌ: 'ㄾ', ㄹㅍ: 'ㄿ', ㄹㅎ: 'ㅀ', ㅂㅅ: 'ㅄ' }
const VOWEL_SPLIT: Record<string, string> = Object.fromEntries(Object.entries(VOWEL_COMBO).map(([k, v]) => [v, k]))
const JONG_SPLIT: Record<string, string> = Object.fromEntries(Object.entries(JONG_COMBO).map(([k, v]) => [v, k]))

const isVowel = (j?: string) => !!j && JUNG.includes(j)
const isCho = (j?: string) => !!j && CHO.includes(j)

/** dkssud → 안녕 (두벌식 오토마타) */
function engToKor(text: string): string {
  // 1) 키 → 자모 배열 (자모 아닌 문자는 그대로)
  const jamo: string[] = [...text].map((ch) => ENG_TO_JAMO[ch] ?? ch)
  let out = ''
  let i = 0
  while (i < jamo.length) {
    const c = jamo[i]
    if (isCho(c) && isVowel(jamo[i + 1])) {
      const cho = c
      i++
      let jung = jamo[i]
      i++
      if (isVowel(jamo[i]) && VOWEL_COMBO[jung + jamo[i]]) {
        jung = VOWEL_COMBO[jung + jamo[i]]
        i++
      }
      let jong = ''
      if (jamo[i] && JONG.includes(jamo[i]) && !isVowel(jamo[i + 1])) {
        jong = jamo[i]
        i++
        if (jamo[i] && JONG_COMBO[jong + jamo[i]] && !isVowel(jamo[i + 1])) {
          jong = JONG_COMBO[jong + jamo[i]]
          i++
        }
      }
      out += String.fromCharCode(0xac00 + (CHO.indexOf(cho) * 21 + JUNG.indexOf(jung)) * 28 + JONG.indexOf(jong))
    } else if (isVowel(c) && isVowel(jamo[i + 1]) && VOWEL_COMBO[c + jamo[i + 1]]) {
      out += VOWEL_COMBO[c + jamo[i + 1]]
      i += 2
    } else {
      out += c
      i++
    }
  }
  return out
}

/** 안녕 → dkssud */
function korToEng(text: string): string {
  let out = ''
  for (const ch of text) {
    const code = ch.charCodeAt(0)
    if (code >= 0xac00 && code <= 0xd7a3) {
      const idx = code - 0xac00
      const cho = CHO[Math.floor(idx / (21 * 28))]
      const jung = JUNG[Math.floor((idx % (21 * 28)) / 28)]
      const jong = JONG[idx % 28]
      const parts = [cho, ...(VOWEL_SPLIT[jung] ? [...VOWEL_SPLIT[jung]] : [jung])]
      if (jong) parts.push(...(JONG_SPLIT[jong] ? [...JONG_SPLIT[jong]] : [jong]))
      out += parts.map((j) => JAMO_TO_ENG[j] ?? j).join('')
    } else if (JAMO_TO_ENG[ch]) {
      out += JAMO_TO_ENG[ch]
    } else if (VOWEL_SPLIT[ch] || JONG_SPLIT[ch]) {
      out += [...(VOWEL_SPLIT[ch] || JONG_SPLIT[ch])].map((j) => JAMO_TO_ENG[j] ?? j).join('')
    } else {
      out += ch
    }
  }
  return out
}

type Dir = 'auto' | 'e2k' | 'k2e'

export function KorEngConverter() {
  const [input, setInput] = useState('')
  const [dir, setDir] = useState<Dir>('auto')
  const [copied, setCopied] = useState(false)

  const { output, detected } = useMemo(() => {
    if (!input) return { output: '', detected: 'e2k' as const }
    const hasHangul = /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(input)
    const d = dir === 'auto' ? (hasHangul ? 'k2e' : 'e2k') : dir
    return { output: d === 'e2k' ? engToKor(input) : korToEng(input), detected: d }
  }, [input, dir])

  const copy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard 미지원 무시 */
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-400">변환 방향</span>
        {([['auto', '자동 감지'], ['e2k', '영타 → 한글'], ['k2e', '한글타 → 영어']] as [Dir, string][]).map(([v, l]) => (
          <button
            key={v}
            onClick={() => setDir(v)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${dir === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {l}
          </button>
        ))}
        {dir === 'auto' && input && (
          <span className="text-xs text-gray-400">→ {detected === 'e2k' ? '영타→한글로 감지됨' : '한글타→영어로 감지됨'}</span>
        )}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={'한/영 키를 잘못 놓고 친 문장을 붙여넣으세요.\n예: dkssudgktpdy → 안녕하세요\n예: ㅗ디ㅣㅐ → hello'}
        rows={5}
        className="w-full rounded-xl border border-gray-200 p-4 text-[15px] outline-none focus:border-blue-400"
      />

      <div className="relative">
        <div className="min-h-[8rem] w-full whitespace-pre-wrap rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-[15px] text-gray-800">
          {output || <span className="text-gray-400">여기에 변환 결과가 나와요</span>}
        </div>
        {output && (
          <button
            onClick={copy}
            className="absolute right-3 top-3 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm ring-1 ring-blue-200 hover:bg-blue-50"
          >
            {copied ? '복사됨 ✓' : '복사'}
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400">
        두벌식 표준 자판 기준. 입력 내용은 서버로 전송되지 않고 브라우저 안에서만 변환돼요.
      </p>
    </div>
  )
}
