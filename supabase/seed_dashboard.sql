-- Idempotent baseline seed for OCTS 2026, ODX 2026 and ICCAD 2026.
-- Run after migrations/001_collaboration_v1.sql.
-- Baseline columns mirror static JS data. *_set flags remain false so a blank
-- database overlay never replaces the reviewed static baseline.

begin;

insert into public.dashboard_events (event_id, label) values
  ('OCTS_2026', 'OCTS 2026'),
  ('ODX_2026', 'ODX 2026'),
  ('ICCAD_2026', 'ICCAD 2026')
on conflict (event_id) do update set label = excluded.label;

with seed(event_id, workstream_id, baseline_status, baseline_due_date, baseline_owner) as (values
  ('OCTS_2026','OCTS26-WS-01','Completed','2026-07-09'::date,'Bruin'),
  ('OCTS_2026','OCTS26-WS-02','Completed',null::date,'Bruin & Leo'),
  ('OCTS_2026','OCTS26-WS-03','Completed','2026-07-09'::date,'Bruin & Leo'),
  ('OCTS_2026','OCTS26-WS-04','Completed','2026-07-09'::date,'Bruin & Leo'),
  ('OCTS_2026','OCTS26-WS-05','Completed',null::date,'媛媛 & Dennis'),
  ('OCTS_2026','OCTS26-WS-06','Completed',null::date,'媛媛 & Dennis'),
  ('OCTS_2026','OCTS26-WS-07','Completed','2026-07-08'::date,'媛媛 & Dennis'),
  ('OCTS_2026','OCTS26-WS-08','Completed','2026-07-09'::date,'Bruin'),
  ('OCTS_2026','OCTS26-WS-09','Completed','2026-07-09'::date,'Bruin & Leo'),
  ('OCTS_2026','OCTS26-WS-10','Completed','2026-07-09'::date,'Bruin'),
  ('OCTS_2026','OCTS26-WS-11','Completed','2026-07-10'::date,'Seloma'),
  ('OCTS_2026','OCTS26-WS-12','Completed',null::date,'Christy'),
  ('OCTS_2026','OCTS26-WS-13','Completed',null::date,'媛媛 & Dennis'),
  ('OCTS_2026','OCTS26-WS-14','Completed','2026-07-09'::date,'媛媛 & Dennis'),
  ('OCTS_2026','OCTS26-WS-15','Completed',null::date,'Iris & Christy'),
  ('ODX_2026','ODX26-WS-01','In Progress','2026-08-10'::date,'Bruin'),
  ('ODX_2026','ODX26-WS-02','Completed','2026-07-22'::date,'Bruin & Leo'),
  ('ODX_2026','ODX26-WS-03','Planning','2026-08-26'::date,'Bruin & Leo'),
  ('ODX_2026','ODX26-WS-04','In Progress','2026-08-10'::date,'媛媛 & Dennis'),
  ('ODX_2026','ODX26-WS-05','In Progress','2026-09-20'::date,'媛媛 & Dennis'),
  ('ODX_2026','ODX26-WS-06','In Progress','2026-08-14'::date,'媛媛 & Dennis'),
  ('ODX_2026','ODX26-WS-07','Planning',null::date,'Seloma'),
  ('ODX_2026','ODX26-WS-08','Planning','2026-09-02'::date,'Iris & Christy'),
  ('ODX_2026','ODX26-WS-09','Planning',null::date,'Bruin'),
  ('ODX_2026','ODX26-WS-10','Planning','2026-08-06'::date,'TBD'),
  ('ODX_2026','ODX26-WS-11','Planning','2026-08-14'::date,'TBD'),
  ('ODX_2026','ODX26-WS-12','Planning','2026-08-25'::date,'TBD'),
  ('ODX_2026','ODX26-WS-13','Planning','2026-09-03'::date,'TBD'),
  ('ICCAD_2026','ICCAD26-WS-01','Planning',null::date,'TBD'),
  ('ICCAD_2026','ICCAD26-WS-02',null,null::date,'TBD'),
  ('ICCAD_2026','ICCAD26-WS-03','Planning',null::date,'TBD'),
  ('ICCAD_2026','ICCAD26-WS-04',null,null::date,'TBD'),
  ('ICCAD_2026','ICCAD26-WS-05','Planning',null::date,'TBD'),
  ('ICCAD_2026','ICCAD26-WS-06','In Progress',null::date,'TBD'),
  ('ICCAD_2026','ICCAD26-WS-07','Planning',null::date,'TBD'),
  ('ICCAD_2026','ICCAD26-WS-08','Planning',null::date,'TBD'),
  ('ICCAD_2026','ICCAD26-WS-09','Planning',null::date,'TBD'),
  ('ICCAD_2026','ICCAD26-WS-10',null,null::date,'TBD'),
  ('ICCAD_2026','ICCAD26-WS-11','Planning',null::date,'TBD'),
  ('ICCAD_2026','ICCAD26-WS-12',null,null::date,'TBD')
)
insert into public.workstream_updates (
  event_id, workstream_id, baseline_status, baseline_due_date, baseline_owner
)
select * from seed
on conflict (event_id, workstream_id) do update set
  baseline_status = excluded.baseline_status,
  baseline_due_date = excluded.baseline_due_date,
  baseline_owner = excluded.baseline_owner;

