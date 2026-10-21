import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
async function database() {
  const db = new PGlite();
  await db.exec(`create role authenticated; create role anon;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint);
    create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text,owner_id text);
    alter table storage.objects enable row level security;
    create function storage.foldername(name text) returns text[] language sql immutable as $$ select string_to_array(name,'/') $$;
    grant usage on schema public,auth,storage to authenticated,anon;
    grant select,insert,delete on storage.objects to authenticated,anon;
    grant execute on function auth.uid() to authenticated,anon;`);
  return db;
}
const read = (name) =>
  readFile(new URL("../supabase/" + name, import.meta.url), "utf8");
test("URL-access SQL supports fresh setup, anonymous publish/test/retest, private downloads, and reruns", async () => {
  const db = await database();
  try {
    const setup = await read("testbuddy-url-access.sql");
    await db.exec(setup);
    await db.exec("set role anon");
    const build = "20000000-0000-4000-8000-000000000001",
      report = "30000000-0000-4000-8000-000000000001";
    await db.exec(`insert into builds(id,version,release_notes,instructions) values ('${build}','1.0','Notes','Install');
      insert into storage.objects(bucket_id,name) values ('development-files','shared/bundle/build.zip');
      insert into files(path,name,size,mime_type,parent_type,parent_id) values ('shared/bundle/build.zip','build.zip',100,'application/zip','builds','${build}');
      update builds set published=true where id='${build}';
      insert into testing_reports(id,build_id,tester_name,findings) values ('${report}','${build}','Sam','Crash on launch');
      insert into tasks(title,owner_name,report_id) values ('Fix crash','Alex','${report}');
      update tasks set status='In progress'; update tasks set status='Retest'; update tasks set status='Done';
      insert into events(title,event_date) values ('Retest due','2026-11-01');`);
    assert.equal(
      (await db.query("select status,owner_name from tasks")).rows[0].status,
      "Done",
    );
    assert.equal(
      (await db.query("select tester_name from testing_reports")).rows[0]
        .tester_name,
      "Sam",
    );
    assert.equal(
      (await db.query("select count(*)::int as n from storage.objects")).rows[0]
        .n,
      1,
    );
    await assert.rejects(
      db.exec(
        "insert into storage.objects(bucket_id,name) values ('other-bucket','shared/nope.zip')",
      ),
      /row-level security/,
    );
    await assert.rejects(
      db.exec(
        "insert into storage.objects(bucket_id,name) values ('development-files','not-shared/nope.zip')",
      ),
      /row-level security/,
    );
    await assert.rejects(
      db.exec(
        `insert into files(path,name,size,mime_type,parent_type,parent_id) values ('shared/missing.zip','missing.zip',100,'application/zip','builds','${build}')`,
      ),
      /Upload the shared object/,
    );
    await assert.rejects(db.exec("select * from members"), /permission denied/);
    await db.exec("reset role");
    assert.equal(
      (
        await db.query(
          "select public from storage.buckets where id='development-files'",
        )
      ).rows[0].public,
      false,
    );
    await db.exec(setup);
    assert.equal(
      (await db.query("select count(*)::int as n from builds")).rows[0].n,
      1,
    );
  } finally {
    await db.close();
  }
});
test("URL-access migration upgrades existing member content without removing records", async () => {
  const db = await database();
  try {
    await db.exec(await read("migrations/202610210001_testbuddy_hub.sql"));
    const id = "10000000-0000-4000-8000-000000000001";
    await db.exec(`insert into auth.users values ('${id}'); insert into members(id,name,role) values ('${id}','Existing tester','admin');
      insert into builds(id,version,release_notes,instructions,created_by,published) values ('20000000-0000-4000-8000-000000000001','Existing','Notes','Install','${id}',true);
      insert into testing_reports(build_id,findings,created_by) values ('20000000-0000-4000-8000-000000000001','Existing finding','${id}');
      insert into tasks(title,owner_id,created_by) values ('Existing task','${id}','${id}');`);
    await db.exec(await read("testbuddy-url-access.sql"));
    await db.exec("set role anon");
    assert.equal(
      (await db.query("select tester_name from testing_reports")).rows[0]
        .tester_name,
      "Existing tester",
    );
    assert.equal(
      (await db.query("select owner_name from tasks")).rows[0].owner_name,
      "Existing tester",
    );
    await db.exec(
      "update tasks set title='Updated without signing in',status='Retest'",
    );
    await db.exec("reset role");
  } finally {
    await db.close();
  }
});

