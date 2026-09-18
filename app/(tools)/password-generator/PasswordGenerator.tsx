'use client'

import { useState, useCallback } from 'react'
import { generatePassword } from '@/lib/password'

export function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeSpecial, setIncludeSpecial] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    setPassword(generatePassword(length, includeUppercase, includeNumbers, includeSpecial))
    setCopied(false)
  }, [length, includeUppercase, includeSpecial, includeNumbers])

  const copyToClipboard = async () => {
    if (password) {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getStrength = () => {
    if (length < 8) return { label: '약함', color: 'text-red-500', bg: 'bg-red-100' }
    if (length < 12) return { label: '보통', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (length < 16) return { label: '강함', color: 'text-blue-600', bg: 'bg-blue-100' }
    return { label: '매우 강함', color: 'text-emerald-600', bg: 'bg-emerald-100' }
  }

  const strength = getStrength()
  const sliderPercent = ((length - 4) / (64 - 4)) * 100

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 길이: {length}자</label>
          <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full custom-slider" style={{ background: `linear-gradient(to right, #2563eb ${sliderPercent}%, #e5e7eb ${sliderPercent}%)` }} />
          <div className="flex justify-between text-xs text-gray-400">
            <span>4</span><span>64</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} className="accent-blue-600" />
            <span className="text-sm text-gray-700">대문자 포함 (A-Z)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="accent-blue-600" />
            <span className="text-sm text-gray-700">숫자 포함 (0-9)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={includeSpecial} onChange={(e) => setIncludeSpecial(e.target.checked)} className="accent-blue-600" />
            <span className="text-sm text-gray-700">특수문자 포함 (!@#$%...)</span>
          </label>
        </div>

        <button onClick={generate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">생성하기</button>

        {password && (
          <div className="mt-4 space-y-3">
            <div className="relative">
              <div className="bg-gray-900 text-green-400 font-mono text-lg p-4 rounded-lg break-all">
                {password}
              </div>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition-colors"
              >
                {copied ? '복사됨!' : '복사'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">강도:</span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${strength.bg} ${strength.color}`}>
                {strength.label}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
