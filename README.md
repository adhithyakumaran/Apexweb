# Apex Node Technologies — Marketing Site

Next.js marketing site for **Apex Node Technologies** with a public marketing surface, article hub, live chat widget, and a private CMS for content and operations.

**Production:** [apexweb-three.vercel.app](https://apexweb-three.vercel.app)

---

## Table of contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Public site](#public-site)
- [Private CMS](#private-cms)
- [Articles & templates](#articles--templates)
- [Live chatbot](#live-chatbot)
- [Analytics](#analytics)
- [Pipeline logs](#pipeline-logs)
- [Uptime monitoring](#uptime-monitoring)
- [Alerts & weekly digest](#alerts--weekly-digest)
- [Database](#database)
- [File uploads (R2)](#file-uploads-r2)
- [Cron jobs](#cron-jobs)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Notes for future developers](#notes-for-future-developers)

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui primitives |
| Animation | Motion (Framer Motion successor) |
| Database | Neon PostgreSQL via Drizzle ORM |
| File storage | Cloudflare R2 (production) / `public/uploads/` (local) |
| Analytics | PostHog (client + HogQL dashboard) |
| Chat AI | Groq API (Qwen 3.6 default) |
| Hosting | Vercel |

---

## Project structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── admin/              # CMS dashboard (protected)
│   ├── api/
│   │   ├── chat/           # Public chat widget endpoint
│   │   ├── cms/            # CMS CRUD APIs (protected)
│   │   └── cron/           # Vercel cron handlers
│   ├── articles/           # Public article pages
│   └── agents/             # Agent detail pages
├── components/
│   ├── admin/              # CMS UI (shell, tables, dashboards)
│   ├── chat/               # Live chat widget
│   ├── layout/             # Site chrome, footer, navbar
│   ├── sections/           # Homepage sections (hero, moat, agents, …)
│   └── navigation/         # Nav, mega menus, search
├── config/                 # Static site config (nav, agents, articles seed)
├── lib/
│   ├── alerts/             # Email, Teams, SMS dispatch + digest
│   ├── analytics/          # PostHog query helpers
│   ├── chatbot/            # Groq client, knowledge builder, crawler
│   ├── cms/                # Auth, articles repo, R2, activity logs
│   ├── db/                 # Drizzle schema + Neon connection
│   └── monitoring/         # Pipeline logs, Sentry, UptimeRobot
└── middleware.ts           # CMS route protection
```

---

## Getting started

```bash
npm install
cp .env.example .env.local
# Fill in DATABASE_URI and PAYLOAD_SECRET at minimum
npm run dev -- --port 4318
```

Open [http://localhost:4318](http://localhost:4318).

**CMS login:** [http://localhost:4318/admin/login](http://localhost:4318/admin/login)  
Default password: `apex-admin` (override with `CMS_ADMIN_PASSWORD`).

---

## Environment variables

Copy `.env.example` to `.env.local`. All variables are optional unless noted.

### Core (recommended)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URI` | Neon PostgreSQL connection string. Without it, CMS data falls back to local JSON files in `data/` (dev only). |
| `PAYLOAD_SECRET` | HMAC secret for CMS session cookies. **Required in production.** |
| `CMS_ADMIN_PASSWORD` | Password for `/admin/login` (default: `apex-admin`) |

### Cloudflare R2 (required on Vercel for uploads)

| Variable | Purpose |
| --- | --- |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_BUCKET_NAME` | Bucket name |
| `R2_PUBLIC_URL` | Public base URL for uploaded files (no trailing slash) |
| `R2_ENDPOINT` | Optional custom S3 endpoint |

### PostHog analytics

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | Client-side project token |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host (default: `https://us.i.posthog.com`) |
| `POSTHOG_PERSONAL_API_KEY` | Personal API key with **Query Read** for `/admin/analytics` |
| `POSTHOG_PROJECT_ID` | Numeric project ID |

### Google Analytics

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GA_REPORT_URL` | Looker Studio or GA4 share URL embedded at `/admin/analytics/google` |

### Live chatbot (Groq)

| Variable | Purpose |
| --- | --- |
| `GROQ_API_KEY` | Groq API key — required for the public chat widget |
| `GROQ_MODEL` | Optional model override (default: `qwen/qwen3.6-27b`) |

### Sentry (optional — pipeline logs)

| Variable | Purpose |
| --- | --- |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | Error tracking |
| `SENTRY_AUTH_TOKEN` | API token for `/admin/logs` Sentry stream |
| `SENTRY_ORG` | Sentry organization slug |
| `SENTRY_PROJECT` | Sentry project slug |

### UptimeRobot (external uptime)

| Variable | Purpose |
| --- | --- |
| `UPTIMEROBOT_API_KEY` | Main API key for `/admin/uptime` dashboard |
| `NEXT_PUBLIC_UPTIMEROBOT_STATUS_PAGE_URL` | Public status page link |
| `NEXT_PUBLIC_UPTIMEROBOT_DASHBOARD_URL` | Optional dashboard URL override |

### Pipeline logs (optional deploy/commit streams)

| Variable | Purpose |
| --- | --- |
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `GITHUB_TOKEN` | GitHub PAT for commit stream |
| `GITHUB_REPO` | Repo in `owner/name` format |

### Alerts (email, Teams, SMS)

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key for email alerts |
| `ALERT_FROM_EMAIL` | Sender address for alert emails |
| `TWILIO_ACCOUNT_SID` | Twilio account SID for SMS |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_FROM_NUMBER` | Twilio sender number |
| `CRON_SECRET` | Bearer token for Vercel cron routes (`Authorization: Bearer …`) |

---

## Public site

| Route | Description |
| --- | --- |
| `/` | Homepage — hero, agents, moat, testimonials, contact |
| `/agents` | Agent catalog |
| `/agents/[slug]` | Individual agent pages |
| `/what-we-do` | Services overview |
| `/articles` | Article hub |
| `/articles/[slug]` | Article detail (template-driven) |
| `/contact` | Contact form and office info |

**Theme:** Light mode by default (`defaultTheme="light"` in `SiteChrome`).  
**Layout shell:** `src/components/layout/site-chrome.tsx` wraps all public pages with navbar, footer, loading screen, and chat widget. Admin routes skip the public chrome.

---

## Private CMS

The CMS is **not public**:

- `/admin` and `/api/cms/*` are protected by `src/middleware.ts`
- Excluded from `robots.txt` and marked `noindex`
- Session cookies are HMAC-signed, httpOnly, 8-hour TTL

### CMS routes

| Route | Description |
| --- | --- |
| `/admin/login` | CMS sign-in (do not redesign without explicit request) |
| `/admin` | Dashboard overview |
| `/admin/articles` | Article list, create, edit, publish, delete |
| `/admin/analytics` | PostHog visitor analytics |
| `/admin/analytics/google` | Google Analytics embed |
| `/admin/logs` | Terminal-style pipeline monitor |
| `/admin/uptime` | UptimeRobot monitor panel |
| `/admin/alerts` | Alert channel settings + test sends |
| `/admin/chatbot` | Chatbot settings, memory, site crawl |

**Sidebar navigation** is defined in `src/components/admin/admin-shell.tsx`.

---

## Articles & templates

Articles are stored in `cms_articles` (Neon) or `data/cms-articles.json` (local dev fallback).

### CMS input templates (editor)

| Template ID | Use case |
| --- | --- |
| `text` | Text-only article |
| `image-text` | Hero image + body |
| `media-kit` | Image + downloadable file |
| `case-study` | Metrics-focused case study |
| `insight` | Insight brief with takeaways |

### Display templates (public page)

Rendered by components in `src/components/articles/templates/`:

- `standard` — default long-form
- `case-study` — metrics layout
- `insight` — takeaways layout
- `agent-spotlight` — agent feature layout

**Repository:** `src/lib/cms/articles-repository.ts` — dual Neon/file-store adapter.  
**Uploads:** `src/lib/cms/storage.ts` — R2 on Vercel, local disk in dev.

---

## Live chatbot

Five on-brand agents power the marketing narrative (Sentinel, TestBuddy, Hermes, Prism, Atlas). The **public widget** calls `POST /api/chat`.

### How it works

1. Widget sends last 10 messages to `/api/chat`
2. Server loads CMS chatbot settings + knowledge memory
3. `buildChatKnowledgeContext()` merges static site copy, published articles, and crawled/uploaded memory
4. Groq returns a short reply (max ~220 tokens); `parseHumanHandoff()` detects escalation phrases

### CMS chatbot admin (`/admin/chatbot`)

- Enable/disable widget
- Model selection (Qwen 3.6 default; GPT-OSS alternatives)
- System prompt, tone, skills
- Site crawl (`/api/cms/chatbot/crawl`) — indexes public pages into memory
- Manual memory uploads (text, URL, file)

**Key files:**

- `src/app/api/chat/route.ts` — public chat API
- `src/lib/chatbot/groq.ts` — Groq client with model fallback chain
- `src/lib/chatbot/knowledge.ts` — knowledge context builder
- `src/components/chat/chat-widget.tsx` — floating widget UI

---

## Analytics

### PostHog (`/admin/analytics`)

- Client tracking via `instrumentation-client.ts` (excludes `/admin` routes)
- Dashboard uses HogQL queries cached for 45 minutes to stay within API limits
- Requires `POSTHOG_PERSONAL_API_KEY` + `POSTHOG_PROJECT_ID`

### Google Analytics (`/admin/analytics/google`)

- Embeds a report URL from `NEXT_PUBLIC_GA_REPORT_URL` (Looker Studio or GA4 share link)
- Configure the URL in Vercel env when ready

---

## Pipeline logs

`/admin/logs` is a terminal-style operations dashboard that aggregates:

| Stream | Source | Env required |
| --- | --- | --- |
| CMS activity | `cms_activity_logs` table | Database |
| Sentry errors | Sentry Issues API | `SENTRY_*` vars |
| Vercel deploys | Vercel Deployments API | `VERCEL_TOKEN` |
| GitHub commits | GitHub Commits API | `GITHUB_TOKEN`, `GITHUB_REPO` |
| Health probe | HTTP check to site root | None |

**Aggregator:** `src/lib/monitoring/pipeline-logs.ts`  
**Export:** CSV and printable HTML via `/api/cms/logs/export`

---

## Uptime monitoring

Uptime is handled by **UptimeRobot** (external), not built-in HTTP checks.

`/admin/uptime` reads monitors via the UptimeRobot API and links to your status page.

| Variable | Purpose |
| --- | --- |
| `UPTIMEROBOT_API_KEY` | Fetches monitor list + status |
| `NEXT_PUBLIC_UPTIMEROBOT_STATUS_PAGE_URL` | Public status page link in UI |

**Implementation:** `src/lib/monitoring/uptimerobot-query.ts`

---

## Alerts & weekly digest

Configure at `/admin/alerts`:

| Channel | Provider | Env |
| --- | --- | --- |
| Email | Resend | `RESEND_API_KEY`, `ALERT_FROM_EMAIL` |
| Microsoft Teams | Incoming webhook | Set in CMS UI |
| SMS | Twilio | `TWILIO_*` vars |

### Weekly digest cron

- **Schedule:** Mondays 09:00 UTC (`vercel.json`)
- **Route:** `GET /api/cron/digest`
- **Auth:** `Authorization: Bearer $CRON_SECRET`
- **Toggle:** Enable "Weekly digest" in `/admin/alerts`

**Dispatch logic:** `src/lib/alerts/dispatch.ts`  
**Digest builder:** `src/lib/alerts/digest.ts`

---

## Database

### Schema (`src/lib/db/schema.ts`)

| Table | Purpose |
| --- | --- |
| `cms_articles` | Published and draft articles |
| `cms_activity_logs` | CMS audit trail (login, publish, upload, …) |
| `cms_chatbot_settings` | Chatbot config singleton |
| `cms_chatbot_memory` | Crawled pages + uploaded knowledge |
| `cms_alert_settings` | Alert channel config singleton |

### Setup options

**Option A — automatic (Vercel):**  
`npm run build` runs `drizzle-kit push` when `DATABASE_URI` is set.

**Option B — local:**

```bash
npm run db:push
```

**Option C — SQL in Neon console:**

- `drizzle/0000_init_cms_articles.sql`
- `drizzle/0001_init_cms_activity_logs.sql`

### Local fallback

Without `DATABASE_URI`, CMS reads/writes JSON files under `data/` (local dev only; not available on Vercel).

---

## File uploads (R2)

1. Cloudflare Dashboard → **R2** → Create bucket
2. Enable **Public access** (R2.dev subdomain or custom domain)
3. Create API token with **Object Read & Write**
4. Add R2 env vars to Vercel
5. Redeploy

Without R2 on Vercel, article text saves but image/file uploads fail.

---

## Cron jobs

Defined in `vercel.json`:

| Path | Schedule | Purpose |
| --- | --- | --- |
| `/api/cron/digest` | `0 9 * * 1` (Mon 09:00 UTC) | Weekly alert digest |

> **Note:** Vercel Hobby plan only supports daily-or-less-frequent crons. Sub-minute schedules are not supported.

All cron routes require `Authorization: Bearer $CRON_SECRET`.

---

## Deployment

Hosted on **Vercel** from the `main` branch.

```bash
npm run build   # drizzle push + next build
npm run start   # production server
```

Set all required env vars in Vercel → Settings → Environment Variables, then redeploy.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Push schema (if configured) + production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:push` | Push Drizzle schema to Neon |
| `npm run db:generate` | Generate SQL migrations |
| `npm run db:studio` | Open Drizzle Studio |

---

## Notes for future developers

### Authentication flow

1. `POST /api/cms/login` validates password → `createCmsSession()` sets HMAC cookie
2. `middleware.ts` verifies cookie on every `/admin` and `/api/cms` request
3. Edge-compatible verification lives in `src/lib/cms/auth-edge.ts`

### Adding a new CMS page

1. Create page under `src/app/admin/<name>/page.tsx`
2. Add nav item in `src/components/admin/admin-shell.tsx`
3. If it needs an API, add route under `src/app/api/cms/<name>/`
4. Middleware protects it automatically

### Chatbot tone

Replies are intentionally short (1–2 sentences). Rules live in `CHAT_SYSTEM_RULES` inside `src/lib/chatbot/knowledge.ts`. Do not add a sixth marketing agent without product approval.

### PostHog rate limits

The analytics dashboard batches data into a single HogQL query per sync with a 45-minute cache. Avoid adding per-widget live queries.

### Mobile / iOS

- Viewport config: `src/app/viewport.ts` (`viewportFit: cover` for notched devices)
- Safe-area padding utilities in `src/app/globals.css` (`.safe-bottom`, `.safe-x`)
- Chat widget and navbar respect `env(safe-area-inset-*)`

### What not to change without explicit request

- `/admin/login` page design
- Default light theme
- Five chatbot agent personas
