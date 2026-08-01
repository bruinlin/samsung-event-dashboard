-- Collaboration V1.7: manually maintained Workstream Progress and controlled files.
-- Run after migrations/001, 002 and 003. This migration is incremental and idempotent.

begin;

alter table public.workstream_updates
  add column if not exists baseline_progress integer,
  add column if not exists progress integer,
  add column if not exists progress_set boolean not null default false;

alter table public.workstream_updates drop constraint if exists workstream_baseline_progress_valid;
alter table public.workstream_updates add constraint workstream_baseline_progress_valid
  check (baseline_progress is null or baseline_progress between 0 and 100);
alter table public.workstream_updates drop constraint if exists workstream_progress_valid;
alter table public.workstream_updates add constraint workstream_progress_valid
  check (progress is null or progress between 0 and 100);

-- Reviewed static baseline values. Completed and Planning records are normalized
-- below; in-progress and review values remain the currently maintained values.
with baseline(event_id, workstream_id, progress) as (values
  ('OCTS_2026','OCTS26-WS-01',100), ('OCTS_2026','OCTS26-WS-02',100),
  ('OCTS_2026','OCTS26-WS-03',100), ('OCTS_2026','OCTS26-WS-04',100),
  ('OCTS_2026','OCTS26-WS-05',100), ('OCTS_2026','OCTS26-WS-06',100),
  ('OCTS_2026','OCTS26-WS-07',100), ('OCTS_2026','OCTS26-WS-08',100),
  ('OCTS_2026','OCTS26-WS-09',100), ('OCTS_2026','OCTS26-WS-10',100),
  ('OCTS_2026','OCTS26-WS-11',100), ('OCTS_2026','OCTS26-WS-12',100),
  ('OCTS_2026','OCTS26-WS-13',100), ('OCTS_2026','OCTS26-WS-14',100),
  ('OCTS_2026','OCTS26-WS-15',100), ('ODX_2026','ODX26-WS-01',50),
  ('ODX_2026','ODX26-WS-02',100), ('ODX_2026','ODX26-WS-03',0),
  ('ODX_2026','ODX26-WS-04',30), ('ODX_2026','ODX26-WS-05',60),
  ('ODX_2026','ODX26-WS-06',30), ('ODX_2026','ODX26-WS-07',0),
  ('ODX_2026','ODX26-WS-08',0), ('ODX_2026','ODX26-WS-09',0),
  ('ICCAD_2026','ICCAD26-WS-01',0), ('ICCAD_2026','ICCAD26-WS-02',0),
  ('ICCAD_2026','ICCAD26-WS-03',0), ('ICCAD_2026','ICCAD26-WS-04',0),
  ('ICCAD_2026','ICCAD26-WS-05',0), ('ICCAD_2026','ICCAD26-WS-06',0),
  ('ICCAD_2026','ICCAD26-WS-07',0), ('ICCAD_2026','ICCAD26-WS-08',0),
  ('ICCAD_2026','ICCAD26-WS-09',0), ('ICCAD_2026','ICCAD26-WS-10',0),
  ('ICCAD_2026','ICCAD26-WS-11',0), ('ICCAD_2026','ICCAD26-WS-12',0)
)
update public.workstream_updates w
set baseline_progress = case coalesce(w.status, w.baseline_status)
  when 'Completed' then 100
  when 'Planning' then 0
  else baseline.progress
end
from baseline
where w.event_id = baseline.event_id and w.workstream_id = baseline.workstream_id
  and w.progress_set = false;

update public.workstream_updates
set progress = case coalesce(status, baseline_status)
  when 'Completed' then 100
  when 'Planning' then 0
  else greatest(0, least(100, coalesce(progress, baseline_progress, 0)))
end
where progress_set = true;

alter table public.change_history drop constraint if exists change_history_field_name_check;
alter table public.change_history add constraint change_history_field_name_check
  check (field_name in ('status', 'progress', 'due_date', 'owner', 'completed_date', 'latest_update', 'next_action'));

revoke all on function public.update_workstream_overlay(text,text,bigint,text,date,text,text,text,boolean,boolean,boolean,boolean,boolean) from public, anon, authenticated;
drop function if exists public.update_workstream_overlay(text,text,bigint,text,date,text,text,text,boolean,boolean,boolean,boolean,boolean);

