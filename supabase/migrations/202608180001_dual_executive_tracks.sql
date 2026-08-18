-- G-OPS V2: additive dual-executive role and founder-mission persistence.
-- This migration deliberately preserves every existing table, row, stable level ID,
-- revision, and RLS policy created by 202608170001_operator_mode_cloud.sql.

do $$
begin
  create type public.executive_role as enum ('ceo', 'coo');
exception
  when duplicate_object then null;
end;
$$;

alter table public.profiles
  add column if not exists executive_role public.executive_role,
  add column if not exists role_selected_at timestamptz,
  add column if not exists role_onboarding_completed_at timestamptz;

-- Every account with an existing Operator Mode cloud snapshot predates role
-- selection and therefore belongs to the preserved COO / Vice President track.
update public.profiles p
set executive_role = 'coo',
    role_selected_at = coalesce(p.role_selected_at, p.created_at),
    role_onboarding_completed_at = coalesce(
      p.role_onboarding_completed_at,
      p.updated_at,
      now()
    )
where p.executive_role is null
  and exists (
    select 1
    from public.training_progress t
    where t.user_id = p.user_id
  );

create table public.founder_mission_progress (
  id text primary key check (length(id) > 0),
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id text not null check (length(mission_id) > 0),
  executive_role public.executive_role not null,
  status text not null check (status in (
    'not-started', 'in-progress', 'ready-for-decision', 'complete'
  )),
  analysis text not null default '',
  recommendation text not null default '',
  decision text check (decision in (
    'deploy', 'renegotiate', 'buy', 'pass', 'hold'
  )),
  reflection text not null default '',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, mission_id, executive_role)
);

create index founder_mission_user_updated_idx
  on public.founder_mission_progress (user_id, updated_at desc);

alter table public.founder_mission_progress enable row level security;

create policy founder_mission_progress_select_own
  on public.founder_mission_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy founder_mission_progress_insert_own
  on public.founder_mission_progress
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.profiles p
      where p.user_id = (select auth.uid())
        and p.executive_role = founder_mission_progress.executive_role
    )
  );

create policy founder_mission_progress_update_own
  on public.founder_mission_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.profiles p
      where p.user_id = (select auth.uid())
        and p.executive_role = founder_mission_progress.executive_role
    )
  );

create policy founder_mission_progress_delete_own
  on public.founder_mission_progress
  for delete to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.assign_executive_role(p_role text)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_role public.executive_role;
  v_current_role public.executive_role;
  v_selected_at timestamptz;
begin
  if v_user is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  begin
    v_role := p_role::public.executive_role;
  exception
    when invalid_text_representation then
      raise exception 'invalid_executive_role' using errcode = '22023';
  end;

  select executive_role, role_selected_at
  into v_current_role, v_selected_at
  from public.profiles
  where user_id = v_user
  for update;

  if not found then
    raise exception 'operator_profile_missing' using errcode = 'P0002';
  end if;

  if v_current_role is not null and v_current_role <> v_role then
    raise exception 'executive_role_already_assigned' using errcode = '42501';
  end if;

  v_selected_at := coalesce(v_selected_at, now());
  update public.profiles
  set executive_role = v_role,
      role_selected_at = v_selected_at,
      updated_at = now()
  where user_id = v_user;

  return jsonb_build_object(
    'role', v_role::text,
    'selectedAt', v_selected_at
  );
end;
$$;

create or replace function public.load_executive_state()
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_result jsonb;
  v_state jsonb;
  v_role public.executive_role;
  v_selected_at timestamptz;
  v_onboarding_at timestamptz;
begin
  if v_user is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  v_result := public.load_operator_state();
  if not coalesce((v_result ->> 'exists')::boolean, false) then
    return v_result;
  end if;

  select executive_role, role_selected_at, role_onboarding_completed_at
  into v_role, v_selected_at, v_onboarding_at
  from public.profiles
  where user_id = v_user;

  v_state := v_result -> 'state';
  v_state := jsonb_set(
    v_state,
    '{profile,executiveRole}',
    case
      when v_role is null then 'null'::jsonb
      else to_jsonb(v_role::text)
    end,
    true
  );
  v_state := jsonb_set(
    v_state,
    '{profile,roleSelectedAt}',
    coalesce(to_jsonb(v_selected_at), 'null'::jsonb),
    true
  );
  v_state := jsonb_set(
    v_state,
    '{profile,onboardingCompletedAt}',
    coalesce(to_jsonb(v_onboarding_at), 'null'::jsonb),
    true
  );
  v_state := jsonb_set(
    v_state,
    '{founderMissions}',
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id,
        'missionId', f.mission_id,
        'executiveRole', f.executive_role::text,
        'status', f.status,
        'analysis', f.analysis,
        'recommendation', f.recommendation,
        'decision', f.decision,
        'reflection', f.reflection,
        'completedAt', f.completed_at,
        'createdAt', f.created_at,
        'updatedAt', f.updated_at
      ) order by f.created_at desc)
      from public.founder_mission_progress f
      where f.user_id = v_user
    ), '[]'::jsonb),
    true
  );

  return jsonb_set(v_result, '{state}', v_state, true);
