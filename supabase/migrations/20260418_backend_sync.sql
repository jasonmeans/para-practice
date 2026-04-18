create extension if not exists pgcrypto;

create table if not exists public.attempts (
  id uuid primary key,
  user_id uuid not null references auth.users on delete cascade,
  completed_at timestamptz not null,
  percent_correct numeric(5, 2) not null,
  mode text not null,
  section text,
  question_count integer not null,
  payload jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists attempts_user_completed_idx
  on public.attempts (user_id, completed_at desc);

create table if not exists public.active_sessions (
  user_id uuid primary key references auth.users on delete cascade,
  updated_at timestamptz not null default timezone('utc', now()),
  payload jsonb not null
);

alter table public.attempts enable row level security;
alter table public.active_sessions enable row level security;

drop policy if exists "Users can read their own attempts" on public.attempts;
create policy "Users can read their own attempts"
  on public.attempts
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own attempts" on public.attempts;
create policy "Users can insert their own attempts"
  on public.attempts
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own attempts" on public.attempts;
create policy "Users can update their own attempts"
  on public.attempts
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own attempts" on public.attempts;
create policy "Users can delete their own attempts"
  on public.attempts
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can read their own active session" on public.active_sessions;
create policy "Users can read their own active session"
  on public.active_sessions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own active session" on public.active_sessions;
create policy "Users can insert their own active session"
  on public.active_sessions
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own active session" on public.active_sessions;
create policy "Users can update their own active session"
  on public.active_sessions
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own active session" on public.active_sessions;
create policy "Users can delete their own active session"
  on public.active_sessions
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
