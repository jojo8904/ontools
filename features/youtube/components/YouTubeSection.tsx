'use client'

import { useEffect, useState } from 'react'
import { YouTubeVideo, getVideosByCategory } from '../services/youtubeApi'

interface YouTubeSectionProps {
  category: string
  title?: string
}

export function YouTubeSection({ category, title = '관련 영상' }: YouTubeSectionProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVideosByCategory(category)
      .then(setVideos)
      .finally(() => setLoading(false))
  }, [category])

  if (loading) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse rounded-lg border bg-white p-3">
              <div className="w-32 h-20 bg-gray-100 rounded shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-50 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (videos.length === 0) return null

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <a
            key={video.video_id}
            href={`https://www.youtube.com/watch?v=${video.video_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 group rounded-lg border bg-white p-3 hover:shadow-md transition-shadow"
          >
            <img
              src={video.thumbnail_url}
              alt=""
              className="w-32 h-20 object-cover rounded shrink-0 group-hover:opacity-80 transition-opacity"
              loading="lazy"
            />
            <div className="flex-1 min-w-0 py-1">
              <p className="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                {video.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">
                {video.channel_name}
                {video.view_count && ` · ${video.view_count}`}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
