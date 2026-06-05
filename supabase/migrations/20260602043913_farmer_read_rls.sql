-- Read policies so the signed-in web user can see their own farm data.
-- Bridges auth.uid() (uuid) -> users.id (bigint) by matching email.

drop policy if exists users_self_read on public.users;
create policy users_self_read on public.users for select to authenticated
  using (email = (select p.email from public.profiles p where p.id = auth.uid()));

drop policy if exists farms_owner_read on public.farms;
create policy farms_owner_read on public.farms for select to authenticated
  using (owner_id in (
    select u.id from public.users u
    join public.profiles p on p.email = u.email
    where p.id = auth.uid()
  ));

-- ponds / batches / water_quality_readings: scoped through the owning farm.
drop policy if exists ponds_owner_read on public.ponds;
create policy ponds_owner_read on public.ponds for select to authenticated
  using (farm_id in (
    select f.id from public.farms f
    join public.users u on u.id = f.owner_id
    join public.profiles p on p.email = u.email
    where p.id = auth.uid()
  ));

drop policy if exists batches_owner_read on public.batches;
create policy batches_owner_read on public.batches for select to authenticated
  using (farm_id in (
    select f.id from public.farms f
    join public.users u on u.id = f.owner_id
    join public.profiles p on p.email = u.email
    where p.id = auth.uid()
  ));

drop policy if exists wq_owner_read on public.water_quality_readings;
create policy wq_owner_read on public.water_quality_readings for select to authenticated
  using (farm_id in (
    select f.id from public.farms f
    join public.users u on u.id = f.owner_id
    join public.profiles p on p.email = u.email
    where p.id = auth.uid()
  ));

-- Outbreak alerts are district-level public notices — readable by any signed-in user.
drop policy if exists outbreak_read on public.outbreak_alerts;
create policy outbreak_read on public.outbreak_alerts for select to authenticated using (true);
