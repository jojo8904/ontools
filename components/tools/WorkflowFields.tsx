'use client'

import { useId, useRef } from 'react'
import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { Upload } from 'lucide-react'
import { IMAGE_ACCEPT } from '@/lib/image-workflows'

export const fieldClass =
  'w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50'
export const panelClass = 'rounded-xl border border-gray-200 bg-white p-4 sm:p-6 space-y-4'

export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 'any',
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number | 'any'
}) {
  const id = useId()
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="number"
        required
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : ''}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        className={fieldClass}
      />
    </div>
  )
}

export function IconButton({
  label,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30"
    >
      {children}
    </button>
  )
}

export function FilePicker({
  multiple = false,
  disabled = false,
  onFiles,
}: {
  multiple?: boolean
  disabled?: boolean
  onFiles: (files: File[]) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => input.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (!disabled) onFiles(Array.from(e.dataTransfer.files))
        }}
        className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <Upload size={28} aria-hidden="true" />
        <span className="font-medium">{multiple ? '사진 선택' : '사진 선택 / 변경'}</span>
        <span className="text-xs text-gray-500">JPG · PNG · WebP / 장당 20MB 이하</span>
      </button>
      <input
        ref={input}
        type="file"
        aria-label="사진 파일"
        accept={IMAGE_ACCEPT}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onFiles(Array.from(e.target.files))
          e.target.value = ''
        }}
      />
    </div>
  )
}

export function ErrorMessage({ error }: { error: string }) {
  return error ? (
    <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 break-words">
      {error}
    </p>
  ) : null
}
