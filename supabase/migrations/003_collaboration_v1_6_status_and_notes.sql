-- Samsung Event Dashboard Collaboration V1.6.6
-- Canonical five-status model plus Workstream Latest Update / Next Action overlays.
-- Run after 001_collaboration_v1.sql and 002_public_dashboard_overlay_v1.sql.

begin;

-- The current audit found no Not Applicable workstreams or stages. Fail closed
-- instead of silently converting a future Not Applicable record into a normal task.
do $$
begin
  if exists (
    select 1 from public.workstream_updates
    where coalesce(status, baseline_status) = 'Not Applicable'
  ) or exists (
    select 1 from public.stage_updates
    where coalesce(status, baseline_status) = 'Not Applicable'
  ) then
    raise exception 'NOT_APPLICABLE_RECORDS_REQUIRE_MANUAL_TASK_REVIEW';
  end if;
end $$;

alter table public.workstream_updates
  add column if not exists latest_update text,
  add column if not exists latest_update_set boolean not null default false,
  add column if not exists next_action text,
  add column if not exists next_action_set boolean not null default false;

-- Existing collaboration overlays may already contain a canonical value. Allow
-- both vocabularies during the data conversion, then tighten to five values.
alter table public.workstream_updates drop constraint if exists workstream_status_valid;
alter table public.workstream_updates add constraint workstream_status_valid
  check (status is null or status in (
    'Not Started', 'In Progress', 'Internal Review', 'HQ Review', 'Pending Approval', 'Pending Review',
    'Confirmed', 'In Production', 'Completed', 'Blocked', 'Needs Update', 'Not Applicable',
    'Planning', 'Under Review'
  ));

alter table public.stage_updates drop constraint if exists stage_status_valid;
alter table public.stage_updates add constraint stage_status_valid
  check (status is null or status in (
    'Not Started', 'In Progress', 'Pending Review', 'Completed', 'Blocked', 'Planning', 'Under Review'
  ));

update public.workstream_updates
set
  baseline_status = case baseline_status
    when 'Not Started' then 'Planning'
    when 'Confirmed' then 'Planning'
    when 'In Progress' then 'In Progress'
    when 'In Production' then 'In Progress'
    when 'Needs Update' then 'In Progress'
    when 'Internal Review' then 'Under Review'
    when 'HQ Review' then 'Under Review'
    when 'Pending Approval' then 'Under Review'
    when 'Pending Review' then 'Under Review'
    when 'Completed' then 'Completed'
    when 'Blocked' then 'Blocked'
    else baseline_status
  end,
  status = case status
    when 'Not Started' then 'Planning'
    when 'Confirmed' then 'Planning'
    when 'In Progress' then 'In Progress'
    when 'In Production' then 'In Progress'
    when 'Needs Update' then 'In Progress'
    when 'Internal Review' then 'Under Review'
    when 'HQ Review' then 'Under Review'
    when 'Pending Approval' then 'Under Review'
    when 'Pending Review' then 'Under Review'
    when 'Completed' then 'Completed'
    when 'Blocked' then 'Blocked'
    else status
  end;

update public.stage_updates
set
  baseline_status = case baseline_status
    when 'Not Started' then 'Planning'
    when 'Confirmed' then 'Planning'
    when 'In Progress' then 'In Progress'
    when 'In Production' then 'In Progress'
    when 'Needs Update' then 'In Progress'
    when 'Internal Review' then 'Under Review'
    when 'HQ Review' then 'Under Review'
    when 'Pending Approval' then 'Under Review'
    when 'Pending Review' then 'Under Review'
    when 'Completed' then 'Completed'
    when 'Blocked' then 'Blocked'
    else baseline_status
  end,
  status = case status
    when 'Not Started' then 'Planning'
    when 'Confirmed' then 'Planning'
    when 'In Progress' then 'In Progress'
    when 'In Production' then 'In Progress'
    when 'Needs Update' then 'In Progress'
    when 'Internal Review' then 'Under Review'
    when 'HQ Review' then 'Under Review'
    when 'Pending Approval' then 'Under Review'
    when 'Pending Review' then 'Under Review'
    when 'Completed' then 'Completed'
    when 'Blocked' then 'Blocked'
    else status
  end;

