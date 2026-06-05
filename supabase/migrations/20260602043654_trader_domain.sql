-- Trader / exporter domain for the Trader dashboard.
-- Rows key to the legacy users table (bigint id); RLS bridges the Supabase
-- auth user (uuid) to that bigint owner by matching email.

create table if not exists public.lots (
  id            bigserial primary key,
  trader_id     integer     not null references public.users(id) on delete cascade,
  lot_code      text        not null,
  species       text,
  grade         text,
  quantity_kg   numeric     not null default 0,
  price_per_kg  numeric,
  status        text        not null default 'open'
                  check (status in ('open', 'sold', 'cancelled')),
  district      text,
  mandal        text,
  created_at    timestamptz not null default now()
);
create index if not exists lots_trader_idx on public.lots(trader_id);

create table if not exists public.orders (
  id            bigserial primary key,
  trader_id     integer     not null references public.users(id) on delete cascade,
  lot_id        bigint      references public.lots(id) on delete set null,
  supplier_name text,
  quantity_kg   numeric     not null default 0,
  amount        numeric     not null default 0,
  margin_pct    numeric,
  status        text        not null default 'pending'
                  check (status in ('pending', 'paid', 'cancelled')),
  created_at    timestamptz not null default now()
);
create index if not exists orders_trader_idx on public.orders(trader_id);

create table if not exists public.shipments (
  id            bigserial primary key,
  trader_id     integer     not null references public.users(id) on delete cascade,
  order_id      bigint      references public.orders(id) on delete set null,
  vehicle       text,
  route         text,
  status        text        not null default 'awaiting'
                  check (status in ('awaiting', 'dispatched', 'delivered')),
  pickup_by     timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists shipments_trader_idx on public.shipments(trader_id);

create table if not exists public.settlements (
  id            bigserial primary key,
  trader_id     integer     not null references public.users(id) on delete cascade,
  supplier_name text        not null,
  amount        numeric     not null default 0,
  status        text        not null default 'pending'
                  check (status in ('paid', 'pending', 'refund')),
  settled_on    date,
  created_at    timestamptz not null default now()
);
create index if not exists settlements_trader_idx on public.settlements(trader_id);

do $$
declare t text;
begin
  foreach t in array array['lots','orders','shipments','settlements'] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format($f$
      create policy %1$s_owner on public.%1$I for all
        using (trader_id in (
          select u.id from public.users u
          join public.profiles p on p.email = u.email
          where p.id = auth.uid()
        ))
        with check (trader_id in (
          select u.id from public.users u
          join public.profiles p on p.email = u.email
          where p.id = auth.uid()
        ));
    $f$, t);
  end loop;
end $$;
