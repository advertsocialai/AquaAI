create table if not exists public.newsletter_subscribers (
  id          bigserial primary key,
  email       text not null check (lower(email) ~ '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$' and length(email) <= 254),
  source      text not null default 'web' check (source in ('web','footer','app','mobile','signup','other')),
  created_at  timestamptz not null default now()
);

create unique index if not exists newsletter_subscribers_email_lower_uq
  on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "anon can subscribe" on public.newsletter_subscribers;
create policy "anon can subscribe"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

comment on table  public.newsletter_subscribers is 'Aqua Rudra newsletter subscribers (web/mobile/app footer signup).';
comment on column public.newsletter_subscribers.source is 'Which surface captured the email: footer, signup, app, mobile, other.';
