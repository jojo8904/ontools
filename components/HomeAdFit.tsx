'use client'

import { useEffect, useRef, useState } from 'react'
import { AdFitUnit } from './AdFitUnit'
import styles from './HomeAdFit.module.css'

// The same issued units previously used by ResponsiveAdFit on the home page.
const PC = { unit: 'DAN-YmhVtuLiN5Q2MJ3K', width: 728, height: 90 }
const MOBILE = { unit: 'DAN-TMWlzezuMlSsAZtt', width: 320, height: 100 }

export function HomeAdFit() {
  const frame = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<typeof PC | null>(null)

  useEffect(() => {
    const el = frame.current
    if (!el) return
    // SPA history restoration can initially mount the page in a hidden tree.
    // Observe until it has usable space, then stop: no resize-based refreshes.
    const observer = new ResizeObserver(() => {
      if (el.clientWidth < 320) return
      setSize(el.clientWidth >= 728 ? PC : MOBILE)
      observer.disconnect()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <aside aria-label="광고" className="bg-white py-6">
      <div className="container mx-auto px-0 sm:px-4">
        <div ref={frame} className={styles.frame}>
          <p className="mb-2 text-center text-[10px] leading-4 text-[#999]">광고</p>
          <div className={styles.space}>
            {size && (
              <div className={styles.creative} data-width={size.width}>
                <AdFitUnit {...size} />
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
