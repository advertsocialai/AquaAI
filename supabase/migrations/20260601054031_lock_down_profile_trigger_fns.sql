-- These are trigger-only functions; they should not be callable via the REST RPC surface.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.sync_ponds_count() from public, anon, authenticated;
