import { supabase } from '@/lib/supabase'

export interface YouTubeVideo {
  id: string
  title: string
  video_id: string
  thumbnail_url: string
  channel_name: string
  view_count: string | null
  tool_category: string
}

export async function getVideosByCategory(category: string): Promise<YouTubeVideo[]> {
  const { data, error } = await supabase
    .from('youtube_videos')
    .select('*')
    .eq('tool_category', category)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Failed to fetch YouTube videos:', error.message)
    return []
  }

  return (data || []) as YouTubeVideo[]
}
