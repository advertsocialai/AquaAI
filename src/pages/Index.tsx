import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementDialog } from '@/components/AnnouncementDialog';
import { WeatherTimeWidget } from '@/components/WeatherTimeWidget';
import {
  BuiltForRoles, Testimonials,
  MobileAppCta, FaqSection, FinalCta,
} from '@/components/aquaai-sections';
import CTA from '@/components/CTA';
import { Gallery4 } from '@/components/Gallery4';
import FeatureSection from '@/components/FeatureSection';
import { Feature108 } from '@/components/Feature108';
import {
  Fish, ArrowRight, PlayCircle, BrainCircuit, IndianRupee,
  ShoppingCart, Truck, LifeBuoy, Shield, Building2, Landmark,
} from 'lucide-react';

const MODULES = [
  { icon: BrainCircuit, key: 'diagnostics',  accent: '#a78bfa' },
  { icon: IndianRupee,  key: 'pricing',      accent: '#34d399' },
  { icon: ShoppingCart, key: 'marketplace',  accent: '#fb923c' },
  { icon: Truck,        key: 'logistics',    accent: '#f472b6' },
  { icon: LifeBuoy,     key: 'advisory',     accent: '#facc15' },
  { icon: Building2,    key: 'b2b',          accent: '#a78bfa' },
  { icon: Shield,       key: 'surveillance', accent: '#f87171' },
  { icon: Landmark,     key: 'risk',         accent: '#facc15' },
];

const Index = () => {
  const { t } = useTranslation();
  useEffect(() => { document.title = 'Aqua Rudra — Aquaculture Intelligence'; }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnnouncementDialog />
      <Header />

      {/* Hero */}
      <section className="relative min-h-[92svh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-background to-violet-500/10" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-300 text-sm tracking-widest uppercase mb-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Fish className="w-4 h-4" />
              {t('home.tagline')}
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {t('home.hero1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-ocean">
                {t('home.hero2')}
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-foreground/65 max-w-2xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {t('home.subtitle')}
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-coral hover:bg-coral-hover text-coral-foreground font-semibold text-base transition"
              >
                {t('home.ctaStart')} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/aquaai"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-border text-foreground/90 hover:bg-muted text-base transition"
              >
                <PlayCircle className="w-5 h-5" /> {t('home.ctaSee')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live time + weather */}
      <section className="border-t border-border py-10">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <WeatherTimeWidget />
        </div>
      </section>

      {/* Module highlights grid */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-14">
            <div className="text-sm text-teal-300 uppercase tracking-widest mb-4">{t('home.modulesHead')}</div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">{t('home.modulesTitle')}</h2>
            <p className="text-base md:text-lg text-foreground/65 max-w-2xl mx-auto mt-4 leading-relaxed">{t('home.modulesSub')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MODULES.map((m, i) => (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/aquaai#${m.key}`}
                  className="block h-full p-6 rounded-2xl border border-border bg-card hover:bg-muted hover:border-teal-400/40 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/50"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${m.accent}22`, border: `1px solid ${m.accent}55` }}
                  >
                    <m.icon className="w-6 h-6" style={{ color: m.accent }} />
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-2">{t(`modules.${m.key}`)}</div>
                  <p className="text-sm text-foreground/65 leading-relaxed">{t(`modules.${m.key}D`)}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BuiltForRoles />

      <Gallery4 />
      <Feature108 />
      <FeatureSection />

      <Testimonials />
      <CTA />
      <MobileAppCta />
      <FaqSection />
      <FinalCta />

      <Footer />
    </div>
  );
};

export default Index;
