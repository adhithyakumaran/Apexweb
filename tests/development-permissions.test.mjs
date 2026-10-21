import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
const ids = {
  admin: "10000000-0000-4000-8000-000000000001",
  member: "10000000-0000-4000-8000-000000000002",
  outsider: "10000000-0000-4000-8000-000000000003",
  other: "10000000-0000-4000-8000-000000000004",
};
test("Postgres RLS enforces membership, draft privacy, attachments, and assigned task updates", async (t) => {
  const db = new PGlite();
  await db.exec(`
    create role authenticated; create role anon;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint);
    create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text,owner_id text);
    alter table storage.objects enable row level security;
    create function storage.foldername(name text) returns text[] language sql immutable as $$ select string_to_array(name,'/') $$;
    grant usage on schema public,auth,storage to authenticated,anon;
    grant select,insert,delete on storage.objects to authenticated;
    grant execute on function auth.uid() to authenticated,anon;
    insert into auth.users values ${Object.values(ids)
      .map((id) => `('${id}')`)
      .join(",")};
  `);
  await db.exec(
    await readFile(
      new URL(
        "../supabase/migrations/202610210001_testbuddy_hub.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await db.exec(
    `insert into public.members(id,name,role) values ('${ids.admin}','Admin','admin'),('${ids.member}','Tester','member'),('${ids.other}','Other tester','member');`,
  );
  const as = async (id, sql) => {
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${id}',false);`,
    );
    try {
      return await db.exec(sql);
    } finally {
      await db.exec("reset role;");
    }
  };
  const count = async (id, table) =>
    (await as(id, `select count(*)::int as n from public.${table}`))[0].rows[0]
      .n;
  const build = "20000000-0000-4000-8000-000000000001";
  const draft = "20000000-0000-4000-8000-000000000002";
  const report = "30000000-0000-4000-8000-000000000001";
  const task = "40000000-0000-4000-8000-000000000001";
  await t.test(
    "admin publishes content and retains a private draft",
    async () => {
      await as(
        ids.admin,
        `insert into builds(id,version,release_notes,instructions,published) values ('${build}','1.0','Release','Install',true),('${draft}','1.1','Draft','Install',false)`,
      );
      assert.equal(await count(ids.admin, "builds"), 2);
      assert.equal(await count(ids.member, "builds"), 1);
      assert.equal(await count(ids.outsider, "builds"), 0);
      await assert.rejects(
        as(
          ids.member,
          `insert into builds(version,release_notes,instructions) values ('evil','x','x')`,
        ),
        /row-level security/,
      );
    },
  );
  await t.test("members cannot promote themselves or add members", async () => {
    await as(
      ids.member,
      `update members set role='admin' where id='${ids.member}'`,
    );
    const result = await as(
      ids.member,
      `select role from members where id='${ids.member}'`,
    );
    assert.equal(result[0].rows[0].role, "member");
    await assert.rejects(
      as(
        ids.member,
        `insert into members(id,name) values ('${ids.outsider}','Intruder')`,
      ),
      /row-level security/,
    );
  });
  await t.test(
    "feedback requires a published build and the authenticated author",
    async () => {
      await as(
        ids.member,
        `insert into testing_reports(id,build_id,findings) values ('${report}','${build}','Crash on launch')`,
      );
      await assert.rejects(
        as(
          ids.member,
          `insert into testing_reports(build_id,findings) values ('${draft}','Hidden draft')`,
        ),
        /row-level security/,
      );
      await assert.rejects(
        as(
          ids.member,
          `insert into testing_reports(build_id,findings,created_by) values ('${build}','Spoofed','${ids.admin}')`,
        ),
        /row-level security/,
      );
      await assert.rejects(
        as(
          ids.outsider,
          `insert into testing_reports(build_id,findings,created_by) values ('${build}','Intrusion','${ids.member}')`,
        ),
        /row-level security/,
      );
    },
  );
  await t.test(
    "members update assigned status only, and cannot reassign or edit content",
    async () => {
      await as(
        ids.admin,
        `insert into tasks(id,title,owner_id,report_id) values ('${task}','Fix crash','${ids.member}','${report}')`,
      );
      await as(
        ids.member,
        `update tasks set status='In progress' where id='${task}'`,
      );
      await assert.rejects(
        as(ids.member, `update tasks set title='Tampered' where id='${task}'`),
        /Only task status/,
      );
      await assert.rejects(
        as(
          ids.member,
          `update tasks set owner_id='${ids.other}' where id='${task}'`,
        ),
        /Only task status/,
      );
      await as(ids.other, `update tasks set status='Done' where id='${task}'`);
      let result = await as(
        ids.admin,
        `select status from tasks where id='${task}'`,
      );
      assert.equal(result[0].rows[0].status, "In progress");
      await as(
        ids.member,
        `update tasks set status='Retest' where id='${task}'; update tasks set status='Done' where id='${task}'`,
      );
      result = await as(
        ids.admin,
        `select status from tasks where id='${task}'`,
      );
      assert.equal(result[0].rows[0].status, "Done");
    },
  );
  await t.test(
    "private storage visibility follows membership and parent publication",
    async () => {
      const path = `${ids.admin}/bundle/build.zip`;
      const draftPath = `${ids.admin}/draft/build.zip`;
      await as(
        ids.admin,
        `insert into storage.objects(bucket_id,name,owner_id) values ('development-files','${path}','${ids.admin}'),('development-files','${draftPath}','${ids.admin}');
      insert into files(path,name,size,mime_type,parent_type,parent_id) values ('${path}','build.zip',100,'application/zip','builds','${build}'),('${draftPath}','draft.zip',100,'application/zip','builds','${draft}');`,
      );
      assert.equal(await count(ids.member, "files"), 1);
      assert.equal(await count(ids.outsider, "files"), 0);
      assert.equal(
        (
          await as(ids.member, "select count(*)::int as n from storage.objects")
        )[0].rows[0].n,
        1,
      );
      assert.equal(
        (
          await as(
            ids.outsider,
            "select count(*)::int as n from storage.objects",
          )
        )[0].rows[0].n,
        0,
      );
      await assert.rejects(
        as(
          ids.member,
          `insert into files(path,name,size,mime_type,parent_type,parent_id) values ('${ids.member}/fake/report.pdf','fake.pdf',10,'application/pdf','testing_reports','${report}')`,
        ),
        /Upload the owned object/,
      );
      await assert.rejects(
        as(
          ids.member,
          `insert into storage.objects(bucket_id,name,owner_id) values ('development-files','${ids.admin}/fake.zip','${ids.member}')`,
        ),
        /row-level security/,
      );
    },
  );
  await t.test(
    "members attach owned report files but cannot attach to another author’s report or a build",
    async () => {
      const ownPath = `${ids.member}/report/screenshot.png`;
      await as(
        ids.member,
        `insert into storage.objects(bucket_id,name,owner_id) values ('development-files','${ownPath}','${ids.member}');
      insert into files(path,name,size,mime_type,parent_type,parent_id) values ('${ownPath}','screenshot.png',100,'image/png','testing_reports','${report}');`,
      );
      const objects = await as(
        ids.other,
        `select name from storage.objects where name='${ownPath}'`,
      );
      assert.equal(objects[0].rows.length, 1);
      const otherPath = `${ids.other}/report/fake.png`;
      await as(
        ids.other,
        `insert into storage.objects(bucket_id,name,owner_id) values ('development-files','${otherPath}','${ids.other}')`,
      );
      await assert.rejects(
        as(
          ids.other,
          `insert into files(path,name,size,mime_type,parent_type,parent_id) values ('${otherPath}','fake.png',100,'image/png','testing_reports','${report}')`,
        ),
        /Attachment not allowed/,
      );
      await assert.rejects(
        as(
          ids.member,
          `insert into files(path,name,size,mime_type,parent_type,parent_id) values ('${ids.member}/other/build.zip','build.zip',100,'application/zip','builds','${build}')`,
        ),
        /Attachment not allowed/,
      );
    },
  );
  await t.test(
    "deactivated members immediately lose data and storage access",
    async () => {
      await as(
        ids.admin,
        `update members set active=false where id='${ids.member}'`,
      );
      assert.equal(await count(ids.member, "builds"), 0);
      assert.equal(await count(ids.member, "testing_reports"), 0);
      assert.equal(
        (
          await as(ids.member, "select count(*)::int as n from storage.objects")
        )[0].rows[0].n,
        0,
      );
    },
  );
  await t.test(
    "anonymous users receive no records even if default grants allow reads",
    async () => {
      await db.exec(
        "grant select on public.builds, public.members, public.files to anon; set role anon;",
      );
      try {
        const result = await db.query("select count(*)::int as n from builds");
        assert.equal(result.rows[0].n, 0);
      } finally {
        await db.exec("reset role");
      }
    },
  );
  await db.close();
});
