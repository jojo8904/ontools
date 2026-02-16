# GitHub Actions Setup Guide

> **Feature**: Automated News Crawling + Exchange Rate Updates
> **Date**: 2026-02-15

---

## 1. Install Dependencies

```bash
npm install
```

New dependencies added:
- `@anthropic-ai/sdk` - Claude API client
- `rss-parser` - RSS feed parser
- `tsx` - TypeScript execution (devDependency)

---

## 2. Create exchange_rates Table in bkend.ai

Before running the exchange rate updater, create the table:

**Using bkend.ai Console**:
1. Visit https://console.bkend.ai
2. Select **ontools** project
3. Go to **Tables** → **+ New Table**
4. Table Name: `exchange_rates`
5. Add columns:

| Column Name | Type | Required | Unique | Default |
|-------------|------|----------|--------|---------|
| `currency_code` | Text | ✅ | ☐ | - |
| `rate` | Number | ✅ | ☐ | - |
| `date` | DateTime | ✅ | ☐ | - |
| `is_weekend` | Boolean | ✅ | ☐ | `false` |

6. **Composite Unique Index**: `currency_code + date` (prevent duplicates)
7. **Permissions**:
   - Public Read: ✅ Allow
   - Public Create: ☐ Deny (only GitHub Actions)

---

## 3. Get API Keys

### 3.1 Claude API Key

1. Visit: https://console.anthropic.com/
2. Sign in → **API Keys** → **Create Key**
3. Name: `ontools-github-actions`
4. Copy the key (starts with `sk-ant-api...`)

**Cost Estimate** (Claude Haiku 4.5):
- Input: $0.80 / 1M tokens
- Output: $4.00 / 1M tokens
- **Monthly cost**: ~$0.65 (assuming 100 news/day, 200 tokens each)

### 3.2 Korea Eximbank API Key

1. Visit: https://www.koreaexim.go.kr/site/program/openapi/openApiView.do?apino=2&apiNo=2&pageIndex=1
2. Click **"API 신청"** (API Application)
3. Fill form:
   - Name: Your name
   - Email: Your email
   - Usage: `ontools 웹사이트용 환율 정보 조회`
4. Submit and wait for email with API key

**Free**: Unlimited usage

### 3.3 Telegram Bot (Optional - for error notifications)

1. Open Telegram → Search **@BotFather**
2. Send `/newbot`
3. Follow instructions:
   - Bot name: `ontools News Bot`
   - Username: `ontools_news_bot`
4. Copy the **Bot Token**
5. Send a message to your bot
6. Get Chat ID:
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
7. Find `"chat":{"id":123456789}` in response

---

## 4. Configure GitHub Secrets

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add the following secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `BKEND_API_URL` | `https://api-client.bkend.ai/v1` | (use this exactly) |
| `BKEND_PROJECT_ID` | Your bkend.ai project ID | `q70vosz84ihkg1s8g6rl` |
| `BKEND_ENV` | `production` | (or `dev` for testing) |
| `CLAUDE_API_KEY` | Your Claude API key | `sk-ant-api...` |
| `EXCHANGE_RATE_API_KEY` | Korea Eximbank API key | `xxxxxxxxx` |
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token | `123456:ABCdef...` |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID | `123456789` |

---

## 5. Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. Enable workflows if not already enabled
3. You should see:
   - **News Crawler** (runs every 3 hours)
   - **Exchange Rate Updater** (runs weekdays at 11:00 KST)

---

## 6. Test Workflows Manually

### 6.1 Local Testing (Optional)

Create `.env.local` with secrets (DO NOT commit!):

```bash
# .env.local
BKEND_API_URL=https://api-client.bkend.ai/v1
BKEND_PROJECT_ID=q70vosz84ihkg1s8g6rl
BKEND_ENV=dev
CLAUDE_API_KEY=sk-ant-api...
EXCHANGE_RATE_API_KEY=xxxxxxxxx
TELEGRAM_BOT_TOKEN=123456:ABCdef...
TELEGRAM_CHAT_ID=123456789
```

Run locally:
```bash
# Test news crawler
npm run crawl-news

# Test exchange rate updater
npm run update-exchange-rate
```

### 6.2 GitHub Actions Manual Trigger

1. Go to **Actions** tab
2. Select **News Crawler** workflow
3. Click **"Run workflow"** → **"Run workflow"**
4. Monitor progress in real-time

Repeat for **Exchange Rate Updater**

---

## 7. Workflow Schedules

### News Crawler
- **Frequency**: Every 3 hours
- **Times (KST)**: 09:00, 12:00, 15:00, 18:00, 21:00, 00:00, 03:00, 06:00
- **Cron**: `0 */3 * * *` (UTC)

### Exchange Rate Updater
- **Frequency**: Weekdays at 11:00 KST
- **Days**: Monday - Friday
- **Cron**: `0 2 * * 1-5` (UTC)

**Note**:
- KST = UTC + 9
- Weekend rates use latest weekday rate (automatic fallback)

---

## 8. Switch from Mock Data to Real API

Once workflows are running and data is populated:

```typescript
// features/news/hooks/useNews.ts
const USE_MOCK_DATA = false  // Change to false
```

```typescript
// features/currency/services/exchangeRateApi.ts
// API calls will now fetch from bkend.ai exchange_rates table
```

---

## 9. Monitoring

### Check Workflow Runs

1. **Actions** tab → Select workflow
2. View recent runs (green = success, red = failed)
3. Click on run to see logs

### Check bkend.ai Data

1. Console: https://console.bkend.ai
2. Select **ontools** project
3. **Tables** → **news** → View data
4. **Tables** → **exchange_rates** → View data

### Telegram Notifications

If configured, you'll receive alerts on failures:
```
⚠️ News crawler failed at Wed Feb 15 12:00:00 2026
```

---

## 10. Cost Optimization

### Claude Haiku 4.5 Costs

**Current Setup**:
- 8 RSS sources × 10 items = 80 items per run
- 8 runs per day = 640 items/day
- ~200 tokens per item (input + output)
- **Daily cost**: $0.02
- **Monthly cost**: $0.65

**Optimization Tips**:
1. Reduce RSS sources (currently 8)
2. Reduce items per source (currently 10)
3. Reduce run frequency (currently every 3 hours)
4. Filter by publish date (only process items from last 6 hours)

### GitHub Actions Limits

**Free Tier**:
- Public repos: Unlimited
- Private repos: 2,000 minutes/month

**Current Usage**:
- News Crawler: ~2 min × 8 runs/day = 16 min/day = 480 min/month
- Exchange Rate Updater: ~1 min × 22 days/month = 22 min/month
- **Total**: ~500 min/month (within free tier)

---

## 11. Troubleshooting

### Issue: "bkend.ai API error: 401"
**Solution**: Check BKEND_PROJECT_ID and permissions

### Issue: "Claude API error: 401"
**Solution**: Verify CLAUDE_API_KEY is correct

### Issue: "RSS feed timeout"
**Solution**: Increase timeout or skip that source

### Issue: "Duplicate key error"
**Solution**: Composite unique index prevents duplicates (working as intended)

### Issue: "Korea Eximbank API returns empty"
**Solution**:
- Check if today is a holiday
- Verify API key is valid
- Weekend rates use previous weekday (automatic)

---

## 12. Next Steps

After workflows are running:

1. ✅ Monitor first few runs
2. ✅ Verify data in bkend.ai
3. ✅ Switch `USE_MOCK_DATA` to `false`
4. ✅ Test news display on website
5. ✅ Adjust RSS sources based on quality
6. ✅ Fine-tune Claude prompts if needed

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-15 | Initial GitHub Actions setup guide |
