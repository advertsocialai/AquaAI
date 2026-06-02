import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export type DashAction = {
  kind: 'urgent' | 'warning' | 'info';
  title: string;
  meta: string;
  to: string;
};
export type DashActivity = {
  when: string;
  what: string;
  detail: string;
  status: 'ok' | 'alert';
};
export type Settlement = {
  id: number | string;
  date: string;
  status: 'Paid' | 'Pending' | 'Refund';
  statusVariant: 'success' | 'danger' | 'warning';
  name: string;
  avatar: string;
  revenue: string;
};

export type TraderDashboardData = {
  hasData: boolean;
  region: string | null;
  openLots: number;
  todaysVolumeKg: number;
  activeSuppliers: number;
  avgMarginPct: number;
  actions: DashAction[];
  activity: DashActivity[];
  settlements: Settlement[];
};

const EMPTY: TraderDashboardData = {
  hasData: false, region: null, openLots: 0, todaysVolumeKg: 0,
  activeSuppliers: 0, avgMarginPct: 0, actions: [], activity: [], settlements: [],
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const avatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d9488&color=fff&bold=true`;

function relativeTime(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? 'Yesterday' : `${days} d ago`;
}

const STATUS_VARIANT: Record<string, Settlement['statusVariant']> = {
  paid: 'success', pending: 'warning', refund: 'danger',
};

/**
 * Loads the signed-in trader's live dashboard from Supabase. The trader tables
 * (lots/orders/shipments/settlements) ship in migration 003_trader.sql; until
 * that's applied, queries fail gracefully and the page keeps its sample data.
 */
export function useTraderDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<TraderDashboardData>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !user) { setLoading(false); return; }
    const sb = supabase;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const ures = await sb.from('users').select('id,district,mandal').eq('email', user.email ?? '');
        const legacy = ures.data?.[0];
        const ownerId = legacy?.id;
        if (ownerId == null) { if (!cancelled) { setData(EMPTY); setLoading(false); } return; }

        const [lotsR, ordersR, shipsR, settleR] = await Promise.all([
          sb.from('lots').select('*').eq('trader_id', ownerId),
          sb.from('orders').select('*').eq('trader_id', ownerId),
          sb.from('shipments').select('*').eq('trader_id', ownerId),
          sb.from('settlements').select('*').eq('trader_id', ownerId),
        ]);
        const lots = (lotsR.data ?? []) as Record<string, unknown>[];
        const orders = (ordersR.data ?? []) as Record<string, unknown>[];
        const ships = (shipsR.data ?? []) as Record<string, unknown>[];
        const settles = (settleR.data ?? []) as Record<string, unknown>[];

        if (!lots.length && !orders.length && !ships.length && !settles.length) {
          if (!cancelled) { setData(EMPTY); setLoading(false); }
          return;
        }

        const num = (v: unknown) => Number(v ?? 0);
        const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);

        const openLots = lots.filter((l) => l.status === 'open').length;
        const todaysVolumeKg = orders
          .filter((o) => new Date(String(o.created_at)).getTime() >= startOfDay.getTime())
          .reduce((s, o) => s + num(o.quantity_kg), 0);
        const suppliers = new Set(orders.map((o) => o.supplier_name).filter(Boolean));
        const margins = orders.map((o) => num(o.margin_pct)).filter((m) => m > 0);
        const avgMarginPct = margins.length
          ? Math.round((margins.reduce((s, m) => s + m, 0) / margins.length) * 10) / 10 : 0;

        const actions: DashAction[] = [];
        const awaiting = ships.filter((s) => s.status === 'awaiting').length;
        if (awaiting) actions.push({
          kind: 'warning', title: `${awaiting} shipment${awaiting > 1 ? 's' : ''} awaiting dispatch`,
          meta: 'Cold-chain pickup pending', to: '/aquaai#dashboard',
        });
        const due = orders.filter((o) => o.status === 'pending');
        if (due.length) actions.push({
          kind: 'info', title: `${inr(due.reduce((s, o) => s + num(o.amount), 0))} payment due to suppliers`,
          meta: `${due.length} order${due.length > 1 ? 's' : ''} pending`, to: '/aquaai#dashboard',
        });

        const activity: DashActivity[] = orders.slice(0, 5).map((o) => ({
          when: relativeTime(String(o.created_at)),
          what: o.status === 'paid' ? 'Lot settled' : 'Order placed',
          detail: `${o.supplier_name ?? 'Supplier'} · ${num(o.quantity_kg)} kg · ${inr(num(o.amount))}`,
          status: o.status === 'cancelled' ? ('alert' as const) : ('ok' as const),
        }));

        const settlements: Settlement[] = settles.map((s) => ({
          id: Number(s.id),
          date: s.settled_on
            ? new Date(String(s.settled_on)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—',
          status: (String(s.status)[0].toUpperCase() + String(s.status).slice(1)) as Settlement['status'],
          statusVariant: STATUS_VARIANT[String(s.status)] ?? 'warning',
          name: String(s.supplier_name ?? 'Supplier'),
          avatar: avatar(String(s.supplier_name ?? 'Supplier')),
          revenue: inr(num(s.amount)),
        }));

        if (!cancelled) {
          setData({
            hasData: true,
            region: [legacy?.mandal, legacy?.district].filter(Boolean).join(', ') || null,
            openLots, todaysVolumeKg, activeSuppliers: suppliers.size, avgMarginPct,
            actions, activity, settlements,
          });
          setLoading(false);
        }
      } catch {
        // Tables not present yet (migration unapplied) → keep sample data.
        if (!cancelled) { setData(EMPTY); setLoading(false); }
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  return { data, loading };
}
