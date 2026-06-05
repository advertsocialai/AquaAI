import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth';
import { MobileTopBar, MobileTabBar } from '@/components/mobile/MobileChrome';
import { MarketPriceBoard } from '@/components/market/MarketPriceBoard';
import { CalculatorsModule } from '@/components/dashboard/CalculatorsModule';
import { ShopBoard } from '@/components/shop/ShopBoard';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-medium text-neutral-700 mb-3">{children}</h2>;
}

export default function HomePage() {
  const { t } = useTranslation();
  useEffect(() => { document.title = 'Home — Aqua Rudra'; }, []);
  const { user } = useAuth();
  const kycDone = Boolean(user?.user_metadata?.kyc_ref);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <MobileTopBar title={t('homePage.topBarTitle')} />

      <main className="max-w-md mx-auto px-5 pt-5 pb-28 space-y-8">
        {/* KYC banner */}
        {!kycDone && (
          <div className="rounded-2xl p-5 bg-gradient-to-br from-sky-500 to-teal-400 text-white shadow-sm">
            <h2 className="text-xl font-bold">{t('homePage.kycTitle')}</h2>
            <p className="mt-1 text-white/90">{t('homePage.kycSubtitle')}</p>
            <Link
              to="/kyc"
              className="mt-4 block text-center rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold py-4 text-lg active:scale-[0.99] transition"
            >
              {t('homePage.kycButton')}
            </Link>
          </div>
        )}

        {/* Live Rates dashboard */}
        <section>
          <SectionTitle>{t('homePage.liveRatesTitle')}</SectionTitle>
          <div className="rounded-2xl bg-white border border-neutral-200 p-4 overflow-hidden">
            <MarketPriceBoard />
          </div>
        </section>

        {/* Aqua Tools dashboard */}
        <section>
          <SectionTitle>{t('homePage.aquaToolsTitle')}</SectionTitle>
          <div className="rounded-2xl bg-white border border-neutral-200 p-4">
            <CalculatorsModule />
          </div>
        </section>

        {/* Shop Farm dashboard */}
        <section>
          <SectionTitle>{t('homePage.shopFarmTitle')}</SectionTitle>
          <div className="rounded-2xl bg-white border border-neutral-200 p-4">
            <ShopBoard />
          </div>
        </section>

        {/* Know about diseases */}
        <section>
          <SectionTitle>{t('homePage.diseasesSectionTitle')}</SectionTitle>
          <div className="rounded-2xl p-6 bg-white border border-neutral-200 shadow-sm">
            <h3 className="text-xl font-bold">{t('homePage.diseaseMapTitle')}</h3>
            <p className="mt-2 text-neutral-700 leading-snug">
              {t('homePage.diseaseMapDescription')}
            </p>
            <Link
              to="/aquaai#dashboard"
              className="mt-5 block text-center rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold py-4 text-lg active:scale-[0.99] transition"
            >
              {t('homePage.diseaseScanButton')}
            </Link>
          </div>
        </section>
      </main>

      <MobileTabBar active="home" />
    </div>
  );
}
