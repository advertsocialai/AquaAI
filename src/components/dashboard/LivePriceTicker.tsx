import { useEffect, useRef, useState } from 'react';
import { Activity, Wifi, WifiOff, TrendingUp, TrendingDown, Minus, Cloud, CloudRain, Sun } from 'lucide-react';
import { usePriceTicker } from '@/hooks/usePriceTicker';

const LABELS: Record<string, string> = {
  'vannamei-30':  'Vannamei 30 count',
  'vannamei-40':  'Vannamei 40 count',
  'vannamei-50':  'Vannamei 50 count',
  'vannamei-60':  'Vannamei 60 count',
  'vannamei-70':  'Vannamei 70 count',
  'vannamei-80':  'Vannamei 80 count',
  'vannamei-100': 'Vannamei 100 count',
  'monodon-20':   'Tiger Prawn 20 count',
  'monodon-30':   'Tiger Prawn 30 count',
  'scampi-8':     'Scampi 6-10 count',
  'rohu':         'Rohu (1-2 kg)',
  'seabass':      'Asian Seabass (1-2 kg)',
};

// Compact climate snapshot pulled from Open-Meteo for the saved district.
function useClimate() {
  const [data, setData] = useState<{ tempC: number; code: number; rainMm: number; district: string } | null>(null);
  useEffect(() => {
    const district = localStorage.getItem('aquaai-district') || 'Bhimavaram';
    // West Godavari heartland default
    const districts: Record<string, [number, number]> = {
      'Bhimavaram':       [16.5449, 81.5212],
      'Palakollu':        [16.5167, 81.7333],
      'Narsapur':         [16.4333, 81.7000],
      'Tanuku':           [16.7553, 81.6822],
      'Tadepalligudem':   [16.8167, 81.5333],
      'Nellore':          [14.4426, 79.9865],
      'Krishna':          [16.1755, 81.1389],
      'Visakhapatnam':    [17.6868, 83.2185],
    };
    const [lat, lng] = districts[district] ?? districts['Bhimavaram'];
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,weather_code,precipitation&timezone=Asia%2FKolkata&cell_selection=land`
    )
      .then((r) => r.json())
      .then((j) => {
        if (j.current) {
          setData({
            tempC:    j.current.temperature_2m,
            code:     j.current.weather_code,
            rainMm:   j.current.precipitation ?? 0,
            district,
          });
        }
      })
      .catch(() => {});
  }, []);
  return data;
}

function climateLabel(code: number) {
  if (code === 0) return { label: 'clear sky', Icon: Sun };
  if (code <= 3) return { label: 'partly cloudy', Icon: Cloud };
  if (code <= 48) return { label: 'fog', Icon: Cloud };
  if (code <= 67) return { label: 'rainy', Icon: CloudRain };
  if (code <= 82) return { label: 'showers', Icon: CloudRain };
  if (code <= 99) return { label: 'thunderstorm', Icon: CloudRain };
  return { label: 'overcast', Icon: Cloud };
}

export function LivePriceTicker() {
  const { prices, connected, updatedAt } = usePriceTicker();
  const prev = useRef<Record<string, number>>({});
  const [delta, setDelta] = useState<Record<string, number>>({});
  const climate = useClimate();

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
  const dateLabel = new Date(updatedAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
  });
  const timeLabel = new Date(updatedAt).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  });

  const ClimateIcon = climate ? climateLabel(climate.code).Icon : Cloud;
  const climateText = climate ? climateLabel(climate.code).label : 'loading…';

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header strip — date · live indicator · last update */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3 text-xs">
        <span className="font-semibold text-foreground">{dateLabel}</span>
        <span className="text-foreground/30">·</span>
        <span className="text-foreground/55 tabular-nums">{timeLabel}</span>
        {connected ? (
          <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-300">
            <Wifi className="w-3 h-3" /> Live
          </span>
        ) : (
          <span className="ml-auto inline-flex items-center gap-1.5 text-amber-300">
            <WifiOff className="w-3 h-3" /> Stub
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-foreground/35">
          <Activity className="w-3 h-3" /> {ago}s
        </span>
      </div>

      {/* Vertical price list — one row per species */}
      <ul className="divide-y divide-border max-h-80 overflow-y-auto">
        {Object.entries(prices).map(([sku, price]) => {
          const d = delta[sku] ?? 0;
          const color = d > 0 ? 'text-emerald-400' : d < 0 ? 'text-red-400' : 'text-foreground/40';
          const TrendIcon = d > 0 ? TrendingUp : d < 0 ? TrendingDown : Minus;
          return (
            <li key={sku} className="px-4 py-3 flex items-center gap-3 hover:bg-muted transition">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{LABELS[sku] ?? sku}</div>
                <div className="text-[11px] text-foreground/40 tabular-nums">{dateLabel} · farmgate</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-bold text-foreground tabular-nums">₹{price}</div>
                <div className={`text-xs tabular-nums inline-flex items-center gap-1 ${color}`}>
                  <TrendIcon className="w-3 h-3" />
                  {d > 0 ? `+${d}` : d < 0 ? d : '—'}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Climate strip — current weather for the selected district, anchored below */}
      <div className="px-4 py-3 border-t border-border bg-teal-400/[0.04] flex items-center gap-3 text-sm">
        <div className="w-9 h-9 rounded-lg bg-teal-400/10 border border-teal-400/30 flex items-center justify-center shrink-0">
          <ClimateIcon className="w-4 h-4 text-teal-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground tabular-nums">
              {climate ? `${Math.round(climate.tempC)}°C` : '—'}
            </span>
            <span className="text-foreground/55 capitalize truncate">{climateText}</span>
          </div>
          <div className="text-[11px] text-foreground/40">
            Rain {climate ? `${climate.rainMm}mm` : '—'} · {climate?.district ?? 'Bhimavaram'}
          </div>
        </div>
      </div>
    </div>
  );
}
