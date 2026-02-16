# Phase 2: bkend.ai Setup Guide

> **Phase**: Do (Implementation)
> **Feature**: News System with bkend.ai BaaS
> **Date**: 2026-02-15

---

## 1. bkend.ai Project Creation

### Method 1: Using bkend.ai MCP (Recommended)

Since bkend.ai MCP is already connected (`.mcp.json`), you can use natural language commands:

```bash
# Check existing projects
"Show my bkend projects"

# Create new project
"Create a new bkend project named 'ontools'"

# Select environment
"Show environments for project ontools"
```

**Benefits**:
- No manual browser navigation
- Automatic OAuth authentication
- Direct project ID retrieval
- Instant environment setup

### Method 2: Manual Creation (Fallback)

If MCP is not responding, use the web console:

1. **Access bkend.ai Console**
   - Visit: https://console.bkend.ai
   - Sign in with Google/GitHub account

2. **Create Organization (if first time)**
   - Click "Create Organization"
   - Name: `ontools` or your preferred name
   - Click "Create"

3. **Create Project**
   - Click "+ New Project"
   - Project Name: `ontools`
   - Description: "실생활 유틸리티 도구 + 자동 뉴스 포털"
   - Click "Create Project"

4. **Get Project ID**
   - Click on the created project
   - Copy **Project ID** from the project settings
   - Format: `proj_xxxxxxxxxxxxxxxxxxxxxx`

5. **Create Development Environment**
   - Navigate to "Environments" tab
   - Click "+ New Environment"
   - Name: `dev`
   - Click "Create"

---

## 2. Environment Variables Configuration

### 2.1 Update `.env.local`

Create or update the file with your bkend.ai credentials:

```bash
# bkend.ai Configuration (Phase 2)
NEXT_PUBLIC_BKEND_API_URL=https://api.bkend.ai/v1
NEXT_PUBLIC_BKEND_PROJECT_ID=proj_your_actual_project_id_here
NEXT_PUBLIC_BKEND_ENV=dev

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://ontools.vercel.app

# Google AdSense (Phase 3에서 사용)
# NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

### 2.2 Update `.env.example`

Update the example file for other developers:

```bash
# bkend.ai Configuration
NEXT_PUBLIC_BKEND_API_URL=https://api.bkend.ai/v1
NEXT_PUBLIC_BKEND_PROJECT_ID=proj_your_project_id_here
NEXT_PUBLIC_BKEND_ENV=dev

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Google AdSense (Phase 3)
# NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

### 2.3 Verify Configuration

Test the bkend.ai connection:

```typescript
// Test in app/api/test-bkend/route.ts (temporary)
import { bkend } from '@/lib/bkend'

export async function GET() {
  try {
    // Test connection (will return 401 if not authenticated, which is expected)
    const result = await bkend.data.list('_health')
    return Response.json({ status: 'connected', result })
  } catch (error) {
    return Response.json({ status: 'error', message: error.message }, { status: 500 })
  }
}
```

Visit `http://localhost:3001/api/test-bkend` to verify connection.

---

## 3. Data Model Setup

### 3.1 News Table Schema

Create the `News` table in bkend.ai:

**Using MCP**:
```
"Create a table named 'news' with the following columns:
- title (text, required)
- summary (text, required)
- original_content (text, required)
- source (text, required)
- published_at (datetime, required)
- categories (array of text, required)
- related_tools (array of text, required)
- url (text, required, unique)"
```

**Manual (Web Console)**:
1. Navigate to "Tables" in project dashboard
2. Click "+ New Table"
3. Table Name: `news`
4. Add columns:

| Column Name | Type | Required | Unique | Default |
|-------------|------|----------|--------|---------|
| `title` | Text | ✅ | ☐ | - |
| `summary` | Text | ✅ | ☐ | - |
| `original_content` | Text | ✅ | ☐ | - |
| `source` | Text | ✅ | ☐ | - |
| `published_at` | DateTime | ✅ | ☐ | - |
| `categories` | JSON (Array) | ✅ | ☐ | `[]` |
| `related_tools` | JSON (Array) | ✅ | ☐ | `[]` |
| `url` | Text | ✅ | ✅ | - |

5. Click "Create Table"

### 3.2 ExchangeRate Table Schema

Create the `exchange_rates` table:

**Using MCP**:
```
"Create a table named 'exchange_rates' with the following columns:
- currency_code (text, required) - USD, JPY, EUR, CNY
- rate (number, required) - Exchange rate to KRW
- date (datetime, required) - Rate effective date
- is_weekend (boolean, default false) - Weekend fallback flag"
```

**Manual (Web Console)**:

