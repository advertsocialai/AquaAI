import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CalculatorsModule } from '@/components/dashboard/CalculatorsModule';

// Dedicated "Aqua Tools" dashboard — survival, feed/FCR, aeration, stocking and
// P&L calculators in one place. Linked from the home-page Aqua Tools card.
export default function AquaToolsPage() {
  const { t } = useTranslation();
  useEffect(() => { document.title = t('aquaToolsPage.documentTitle'); }, [t]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="text-sm uppercase tracking-widest text-teal-300 mb-2">{t('aquaToolsPage.eyebrow')}</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t('aquaToolsPage.heading')}</h1>
          <p className="text-sm md:text-base text-foreground/60 mb-8 max-w-2xl">
            {t('aquaToolsPage.intro')}
          </p>
          <CalculatorsModule />
        </div>
      </main>
      <Footer />
    </div>
  );
}