-- Progress remains a Workstream-owned manual value. Keep fresh installations
-- aligned with the reviewed static baseline; later editor updates set progress_set.
with progress_seed(event_id, workstream_id, baseline_progress) as (values
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
  ('ODX_2026','ODX26-WS-10',0), ('ODX_2026','ODX26-WS-11',0),
  ('ODX_2026','ODX26-WS-12',0), ('ODX_2026','ODX26-WS-13',0),
  ('ICCAD_2026','ICCAD26-WS-01',0), ('ICCAD_2026','ICCAD26-WS-02',0),
  ('ICCAD_2026','ICCAD26-WS-03',0), ('ICCAD_2026','ICCAD26-WS-04',0),
  ('ICCAD_2026','ICCAD26-WS-05',0), ('ICCAD_2026','ICCAD26-WS-06',0),
  ('ICCAD_2026','ICCAD26-WS-07',0), ('ICCAD_2026','ICCAD26-WS-08',0),
  ('ICCAD_2026','ICCAD26-WS-09',0), ('ICCAD_2026','ICCAD26-WS-10',0),
  ('ICCAD_2026','ICCAD26-WS-11',0), ('ICCAD_2026','ICCAD26-WS-12',0)
)
update public.workstream_updates w
set baseline_progress = progress_seed.baseline_progress
from progress_seed
where w.event_id = progress_seed.event_id
  and w.workstream_id = progress_seed.workstream_id;

