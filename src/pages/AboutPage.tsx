import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Leaf, Lightbulb, BarChart3, Heart, Wrench, MessageCircleQuestion,
  Layers, ShieldCheck, Sparkles, ArrowRight, Languages, MapPin,
} from 'lucide-react';

const IMPACT = [
  { icon: Leaf,       key: 'impact0' },
  { icon: Lightbulb,  key: 'impact1' },
  { icon: BarChart3,  key: 'impact2' },
  { icon: Heart,      key: 'impact3' },
  { icon: Wrench,     key: 'impact4' },
  { icon: MessageCircleQuestion, key: 'impact5' },
];

const CHALLENGES = [
  { key: 'challenge0' },
  { key: 'challenge1' },
  { key: 'challenge2' },
  { key: 'challenge3' },
];

export default function AboutPage() {
  const { t } = useTranslation();
  useEffect(() => { document.title = t('aboutPage.documentTitle'); }, [t]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-background to-violet-500/10" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-300 text-xs tracking-widest uppercase mb-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          >
            {t('aboutPage.heroBadge')}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('aboutPage.heroTitleLine1')}<br />{t('aboutPage.heroTitleLine2')}</h1>
          <p className="text-base text-foreground/60 max-w-3xl mx-auto leading-relaxed">
            {t('aboutPage.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <p className="text-base text-foreground/70 leading-relaxed mb-4">
            {t('aboutPage.missionPara1')}
          </p>
          <p className="text-base text-foreground/70 leading-relaxed">
            {t('aboutPage.missionPara2')}
          </p>
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-20 border-t border-border bg-card">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-xs text-teal-300 uppercase tracking-widest mb-3">{t('aboutPage.impactEyebrow')}</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t('aboutPage.impactTitle')}</h2>
            <p className="text-sm text-foreground/60 max-w-2xl mx-auto">
              {t('aboutPage.impactSubtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {IMPACT.map(({ icon: Icon, key }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card"
              >
                <div className="p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20 shrink-0">
                  <Icon className="w-5 h-5 text-emerald-300" />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{t(`aboutPage.${key}`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-xs text-teal-300 uppercase tracking-widest mb-3">{t('aboutPage.solveEyebrow')}</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t('aboutPage.solveTitle')}</h2>
            <p className="text-sm text-foreground/60 max-w-2xl mx-auto">
              {t('aboutPage.solveSubtitle')}
            </p>
          </div>

          <div className="relative">
            {/* center spine */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-card -translate-x-1/2" />
            <div className="space-y-10">
              {CHALLENGES.map((c, i) => (
                <motion.div
                  key={c.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="grid md:grid-cols-2 gap-6 items-center relative"
                >
                  <div className="md:text-right">
                    <div className="text-[11px] uppercase tracking-widest text-red-300 mb-2">{t('aboutPage.challengeLabel')}</div>
                    <div className="text-lg font-bold text-foreground mb-2">{t(`aboutPage.${c.key}Challenge`)}</div>
                    <p className="text-sm text-foreground/60 leading-relaxed">{t(`aboutPage.${c.key}ChallengeBody`)}</p>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-400 ring-4 ring-teal-400/20" />
                  <div className="md:pl-6">
                    <div className="text-[11px] uppercase tracking-widest text-emerald-300 mb-2">{t('aboutPage.solutionLabel')}</div>
                    <div className="text-lg font-bold text-foreground mb-2">{t(`aboutPage.${c.key}Solution`)}</div>
                    <p className="text-sm text-foreground/60 leading-relaxed">{t(`aboutPage.${c.key}SolutionBody`)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Breaking Barriers — multilingual */}
      <section className="py-20 border-t border-border bg-card">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <div className="text-xs text-teal-300 uppercase tracking-widest mb-3">
            {t('aboutPage.barriersEyebrow')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('aboutPage.barriersTitle')}</h2>
          <p className="text-base text-foreground/70 leading-relaxed mb-4">
            {t('aboutPage.barriersPara1')}
          </p>
          <p className="text-base text-foreground/70 leading-relaxed mb-8">
            {t('aboutPage.barriersPara2')}
          </p>
          <div className="inline-flex flex-wrap items-center gap-2 justify-center">
            {['English', 'తెలుగు', 'தமிழ்', 'हिन्दी', 'ଓଡ଼ିଆ', 'বাংলা'].map((lang) => (
              <span key={lang} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-sm text-foreground/80">
                <Languages className="w-3 h-3 text-teal-400" /> {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">{t('aboutPage.ctaTitle')}</h2>
          <p className="text-foreground/60 mb-8">
            {t('aboutPage.ctaSubtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-semibold text-sm"
            >
              {t('aboutPage.ctaGetStarted')} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground/80 hover:bg-muted text-sm"
            >
              {t('aboutPage.ctaContact')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
