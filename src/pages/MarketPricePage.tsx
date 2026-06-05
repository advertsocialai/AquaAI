import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MobileTopBar } from '@/components/mobile/MobileChrome';
import { MarketPriceBoard } from '@/components/market/MarketPriceBoard';

export default function MarketPricePage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const initialTab: 'shrimp' | 'fish' = params.get('tab') === 'fish' ? 'fish' : 'shrimp';

  useEffect(() => { document.title = t('marketPricePage.documentTitle'); }, [t]);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <MobileTopBar title={t('marketPricePage.topBarTitle')} />
      <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 pb-28">
        <MarketPriceBoard initialTab={initialTab} />
      </main>
    </div>
  );
}
