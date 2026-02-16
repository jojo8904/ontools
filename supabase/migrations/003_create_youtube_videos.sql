-- YouTube videos table
CREATE TABLE IF NOT EXISTS youtube_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  video_id TEXT NOT NULL UNIQUE,
  thumbnail_url TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  view_count TEXT,
  tool_category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_youtube_videos_tool_category ON youtube_videos (tool_category);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_created_at ON youtube_videos (created_at DESC);

-- RLS policies
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on youtube_videos" ON youtube_videos FOR SELECT USING (true);
CREATE POLICY "Allow service_role insert on youtube_videos" ON youtube_videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service_role delete on youtube_videos" ON youtube_videos FOR DELETE USING (true);
