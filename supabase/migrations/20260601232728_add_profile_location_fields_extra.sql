alter table public.profiles
  add column if not exists village text,
  add column if not exists state   text,
  add column if not exists pincode text;
