create table if not exists public.tool_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool text not null check (tool in ('seed','disease','water')),
  certificate_id text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.tool_scans enable row level security;

drop policy if exists "tool_scans owner read"   on public.tool_scans;
drop policy if exists "tool_scans owner insert" on public.tool_scans;
create policy "tool_scans owner read"   on public.tool_scans for select using (auth.uid() = user_id);
create policy "tool_scans owner insert" on public.tool_scans for insert with check (auth.uid() = user_id);

create index if not exists tool_scans_user_created_idx on public.tool_scans (user_id, created_at desc);
