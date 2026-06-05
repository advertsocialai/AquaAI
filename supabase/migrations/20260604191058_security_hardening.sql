revoke execute on function public.auto_confirm_new_user() from anon, authenticated, public;
drop policy if exists "avatars public read" on storage.objects;
