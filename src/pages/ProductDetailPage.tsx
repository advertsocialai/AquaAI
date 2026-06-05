import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';
import { toast } from 'sonner';
import { MobileBackBar } from '@/components/mobile/MobileChrome';
import { ProductImage } from '@/components/shop/ProductImage';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { getAquaProduct } from '@/data/aquaProducts';

type Delivery = 'immediate' | 'later';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-base text-neutral-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-neutral-900">{value}</div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = productId ? getAquaProduct(productId) : undefined;

  useEffect(() => {
    document.title = product ? `${product.name} — Aqua Rudra` : 'Product — Aqua Rudra';
  }, [product]);

  const [quantity, setQuantity] = useState('');
  const [delivery, setDelivery] = useState<Delivery | ''>('');

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900">
        <MobileBackBar title={t('productDetailPage.backBarTitle')} />
        <main className="max-w-md mx-auto px-5 pt-16 text-center">
          <p className="text-neutral-500">{t('productDetailPage.notAvailable')}</p>
          <Link to="/shop" className="mt-4 inline-block text-rose-600 font-semibold">
            {t('productDetailPage.backToProducts')}
          </Link>
        </main>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      toast.error(t('productDetailPage.invalidQuantity'));
      return;
    }
    if (!delivery) {
      toast.error(t('productDetailPage.chooseDelivery'));
      return;
    }
    toast.success(t('productDetailPage.requestSubmitted'));
    setQuantity('');
    setDelivery('');
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <MobileBackBar title={t('productDetailPage.backBarTitle')} />

      <main className="max-w-md mx-auto px-5 pt-5 pb-16">
        {/* Product summary card */}
        <section className="rounded-2xl bg-sky-50 p-5">
          <div className="flex items-center gap-4">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="w-24 h-24 rounded-xl shrink-0"
            />
            <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
            <Field label={t('productDetailPage.categoryLabel')} value={product.category} />
            <Field label={t('productDetailPage.priceLabel')} value={t('productDetailPage.priceValue', { mrp: product.mrp })} />
            <div className="col-span-2">
              <Field label={t('productDetailPage.purposeLabel')} value={product.purpose} />
            </div>
          </div>
        </section>

        {/* Order form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <h2 className="text-base font-medium text-neutral-700">{t('productDetailPage.enterDetails')}</h2>

          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={t('productDetailPage.quantityPlaceholder')}
            aria-label={t('productDetailPage.quantityPlaceholder')}
            className="w-full rounded-2xl border border-neutral-200 bg-white py-4 px-5 text-lg placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
          />

          <Select value={delivery} onValueChange={(v) => setDelivery(v as Delivery)}>
            <SelectTrigger
              aria-label={t('productDetailPage.deliveryAriaLabel')}
              className="w-full rounded-2xl border border-neutral-200 bg-white py-4 px-5 h-auto text-lg data-[placeholder]:text-neutral-500"
            >
              <SelectValue placeholder={t('productDetailPage.deliveryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate" className="text-lg py-3">{t('productDetailPage.deliveryImmediate')}</SelectItem>
              <SelectItem value="later" className="text-lg py-3">{t('productDetailPage.deliveryLater')}</SelectItem>
            </SelectContent>
          </Select>

          <button
            type="submit"
            className="w-full rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold py-4 text-lg active:scale-[0.99] transition"
          >
            {t('productDetailPage.submit')}
          </button>

          <Link
            to="/contact"
            className="flex items-center justify-center gap-2 w-full rounded-2xl border border-rose-200 text-rose-600 font-semibold py-4 text-lg active:scale-[0.99] transition"
          >
            <Phone className="w-5 h-5" />
            {t('productDetailPage.contactUs')}
          </Link>
        </form>
      </main>
    </div>
  );
}