create function public.update_workstream_overlay(
  p_event_id text,
  p_workstream_id text,
  p_expected_version bigint,
  p_status text,
  p_due_date date,
  p_owner text,
  p_progress integer,
  p_latest_update text,
  p_next_action text,
  p_status_set boolean,
  p_due_date_set boolean,
  p_owner_set boolean,
  p_progress_set boolean,
  p_latest_update_set boolean,
  p_next_action_set boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_row public.workstream_updates%rowtype;
  v_old_status text;
  v_old_due text;
  v_old_owner text;
  v_old_progress text;
  v_old_latest_update text;
  v_old_next_action text;
  v_effective_status text;
  v_stage_count integer;
  v_stage_completed integer;
  v_new_progress integer;
  v_new_latest_update text;
  v_new_next_action text;
begin
  if auth.uid() is null or not dashboard_private.can_edit(p_event_id, auth.uid()) then
    raise exception 'EDIT_NOT_AUTHORIZED' using errcode = '42501';
  end if;
  if p_status_set and (p_status is null or p_status not in ('Planning', 'In Progress', 'Under Review', 'Completed', 'Blocked')) then
    raise exception 'INVALID_STATUS' using errcode = '22023';
  end if;
  if p_progress_set and (p_progress is null or p_progress not between 0 and 100) then
    raise exception 'INVALID_PROGRESS' using errcode = '22023';
  end if;
  if p_latest_update_set and char_length(coalesce(p_latest_update, '')) > 500 then
    raise exception 'LATEST_UPDATE_TOO_LONG' using errcode = '22023';
  end if;
  if p_next_action_set and char_length(coalesce(p_next_action, '')) > 500 then
    raise exception 'NEXT_ACTION_TOO_LONG' using errcode = '22023';
  end if;

  select * into v_row from public.workstream_updates
  where event_id = p_event_id and workstream_id = p_workstream_id
  for update;
  if not found then raise exception 'UNKNOWN_WORKSTREAM' using errcode = '22023'; end if;
  if v_row.version <> p_expected_version then
    raise exception 'COLLAB_CONFLICT' using errcode = '40001';
  end if;

  select count(*), count(*) filter (where coalesce(s.status, s.baseline_status) = 'Completed')
    into v_stage_count, v_stage_completed
  from public.stage_updates s
  where s.event_id = p_event_id and s.workstream_id = p_workstream_id;

  if v_stage_count > 0 then
    if exists (select 1 from public.stage_updates s where s.event_id = p_event_id and s.workstream_id = p_workstream_id and coalesce(s.status, s.baseline_status) = 'Blocked') then
      v_effective_status := 'Blocked';
    elsif exists (select 1 from public.stage_updates s where s.event_id = p_event_id and s.workstream_id = p_workstream_id and coalesce(s.status, s.baseline_status) = 'Under Review') then
      v_effective_status := 'Under Review';
    elsif v_stage_completed = v_stage_count then
      v_effective_status := 'Completed';
    elsif v_stage_completed = 0 and not exists (select 1 from public.stage_updates s where s.event_id = p_event_id and s.workstream_id = p_workstream_id and coalesce(s.status, s.baseline_status) <> 'Planning') then
      v_effective_status := 'Planning';
    else
      v_effective_status := 'In Progress';
    end if;
  else
    v_effective_status := case when p_status_set then p_status else coalesce(v_row.status, v_row.baseline_status, 'Planning') end;
  end if;

  if p_progress_set and v_effective_status = 'Planning' and p_progress <> 0 then
    raise exception 'PLANNING_PROGRESS_MUST_BE_ZERO' using errcode = '22023';
  end if;
  if p_progress_set and v_effective_status = 'Completed' and p_progress <> 100 then
    raise exception 'COMPLETED_PROGRESS_MUST_BE_100' using errcode = '22023';
  end if;

  v_old_status := case when v_row.status_set then v_row.status else v_row.baseline_status end;
  v_old_due := (case when v_row.due_date_set then v_row.due_date else v_row.baseline_due_date end)::text;
  v_old_owner := case when v_row.owner_set then v_row.owner else v_row.baseline_owner end;
  v_old_progress := (case when v_row.progress_set then v_row.progress else v_row.baseline_progress end)::text;
  v_old_latest_update := case when v_row.latest_update_set then v_row.latest_update else null end;
  v_old_next_action := case when v_row.next_action_set then v_row.next_action else null end;
  v_new_progress := case when p_progress_set then p_progress else v_row.progress end;
  v_new_latest_update := case when p_latest_update_set then btrim(coalesce(p_latest_update, '')) else v_row.latest_update end;
  v_new_next_action := case when p_next_action_set then btrim(coalesce(p_next_action, '')) else v_row.next_action end;

  update public.workstream_updates set
    status = case when p_status_set then p_status else status end,
    due_date = case when p_due_date_set then p_due_date else due_date end,
    owner = case when p_owner_set then p_owner else owner end,
    progress = v_new_progress,
    latest_update = v_new_latest_update,
    next_action = v_new_next_action,
    status_set = status_set or p_status_set,
    due_date_set = due_date_set or p_due_date_set,
    owner_set = owner_set or p_owner_set,
    progress_set = progress_set or p_progress_set,
    latest_update_set = latest_update_set or p_latest_update_set,
    next_action_set = next_action_set or p_next_action_set,
    version = version + 1,
    updated_at = now(),
    updated_by = auth.uid()
  where event_id = p_event_id and workstream_id = p_workstream_id
  returning * into v_row;

  if p_status_set and v_old_status is distinct from p_status then
    insert into public.change_history(event_id, entity_type, workstream_id, field_name, old_value, new_value, changed_by)
    values (p_event_id, 'workstream', p_workstream_id, 'status', v_old_status, p_status, auth.uid());
  end if;
  if p_progress_set and v_old_progress is distinct from v_row.progress::text then
    insert into public.change_history(event_id, entity_type, workstream_id, field_name, old_value, new_value, changed_by)
    values (p_event_id, 'workstream', p_workstream_id, 'progress', v_old_progress, v_row.progress::text, auth.uid());
  end if;
  if p_due_date_set and v_old_due is distinct from p_due_date::text then
    insert into public.change_history(event_id, entity_type, workstream_id, field_name, old_value, new_value, changed_by)
    values (p_event_id, 'workstream', p_workstream_id, 'due_date', v_old_due, p_due_date::text, auth.uid());
  end if;
  if p_owner_set and v_old_owner is distinct from p_owner then
    insert into public.change_history(event_id, entity_type, workstream_id, field_name, old_value, new_value, changed_by)
    values (p_event_id, 'workstream', p_workstream_id, 'owner', v_old_owner, p_owner, auth.uid());
  end if;
  if p_latest_update_set and v_old_latest_update is distinct from v_row.latest_update then
    insert into public.change_history(event_id, entity_type, workstream_id, field_name, old_value, new_value, changed_by)
    values (p_event_id, 'workstream', p_workstream_id, 'latest_update', v_old_latest_update, v_row.latest_update, auth.uid());
  end if;
  if p_next_action_set and v_old_next_action is distinct from v_row.next_action then
    insert into public.change_history(event_id, entity_type, workstream_id, field_name, old_value, new_value, changed_by)
    values (p_event_id, 'workstream', p_workstream_id, 'next_action', v_old_next_action, v_row.next_action, auth.uid());
  end if;

  return jsonb_build_object('version', v_row.version, 'updated_at', v_row.updated_at, 'progress', v_row.progress, 'progress_set', v_row.progress_set);
end;
$$;

create or replace function public.get_dashboard_updates(p_event_id text)
returns jsonb language plpgsql stable security definer set search_path = public, pg_temp as $$
declare v_result jsonb;
begin
  if auth.uid() is null or not dashboard_private.can_download(p_event_id, auth.uid()) then
    raise exception 'DASHBOARD_READ_NOT_AUTHORIZED' using errcode = '42501';
  end if;
  select jsonb_build_object('workstreams', coalesce((
    select jsonb_agg(jsonb_build_object(
      'workstream_id', w.workstream_id, 'status', w.status, 'progress', w.progress, 'due_date', w.due_date, 'owner', w.owner,
      'latest_update', w.latest_update, 'next_action', w.next_action, 'status_set', w.status_set, 'progress_set', w.progress_set,
      'due_date_set', w.due_date_set, 'owner_set', w.owner_set, 'latest_update_set', w.latest_update_set, 'next_action_set', w.next_action_set,
      'version', w.version, 'updated_at', w.updated_at, 'updated_by_name', coalesce(nullif(p.display_name, ''), 'Member')
    ) order by w.workstream_id) from public.workstream_updates w left join public.profiles p on p.user_id = w.updated_by where w.event_id = p_event_id
  ), '[]'::jsonb), 'stages', coalesce((
    select jsonb_agg(jsonb_build_object(
      'workstream_id', s.workstream_id, 'stage_id', s.stage_id, 'status', s.status, 'due_date', s.due_date, 'owner', s.owner,
      'completed_date', s.completed_date, 'status_set', s.status_set, 'due_date_set', s.due_date_set, 'owner_set', s.owner_set,
      'completed_date_set', s.completed_date_set, 'version', s.version, 'updated_at', s.updated_at,
      'updated_by_name', coalesce(nullif(p.display_name, ''), 'Member')
    ) order by s.workstream_id, s.stage_id) from public.stage_updates s left join public.profiles p on p.user_id = s.updated_by where s.event_id = p_event_id
  ), '[]'::jsonb)) into v_result;
  return v_result;
end;
$$;

create or replace function public.get_public_dashboard_updates(p_event_id text)
returns jsonb language plpgsql stable security definer set search_path = public, pg_temp as $$
declare v_result jsonb;
begin
  select jsonb_build_object('workstreams', coalesce((
    select jsonb_agg(jsonb_build_object(
      'workstream_id', w.workstream_id, 'status', w.status, 'progress', w.progress, 'due_date', w.due_date, 'owner', w.owner,
      'latest_update', w.latest_update, 'next_action', w.next_action, 'status_set', w.status_set, 'progress_set', w.progress_set,
      'due_date_set', w.due_date_set, 'owner_set', w.owner_set, 'latest_update_set', w.latest_update_set, 'next_action_set', w.next_action_set,
      'version', w.version, 'updated_at', w.updated_at, 'updated_by_name', coalesce(nullif(p.display_name, ''), 'Member')
    ) order by w.workstream_id) from public.workstream_updates w left join public.profiles p on p.user_id = w.updated_by where w.event_id = p_event_id
  ), '[]'::jsonb), 'stages', coalesce((
    select jsonb_agg(jsonb_build_object(
      'workstream_id', s.workstream_id, 'stage_id', s.stage_id, 'status', s.status, 'due_date', s.due_date, 'owner', s.owner,
      'completed_date', s.completed_date, 'status_set', s.status_set, 'due_date_set', s.due_date_set, 'owner_set', s.owner_set,
      'completed_date_set', s.completed_date_set, 'version', s.version, 'updated_at', s.updated_at,
      'updated_by_name', coalesce(nullif(p.display_name, ''), 'Member')
    ) order by s.workstream_id, s.stage_id) from public.stage_updates s left join public.profiles p on p.user_id = s.updated_by where s.event_id = p_event_id
  ), '[]'::jsonb)) into v_result;
  return v_result;
end;
$$;

-- Stable private-object names replace the earlier document-ID placeholders.
insert into public.document_files (event_id, document_id, bucket_id, object_path, file_name) values
  ('OCTS_2026','OCTS-DOC-001','event-files','OCTS_2026/OCTS_2026_Main_Forum_Keynote_CN_Final.pdf','OCTS_2026_Main_Forum_Keynote_CN_Final.pdf'),
  ('OCTS_2026','OCTS-DOC-002','event-files','OCTS_2026/OCTS_2026_Main_Forum_Keynote_EN_Final.pdf','OCTS_2026_Main_Forum_Keynote_EN_Final.pdf'),
  ('OCTS_2026','OCTS-DOC-003','event-files','OCTS_2026/OCTS_2026_Main_Forum_Speech_Script_Final.pdf','OCTS_2026_Main_Forum_Speech_Script_Final.pdf'),
  ('OCTS_2026','OCTS-DOC-004','event-files','OCTS_2026/OCTS_2026_Post_Event_Report_Final.pdf','OCTS_2026_Post_Event_Report_Final.pdf')
on conflict (event_id, document_id) do update set bucket_id = excluded.bucket_id, object_path = excluded.object_path, file_name = excluded.file_name;

update storage.buckets
set public = false, file_size_limit = 52428800, allowed_mime_types = array['application/pdf']
where id = 'event-files';

revoke all on function public.update_workstream_overlay(text,text,bigint,text,date,text,integer,text,text,boolean,boolean,boolean,boolean,boolean,boolean) from public, anon, authenticated;
grant execute on function public.update_workstream_overlay(text,text,bigint,text,date,text,integer,text,text,boolean,boolean,boolean,boolean,boolean,boolean) to authenticated;
revoke all on function public.get_dashboard_updates(text) from public, anon, authenticated;
grant execute on function public.get_dashboard_updates(text) to authenticated;
revoke all on function public.get_public_dashboard_updates(text) from public, anon, authenticated;
grant execute on function public.get_public_dashboard_updates(text) to anon, authenticated;

commit;
