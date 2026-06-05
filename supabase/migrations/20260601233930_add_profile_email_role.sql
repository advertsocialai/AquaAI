alter table public.profiles
  add column if not exists email text,
  add column if not exists role  text;
