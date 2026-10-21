# TestBuddy Hub — URL access, no sign-in

The mobile-first workspace lives at `/development`. It is not linked from the public website, and its pages send `noindex, nofollow, noarchive` headers. These discourage indexing; they do not restrict access. Anyone who knows or discovers the URL can read, upload, download, publish, and manage tasks. There are no Admin/Member permissions, verified tester identities, passcodes, or account requirements in this version. Tester and task-owner names are entered manually.

## Supabase setup — what to run

1. In your Supabase project, open **SQL Editor → New query**.
2. Copy **all** of `supabase/testbuddy-url-access.sql`, paste it into the editor, and click **Run**.
3. The script creates the eight tables and private Storage bucket on a new database, or updates the previous Hub migration to URL-access mode. Existing Hub content is retained. It can be rerun. The revised script uses standalone `CREATE TABLE IF NOT EXISTS` statements rather than nested bootstrap SQL. Run the whole file in a new query; do not copy only an `IF` block or an `END IF` line. It changes policies only for Hub content tables and the Hub's named Storage policies. The legacy `members` table stays restricted and is no longer used by the application.
4. In Vercel, confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set for your deployment environment. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` can replace the anon key. No service-role key is needed.
5. Deploy the updated application code and redeploy after environment variable changes. Open `/development` directly. You do not need to create any Auth users or admin records.

Adding the URL/key connects the application to Supabase; running SQL creates the records, upload bucket, and permissions the connection uses. The application does not run remote migrations automatically. Supabase's public/anon API role has content access in this mode, so API access is also unrestricted for someone with the project URL and public key. The private bucket disables permanent public object URLs; it does not make the Hub access-controlled. Downloads obtain signed links that expire after 60 seconds.

CLI users can apply the versioned migrations in order through their usual `supabase db push` workflow instead of using the combined SQL Editor script. Do not run only the original membership migration: it enforces the old sign-in model. Inspect naming conflicts before using the script in a project with unrelated tables named `builds`, `tasks`, etc.

## Features

- **Builds:** upload a bundle, enter version, notes, installation instructions, and known issues. Save a draft or publish; older releases stay available.
- **Documents:** Markdown content and PDF/Markdown attachments, grouped as Architecture, Standards, Setup, and Manual. Markdown rendering disables raw HTML and remote images.
- **Progress:** reporting dates, weekly summaries, and PDF/Markdown attachments.
- **Testing:** select a published build, enter a name and findings, and optionally attach reports/screenshots. Names are self-reported, not authenticated.
- **Tasks:** convert reports into tasks, enter owner names, edit priority/details, and move Open → In progress → Retest → Done. All visitors have the same editing rights.
- **Upcoming:** add shared dates on Home. Dates display in Asia/Kolkata.

**Lossless compression** is enabled by default on upload and can be turned off. The browser tries gzip and keeps it only when it saves at least 1 KB and 2%. It never resizes images, changes PDF rendering, or re-encodes builds. Downloads and previews restore the exact original bytes and filename in the browser, so build signatures and image quality are preserved. ZIP/APK/JPEG and other compressed formats may not shrink. Savings appear on file cards and upload confirmations. Original files remain limited to 25 MB combined, even if compression could make a larger file fit. Unsupported compression APIs fall back to storing the original. On browsers unable to decompress, the fallback download is a `.gz` archive that can be extracted locally. Compression needs the `files.compression` and `files.original_size` columns included in the complete setup script or migration `202610210003_lossless_uploads.sql`.

Uploads support up to five files totalling **25 MB per submission**. Bundles support ZIP, APK, AAB, IPA, EXE, MSI, DMG, TAR, GZ, and AppImage. Reports/screenshots support PDF, Markdown, PNG, JPEG, and WebP. Files upload directly from the browser to Supabase, bypassing Vercel’s request-body size limit; only metadata is submitted through server actions. JavaScript is required for uploads. Storage uploads use random `shared/<file-id>/<filename>` paths. Metadata is stored separately in Postgres. Records with file attachments remain drafts until upload completion where publishing applies.

## Development and verification

Use Node.js 24 and npm 11 (minimum supported Node depends on the pinned dependencies). Use the existing isolated checkout; do not create a Git worktree unless requested.

```sh
cd /workspace/Apexweb
npm ci --cache /workspace/.npm --no-audit --no-fund
npm run test:development
npm run build
npm run dev -- --hostname 0.0.0.0
```

Cloud snapshots retain files/dependencies, but application processes must restart. If networking is restricted, allow the specific Supabase project hostname from your configured URL. Never disable TLS verification.

Tests apply the real SQL in embedded Postgres with minimal Auth/Storage schema fixtures. The original permission suite tests the historical migration; the URL-access suite tests the current anonymous workflow, bucket scoping, migration upgrades, and repeatability. Browser checks use local fixture data, not production credentials. Live Supabase upload/download checks require the configured project and applied SQL.

Acceptance check: without signing in, upload/publish a build, download it, submit a named testing report, convert it to a task, assign an owner name, and move it through retest to Done. Confirm Markdown/PDF attachments and Upcoming dates work on a phone screen. The public site should have no navigation link to the Hub.
