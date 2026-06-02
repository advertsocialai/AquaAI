-- ============================================================================
-- 003_trader.sql — Trader / exporter domain for the Trader dashboard.
--
-- Mirrors the existing schema convention: rows are keyed to the legacy
-- `users` table (bigint id), and RLS bridges the Supabase auth user (uuid)
-- to that bigint owner by matching email (profiles.email = users.email).
--
-- ⚠️ NOT auto-applied. The aqua-ai Supabase project is shared by preview +
-- production — apply this deliberately via the Supabase SQL editor or CLI
-- after reviewing, then regenerate src/lib/supabase-types.ts.
-- ============================================================================

-- ── Lots: harvest lots a trader is buying/selling ──────────────────────────
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

-- ── Orders: procurement from farmer suppliers ──────────────────────────────
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

-- ── Shipments: cold-chain dispatch ─────────────────────────────────────────
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

-- ── Settlements: supplier payouts ──────────────────────────────────────────
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

-- ── Row-level security: a trader sees only their own rows ───────────────────
-- Bridges auth.uid() (uuid) → users.id (bigint) via matching email.
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
