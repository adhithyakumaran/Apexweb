-- TestBuddy Hub: COMPLETE setup/recovery script for Supabase SQL Editor.
-- Replace the previous query, paste ALL of this file, and click Run.
-- Safe to rerun after a failed/partial setup or the previous Hub migrations.
-- URL-access mode: anyone reaching the URL/API can read and manage content.
begin;
create table if not exists public.members (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 160),
  role text not null default 'member' check (role in ('admin','member')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(), title text not null,
  category text not null check (category in ('Architecture','Standards','Setup','Manual')),
  body text not null default '', published boolean not null default false,
  created_by uuid not null default auth.uid() references public.members(id), created_at timestamptz not null default now()
);
create table if not exists public.builds (
  id uuid primary key default gen_random_uuid(), version text not null unique,
  release_notes text not null, instructions text not null, known_issues text not null default '',
  published boolean not null default false,
  created_by uuid not null default auth.uid() references public.members(id), created_at timestamptz not null default now()
);
create table if not exists public.weekly_updates (
  id uuid primary key default gen_random_uuid(), week_start date not null, week_end date not null,
  summary text not null, published boolean not null default false,
  created_by uuid not null default auth.uid() references public.members(id), created_at timestamptz not null default now(),
  check (week_end >= week_start)
);
create table if not exists public.testing_reports (
  id uuid primary key default gen_random_uuid(), build_id uuid not null references public.builds(id), findings text not null,
  created_by uuid not null default auth.uid() references public.members(id), created_at timestamptz not null default now()
);
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(), title text not null, description text not null default '',
  owner_id uuid references public.members(id), report_id uuid references public.testing_reports(id),
  priority text not null default 'Medium' check (priority in ('Low','Medium','High')),
  status text not null default 'Open' check (status in ('Open','In progress','Retest','Done')),
  created_by uuid not null default auth.uid() references public.members(id), created_at timestamptz not null default now()
);
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(), title text not null, event_date date not null,
  created_by uuid not null default auth.uid() references public.members(id), created_at timestamptz not null default now()
);
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(), path text not null unique, name text not null,
  size bigint not null check (size > 0 and size <= 26214400), mime_type text not null,
  parent_type text not null check (parent_type in ('documents','builds','weekly_updates','testing_reports')),
  parent_id uuid not null, created_by uuid not null default auth.uid() references public.members(id),
  created_at timestamptz not null default now(),
  check (split_part(path, '/', 1) = created_by::text)
);
alter table public.members enable row level security;
alter table public.documents enable row level security;
alter table public.builds enable row level security;
alter table public.weekly_updates enable row level security;
alter table public.testing_reports enable row level security;
alter table public.tasks enable row level security;
alter table public.events enable row level security;
alter table public.files enable row level security;
revoke all on public.members from anon;
insert into storage.buckets(id,name,public,file_size_limit) values ('development-files','development-files',false,26214400) on conflict (id) do update set public=false, file_size_limit=26214400;
-- Explicit URL-access mode: anyone can read, upload, publish, and manage Hub content.
-- This does not provide authentication or URL-based authorization.
drop trigger if exists hub_task_update on public.tasks;
alter table public.testing_reports add column if not exists tester_name text not null default 'Tester';
alter table public.tasks add column if not exists owner_name text not null default '';
update public.testing_reports r set tester_name = m.name from public.members m where r.created_by = m.id and r.tester_name = 'Tester';
update public.tasks t set owner_name = m.name from public.members m where t.owner_id = m.id and t.owner_name = '';
do $columns$
declare tab text;
begin
  foreach tab in array array['documents','builds','weekly_updates','testing_reports','tasks','events','files'] loop
    execute format('alter table public.%I alter column created_by drop not null', tab);
  end loop;
end;
$columns$;
-- Replace only policies on the Hub's content tables, leaving members and other tables alone.
do $policies$
declare item record;
begin
  for item in select schemaname,tablename,policyname from pg_policies
    where schemaname = 'public' and tablename = any(array['documents','builds','weekly_updates','testing_reports','tasks','events','files'])
  loop execute format('drop policy %I on %I.%I', item.policyname,item.schemaname,item.tablename); end loop;
