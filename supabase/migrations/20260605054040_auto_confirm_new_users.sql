-- Aqua Rudra signs users in with mobile + password via the email/password
-- provider (no SMS gateway). Auto-confirm every new user at insert time so
-- password sign-in works immediately, regardless of the project's
-- "Confirm email" setting. The alias emails are non-routable, so there is no
-- confirmation mail to wait for anyway.
create or replace function public.aqua_auto_confirm_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists aqua_auto_confirm_email_trg on auth.users;
create trigger aqua_auto_confirm_email_trg
  before insert on auth.users
  for each row execute function public.aqua_auto_confirm_email();
