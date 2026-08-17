create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null default 'Gabi',
  title text not null default 'Future Vice President / COO',
  email text not null,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.operator_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  reduced_motion boolean not null default false,
  compact_mode boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.training_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  state_version integer not null default 2 check (state_version > 0),
  current_campaign_id text not null,
  active_level_id text not null,
  last_view text not null check (last_view in (
    'command', 'campaign', 'field-ops', 'network', 'labs', 'journal',
    'ventures', 'settings'
  )),
  revision bigint not null default 0 check (revision >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id text not null,
  max_step smallint not null default 0 check (max_step between 0 and 7),
  quiz_score smallint check (quiz_score between 0 and 100),
  practice_draft text not null default '',
  project_draft text not null default '',
  boss_answer_id text,
  boss_score smallint check (boss_score between 0 and 100),
  reflection text not null default '',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, level_id)
);

create table public.knowledge_check_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id text not null,
  question_id text not null,
  answer_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, level_id, question_id)
);

create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create table public.field_missions (
  id text primary key check (length(id) > 0),
  user_id uuid not null references auth.users(id) on delete cascade,
  template text not null,
  mission_date date,
  person text not null default '',
  place text not null default '',
  happened text not null default '',
  learned text not null default '',
  uncomfortable text not null default '',
  went_well text not null default '',
  change_next_time text not null default '',
  follow_up text not null default '',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.relationships (
  id text primary key check (length(id) > 0),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  company text not null default '',
  role text not null default '',
  category text not null default '',
  how_we_met text not null default '',
  cares_about text not null default '',
  last_contact date,
  next_contact date,
  notes text not null default '',
  strength smallint not null default 1 check (strength between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customer_experience_reviews (
  id text primary key check (length(id) > 0),
  user_id uuid not null references auth.users(id) on delete cascade,
  business text not null,
  visit_date date,
  greeting smallint not null check (greeting between 1 and 5),
  speed smallint not null check (speed between 1 and 5),
  cleanliness smallint not null check (cleanliness between 1 and 5),
  communication smallint not null check (communication between 1 and 5),
  problem_resolution smallint not null check (problem_resolution between 1 and 5),
  ease smallint not null check (ease between 1 and 5),
  value smallint not null check (value between 1 and 5),
  consistency smallint not null check (consistency between 1 and 5),
  personalization smallint not null check (personalization between 1 and 5),
  likelihood_to_return smallint not null check (likelihood_to_return between 1 and 5),
  recommendation text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.operations_processes (
  id text primary key check (length(id) > 0),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  input text not null default '',
  steps text[] not null default '{}',
  output text not null default '',
  bottleneck text not null default '',
  delay text not null default '',
  waste text not null default '',
  risk text not null default '',
  customer_impact text not null default '',
  owner text not null default '',
  improvement text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.people_lab_sessions (
  id text primary key check (length(id) > 0),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null,
  choice_id text not null,
  score smallint check (score between 0 and 100),
  reflection text not null default '',
  completed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, scenario_id)
);

create table public.journal_entries (
  id text primary key check (length(id) > 0),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_of date,
  responses jsonb not null default '{}'::jsonb check (jsonb_typeof(responses) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.locations (
  id text primary key check (length(id) > 0),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  contact text not null default '',
  employees_or_traffic text not null default '',
  current_vending text not null default '',
  problems text not null default '',
  commission text not null default '',
  follow_up text not null default '',
  notes text not null default '',
  stage text not null check (stage in (
    'Identified', 'Contacted', 'Conversation', 'Interested', 'Meeting',
    'Proposal', 'Negotiation', 'Approved', 'Installed', 'Active'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.founders_assessments (
  id text primary key check (length(id) > 0),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  financial_attractiveness smallint not null check (financial_attractiveness between 1 and 10),
  operational_attractiveness smallint not null check (operational_attractiveness between 1 and 10),
  people_risk text not null default '',
  customer_risk text not null default '',
  management_risk text not null default '',
  recommendation text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sync_operations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null,
  resulting_revision bigint not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, request_id)
);

create index lesson_progress_user_updated_idx on public.lesson_progress (user_id, updated_at desc);
create index knowledge_answers_user_level_idx on public.knowledge_check_answers (user_id, level_id);
create index achievements_user_unlocked_idx on public.user_achievements (user_id, unlocked_at desc);
create index field_missions_user_date_idx on public.field_missions (user_id, mission_date desc);
create index relationships_user_next_contact_idx on public.relationships (user_id, next_contact);
create index cx_reviews_user_visit_idx on public.customer_experience_reviews (user_id, visit_date desc);
create index operations_processes_user_updated_idx on public.operations_processes (user_id, updated_at desc);
create index people_lab_user_updated_idx on public.people_lab_sessions (user_id, updated_at desc);
create index journal_entries_user_week_idx on public.journal_entries (user_id, week_of desc);
create index locations_user_stage_idx on public.locations (user_id, stage, updated_at desc);
create index founders_assessments_user_updated_idx on public.founders_assessments (user_id, updated_at desc);
create index sync_operations_user_created_idx on public.sync_operations (user_id, created_at desc);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'operator_preferences', 'training_progress',
    'lesson_progress', 'knowledge_check_answers', 'user_achievements',
    'field_missions', 'relationships', 'customer_experience_reviews',
    'operations_processes', 'people_lab_sessions', 'journal_entries',
    'locations', 'founders_assessments', 'sync_operations'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'create policy %I on public.%I for select to authenticated using ((select auth.uid()) = user_id)',
      table_name || '_select_own', table_name
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)',
      table_name || '_insert_own', table_name
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',
      table_name || '_update_own', table_name
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using ((select auth.uid()) = user_id)',
      table_name || '_delete_own', table_name
    );
  end loop;
end;
$$;

create or replace function public.handle_new_operator_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), 'Gabi'),
    coalesce(new.email, '')
  )
  on conflict (user_id) do update
  set email = excluded.email,
      updated_at = now();

  insert into public.operator_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_operator_user();

create or replace function public.load_operator_state()
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_training public.training_progress%rowtype;
  v_profile public.profiles%rowtype;
  v_preferences public.operator_preferences%rowtype;
  v_state jsonb;
begin
  if v_user is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select * into v_training
  from public.training_progress
  where user_id = v_user;

  if not found then
    return jsonb_build_object('exists', false, 'revision', 0, 'state', null);
  end if;

  select * into v_profile from public.profiles where user_id = v_user;
  select * into v_preferences from public.operator_preferences where user_id = v_user;

  update public.profiles
  set last_login_at = now(),
      email = coalesce(auth.jwt() ->> 'email', email),
      updated_at = now()
  where user_id = v_user;

  v_state := jsonb_build_object(
    'version', v_training.state_version,
    'profile', jsonb_build_object(
      'name', coalesce(v_profile.display_name, 'Gabi'),
      'title', coalesce(v_profile.title, 'Future Vice President / COO')
    ),
    'currentCampaignId', v_training.current_campaign_id,
    'lastView', v_training.last_view,
    'activeLevelId', v_training.active_level_id,
    'levelProgress', coalesce((
      select jsonb_object_agg(
        lp.level_id,
        jsonb_build_object(
          'maxStep', lp.max_step,
          'quizAnswers', coalesce((
            select jsonb_object_agg(k.question_id, k.answer_id)
            from public.knowledge_check_answers k
            where k.user_id = v_user and k.level_id = lp.level_id
          ), '{}'::jsonb),
          'quizScore', lp.quiz_score,
          'practiceDraft', lp.practice_draft,
          'projectDraft', lp.project_draft,
          'bossAnswerId', lp.boss_answer_id,
          'bossScore', lp.boss_score,
          'reflection', lp.reflection,
          'completedAt', lp.completed_at,
          'updatedAt', lp.updated_at
        )
      )
      from public.lesson_progress lp
      where lp.user_id = v_user
    ), '{}'::jsonb),
    'fieldMissions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'template', f.template, 'date', coalesce(f.mission_date::text, ''),
        'person', f.person, 'place', f.place, 'happened', f.happened,
        'learned', f.learned, 'uncomfortable', f.uncomfortable,
        'wentWell', f.went_well, 'changeNextTime', f.change_next_time,
        'followUp', f.follow_up, 'createdAt', f.created_at, 'updatedAt', f.updated_at
      ) order by f.created_at desc)
      from public.field_missions f where f.user_id = v_user
    ), '[]'::jsonb),
    'relationships', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'name', r.name, 'company', r.company, 'role', r.role,
        'category', r.category, 'howWeMet', r.how_we_met, 'caresAbout', r.cares_about,
        'lastContact', coalesce(r.last_contact::text, ''),
        'nextContact', coalesce(r.next_contact::text, ''), 'notes', r.notes,
        'strength', r.strength, 'createdAt', r.created_at, 'updatedAt', r.updated_at
      ) order by r.created_at desc)
      from public.relationships r where r.user_id = v_user
    ), '[]'::jsonb),
    'customerAudits', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'business', c.business, 'visitDate', coalesce(c.visit_date::text, ''),
        'scores', jsonb_build_object(
          'greeting', c.greeting, 'speed', c.speed, 'cleanliness', c.cleanliness,
          'communication', c.communication, 'problemResolution', c.problem_resolution,
          'ease', c.ease, 'value', c.value, 'consistency', c.consistency,
          'personalization', c.personalization, 'likelihoodToReturn', c.likelihood_to_return
        ),
        'skadraDifference', c.recommendation,
        'createdAt', c.created_at, 'updatedAt', c.updated_at
      ) order by c.created_at desc)
      from public.customer_experience_reviews c where c.user_id = v_user
    ), '[]'::jsonb),
    'processMaps', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'name', o.name, 'input', o.input, 'steps', to_jsonb(o.steps),
        'output', o.output, 'bottleneck', o.bottleneck, 'delay', o.delay,
        'waste', o.waste, 'risk', o.risk, 'customerImpact', o.customer_impact,
        'owner', o.owner, 'improvement', o.improvement,
        'createdAt', o.created_at, 'updatedAt', o.updated_at
      ) order by o.created_at desc)
      from public.operations_processes o where o.user_id = v_user
    ), '[]'::jsonb),
    'journalEntries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', j.id, 'weekOf', coalesce(j.week_of::text, ''), 'responses', j.responses,
        'createdAt', j.created_at, 'updatedAt', j.updated_at
      ) order by j.created_at desc)
      from public.journal_entries j where j.user_id = v_user
    ), '[]'::jsonb),
    'locations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'company', l.company, 'contact', l.contact,
        'employeesOrTraffic', l.employees_or_traffic, 'currentVending', l.current_vending,
        'problems', l.problems, 'commission', l.commission, 'followUp', l.follow_up,
        'notes', l.notes, 'stage', l.stage,
        'createdAt', l.created_at, 'updatedAt', l.updated_at
      ) order by l.created_at desc)
      from public.locations l where l.user_id = v_user
    ), '[]'::jsonb),
    'sharedVentures', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'name', a.name,
        'financialAttractiveness', a.financial_attractiveness,
        'operationalAttractiveness', a.operational_attractiveness,
        'peopleRisk', a.people_risk, 'customerRisk', a.customer_risk,
        'managementRisk', a.management_risk, 'integrationNote', a.recommendation,
        'createdAt', a.created_at, 'updatedAt', a.updated_at
      ) order by a.created_at desc)
      from public.founders_assessments a where a.user_id = v_user
    ), '[]'::jsonb),
    'peopleLabSessions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'scenarioId', p.scenario_id, 'choiceId', p.choice_id,
        'score', p.score, 'reflection', p.reflection, 'completedAt', p.completed_at,
        'createdAt', p.created_at, 'updatedAt', p.updated_at
      ) order by p.created_at desc)
      from public.people_lab_sessions p where p.user_id = v_user
    ), '[]'::jsonb),
    'achievementUnlocks', coalesce((
      select jsonb_object_agg(a.achievement_id, a.unlocked_at)
      from public.user_achievements a where a.user_id = v_user
    ), '{}'::jsonb),
    'preferences', jsonb_build_object(
      'reducedMotion', coalesce(v_preferences.reduced_motion, false),
      'compactMode', coalesce(v_preferences.compact_mode, false)
    ),
    'createdAt', v_training.created_at,
    'updatedAt', v_training.updated_at
  );

  return jsonb_build_object(
    'exists', true,
    'revision', v_training.revision,
    'updatedAt', v_training.updated_at,
    'state', v_state
  );
