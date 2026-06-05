import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MobileBackBar } from '@/components/mobile/MobileChrome';
import { ShopBoard } from '@/components/shop/ShopBoard';

export default function ShopPage() {
  const { t } = useTranslation();
  useEffect(() => { document.title = t('shopPage.documentTitle'); }, [t]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <MobileBackBar title={t('shopPage.backBarTitle')} />
      <main className="max-w-md mx-auto px-5 pt-5 pb-16">
        <ShopBoard />
      </main>
    </div>
  );
}
