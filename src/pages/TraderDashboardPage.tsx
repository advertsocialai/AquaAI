import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Truck, FileCheck, Wallet, Bell, ArrowRight, MapPin, Calendar,
  TrendingUp, Activity, BookOpen, ShieldCheck, Package,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LivePriceTicker } from '@/components/dashboard/LivePriceTicker';
import { AnnouncementModal } from '@/components/dashboard/AnnouncementModal';
import { StoreButtons } from '@/components/StoreButtons';
import CustomersTableCard from '@/components/CustomersTableCard';

// ── Demo data ──────────────────────────────────────────────────────────────────
// Replace with Supabase fetches once the trader's session + RLS-scoped queries
// against `lots`, `orders`, `shipments`, `payments` are wired through.

const BIZ_SUMMARY = {
  openLots: 12,
  todaysVolumeKg: 18_400,
  activeSuppliers: 27,
  avgMarginPct: 8.4,
  region: 'Andhra Pradesh · Coastal belt',
};

const TODAYS_ACTIONS = [
  { kind: 'urgent',  title: 'Vannamei 30-count up ₹12/kg at Bhimavaram', meta: 'Mandi feed · 8 min ago',     to: '/aquaai#dashboard' },
  { kind: 'warning', title: '3 shipments awaiting cold-chain dispatch',  meta: 'Pickup window closes 4 PM',  to: '/aquaai#dashboard' },
  { kind: 'info',    title: '₹4.2L payment due to 2 farmer suppliers',   meta: 'Net-7 terms · clears today', to: '/aquaai#dashboard' },
];

const QUICK_TOOLS = [
  { icon: ShoppingCart, label: 'Buy lots',       sub: 'Open marketplace',   to: '/aquaai#dashboard',     accent: 'text-teal-300',    bg: 'bg-teal-400/10' },
  { icon: Truck,        label: 'Dispatch',       sub: 'Logistics · trucks', to: '/aquaai#dashboard',     accent: 'text-orange-300',  bg: 'bg-orange-400/10' },
  { icon: FileCheck,    label: 'QC certificates', sub: 'Verify lineage',     to: '/verify/QC-2026-04421', accent: 'text-sky-300',     bg: 'bg-sky-400/10' },
  { icon: Wallet,       label: 'Payments',       sub: 'Settle suppliers',   to: '/aquaai#dashboard',     accent: 'text-emerald-300', bg: 'bg-emerald-400/10' },
  { icon: Package,      label: 'My orders',      sub: 'Track procurement',  to: '/aquaai#dashboard',     accent: 'text-violet-300',  bg: 'bg-violet-400/10' },
  { icon: BookOpen,     label: 'Knowledge',      sub: 'Export · schemes',   to: '/knowledge',            accent: 'text-amber-300',   bg: 'bg-amber-400/10' },
];

const RECENT_ACTIVITY = [
  { when: '8 min ago',  what: 'Lot purchased',        detail: 'Lot #A-2291 · 2,400 kg · Grade A+ · ₹8.9L', status: 'ok' as const },
  { when: '2 h ago',    what: 'Shipment dispatched',  detail: 'AP-39 reefer · Bhimavaram → Vizag port',    status: 'ok' as const },
  { when: '5 h ago',    what: 'QC certificate cleared',detail: 'QC-2026-04421 · Grade A++ · antibiotic-free', status: 'ok' as const },
  { when: 'Yesterday',  what: 'Payment held',         detail: 'Lot #A-2284 · pending QC re-test',          status: 'alert' as const },
];

const tone = {
  urgent:  { bar: 'border-rose-400/40',  icon: 'text-rose-300',  chip: 'bg-rose-400/10' },
  warning: { bar: 'border-amber-400/40', icon: 'text-amber-300', chip: 'bg-amber-400/10' },
  info:    { bar: 'border-teal-400/40',  icon: 'text-teal-300',  chip: 'bg-teal-400/10' },
};

