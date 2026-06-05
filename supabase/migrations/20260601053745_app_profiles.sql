-- App-facing profile backing the mobile Profile screen (Supabase Auth based).
-- Keyed on auth.users(id); separate from the custom public.users table.
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  dob          date,
  location     text,
  mobile       text,
  ponds_count  integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Individual pond/tank rows shown under "Pond/Tank Details".
create table if not exists public.profile_ponds (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  area_sqm    double precision,
  depth_m     double precision,
  created_at  timestamptz not null default now()
);
create index if not exists profile_ponds_profile_id_idx on public.profile_ponds(profile_id);

alter table public.profiles enable row level security;
alter table public.profile_ponds enable row level security;

-- RLS: each user reads/writes only their own profile + ponds.
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = id);
create policy profiles_update_own on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists profile_ponds_select_own on public.profile_ponds;
drop policy if exists profile_ponds_insert_own on public.profile_ponds;
drop policy if exists profile_ponds_update_own on public.profile_ponds;
drop policy if exists profile_ponds_delete_own on public.profile_ponds;
create policy profile_ponds_select_own on public.profile_ponds for select using (auth.uid() = profile_id);
create policy profile_ponds_insert_own on public.profile_ponds for insert with check (auth.uid() = profile_id);
create policy profile_ponds_update_own on public.profile_ponds for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy profile_ponds_delete_own on public.profile_ponds for delete using (auth.uid() = profile_id);

-- Keep ponds_count in sync with the profile_ponds rows.
create or replace function public.sync_ponds_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare pid uuid;
begin
  pid := coalesce(new.profile_id, old.profile_id);
  update public.profiles
     set ponds_count = (select count(*) from public.profile_ponds where profile_id = pid),
         updated_at  = now()
   where id = pid;
  return null;
end; $$;
drop trigger if exists trg_sync_ponds_count on public.profile_ponds;
create trigger trg_sync_ponds_count
  after insert or delete on public.profile_ponds
  for each row execute function public.sync_ponds_count();

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, mobile)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email,''), '@', 1)),
    new.phone
  )
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for any existing auth users.
insert into public.profiles (id, full_name, mobile)
select u.id,
       coalesce(u.raw_user_meta_data->>'name', split_part(coalesce(u.email,''), '@', 1)),
       u.phone
from auth.users u
on conflict (id) do nothing;