test("setup recovers when tables exist but bootstrap functions and policies are missing", async () => {
  const db = await database();
  try {
    const setup = await read("testbuddy-url-access.sql");
    const tables = setup.match(
      /create table if not exists public\.\w+ \([\s\S]*?\n\);/g,
    );
    assert.equal(tables.length, 8);
    await db.exec(tables.join("\n"));
    await db.exec(setup);
    await db.exec("set role anon");
    await db.exec(
      "insert into builds(version,release_notes,instructions) values ('recovered','Recovered notes','Install');",
    );
    const columns = await db.query(
      "select compression,original_size from files limit 0",
    );
    assert.equal(columns.rows.length, 0);
    await db.exec("reset role");
  } finally {
    await db.close();
  }
});

test("simple releases group mixed files, allow later additions and comments, and accept unlinked reports", async () => {
  const db = await database();
  try {
    const setup = await read("testbuddy-url-access.sql");
    await db.exec(setup);
    await db.exec("set role anon");
    const release = "20000000-0000-4000-8000-000000000009";
    await db.exec(
      `insert into builds(id,version,published) values ('${release}','Release beta 1',true)`,
    );
    const names = [
      "TestBuddy-0.1.0-beta.1-x64-Setup.exe",
      "README-Installation.md",
      "Acceptance-Testing-Guide.md",
      "Known-Issues.md",
      "SHA256.txt",
      "additional-notes.md",
    ];
    for (const [index, name] of names.entries()) {
      const path = `shared/release-${index}/${name}`;
      await db.exec(`insert into storage.objects(bucket_id,name) values ('development-files','${path}');
        insert into files(path,name,size,original_size,mime_type,parent_type,parent_id,comment) values ('${path}','${name}',${index === 0 ? 40 * 1024 * 1024 : 100},${index === 0 ? 40 * 1024 * 1024 : 100},'application/octet-stream','builds','${release}','Original comment')`);
    }
    assert.equal(
      (
        await db.query(
          `select count(*)::int as n from files where parent_id='${release}'`,
        )
      ).rows[0].n,
      6,
    );
    await db.exec(
      "update files set comment='Install this file first' where name='TestBuddy-0.1.0-beta.1-x64-Setup.exe'",
    );
    assert.equal(
      (
        await db.query(
          "select comment from files where name='TestBuddy-0.1.0-beta.1-x64-Setup.exe'",
        )
      ).rows[0].comment,
      "Install this file first",
    );
    await assert.rejects(
      db.exec(
        "update files set path='shared/tampered/file.exe' where name='TestBuddy-0.1.0-beta.1-x64-Setup.exe'",
      ),
      /Only the file comment/,
    );
    await db.exec(
      "insert into testing_reports(tester_name) values ('Tester without a build selection'); insert into weekly_updates(title,week_start,week_end,summary,published) values ('Beta progress','2026-10-21','2026-10-21','Beta progress',true)",
    );
    assert.equal(
      (await db.query("select build_id from testing_reports")).rows[0].build_id,
      null,
    );
    await db.exec("reset role");
    assert.equal(
      (
        await db.query(
          "select file_size_limit from storage.buckets where id='development-files'",
        )
      ).rows[0].file_size_limit,
      52428800,
    );
    await db.exec(setup);
    assert.equal(
      (
        await db.query(
          `select count(*)::int as n from files where parent_id='${release}'`,
        )
      ).rows[0].n,
      6,
    );
  } finally {
    await db.close();
  }
});

test("the small upgrade alone preserves existing installations and enables simple reports", async () => {
  const db = await database();
  try {
    for (const name of [
      "202610210001_testbuddy_hub.sql",
      "202610210002_url_access.sql",
      "202610210003_lossless_uploads.sql",
    ])
      await db.exec(await read("migrations/" + name));
    await db.exec(
      "insert into builds(version,release_notes,instructions,published) values ('Existing beta','Notes','Install',true); insert into weekly_updates(week_start,week_end,summary) values ('2026-10-19','2026-10-25','Existing progress')",
    );
    const upgrade = await read(
      "migrations/202610210004_simple_release_hub.sql",
    );
    await db.exec(upgrade);
    await db.exec(upgrade);
    assert.equal(
      (await db.query("select title from weekly_updates")).rows[0].title,
      "Existing progress",
    );
    assert.equal(
      (await db.query("select version from builds")).rows[0].version,
      "Existing beta",
    );
    await db.exec(
      "set role anon; insert into testing_reports(tester_name) values ('Sam')",
    );
    assert.equal(
      (await db.query("select build_id from testing_reports")).rows[0].build_id,
      null,
    );
    await db.exec("reset role");
  } finally {
    await db.close();
  }
});

