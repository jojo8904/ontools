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