with seed(event_id, workstream_id, stage_id, baseline_status, baseline_due_date, baseline_owner, baseline_completed_date) as (values
  ('OCTS_2026','OCTS26-WS-03','initial-draft','Completed',null::date,'Bruin & Leo',null::date),
  ('OCTS_2026','OCTS26-WS-03','first-washing','Completed',null::date,'Bruin & Leo',null::date),
  ('OCTS_2026','OCTS26-WS-03','internal-review','Completed',null::date,'Bruin & Leo',null::date),
  ('OCTS_2026','OCTS26-WS-03','second-revision','Completed',null::date,'Bruin & Leo',null::date),
  ('OCTS_2026','OCTS26-WS-03','final-approval','Completed',null::date,'Bruin & Leo',null::date),
  ('OCTS_2026','OCTS26-WS-07','brief','Completed',null::date,'媛媛 & Dennis',null::date),
  ('OCTS_2026','OCTS26-WS-07','initial-design','Completed',null::date,'媛媛 & Dennis',null::date),
  ('OCTS_2026','OCTS26-WS-07','review-revision','Completed',null::date,'媛媛 & Dennis',null::date),
  ('OCTS_2026','OCTS26-WS-07','final-artwork','Completed',null::date,'媛媛 & Dennis',null::date),
  ('OCTS_2026','OCTS26-WS-07','onsite-completion','Completed',null::date,'媛媛 & Dennis',null::date),
  ('OCTS_2026','OCTS26-WS-11','draft','Completed',null::date,'Seloma',null::date),
  ('OCTS_2026','OCTS26-WS-11','review','Completed',null::date,'Seloma',null::date),
  ('OCTS_2026','OCTS26-WS-11','published','Completed',null::date,'Seloma',null::date),
  ('OCTS_2026','OCTS26-WS-11','performance-review','Completed',null::date,'Seloma',null::date),
  ('OCTS_2026','OCTS26-WS-12','data-collection','Completed',null::date,'Christy',null::date),
  ('OCTS_2026','OCTS26-WS-12','drafting','Completed',null::date,'Christy',null::date),
  ('OCTS_2026','OCTS26-WS-12','review','Completed',null::date,'Christy',null::date),
  ('OCTS_2026','OCTS26-WS-12','final-report','Completed',null::date,'Christy',null::date),
  ('ODX_2026','ODX26-WS-03','initial-draft','Planning','2026-08-10'::date,'Bruin & Leo',null::date),
  ('ODX_2026','ODX26-WS-03','first-washing','Planning','2026-08-14'::date,'Bruin & Leo',null::date),
  ('ODX_2026','ODX26-WS-03','internal-review','Planning','2026-08-19'::date,'Bruin & Leo',null::date),
  ('ODX_2026','ODX26-WS-03','second-revision','Planning','2026-08-24'::date,'Bruin & Leo',null::date),
  ('ODX_2026','ODX26-WS-03','final-approval','Planning','2026-08-26'::date,'Bruin & Leo',null::date),
  ('ODX_2026','ODX26-WS-07','planning-draft','Planning','2026-08-19'::date,'Seloma',null::date),
  ('ODX_2026','ODX26-WS-13','report-draft','Planning','2026-08-31'::date,'TBD',null::date),
  ('ODX_2026','ODX26-WS-13','final-report','Planning','2026-09-03'::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-02','presenter-confirmation','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-02','topic-confirmation','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-02','initial-draft','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-02','internal-review','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-02','final-approval','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-02','rehearsal','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-04','design-brief','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-04','initial-design','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-04','review-revision','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-04','final-artwork','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-04','onsite-completion','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-10','planning-draft','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-12','data-collection','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-12','report-draft','Planning',null::date,'TBD',null::date),
  ('ICCAD_2026','ICCAD26-WS-12','final-report','Planning',null::date,'TBD',null::date)
)
insert into public.stage_updates (
  event_id, workstream_id, stage_id, baseline_status, baseline_due_date, baseline_owner, baseline_completed_date
)
select * from seed
on conflict (event_id, workstream_id, stage_id) do update set
  baseline_status = excluded.baseline_status,
  baseline_due_date = excluded.baseline_due_date,
  baseline_owner = excluded.baseline_owner,
  baseline_completed_date = excluded.baseline_completed_date;

-- The four object keys below are stable identifiers only. Upload the reviewed
-- PDFs to the private event-files bucket using these exact paths before testing.
insert into public.document_files (event_id, document_id, bucket_id, object_path, file_name) values
  ('OCTS_2026','OCTS-DOC-001','event-files','OCTS_2026/OCTS_2026_Main_Forum_Keynote_CN_Final.pdf','OCTS_2026_Main_Forum_Keynote_CN_Final.pdf'),
  ('OCTS_2026','OCTS-DOC-002','event-files','OCTS_2026/OCTS_2026_Main_Forum_Keynote_EN_Final.pdf','OCTS_2026_Main_Forum_Keynote_EN_Final.pdf'),
  ('OCTS_2026','OCTS-DOC-003','event-files','OCTS_2026/OCTS_2026_Main_Forum_Speech_Script_Final.pdf','OCTS_2026_Main_Forum_Speech_Script_Final.pdf'),
  ('OCTS_2026','OCTS-DOC-004','event-files','OCTS_2026/OCTS_2026_Post_Event_Report_Final.pdf','OCTS_2026_Post_Event_Report_Final.pdf')
on conflict (event_id, document_id) do update set
  bucket_id = excluded.bucket_id,
  object_path = excluded.object_path,
  file_name = excluded.file_name;

commit;