end;
$$;

create or replace function public.save_operator_state(
  p_state jsonb,
  p_expected_revision bigint,
  p_request_id uuid
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_revision bigint;
  v_result jsonb;
  v_item jsonb;
  v_level record;
  v_answer record;
  v_updated_at timestamptz := coalesce(nullif(p_state ->> 'updatedAt', '')::timestamptz, now());
begin
  if v_user is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if jsonb_typeof(p_state) <> 'object' then
    raise exception 'invalid_operator_state' using errcode = '22023';
  end if;

  select result into v_result
  from public.sync_operations
  where user_id = v_user and request_id = p_request_id;

  if found then
    return v_result;
  end if;

  select revision into v_revision
  from public.training_progress
  where user_id = v_user
  for update;
  v_revision := coalesce(v_revision, 0);

  if v_revision <> p_expected_revision then
    raise exception 'operator_state_conflict: expected %, found %', p_expected_revision, v_revision
      using errcode = '40001';
  end if;

  insert into public.profiles (user_id, display_name, title, email, updated_at)
  values (
    v_user,
    coalesce(nullif(p_state #>> '{profile,name}', ''), 'Gabi'),
    coalesce(nullif(p_state #>> '{profile,title}', ''), 'Future Vice President / COO'),
    coalesce(auth.jwt() ->> 'email', ''),
    now()
  )
  on conflict (user_id) do update
  set display_name = excluded.display_name,
      title = excluded.title,
      email = excluded.email,
      updated_at = now();

  insert into public.operator_preferences (
    user_id, reduced_motion, compact_mode, updated_at
  ) values (
    v_user,
    coalesce((p_state #>> '{preferences,reducedMotion}')::boolean, false),
    coalesce((p_state #>> '{preferences,compactMode}')::boolean, false),
    v_updated_at
  )
  on conflict (user_id) do update
  set reduced_motion = excluded.reduced_motion,
      compact_mode = excluded.compact_mode,
      updated_at = excluded.updated_at;

  insert into public.training_progress (
    user_id, state_version, current_campaign_id, active_level_id, last_view,
    revision, created_at, updated_at
  ) values (
    v_user,
    coalesce((p_state ->> 'version')::integer, 2),
    coalesce(nullif(p_state ->> 'currentCampaignId', ''), 'year-one-core-operator'),
    coalesce(nullif(p_state ->> 'activeLevelId', ''), 'follow-the-money'),
    coalesce(nullif(p_state ->> 'lastView', ''), 'command'),
    v_revision + 1,
    coalesce(nullif(p_state ->> 'createdAt', '')::timestamptz, v_updated_at),
    v_updated_at
  )
  on conflict (user_id) do update
  set state_version = excluded.state_version,
      current_campaign_id = excluded.current_campaign_id,
      active_level_id = excluded.active_level_id,
      last_view = excluded.last_view,
      revision = excluded.revision,
      updated_at = excluded.updated_at;

  delete from public.knowledge_check_answers where user_id = v_user;

  for v_level in
    select key as level_id, value as progress
    from jsonb_each(coalesce(p_state -> 'levelProgress', '{}'::jsonb))
  loop
    insert into public.lesson_progress (
      user_id, level_id, max_step, quiz_score, practice_draft, project_draft,
      boss_answer_id, boss_score, reflection, completed_at, created_at, updated_at
    ) values (
      v_user, v_level.level_id,
      coalesce((v_level.progress ->> 'maxStep')::smallint, 0),
      nullif(v_level.progress ->> 'quizScore', '')::smallint,
      coalesce(v_level.progress ->> 'practiceDraft', ''),
      coalesce(v_level.progress ->> 'projectDraft', ''),
      nullif(v_level.progress ->> 'bossAnswerId', ''),
      nullif(v_level.progress ->> 'bossScore', '')::smallint,
      coalesce(v_level.progress ->> 'reflection', ''),
      nullif(v_level.progress ->> 'completedAt', '')::timestamptz,
      coalesce(nullif(v_level.progress ->> 'updatedAt', '')::timestamptz, v_updated_at),
      coalesce(nullif(v_level.progress ->> 'updatedAt', '')::timestamptz, v_updated_at)
    )
    on conflict (user_id, level_id) do update
    set max_step = excluded.max_step,
        quiz_score = excluded.quiz_score,
        practice_draft = excluded.practice_draft,
        project_draft = excluded.project_draft,
        boss_answer_id = excluded.boss_answer_id,
        boss_score = excluded.boss_score,
        reflection = excluded.reflection,
        completed_at = excluded.completed_at,
        updated_at = excluded.updated_at;

    for v_answer in
      select key as question_id, value #>> '{}' as answer_id
      from jsonb_each(coalesce(v_level.progress -> 'quizAnswers', '{}'::jsonb))
    loop
      insert into public.knowledge_check_answers (
        user_id, level_id, question_id, answer_id, created_at, updated_at
      ) values (
        v_user, v_level.level_id, v_answer.question_id, v_answer.answer_id,
        v_updated_at, v_updated_at
      );
    end loop;
  end loop;

  delete from public.lesson_progress lp
  where lp.user_id = v_user
    and not (coalesce(p_state -> 'levelProgress', '{}'::jsonb) ? lp.level_id);

  for v_answer in
    select key as achievement_id, value #>> '{}' as unlocked_at
    from jsonb_each(coalesce(p_state -> 'achievementUnlocks', '{}'::jsonb))
  loop
    insert into public.user_achievements (
      user_id, achievement_id, unlocked_at, created_at, updated_at
    ) values (
      v_user, v_answer.achievement_id, v_answer.unlocked_at::timestamptz,
      v_answer.unlocked_at::timestamptz, v_answer.unlocked_at::timestamptz
    )
    on conflict (user_id, achievement_id) do update
    set unlocked_at = least(public.user_achievements.unlocked_at, excluded.unlocked_at),
        updated_at = least(public.user_achievements.updated_at, excluded.updated_at);
  end loop;

  for v_item in select value from jsonb_array_elements(coalesce(p_state -> 'fieldMissions', '[]'::jsonb))
  loop
    insert into public.field_missions values (
      v_item ->> 'id', v_user, coalesce(v_item ->> 'template', ''),
      nullif(v_item ->> 'date', '')::date, coalesce(v_item ->> 'person', ''),
      coalesce(v_item ->> 'place', ''), coalesce(v_item ->> 'happened', ''),
      coalesce(v_item ->> 'learned', ''), coalesce(v_item ->> 'uncomfortable', ''),
      coalesce(v_item ->> 'wentWell', ''), coalesce(v_item ->> 'changeNextTime', ''),
      coalesce(v_item ->> 'followUp', ''),
      coalesce(nullif(v_item ->> 'createdAt', '')::timestamptz, v_updated_at),
      coalesce(nullif(v_item ->> 'createdAt', '')::timestamptz, v_updated_at),
      coalesce(nullif(v_item ->> 'updatedAt', '')::timestamptz, v_updated_at)
    ) on conflict (id) do update set
      template = excluded.template, mission_date = excluded.mission_date,
      person = excluded.person, place = excluded.place, happened = excluded.happened,
      learned = excluded.learned, uncomfortable = excluded.uncomfortable,
      went_well = excluded.went_well, change_next_time = excluded.change_next_time,
      follow_up = excluded.follow_up, completed_at = excluded.completed_at,
      updated_at = excluded.updated_at
    where public.field_missions.user_id = v_user;
  end loop;
  delete from public.field_missions t where t.user_id = v_user and not exists (
    select 1 from jsonb_array_elements(coalesce(p_state -> 'fieldMissions', '[]'::jsonb)) j where j ->> 'id' = t.id
  );

  for v_item in select value from jsonb_array_elements(coalesce(p_state -> 'relationships', '[]'::jsonb))
  loop
    insert into public.relationships values (
      v_item ->> 'id', v_user, coalesce(v_item ->> 'name', ''),
      coalesce(v_item ->> 'company', ''), coalesce(v_item ->> 'role', ''),
      coalesce(v_item ->> 'category', ''), coalesce(v_item ->> 'howWeMet', ''),
      coalesce(v_item ->> 'caresAbout', ''), nullif(v_item ->> 'lastContact', '')::date,
      nullif(v_item ->> 'nextContact', '')::date, coalesce(v_item ->> 'notes', ''),
      coalesce((v_item ->> 'strength')::smallint, 1),
      coalesce(nullif(v_item ->> 'createdAt', '')::timestamptz, v_updated_at),
      coalesce(nullif(v_item ->> 'updatedAt', '')::timestamptz, v_updated_at)
    ) on conflict (id) do update set
      name = excluded.name, company = excluded.company, role = excluded.role,
      category = excluded.category, how_we_met = excluded.how_we_met,
      cares_about = excluded.cares_about, last_contact = excluded.last_contact,
      next_contact = excluded.next_contact, notes = excluded.notes,
      strength = excluded.strength, updated_at = excluded.updated_at
    where public.relationships.user_id = v_user;
  end loop;
  delete from public.relationships t where t.user_id = v_user and not exists (
    select 1 from jsonb_array_elements(coalesce(p_state -> 'relationships', '[]'::jsonb)) j where j ->> 'id' = t.id
  );

  for v_item in select value from jsonb_array_elements(coalesce(p_state -> 'customerAudits', '[]'::jsonb))
  loop
    insert into public.customer_experience_reviews values (
      v_item ->> 'id', v_user, coalesce(v_item ->> 'business', ''),
      nullif(v_item ->> 'visitDate', '')::date,
      coalesce((v_item #>> '{scores,greeting}')::smallint, 3),
      coalesce((v_item #>> '{scores,speed}')::smallint, 3),
      coalesce((v_item #>> '{scores,cleanliness}')::smallint, 3),
      coalesce((v_item #>> '{scores,communication}')::smallint, 3),
      coalesce((v_item #>> '{scores,problemResolution}')::smallint, 3),
      coalesce((v_item #>> '{scores,ease}')::smallint, 3),
      coalesce((v_item #>> '{scores,value}')::smallint, 3),
      coalesce((v_item #>> '{scores,consistency}')::smallint, 3),
      coalesce((v_item #>> '{scores,personalization}')::smallint, 3),
      coalesce((v_item #>> '{scores,likelihoodToReturn}')::smallint, 3),
      coalesce(v_item ->> 'skadraDifference', ''),
      coalesce(nullif(v_item ->> 'createdAt', '')::timestamptz, v_updated_at),
      coalesce(nullif(v_item ->> 'updatedAt', '')::timestamptz, v_updated_at)
    ) on conflict (id) do update set
      business = excluded.business, visit_date = excluded.visit_date,
      greeting = excluded.greeting, speed = excluded.speed,
      cleanliness = excluded.cleanliness, communication = excluded.communication,
      problem_resolution = excluded.problem_resolution, ease = excluded.ease,
      value = excluded.value, consistency = excluded.consistency,
      personalization = excluded.personalization,
      likelihood_to_return = excluded.likelihood_to_return,
      recommendation = excluded.recommendation, updated_at = excluded.updated_at
    where public.customer_experience_reviews.user_id = v_user;
  end loop;
  delete from public.customer_experience_reviews t where t.user_id = v_user and not exists (
    select 1 from jsonb_array_elements(coalesce(p_state -> 'customerAudits', '[]'::jsonb)) j where j ->> 'id' = t.id
  );

  for v_item in select value from jsonb_array_elements(coalesce(p_state -> 'processMaps', '[]'::jsonb))
  loop
    insert into public.operations_processes values (
      v_item ->> 'id', v_user, coalesce(v_item ->> 'name', ''),
      coalesce(v_item ->> 'input', ''),
      array(select jsonb_array_elements_text(coalesce(v_item -> 'steps', '[]'::jsonb))),
      coalesce(v_item ->> 'output', ''), coalesce(v_item ->> 'bottleneck', ''),
      coalesce(v_item ->> 'delay', ''), coalesce(v_item ->> 'waste', ''),
      coalesce(v_item ->> 'risk', ''), coalesce(v_item ->> 'customerImpact', ''),
      coalesce(v_item ->> 'owner', ''), coalesce(v_item ->> 'improvement', ''),
      coalesce(nullif(v_item ->> 'createdAt', '')::timestamptz, v_updated_at),
      coalesce(nullif(v_item ->> 'updatedAt', '')::timestamptz, v_updated_at)
    ) on conflict (id) do update set
      name = excluded.name, input = excluded.input, steps = excluded.steps,
      output = excluded.output, bottleneck = excluded.bottleneck, delay = excluded.delay,
      waste = excluded.waste, risk = excluded.risk,
      customer_impact = excluded.customer_impact, owner = excluded.owner,
      improvement = excluded.improvement, updated_at = excluded.updated_at
    where public.operations_processes.user_id = v_user;
  end loop;
  delete from public.operations_processes t where t.user_id = v_user and not exists (
    select 1 from jsonb_array_elements(coalesce(p_state -> 'processMaps', '[]'::jsonb)) j where j ->> 'id' = t.id
  );

  for v_item in select value from jsonb_array_elements(coalesce(p_state -> 'peopleLabSessions', '[]'::jsonb))
  loop
    insert into public.people_lab_sessions values (
      v_item ->> 'id', v_user, coalesce(v_item ->> 'scenarioId', ''),
      coalesce(v_item ->> 'choiceId', ''), nullif(v_item ->> 'score', '')::smallint,
      coalesce(v_item ->> 'reflection', ''),
      coalesce(nullif(v_item ->> 'completedAt', '')::timestamptz, v_updated_at),
      coalesce(nullif(v_item ->> 'createdAt', '')::timestamptz, v_updated_at),
      coalesce(nullif(v_item ->> 'updatedAt', '')::timestamptz, v_updated_at)
    ) on conflict (id) do update set
      scenario_id = excluded.scenario_id, choice_id = excluded.choice_id,
      score = excluded.score, reflection = excluded.reflection,
      completed_at = excluded.completed_at, updated_at = excluded.updated_at
    where public.people_lab_sessions.user_id = v_user;
  end loop;
  delete from public.people_lab_sessions t where t.user_id = v_user and not exists (
    select 1 from jsonb_array_elements(coalesce(p_state -> 'peopleLabSessions', '[]'::jsonb)) j where j ->> 'id' = t.id
  );

  for v_item in select value from jsonb_array_elements(coalesce(p_state -> 'journalEntries', '[]'::jsonb))
  loop
    insert into public.journal_entries values (
      v_item ->> 'id', v_user, nullif(v_item ->> 'weekOf', '')::date,
      coalesce(v_item -> 'responses', '{}'::jsonb),
      coalesce(nullif(v_item ->> 'createdAt', '')::timestamptz, v_updated_at),
      coalesce(nullif(v_item ->> 'updatedAt', '')::timestamptz, v_updated_at)
    ) on conflict (id) do update set
      week_of = excluded.week_of, responses = excluded.responses,
      updated_at = excluded.updated_at
    where public.journal_entries.user_id = v_user;
  end loop;
  delete from public.journal_entries t where t.user_id = v_user and not exists (
    select 1 from jsonb_array_elements(coalesce(p_state -> 'journalEntries', '[]'::jsonb)) j where j ->> 'id' = t.id
  );

  for v_item in select value from jsonb_array_elements(coalesce(p_state -> 'locations', '[]'::jsonb))
  loop
    insert into public.locations values (
      v_item ->> 'id', v_user, coalesce(v_item ->> 'company', ''),
      coalesce(v_item ->> 'contact', ''), coalesce(v_item ->> 'employeesOrTraffic', ''),
      coalesce(v_item ->> 'currentVending', ''), coalesce(v_item ->> 'problems', ''),
      coalesce(v_item ->> 'commission', ''), coalesce(v_item ->> 'followUp', ''),
      coalesce(v_item ->> 'notes', ''), coalesce(v_item ->> 'stage', 'Identified'),
      coalesce(nullif(v_item ->> 'createdAt', '')::timestamptz, v_updated_at),
      coalesce(nullif(v_item ->> 'updatedAt', '')::timestamptz, v_updated_at)
    ) on conflict (id) do update set
      company = excluded.company, contact = excluded.contact,
      employees_or_traffic = excluded.employees_or_traffic,
      current_vending = excluded.current_vending, problems = excluded.problems,
      commission = excluded.commission, follow_up = excluded.follow_up,
      notes = excluded.notes, stage = excluded.stage, updated_at = excluded.updated_at
    where public.locations.user_id = v_user;
  end loop;
  delete from public.locations t where t.user_id = v_user and not exists (
    select 1 from jsonb_array_elements(coalesce(p_state -> 'locations', '[]'::jsonb)) j where j ->> 'id' = t.id
  );

  for v_item in select value from jsonb_array_elements(coalesce(p_state -> 'sharedVentures', '[]'::jsonb))
  loop
    insert into public.founders_assessments values (
      v_item ->> 'id', v_user, coalesce(v_item ->> 'name', ''),
      coalesce((v_item ->> 'financialAttractiveness')::smallint, 1),
      coalesce((v_item ->> 'operationalAttractiveness')::smallint, 1),
      coalesce(v_item ->> 'peopleRisk', ''), coalesce(v_item ->> 'customerRisk', ''),
      coalesce(v_item ->> 'managementRisk', ''), coalesce(v_item ->> 'integrationNote', ''),
      coalesce(nullif(v_item ->> 'createdAt', '')::timestamptz, v_updated_at),
      coalesce(nullif(v_item ->> 'updatedAt', '')::timestamptz, v_updated_at)
    ) on conflict (id) do update set
      name = excluded.name,
      financial_attractiveness = excluded.financial_attractiveness,
      operational_attractiveness = excluded.operational_attractiveness,
      people_risk = excluded.people_risk, customer_risk = excluded.customer_risk,
      management_risk = excluded.management_risk,
      recommendation = excluded.recommendation, updated_at = excluded.updated_at
    where public.founders_assessments.user_id = v_user;
  end loop;
  delete from public.founders_assessments t where t.user_id = v_user and not exists (
    select 1 from jsonb_array_elements(coalesce(p_state -> 'sharedVentures', '[]'::jsonb)) j where j ->> 'id' = t.id
  );

  v_result := jsonb_build_object(
    'revision', v_revision + 1,
    'updatedAt', v_updated_at
  );

  insert into public.sync_operations (
    user_id, request_id, resulting_revision, result
  ) values (v_user, p_request_id, v_revision + 1, v_result);

  delete from public.sync_operations
  where user_id = v_user and created_at < now() - interval '90 days';

  return v_result;
end;
$$;

revoke all on all tables in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated;

revoke execute on function public.load_operator_state() from public, anon;
revoke execute on function public.save_operator_state(jsonb, bigint, uuid) from public, anon;
grant execute on function public.load_operator_state() to authenticated;
grant execute on function public.save_operator_state(jsonb, bigint, uuid) to authenticated;
