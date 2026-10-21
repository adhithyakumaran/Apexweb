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
