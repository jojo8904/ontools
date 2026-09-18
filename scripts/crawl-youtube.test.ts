// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'

vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn() }))
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks() })

it('reports category failures and never deletes existing rows after API failures', async () => {
  vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co')
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-only')
  vi.stubEnv('YOUTUBE_API_KEY', 'test-only')
  const rpc = vi.fn()
  vi.mocked(createClient).mockReturnValue({ rpc } as unknown as ReturnType<typeof createClient>)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }))
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const { crawlYouTube } = await import('./crawl-youtube')
  await expect(crawlYouTube()).rejects.toThrow(/sync failed/)
  expect(rpc).not.toHaveBeenCalled()
})
