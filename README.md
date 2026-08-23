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

### Neon database setup

```bash
# After setting DATABASE_URI
npm run db:push
```

## Private CMS

The CMS is **not public** — `/admin` is protected by middleware, excluded from `robots.txt`, and marked `noindex`.

- **Login:** `/admin/login`
- **Dashboard:** `/admin`
- **Articles:** create, edit, publish, delete with 5 templates:
  - Text only
  - Image + text
  - Media kit (image + file upload)
  - Case study (metrics)
  - Insight brief (takeaways)

Uploaded files are stored in `public/uploads/cms/`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push Drizzle schema to Neon |
| `npm run db:generate` | Generate migrations |
| `npm run db:studio` | Open Drizzle Studio |
