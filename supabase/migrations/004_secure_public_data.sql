BEGIN;

REVOKE ALL ON public.news, public.exchange_rates, public.youtube_videos FROM anon, authenticated;
GRANT SELECT ON public.news, public.exchange_rates, public.youtube_videos TO anon, authenticated;
GRANT ALL ON public.news, public.exchange_rates, public.youtube_videos TO service_role;

DROP POLICY IF EXISTS "Allow service_role insert on news" ON public.news;
DROP POLICY IF EXISTS "Allow service_role insert on exchange_rates" ON public.exchange_rates;
DROP POLICY IF EXISTS "Allow service_role insert on youtube_videos" ON public.youtube_videos;
DROP POLICY IF EXISTS "Allow service_role delete on youtube_videos" ON public.youtube_videos;

ALTER TABLE public.youtube_videos DROP CONSTRAINT IF EXISTS youtube_videos_video_id_key;
ALTER TABLE public.youtube_videos ADD CONSTRAINT youtube_videos_category_video_key UNIQUE (tool_category, video_id);

CREATE OR REPLACE FUNCTION public.replace_youtube_category(p_category text, p_videos jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF p_category IS NULL OR length(trim(p_category)) = 0
     OR jsonb_typeof(p_videos) IS DISTINCT FROM 'array'
     OR jsonb_array_length(p_videos) = 0 THEN
    RAISE EXCEPTION 'A category and nonempty videos array are required';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(p_category, 0));
  DELETE FROM public.youtube_videos WHERE tool_category = p_category;
  INSERT INTO public.youtube_videos (title, video_id, thumbnail_url, channel_name, view_count, tool_category)
  SELECT v.title, v.video_id, v.thumbnail_url, v.channel_name, v.view_count, p_category
  FROM jsonb_to_recordset(p_videos)
    AS v(title text, video_id text, thumbnail_url text, channel_name text, view_count text);
END;
$$;

REVOKE ALL ON FUNCTION public.replace_youtube_category(text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.replace_youtube_category(text, jsonb) TO service_role;

ALTER TABLE public.exchange_rates ADD COLUMN source text;
ALTER TABLE public.exchange_rates ADD COLUMN fetched_at timestamptz;

COMMIT;
