import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Camera, Microscope, Droplets, Bell, ArrowRight, MapPin, Calendar,
  TrendingUp, Activity, BookOpen, Calculator, ShieldCheck,
  IndianRupee, Wrench, Store, Truck, Newspaper,
} from 'lucide-react';
import { ARTICLES } from '@/pages/KnowledgePage';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WeatherTimeWidget } from '@/components/WeatherTimeWidget';
import { MarketPriceBoard } from '@/components/market/MarketPriceBoard';
import { AnnouncementModal } from '@/components/dashboard/AnnouncementModal';
import { StoreButtons } from '@/components/StoreButtons';
import { useFarmerDashboard } from '@/hooks/useFarmerDashboard';
import { useAuth } from '@/lib/auth';

// ── Demo data ──────────────────────────────────────────────────────────────────
// Replace with Supabase fetches once the farmer's session + RLS-scoped queries
// against `farms`, `ponds`, `batches`, `outbreak_alerts` are wired through.

const FARM_SUMMARY = {
  ponds: 4,
  totalAreaAcre: 8.2,
  activeBatches: 3,
  estStockKg: 4_840,
  dayOfCycle: 86,
  district: 'Bhimavaram, West Godavari',
};

const TODAYS_ACTIONS = [
  { kind: 'urgent', title: 'Pond 2 dissolved O₂ dropped to 3.4 ppm', meta: 'Last reading 12 min ago', to: '/aquaai#dashboard' },
  { kind: 'warning', title: 'EHP cluster reported 9 km north', meta: 'NSPAAD bulletin · last 24 h',   to: '/aquaai#dashboard' },
  { kind: 'info',    title: 'Heavy rain forecast tonight — lower water 4 inches', meta: 'IMD · 65 mm', to: '/aquaai#dashboard' },
];

const QUICK_TOOLS = [
  { icon: Microscope, label: 'Disease detector', sub: 'Snap a sample',     to: '/aquaai#dashboard', accent: 'text-rose-300',     bg: 'bg-rose-400/10' },
  { icon: Camera,     label: 'Seed counter',     sub: 'Tray photo → count', to: '/aquaai#dashboard', accent: 'text-emerald-300',  bg: 'bg-emerald-400/10' },
  { icon: Droplets,   label: 'Water quality',    sub: 'Sample → grade',     to: '/aquaai#dashboard', accent: 'text-teal-300',     bg: 'bg-teal-400/10' },
  { icon: Calculator, label: 'Calculators',      sub: 'FCR · stocking',     to: '/aquaai#dashboard', accent: 'text-violet-300',   bg: 'bg-violet-400/10' },
  { icon: BookOpen,   label: 'Knowledge',        sub: 'Articles · schemes', to: '/knowledge',        accent: 'text-amber-300',    bg: 'bg-amber-400/10' },
  { icon: IndianRupee,label: 'Live Rates',       sub: 'Mandi + FOB',        to: '/rates',            accent: 'text-emerald-300',  bg: 'bg-emerald-400/10' },
  { icon: Wrench,     label: 'Aqua Tools',       sub: 'Survival · feed',    to: '/tools',            accent: 'text-sky-300',      bg: 'bg-sky-400/10' },
  { icon: Store,      label: 'Shop Farm',        sub: 'Inputs · sell',      to: '/shop',             accent: 'text-lime-300',     bg: 'bg-lime-400/10' },
  { icon: Truck,      label: 'Logistics',        sub: 'Transport · O₂',     to: '/logistics',        accent: 'text-orange-300',   bg: 'bg-orange-400/10' },
  { icon: ShieldCheck,label: 'Certificates',     sub: 'QC · lineage',       to: '/verify/QC-2026-04421', accent: 'text-sky-300',  bg: 'bg-sky-400/10' },
];

const RECENT_ACTIVITY = [
  { when: '12 min ago', what: 'Water quality reading',  detail: 'Pond 2 · DO 3.4 ppm · pH 7.8', status: 'alert' as const },
  { when: '3 h ago',    what: 'Seed counter',           detail: 'Tray 4 · 12,840 PLs (±2.1%)',  status: 'ok' as const },
  { when: '6 h ago',    what: 'Disease screen',         detail: 'Pond 1 · No condition flagged', status: 'ok' as const },
  { when: 'Yesterday',  what: 'QC certificate issued',  detail: 'QC-2026-04421 · Grade A++',     status: 'ok' as const },
];

const tone = {
  urgent:  { bar: 'border-rose-400/40',    icon: 'text-rose-300',    chip: 'bg-rose-400/10' },
  warning: { bar: 'border-amber-400/40',   icon: 'text-amber-300',   chip: 'bg-amber-400/10' },
  info:    { bar: 'border-teal-400/40',    icon: 'text-teal-300',    chip: 'bg-teal-400/10' },
};

