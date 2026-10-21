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
