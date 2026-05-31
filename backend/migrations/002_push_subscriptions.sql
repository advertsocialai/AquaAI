-- Web push subscriptions: one row per browser/device endpoint per user.
-- Applied to project aqua-ai (rjhysiqqwgptqiwsonvd) via Supabase MCP.
create table if not exists public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  user_agent  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

-- Users manage only their own subscriptions. The backend sender uses the
-- service_role key, which bypasses RLS, so no extra policy is needed for it.
drop policy if exists "own subscriptions select" on public.push_subscriptions;
create policy "own subscriptions select" on public.push_subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "own subscriptions insert" on public.push_subscriptions;
create policy "own subscriptions insert" on public.push_subscriptions
  for insert with check (auth.uid() = user_id);

drop policy if exists "own subscriptions update" on public.push_subscriptions;
create policy "own subscriptions update" on public.push_subscriptions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own subscriptions delete" on public.push_subscriptions;
create policy "own subscriptions delete" on public.push_subscriptions
  for delete using (auth.uid() = user_id);

-- Keep updated_at fresh on upsert/update.
create or replace function public.touch_push_subscriptions_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_push_subscriptions_updated_at on public.push_subscriptions;
create trigger trg_push_subscriptions_updated_at
  before update on public.push_subscriptions
  for each row execute function public.touch_push_subscriptions_updated_at();
