-- Samsung Event Dashboard 1.9.0: private Preview/Final document versions.
-- Incremental only: legacy OCTS mappings remain valid and no Storage object is moved.

begin;

alter table public.document_files
  add column if not exists logical_document_id text,
  add column if not exists display_name_cn text,
  add column if not exists display_name_en text,
  add column if not exists category text,
  add column if not exists subcategory text,
  add column if not exists version_label text,
  add column if not exists lifecycle text,
  add column if not exists original_file_name text,
  add column if not exists mime_type text,
  add column if not exists file_size_bytes bigint,
  add column if not exists uploaded_at timestamptz,
  add column if not exists uploaded_by uuid references auth.users(id) on delete restrict,
  add column if not exists archived boolean not null default false,
  add column if not exists upload_state text not null default 'available',
  add column if not exists is_dynamic boolean not null default false;

update public.document_files
set logical_document_id = coalesce(logical_document_id, document_id),
    version_label = coalesce(version_label, 'Final'),
    lifecycle = coalesce(lifecycle, 'Final'),
    original_file_name = coalesce(original_file_name, file_name),
    mime_type = coalesce(mime_type, 'application/pdf'),
    uploaded_at = coalesce(uploaded_at, created_at),
    upload_state = coalesce(upload_state, 'available')
where logical_document_id is null
   or version_label is null
   or lifecycle is null
   or original_file_name is null
   or mime_type is null
   or uploaded_at is null;

alter table public.document_files drop constraint if exists document_files_lifecycle_valid;
alter table public.document_files add constraint document_files_lifecycle_valid
  check (lifecycle in ('Preview', 'Final'));
alter table public.document_files drop constraint if exists document_files_upload_state_valid;
alter table public.document_files add constraint document_files_upload_state_valid
  check (upload_state in ('pending', 'available', 'failed'));
alter table public.document_files drop constraint if exists document_files_pdf_mime_valid;
alter table public.document_files add constraint document_files_pdf_mime_valid
  check (mime_type is null or mime_type = 'application/pdf');
alter table public.document_files drop constraint if exists document_files_size_valid;
alter table public.document_files add constraint document_files_size_valid
  check (file_size_bytes is null or (file_size_bytes > 0 and file_size_bytes <= 52428800));

create index if not exists document_files_event_logical_idx
  on public.document_files(event_id, logical_document_id, uploaded_at desc);
create index if not exists document_files_dynamic_available_idx
  on public.document_files(event_id, uploaded_at desc)
  where is_dynamic and upload_state = 'available' and not archived;

create or replace function dashboard_private.can_read_document_object(
  p_bucket_id text,
  p_object_path text,
  p_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select p_user_id is not null and exists (
    select 1
    from public.document_files d
    join public.profiles p on p.user_id = p_user_id and p.is_approved
    where d.bucket_id = p_bucket_id
      and d.object_path = p_object_path
      and d.upload_state = 'available'
      and not d.archived
      and (p.is_admin or exists (
        select 1 from public.event_members m
        where m.event_id = d.event_id and m.user_id = p_user_id
      ))
  );
$$;

create or replace function dashboard_private.can_upload_document_object(
  p_bucket_id text,
  p_object_path text,
  p_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select p_user_id is not null and exists (
    select 1
    from public.document_files d
    where d.bucket_id = p_bucket_id
      and d.object_path = p_object_path
      and d.upload_state = 'pending'
      and d.uploaded_by = p_user_id
      and dashboard_private.can_edit(d.event_id, p_user_id)
  );
$$;

create or replace function public.get_public_event_documents(p_event_id text)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'document_id', d.document_id,
    'logical_document_id', d.logical_document_id,
    'name_cn', d.display_name_cn,
    'name_en', d.display_name_en,
    'category', d.category,
    'subcategory', d.subcategory,
    'version_label', d.version_label,
    'lifecycle', d.lifecycle,
    'mime_type', d.mime_type,
    'file_size_bytes', d.file_size_bytes,
    'uploaded_at', d.uploaded_at,
    'archived', d.archived
  ) order by d.uploaded_at desc, d.document_id desc), '[]'::jsonb)
  from public.document_files d
  where d.event_id = p_event_id
    and d.is_dynamic
    and d.upload_state = 'available'
    and not d.archived;
