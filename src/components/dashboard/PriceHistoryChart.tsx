import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

type Range = '7d' | '30d' | '90d' | '1y';

const SPECIES = [
  { id: 'vannamei-40', label: 'Vannamei 40-ct', current: 420, color: '#38bdf8' },
  { id: 'vannamei-60', label: 'Vannamei 60-ct', current: 310, color: '#a78bfa' },
  { id: 'monodon-30',  label: 'Tiger 30-ct',    current: 660, color: '#f87171' },
  { id: 'rohu',        label: 'Rohu 1-2 kg',    current: 160, color: '#34d399' },
];

const POINTS: Record<Range, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 52 };

function generateSeries(current: number, range: Range, seed: number) {
  const n = POINTS[range];
  const data: { x: string; price: number }[] = [];
  let val = current * (0.85 + ((seed * 7) % 30) / 100);
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const drift = (Math.sin(i / 5 + seed) * 4) + (Math.random() - 0.5) * 6;
    val = Math.max(current * 0.7, Math.min(current * 1.15, val + drift));
    const d = new Date(today);
    if (range === '1y') d.setDate(d.getDate() - (n - 1 - i) * 7);
    else d.setDate(d.getDate() - (n - 1 - i));
    data.push({
      x: range === '1y'
        ? d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
        : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      price: Math.round(val),
    });
  }
  data[data.length - 1].price = current;
  return data;
}

export function PriceHistoryChart() {
  const [speciesId, setSpeciesId] = useState(SPECIES[0].id);
  const [range, setRange] = useState<Range>('30d');
  const species = SPECIES.find((s) => s.id === speciesId)!;
  const seed = SPECIES.findIndex((s) => s.id === speciesId) + 1;

  const data = useMemo(() => generateSeries(species.current, range, seed), [species, range, seed]);
  const first = data[0].price;
  const last = data[data.length - 1].price;
  const delta = last - first;
  const deltaPct = (delta / first) * 100;
  const dir = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';

  return (
    <div className="p-6 rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          {SPECIES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSpeciesId(s.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition ${
                s.id === speciesId
                  ? 'border-border bg-card text-foreground'
                  : 'border-border bg-card text-foreground/50 hover:text-foreground/80'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-card border border-border">
          {(['7d', '30d', '90d', '1y'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase transition ${
                r === range ? 'bg-card text-foreground' : 'text-foreground/40 hover:text-foreground/70'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-baseline gap-4 mb-4">
        <div className="text-3xl font-bold text-foreground tabular-nums">₹{last}<span className="text-base text-foreground/40">/kg</span></div>
        <div className={`flex items-center gap-1 text-sm ${dir === 'up' ? 'text-emerald-400' : dir === 'down' ? 'text-red-400' : 'text-foreground/40'}`}>
          {dir === 'up' ? <TrendingUp className="w-4 h-4" /> : dir === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
          <span className="tabular-nums">{delta > 0 ? '+' : ''}₹{delta} · {deltaPct.toFixed(1)}%</span>
        </div>
        <div className="ml-auto flex items-center gap-1 text-[11px] text-foreground/40">
          <Calendar className="w-3 h-3" /> {range.toUpperCase()} · {data[0].x} → {data[data.length - 1].x}
        </div>
      </div>

      <motion.div
        key={speciesId + range}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${species.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={species.color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={species.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="x"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v}`}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(0,0,0,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
              formatter={(v: number) => [`₹${v}/kg`, species.label]}
            />
            <ReferenceLine y={first} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="price"
              stroke={species.color}
              strokeWidth={2}
              fill={`url(#grad-${species.id})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
