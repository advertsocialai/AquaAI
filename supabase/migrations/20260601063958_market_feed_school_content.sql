-- ── Market Price screen ─────────────────────────────────────────────
create table if not exists public.market_prices (
  id          bigint generated always as identity primary key,
  tab         text not null check (tab in ('shrimp','fish')),
  species     text not null,
  label       text not null,           -- '30c' for shrimp counts, 'Big'/'Small' for fish
  price       integer not null,        -- base price (Andhra Pradesh); UI applies location multiplier
  sort_order  integer not null default 0,
  day         date not null default current_date,
  unique (tab, species, label, day)
);
create index if not exists market_prices_lookup on public.market_prices (tab, species, day);

-- ── Aqua Feed (Explore) ─────────────────────────────────────────────
create table if not exists public.feed_posts (
  id          bigint generated always as identity primary key,
  title       text not null,
  body        text,
  image_url   text,
  likes       integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Aqua School (Explore) ───────────────────────────────────────────
create table if not exists public.school_lessons (
  id          bigint generated always as identity primary key,
  title       text not null,
  summary     text,
  category    text,
  created_at  timestamptz not null default now()
);

-- Public reference content → any signed-in user may read; writes are
-- service-role only (no insert/update/delete policy granted).
alter table public.market_prices  enable row level security;
alter table public.feed_posts      enable row level security;
alter table public.school_lessons  enable row level security;

drop policy if exists market_prices_read on public.market_prices;
drop policy if exists feed_posts_read    on public.feed_posts;
drop policy if exists school_lessons_read on public.school_lessons;
create policy market_prices_read  on public.market_prices  for select to authenticated using (true);
create policy feed_posts_read     on public.feed_posts      for select to authenticated using (true);
create policy school_lessons_read on public.school_lessons  for select to authenticated using (true);

-- ── Seed: today's demo prices (matches the current frontend values) ──
insert into public.market_prices (tab, species, label, price, sort_order, day) values
  ('shrimp','Vannamei','20c',510,0,current_date),
  ('shrimp','Vannamei','25c',490,1,current_date),
  ('shrimp','Vannamei','30c',430,2,current_date),
  ('shrimp','Vannamei','40c',330,3,current_date),
  ('shrimp','Vannamei','45c',305,4,current_date),
  ('shrimp','Vannamei','50c',300,5,current_date),
  ('shrimp','Vannamei','60c',280,6,current_date),
  ('shrimp','Vannamei','70c',270,7,current_date),
  ('shrimp','Vannamei','80c',260,8,current_date),
  ('shrimp','Vannamei','90c',240,9,current_date),
  ('shrimp','Vannamei','100c',230,10,current_date),
  ('shrimp','Tiger Prawn','20c',690,0,current_date),
  ('shrimp','Tiger Prawn','25c',660,1,current_date),
  ('shrimp','Tiger Prawn','30c',580,2,current_date),
  ('shrimp','Tiger Prawn','40c',450,3,current_date),
  ('shrimp','Tiger Prawn','45c',415,4,current_date),
  ('shrimp','Tiger Prawn','50c',405,5,current_date),
  ('shrimp','Tiger Prawn','60c',380,6,current_date),
  ('shrimp','Tiger Prawn','70c',365,7,current_date),
  ('shrimp','Tiger Prawn','80c',350,8,current_date),
  ('shrimp','Tiger Prawn','90c',325,9,current_date),
  ('shrimp','Tiger Prawn','100c',310,10,current_date),
  ('fish','Rohu-Katla','Big',116,0,current_date),
  ('fish','Rohu-Katla','Small',100,1,current_date),
  ('fish','Pangasius','Big',95,0,current_date),
  ('fish','Pangasius','Small',80,1,current_date),
  ('fish','Roopchand','Big',135,0,current_date),
  ('fish','Roopchand','Small',115,1,current_date)
on conflict (tab, species, label, day) do update set price = excluded.price, sort_order = excluded.sort_order;

insert into public.feed_posts (title, body, likes) values
  ('Pond preparation before stocking','Proper drying and liming of ponds reduces disease load. Aim for 2–3 weeks of sun-drying.',24),
  ('Managing dissolved oxygen at night','Run aerators from midnight to dawn when DO drops. Target above 4 mg/L.',41),
  ('Spotting early white spot signs','Reduced feeding and lethargic shrimp at pond edges are early warnings.',18);

insert into public.school_lessons (title, summary, category) values
  ('Water Quality Basics','pH, salinity, DO and ammonia — what to measure and ideal ranges.','Fundamentals'),
  ('Feed Management','Feeding rates by body weight and how to use check trays.','Nutrition'),
  ('Disease Prevention','Biosecurity, water exchange and probiotics to keep batches healthy.','Health');
