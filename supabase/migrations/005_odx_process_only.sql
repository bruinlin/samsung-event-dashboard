-- V1.8.0 Process-Only baseline rows for ODX 2026.
-- This migration inserts only previously unregistered workstreams and stages.
-- Existing collaboration overlays, versions, updater records and set flags are untouched.

begin;

insert into public.workstream_updates (
  event_id, workstream_id, baseline_status, baseline_progress, baseline_due_date, baseline_owner
) values
  ('ODX_2026', 'ODX26-WS-10', 'Planning', 0, '2026-08-06'::date, 'TBD'),
  ('ODX_2026', 'ODX26-WS-11', 'Planning', 0, '2026-08-14'::date, 'TBD'),
  ('ODX_2026', 'ODX26-WS-12', 'Planning', 0, '2026-08-25'::date, 'TBD'),
  ('ODX_2026', 'ODX26-WS-13', 'Planning', 0, '2026-09-03'::date, 'TBD')
on conflict (event_id, workstream_id) do nothing;

insert into public.stage_updates (
  event_id, workstream_id, stage_id, baseline_status, baseline_due_date, baseline_owner, baseline_completed_date
) values
  ('ODX_2026', 'ODX26-WS-13', 'report-draft', 'Planning', '2026-08-31'::date, 'TBD', null::date),
  ('ODX_2026', 'ODX26-WS-13', 'final-report', 'Planning', '2026-09-03'::date, 'TBD', null::date)
on conflict (event_id, workstream_id, stage_id) do nothing;

commit;
