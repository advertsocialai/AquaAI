import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, UserCheck, Factory, Truck, Snowflake, Briefcase, Landmark, ShieldCheck,
  Camera, Sparkles, Send, BadgeCheck, ArrowRight, ChevronDown,
  Star, Smartphone, QrCode, BookOpen, Apple, Play,
} from 'lucide-react';

// ─── Trust strip ──────────────────────────────────────────────────────────────

export function TrustStrip() {
  const items = [
    'MPEDA-aligned',
    'NSPAAD-compatible',
    'ICAR-CIBA validated',
    'OIE / WOAH standards',
    'DPDPA 2023 compliant',
    'PCR ground truth',
  ];
  return (
    <section className="py-10 border-t border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-[10px] uppercase tracking-widest text-white/30 text-center mb-5">
          Built to government, scientific and export standards
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
          {items.map((it) => (
            <div key={it} className="inline-flex items-center gap-1.5 text-sm text-white/55">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" /> {it}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Built-for roles ───────────────────────────────────────────────────────────

const ROLES = [
  { id: 'farmer',      label: 'Farmer',         icon: User,        accent: '#34d399', desc: 'Live pricing, crop calendar, marketplace, advisory.' },
  { id: 'vle',         label: 'VLE / Agent',    icon: UserCheck,   accent: '#38bdf8', desc: 'Diagnostic tools, farmer cluster, commissions.' },
  { id: 'hatchery',    label: 'Hatchery',       icon: Factory,     accent: '#a78bfa', desc: 'B2B portal, QC certs, dispatch + dispute panel.' },
  { id: 'transporter', label: 'Transporter',    icon: Truck,       accent: '#fb923c', desc: 'Load board, GPS tracking, cold-chain compliance.' },
  { id: 'supplier',    label: 'Ice / O₂',       icon: Snowflake,   accent: '#60a5fa', desc: 'Orders, delivery routing, capacity planning.' },
  { id: 'trader',      label: 'Trader',         icon: Briefcase,   accent: '#f472b6', desc: 'Bulk procurement, quality verification, export.' },
  { id: 'bank',        label: 'Bank / Insurer', icon: Landmark,    accent: '#facc15', desc: 'Farm risk scoring API, claims auto-verification.' },
  { id: 'govt',        label: 'MPEDA / Govt',   icon: ShieldCheck, accent: '#f87171', desc: 'Surveillance heatmap, NSPAAD sync, compliance.' },
];

export function BuiltForRoles() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="text-xs text-cyan-300 uppercase tracking-widest mb-3">Built for</div>
          <h2 className="text-3xl md:text-4xl font-bold">Everyone in aquaculture</h2>
          <p className="text-sm text-white/60 max-w-2xl mx-auto mt-3">
            Eight role-specific dashboards from the same data backbone. The farmer in West
            Godavari and the export trader in Vizag are looking at the same truth.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ROLES.map(({ id, label, icon: Icon, accent, desc }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                   style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}>
                <Icon className="w-5 h-5" style={{ color: accent }} />
              </div>
              <div className="text-sm font-semibold text-white mb-1">{label}</div>
              <div className="text-[11px] text-white/55 leading-relaxed">{desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ──────────────────────────────────────────────────────────────

const STEPS = [
  { n: '01', icon: Camera,    title: 'Capture',  desc: 'Photo on a ₹500 USB microscope or your phone camera. 3-frame burst with quality gate.' },
  { n: '02', icon: Sparkles,  title: 'Diagnose', desc: 'On-device TFLite AI runs in <500ms. EHP / WSSV / AHPND screen with confidence and Grad-CAM heatmap.' },
  { n: '03', icon: Send,      title: 'Decide',   desc: 'Composite QS score 0-100 + grade. Live mandi price tells you when to harvest or hold.' },
  { n: '04', icon: BadgeCheck,title: 'Certify',  desc: 'HMAC-signed QC certificate. QR code verifies at /verify/{id} — banks and buyers trust it.' },
];

export function HowItWorks() {
  return (
    <section className="py-20 border-t border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="text-xs text-cyan-300 uppercase tracking-widest mb-3">How it works</div>
          <h2 className="text-3xl md:text-4xl font-bold">From sample to certificate in 90 seconds</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="relative p-5 rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="text-5xl font-bold text-white/[0.06] absolute top-2 right-3 font-mono pointer-events-none">
                {n}
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-cyan-400/10 border border-cyan-400/20">
                <Icon className="w-5 h-5 text-cyan-300" />
              </div>
              <div className="text-lg font-bold text-white mb-2">{title}</div>
              <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: 'EHP wiped out my last crop. With Aqua AI I caught it on day 9 from a sample tray, restocked clean, and finished the cycle at 5.6 t/acre.',
    name: 'V. Ramana',
    role: 'Vannamei farmer · Bhimavaram, AP',
    metric: 'Crop loss · 18% → 4%',
  },
  {
    quote: 'Banks asked for a third-party QC certificate before sanctioning loans. The HMAC-signed PDF from Aqua AI cleared underwriting on the first review.',
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
  return (
    <section className="py-20 border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="text-xs text-cyan-300 uppercase tracking-widest mb-3">Field results</div>
          <h2 className="text-3xl md:text-4xl font-bold">What the platform is changing</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col"
            >
              <div className="flex items-center gap-1 text-amber-300 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-300" />
                ))}
              </div>
              <blockquote className="text-sm text-white/80 leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 pt-4 border-t border-white/5">
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-[11px] text-white/40">{t.role}</div>
                <div className="text-[11px] text-emerald-400 mt-1 font-mono">{t.metric}</div>
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
  return (
    <section className="py-24 border-t border-white/5 bg-gradient-to-br from-cyan-500/10 via-black to-violet-500/10">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-3">
            <div className="text-xs text-cyan-300 uppercase tracking-widest mb-3">On your phone</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Carry the platform to the pond.
            </h2>
            <p className="text-base text-white/60 mb-8 max-w-xl leading-relaxed">
              The Aqua AI Android app works fully offline on a ₹8,000 phone. Sync when you have
              signal. All 5 AI models on-device. 6 Indian languages. iOS coming soon.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-black hover:bg-white/90 transition"
              >
                <Play className="w-5 h-5" />
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[10px] uppercase opacity-60">Get it on</span>
                  <span className="text-sm font-bold">Google Play</span>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-black hover:bg-white/90 transition"
              >
                <Apple className="w-5 h-5" />
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[10px] uppercase opacity-60">Coming on</span>
                  <span className="text-sm font-bold">App Store</span>
                </div>
              </a>
              <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/15 text-white/80 hover:bg-white/[0.06] text-sm">
                <QrCode className="w-4 h-4" /> Scan QR
              </button>
            </div>
          </div>
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative w-56 h-[460px] rounded-[2.5rem] border-[10px] border-white/10 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 overflow-hidden shadow-2xl shadow-cyan-500/20">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-black/80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <Smartphone className="w-10 h-10 text-cyan-300 mb-4" />
                <div className="text-sm font-bold text-white mb-1">Aqua AI</div>
                <div className="text-[11px] text-white/50 mb-6">Tap to count PLs</div>
                <div className="w-full p-3 rounded-xl bg-white/[0.06] border border-white/10 mb-2">
                  <div className="text-[10px] text-white/40 uppercase tracking-widest">Count</div>
                  <div className="text-2xl font-bold text-white tabular-nums">2,847</div>
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
  { q: 'Does Aqua AI work without internet?',
    a: 'Yes. All five diagnostic models run on-device via TFLite. The Android app stores results in encrypted SQLite and syncs opportunistically when signal returns.' },
  { q: 'How accurate is the EHP detection vs a PCR lab?',
    a: 'Sensitivity > 92%, specificity > 88%, AUC-ROC > 0.95 against PCR-confirmed test sets curated with ICAR-CIBA. Every positive result is shown with Grad-CAM heatmaps so a vet can audit the decision.' },
  { q: 'What hardware does a VLE need?',
    a: 'A ₹8,000+ Android phone, a ₹1,500 USB pen microscope with LED ring, and a white counting tray. Bundle kits run ₹3,000-9,150 in the marketplace.' },
  { q: 'Can banks rely on the QC certificate?',
    a: 'Yes. Every certificate is HMAC-SHA256 signed over the cert ID, batch, score, disease status and timestamp. The signature is verifiable at the public /verify/{certId} endpoint with a QR scan.' },
  { q: 'Which languages does the platform support?',
    a: 'English, Telugu, Tamil, Hindi, Odia, Bengali. The voice assistant speaks the reply back to you in your chosen language using your browser or phone\'s built-in speech engine.' },
  { q: 'How does pricing work for hatcheries and banks?',
    a: 'Hatchery SaaS is ₹15k/month per facility. Bank API access for farm-risk scoring is ₹50/farm/month. Farmers pay nothing for core features — VLEs earn a commission on diagnostic services.' },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-10">
          <div className="text-xs text-cyan-300 uppercase tracking-widest mb-3">FAQ</div>
          <h2 className="text-3xl md:text-4xl font-bold">Things people ask</h2>
        </div>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div
              key={item.q}
              className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left"
              >
                <span className="text-sm md:text-base font-medium text-white">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-white/40 shrink-0 transition-transform ${open === i ? 'rotate-180 text-cyan-400' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-white/5"
                  >
                    <p className="text-sm text-white/65 leading-relaxed p-4">{item.a}</p>
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
  return (
    <section className="py-24 border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Get started in 5 minutes</h2>
        <p className="text-base text-white/60 mb-8 max-w-xl mx-auto">
          Create an account, pick your role, complete KYC, and you're in the dashboard.
          Free for farmers — paid tiers for hatcheries, banks, traders and government bodies.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-sm"
          >
            Create account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-white/85 hover:bg-white/[0.06] text-sm"
          >
            Sign in
          </Link>
          <Link
            to="/knowledge"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white/55 hover:text-white text-sm"
          >
            <BookOpen className="w-4 h-4" /> Read articles first
          </Link>
        </div>
      </div>
    </section>
  );
}
