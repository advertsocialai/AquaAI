import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  TrustStrip, BuiltForRoles, HowItWorks, Testimonials,
  MobileAppCta, FaqSection, FinalCta,
} from '@/components/aquaai-sections';
import {
  Fish, ArrowRight, PlayCircle, BrainCircuit, IndianRupee,
  ShoppingCart, Truck, LifeBuoy, Shield, Building2, Landmark,
  Languages, WifiOff, Sparkles,
} from 'lucide-react';

const MODULE_HIGHLIGHTS = [
  { icon: BrainCircuit,  title: 'AI Diagnostics',  desc: 'PCR-grade EHP / WSSV / AHPND detection in 30 seconds. On-device TFLite.', accent: '#a78bfa' },
  { icon: IndianRupee,   title: 'Live Pricing',    desc: 'Live mandi + export FOB rates across 31+ species and 9 coastal states.', accent: '#34d399' },
  { icon: ShoppingCart,  title: 'Marketplace',     desc: 'KYC-verified seed, feed, aeration, ice, diagnostic kit suppliers.',     accent: '#fb923c' },
  { icon: Truck,         title: 'Logistics',       desc: 'Load matching, GPS tracking, cold-chain compliance, e-way bills.',      accent: '#f472b6' },
  { icon: LifeBuoy,      title: 'Crop Advisory',   desc: 'Crop calendar, alerts within 5 km, voice assistant in 6 languages.',     accent: '#facc15' },
  { icon: Building2,     title: 'B2B Portal',      desc: 'Hatchery dispatch, dispute resolution, HMAC-signed QC certs + QR.',     accent: '#a78bfa' },
  { icon: Shield,        title: 'Surveillance',    desc: 'MPEDA / NSPAAD outbreak heatmap, compliance dashboard for officers.',    accent: '#f87171' },
  { icon: Landmark,      title: 'Risk Scoring',    desc: 'Farm-risk Band A-D API for bank underwriting + insurance claims.',      accent: '#facc15' },
];

const Index = () => {
  useEffect(() => { document.title = 'Aqua AI — Aquaculture Intelligence'; }, []);

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[92svh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/15 via-black to-[#a78bfa]/15" />
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/15 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-xs tracking-widest uppercase mb-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Fish className="w-3.5 h-3.5" />
              India's Aquaculture Intelligence Platform
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Decoding aquaculture,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400">
                one pond at a time.
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/65 max-w-2xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              PCR-grade AI diagnostics. Live mandi pricing. Verified marketplace. Logistics.
              Crop advisory. Government surveillance. In 6 Indian languages — on a ₹8,000
              Android phone, fully offline.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-sm transition"
              >
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/aquaai"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 text-white/90 hover:bg-white/[0.06] text-sm transition"
              >
                <PlayCircle className="w-4 h-4" /> See the platform
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="inline-flex items-center gap-1.5">
                <WifiOff className="w-3 h-3 text-emerald-400" /> Works fully offline
              </span>
              <span className="text-white/15">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Languages className="w-3 h-3 text-violet-400" /> Telugu · Tamil · Hindi · Odia · Bengali · English
              </span>
              <span className="text-white/15">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Free for farmers
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Module highlights grid */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="text-xs text-cyan-300 uppercase tracking-widest mb-3">One platform</div>
            <h2 className="text-3xl md:text-5xl font-bold">Everything from pond to port</h2>
            <p className="text-sm text-white/60 max-w-2xl mx-auto mt-3">
              Eight modules connect every stakeholder in Indian aquaculture — from the farmer
              with a basic Android in West Godavari to the bank officer underwriting their loan
              in Mumbai.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MODULE_HIGHLIGHTS.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${m.accent}22`, border: `1px solid ${m.accent}55` }}
                >
                  <m.icon className="w-5 h-5" style={{ color: m.accent }} />
                </div>
                <div className="text-base font-semibold text-white mb-2">{m.title}</div>
                <p className="text-xs text-white/55 leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/aquaai"
              className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
            >
              Explore all 14 modules <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <BuiltForRoles />
      <HowItWorks />

      {/* Numbers */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'AI Models',       value: '5',      sub: 'On-device TFLite' },
              { label: 'Diseases',        value: '6',      sub: 'EHP · WSSV · AHPND +3' },
              { label: 'Inference time',  value: '<500ms', sub: 'Mid-range Android' },
              { label: 'PCR agreement',   value: '92%+',   sub: 'Sensitivity vs lab' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] text-center md:text-left"
              >
                <div className="text-4xl md:text-5xl font-bold text-white tabular-nums mb-1">{s.value}</div>
                <div className="text-sm text-white/60">{s.label}</div>
                <div className="text-[11px] text-white/30 mt-1">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <MobileAppCta />
      <FaqSection />
      <FinalCta />

      <Footer />
    </div>
  );
};

export default Index;
