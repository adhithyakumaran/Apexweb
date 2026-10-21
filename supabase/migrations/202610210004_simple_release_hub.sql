-- Simplify the Hub without deleting existing releases, reports, or progress.
begin;
alter table public.files add column if not exists comment text not null default '' check (length(comment) <= 2000);
alter table public.weekly_updates add column if not exists title text not null default '';
update public.weekly_updates set title = left(summary,160) where title = '';
alter table public.testing_reports alter column build_id drop not null;
alter table public.testing_reports alter column findings set default '';
alter table public.builds alter column release_notes set default '';
alter table public.builds alter column instructions set default '';
alter table public.files drop constraint if exists files_size_check;
alter table public.files add constraint files_size_check check (size > 0 and size <= 52428800);
alter table public.files drop constraint if exists files_original_size_check;
alter table public.files add constraint files_original_size_check check (original_size > 0 and original_size <= 52428800);
update storage.buckets set file_size_limit = 52428800 where id = 'development-files';
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
