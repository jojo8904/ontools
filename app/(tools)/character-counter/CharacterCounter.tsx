'use client'

import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

function getByteLength(str: string): number {
  let bytes = 0
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    if (code <= 0x7f) bytes += 1
    else if (code <= 0x7ff) bytes += 2
    else bytes += 3
  }
  return bytes
}

interface TextStats {
  charsWithSpaces: number
  charsWithoutSpaces: number
  bytes: number
  words: number
  sentences: number
  paragraphs: number
  lines: number
}

function analyzeText(text: string): TextStats {
  const charsWithSpaces = text.length
  const charsWithoutSpaces = text.replace(/\s/g, '').length
  const bytes = getByteLength(text)
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const sentences = text.trim() === '' ? 0 : text.split(/[.!?。]+/).filter((s) => s.trim()).length
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length
  const lines = text.trim() === '' ? 0 : text.split('\n').length

  return { charsWithSpaces, charsWithoutSpaces, bytes, words, sentences, paragraphs, lines }
}

export function CharacterCounter() {
  const [text, setText] = useState('')

  const stats = useMemo(() => analyzeText(text), [text])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>텍스트 입력</CardTitle>
          <CardDescription>
            글자수를 세고 싶은 텍스트를 입력하거나 붙여넣으세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="여기에 텍스트를 입력하세요..."
            className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-y text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setText('')}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              전체 삭제
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-xs text-blue-600 font-semibold mb-1">공백 포함</p>
          <p className="text-2xl font-bold text-blue-900">{stats.charsWithSpaces.toLocaleString()}</p>
          <p className="text-xs text-blue-500 mt-0.5">글자</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4 text-center">
          <p className="text-xs text-emerald-600 font-semibold mb-1">공백 제외</p>
          <p className="text-2xl font-bold text-emerald-900">{stats.charsWithoutSpaces.toLocaleString()}</p>
          <p className="text-xs text-emerald-500 mt-0.5">글자</p>
        </div>
        <div className="bg-violet-50 rounded-lg p-4 text-center">
          <p className="text-xs text-violet-600 font-semibold mb-1">바이트</p>
          <p className="text-2xl font-bold text-violet-900">{stats.bytes.toLocaleString()}</p>
          <p className="text-xs text-violet-500 mt-0.5">bytes</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 text-center">
          <p className="text-xs text-amber-600 font-semibold mb-1">단어수</p>
          <p className="text-2xl font-bold text-amber-900">{stats.words.toLocaleString()}</p>
          <p className="text-xs text-amber-500 mt-0.5">단어</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">글자수 (공백 포함)</span>
              <span className="font-medium">{stats.charsWithSpaces.toLocaleString()}자</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">글자수 (공백 제외)</span>
              <span className="font-medium">{stats.charsWithoutSpaces.toLocaleString()}자</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">바이트수 (UTF-8)</span>
              <span className="font-medium">{stats.bytes.toLocaleString()} bytes</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">단어수</span>
              <span className="font-medium">{stats.words.toLocaleString()}개</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">문장수</span>
              <span className="font-medium">{stats.sentences.toLocaleString()}개</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">문단수</span>
              <span className="font-medium">{stats.paragraphs.toLocaleString()}개</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">줄수</span>
              <span className="font-medium">{stats.lines.toLocaleString()}줄</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