end;
$policies$;
create or replace function public.hub_can_read_parent(kind text, parent uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select case kind
    when 'documents' then exists(select 1 from public.documents where id = parent)
    when 'builds' then exists(select 1 from public.builds where id = parent)
    when 'weekly_updates' then exists(select 1 from public.weekly_updates where id = parent)
    when 'testing_reports' then exists(select 1 from public.testing_reports where id = parent)
    else false end;
$$;
create or replace function public.hub_can_attach(kind text, parent uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.hub_can_read_parent(kind,parent);
$$;
create or replace function public.hub_check_file() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not public.hub_can_attach(new.parent_type,new.parent_id) then raise exception 'Attachment parent not found'; end if;
  if new.path not like 'shared/%' or not exists(select 1 from storage.objects where bucket_id = 'development-files' and name = new.path) then
    raise exception 'Upload the shared object before creating metadata';
  end if;
  return new;
end;
$$;
grant execute on function public.hub_can_read_parent(text,uuid),public.hub_can_attach(text,uuid) to anon,authenticated;
grant select,insert,update,delete on public.documents,public.builds,public.weekly_updates,public.testing_reports,public.tasks,public.events,public.files to anon,authenticated;
create policy hub_shared_documents on public.documents for all to anon,authenticated using (true) with check (true);
create policy hub_shared_builds on public.builds for all to anon,authenticated using (true) with check (true);
create policy hub_shared_updates on public.weekly_updates for all to anon,authenticated using (true) with check (true);
create policy hub_shared_tasks on public.tasks for all to anon,authenticated using (true) with check (true);
create policy hub_shared_events on public.events for all to anon,authenticated using (true) with check (true);
create policy hub_shared_reports_read on public.testing_reports for select to anon,authenticated using (true);
create policy hub_shared_reports_insert on public.testing_reports for insert to anon,authenticated with check (
  length(trim(tester_name)) between 1 and 160 and exists(select 1 from public.builds where id = build_id and published)
);
create policy hub_shared_reports_delete on public.testing_reports for delete to anon,authenticated using (true);
create policy hub_shared_files_read on public.files for select to anon,authenticated using (public.hub_can_read_parent(parent_type,parent_id));
create policy hub_shared_files_insert on public.files for insert to anon,authenticated with check (created_by is null and public.hub_can_attach(parent_type,parent_id));
-- Bucket stays private: public object URLs remain disabled, signed URLs expire in 60 seconds.
update storage.buckets set public = false where id = 'development-files';
drop policy if exists hub_storage_read on storage.objects;
drop policy if exists hub_storage_upload on storage.objects;
drop policy if exists hub_storage_rollback on storage.objects;
create policy hub_storage_read on storage.objects for select to anon,authenticated using (
  bucket_id = 'development-files' and (name like 'shared/%' or exists(select 1 from public.files where path = storage.objects.name and public.hub_can_read_parent(parent_type,parent_id)))
);
create policy hub_storage_upload on storage.objects for insert to anon,authenticated with check (
  bucket_id = 'development-files' and name like 'shared/%'
);
create policy hub_storage_rollback on storage.objects for delete to anon,authenticated using (
  bucket_id = 'development-files' and name like 'shared/%'
);
create or replace function public.hub_cleanup_files() returns trigger language plpgsql security definer set search_path = '' as $hub_cleanup$
begin
  delete from public.files where parent_type = tg_table_name and parent_id = old.id;
  return old;
end;
$hub_cleanup$;
drop trigger if exists hub_report_cleanup on public.testing_reports;
create trigger hub_report_cleanup after delete on public.testing_reports for each row execute function public.hub_cleanup_files();
drop trigger if exists hub_build_cleanup on public.builds;
create trigger hub_build_cleanup after delete on public.builds for each row execute function public.hub_cleanup_files();
drop trigger if exists hub_document_cleanup on public.documents;
create trigger hub_document_cleanup after delete on public.documents for each row execute function public.hub_cleanup_files();
drop trigger if exists hub_update_cleanup on public.weekly_updates;
create trigger hub_update_cleanup after delete on public.weekly_updates for each row execute function public.hub_cleanup_files();
drop trigger if exists hub_file_insert on public.files;
create trigger hub_file_insert before insert on public.files for each row execute function public.hub_check_file();
create index if not exists files_parent_idx on public.files(parent_type,parent_id);
create index if not exists reports_build_idx on public.testing_reports(build_id);
create index if not exists tasks_owner_idx on public.tasks(owner_id);
create index if not exists tasks_report_idx on public.tasks(report_id);
create index if not exists events_date_idx on public.events(event_date);
alter table public.files add column if not exists compression text not null default 'none' check (compression in ('none','gzip'));
alter table public.files add column if not exists original_size bigint check (original_size > 0 and original_size <= 26214400);
update public.files set original_size = size where original_size is null;
-- Simplify the Hub without deleting existing releases, reports, or progress.
alter table public.files add column if not exists comment text not null default '' check (length(comment) <= 2000);
alter table public.weekly_updates add column if not exists title text not null default '';
update public.weekly_updates set title = left(summary,160) where title = '';
alter table public.testing_reports alter column build_id drop not null;
alter table public.testing_reports alter column findings set default '';
alter table public.builds alter column release_notes set default '';
alter table public.builds alter column instructions set default '';
alter table public.files drop constraint if exists files_size_check;
alter table public.files add constraint files_size_check check (size > 0 and size <= 262144000);
alter table public.files drop constraint if exists files_original_size_check;
alter table public.files add constraint files_original_size_check check (original_size > 0 and original_size <= 262144000);
update storage.buckets set file_size_limit = 262144000 where id = 'development-files';
drop policy if exists hub_shared_reports_insert on public.testing_reports;
create policy hub_shared_reports_insert on public.testing_reports for insert to anon,authenticated with check (
  length(trim(tester_name)) between 1 and 160 and (build_id is null or exists(select 1 from public.builds where id = build_id and published))
);
drop policy if exists hub_shared_files_update on public.files;
create policy hub_shared_files_update on public.files for update to anon,authenticated
  using (parent_type = 'builds' and public.hub_can_read_parent(parent_type,parent_id))
  with check (parent_type = 'builds' and public.hub_can_read_parent(parent_type,parent_id));
create or replace function public.hub_guard_file_comment() returns trigger language plpgsql set search_path = '' as $hub_comment$
begin
  if current_user in ('anon','authenticated') and (to_jsonb(new) - 'comment') is distinct from (to_jsonb(old) - 'comment') then
    raise exception 'Only the file comment can be edited';
  end if;
  return new;
end;
$hub_comment$;
drop trigger if exists hub_file_comment_update on public.files;
create trigger hub_file_comment_update before update on public.files for each row execute function public.hub_guard_file_comment();
commit;

-- Raise both metadata and bucket limits for large installers. Repeatable.
-- Also raise Supabase Storage's project-wide limit in Dashboard settings.
begin;
alter table public.files drop constraint if exists files_size_check;
alter table public.files add constraint files_size_check check (size > 0 and size <= 262144000);
alter table public.files drop constraint if exists files_original_size_check;
alter table public.files add constraint files_original_size_check check (original_size > 0 and original_size <= 262144000);
update storage.buckets set file_size_limit = 262144000 where id = 'development-files';
commit;
-- EXE bytes go to R2; existing files remain in their original storage.
begin;
alter table public.files add column if not exists storage_provider text not null default 'supabase';
alter table public.files drop constraint if exists files_storage_provider_check;
alter table public.files add constraint files_storage_provider_check check (
  storage_provider = 'supabase' or (storage_provider = 'r2' and parent_type = 'builds' and lower(name) like '%.exe' and compression = 'none')
);
alter table public.files drop constraint if exists files_size_check;
alter table public.files add constraint files_size_check check (size > 0 and size <= 262144000);
alter table public.files drop constraint if exists files_original_size_check;
alter table public.files add constraint files_original_size_check check (original_size > 0 and original_size <= 262144000);
create or replace function public.hub_check_file() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not public.hub_can_attach(new.parent_type,new.parent_id) then raise exception 'Attachment parent not found'; end if;
  if new.path not like 'shared/%' then raise exception 'Invalid shared upload path'; end if;
  if new.storage_provider = 'supabase' then
    if new.size > 52428800 or new.original_size > 52428800 then raise exception 'Supabase files must be 50 MB or smaller'; end if;
    if not exists(select 1 from storage.objects where bucket_id = 'development-files' and name = new.path) then
      raise exception 'Upload the shared object before creating metadata';
    end if;
  elsif new.storage_provider <> 'r2' or new.parent_type <> 'builds' or lower(new.name) not like '%.exe' or new.compression <> 'none' then
    raise exception 'R2 accepts uncompressed release EXE files only';
  end if;
  return new;
end;
$$;
update storage.buckets set file_size_limit = 52428800 where id = 'development-files';
commit;
-- Permit display-name edits and deletion for all shared attachments.
-- Object paths, providers, sizes, MIME types and parent links remain immutable.
begin;
drop policy if exists hub_shared_files_update on public.files;
create policy hub_shared_files_update on public.files for update to anon,authenticated
  using (public.hub_can_read_parent(parent_type,parent_id))
  with check (public.hub_can_read_parent(parent_type,parent_id));
drop policy if exists hub_shared_files_delete on public.files;
create policy hub_shared_files_delete on public.files for delete to anon,authenticated
  using (public.hub_can_read_parent(parent_type,parent_id));
drop policy if exists hub_storage_files_delete on storage.objects;
create policy hub_storage_files_delete on storage.objects for delete to anon,authenticated using (
  bucket_id = 'development-files' and exists (
    select 1 from public.files where path = storage.objects.name
      and storage_provider = 'supabase' and public.hub_can_read_parent(parent_type,parent_id)
  )
);
create or replace function public.hub_guard_file_comment() returns trigger language plpgsql set search_path = '' as $hub_comment$
begin
  if current_user in ('anon','authenticated') then
    if (to_jsonb(new) - 'comment' - 'name') is distinct from (to_jsonb(old) - 'comment' - 'name') then
      raise exception 'Only the file comment and name can be edited';
    end if;
    if new.comment is distinct from old.comment and new.parent_type <> 'builds' then
      raise exception 'Comments are only available for release files';
    end if;
    if length(trim(new.name)) not between 1 and 255 or new.name ~ E'[/\\\\\\r\\n]' or
       lower(substring(new.name from '\.[^.]+$')) is distinct from lower(substring(old.name from '\.[^.]+$')) then
      raise exception 'Use a valid filename and keep the original file extension';
    end if;
  end if;
  return new;
end;
$hub_comment$;
commit;

-- Persist file order within each release/report/progress entry.
begin;
alter table public.files add column if not exists sort_order bigint;
with ranked as (
  select id, row_number() over (partition by parent_type,parent_id order by created_at,id) - 1 as position from public.files
) update public.files f set sort_order = ranked.position from ranked where f.id = ranked.id and f.sort_order is null;
alter table public.files alter column sort_order set default 0;
alter table public.files alter column sort_order set not null;
alter table public.files drop constraint if exists files_sort_order_check;
alter table public.files add constraint files_sort_order_check check (sort_order between 0 and 2147483647);
create index if not exists hub_files_parent_order on public.files(parent_type,parent_id,sort_order,created_at,id);
create or replace function public.hub_append_file_order() returns trigger language plpgsql set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(new.parent_type || new.parent_id::text)::bigint);
  select coalesce(max(sort_order),-1) + 1 into new.sort_order from public.files where parent_type = new.parent_type and parent_id = new.parent_id;
  return new;
end;
$$;
drop trigger if exists hub_file_order_insert on public.files;
create trigger hub_file_order_insert before insert on public.files for each row execute function public.hub_append_file_order();
create or replace function public.hub_guard_file_comment() returns trigger language plpgsql set search_path = '' as $hub_comment$
begin
  if current_user in ('anon','authenticated') then
    if (to_jsonb(new) - 'comment' - 'name' - 'sort_order') is distinct from (to_jsonb(old) - 'comment' - 'name' - 'sort_order') then
      raise exception 'Only the file comment and name and order can be edited';
    end if;
    if new.comment is distinct from old.comment and new.parent_type <> 'builds' then
      raise exception 'Comments are only available for release files';
    end if;
    if length(trim(new.name)) not between 1 and 255 or new.name ~ E'[/\\\\\\r\\n]' or
       lower(substring(new.name from '\.[^.]+$')) is distinct from lower(substring(old.name from '\.[^.]+$')) then
      raise exception 'Use a valid filename and keep the original file extension';
    end if;
  end if;
  return new;
end;
$hub_comment$;

create or replace function public.hub_reorder_files(kind text, parent uuid, ordered_ids uuid[]) returns void language plpgsql set search_path = '' as $$
declare total bigint; changed bigint;
begin
  if kind not in ('builds','documents','weekly_updates','testing_reports') or not public.hub_can_read_parent(kind,parent) then raise exception 'Attachment parent not found'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(kind || parent::text)::bigint);
  select count(*) into total from public.files where parent_type = kind and parent_id = parent;
  if coalesce(cardinality(ordered_ids),0) = 0 or cardinality(ordered_ids) <> total or
    (select count(distinct id) from unnest(ordered_ids) id) <> total or
    (select count(*) from public.files where parent_type = kind and parent_id = parent and id = any(ordered_ids)) <> total then
    raise exception 'The file list changed. Refresh and retry';
  end if;
  update public.files f set sort_order = requested.position - 1
    from unnest(ordered_ids) with ordinality as requested(id,position)
    where f.id = requested.id and f.parent_type = kind and f.parent_id = parent;
  get diagnostics changed = row_count;
  if changed <> total then raise exception 'The file list changed. Refresh and retry'; end if;
end;
$$;
revoke all on function public.hub_reorder_files(text,uuid,uuid[]) from public;
grant execute on function public.hub_reorder_files(text,uuid,uuid[]) to anon,authenticated;
commit;
