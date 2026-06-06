-- Redundant: public.auto_confirm_new_user already auto-confirms on insert.
-- Drop the duplicate added moments earlier so only one trigger remains.
drop trigger if exists aqua_auto_confirm_email_trg on auth.users;
drop function if exists public.aqua_auto_confirm_email();
