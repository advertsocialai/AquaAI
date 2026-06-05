-- auto_confirm_new_user: confirms email/phone on sign-up so login isn't blocked
-- before confirmation delivery is wired. Present on prod but originally applied
-- via direct SQL (untracked); captured here so local mirrors prod and the later
-- security_hardening migration (which revokes EXECUTE) has a function to target.
CREATE OR REPLACE FUNCTION public.auto_confirm_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if new.email_confirmed_at is null then new.email_confirmed_at := now(); end if;
  if new.phone is not null and new.phone_confirmed_at is null then new.phone_confirmed_at := now(); end if;
  return new;
end; $function$;

DROP TRIGGER IF EXISTS auto_confirm_new_user ON auth.users;
CREATE TRIGGER auto_confirm_new_user BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_new_user();
