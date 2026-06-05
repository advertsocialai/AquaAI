create table if not exists public.weather_alert_log (
  id          bigserial primary key,
  profile_id  uuid        references public.profiles(id) on delete cascade,
  mobile      text,
  kind        text,
  message     text,
  channel     text,
  ok          boolean     not null default false,
  detail      text,
  created_at  timestamptz not null default now()
);
create index if not exists weather_alert_log_profile_idx on public.weather_alert_log(profile_id, created_at desc);
alter table public.weather_alert_log enable row level security;
