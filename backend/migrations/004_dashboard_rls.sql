-- ============================================================================
-- 004_dashboard_rls.sql — RLS read policies so the signed-in web user can see
-- their own dashboard data.
--
-- The web app authenticates via Supabase auth (uuid), but the farm/trader rows
-- key to the legacy `users` table (bigint). profiles.email is null for auth
-- users, so the bridge uses Supabase's auth.email() (the JWT email), which
-- matches users.email.
-- ============================================================================

-- ── Farmer side (existing tables) ──────────────────────────────────────────
drop policy if exists users_self_read on public.users;
create policy users_self_read on public.users for select to authenticated
  using (email = auth.email());

drop policy if exists farms_owner_read on public.farms;
create policy farms_owner_read on public.farms for select to authenticated
  using (owner_id in (select u.id from public.users u where u.email = auth.email()));

drop policy if exists ponds_owner_read on public.ponds;
create policy ponds_owner_read on public.ponds for select to authenticated
  using (farm_id in (
    select f.id from public.farms f join public.users u on u.id = f.owner_id
    where u.email = auth.email()));

drop policy if exists batches_owner_read on public.batches;
create policy batches_owner_read on public.batches for select to authenticated
  using (farm_id in (
    select f.id from public.farms f join public.users u on u.id = f.owner_id
    where u.email = auth.email()));

drop policy if exists wq_owner_read on public.water_quality_readings;
create policy wq_owner_read on public.water_quality_readings for select to authenticated
  using (farm_id in (
    select f.id from public.farms f join public.users u on u.id = f.owner_id
    where u.email = auth.email()));

-- District-level outbreak notices are readable by any signed-in user.
drop policy if exists outbreak_read on public.outbreak_alerts;
create policy outbreak_read on public.outbreak_alerts for select to authenticated using (true);

-- ── Trader side (003_trader.sql tables) ────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['lots','orders','shipments','settlements'] loop
    execute format('drop policy if exists %1$s_owner on public.%1$I;', t);
    execute format($f$
      create policy %1$s_owner on public.%1$I for all to authenticated
        using (trader_id in (select u.id from public.users u where u.email = auth.email()))
        with check (trader_id in (select u.id from public.users u where u.email = auth.email()));
    $f$, t);
  end loop;
end $$;
