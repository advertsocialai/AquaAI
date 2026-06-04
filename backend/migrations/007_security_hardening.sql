-- ============================================================================
-- 007_security_hardening.sql — close advisor-flagged security gaps.
--
-- 1. auto_confirm_new_user(): it's a SECURITY DEFINER function living in the
--    public schema, so PostgREST exposes it at /rest/v1/rpc/auto_confirm_new_user
--    callable by anon/authenticated. It's only meant to run as the BEFORE INSERT
--    trigger on auth.users. Triggers fire regardless of EXECUTE grants, so
--    revoking EXECUTE removes the RPC surface without affecting the trigger.
--
-- 2. "avatars public read": the avatars bucket is public, so objects are served
--    directly by URL — no storage.objects SELECT policy is needed for that. The
--    broad SELECT policy additionally lets any client LIST every file in the
--    bucket. The app only uploads + getPublicUrl (never .list()), so we drop it.
-- ============================================================================

-- 1. Remove the RPC surface on the auth trigger function.
revoke execute on function public.auto_confirm_new_user() from anon, authenticated, public;

-- 2. Drop the over-broad listing policy on the public avatars bucket.
drop policy if exists "avatars public read" on storage.objects;