test("large-installer upgrade raises existing limits and remains repeatable", async () => {
  const db = await database();
  try {
    await db.exec(
      (await read("testbuddy-url-access.sql")).split(
        "-- EXE bytes go to R2;",
      )[0],
    );
    await db.exec(await read("migrations/202610210004_simple_release_hub.sql"));
    const migration = await read(
      "migrations/202610220005_large_installers.sql",
    );
    await db.exec(migration);
    await db.exec(migration);
    assert.equal(
      (
        await db.query(
          "select file_size_limit from storage.buckets where id='development-files'",
        )
      ).rows[0].file_size_limit,
      250 * 1024 * 1024,
    );
    const id = "20000000-0000-4000-8000-000000000009";
    await db.exec(`insert into builds(id,version,published) values ('${id}','Large installer',true);
      insert into storage.objects(bucket_id,name) values ('development-files','shared/large/setup.exe');
      insert into files(path,name,size,original_size,mime_type,parent_type,parent_id) values ('shared/large/setup.exe','setup.exe',125829120,125829120,'application/octet-stream','builds','${id}')`);
    await assert.rejects(
      db.exec("update files set size=262144001 where name='setup.exe'"),
      /files_size_check/,
    );
    await assert.rejects(
      db.exec(
        "update files set original_size=262144001 where name='setup.exe'",
      ),
      /files_original_size_check/,
    );
  } finally {
    await db.close();
  }
});

test("R2 migration supports large EXEs, preserves Supabase files, and rejects other R2 attachments", async () => {
  const db = await database();
  try {
    await db.exec(await read("testbuddy-url-access.sql"));
    const migration = await read("migrations/202610220006_r2_exe_storage.sql");
    await db.exec(migration);
    const id = "20000000-0000-4000-8000-000000000008";
    await db.exec(`insert into builds(id,version,published) values ('${id}','R2 beta',true); set role anon;
      insert into files(storage_provider,path,name,size,original_size,mime_type,parent_type,parent_id) values ('r2','shared/installer/setup.exe','setup.exe',125829120,125829120,'application/octet-stream','builds','${id}')`);
    await assert.rejects(
      db.exec(
        `insert into files(storage_provider,path,name,size,original_size,mime_type,parent_type,parent_id) values ('r2','shared/nope/file.pdf','file.pdf',100,100,'application/pdf','builds','${id}')`,
      ),
      /R2 accepts/,
    );
    await assert.rejects(
      db.exec(
        `insert into files(path,name,size,original_size,mime_type,parent_type,parent_id) values ('shared/too-large/file.zip','file.zip',125829120,125829120,'application/zip','builds','${id}')`,
      ),
      /50 MB/,
    );
    await db.exec("reset role");
    await db.exec(await read("testbuddy-url-access.sql"));
    assert.equal(
      (
        await db.query(
          "select storage_provider from files where name='setup.exe'",
        )
      ).rows[0].storage_provider,
      "r2",
    );
    assert.equal(
      (
        await db.query(
          "select file_size_limit from storage.buckets where id='development-files'",
        )
      ).rows[0].file_size_limit,
      50 * 1024 * 1024,
    );
  } finally {
    await db.close();
  }
});

