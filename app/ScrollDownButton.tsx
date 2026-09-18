'use client'

import { ChevronDown } from 'lucide-react'

export function ScrollDownButton() {
  return (
    <button
      type="button"
      onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
      aria-label="도구 모음으로 스크롤"
      title="도구 모음으로 스크롤"
      style={{
        position: 'absolute',
        bottom: '-26px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        border: 'none',
        background: '#f97316',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
        boxShadow: '0 6px 16px rgba(249,115,22,0.45)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#ea580c' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#f97316' }}
    >
      <ChevronDown className="w-6 h-6" aria-hidden="true" />
    </button>
  )
}
