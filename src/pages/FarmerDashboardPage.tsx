import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Camera, Microscope, Droplets, Bell, ArrowRight, MapPin, Calendar,
  TrendingUp, Activity, BookOpen, Calculator, ShieldCheck,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WeatherForecast } from '@/components/dashboard/WeatherForecast';
import { LivePriceTicker } from '@/components/dashboard/LivePriceTicker';
import { AnnouncementModal } from '@/components/dashboard/AnnouncementModal';
import { StoreButtons } from '@/components/StoreButtons';

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

export default function FarmerDashboardPage() {
  useEffect(() => { document.title = 'Farmer Dashboard — Aqua Rudra'; }, []);

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
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-2">{greeting}, V. Ramana</div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  Day {FARM_SUMMARY.dayOfCycle} of cycle ·{' '}
                  <span className="text-foreground/60 font-normal">{FARM_SUMMARY.activeBatches} active batches</span>
                </h1>
                <div className="flex items-center gap-2 text-sm text-foreground/55 mt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{FARM_SUMMARY.district}</span>
                  <span className="text-foreground/20">·</span>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 lg:text-right">
                <Metric label="Ponds"          value={FARM_SUMMARY.ponds} />
                <Metric label="Area (acre)"    value={FARM_SUMMARY.totalAreaAcre} />
                <Metric label="Stock (kg)"     value={FARM_SUMMARY.estStockKg.toLocaleString('en-IN')} />
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

          {/* ── Quick AI tools ───────────────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Quick tools</div>
                <h2 className="text-xl md:text-2xl font-bold">On-device AI · works offline</h2>
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

          {/* ── Weather ──────────────────────────────────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <WeatherForecast />
          </section>

          {/* ── Live prices ──────────────────────────────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">Live mandi prices</div>
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-300" /> What your pond is worth today
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
                  <Activity className="w-5 h-5 text-teal-300" /> Your farm log
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

          {/* ── Sign-up CTA ──────────────────────────────────────────────── */}
          <section className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-teal-300 mb-1 inline-flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified farmer account
              </div>
              <h2 className="text-xl md:text-2xl font-bold">Get your full farm dashboard</h2>
              <p className="text-sm text-foreground/55 mt-1 max-w-xl">
                Create a free account to save ponds, track batches, and get outbreak alerts for your district.
              </p>
            </div>
            <Link
              to="/signup"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-coral hover:bg-coral-hover text-coral-foreground font-semibold text-sm transition"
            >
              Sign up as Farmer <ArrowRight className="w-4 h-4" />
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
