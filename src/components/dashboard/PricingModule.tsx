import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, Globe2, MapPin } from 'lucide-react';
import { PriceHistoryChart } from './PriceHistoryChart';

type Row = {
  species: string;
  size: string;
  low: number;
  high: number;
  trend: 'up' | 'down' | 'flat';
};

const PRAWN: Row[] = [
  { species: 'L. vannamei',          size: '30 count',   low: 480, high: 550, trend: 'up' },
  { species: 'L. vannamei',          size: '40 count',   low: 380, high: 450, trend: 'up' },
  { species: 'L. vannamei',          size: '50 count',   low: 320, high: 380, trend: 'flat' },
  { species: 'L. vannamei',          size: '60 count',   low: 280, high: 330, trend: 'flat' },
  { species: 'L. vannamei',          size: '70 count',   low: 240, high: 290, trend: 'down' },
  { species: 'L. vannamei',          size: '80 count',   low: 210, high: 260, trend: 'down' },
  { species: 'L. vannamei',          size: '100 count',  low: 180, high: 220, trend: 'down' },
  { species: 'L. vannamei',          size: '120 count',  low: 160, high: 200, trend: 'flat' },
  { species: 'P. monodon (Tiger)',   size: '20 count',   low: 750, high: 900, trend: 'up' },
  { species: 'P. monodon (Tiger)',   size: '30 count',   low: 600, high: 720, trend: 'up' },
  { species: 'P. monodon (Tiger)',   size: '40 count',   low: 500, high: 600, trend: 'flat' },
  { species: 'Scampi (rosenbergii)', size: '6-10 count', low: 550, high: 700, trend: 'up' },
  { species: 'Scampi (rosenbergii)', size: '10-20 count',low: 400, high: 550, trend: 'flat' },
];

const FRESHWATER: Row[] = [
  { species: 'Rohu',              size: '1-2 kg',     low: 140, high: 180, trend: 'flat' },
  { species: 'Catla',             size: '1.5-3 kg',   low: 130, high: 170, trend: 'flat' },
  { species: 'Mrigal',            size: '1-2 kg',     low: 110, high: 150, trend: 'down' },
  { species: 'Common Carp',       size: '1-2 kg',     low: 100, high: 130, trend: 'down' },
  { species: 'Pangasius / Basa',  size: '1-2 kg',     low: 110, high: 140, trend: 'flat' },
  { species: 'Tilapia (GIFT)',    size: '500g-1 kg',  low: 120, high: 160, trend: 'up' },
  { species: 'Murrel / Korramenu',size: '500g-1 kg',  low: 350, high: 500, trend: 'up' },
  { species: 'Pearl Spot',        size: '200-400 g',  low: 280, high: 400, trend: 'up' },
  { species: 'Snakehead',         size: '500g-1 kg',  low: 320, high: 450, trend: 'up' },
  { species: 'Magur',             size: '500g-1 kg',  low: 180, high: 260, trend: 'flat' },
];

const MARINE: Row[] = [
  { species: 'Asian Seabass',     size: '1-2 kg',     low: 350, high: 450, trend: 'up' },
  { species: 'Milkfish',          size: '500g-1 kg',  low: 180, high: 240, trend: 'flat' },
  { species: 'Mullet',            size: '300-500 g',  low: 200, high: 280, trend: 'flat' },
  { species: 'Pompano',           size: '400-600 g',  low: 300, high: 400, trend: 'up' },
  { species: 'Cobia',             size: '2-5 kg',     low: 350, high: 500, trend: 'up' },
  { species: 'Grouper / Kalava',  size: '1-3 kg',     low: 550, high: 800, trend: 'up' },
  { species: 'Red Snapper',       size: '500g-2 kg',  low: 450, high: 650, trend: 'up' },
  { species: 'Mud Crab',          size: '300g-1.5 kg',low: 450, high: 1200,trend: 'up' },
];

