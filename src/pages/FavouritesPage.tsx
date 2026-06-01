import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { MobileBackBar } from '@/components/mobile/MobileChrome';

export default function FavouritesPage() {
  useEffect(() => { document.title = 'My Favourites — Aqua Rudra'; }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <MobileBackBar title="My Favourites" />

      <main className="max-w-md mx-auto px-5 pt-16 pb-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-rose-50 grid place-items-center">
          <Bookmark className="w-9 h-9 text-rose-500" />
        </div>
        <h2 className="mt-6 text-xl font-bold">No favourites yet</h2>
        <p className="mt-2 text-neutral-500 max-w-xs">
          Save products and articles you like and they&rsquo;ll show up here for quick access.
        </p>
        <Link
          to="/shop"
          className="mt-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold px-6 py-3 active:scale-[0.99] transition"
        >
          Browse Aqua Products
        </Link>
      </main>
    </div>
  );
}