test("file management permits safe renames and deletion across providers while protecting storage metadata", async () => {
  const db = await database();
  try {
    await db.exec(await read("testbuddy-url-access.sql"));
    const migration = await read("migrations/202610220007_file_management.sql");
    await db.exec(migration);
    const build = "20000000-0000-4000-8000-000000000007";
    const report = "30000000-0000-4000-8000-000000000007";
    await db.exec(`insert into builds(id,version,published) values ('${build}','Manage files',true);
      insert into testing_reports(id,tester_name) values ('${report}','QA');
      insert into storage.objects(bucket_id,name) values ('development-files','shared/manage/report.md');
      set role anon;
      insert into files(path,name,size,original_size,mime_type,parent_type,parent_id) values ('shared/manage/report.md','report.md',100,100,'text/markdown','testing_reports','${report}');
      insert into files(storage_provider,path,name,size,original_size,mime_type,parent_type,parent_id) values ('r2','shared/manage/setup.exe','setup.exe',125829120,125829120,'application/octet-stream','builds','${build}');
      update files set name='QA report.md' where name='report.md';
      update files set name='Beta installer.exe' where name='setup.exe'`);
    assert.equal(
      (await db.query("select path from files where name='QA report.md'"))
        .rows[0].path,
      "shared/manage/report.md",
    );
    await assert.rejects(
      db.exec("update files set name='report.exe' where name='QA report.md'"),
      /original file extension/,
    );
    await assert.rejects(
      db.exec("update files set name='bad/name.md' where name='QA report.md'"),
      /valid filename/,
    );
    await assert.rejects(
      db.exec(
        "update files set name=E'bad\\nname.md' where name='QA report.md'",
      ),
      /valid filename/,
    );
    await assert.rejects(
      db.exec(
        "update files set storage_provider='r2' where name='QA report.md'",
      ),
      /Only the file comment and name/,
    );
    await assert.rejects(
      db.exec(
        "update files set comment='No report comments' where name='QA report.md'",
      ),
      /only available for release/,
    );
    await db.exec(
      "delete from storage.objects where name='shared/manage/report.md'; delete from files where name in ('QA report.md','Beta installer.exe')",
    );
    assert.equal(
      (await db.query("select count(*)::int as n from files")).rows[0].n,
      0,
    );
    await db.exec("reset role");
    await db.exec(migration);
  } finally {
    await db.close();
  }
});

test("file reordering persists atomically within a parent and new uploads append", async () => {
  const db = await database();
  try {
    await db.exec(await read("testbuddy-url-access.sql"));
    const parent = "20000000-0000-4000-8000-000000000006";
    const other = "20000000-0000-4000-8000-000000000005";
    const ids = [1, 2, 3, 4].map(
      (n) => `80000000-0000-4000-8000-00000000000${n}`,
    );
    await db.exec(
      `insert into builds(id,version,published) values ('${parent}','Ordered release',true),('${other}','Other release',true); set role anon;`,
    );
    for (let i = 0; i < 3; i++)
      await db.exec(
        `insert into files(id,storage_provider,path,name,size,original_size,mime_type,parent_type,parent_id) values ('${ids[i]}','r2','shared/order/${i}.exe','${i}.exe',100,100,'application/octet-stream','builds','${i === 2 ? other : parent}')`,
      );
    await db.exec(
      `select public.hub_reorder_files('builds','${parent}',array['${ids[1]}','${ids[0]}']::uuid[])`,
    );
    const order = async () =>
      (
        await db.query(
          `select id from files where parent_id='${parent}' order by sort_order`,
        )
      ).rows.map((row) => row.id);
    assert.deepEqual(await order(), [ids[1], ids[0]]);
    await assert.rejects(
      db.exec(
        `select public.hub_reorder_files('builds','${parent}',array['${ids[0]}','${ids[0]}']::uuid[])`,
      ),
      /file list changed/,
    );
    await assert.rejects(
      db.exec(
        `select public.hub_reorder_files('builds','${parent}',array['${ids[0]}','${ids[2]}']::uuid[])`,
      ),
      /file list changed/,
    );
    assert.deepEqual(await order(), [ids[1], ids[0]]);
    await db.exec(
      `insert into files(id,storage_provider,path,name,size,original_size,mime_type,parent_type,parent_id) values ('${ids[3]}','r2','shared/order/4.exe','4.exe',100,100,'application/octet-stream','builds','${parent}')`,
    );
    assert.deepEqual(await order(), [ids[1], ids[0], ids[3]]);
    await assert.rejects(
      db.exec(
        `select public.hub_reorder_files('builds','${parent}',array['${ids[0]}','${ids[1]}']::uuid[])`,
      ),
      /file list changed/,
    );
    await db.exec("reset role");
    await db.exec(await read("testbuddy-url-access.sql"));
    assert.deepEqual(await order(), [ids[1], ids[0], ids[3]]);
  } finally {
    await db.close();
  }
});
