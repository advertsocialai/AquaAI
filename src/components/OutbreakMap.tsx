import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Radio } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api/v1';

interface OutbreakRecord {
  id: number | string;
  disease?: string;
  district?: string;
  radius_km?: number;
  notified_farms_count?: number;
}

// Andhra Pradesh coastal shrimp-farming districts, laid out roughly south→north.
const DISTRICTS = [
  'Nellore', 'Prakasam', 'Bapatla', 'Guntur', 'Krishna',
  'West Godavari', 'Konaseema', 'Kakinada', 'East Godavari',
  'Visakhapatnam', 'Vizianagaram', 'Srikakulam',
];

// Representative baseline density (used when the live DB has no outbreaks yet).
const BASELINE: Record<string, number> = {
  Nellore: 3, Prakasam: 1, Krishna: 2, 'West Godavari': 4,
  Kakinada: 2, 'East Godavari': 1,
};

function densityColor(n: number): string {
  if (n >= 4) return '#ef4444';
  if (n >= 2) return '#f59e0b';
  if (n >= 1) return '#fbbf24';
  return '#1e3a5f';
}

/**
 * F27/F31 — Regional disease-outbreak heatmap.
 * Pulls live outbreak alerts from /disease/outbreaks and shows disease density
 * across Andhra Pradesh's shrimp-farming districts.
 */
export function OutbreakMap() {
  const [counts, setCounts] = useState<Record<string, number>>(BASELINE);
  const [live, setLive] = useState(false);
  const [alerts, setAlerts] = useState<OutbreakRecord[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/disease/outbreaks`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: OutbreakRecord[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const map: Record<string, number> = {};
          for (const a of data) {
            const d = a.district || 'Unknown';
            map[d] = (map[d] || 0) + 1;
          }
          setCounts(map);
          setAlerts(data.slice(0, 5));
          setLive(true);
        }
      })
      .catch(() => {});
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const hottest = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-foreground">Regional Outbreak Map</h3>
          <p className="text-xs text-foreground/50">
            Disease density across Andhra Pradesh shrimp districts
          </p>
        </div>
        <span
          className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full border ${
            live
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
              : 'border-border bg-card text-foreground/40'
          }`}
        >
          <Radio className="w-3 h-3" />
          {live ? 'Live alerts' : 'Sample data'}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* District grid */}
        <div className="grid grid-cols-3 gap-2">
          {DISTRICTS.map((d, i) => {
            const n = counts[d] || 0;
            const color = densityColor(n);
            return (
              <motion.div
                key={d}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="relative rounded-lg p-2.5 border overflow-hidden"
                style={{ borderColor: `${color}55`, background: `${color}1a` }}
              >
                {n >= 2 && (
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse"
                    style={{ background: color }}
                  />
                )}
                <MapPin className="w-3 h-3 mb-1" style={{ color }} />
                <div className="text-[11px] font-semibold text-foreground/90 leading-tight">
                  {d}
                </div>
                <div className="text-[10px] text-foreground/40">
                  {n === 0 ? 'no alerts' : `${n} alert${n > 1 ? 's' : ''}`}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Side panel */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-card p-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 mb-1" />
              <div className="text-2xl font-bold text-foreground tabular-nums">{total}</div>
              <div className="text-[10px] text-foreground/40">Active alerts</div>
            </div>
            <div className="rounded-xl bg-card p-3">
              <MapPin className="w-4 h-4 text-red-400 mb-1" />
              <div className="text-base font-bold text-foreground truncate">
                {hottest?.[0] ?? '—'}
              </div>
              <div className="text-[10px] text-foreground/40">Highest density</div>
            </div>
          </div>

          <div className="rounded-xl bg-card p-3">
            <div className="text-[10px] uppercase tracking-wider text-foreground/30 mb-2">
              How alerts spread
            </div>
            <p className="text-xs text-foreground/55 leading-relaxed">
              When a hard-fail diagnosis is logged with GPS, every farm within a
              5&nbsp;km radius is auto-notified by FCM &amp; WhatsApp — containing the
              outbreak before it spreads.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[10px] text-foreground/40">
            {[
              { c: '#1e3a5f', l: 'Clear' },
              { c: '#fbbf24', l: 'Low' },
              { c: '#f59e0b', l: 'Moderate' },
              { c: '#ef4444', l: 'High' },
            ].map((x) => (
              <span key={x.l} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded" style={{ background: x.c }} />
                {x.l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {live && alerts.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="text-[10px] uppercase tracking-wider text-foreground/30 mb-2">
            Recent alerts
          </div>
          <div className="space-y-1.5">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-foreground/70">
                  {a.disease} — {a.district || 'unknown district'}
                </span>
                <span className="text-foreground/30">{a.notified_farms_count ?? 0} farms notified</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
