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
