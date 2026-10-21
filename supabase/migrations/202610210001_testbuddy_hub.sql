-- TestBuddy Hub: run with the Supabase SQL editor or `supabase db push`.
begin;
create table public.members (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 160),
  role text not null default 'member' check (role in ('admin','member')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create function public.hub_member() returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.members where id = auth.uid() and active);
$$;
create function public.hub_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.members where id = auth.uid() and active and role = 'admin');
$$;
create table public.documents (
  id uuid primary key default gen_random_uuid(), title text not null,
  category text not null check (category in ('Architecture','Standards','Setup','Manual')),
  body text not null default '', published boolean not null default false,
  created_by uuid not null default auth.uid() references public.members(id), created_at timestamptz not null default now()
);
create table public.builds (
  id uuid primary key default gen_random_uuid(), version text not null unique,
  release_notes text not null, instructions text not null, known_issues text not null default '',
  published boolean not null default false,
  created_by uuid not null default auth.uid() references public.members(id), created_at timestamptz not null default now()
);
create table public.weekly_updates (
  id uuid primary key default gen_random_uuid(), week_start date not null, week_end date not null,
  summary text not null, published boolean not null default false,
  created_by uuid not null default auth.uid() references public.members(id), created_at timestamptz not null default now(),
  check (week_end >= week_start)
);
create table public.testing_reports (
  id uuid primary key default gen_random_uuid(), build_id uuid not null references public.builds(id), findings text not null,
  created_by uuid not null default auth.uid() references public.members(id), created_at timestamptz not null default now()
);
create table public.tasks (
  id uuid primary key default gen_random_uuid(), title text not null, description text not null default '',
  owner_id uuid references public.members(id), report_id uuid references public.testing_reports(id),
  priority text not null default 'Medium' check (priority in ('Low','Medium','High')),
  status text not null default 'Open' check (status in ('Open','In progress','Retest','Done')),
  created_by uuid not null default auth.uid() references public.members(id), created_at timestamptz not null default now()
);
create table public.events (
  id uuid primary key default gen_random_uuid(), title text not null, event_date date not null,
  created_by uuid not null default auth.uid() references public.members(id), created_at timestamptz not null default now()
);
create table public.files (
  id uuid primary key default gen_random_uuid(), path text not null unique, name text not null,
  size bigint not null check (size > 0 and size <= 26214400), mime_type text not null,
  parent_type text not null check (parent_type in ('documents','builds','weekly_updates','testing_reports')),
  parent_id uuid not null, created_by uuid not null default auth.uid() references public.members(id),
  created_at timestamptz not null default now(),
  check (split_part(path, '/', 1) = created_by::text)
);
create function public.hub_can_read_parent(kind text, parent uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.hub_member() and case kind
    when 'documents' then exists(select 1 from public.documents where id = parent and (published or public.hub_admin()))
    when 'builds' then exists(select 1 from public.builds where id = parent and (published or public.hub_admin()))
    when 'weekly_updates' then exists(select 1 from public.weekly_updates where id = parent and (published or public.hub_admin()))
    when 'testing_reports' then exists(select 1 from public.testing_reports where id = parent)
    else false end;
$$;
create function public.hub_can_attach(kind text, parent uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.hub_member() and case
    when kind = 'testing_reports' then exists(select 1 from public.testing_reports where id = parent and created_by = auth.uid())
    when public.hub_admin() then public.hub_can_read_parent(kind, parent)
    else false end;
$$;
-- Members may change only the status of tasks assigned to them, including via direct API requests.
create function public.hub_guard_task_update() returns trigger language plpgsql set search_path = '' as $$
begin
  if not public.hub_admin() and (
    old.owner_id is distinct from auth.uid() or
    (to_jsonb(new) - 'status') is distinct from (to_jsonb(old) - 'status')
  ) then raise exception 'Only task status can be updated by the assigned member'; end if;
  return new;
end;
$$;
create trigger hub_task_update before update on public.tasks for each row execute function public.hub_guard_task_update();
-- Metadata cannot point to arbitrary Storage paths or nonexistent parent records.
create function public.hub_check_file() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not public.hub_can_attach(new.parent_type, new.parent_id) then raise exception 'Attachment not allowed'; end if;
  if not exists(select 1 from storage.objects where bucket_id = 'development-files' and name = new.path and owner_id = auth.uid()::text) then
    raise exception 'Upload the owned object before creating metadata';
  end if;
  return new;
end;
$$;
create trigger hub_file_insert before insert on public.files for each row execute function public.hub_check_file();
-- Remove metadata when rolling back a failed submission. Storage cleanup happens first in the action.
create function public.hub_cleanup_files() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  delete from public.files where parent_type = tg_table_name and parent_id = old.id;
  return old;
end;
$$;
create trigger hub_report_cleanup after delete on public.testing_reports for each row execute function public.hub_cleanup_files();
create trigger hub_build_cleanup after delete on public.builds for each row execute function public.hub_cleanup_files();
create trigger hub_document_cleanup after delete on public.documents for each row execute function public.hub_cleanup_files();
create trigger hub_update_cleanup after delete on public.weekly_updates for each row execute function public.hub_cleanup_files();

alter table public.members enable row level security;
alter table public.documents enable row level security;
alter table public.builds enable row level security;
alter table public.weekly_updates enable row level security;
alter table public.testing_reports enable row level security;
alter table public.tasks enable row level security;
alter table public.events enable row level security;
alter table public.files enable row level security;
create policy members_read on public.members for select to authenticated using (public.hub_member());
create policy members_admin on public.members for all to authenticated using (public.hub_admin()) with check (public.hub_admin());
create policy documents_read on public.documents for select to authenticated using (public.hub_member() and published);
create policy documents_admin on public.documents for all to authenticated using (public.hub_admin()) with check (public.hub_admin());
create policy builds_read on public.builds for select to authenticated using (public.hub_member() and published);
create policy builds_admin on public.builds for all to authenticated using (public.hub_admin()) with check (public.hub_admin());
create policy updates_read on public.weekly_updates for select to authenticated using (public.hub_member() and published);
create policy updates_admin on public.weekly_updates for all to authenticated using (public.hub_admin()) with check (public.hub_admin());
create policy reports_read on public.testing_reports for select to authenticated using (public.hub_member());
create policy reports_submit on public.testing_reports for insert to authenticated with check (
  public.hub_member() and created_by = auth.uid() and exists(select 1 from public.builds where id = build_id and published)
);
create policy reports_rollback on public.testing_reports for delete to authenticated using (public.hub_member() and created_by = auth.uid());
create policy tasks_read on public.tasks for select to authenticated using (public.hub_member());
create policy tasks_admin on public.tasks for all to authenticated using (public.hub_admin()) with check (public.hub_admin());
create policy tasks_assigned_update on public.tasks for update to authenticated using (public.hub_member() and owner_id = auth.uid()) with check (public.hub_member() and owner_id = auth.uid());
create policy events_read on public.events for select to authenticated using (public.hub_member());
create policy events_admin on public.events for all to authenticated using (public.hub_admin()) with check (public.hub_admin());
create policy files_read on public.files for select to authenticated using (public.hub_can_read_parent(parent_type,parent_id));
create policy files_insert on public.files for insert to authenticated with check (created_by = auth.uid() and public.hub_can_attach(parent_type,parent_id));

insert into storage.buckets (id,name,public,file_size_limit) values ('development-files','development-files',false,26214400);
create policy hub_storage_read on storage.objects for select to authenticated using (
  bucket_id = 'development-files' and public.hub_member() and (owner_id = auth.uid()::text or exists(select 1 from public.files where path = storage.objects.name and public.hub_can_read_parent(parent_type,parent_id)))
);
create policy hub_storage_upload on storage.objects for insert to authenticated with check (
  bucket_id = 'development-files' and public.hub_member() and (storage.foldername(name))[1] = auth.uid()::text and owner_id = auth.uid()::text
);
create policy hub_storage_rollback on storage.objects for delete to authenticated using (
  bucket_id = 'development-files' and public.hub_member() and owner_id = auth.uid()::text
);
create index files_parent_idx on public.files(parent_type,parent_id);
create index reports_build_idx on public.testing_reports(build_id);
create index tasks_owner_idx on public.tasks(owner_id);
create index tasks_report_idx on public.tasks(report_id);
create index events_date_idx on public.events(event_date);
-- Explicit grants: RLS, not possession of the public API key, authorizes rows.
grant select,insert,update,delete on public.members,public.documents,public.builds,public.weekly_updates,public.testing_reports,public.tasks,public.events,public.files to authenticated;
revoke all on function public.hub_member(), public.hub_admin(), public.hub_can_read_parent(text,uuid), public.hub_can_attach(text,uuid) from public;
grant execute on function public.hub_member(), public.hub_admin(), public.hub_can_read_parent(text,uuid), public.hub_can_attach(text,uuid) to authenticated;
commit;
