import { useEffect, useRef, useState } from 'react';
import { ChevronDown, CalendarDays } from 'lucide-react';
import { BrandMark } from '@/components/mobile/BrandMark';
import { supabase } from '@/lib/supabase';

/* ── Demo price data (fallback) ───────────────────────────────────────
 * Live prices are fetched from the Supabase `market_prices` table; these
 * values are the offline/empty-DB fallback and the seed source. */

const LOCATIONS = ['Andhra Pradesh'] as const;
const LOC_MULT: Record<string, number> = { 'Andhra Pradesh': 1 };

const SHRIMP_SPECIES = ['Vannamei', 'Tiger Prawn'] as const;
const SHRIMP_COUNTS = [20, 25, 30, 40, 45, 50, 60, 70, 80, 90, 100];
const SHRIMP_BASE: Record<string, number[]> = {
  Vannamei:      [510, 490, 430, 330, 305, 300, 280, 270, 260, 240, 230],
  'Tiger Prawn': [690, 660, 580, 450, 415, 405, 380, 365, 350, 325, 310],
};

const FISH_SPECIES = ['Rohu-Katla', 'Pangasius', 'Roopchand'] as const;
const FISH_SIZES = ['Big', 'Small'];
const FISH_BASE: Record<string, Record<string, number>> = {
  'Rohu-Katla': { Big: 116, Small: 100 },
  Pangasius:    { Big: 95,  Small: 80 },
  Roopchand:    { Big: 135, Small: 115 },
};

type Row = { label: string; price: number };

function todaysRows(tab: 'shrimp' | 'fish', species: string, location: string): Row[] {
  const mult = LOC_MULT[location] ?? 1;
  if (tab === 'shrimp') {
    const base = SHRIMP_BASE[species] ?? SHRIMP_BASE.Vannamei;
    return SHRIMP_COUNTS.map((c, i) => ({ label: `${c}c`, price: Math.round(base[i] * mult) }));
  }
  const base = FISH_BASE[species] ?? FISH_BASE['Rohu-Katla'];
  return FISH_SIZES.map((s) => ({ label: s, price: Math.round(base[s] * mult) }));
}

/* Last completed Mon–Sun week (matches the design's "25 May – 31 May"). */
function lastWeek() {
  const now = new Date();
  const dow = now.getDay(); // 0 = Sun
  const end = new Date(now);
  end.setDate(now.getDate() - (dow === 0 ? 7 : dow)); // previous Sunday
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    days.push(d);
  }
  return { start: days[0], end, days };
}

const fmt = (d: Date) => `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`;

/* Deterministic daily price around the base for the weekly trend (demo). */
function weeklyPrices(seedLabel: string, base: number, days: Date[]): number[] {
  let h = 0;
  for (let i = 0; i < seedLabel.length; i++) h = (h * 31 + seedLabel.charCodeAt(i)) % 997;
  return days.map((_, i) => Math.round(base * (1 + 0.04 * Math.sin(h + i * 0.9))));
}

