-- ============================================================================
-- seed_demo.sql — sample data so the Farmer + Trader dashboards render LIVE.
--
-- Keyed to the signed-in user's email (auth email == users.email, the bridge
-- the dashboards use). Change @email below to your test login if different.
--
-- Idempotent: re-running won't duplicate (guards on existing farm / lots).
-- Run AFTER 003_trader.sql is applied. Safe to run in the Supabase SQL editor.
-- ============================================================================

do $$
declare
  v_email text := 'rgowtham3339@gmail.com';   -- ← your Supabase auth login email
  uid integer;
  hid integer;
  fid integer;
  p1  integer;
  p2  integer;
begin
  -- 1. Legacy user row (bridge target). Upsert by email.
  insert into public.users (name, email, hashed_password, role, district, mandal)
  values ('V. Ramana', v_email, 'seeded-supabase-auth', 'farmer', 'West Godavari', 'Bhimavaram')
  on conflict (email) do update set district = excluded.district, mandal = excluded.mandal
  returning id into uid;

  -- 2. Farmer data (only if this user has no farm yet).
  if not exists (select 1 from public.farms where owner_id = uid) then
    insert into public.hatcheries (name, district, state)
    values ('Aquaprime Hatcheries', 'West Godavari', 'Andhra Pradesh')
    returning id into hid;

    insert into public.farms (name, owner_id, district, mandal, village, total_area_hectares, location_lat, location_lng)
    values ('Ramana Aqua Farm', uid, 'West Godavari', 'Bhimavaram', 'Bhimavaram', 3.32, 16.5449, 81.5212)
    returning id into fid;

    insert into public.ponds (farm_id, name, area_sqm) values (fid, 'Pond 1', 8000) returning id into p1;
    insert into public.ponds (farm_id, name, area_sqm) values (fid, 'Pond 2', 8000) returning id into p2;
    insert into public.ponds (farm_id, name, area_sqm) values (fid, 'Pond 3', 8200);
    insert into public.ponds (farm_id, name, area_sqm) values (fid, 'Pond 4', 8000);

    insert into public.batches (batch_code, hatchery_id, farm_id, pond_id, is_stocked, stocked_at, ordered_quantity)
    values ('B-' || uid || '-2026-01', hid, fid, p1, true, now() - interval '86 days', 480000),
           ('B-' || uid || '-2026-02', hid, fid, p2, true, now() - interval '70 days', 460000),
           ('B-' || uid || '-2026-03', hid, fid, null, true, now() - interval '40 days', 500000)
    on conflict (batch_code) do nothing;

    insert into public.water_quality_readings
      (farm_id, pond_id, recorded_by, dissolved_oxygen_mgl, ph, salinity_ppt, any_alert, alert_details, recorded_at)
    values
      (fid, p2, uid, 3.4, 7.8, 18, true,  'Dissolved O2 below 4 ppm', now() - interval '12 minutes'),
      (fid, p1, uid, 5.6, 7.9, 17, false, null, now() - interval '3 hours'),
      (fid, p1, uid, 6.1, 8.0, 17, false, null, now() - interval '6 hours'),
      (fid, p2, uid, 5.9, 7.7, 18, false, null, now() - interval '1 day'),
      (fid, p1, uid, 6.0, 7.9, 17, false, null, now() - interval '2 days');
  end if;

  -- 3. Trader data (only if this user has no lots yet).
  if not exists (select 1 from public.lots where trader_id = uid) then
    insert into public.lots (trader_id, lot_code, species, grade, quantity_kg, price_per_kg, status, district, mandal) values
      (uid, 'A-2291', 'Vannamei', 'A+',  2400, 370, 'open', 'West Godavari', 'Bhimavaram'),
      (uid, 'A-2292', 'Vannamei', 'A',   1800, 350, 'open', 'West Godavari', 'Bhimavaram'),
      (uid, 'A-2293', 'Vannamei', 'A++', 2200, 392, 'open', 'West Godavari', 'Bhimavaram'),
      (uid, 'A-2284', 'Vannamei', 'A++', 3000, 390, 'sold', 'West Godavari', 'Bhimavaram');

    insert into public.orders (trader_id, supplier_name, quantity_kg, amount, margin_pct, status) values
      (uid, 'V. Ramana',        2400, 894000, 8.9, 'paid'),
      (uid, 'K. Lakshmi Farms', 1800, 420000, 7.5, 'pending'),
      (uid, 'M. Subba Rao',     1200, 115000, 6.2, 'pending');

    insert into public.shipments (trader_id, vehicle, route, status, pickup_by) values
      (uid, 'AP-39 reefer', 'Bhimavaram → Vizag port', 'awaiting',  now() + interval '4 hours'),
      (uid, 'AP-16 reefer', 'Bhimavaram → Chennai',    'dispatched', null);

    insert into public.settlements (trader_id, supplier_name, amount, status, settled_on) values
      (uid, 'V. Ramana',        894000, 'paid',    current_date - 1),
      (uid, 'K. Lakshmi Farms', 240000, 'paid',    current_date - 4),
      (uid, 'S. Prasad Exports',420000, 'pending', null),
      (uid, 'M. Subba Rao',     115000, 'refund',  current_date - 7);
  end if;
end $$;
