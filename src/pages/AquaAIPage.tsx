import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  BuiltForRoles, Testimonials,
  MobileAppCta, FaqSection, FinalCta,
} from '@/components/aquaai-sections';
import { ServiceProviders } from '@/components/ServiceProviders';

// ── Main page ──────────────────────────────────────────────────────────────────

const AquaAIPage = () => {
  const { t } = useTranslation();
  useEffect(() => { document.title = "Aqua Rudra — Aquaculture Intelligence"; }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-background to-violet-500/10" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <motion.h1
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {t('aquaai_page.title1')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-ocean">
                {t('aquaai_page.title2')}
              </span>
              {t('aquaai_page.title3')}
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {t('aquaai_page.subtitle')}
            </motion.p>

          </div>
        </div>
      </section>

      <BuiltForRoles />

      <ServiceProviders />

      <Testimonials />
      <MobileAppCta />
      <FaqSection />
      <FinalCta />

      <Footer />
    </div>
  );
};

export default AquaAIPage;
