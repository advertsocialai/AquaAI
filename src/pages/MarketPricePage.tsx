import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, CalendarDays } from 'lucide-react';
import { MobileTopBar, MobileTabBar } from '@/components/mobile/MobileChrome';
import { BrandMark } from '@/components/mobile/BrandMark';

/* ── Demo price data ──────────────────────────────────────────────────
 * Replace with Supabase fetches against a `market_prices` table
 * (species, location, count/size, price, day) once the feed is wired. */

const LOCATIONS = ['Andhra Pradesh', 'West Bengal', 'India'] as const;
const LOC_MULT: Record<string, number> = { 'Andhra Pradesh': 1, 'West Bengal': 0.94, India: 0.97 };

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

/* ── Page ─────────────────────────────────────────────────────────── */
export default function MarketPricePage() {
  const [params, setParams] = useSearchParams();
  const tab: 'shrimp' | 'fish' = params.get('tab') === 'fish' ? 'fish' : 'shrimp';

  const [shrimpSpecies, setShrimpSpecies] = useState<string>(SHRIMP_SPECIES[0]);
  const [fishSpecies, setFishSpecies] = useState<string>(FISH_SPECIES[0]);
  const [location, setLocation] = useState<string>(LOCATIONS[0]);

  const species = tab === 'shrimp' ? shrimpSpecies : fishSpecies;
  const setSpecies = tab === 'shrimp' ? setShrimpSpecies : setFishSpecies;

  const rows = todaysRows(tab, species, location);

  // Weekly trend selector (count for shrimp, size for fish)
  const trendOptions = tab === 'shrimp' ? rows.map((r) => r.label) : FISH_SIZES;
  const [trendPick, setTrendPick] = useState<string>(trendOptions[0]);
  // keep trend selection valid when tab/species changes
  useEffect(() => { setTrendPick(trendOptions[0]); /* eslint-disable-next-line */ }, [tab, species]);

  const { start, end } = lastWeek();
  // No weekly price-history feed yet → show the empty state (matches design).
  const enoughData = false;

  useEffect(() => { document.title = 'Market Price — Aqua Rudra'; }, []);

  function setTab(t: 'shrimp' | 'fish') {
    const p = new URLSearchParams(params);
    if (t === 'fish') p.set('tab', 'fish'); else p.delete('tab');
    setParams(p, { replace: true });
  }

  const speciesOptions = tab === 'shrimp' ? SHRIMP_SPECIES : FISH_SPECIES;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <MobileTopBar title="Market Price" />

      {/* Tabs */}
      <div className="max-w-md mx-auto border-b border-neutral-200">
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

      <main className="max-w-md mx-auto px-5 pt-5 pb-28">
        <h2 className="text-xl font-medium text-neutral-800 mb-3">Today's Count Prices</h2>

        {/* Species + location dropdowns */}
        <div className="flex gap-3 mb-4">
          <Dropdown value={species} options={speciesOptions} onChange={setSpecies} />
          <Dropdown value={location} options={LOCATIONS} onChange={setLocation} />
        </div>

        {/* Price table */}
        <div className="relative overflow-hidden rounded-md ring-1 ring-neutral-900">
          {/* subtle brand watermark */}
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

        {/* Weekly trend */}
        <div className="mt-10">
          <h2 className="text-xl font-medium text-neutral-800 mb-3">Weekly Count Prices</h2>
          <div className="flex gap-3 mb-5">
            <Dropdown value={trendPick} options={trendOptions} onChange={setTrendPick} />
            <div className="flex-1 flex items-center justify-between gap-2 rounded-xl bg-neutral-100 px-4 py-3.5">
              <span className="font-medium text-neutral-800 truncate">{fmt(start)} – {fmt(end)}</span>
              <CalendarDays className="w-5 h-5 text-rose-600 shrink-0" />
            </div>
          </div>

          <div className="pt-6 pb-2 flex flex-col items-center">
            <BrandMark />
            {!enoughData && (
              <p className="mt-8 text-center text-2xl font-bold text-neutral-800">No enough data</p>
            )}
          </div>
        </div>
      </main>

      <MobileTabBar active="rates" />
    </div>
  );
}
