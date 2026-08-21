-- Register the two newly modelled Social Communication stages without changing
-- any existing collaboration overlay, status, DDL, owner or audit history.

begin;

insert into public.stage_updates (
  event_id, workstream_id, stage_id, baseline_status, baseline_due_date, baseline_owner, baseline_completed_date
) values
  ('ODX_2026', 'ODX26-WS-07', 'draft', 'Planning', null::date, 'Seloma', null::date),
  ('ODX_2026', 'ODX26-WS-07', 'publish', 'Planning', null::date, 'Seloma', null::date)
on conflict (event_id, workstream_id, stage_id) do nothing;

commit;