// Demo fallbacks (shown until the account has live farm/readings data).
const DEMO_PONDS = [
  { label: 'Pond 1', areaSqm: 4000, docDays: 86, doMgl: 5.2, ph: 7.9, alert: false },
  { label: 'Pond 2', areaSqm: 3500, docDays: 86, doMgl: 3.4, ph: 7.8, alert: true },
  { label: 'Pond 3', areaSqm: 4200, docDays: 54, doMgl: 6.0, ph: 8.0, alert: false },
  { label: 'Pond 4', areaSqm: 3800, docDays: 54, doMgl: 5.8, ph: 7.7, alert: false },
];
const DEMO_TREND = [
  { at: '2026-05-28', doMgl: 5.6, ph: 8.0 }, { at: '2026-05-29', doMgl: 5.2, ph: 7.9 },
  { at: '2026-05-30', doMgl: 4.8, ph: 7.9 }, { at: '2026-05-31', doMgl: 4.3, ph: 7.8 },
  { at: '2026-06-01', doMgl: 3.9, ph: 7.8 }, { at: '2026-06-02', doMgl: 4.6, ph: 7.9 },
  { at: '2026-06-03', doMgl: 5.1, ph: 8.0 },
];
const DEMO_OUTBREAKS = [
  { disease: 'EHP', place: 'Bhimavaram', severity: 'moderate', km: 9, when: 'last 24 h' },
  { disease: 'White Spot', place: 'Palakollu', severity: 'high', km: 22, when: '2 d ago' },
];
const DEMO_HARVEST = { harvestDate: '12 Jul', daysLeft: 34 };

/* Minimal DO sparkline with a 4 ppm safe-line. */
function Sparkline({ points }: { points: number[] }) {
  const w = 320, h = 64, pad = 6;
  const lo = Math.min(...points, 3.5), hi = Math.max(...points, 8);
  const x = (i: number) => pad + (i * (w - 2 * pad)) / Math.max(1, points.length - 1);
  const y = (v: number) => pad + (1 - (v - lo) / (hi - lo || 1)) * (h - 2 * pad);
  const d = points.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <line x1={pad} x2={w - pad} y1={y(4)} y2={y(4)} stroke="hsl(var(--destructive))" strokeOpacity="0.4" strokeDasharray="4 4" strokeWidth="1" />
      <path d={d} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="hsl(var(--primary))" />)}
    </svg>
  );
}

