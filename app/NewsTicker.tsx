'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface TickerItem {
  id: string
  title: string
  url: string
}

export function NewsTicker() {
  const [items, setItems] = useState<TickerItem[]>([])

  useEffect(() => {
    supabase
      .from('news')
      .select('id, title, url')
      .order('published_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data && data.length > 0) setItems(data as TickerItem[])
      })
  }, [])

  if (items.length === 0) return null

  const doubled = [...items, ...items]

  return (
    <div className="bg-[#111] overflow-hidden border-t border-b border-[#222]">
      <div className="container mx-auto px-4 flex items-center h-10">
        <span className="text-[11px] font-bold text-[#999] tracking-wider mr-4 shrink-0">
          NEWS
        </span>
        <div className="overflow-hidden flex-1 relative">
          <div className="flex animate-ticker whitespace-nowrap gap-12">
            {doubled.map((item, i) => (
              <a
                key={`${item.id}-${i}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#999] hover:text-white transition-colors shrink-0"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
