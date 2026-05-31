import { useState, useEffect } from 'react';
import { Droplets, Thermometer, Wind, FlaskConical, Activity } from 'lucide-react';

/**
 * IoT water-quality monitoring panel.
 * Shows the pond parameters that correlate with EHP / disease risk, each with
 * its safe operating band. Values drift slightly to simulate a live sensor feed.
 */
interface Param {
  key: string;
  label: string;
  unit: string;
  min: number;          // gauge scale min
  max: number;          // gauge scale max
  safeLo: number;
  safeHi: number;
  value: number;
  icon: React.ElementType;
}

const INITIAL: Param[] = [
  { key: 'temp',  label: 'Temperature',     unit: '°C',   min: 20, max: 38, safeLo: 28,  safeHi: 32,  value: 30.2, icon: Thermometer },
  { key: 'sal',   label: 'Salinity',        unit: 'ppt',  min: 0,  max: 40, safeLo: 10,  safeHi: 25,  value: 17.5, icon: Droplets },
  { key: 'ph',    label: 'pH',              unit: '',     min: 6,  max: 10, safeLo: 7.5, safeHi: 8.5, value: 8.0,  icon: FlaskConical },
  { key: 'do',    label: 'Dissolved Oxygen',unit: 'mg/L', min: 0,  max: 12, safeLo: 4,   safeHi: 12,  value: 6.4,  icon: Wind },
  { key: 'nh3',   label: 'Ammonia',         unit: 'mg/L', min: 0,  max: 0.5,safeLo: 0,   safeHi: 0.1, value: 0.06, icon: Activity },
  { key: 'no2',   label: 'Nitrite',         unit: 'mg/L', min: 0,  max: 3,  safeLo: 0,   safeHi: 1.0, value: 0.4,  icon: Activity },
];

export function WaterQualityPanel() {
  const [params, setParams] = useState<Param[]>(INITIAL);
  const [pulse, setPulse] = useState(0);

  // Simulate a live sensor feed — small drift every 3s.
  useEffect(() => {
    const iv = setInterval(() => {
      setParams((prev) =>
        prev.map((p) => {
          const span = p.max - p.min;
          const drift = (Math.random() - 0.5) * span * 0.03;
          let v = p.value + drift;
          v = Math.max(p.min, Math.min(p.max, v));
          return { ...p, value: Number(v.toFixed(p.max <= 1 ? 3 : 1)) };
        })
      );
      setPulse((x) => x + 1);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const alerts = params.filter((p) => p.value < p.safeLo || p.value > p.safeHi).length;

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-foreground">Water Quality Monitor</h3>
          <p className="text-xs text-foreground/50">
            Pond IoT sensors — parameters linked to disease risk
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full border border-sky-400/30 bg-sky-400/10 text-sky-300">
          <span
            key={pulse}
            className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"
          />
          Live feed
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {params.map((p) => (
          <Gauge key={p.key} p={p} />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        {alerts === 0 ? (
          <span className="text-emerald-400">
            ● All parameters within safe range — low disease risk
          </span>
        ) : (
          <span className="text-amber-400">
            ● {alerts} parameter{alerts > 1 ? 's' : ''} out of safe range — monitor closely
          </span>
        )}
      </div>
    </div>
  );
}

function Gauge({ p }: { p: Param }) {
  const pct = ((p.value - p.min) / (p.max - p.min)) * 100;
  const safeLoPct = ((p.safeLo - p.min) / (p.max - p.min)) * 100;
  const safeHiPct = ((p.safeHi - p.min) / (p.max - p.min)) * 100;
  const inRange = p.value >= p.safeLo && p.value <= p.safeHi;
  const color = inRange ? '#34d399' : '#f59e0b';

  return (
    <div className="rounded-xl border border-border bg-card p-3.5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <p.icon className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-[11px] text-foreground/55">{p.label}</span>
        </div>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {p.value}
          <span className="text-[10px] text-foreground/35 font-normal"> {p.unit}</span>
        </span>
      </div>

      {/* Track with safe band + value marker */}
      <div className="relative h-2 rounded-full bg-card overflow-hidden">
        <div
          className="absolute inset-y-0 bg-emerald-400/25"
          style={{ left: `${safeLoPct}%`, width: `${safeHiPct - safeLoPct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-3 rounded-full transition-all duration-700"
          style={{ left: `calc(${Math.max(0, Math.min(100, pct))}% - 2px)`, background: color }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-foreground/25">
        <span>{p.min}</span>
        <span className="text-emerald-400/50">
          safe {p.safeLo}–{p.safeHi}
        </span>
        <span>{p.max}</span>
      </div>
    </div>
  );
}