alter table public.workstream_updates drop constraint if exists workstream_status_valid;
alter table public.workstream_updates add constraint workstream_status_valid
  check (status is null or status in ('Planning', 'In Progress', 'Under Review', 'Completed', 'Blocked'));

alter table public.stage_updates drop constraint if exists stage_status_valid;
alter table public.stage_updates add constraint stage_status_valid
  check (status is null or status in ('Planning', 'In Progress', 'Under Review', 'Completed', 'Blocked'));

alter table public.change_history drop constraint if exists change_history_field_name_check;
alter table public.change_history add constraint change_history_field_name_check
  check (field_name in ('status', 'due_date', 'owner', 'completed_date', 'latest_update', 'next_action'));

revoke all on function public.update_workstream_overlay(text,text,bigint,text,date,text,boolean,boolean,boolean) from public, anon, authenticated;
drop function public.update_workstream_overlay(text,text,bigint,text,date,text,boolean,boolean,boolean);

create function public.update_workstream_overlay(
  p_event_id text,
  p_workstream_id text,
  p_expected_version bigint,
  p_status text,
  p_due_date date,
  p_owner text,
  p_latest_update text,
  p_next_action text,
  p_status_set boolean,
  p_due_date_set boolean,
  p_owner_set boolean,
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
  v_old_latest_update text;
  v_old_next_action text;
  v_new_latest_update text;
  v_new_next_action text;
begin
  if auth.uid() is null or not dashboard_private.can_edit(p_event_id, auth.uid()) then
    raise exception 'EDIT_NOT_AUTHORIZED' using errcode = '42501';
  end if;
  if p_status_set and (p_status is null or p_status not in ('Planning', 'In Progress', 'Under Review', 'Completed', 'Blocked')) then
    raise exception 'INVALID_STATUS' using errcode = '22023';
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

  v_old_status := case when v_row.status_set then v_row.status else v_row.baseline_status end;
  v_old_due := (case when v_row.due_date_set then v_row.due_date else v_row.baseline_due_date end)::text;
  v_old_owner := case when v_row.owner_set then v_row.owner else v_row.baseline_owner end;
  v_old_latest_update := case when v_row.latest_update_set then v_row.latest_update else null end;
  v_old_next_action := case when v_row.next_action_set then v_row.next_action else null end;
  v_new_latest_update := case when p_latest_update_set then btrim(coalesce(p_latest_update, '')) else v_row.latest_update end;
  v_new_next_action := case when p_next_action_set then btrim(coalesce(p_next_action, '')) else v_row.next_action end;

  update public.workstream_updates set
    status = case when p_status_set then p_status else status end,
    due_date = case when p_due_date_set then p_due_date else due_date end,
    owner = case when p_owner_set then p_owner else owner end,
    latest_update = v_new_latest_update,
    next_action = v_new_next_action,
    status_set = status_set or p_status_set,
    due_date_set = due_date_set or p_due_date_set,
    owner_set = owner_set or p_owner_set,
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

  return jsonb_build_object('version', v_row.version, 'updated_at', v_row.updated_at);
end;
$$;

create or replace function public.update_stage_overlay(
  p_event_id text,
  p_workstream_id text,
  p_stage_id text,
  p_expected_version bigint,
  p_status text,
  p_due_date date,
  p_owner text,
  p_status_set boolean,
  p_due_date_set boolean,
  p_owner_set boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_row public.stage_updates%rowtype;
  v_old_status text;
  v_old_due text;
  v_old_owner text;
  v_old_completed text;
  v_new_completed date;
  v_completed_set boolean;
begin
  if auth.uid() is null or not dashboard_private.can_edit(p_event_id, auth.uid()) then
    raise exception 'EDIT_NOT_AUTHORIZED' using errcode = '42501';
  end if;
  if p_status_set and (p_status is null or p_status not in ('Planning', 'In Progress', 'Under Review', 'Completed', 'Blocked')) then
    raise exception 'INVALID_STAGE_STATUS' using errcode = '22023';
  end if;

  select * into v_row from public.stage_updates
  where event_id = p_event_id and workstream_id = p_workstream_id and stage_id = p_stage_id
  for update;
  if not found then raise exception 'UNKNOWN_STAGE' using errcode = '22023'; end if;
  if v_row.version <> p_expected_version then
    raise exception 'COLLAB_CONFLICT' using errcode = '40001';
  end if;

  v_old_status := case when v_row.status_set then v_row.status else v_row.baseline_status end;
  v_old_due := (case when v_row.due_date_set then v_row.due_date else v_row.baseline_due_date end)::text;
  v_old_owner := case when v_row.owner_set then v_row.owner else v_row.baseline_owner end;
  v_old_completed := (case when v_row.completed_date_set then v_row.completed_date else v_row.baseline_completed_date end)::text;
  v_completed_set := v_row.completed_date_set;
  v_new_completed := v_row.completed_date;
  if p_status_set and p_status = 'Completed' and v_old_status is distinct from 'Completed' then
    v_new_completed := current_date;
    v_completed_set := true;
  elsif p_status_set and p_status <> 'Completed' and v_old_status = 'Completed' then
    v_new_completed := null;
    v_completed_set := true;
  end if;

  update public.stage_updates set
    status = case when p_status_set then p_status else status end,
    due_date = case when p_due_date_set then p_due_date else due_date end,
    owner = case when p_owner_set then p_owner else owner end,
    completed_date = v_new_completed,
    status_set = status_set or p_status_set,
    due_date_set = due_date_set or p_due_date_set,
    owner_set = owner_set or p_owner_set,
    completed_date_set = v_completed_set,
    version = version + 1,
    updated_at = now(),
    updated_by = auth.uid()
  where event_id = p_event_id and workstream_id = p_workstream_id and stage_id = p_stage_id
  returning * into v_row;

  if p_status_set and v_old_status is distinct from p_status then
    insert into public.change_history(event_id, entity_type, workstream_id, stage_id, field_name, old_value, new_value, changed_by)
    values (p_event_id, 'stage', p_workstream_id, p_stage_id, 'status', v_old_status, p_status, auth.uid());
  end if;
  if p_due_date_set and v_old_due is distinct from p_due_date::text then
    insert into public.change_history(event_id, entity_type, workstream_id, stage_id, field_name, old_value, new_value, changed_by)
    values (p_event_id, 'stage', p_workstream_id, p_stage_id, 'due_date', v_old_due, p_due_date::text, auth.uid());
  end if;
  if p_owner_set and v_old_owner is distinct from p_owner then
    insert into public.change_history(event_id, entity_type, workstream_id, stage_id, field_name, old_value, new_value, changed_by)
    values (p_event_id, 'stage', p_workstream_id, p_stage_id, 'owner', v_old_owner, p_owner, auth.uid());
  end if;
  if v_old_completed is distinct from v_row.completed_date::text then
    insert into public.change_history(event_id, entity_type, workstream_id, stage_id, field_name, old_value, new_value, changed_by)
    values (p_event_id, 'stage', p_workstream_id, p_stage_id, 'completed_date', v_old_completed, v_row.completed_date::text, auth.uid());
  end if;

  return jsonb_build_object('version', v_row.version, 'updated_at', v_row.updated_at, 'completed_date', v_row.completed_date);
end;
$$;

create or replace function public.get_dashboard_updates(p_event_id text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_result jsonb;
begin
  if auth.uid() is null or not dashboard_private.can_download(p_event_id, auth.uid()) then
    raise exception 'DASHBOARD_READ_NOT_AUTHORIZED' using errcode = '42501';
  end if;
  select jsonb_build_object(
    'workstreams', coalesce((
      select jsonb_agg(jsonb_build_object(
        'workstream_id', w.workstream_id, 'status', w.status, 'due_date', w.due_date, 'owner', w.owner,
        'latest_update', w.latest_update, 'next_action', w.next_action,
        'status_set', w.status_set, 'due_date_set', w.due_date_set, 'owner_set', w.owner_set,
        'latest_update_set', w.latest_update_set, 'next_action_set', w.next_action_set,
        'version', w.version, 'updated_at', w.updated_at,
        'updated_by_name', coalesce(nullif(p.display_name, ''), 'Member')
      ) order by w.workstream_id)
      from public.workstream_updates w left join public.profiles p on p.user_id = w.updated_by
      where w.event_id = p_event_id
    ), '[]'::jsonb),
    'stages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'workstream_id', s.workstream_id, 'stage_id', s.stage_id, 'status', s.status, 'due_date', s.due_date,
        'owner', s.owner, 'completed_date', s.completed_date, 'status_set', s.status_set,
        'due_date_set', s.due_date_set, 'owner_set', s.owner_set, 'completed_date_set', s.completed_date_set,
        'version', s.version, 'updated_at', s.updated_at,
        'updated_by_name', coalesce(nullif(p.display_name, ''), 'Member')
      ) order by s.workstream_id, s.stage_id)
      from public.stage_updates s left join public.profiles p on p.user_id = s.updated_by
      where s.event_id = p_event_id
    ), '[]'::jsonb)
  ) into v_result;
  return v_result;
