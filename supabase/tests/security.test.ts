// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { PGlite } from '@electric-sql/pglite'
import { expect, it } from 'vitest'

it('enforces public read-only access and transactional video replacement', async () => {
  const file = resolve('supabase/tests/security.sql')
  const sql = readFileSync(file, 'utf8').replace(/^\\ir (.+)$/gm, (_, name: string) => readFileSync(resolve(dirname(file), name.trim()), 'utf8'))
  const db = new PGlite()
  try {
    await db.exec(sql)
    await db.exec('SET ROLE anon')
    await expect(db.query("INSERT INTO public.exchange_rates(currency_code,rate,date) VALUES ('USD',1,now())")).rejects.toThrow(/permission denied/)
    const { rows } = await db.query('SELECT count(*)::int AS count FROM public.youtube_videos')
    expect(rows).toEqual([{ count: 2 }])
  } finally { await db.close() }
}, 30000)

it('preserves legacy dates and rejects invalid video replacement on the production schema', async () => {
  const db = new PGlite()
  try {
    await db.exec(`
      CREATE ROLE anon NOLOGIN;
      CREATE ROLE authenticated NOLOGIN;
      CREATE ROLE service_role NOLOGIN BYPASSRLS;
      GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
      CREATE TABLE news (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL);
      CREATE TABLE exchange_rates (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(), currency_code text NOT NULL,
        rate numeric, date date, is_weekend boolean DEFAULT false, created_at timestamptz DEFAULT now()
      );
      CREATE TABLE youtube_videos (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text, video_id text, thumbnail_url text,
        channel_name text, view_count text, tool_category text, created_at timestamptz DEFAULT now()
      );
      INSERT INTO exchange_rates (currency_code, rate, date) VALUES ('USD', 1300, '2026-09-18');
      SET TIME ZONE 'Asia/Seoul';
    `)
    for (const file of ['004_secure_public_data.sql', '005_align_legacy_schema.sql']) {
      await db.exec(readFileSync(resolve('supabase/migrations', file), 'utf8'))
    }
    const { rows } = await db.query<{ timestamp: string }>("SELECT to_char(date AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS timestamp FROM exchange_rates")
    expect(rows).toEqual([{ timestamp: '2026-09-18 00:00:00' }])
    await db.exec('SET ROLE service_role')
    const valid = [{ title: 'Test', video_id: 'original', thumbnail_url: 'https://example.com/t.jpg', channel_name: 'Test' }]
    await db.query('SELECT replace_youtube_category($1, $2::jsonb)', ['salary', JSON.stringify(valid)])
    await expect(db.query('SELECT replace_youtube_category($1, $2::jsonb)', ['salary', '[{"video_id":"invalid"}]'])).rejects.toThrow(/null value/)
    expect((await db.query('SELECT video_id FROM youtube_videos')).rows).toEqual([{ video_id: 'original' }])
    await db.exec("INSERT INTO exchange_rates (currency_code,rate,date) VALUES ('USD',1301,'2026-09-18T08:12:34Z')")
    expect((await db.query<{ timestamp: string }>("SELECT to_char(date AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS timestamp FROM exchange_rates ORDER BY date DESC LIMIT 1")).rows).toEqual([{ timestamp: '2026-09-18 08:12:34' }])
  } finally { await db.close() }
}, 30000)
