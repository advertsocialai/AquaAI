import { useEffect } from 'react';
import { MobileBackBar } from '@/components/mobile/MobileChrome';
import { ShopBoard } from '@/components/shop/ShopBoard';

export default function ShopPage() {
  useEffect(() => { document.title = 'Aqua Products — Aqua Rudra'; }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <MobileBackBar title="Aqua Products" />
      <main className="max-w-md mx-auto px-5 pt-5 pb-16">
        <ShopBoard />
      </main>
    </div>
  );
}
