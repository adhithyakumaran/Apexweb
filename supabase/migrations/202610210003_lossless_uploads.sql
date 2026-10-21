begin;
alter table public.files add column if not exists compression text not null default 'none' check (compression in ('none','gzip'));
alter table public.files add column if not exists original_size bigint check (original_size > 0 and original_size <= 26214400);
update public.files set original_size = size where original_size is null;
commit;