export default function FarmerDashboardPage() {
  useEffect(() => { document.title = 'Farmer Dashboard — Aqua Rudra'; }, []);

  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  });

  // Live data from Supabase (RLS-scoped to this farmer). Falls back to the
  // sample content below when the account has no farm/readings yet.
  const { data: live } = useFarmerDashboard();
  const hasFarm = live.farmName !== null;
  // Greeting name comes from the signed-in user's profile name.
  const { user } = useAuth();
  const farmerName =
    (user?.user_metadata?.name as string | undefined)?.trim() ||
    user?.email?.split('@')[0] ||
    live.farmName ||
    'Farmer';
  const summary = hasFarm
    ? {
        ponds: live.ponds,
        totalAreaAcre: Math.round(live.totalAreaHectares * 2.471 * 10) / 10,
        activeBatches: live.activeBatches,
        estStockKg: FARM_SUMMARY.estStockKg,
        dayOfCycle: live.dayOfCycle ?? FARM_SUMMARY.dayOfCycle,
        district: live.district ?? FARM_SUMMARY.district,
      }
    : FARM_SUMMARY;
  const actions = hasFarm && live.actions.length ? live.actions : TODAYS_ACTIONS;
  const recent = hasFarm && live.activity.length ? live.activity : RECENT_ACTIVITY;
  const pondCards = hasFarm && live.pondCards.length ? live.pondCards : DEMO_PONDS;
  const trend = live.trend.length ? live.trend : DEMO_TREND;
  const outbreaks = hasFarm && live.outbreaks.length ? live.outbreaks : DEMO_OUTBREAKS;
  const harvest = live.harvest ?? DEMO_HARVEST;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <AnnouncementModal
        id="farmer-2026-06"
        title="New: AI Disease Detector v2"
        description="On-device screening is faster — it now flags EHP and white-spot in under 3 seconds, fully offline."
        ctaLabel="Try it now"
        ctaTo="/aquaai#dashboard"
        showStoreButtons
      />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl space-y-10">

          {/* ── Greeting + farm summary ───────────────────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-2">{greeting}, {farmerName}</div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  Day {summary.dayOfCycle} of cycle ·{' '}
                  <span className="text-foreground/60 font-normal">{summary.activeBatches} active batches</span>
                </h1>
                <div className="flex items-center gap-2 text-sm text-foreground/55 mt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{summary.district}</span>
                  <span className="text-foreground/20">·</span>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 lg:text-right">
                <Metric label="Ponds"          value={summary.ponds} />
                <Metric label="Area (acre)"    value={summary.totalAreaAcre} />
                <Metric label="Stock (kg)"     value={summary.estStockKg.toLocaleString('en-IN')} />
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
              {actions.map((a, i) => {
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

          {/* ── Nearby disease alerts ────────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Surveillance</div>
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-300" /> Nearby disease alerts
                </h2>
              </div>
            </div>
            {outbreaks.length === 0 ? (
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5 text-sm text-emerald-200">
                No outbreaks reported near you.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {outbreaks.map((o, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-amber-400/40 bg-card">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-foreground">{o.disease} · {o.place}</div>
                      <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full text-amber-300 bg-amber-400/10">
                        {o.severity}
                      </span>
                    </div>
                    <div className="text-xs text-foreground/55 mt-1">
                      {o.km != null ? `${o.km} km away` : 'in your district'} · {o.when}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Weather (same widget as the home page) ───────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <WeatherTimeWidget />
          </section>

          {/* ── Water-quality trend ──────────────────────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Water quality</div>
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-teal-300" /> Dissolved O₂ trend
                </h2>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold tabular-nums">{trend[trend.length - 1].doMgl.toFixed(1)}<span className="text-sm font-normal text-foreground/40"> ppm</span></div>
                <div className="text-[11px] text-foreground/45">latest · pH {trend[trend.length - 1].ph.toFixed(1)}</div>
              </div>
            </div>
            <Sparkline points={trend.map((t) => t.doMgl)} />
            <div className="mt-2 text-[11px] text-foreground/45">
              Dashed line = 4 ppm safe minimum. Last {trend.length} readings.
            </div>
          </section>

          {/* ── Live rates (full board, same as home / rates) ────────────── */}
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="mb-4">
              <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Live mandi prices</div>
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-300" /> What your pond is worth today
              </h2>
            </div>
            <MarketPriceBoard />
          </section>

          {/* ── Your ponds ───────────────────────────────────────────────── */}
          <section>
            <div className="mb-4">
              <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Ponds</div>
              <h2 className="text-xl md:text-2xl font-bold">Your ponds</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {pondCards.map((p, i) => (
                <div key={i} className={`p-5 rounded-2xl border bg-card ${p.alert ? 'border-rose-400/40' : 'border-border'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-foreground">{p.label}</div>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
                      p.alert ? 'text-rose-300 bg-rose-400/10' : 'text-emerald-300 bg-emerald-400/10'
                    }`}>
                      {p.alert ? 'Check' : 'OK'}
                    </span>
                  </div>
                  <div className="text-xs text-foreground/50 mt-1">
                    {p.docDays != null ? `Day ${p.docDays}` : 'Not stocked'} · {(p.areaSqm / 4047).toFixed(2)} ac
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[11px] text-foreground/45">DO</div>
                      <div className="font-bold tabular-nums">{p.doMgl != null ? p.doMgl.toFixed(1) : '—'}<span className="text-[10px] font-normal text-foreground/40"> ppm</span></div>
                    </div>
                    <div>
                      <div className="text-[11px] text-foreground/45">pH</div>
                      <div className="font-bold tabular-nums">{p.ph != null ? p.ph.toFixed(1) : '—'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Harvest readiness ────────────────────────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Harvest readiness</div>
              <h2 className="text-xl md:text-2xl font-bold">
                {harvest.daysLeft > 0 ? `~${harvest.daysLeft} days to harvest` : 'Ready to harvest'}
              </h2>
              <p className="text-sm text-foreground/55 mt-1 max-w-xl">
                Target harvest around <span className="font-semibold text-foreground/80">{harvest.harvestDate}</span> (≈120-day cycle).
                Check live rates to time your sale.
              </p>
            </div>
            <Link
              to="/rates"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10 font-semibold text-sm transition"
            >
              View live rates <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          {/* ── Quick tools ──────────────────────────────────────────────── */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold">Quick tools</h2>
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

          {/* ── Aqua News ────────────────────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Aqua news</div>
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-teal-300" /> Latest for your farm
                </h2>
              </div>
              <Link to="/knowledge" className="text-xs text-teal-300 hover:underline inline-flex items-center gap-1">
                All news <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {ARTICLES.slice(0, 3).map((a) => (
                <Link
                  key={a.slug}
                  to={`/knowledge/${a.slug}`}
                  className="rounded-2xl border border-border bg-card overflow-hidden hover:bg-muted transition"
                >
                  <div className="aspect-[16/9] bg-muted overflow-hidden">
                    <img src={a.hero} alt={a.title} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] uppercase tracking-widest text-teal-300 mb-1">{a.category}</div>
                    <div className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{a.title}</div>
                    <div className="text-[11px] text-foreground/50 mt-1">{a.readMin} min read</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Recent activity ──────────────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Recent activity</div>
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-300" /> Your farm log
                </h2>
              </div>
              <Link to="/aquaai#dashboard" className="text-xs text-teal-300 hover:underline inline-flex items-center gap-1">
                Full history <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-card divide-y divide-border">
              {recent.map((row, i) => (
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

          {/* ── Get the app ──────────────────────────────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Mobile app</div>
              <h2 className="text-xl md:text-2xl font-bold">Take your farm dashboard offline</h2>
              <p className="text-sm text-foreground/55 mt-1 max-w-xl">
                Scan, diagnose, and log readings pond-side — even with no signal. Syncs when you're back online.
              </p>
            </div>
            <StoreButtons className="shrink-0" />
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