| Column Name | Type | Required | Unique | Default |
|-------------|------|----------|--------|---------|
| `currency_code` | Text | ✅ | ☐ | - |
| `rate` | Number | ✅ | ☐ | - |
| `date` | DateTime | ✅ | ☐ | - |
| `is_weekend` | Boolean | ✅ | ☐ | `false` |

**Composite Unique Index**: `currency_code + date` (prevent duplicate rates)

---

## 4. Authentication Setup (Optional for Phase 2)

Since Phase 1 doesn't require user authentication, we'll prepare the auth structure for future phases:

### 4.1 Enable Authentication in bkend.ai

1. Navigate to "Authentication" in project settings
2. Enable "Email/Password Authentication"
3. Configure allowed domains (optional)
4. Set token expiration:
   - Access Token: 1 hour (default)
   - Refresh Token: 7 days (default)

### 4.2 Update Auth Client

The `lib/bkend.ts` already has auth methods prepared. No changes needed for Phase 2.

---

## 5. Access Control & Security

### 5.1 Table Permissions

**News Table**:
- Read: Public (anyone can read news)
- Create: Server-only (n8n workflows)
- Update: Admin-only
- Delete: Admin-only

**ExchangeRate Table**:
- Read: Public (anyone can read rates)
- Create: Server-only (n8n workflows)
- Update: Server-only
- Delete: Admin-only

**Configure via MCP**:
```
"Set permissions for table 'news':
- Allow public read access
- Restrict create/update/delete to authenticated users only"
```

**Manual (Web Console)**:
1. Tables → Select table → Permissions tab
2. Set role-based access rules
3. Enable Row-Level Security (RLS) if needed

---

## 6. Testing the Setup

### 6.1 Create Test Data

Insert sample news item:

**Using MCP**:
```
"Insert a test news item into the 'news' table:
- title: '최저임금 2026년 1만 30원 확정'
- summary: '최저임금위원회가 2026년 적용 최저임금을 시간당 1만 30원으로 의결했다. 전년 대비 3.2% 인상된 금액이다.'
- source: 'test'
- published_at: 2026-02-15T09:00:00Z
- categories: ['labor', 'finance']
- related_tools: ['salary', 'retirement']
- url: 'https://example.com/test-news'
- original_content: '전체 기사 내용...'"
```

**Using REST API** (via `lib/bkend.ts`):
```typescript
const newsItem = await bkend.data.create('news', {
  title: '최저임금 2026년 1만 30원 확정',
  summary: '최저임금위원회가 2026년 적용 최저임금을 시간당 1만 30원으로 의결했다.',
  original_content: '전체 기사 내용...',
  source: 'test',
  published_at: new Date().toISOString(),
  categories: ['labor', 'finance'],
  related_tools: ['salary', 'retirement'],
  url: 'https://example.com/test-news'
})
```

### 6.2 Query Test Data

```typescript
// Fetch all news items
const allNews = await bkend.data.list('news')

// Filter by category
const laborNews = await bkend.data.list('news', {
  filter: JSON.stringify({ categories: { $contains: 'labor' } })
})

// Filter by related tool
const salaryNews = await bkend.data.list('news', {
  filter: JSON.stringify({ related_tools: { $contains: 'salary' } })
})
```

---

## 7. n8n Workflow Setup (Next Step)

Once bkend.ai is configured, proceed to n8n workflow setup for automated news crawling.

See: `docs/02-design/phase2-n8n-workflows.md`

---

## Troubleshooting

### Issue: "Project ID not found"
- **Solution**: Verify `NEXT_PUBLIC_BKEND_PROJECT_ID` starts with `proj_`
- Check console.bkend.ai → Project Settings → Copy exact ID

### Issue: "401 Unauthorized"
- **Solution**: bkend.ai requires authentication for most operations
- Phase 2 will use server-side API routes with proper auth
- Public read access is configured via table permissions

### Issue: "CORS error in browser"
- **Solution**: Register your domain in bkend.ai project settings
- Development: Add `http://localhost:3001` to allowed origins
- Production: Add `https://ontools.vercel.app`

### Issue: "MCP not responding"
- **Solution**: Restart Claude Code or verify MCP connection
- Run `claude mcp list` to check connected servers
- Fallback to manual web console

---

## Next Steps

After completing this setup:

1. ✅ bkend.ai project created
2. ✅ Environment variables configured
3. ✅ News and ExchangeRate tables created
4. ⏭️ Configure n8n workflows
5. ⏭️ Implement news feed UI
6. ⏭️ Test end-to-end news pipeline

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-15 | Initial Phase 2 bkend.ai setup guide |
