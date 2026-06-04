import { useEffect, type ElementType } from 'react';
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
import { Feature108 } from '@/components/Feature108';
import { ServiceProviders } from '@/components/ServiceProviders';
import {
  ArrowRight, PlayCircle, IndianRupee,
  Truck, LifeBuoy, Fish, Calculator,
} from 'lucide-react';

// Inline shrimp glyph (lucide has no shrimp icon).
function ShrimpIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 7c-3 0-4 2-7 2H7a4 4 0 0 0 0 8h6c4 0 6-3 6-6" />
      <path d="M7 17c-2 0-4-1-4-3" />
      <path d="M19 7c1-1 1-3 0-4" />
      <circle cx="16" cy="10" r="0.6" fill="currentColor" />
    </svg>
  );
}

const MODULES: { icon: ElementType; key: string; accent: string; to?: string; label?: string; desc?: string }[] = [
  { icon: IndianRupee,  key: 'pricing',      accent: '#34d399', to: '/rates' },
  { icon: Truck,        key: 'logistics',    accent: '#f472b6', to: '/logistics' },
  { icon: LifeBuoy,     key: 'advisory',     accent: '#facc15' },
  { icon: Calculator,   key: 'tools',        accent: '#0ea5e9', to: '/tools',
    label: 'Aqua Tools', desc: 'Survival rate, feed/FCR and stocking calculators for every pond.' },
];

const Index = () => {
  const { t } = useTranslation();
  useEffect(() => { document.title = 'Aqua Rudra — Aquaculture Intelligence'; }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnnouncementDialog />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 md:pt-28 pb-12 md:pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-background to-violet-500/10" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
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
                  to={m.to ?? `/aquaai#${m.key}`}
                  className="block h-full p-6 rounded-2xl border border-border bg-card hover:bg-muted hover:border-teal-400/40 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/50"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${m.accent}22`, border: `1px solid ${m.accent}55` }}
                  >
                    <m.icon className="w-6 h-6" style={{ color: m.accent }} />
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-2">{t(`modules.${m.key}`, m.label ? { defaultValue: m.label } : undefined)}</div>
                  <p className="text-sm text-foreground/65 leading-relaxed">{t(`modules.${m.key}D`, m.desc ? { defaultValue: m.desc } : undefined)}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BuiltForRoles />

      <ServiceProviders />

      <Gallery4 />
      <Feature108 />

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
