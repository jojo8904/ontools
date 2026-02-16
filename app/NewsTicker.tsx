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

  // Double the items for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className="bg-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 flex items-center h-10">
        <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded mr-3 shrink-0">
          NEW
        </span>
        <div className="overflow-hidden flex-1 relative">
          <div className="flex animate-ticker whitespace-nowrap gap-12">
            {doubled.map((item, i) => (
              <a
                key={`${item.id}-${i}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-200 hover:text-white transition-colors shrink-0"
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