const STATES = ['Andhra Pradesh', 'Tamil Nadu', 'Odisha', 'West Bengal', 'Gujarat'];
const MARKET_TYPES = ['Farmgate', 'Mandi', 'Export FOB'] as const;

function TrendBadge({ trend }: { trend: Row['trend'] }) {
  if (trend === 'up')
    return <span className="inline-flex items-center gap-1 text-emerald-400 text-xs"><TrendingUp className="w-3 h-3" /> up</span>;
  if (trend === 'down')
    return <span className="inline-flex items-center gap-1 text-red-400 text-xs"><TrendingDown className="w-3 h-3" /> down</span>;
  return <span className="text-foreground/30 text-xs">flat</span>;
}

function PriceTable({ rows, query }: { rows: Row[]; query: string }) {
  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          !query ||
          r.species.toLowerCase().includes(query.toLowerCase()) ||
          r.size.toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, query],
  );

  if (filtered.length === 0) {
    return <div className="px-4 py-6 text-center text-xs text-foreground/30">No species matched "{query}"</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card">
            {['Species', 'Size', 'Low ₹/kg', 'High ₹/kg', 'Mid', 'Trend'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-foreground/40 uppercase tracking-widest">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={i} className="border-b border-border hover:bg-muted transition-colors">
              <td className="px-4 py-3 text-foreground/90 font-medium">{r.species}</td>
              <td className="px-4 py-3 text-foreground/50 text-xs">{r.size}</td>
              <td className="px-4 py-3 text-foreground/60 tabular-nums">₹{r.low}</td>
              <td className="px-4 py-3 text-foreground/60 tabular-nums">₹{r.high}</td>
              <td className="px-4 py-3 font-bold text-teal-400 tabular-nums">₹{Math.round((r.low + r.high) / 2)}</td>
              <td className="px-4 py-3"><TrendBadge trend={r.trend} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PricingModule() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState(STATES[0]);
  const [market, setMarket] = useState<typeof MARKET_TYPES[number]>('Farmgate');
  const [tab, setTab] = useState<'prawn' | 'freshwater' | 'marine'>('prawn');

  const tabs = [
    { id: 'prawn' as const,      label: 'Prawn & Shrimp', count: PRAWN.length,      rows: PRAWN },
    { id: 'freshwater' as const, label: 'Freshwater Fish',count: FRESHWATER.length, rows: FRESHWATER },
    { id: 'marine' as const,     label: 'Brackish / Marine',count: MARINE.length,   rows: MARINE },
  ];
  const active = tabs.find((t) => t.id === tab)!;

  return (
    <div className="space-y-6">
      <PriceHistoryChart />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-foreground/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search species…"
            className="bg-transparent outline-none text-sm text-foreground placeholder:text-foreground/30 flex-1"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card">
          <MapPin className="w-4 h-4 text-teal-400" />
          <select value={state} onChange={(e) => setState(e.target.value)} className="bg-transparent outline-none text-sm text-foreground">
            {STATES.map((s) => <option key={s} value={s} className="bg-background">{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card">
          <Globe2 className="w-4 h-4 text-violet-400" />
          <select value={market} onChange={(e) => setMarket(e.target.value as typeof MARKET_TYPES[number])} className="bg-transparent outline-none text-sm text-foreground">
            {MARKET_TYPES.map((m) => <option key={m} value={m} className="bg-background">{m}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs border transition ${
              t.id === tab
                ? 'border-teal-400/40 bg-teal-400/10 text-teal-300'
                : 'border-border bg-card text-foreground/50 hover:text-foreground/80'
            }`}
          >
            {t.label} <span className="text-foreground/30">· {t.count}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card"
      >
        <div className="px-4 py-3 border-b border-border flex items-center justify-between text-xs">
          <span className="text-foreground/40">{state} · {market}</span>
          <span className="text-foreground/30">May 2026 estimates — production: live mandi feed</span>
        </div>
        <PriceTable rows={active.rows} query={query} />
      </motion.div>
    </div>
  );
}
