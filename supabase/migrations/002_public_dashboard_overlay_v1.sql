-- Samsung Event Dashboard Collaboration V1.6.2
-- Public dashboard overlay: only non-sensitive project-display fields.
-- This migration intentionally leaves direct table RLS and private Storage unchanged.

begin;

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
        'workstream_id', w.workstream_id,
        'status', w.status,
        'due_date', w.due_date,
        'owner', w.owner,
        'status_set', w.status_set,
        'due_date_set', w.due_date_set,
        'owner_set', w.owner_set,
        'version', w.version,
        'updated_at', w.updated_at,
        'updated_by_name', coalesce(nullif(p.display_name, ''), 'Member')
      ) order by w.workstream_id)
      from public.workstream_updates w
      left join public.profiles p on p.user_id = w.updated_by
      where w.event_id = p_event_id
    ), '[]'::jsonb),
    'stages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'workstream_id', s.workstream_id,
        'stage_id', s.stage_id,
        'status', s.status,
        'due_date', s.due_date,
        'owner', s.owner,
        'completed_date', s.completed_date,
        'status_set', s.status_set,
        'due_date_set', s.due_date_set,
        'owner_set', s.owner_set,
        'completed_date_set', s.completed_date_set,
        'version', s.version,
        'updated_at', s.updated_at,
        'updated_by_name', coalesce(nullif(p.display_name, ''), 'Member')
      ) order by s.workstream_id, s.stage_id)
      from public.stage_updates s
      left join public.profiles p on p.user_id = s.updated_by
      where s.event_id = p_event_id
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

-- This is the only anonymous collaboration-data entry point. Direct business
-- table reads, member data, private Storage, and editing RPCs remain protected.
revoke all on function public.get_public_dashboard_updates(text) from public, anon, authenticated;
grant execute on function public.get_public_dashboard_updates(text) to anon, authenticated;

-- Keep direct tables private to their existing RLS policies. The public RPC
-- deliberately returns neither email, UUID, event membership nor object paths.
revoke all on public.dashboard_events, public.profiles, public.event_members, public.workstream_updates, public.stage_updates, public.change_history, public.document_files from anon;

-- Editing remains limited to approved members or approved Admins through the
-- existing auth.uid()-checked RPCs. Make the restriction explicit here too.
revoke execute on function public.update_workstream_overlay(text,text,bigint,text,date,text,boolean,boolean,boolean) from public, anon;
revoke execute on function public.update_stage_overlay(text,text,text,bigint,text,date,text,boolean,boolean,boolean) from public, anon;
revoke execute on function public.get_document_file(text,text) from public, anon;

commit;
