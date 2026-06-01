/**
 * Dummy Aqua Products catalogue for the farmer Shop.
 *
 * Placeholder data until a real products table / supplier feed is wired.
 * `image` is optional — the UI falls back to a branded placeholder when it's
 * missing, so product photos can be dropped in later without code changes.
 */
export type AquaProduct = {
  /** URL slug + lookup id. */
  id: string;
  name: string;
  /** Maximum retail price, in ₹. */
  mrp: number;
  category: string;
  purpose: string;
  /** Optional product photo URL; placeholder shown when absent. */
  image?: string;
};

export const AQUA_PRODUCTS: AquaProduct[] = [
  {
    id: 'advex-ps-20l',
    name: 'Advex ps(20 litres)',
    mrp: 3740,
    category: 'Water Probiotic',
    purpose: 'Water quality improvement',
  },
  {
    id: 'zn-matrix-5kg',
    name: 'ZN Matrix – 5Kg',
    mrp: 3375,
    category: 'Water Conditioner',
    purpose: 'Aquaculture-grade water softening',
  },
  {
    id: 'allways-1kg',
    name: 'Allways – 1Kg',
    mrp: 2500,
    category: 'Feed Supplement',
    purpose: 'White fecal preventer & stress reliever',
  },
  {
    id: 'pioneer-1kg',
    name: 'Pioneer – 1Kg',
    mrp: 3899,
    category: 'Probiotic',
    purpose: 'Vibrio controlling probiotic',
  },
  {
    id: 'nutrizyme-1kg',
    name: 'Nutrizyme – 1Kg',
    mrp: 2599,
    category: 'Feed Supplement',
    purpose: 'Prevents RMS & promotes growth',
  },
  {
    id: 'recoup-1kg',
    name: 'Recoup – 1Kg',
    mrp: 2969,
    category: 'Feed Supplement',
    purpose: 'Vitamin C booster',
  },
];

export function getAquaProduct(id: string): AquaProduct | undefined {
  return AQUA_PRODUCTS.find((p) => p.id === id);
}
