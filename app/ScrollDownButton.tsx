'use client'

import { useEffect, useState } from 'react'

export function ScrollDownButton() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <button
      onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })}
      aria-label="최신 뉴스로 스크롤"
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
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
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.4s ease, background 0.3s ease',
        boxShadow: '0 6px 16px rgba(249,115,22,0.45)',
        animation: 'bounce-subtle 2s ease-in-out infinite',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#ea580c' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#f97316' }}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  )
}
