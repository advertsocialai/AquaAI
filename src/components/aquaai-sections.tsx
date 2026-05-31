import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Factory, Truck, Snowflake, Briefcase,
  ArrowRight, ChevronDown,
  Star, Smartphone, QrCode, BookOpen, Apple, Play,
} from 'lucide-react';

// ─── Built-for roles ───────────────────────────────────────────────────────────

const MAIN_ROLES = [
  { id: 'farmer', icon: User,      accent: '#34d399' },
  { id: 'trader', icon: Briefcase, accent: '#f472b6' },
];

const SERVICE_ROLES = [
  { id: 'transporter', icon: Truck,     accent: '#fb923c' },
  { id: 'ice',         icon: Snowflake, accent: '#60a5fa' },
  { id: 'oxygen',      icon: Factory,   accent: '#a78bfa' },
  { id: 'resources',   icon: BookOpen,  accent: '#facc15' },
];

type RoleCard = { id: string; icon: React.ElementType; accent: string };

function RoleGrid({ items, cols }: { items: RoleCard[]; cols: string }) {
  const { t } = useTranslation();
  return (
    <div className={`grid gap-5 max-w-4xl mx-auto ${cols}`}>
      {items.map(({ id, icon: Icon, accent }, i) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
          className="p-6 rounded-2xl border border-border bg-card hover:bg-muted transition"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
          >
            <Icon className="w-6 h-6" style={{ color: accent }} />
          </div>
          <div className="text-base font-semibold text-foreground mb-2">{t(`roles.${id}`)}</div>
          <div className="text-sm text-foreground/65 leading-relaxed">{t(`roleDesc.${id}`)}</div>
        </motion.div>
      ))}
    </div>
  );
}

export function BuiltForRoles() {
  const { t } = useTranslation();
  return (
    <section className="py-24 border-t border-border">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-14">
          <div className="text-sm text-teal-300 uppercase tracking-widest mb-4">{t('builtFor.head')}</div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">{t('builtFor.title')}</h2>
          <p className="text-base md:text-lg text-foreground/65 max-w-2xl mx-auto mt-4 leading-relaxed">{t('builtFor.sub')}</p>
        </div>

        <RoleGrid items={MAIN_ROLES} cols="sm:grid-cols-2 max-w-2xl" />

        <div className="mt-20">
          <div className="text-center mb-10">
            <div className="text-sm text-teal-300 uppercase tracking-widest mb-3">{t('aquaServices.head')}</div>
            <h3 className="text-2xl md:text-3xl font-bold leading-tight">{t('aquaServices.title')}</h3>
          </div>
          <RoleGrid items={SERVICE_ROLES} cols="sm:grid-cols-2 md:grid-cols-4" />
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: 'EHP wiped out my last crop. With Aqua Rudra I caught it on day 9 from a sample tray, restocked clean, and finished the cycle at 5.6 t/acre.',
    name: 'V. Ramana',
    role: 'Vannamei farmer · Bhimavaram, AP',
    metric: 'Crop loss · 18% → 4%',
  },
  {
    quote: 'Banks asked for a third-party QC certificate before sanctioning loans. The HMAC-signed PDF from Aqua Rudra cleared underwriting on the first review.',
    name: 'K. Srinivasan',
    role: 'Hatchery operator · Nellore, AP',
    metric: '5 lakh PLs · A++ tier',
  },
  {
    quote: 'Surveillance from one platform — NSPAAD reports auto-sync, district outbreak map updates daily. We cut response time on a Krishna EHP cluster by 4 days.',
    name: 'Dr. R. Patel',
    role: 'MPEDA officer · AP coastal zone',
    metric: '342 reports filed · Q1 2026',
  },
];

export function Testimonials() {
  const { t } = useTranslation();
  return (
    <section className="py-24 border-t border-border">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-14">
          <div className="text-sm text-teal-300 uppercase tracking-widest mb-4">{t('testimonials.head')}</div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">{t('testimonials.title')}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-7 rounded-2xl border border-border bg-card flex flex-col"
            >
              <div className="flex items-center gap-1 text-amber-300 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-300" />
                ))}
              </div>
              <blockquote className="text-base text-foreground/85 leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border">
                <div className="text-base font-semibold text-foreground">{t.name}</div>
                <div className="text-sm text-foreground/50">{t.role}</div>
                <div className="text-sm text-emerald-400 mt-1 font-mono">{t.metric}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Mobile app CTA ────────────────────────────────────────────────────────────

