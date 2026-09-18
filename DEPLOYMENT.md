# Production Deployment

## Existing Infrastructure

- Site: https://ontools.co.kr
- Repository: https://github.com/jojo8904/ontools
- Production branch: `main`
- Hosting: Vercel project `ontools`, linked to GitHub. A push to `main` starts a production deployment.
- Database: Supabase project `ixktaylkcebdozanhsjm`.
- Scheduled updates: GitHub Actions, using repository secrets.

Do not create a replacement hosting project or change DNS for routine releases.

## Database Prerequisite

Before releasing the September 2026 maintenance changes:

1. Back up the affected tables and schema outside this repository.
2. Inspect the existing schema, policies and migration history.
3. Apply `supabase/migrations/004_secure_public_data.sql` once. Do not rerun the earlier table-creation migrations against production.
   Then apply `005_align_legacy_schema.sql` to preserve full exchange-rate timestamps and enforce the required fields on legacy tables. Check for null values before applying it; do not delete invalid rows to force a migration through.
4. Confirm that `anon` and `authenticated` can read, but cannot modify, the three public data tables. Only `service_role` may execute `replace_youtube_category`.
5. Confirm that exchange rates have the `source` and `fetched_at` columns and videos have the category/video unique constraint.

The new exchange-rate writer and video crawler depend on this migration. A frontend deployment alone does not apply SQL or fix database permissions.

## Environment

Vercel production build variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Optional analytics and issued advertising IDs from `.env.example`.

GitHub Actions secrets:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `YOUTUBE_API_KEY`
- Optional `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` for failure notifications.

Never put management tokens, database passwords or service-role keys in `NEXT_PUBLIC_*`, Git, build output or chat. Environment changes on Vercel require a new build.

AdSense approval is pending. Leave manual ad slots blank until real slots have been issued.

## Release Checks

```sh
npm ci
npm run lint
npm run typecheck
npm test -- --run
npm run build
npx playwright install chromium
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

Use a supported Node version matching CI (Node 24). The build uses webpack. `postinstall` copies the installed PDF.js worker into `public`; do not disable install scripts.

Commit the intended changes and push `main`. Wait for both the Vercel production deployment and GitHub Quality Checks to finish successfully. Record the deployed commit and result in the maintenance log.

## Live Verification

- Check desktop/mobile home rendering, navigation and layout overflow.
- Exercise salary policy selection and PDF conversion with the local worker.
- Check tool canonical URLs, `/sitemap.xml`, `/robots.txt` and the Open Graph image.
- Manually run Exchange Rate Updater and YouTube Video Crawler after the migration; verify job completion and actual stored data timestamps.
- Verify analytics receipt in GA4 when account access is available. Browser event dispatch alone does not prove GA4 receipt.

## Recovery

If a release fails, keep the previous healthy deployment active or promote it using the existing Vercel project. Fix the failure in a new commit; do not rewrite shared Git history.

Migration 004 adds fields and tightens permissions. Do not restore insecure public writes to roll back the frontend. Assess database compatibility separately before restoring a backup.
