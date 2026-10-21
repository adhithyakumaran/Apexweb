# TestBuddy Hub

The compact, mobile-first workspace at `/development` shows all three sections on one page. The Hub uses only a light theme, with blue primary actions and green download buttons. Cards, controls, and previews have square corners and compact spacing. The theme is scoped to the Hub and does not change the public site. Markdown previews support tables and checklists; PDFs include a new-tab fallback.

1. **Releases:** create a release name such as “Release beta 1”, and add separate installer, guide, notes, or checksum files. Add more files later with no total package-file count limit. Release cards show their files and View/Download actions directly on the home page. Each file can have a comment, entered during upload or edited afterwards. EXE files are explicitly supported, along with MSI, APK, ZIP, PDF, Markdown, TXT/SHA256, and the other accepted release formats.
2. **Tester reports:** enter your name and upload a PDF or Markdown file. No findings form or release selection is required.
3. **Progress:** enter an update name and upload a PDF or Markdown file. Dates are recorded automatically.

There are no Documents, Tasks, calendar, membership, or sign-in screens. Existing database records in legacy tables are retained; this change does not delete previous content. Anyone who discovers the URL/API can read, upload, download, and edit release-file comments. The Hub is unlinked from public navigation, excluded in robots.txt, and sends noindex headers; these are not access controls.

Legacy section and release links redirect to the appropriate section or release card on `/development`. The theme/layout update requires no additional SQL.

## File management update

Run `supabase/migrations/202610220007_file_management.sql` after the R2 migration below. Every file has a three-dot menu with Rename and Delete. Rename changes the displayed/download filename while preserving the extension, object path, and provider. Delete requires an inline confirmation, removes bytes from R2 or Supabase, and then removes the metadata entry. If metadata deletion fails after storage succeeds, retry Delete to finish. Empty release/report/progress entries remain available; deleting a file does not delete its parent entry. Release-file comments are also available inside the three-dot menu.

## Existing installations — R2 EXE update

In **Supabase → SQL Editor → New query**, paste and run `supabase/migrations/202610220006_r2_exe_storage.sql`. This records the storage provider, supports EXEs up to 250 MB in R2, and keeps other files in Supabase with its 50 MB limit. It preserves existing content and can be rerun. Migration 005 is not required first.

Installations that predate the simplified release Hub should apply `supabase/migrations/202610210004_simple_release_hub.sql` first for comments, progress titles, and reports without a linked build. Deploy the updated application to Vercel after applying the SQL. No Auth users, admin records, or new environment variable names are needed.

## New installation or recovery

Run the complete `supabase/testbuddy-url-access.sql` in Supabase SQL Editor. It includes every migration, supports fresh/previous Hub databases and repeat runs, and uses standalone table creation rather than a nested bootstrap. Inspect naming conflicts before applying it to a project with unrelated tables named `builds`, `files`, etc. CLI users can apply the versioned migrations in order through their normal linked-project workflow.

Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the relevant Vercel deployment environment; `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` may replace the anon key. These are public client configuration. No service-role key is used. Vercel must deploy `main`, which contains the selected public design plus the Hub.

## Uploads and storage

EXE installers upload directly to Cloudflare R2, unchanged, up to **250 MB** per file. All other formats stay in Supabase, up to **50 MB** per file. Existing attachments retain their original provider, including compressed EXEs previously stored in Supabase. Metadata alone traverses Vercel. R2 downloads go directly to the browser download manager, avoiding a large in-memory copy.

Run `supabase/migrations/202610220006_r2_exe_storage.sql` for existing installations (it includes the size constraints, so migration 005 is not required first). Keep the existing Vercel variables `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET_NAME`; optional `R2_ENDPOINT` overrides the standard account endpoint. `R2_PUBLIC_URL` is not needed for Hub downloads. Credentials remain server-side. R2 token permissions must include object read/write for this bucket. The Hub uses `development/shared/<uuid>/<filename>` keys, separate from the existing `cms/` prefix.

In Cloudflare R2 → bucket → Settings → CORS policy, allow the actual application origins (production and any preview domains you use), PUT with Content-Type and If-None-Match headers. Example; replace the origin with your deployed domain:

```json
[{ "AllowedOrigins": ["https://your-app.vercel.app"], "AllowedMethods": ["PUT"], "AllowedHeaders": ["Content-Type", "If-None-Match"], "ExposeHeaders": ["ETag"], "MaxAgeSeconds": 3600 }]
```

Merge this with any existing CMS CORS rules rather than replacing them. Signed upload URLs expire after 15 minutes; signed download URLs expire after 60 seconds. EXE uploads are verified by R2 object size/type before metadata is saved. Failed unpublished uploads are cleaned up when the client can confirm the save failed; interrupted tabs/connections may leave orphaned objects.

Lossless compression remains optional for Supabase files. It restores exact original bytes for downloads/previews and preserves quality. Already-compressed files may not shrink. No Supabase paid-plan upgrade or higher project-wide file limit is needed for EXE files stored in R2.

Metadata lives in Postgres with a storage-provider field. Non-EXE file bytes live in the private Supabase `development-files` bucket under random `shared/<file-id>/<filename>` paths; EXEs use the R2 keys described above. Signed download URLs expire after 60 seconds. The bucket’s private flag disables permanent public-object URLs; anonymous API access is explicitly permitted in this URL-access mode. File names and release-file comments can be edited without permitting changes to the stored path, compression data, or size.

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
