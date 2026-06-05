import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bookmark } from 'lucide-react';
import { MobileBackBar } from '@/components/mobile/MobileChrome';

export default function FavouritesPage() {
  const { t } = useTranslation();
  useEffect(() => { document.title = t('favouritesPage.documentTitle'); }, [t]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <MobileBackBar title={t('favouritesPage.backBarTitle')} />

      <main className="max-w-md mx-auto px-5 pt-16 pb-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-rose-50 grid place-items-center">
          <Bookmark className="w-9 h-9 text-rose-500" />
        </div>
        <h2 className="mt-6 text-xl font-bold">{t('favouritesPage.emptyTitle')}</h2>
        <p className="mt-2 text-neutral-500 max-w-xs">
          {t('favouritesPage.emptyDescription')}
        </p>
        <Link
          to="/shop"
          className="mt-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold px-6 py-3 active:scale-[0.99] transition"
        >
          {t('favouritesPage.browseProducts')}
        </Link>
      </main>
    </div>
  );
}
