-- Explicit URL-access mode: anyone can read, upload, publish, and manage Hub content.
-- This does not provide authentication or URL-based authorization.
begin;
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
commit;
