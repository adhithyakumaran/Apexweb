-- Raise both metadata and bucket limits for large installers. Repeatable.
-- Also raise Supabase Storage's project-wide limit in Dashboard settings.
begin;
alter table public.files drop constraint if exists files_size_check;
alter table public.files add constraint files_size_check check (size > 0 and size <= 262144000);
alter table public.files drop constraint if exists files_original_size_check;
alter table public.files add constraint files_original_size_check check (original_size > 0 and original_size <= 262144000);
update storage.buckets set file_size_limit = 262144000 where id = 'development-files';
commit;