end;
$$;

create or replace function public.save_executive_state(
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
  v_role public.executive_role;
  v_state_role text;
  v_result jsonb;
  v_item jsonb;
  v_onboarding_at timestamptz;
begin
  if v_user is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select executive_role
  into v_role
  from public.profiles
  where user_id = v_user
  for update;

  v_state_role := nullif(p_state #>> '{profile,executiveRole}', '');
  if v_state_role is not null and (
    v_role is null or v_state_role <> v_role::text
  ) then
    raise exception 'executive_role_mismatch' using errcode = '42501';
  end if;

  v_result := public.save_operator_state(
    p_state,
    p_expected_revision,
    p_request_id
  );

  v_onboarding_at := nullif(
    p_state #>> '{profile,onboardingCompletedAt}',
    ''
  )::timestamptz;
  if v_onboarding_at is not null and v_role is not null then
    update public.profiles
    set role_onboarding_completed_at = coalesce(
          role_onboarding_completed_at,
          v_onboarding_at
        ),
        updated_at = greatest(updated_at, v_onboarding_at)
    where user_id = v_user;
  end if;

  for v_item in
    select value
    from jsonb_array_elements(
      coalesce(p_state -> 'founderMissions', '[]'::jsonb)
    )
  loop
    if v_role is null or v_item ->> 'executiveRole' <> v_role::text then
      raise exception 'founder_mission_role_mismatch' using errcode = '42501';
    end if;

    insert into public.founder_mission_progress (
      id, user_id, mission_id, executive_role, status, analysis,
      recommendation, decision, reflection, completed_at, created_at, updated_at
    ) values (
      v_item ->> 'id',
      v_user,
      v_item ->> 'missionId',
      (v_item ->> 'executiveRole')::public.executive_role,
      coalesce(v_item ->> 'status', 'in-progress'),
      coalesce(v_item ->> 'analysis', ''),
      coalesce(v_item ->> 'recommendation', ''),
      nullif(v_item ->> 'decision', ''),
      coalesce(v_item ->> 'reflection', ''),
      nullif(v_item ->> 'completedAt', '')::timestamptz,
      coalesce(
        nullif(v_item ->> 'createdAt', '')::timestamptz,
        now()
      ),
      coalesce(
        nullif(v_item ->> 'updatedAt', '')::timestamptz,
        now()
      )
    )
    on conflict (id) do update
    set status = excluded.status,
        analysis = excluded.analysis,
        recommendation = excluded.recommendation,
        decision = excluded.decision,
        reflection = excluded.reflection,
        completed_at = excluded.completed_at,
        updated_at = excluded.updated_at
    where public.founder_mission_progress.user_id = v_user
      and public.founder_mission_progress.executive_role = v_role;
  end loop;

  delete from public.founder_mission_progress f
  where f.user_id = v_user
    and not exists (
      select 1
      from jsonb_array_elements(
        coalesce(p_state -> 'founderMissions', '[]'::jsonb)
      ) item
      where item ->> 'id' = f.id
    );

  return v_result;
end;
$$;

grant select, insert, update, delete
  on public.founder_mission_progress
  to authenticated;

revoke execute on function public.assign_executive_role(text)
  from public, anon;
revoke execute on function public.load_executive_state()
  from public, anon;
revoke execute on function public.save_executive_state(jsonb, bigint, uuid)
  from public, anon;

grant execute on function public.assign_executive_role(text)
  to authenticated;
grant execute on function public.load_executive_state()
  to authenticated;
grant execute on function public.save_executive_state(jsonb, bigint, uuid)
  to authenticated;

comment on column public.profiles.executive_role is
  'One-time G-OPS primary executive track. Role changes require a future controlled workflow.';
comment on table public.founder_mission_progress is
  'Private per-user CEO or COO analysis for asynchronous founder missions; no cross-user sharing is implied.';
