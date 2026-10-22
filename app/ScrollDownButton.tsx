'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './ScrollDownButton.module.css'

type Position = { left: number; top: number; visible: boolean }
const SIZE = 52

export function ScrollDownButton() {
  const dismissed = useRef(false)
  const [position, setPosition] = useState<Position>({ left: 0, top: 0, visible: false })

  useEffect(() => {
    let frame = 0
    const update = () => {
      const viewport = window.visualViewport
      const width = viewport?.width ?? innerWidth
      const bottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? innerHeight)
      const top = bottom - SIZE - 20
      if (window.scrollY > 8) dismissed.current = true
      let next: Position = { left: 0, top, visible: false }
      const hasMoreContent = document.documentElement.scrollHeight > bottom + window.scrollY + 32
      if (hasMoreContent && !dismissed.current && top >= 0 && !document.querySelector('[aria-label="검색 닫기"]')) {
        const guards = Array.from(document.querySelectorAll('header, [aria-label="계산기 검색"], [aria-label="고양이 점프 게임"] p, [aria-label="고양이 점프 게임"] span, [aria-label="고양이 점프 게임"] input, [aria-label="고양이 점프 게임"] button')).map(el => el.getBoundingClientRect())
        for (const ad of document.querySelectorAll('aside[aria-label="광고"]')) {
          const unit = ad.querySelector('[data-width]')
          if (unit) {
            const box = unit.getBoundingClientRect()
            const area = ad.getBoundingClientRect()
            // Protect the reserved area even when the SDK is blocked or empty.
            guards.push(new DOMRect(box.x, area.y + 24, box.width, 124))
          }
        }
        // Prefer the viewport bottom. If an ad occupies that row, use the
        // nearest clear row above it instead of suppressing the hint entirely.
        const lowerLimit = (document.querySelector('header')?.getBoundingClientRect().bottom ?? 0) + 8
        const fallbackTops = guards.map(box => box.top - SIZE - 16)
          .filter(value => value >= lowerLimit && value + SIZE <= bottom - 8)
          .sort((a, b) => b - a)
        const candidates = [bottom - SIZE - 20, bottom - SIZE - 8, ...fallbackTops]
          .flatMap(top => [width / 2 - SIZE / 2, 20, width - SIZE - 20, width / 4 - SIZE / 2, width * 3 / 4 - SIZE / 2].map(left => ({ left, top })))
        for (const candidate of candidates) {
          const { left, top } = candidate
          const safe = left >= 8 && left + SIZE <= width - 8 && guards.every(box =>
            left + SIZE + 16 <= box.left || left - 16 >= box.right || top + SIZE + 16 <= box.top || top - 16 >= box.bottom
          )
          if (safe) { next = { ...candidate, visible: true }; break }
        }
      }
      setPosition(previous => previous.left === next.left && previous.top === next.top && previous.visible === next.visible ? previous : next)
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest('[aria-label="고양이 점프 게임"]')) dismissed.current = true
      schedule()
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.visualViewport?.addEventListener('resize', schedule)
    window.visualViewport?.addEventListener('scroll', schedule)
    document.addEventListener('click', schedule, true)
    document.addEventListener('pointerdown', onPointer, true)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.visualViewport?.removeEventListener('resize', schedule)
      window.visualViewport?.removeEventListener('scroll', schedule)
      document.removeEventListener('click', schedule, true)
      document.removeEventListener('pointerdown', onPointer, true)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={() => {
        dismissed.current = true
        setPosition(previous => ({ ...previous, visible: false }))
        document.getElementById('tools')?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        })
      }}
      aria-label="도구 모음으로 스크롤"
      data-scroll-hint="first-viewport"
      data-scroll-hint-version="2"
      title="도구 모음으로 스크롤"
      aria-hidden={!position.visible}
      tabIndex={position.visible ? 0 : -1}
      className={`${styles.hint} ${position.visible ? styles.visible : ''}`}
      style={{ left: position.left, top: position.top }}
    >
      <ChevronDown className="w-6 h-6" aria-hidden="true" />
    </button>
  )
}