export default function TraderDashboardPage() {
  useEffect(() => { document.title = 'Trader Dashboard — Aqua Rudra'; }, []);

  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <AnnouncementModal
        id="trader-2026-06"
        title="New: Live buy-side board"
        description="Real-time mandi prices with margin alerts across the coastal belt — and escrow payments are now live."
        ctaLabel="View lots"
        ctaTo="/aquaai#dashboard"
        showStoreButtons
      />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl space-y-10">

          {/* ── Greeting + business summary ───────────────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-2">{greeting}, S. Prasad Exports</div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {BIZ_SUMMARY.openLots} open lots ·{' '}
                  <span className="text-foreground/60 font-normal">{BIZ_SUMMARY.activeSuppliers} suppliers</span>
                </h1>
                <div className="flex items-center gap-2 text-sm text-foreground/55 mt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{BIZ_SUMMARY.region}</span>
                  <span className="text-foreground/20">·</span>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 lg:text-right">
                <Metric label="Open lots"      value={BIZ_SUMMARY.openLots} />
                <Metric label="Today (kg)"     value={BIZ_SUMMARY.todaysVolumeKg.toLocaleString('en-IN')} />
                <Metric label="Avg margin"     value={`${BIZ_SUMMARY.avgMarginPct}%`} />
              </div>
            </div>
          </section>

          {/* ── Today's actions ──────────────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Today</div>
                <h2 className="text-xl md:text-2xl font-bold">What needs your attention</h2>
              </div>
              <Bell className="w-5 h-5 text-teal-300" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {TODAYS_ACTIONS.map((a, i) => {
                const t = tone[a.kind as keyof typeof tone];
                return (
                  <motion.div
                    key={a.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-5 rounded-2xl border bg-card ${t.bar}`}
                  >
                    <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3 ${t.chip}`}>
                      <Bell className={`w-4 h-4 ${t.icon}`} />
                    </div>
                    <div className="text-sm font-semibold text-foreground leading-snug mb-1">{a.title}</div>
                    <div className="text-xs text-foreground/50">{a.meta}</div>
                    <Link to={a.to} className={`inline-flex items-center gap-1 mt-3 text-xs ${t.icon} hover:underline`}>
                      Open <ArrowRight className="w-3 h-3" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ── Quick tools ──────────────────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Quick tools</div>
                <h2 className="text-xl md:text-2xl font-bold">Source, dispatch &amp; settle</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {QUICK_TOOLS.map((tool) => (
                <Link
                  key={tool.label}
                  to={tool.to}
                  className="group p-4 rounded-2xl border border-border bg-card hover:bg-muted transition flex flex-col items-start"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tool.bg}`}>
                    <tool.icon className={`w-5 h-5 ${tool.accent}`} />
                  </div>
                  <div className="text-sm font-semibold text-foreground leading-tight">{tool.label}</div>
                  <div className="text-[11px] text-foreground/50 mt-0.5">{tool.sub}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Live prices ──────────────────────────────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Live mandi prices</div>
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-300" /> Today's buy-side board
                </h2>
              </div>
            </div>
            <LivePriceTicker />
          </section>

          {/* ── Recent activity ──────────────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Recent activity</div>
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-300" /> Your trade log
                </h2>
              </div>
              <Link to="/aquaai#dashboard" className="text-xs text-teal-300 hover:underline inline-flex items-center gap-1">
                Full history <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-card divide-y divide-border">
              {RECENT_ACTIVITY.map((row, i) => (
                <div key={i} className="px-5 py-4 flex items-start gap-4">
                  <div className="text-xs text-foreground/40 w-24 shrink-0 pt-0.5">{row.when}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground leading-snug">{row.what}</div>
                    <div className="text-xs text-foreground/55 mt-0.5">{row.detail}</div>
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
                      row.status === 'alert'
                        ? 'text-rose-300 bg-rose-400/10'
                        : 'text-emerald-300 bg-emerald-400/10'
                    }`}
                  >
                    {row.status === 'alert' ? 'Action' : 'OK'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Recent settlements ───────────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Solutions</div>
                <h2 className="text-xl md:text-2xl font-bold">Supplier settlements</h2>
              </div>
            </div>
            <CustomersTableCard />
          </section>

          {/* ── Get the app ──────────────────────────────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Mobile app</div>
              <h2 className="text-xl md:text-2xl font-bold">Trade on the move</h2>
              <p className="text-sm text-foreground/55 mt-1 max-w-xl">
                Track lots, approve dispatches, and settle suppliers from your phone — live prices and QC in your pocket.
              </p>
            </div>
            <StoreButtons className="shrink-0" />
          </section>

          {/* ── Sign-up CTA ──────────────────────────────────────────────── */}
          <section className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-teal-300 mb-1 inline-flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified trader account
              </div>
              <h2 className="text-xl md:text-2xl font-bold">Unlock live lots, dispatch &amp; settlements</h2>
              <p className="text-sm text-foreground/55 mt-1 max-w-xl">
                Create a trader account to buy directly from verified farmers, with MPEDA-grade QC and escrow payments.
              </p>
            </div>
            <Link
              to="/signup"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-coral hover:bg-coral-hover text-coral-foreground font-semibold text-sm transition"
            >
              Sign up as Trader <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-bold text-foreground">{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-foreground/40 mt-1">{label}</div>
    </div>
  );
}
