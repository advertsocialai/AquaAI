import { useEffect, useRef, useState } from 'react';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import { usePriceTicker } from '@/hooks/usePriceTicker';

const LABELS: Record<string, string> = {
  'vannamei-30':  'Vannamei 30',
  'vannamei-40':  'Vannamei 40',
  'vannamei-50':  'Vannamei 50',
  'vannamei-60':  'Vannamei 60',
  'vannamei-70':  'Vannamei 70',
  'vannamei-80':  'Vannamei 80',
  'vannamei-100': 'Vannamei 100',
  'monodon-20':   'Tiger 20',
  'monodon-30':   'Tiger 30',
  'scampi-8':     'Scampi 8',
  'rohu':         'Rohu',
  'seabass':      'Seabass',
};

export function LivePriceTicker() {
  const { prices, connected, updatedAt } = usePriceTicker();
  const prev = useRef<Record<string, number>>({});
  const [delta, setDelta] = useState<Record<string, number>>({});

  useEffect(() => {
    const d: Record<string, number> = {};
    for (const [sku, p] of Object.entries(prices)) {
      const old = prev.current[sku];
      if (old !== undefined && old !== p) d[sku] = p - old;
    }
    setDelta(d);
    prev.current = prices;
  }, [prices]);

  const ago = Math.max(0, Math.floor((Date.now() - updatedAt) / 1000));

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="px-4 py-2 border-b border-white/5 flex items-center gap-3 text-[11px]">
        {connected ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-300">
            <Wifi className="w-3 h-3" /> Live · WebSocket
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-amber-300">
            <WifiOff className="w-3 h-3" /> Stub feed · backend not connected
          </span>
        )}
        <span className="ml-auto inline-flex items-center gap-1 text-white/30">
          <Activity className="w-3 h-3" /> updated {ago}s ago
        </span>
      </div>

      <div className="relative overflow-hidden">
        <div className="ticker-track flex items-center gap-8 py-3 px-4 whitespace-nowrap">
          {[...Object.entries(prices), ...Object.entries(prices)].map(([sku, price], i) => {
            const d = delta[sku] ?? 0;
            const color = d > 0 ? 'text-emerald-400' : d < 0 ? 'text-red-400' : 'text-white/40';
            return (
              <div key={`${sku}-${i}`} className="flex items-center gap-2 text-sm">
                <span className="text-white/60">{LABELS[sku] ?? sku}</span>
                <span className="font-bold text-white tabular-nums">₹{price}</span>
                {d !== 0 && (
                  <span className={`text-xs tabular-nums ${color}`}>{d > 0 ? '+' : ''}{d}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .ticker-track {
          animation: ticker-scroll 60s linear infinite;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
