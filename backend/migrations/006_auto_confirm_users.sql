-- ============================================================================
-- 006_auto_confirm_users.sql — auto-confirm sign-ups.
-- Confirmation email/SMS delivery isn't wired, so the confirm step blocks
-- login ("Email not confirmed"). This trigger confirms users on insert
-- (equivalent to the "Confirm email" auth setting = off). Drop the trigger to
-- restore the confirmation requirement.
-- ============================================================================
create or replace function public.auto_confirm_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.email_confirmed_at is null then new.email_confirmed_at := now(); end if;
  if new.phone is not null and new.phone_confirmed_at is null then new.phone_confirmed_at := now(); end if;
  return new;
end; $$;

drop trigger if exists auto_confirm_new_user on auth.users;
create trigger auto_confirm_new_user before insert on auth.users
  for each row execute function public.auto_confirm_new_user();

update auth.users set email_confirmed_at = now() where email_confirmed_at is null;
update auth.users set phone_confirmed_at = now() where phone is not null and phone_confirmed_at is null;
