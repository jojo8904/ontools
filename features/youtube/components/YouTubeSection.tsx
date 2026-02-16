'use client'

import { useEffect, useState } from 'react'
import { YouTubeVideo, getVideosByCategory } from '../services/youtubeApi'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-28 h-16 bg-gray-100 rounded shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-50 rounded w-2/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (videos.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {videos.map((video) => (
          <a
            key={video.video_id}
            href={`https://www.youtube.com/watch?v=${video.video_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 group"
          >
            <img
              src={video.thumbnail_url}
              alt=""
              className="w-28 h-16 object-cover rounded shrink-0 group-hover:opacity-80 transition-opacity"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                {video.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {video.channel_name}
                {video.view_count && ` · ${video.view_count}`}
              </p>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  )
}
