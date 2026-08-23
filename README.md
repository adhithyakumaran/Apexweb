# Apex Node Technologies — Marketing Site

Next.js marketing site for Apex Node Technologies with articles, services, agents, site search, and a private CMS.

## Run locally

```bash
npm install
npm run dev -- --port 4318
```

Open [http://localhost:4318](http://localhost:4318).

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URI` | Neon PostgreSQL connection string (optional; uses local JSON file store if unset) |
| `PAYLOAD_SECRET` | HMAC secret for CMS session cookies |
| `CMS_ADMIN_PASSWORD` | Password for `/admin/login` (default: `apex-admin`) |
| `R2_ACCOUNT_ID` | Cloudflare account ID (for CMS uploads) |
| `R2_ACCESS_KEY_ID` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | Public URL for uploaded files (R2 dev subdomain or custom domain) |

### Neon database setup

**Option A — automatic (recommended on Vercel):**  
`npm run build` runs `drizzle-kit push` first and creates the `cms_articles` table using `DATABASE_URI`.

**Option B — run locally once:**

```bash
# With DATABASE_URI in .env.local
npm run db:push
```

**Option C — run SQL in Neon console:**  
Open Neon → SQL Editor → paste and run:
- `drizzle/0000_init_cms_articles.sql`
- `drizzle/0001_init_cms_activity_logs.sql`

## Private CMS

The CMS is **not public** — `/admin` is protected by middleware, excluded from `robots.txt`, and marked `noindex`.

- **Login:** `/admin/login`
- **Dashboard:** `/admin`
- **Articles:** create, edit, publish, delete with 5 templates:
- **Analytics:** `/admin/analytics` — PostHog visitor traffic, engagement, sources, and Web Vitals
- **Logs:** `/admin/logs` — audit trail for sign-ins, publishes, uploads, and edits
  - Text only
  - Image + text
  - Media kit (image + file upload)
  - Case study (metrics)
  - Insight brief (takeaways)

Uploaded files are stored in **Cloudflare R2** on production (or `public/uploads/cms/` locally).

### Cloudflare R2 (required for image uploads on Vercel)

1. In **Cloudflare Dashboard** → **R2** → **Create bucket** (e.g. `apexweb-cms`)
2. Enable **Public access** for the bucket (R2.dev subdomain or connect a custom domain)
3. **R2** → **Manage R2 API Tokens** → Create token with **Object Read & Write** for your bucket
4. Add these to Vercel **Environment Variables**:

```env
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=apexweb-cms
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

`R2_PUBLIC_URL` is the public base URL where files are served (from R2 bucket settings → Public access, or your custom domain). Do not include a trailing slash.

5. Redeploy

Without R2 configured, article text still saves to Neon, but image/file uploads will fail on Vercel.

### PostHog analytics (visitor tracking)

1. Create a PostHog project and copy your **project token** and **host**
2. Add to Vercel:

```env
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

3. For the `/admin/analytics` dashboard (reads data from PostHog), also add:
   - `POSTHOG_PERSONAL_API_KEY` — personal API key with **Query Read** scope ([PostHog user settings](https://us.posthog.com/settings/user-api-keys))
   - `POSTHOG_PROJECT_ID` — numeric project ID from PostHog project settings

The dashboard uses **one HogQL query per sync**, cached for 45 minutes, to stay within PostHog API limits. Public `/admin` routes are excluded from tracking.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push Drizzle schema to Neon |
| `npm run db:generate` | Generate migrations |
| `npm run db:studio` | Open Drizzle Studio |
