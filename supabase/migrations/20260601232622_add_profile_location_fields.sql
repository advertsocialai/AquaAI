alter table public.profiles
  add column if not exists district  text,
  add column if not exists mandal    text,
  add column if not exists latitude  double precision,
  add column if not exists longitude double precision;

comment on column public.profiles.latitude  is 'WGS84 latitude captured from device geolocation';
comment on column public.profiles.longitude is 'WGS84 longitude captured from device geolocation';