/* ── Dropdown ─────────────────────────────────────────────────────── */
function Dropdown({
  value, options, onChange,
}: { value: string; options: readonly string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3.5"
      >
        <span className="font-medium text-neutral-900 truncate">{value}</span>
        <ChevronDown className={`w-5 h-5 text-rose-600 shrink-0 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 min-w-full z-40 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 py-1.5">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false); }}
              className={`w-full text-left px-5 py-3 text-lg hover:bg-neutral-50 ${o === value ? 'text-rose-600 font-semibold' : 'text-neutral-900'}`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Self-contained Live Rates dashboard — shrimp/fish tabs, species + location
 * dropdowns, today's count-price table and the weekly trend. Used standalone
 * on /rates and embedded on the Home page. Manages its own tab state.
 */
export function MarketPriceBoard({ initialTab = 'shrimp' }: { initialTab?: 'shrimp' | 'fish' }) {
  const [tab, setTab] = useState<'shrimp' | 'fish'>(initialTab);
  const [shrimpSpecies, setShrimpSpecies] = useState<string>(SHRIMP_SPECIES[0]);
  const [fishSpecies, setFishSpecies] = useState<string>(FISH_SPECIES[0]);
  const [location, setLocation] = useState<string>(LOCATIONS[0]);

  const species = tab === 'shrimp' ? shrimpSpecies : fishSpecies;
  const setSpecies = tab === 'shrimp' ? setShrimpSpecies : setFishSpecies;

  const [liveBase, setLiveBase] = useState<Record<string, Row[]>>({});
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('market_prices')
        .select('tab,species,label,price,sort_order')
        .eq('tab', tab)
        .eq('species', species)
        .order('sort_order');
      if (cancelled || error || !data?.length) return;
      setLiveBase((prev) => ({
        ...prev,
        [`${tab}|${species}`]: data.map((d) => ({ label: d.label, price: d.price })),
      }));
    })();
    return () => { cancelled = true; };
  }, [tab, species]);

  const mult = LOC_MULT[location] ?? 1;
  const live = liveBase[`${tab}|${species}`];
  const rows: Row[] = live
    ? live.map((r) => ({ label: r.label, price: Math.round(r.price * mult) }))
    : todaysRows(tab, species, location);

  const trendOptions = tab === 'shrimp' ? rows.map((r) => r.label) : FISH_SIZES;
  const [trendPick, setTrendPick] = useState<string>(trendOptions[0]);
  // Reset the trend selection when tab/species changes (trendOptions is derived).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setTrendPick(trendOptions[0]); }, [tab, species]);

  const { start, end, days } = lastWeek();
  const trendBase = rows.find((r) => r.label === trendPick)?.price ?? rows[0]?.price ?? 0;
  const trend = weeklyPrices(trendPick, trendBase, days);
  const tMin = Math.min(...trend), tMax = Math.max(...trend);
  const enoughData = trendBase > 0;

  const speciesOptions = tab === 'shrimp' ? SHRIMP_SPECIES : FISH_SPECIES;

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="grid grid-cols-2 text-center">
          {(['shrimp', 'fish'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative py-4 text-xl ${tab === t ? 'font-semibold text-neutral-900' : 'text-neutral-600'}`}
            >
              {t === 'shrimp' ? 'Shrimp' : 'Fish'}
              {tab === t && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-rose-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6">
        {/* Species + location dropdowns */}
        <div className="flex gap-3 mb-6 max-w-xl">
          <Dropdown value={species} options={speciesOptions} onChange={setSpecies} />
          <Dropdown value={location} options={LOCATIONS} onChange={setLocation} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Price table */}
          <div>
            <h2 className="text-xl font-medium text-neutral-800 mb-3">Today's Count Prices</h2>
            <div className="relative overflow-hidden rounded-md ring-1 ring-neutral-900">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
                <span className="text-3xl font-extrabold text-rose-500/10 -rotate-12">Aqua Rudra</span>
              </div>
              <table className="relative w-full border-collapse">
                <thead>
                  <tr className="bg-[#0e2e38] text-white text-left">
                    <th className="w-1/2 px-6 py-5 text-lg font-bold border border-neutral-900">Count</th>
                    <th className="px-6 py-5 text-lg font-bold border border-neutral-900">Today's Count Prices</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {rows.map((r) => (
                    <tr key={r.label}>
                      <td className="px-6 py-4 text-lg border border-neutral-900 bg-white/80">{r.label}</td>
                      <td className="px-6 py-4 text-lg border border-neutral-900 bg-white/80">₹{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly trend */}
          <div>
            <h2 className="text-xl font-medium text-neutral-800 mb-3">Weekly Count Prices</h2>
            <div className="flex gap-3 mb-5">
              <Dropdown value={trendPick} options={trendOptions} onChange={setTrendPick} />
              <div className="flex-1 flex items-center justify-between gap-2 rounded-xl bg-neutral-100 px-4 py-3.5">
                <span className="font-medium text-neutral-800 truncate">{fmt(start)} – {fmt(end)}</span>
                <CalendarDays className="w-5 h-5 text-rose-600 shrink-0" />
              </div>
            </div>

            {enoughData ? (
              <div className="space-y-2.5">
                {days.map((d, i) => {
                  const pct = tMax > tMin ? ((trend[i] - tMin) / (tMax - tMin)) * 100 : 50;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-16 text-sm text-neutral-500 shrink-0">{fmt(d)}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-neutral-100">
                        <div className="h-2.5 rounded-full bg-rose-500/70" style={{ width: `${Math.max(8, pct)}%` }} />
                      </div>
                      <span className="w-14 text-right font-semibold tabular-nums">₹{trend[i]}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="pt-4 flex flex-col items-center">
                <BrandMark />
                <p className="mt-8 text-center text-2xl font-bold text-neutral-800">No enough data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
