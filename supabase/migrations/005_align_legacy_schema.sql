BEGIN;

-- Older production tables used DATE; retain their UTC dates when restoring timestamp precision.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'exchange_rates'
      AND column_name = 'date' AND data_type = 'date'
  ) THEN
    ALTER TABLE public.exchange_rates ALTER COLUMN date TYPE timestamptz
      USING date::timestamp AT TIME ZONE 'UTC';
  END IF;
END;
$$;

ALTER TABLE public.exchange_rates
  ALTER COLUMN rate SET NOT NULL,
  ALTER COLUMN date SET NOT NULL,
  ALTER COLUMN is_weekend SET NOT NULL,
  ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE public.youtube_videos
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN video_id SET NOT NULL,
  ALTER COLUMN thumbnail_url SET NOT NULL,
  ALTER COLUMN channel_name SET NOT NULL,
  ALTER COLUMN tool_category SET NOT NULL,
  ALTER COLUMN created_at SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_exchange_rates_currency_date
  ON public.exchange_rates (currency_code, date DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_tool_category
  ON public.youtube_videos (tool_category);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_created_at
  ON public.youtube_videos (created_at DESC);

COMMIT;