export function MobileAppCta() {
  const { t } = useTranslation();
  return (
    <section id="download-app" className="py-24 border-t border-border bg-gradient-to-br from-teal-500/10 via-background to-violet-500/10 scroll-mt-24">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-3">
            <div className="text-sm text-teal-300 uppercase tracking-widest mb-4">{t('mobileApp.head')}</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">{t('mobileApp.title')}</h2>
            <p className="text-base md:text-lg text-foreground/70 mb-8 max-w-xl leading-relaxed">{t('mobileApp.body')}</p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-black hover:bg-muted transition"
              >
                <Play className="w-5 h-5" />
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[10px] uppercase opacity-60">Get it on</span>
                  <span className="text-sm font-bold">Google Play</span>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-black hover:bg-muted transition"
              >
                <Apple className="w-5 h-5" />
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[10px] uppercase opacity-60">Coming on</span>
                  <span className="text-sm font-bold">App Store</span>
                </div>
              </a>
              <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-foreground/80 hover:bg-muted text-sm">
                <QrCode className="w-4 h-4" /> Scan QR
              </button>
            </div>
          </div>
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative w-56 h-[460px] rounded-[2.5rem] border-[10px] border-border bg-gradient-to-br from-teal-500/10 to-violet-500/10 overflow-hidden shadow-2xl shadow-teal-500/20">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-black/80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <Smartphone className="w-10 h-10 text-teal-300 mb-4" />
                <div className="text-sm font-bold text-foreground mb-1">Aqua Rudra</div>
                <div className="text-[11px] text-foreground/50 mb-6">Tap to count PLs</div>
                <div className="w-full p-3 rounded-xl bg-card border border-border mb-2">
                  <div className="text-[10px] text-foreground/40 uppercase tracking-widest">Count</div>
                  <div className="text-2xl font-bold text-foreground tabular-nums">2,847</div>
                  <div className="text-[10px] text-emerald-400">PL-12 · clean tray</div>
                </div>
                <div className="w-full p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/30">
                  <div className="text-[10px] text-emerald-300 uppercase tracking-widest">EHP</div>
                  <div className="text-sm font-bold text-emerald-200">CLEAR · 94% conf.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────────

const FAQ = [
  { q: 'Does Aqua Rudra work without internet?',
    a: 'Yes. All five diagnostic models run on-device via TFLite. The Android app stores results in encrypted SQLite and syncs opportunistically when signal returns.' },
  { q: 'How accurate is the EHP detection vs a PCR lab?',
    a: 'Sensitivity > 92%, specificity > 88%, AUC-ROC > 0.95 against PCR-confirmed test sets curated with ICAR-CIBA. Every positive result is shown with Grad-CAM heatmaps so a vet can audit the decision.' },
  { q: 'What hardware does a VLE need?',
    a: 'A ₹8,000+ Android phone, a ₹1,500 USB pen microscope with LED ring, and a white counting tray. Bundle kits run ₹3,000-9,150 in the marketplace.' },
  { q: 'Can banks rely on the QC certificate?',
    a: 'Yes. Every certificate is HMAC-SHA256 signed over the cert ID, batch, score, disease status and timestamp. The signature is verifiable at the public /verify/{certId} endpoint with a QR scan.' },
  { q: 'Which languages does the platform support?',
    a: 'English, Telugu, Hindi, Odia, Bengali. The voice assistant speaks the reply back to you in your chosen language using your browser or phone\'s built-in speech engine.' },
  { q: 'How does pricing work for hatcheries and banks?',
    a: 'Hatchery SaaS is ₹15k/month per facility. Bank API access for farm-risk scoring is ₹50/farm/month. Farmers pay nothing for core features — VLEs earn a commission on diagnostic services.' },
];

export function FaqSection() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 border-t border-border">
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <div className="text-sm text-teal-300 uppercase tracking-widest mb-4">{t('faq.head')}</div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">{t('faq.title')}</h2>
        </div>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div
              key={item.q}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-base md:text-lg font-medium text-foreground">{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-foreground/40 shrink-0 transition-transform ${open === i ? 'rotate-180 text-teal-400' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <p className="text-base text-foreground/70 leading-relaxed p-5">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ─────────────────────────────────────────────────────────────────

export function FinalCta() {
  const { t } = useTranslation();
  return (
    <section className="py-28 border-t border-border">
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">{t('finalCta.title')}</h2>
        <p className="text-base md:text-lg text-foreground/70 mb-10 max-w-xl mx-auto leading-relaxed">{t('finalCta.body')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-black font-semibold text-base"
          >
            {t('finalCta.createAccount')} <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-foreground/85 hover:bg-muted text-base"
          >
            {t('common.signIn')}
          </Link>
          <Link
            to="/knowledge"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-foreground/60 hover:text-foreground text-base"
          >
            <BookOpen className="w-5 h-5" /> {t('finalCta.readArticles')}
          </Link>
        </div>
      </div>
    </section>
  );
}
