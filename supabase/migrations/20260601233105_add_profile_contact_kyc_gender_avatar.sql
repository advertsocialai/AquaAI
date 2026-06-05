alter table public.profiles
  add column if not exists alt_mobile text,
  add column if not exists kyc_id     text,
  add column if not exists gender     text,
  add column if not exists avatar_url text;

-- Public bucket for profile photos.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Anyone may read avatars; each user may manage only files under a folder
-- named after their auth uid (path: "<uid>/avatar.<ext>").
drop policy if exists "avatars public read"   on storage.objects;
drop policy if exists "avatars owner insert"  on storage.objects;
drop policy if exists "avatars owner update"  on storage.objects;
drop policy if exists "avatars owner delete"  on storage.objects;

create policy "avatars public read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars owner insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars owner update" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars owner delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
