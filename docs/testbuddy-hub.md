# TestBuddy Hub

The mobile-first, monochrome workspace at `/development` has just three sections:

1. **Releases:** create a release name such as “Release beta 1”, open its package, and add separate installer, guide, notes, or checksum files. Add more files later with no total package-file count limit. Each file can have a comment, entered during upload or edited afterwards. EXE files are explicitly supported, along with MSI, APK, ZIP, PDF, Markdown, TXT/SHA256, and the other accepted release formats.
2. **Tester reports:** enter your name and upload a PDF or Markdown file. No findings form or release selection is required.
3. **Progress:** enter an update name and upload a PDF or Markdown file. Dates are recorded automatically.

There are no Documents, Tasks, calendar, membership, or sign-in screens. Existing database records in legacy tables are retained; this change does not delete previous content. Anyone who discovers the URL/API can read, upload, download, and edit release-file comments. The Hub is unlinked from public navigation, excluded in robots.txt, and sends noindex headers; these are not access controls.

## Existing installations — one SQL update

In **Supabase → SQL Editor → New query**, paste and run all of:

`supabase/migrations/202610210004_simple_release_hub.sql`

This adds file comments and progress titles, permits reports without a linked build, and raises the per-file limit to 50 MB. It preserves existing content and can be rerun. Deploy the updated application to Vercel after applying it. No Auth users, admin records, or new environment variables are needed.

## New installation or recovery

Run the complete `supabase/testbuddy-url-access.sql` in Supabase SQL Editor. It includes every migration, supports fresh/previous Hub databases and repeat runs, and uses standalone table creation rather than a nested bootstrap. Inspect naming conflicts before applying it to a project with unrelated tables named `builds`, `files`, etc. CLI users can apply the versioned migrations in order through their normal linked-project workflow.

Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the relevant Vercel deployment environment; `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` may replace the anon key. These are public client configuration. No service-role key is used. Vercel must deploy `main`, which contains the selected public design plus the Hub.

## Uploads and storage

Each original file may be up to **50 MB**. Releases accept multiple files per upload and more batches later; there is no combined 25 MB or five-file package cap. The project’s Supabase Storage settings and available quota must also permit the upload size. Files travel directly from the browser to Supabase, so bundle bytes do not pass through Vercel’s request-body limit. Server actions receive metadata only.

Lossless compression is on by default and can be switched off. Gzip is retained only when it saves at least 1 KiB and 2%. Downloads and previews restore the exact original bytes and filename in the browser, preserving build signatures and image quality. Already-compressed files may not shrink. Older browsers without compression support upload originals; a reader unable to decompress can download a `.gz` archive and extract it locally.

Metadata lives in Postgres; file bytes live in the private `development-files` bucket under random `shared/<file-id>/<filename>` paths. Signed download URLs expire after 60 seconds. The bucket’s private flag disables permanent public-object URLs; anonymous API access is explicitly permitted in this URL-access mode. File comments can be edited without permitting changes to the stored path, compression data, or size.

## Public site and development

The public site stays based on commit `74adecadde7936855d4e9b2837e3e96ed1397214`: background-image hero, CMS, and chat. `/development` bypasses the public SiteChrome. Existing middleware still protects `/admin` and `/api/cms`. Public/admin font families are self-hosted with their licenses.

Use the existing isolated checkout; do not create a Git worktree unless requested. Use Node.js 24/npm 11:

```sh
cd /workspace/Apexweb
npm ci --cache /workspace/.npm --no-audit --no-fund
npm run test:development
npx next build
npm run dev -- --hostname 0.0.0.0
```

`npx next build` checks compilation without invoking the pre-existing `npm run build` wrapper, which may push the CMS schema when configured. Cloud snapshots retain files/dependencies, but processes must restart. Restrict network additions to the actual Supabase project hostname when needed; keep TLS verification enabled.

Tests validate the actual SQL with embedded Postgres fixtures, migration preservation/repeatability, release grouping and comments, unlinked reports, allowed upload formats, and lossless compression. Historical permission tests still cover the old migration, not the current access model. Fixture browser checks do not establish live Supabase readiness.

Acceptance check: create “Release beta 1”; add an EXE, three Markdown guides and SHA256.txt; add another file later; edit a file comment; download the EXE and verify its original bytes; upload a named tester report; upload a titled progress file. Check at phone widths and confirm the public site design remains unchanged.
