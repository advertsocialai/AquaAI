import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ArrowRight, MapPin, Calendar, TrendingUp, Activity, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LivePriceTicker } from '@/components/dashboard/LivePriceTicker';
import { ROLE_DASHBOARDS } from './configs';
import type { Role } from '@/components/dashboard/RoleSelector';

const tone = {
  urgent:  { bar: 'border-rose-400/40',  icon: 'text-rose-300',  chip: 'bg-rose-400/10' },
  warning: { bar: 'border-amber-400/40', icon: 'text-amber-300', chip: 'bg-amber-400/10' },
  info:    { bar: 'border-teal-400/40',  icon: 'text-teal-300',  chip: 'bg-teal-400/10' },
};

export function RoleDashboard({ role }: { role: Role }) {
  const { t } = useTranslation();
  const config = ROLE_DASHBOARDS[role];
  useEffect(() => { if (config) document.title = config.title; }, [config]);

  const [greetingTime] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  });
  const greeting =
    greetingTime === 'morning'
      ? t('roleDashboard.goodMorning')
      : greetingTime === 'afternoon'
      ? t('roleDashboard.goodAfternoon')
      : t('roleDashboard.goodEvening');

  if (!config) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl space-y-10">

          {/* ── Greeting + summary ─────────────────────────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-2">{greeting}, {config.greetingName}</div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {config.headlineLead} ·{' '}
                  <span className="text-foreground/60 font-normal">{config.headlineSub}</span>
                </h1>
                <div className="flex items-center gap-2 text-sm text-foreground/55 mt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{config.region}</span>
                  <span className="text-foreground/20">·</span>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 lg:text-right">
                {config.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{m.value}</div>
                    <div className="text-[11px] uppercase tracking-widest text-foreground/40 mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Today's actions ──────────────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">{t('roleDashboard.todayEyebrow')}</div>
                <h2 className="text-xl md:text-2xl font-bold">{t('roleDashboard.attentionHeading')}</h2>
              </div>
              <Bell className="w-5 h-5 text-teal-300" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {config.actions.map((a, i) => {
                const tn = tone[a.kind];
                return (
                  <motion.div
                    key={a.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-5 rounded-2xl border bg-card ${tn.bar}`}
                  >
                    <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3 ${tn.chip}`}>
                      <Bell className={`w-4 h-4 ${tn.icon}`} />
                    </div>
                    <div className="text-sm font-semibold text-foreground leading-snug mb-1">{a.title}</div>
                    <div className="text-xs text-foreground/50">{a.meta}</div>
                    <Link to={a.to} className={`inline-flex items-center gap-1 mt-3 text-xs ${tn.icon} hover:underline`}>
                      {t('roleDashboard.open')} <ArrowRight className="w-3 h-3" />
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
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">{t('roleDashboard.quickToolsEyebrow')}</div>
                <h2 className="text-xl md:text-2xl font-bold">{config.toolsHeading}</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {config.tools.map((tool) => (
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

          {/* ── Live prices (optional) ───────────────────────────────────── */}
          {config.showPrices && (
            <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">{t('roleDashboard.livePricesEyebrow')}</div>
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-300" /> {config.pricesHeading}
                  </h2>
                </div>
              </div>
              <LivePriceTicker />
            </section>
          )}

          {/* ── Recent activity ──────────────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-teal-300 mb-1">{t('roleDashboard.recentActivityEyebrow')}</div>
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-300" /> {config.activityHeading}
                </h2>
              </div>
              <Link to="/aquaai#dashboard" className="text-xs text-teal-300 hover:underline inline-flex items-center gap-1">
                {t('roleDashboard.fullHistory')} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-card divide-y divide-border">
              {config.activity.map((row, i) => (
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
                    {row.status === 'alert' ? t('roleDashboard.statusAction') : t('roleDashboard.statusOk')}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Sign-up CTA ──────────────────────────────────────────────── */}
          <section className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-teal-300 mb-1 inline-flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> {config.cta.eyebrow}
              </div>
              <h2 className="text-xl md:text-2xl font-bold">{config.cta.heading}</h2>
              <p className="text-sm text-foreground/55 mt-1 max-w-xl">{config.cta.body}</p>
            </div>
            <Link
              to="/signup"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-coral hover:bg-coral-hover text-coral-foreground font-semibold text-sm transition"
            >
              {config.cta.label} <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default RoleDashboard;
