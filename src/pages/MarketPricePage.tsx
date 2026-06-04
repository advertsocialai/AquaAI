import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MobileTopBar } from '@/components/mobile/MobileChrome';
import { MarketPriceBoard } from '@/components/market/MarketPriceBoard';

export default function MarketPricePage() {
  const [params] = useSearchParams();
  const initialTab: 'shrimp' | 'fish' = params.get('tab') === 'fish' ? 'fish' : 'shrimp';

  useEffect(() => { document.title = 'Market Price — Aqua Rudra'; }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <MobileTopBar title="Market Price" />
      <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 pb-28">
        <MarketPriceBoard initialTab={initialTab} />
      </main>
    </div>
  );
}
