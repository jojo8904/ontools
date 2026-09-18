CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE service_role NOLOGIN BYPASSRLS;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
\ir ../migrations/001_create_tables.sql
\ir ../migrations/002_add_image_url.sql
\ir ../migrations/003_create_youtube_videos.sql
\ir ../migrations/004_secure_public_data.sql

DO $$
DECLARE r text; t text; action text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    FOREACH t IN ARRAY ARRAY['news', 'exchange_rates', 'youtube_videos'] LOOP
      IF NOT has_table_privilege(r, 'public.' || t, 'SELECT') THEN
        RAISE EXCEPTION 'Missing public read: % %', r, t;
      END IF;
      FOREACH action IN ARRAY ARRAY['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE'] LOOP
        IF has_table_privilege(r, 'public.' || t, action) THEN
          RAISE EXCEPTION 'Unexpected write grant: % % %', r, t, action;
        END IF;
      END LOOP;
    END LOOP;
    IF has_function_privilege(r, 'public.replace_youtube_category(text,jsonb)', 'EXECUTE') THEN
      RAISE EXCEPTION 'Unexpected RPC grant: %', r;
    END IF;
  END LOOP;
END;
$$;

SET ROLE service_role;
INSERT INTO public.exchange_rates(currency_code, rate, date) VALUES ('USD', 1, now());
SELECT public.replace_youtube_category('salary', '[{"title":"Test","video_id":"same","thumbnail_url":"https://example.com/t.jpg","channel_name":"Test"}]');
SELECT public.replace_youtube_category('tax', '[{"title":"Test","video_id":"same","thumbnail_url":"https://example.com/t.jpg","channel_name":"Test"}]');
DO $$
BEGIN
  BEGIN
    PERFORM public.replace_youtube_category('salary', '[{"video_id":"invalid"}]');
    RAISE EXCEPTION 'Expected missing fields to fail';
  EXCEPTION WHEN not_null_violation THEN
    NULL;
  END;
  IF (SELECT count(*) FROM public.youtube_videos WHERE video_id = 'same') <> 2 THEN
    RAISE EXCEPTION 'Atomic replacement or category uniqueness failed';
  END IF;
END;
$$;
RESET ROLE;
