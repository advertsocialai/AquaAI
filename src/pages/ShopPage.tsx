import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { MobileBackBar } from '@/components/mobile/MobileChrome';
import { ProductImage } from '@/components/shop/ProductImage';
import { AQUA_PRODUCTS } from '@/data/aquaProducts';

export default function ShopPage() {
  useEffect(() => { document.title = 'Aqua Products — Aqua Rudra'; }, []);
  const [query, setQuery] = useState('');

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AQUA_PRODUCTS;
    return AQUA_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.purpose.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <MobileBackBar title="Aqua Products" />

      <main className="max-w-md mx-auto px-5 pt-5 pb-16">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name"
            aria-label="Search by product name"
            className="w-full rounded-2xl border border-neutral-200 bg-white py-4 pl-12 pr-4 text-lg placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
          />
        </div>

        <h2 className="mt-6 mb-4 text-base font-medium text-neutral-700">
          {query.trim() ? `Results (${products.length})` : 'All Products'}
        </h2>

        {products.length === 0 ? (
          <p className="py-16 text-center text-neutral-500">
            No products match “{query.trim()}”.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7">
            {products.map((p) => (
              <Link key={p.id} to={`/shop/${p.id}`} className="block active:scale-[0.98] transition">
                <ProductImage
                  src={p.image}
                  alt={p.name}
                  className="w-full aspect-square rounded-2xl"
                />
                <h3 className="mt-3 text-lg font-bold leading-tight">{p.name}</h3>
                <p className="mt-1 text-rose-600 font-medium">MRP {p.mrp}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
