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