$$;

create or replace function public.create_document_upload(
  p_event_id text,
  p_logical_document_id text,
  p_display_name_cn text,
  p_display_name_en text,
  p_category text,
  p_subcategory text,
  p_version_label text,
  p_lifecycle text,
  p_original_file_name text,
  p_mime_type text,
  p_file_size_bytes bigint
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_document_id text := 'DOC-' || extensions.gen_random_uuid()::text;
  v_logical_document_id text;
  v_object_path text;
  v_name_cn text := btrim(coalesce(p_display_name_cn, ''));
  v_name_en text := nullif(btrim(coalesce(p_display_name_en, '')), '');
  v_category text := btrim(coalesce(p_category, ''));
  v_subcategory text := nullif(btrim(coalesce(p_subcategory, '')), '');
  v_version_label text := btrim(coalesce(p_version_label, ''));
  v_lifecycle text := btrim(coalesce(p_lifecycle, ''));
  v_original_file_name text := btrim(coalesce(p_original_file_name, ''));
begin
  if auth.uid() is null or not dashboard_private.can_edit(p_event_id, auth.uid()) then
    raise exception 'DOCUMENT_UPLOAD_NOT_AUTHORIZED' using errcode = '42501';
  end if;
  if v_name_cn = '' or char_length(v_name_cn) > 200 then raise exception 'INVALID_DOCUMENT_NAME' using errcode = '22023'; end if;
  if v_name_en is not null and char_length(v_name_en) > 200 then raise exception 'INVALID_DOCUMENT_NAME' using errcode = '22023'; end if;
  if v_category = '' or char_length(v_category) > 80 then raise exception 'INVALID_DOCUMENT_CATEGORY' using errcode = '22023'; end if;
  if v_subcategory is not null and char_length(v_subcategory) > 120 then raise exception 'INVALID_DOCUMENT_SUBCATEGORY' using errcode = '22023'; end if;
  if v_version_label = '' or char_length(v_version_label) > 60 then raise exception 'INVALID_DOCUMENT_VERSION' using errcode = '22023'; end if;
  if v_lifecycle not in ('Preview', 'Final') then raise exception 'INVALID_DOCUMENT_LIFECYCLE' using errcode = '22023'; end if;
  if v_original_file_name !~* '\\.pdf$' or char_length(v_original_file_name) > 255 then raise exception 'INVALID_PDF_FILE_NAME' using errcode = '22023'; end if;
  if p_mime_type <> 'application/pdf' then raise exception 'PDF_ONLY' using errcode = '22023'; end if;
  if p_file_size_bytes is null or p_file_size_bytes <= 0 or p_file_size_bytes > 52428800 then raise exception 'INVALID_PDF_SIZE' using errcode = '22023'; end if;

  v_logical_document_id := nullif(btrim(coalesce(p_logical_document_id, '')), '');
  if v_logical_document_id is null then v_logical_document_id := v_document_id; end if;
  if v_logical_document_id !~ '^[A-Za-z0-9_-]{1,160}$' then raise exception 'INVALID_LOGICAL_DOCUMENT_ID' using errcode = '22023'; end if;
  v_object_path := p_event_id || '/' || v_document_id || '.pdf';

  insert into public.document_files (
    event_id, document_id, logical_document_id, display_name_cn, display_name_en,
    category, subcategory, version_label, lifecycle, bucket_id, object_path,
    file_name, original_file_name, mime_type, file_size_bytes, uploaded_by,
    upload_state, is_dynamic
  ) values (
    p_event_id, v_document_id, v_logical_document_id, v_name_cn, v_name_en,
    v_category, v_subcategory, v_version_label, v_lifecycle, 'event-files', v_object_path,
    v_original_file_name, v_original_file_name, p_mime_type, p_file_size_bytes, auth.uid(),
    'pending', true
  );

  return jsonb_build_object('document_id', v_document_id, 'object_path', v_object_path);
end;
$$;

create or replace function public.finalize_document_upload(p_event_id text, p_document_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_file public.document_files%rowtype;
  v_mime_type text;
  v_size_text text;
begin
  if auth.uid() is null or not dashboard_private.can_edit(p_event_id, auth.uid()) then
    raise exception 'DOCUMENT_UPLOAD_NOT_AUTHORIZED' using errcode = '42501';
  end if;
  select * into v_file from public.document_files
  where event_id = p_event_id and document_id = p_document_id and is_dynamic and uploaded_by = auth.uid()
  for update;
  if not found then raise exception 'DOCUMENT_UPLOAD_NOT_FOUND' using errcode = '22023'; end if;
  if v_file.upload_state <> 'pending' then raise exception 'DOCUMENT_UPLOAD_NOT_PENDING' using errcode = '22023'; end if;

  select coalesce(o.metadata ->> 'mimetype', ''), coalesce(o.metadata ->> 'size', '')
    into v_mime_type, v_size_text
  from storage.objects o
  where o.bucket_id = v_file.bucket_id and o.name = v_file.object_path;
  if not found then raise exception 'DOCUMENT_OBJECT_NOT_FOUND' using errcode = '22023'; end if;
  if v_mime_type <> 'application/pdf' then raise exception 'PDF_ONLY' using errcode = '22023'; end if;
  if v_size_text !~ '^[0-9]+$' or v_size_text::bigint <= 0 or v_size_text::bigint > 52428800 then
    raise exception 'INVALID_PDF_SIZE' using errcode = '22023';
  end if;

  update public.document_files
  set upload_state = 'available', uploaded_at = now(), file_size_bytes = v_size_text::bigint
  where event_id = p_event_id and document_id = p_document_id
  returning * into v_file;

  return jsonb_build_object(
    'document_id', v_file.document_id,
    'logical_document_id', v_file.logical_document_id,
    'uploaded_at', v_file.uploaded_at
  );
end;
$$;

create or replace function public.get_document_file(p_event_id text, p_document_id text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare v_file public.document_files%rowtype;
begin
  if auth.uid() is null or not dashboard_private.can_download(p_event_id, auth.uid()) then
    raise exception 'DOWNLOAD_NOT_AUTHORIZED' using errcode = '42501';
  end if;
  select * into v_file from public.document_files
  where event_id = p_event_id and document_id = p_document_id
    and upload_state = 'available' and not archived;
  if not found then raise exception 'DOCUMENT_NOT_MIGRATED' using errcode = '22023'; end if;
  return jsonb_build_object('bucket_id', v_file.bucket_id, 'object_path', v_file.object_path, 'file_name', v_file.file_name);
end;
$$;

alter table public.document_files enable row level security;
drop policy if exists document_member_read on public.document_files;

drop policy if exists event_file_member_download on storage.objects;
create policy event_file_member_download on storage.objects
for select to authenticated
using (
  bucket_id = 'event-files'
  and dashboard_private.can_read_document_object(bucket_id, name, (select auth.uid()))
);

drop policy if exists event_file_editor_upload on storage.objects;
create policy event_file_editor_upload on storage.objects
for insert to authenticated
with check (
  bucket_id = 'event-files'
  and dashboard_private.can_upload_document_object(bucket_id, name, (select auth.uid()))
);

update storage.buckets
set public = false, file_size_limit = 52428800, allowed_mime_types = array['application/pdf']
where id = 'event-files';

revoke all on public.document_files from public, anon, authenticated;
revoke all on function dashboard_private.can_read_document_object(text,text,uuid) from public, anon, authenticated;
revoke all on function dashboard_private.can_upload_document_object(text,text,uuid) from public, anon, authenticated;
revoke all on function public.get_public_event_documents(text) from public, anon, authenticated;
revoke all on function public.create_document_upload(text,text,text,text,text,text,text,text,text,text,bigint) from public, anon, authenticated;
revoke all on function public.finalize_document_upload(text,text) from public, anon, authenticated;
revoke all on function public.get_document_file(text,text) from public, anon, authenticated;
grant execute on function public.get_public_event_documents(text) to anon, authenticated;
grant execute on function public.create_document_upload(text,text,text,text,text,text,text,text,text,text,bigint) to authenticated;
grant execute on function public.finalize_document_upload(text,text) to authenticated;
grant execute on function public.get_document_file(text,text) to authenticated;
grant select, insert on storage.objects to authenticated;

commit;