end;
$$;

create or replace function public.get_public_dashboard_updates(p_event_id text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_result jsonb;
begin
  select jsonb_build_object(
    'workstreams', coalesce((
      select jsonb_agg(jsonb_build_object(
        'workstream_id', w.workstream_id, 'status', w.status, 'due_date', w.due_date, 'owner', w.owner,
        'latest_update', w.latest_update, 'next_action', w.next_action,
        'status_set', w.status_set, 'due_date_set', w.due_date_set, 'owner_set', w.owner_set,
        'latest_update_set', w.latest_update_set, 'next_action_set', w.next_action_set,
        'version', w.version, 'updated_at', w.updated_at,
        'updated_by_name', coalesce(nullif(p.display_name, ''), 'Member')
      ) order by w.workstream_id)
      from public.workstream_updates w left join public.profiles p on p.user_id = w.updated_by
      where w.event_id = p_event_id
    ), '[]'::jsonb),
    'stages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'workstream_id', s.workstream_id, 'stage_id', s.stage_id, 'status', s.status, 'due_date', s.due_date,
        'owner', s.owner, 'completed_date', s.completed_date, 'status_set', s.status_set,
        'due_date_set', s.due_date_set, 'owner_set', s.owner_set, 'completed_date_set', s.completed_date_set,
        'version', s.version, 'updated_at', s.updated_at,
        'updated_by_name', coalesce(nullif(p.display_name, ''), 'Member')
      ) order by s.workstream_id, s.stage_id)
      from public.stage_updates s left join public.profiles p on p.user_id = s.updated_by
      where s.event_id = p_event_id
    ), '[]'::jsonb)
  ) into v_result;
  return v_result;
end;
$$;

revoke all on function public.update_workstream_overlay(text,text,bigint,text,date,text,text,text,boolean,boolean,boolean,boolean,boolean) from public, anon, authenticated;
grant execute on function public.update_workstream_overlay(text,text,bigint,text,date,text,text,text,boolean,boolean,boolean,boolean,boolean) to authenticated;
revoke all on function public.update_stage_overlay(text,text,text,bigint,text,date,text,boolean,boolean,boolean) from public, anon, authenticated;
grant execute on function public.update_stage_overlay(text,text,text,bigint,text,date,text,boolean,boolean,boolean) to authenticated;
revoke all on function public.get_dashboard_updates(text) from public, anon, authenticated;
grant execute on function public.get_dashboard_updates(text) to authenticated;
revoke all on function public.get_public_dashboard_updates(text) from public, anon, authenticated;
grant execute on function public.get_public_dashboard_updates(text) to anon, authenticated;

commit;
