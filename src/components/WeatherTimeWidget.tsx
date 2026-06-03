import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Cloud, CloudRain, Sun, CloudSnow, CloudFog, Zap, MapPin, Clock, Loader2, X,
  Droplet, Wind, Search, ChevronDown, ArrowUp, ArrowDown,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea,
} from 'recharts';

// ── Aqua locations grouped by region, each with real lat/long for Open-Meteo ──
type Place = { name: string; lat: number; lng: number };
// Coordinates verified via Open-Meteo geocoding (Andhra Pradesh coast). A few
// names that geocoded to the wrong state keep their correct coastal-AP coords.
const REGIONS: { region: string; places: Place[] }[] = [
  { region: 'Srikakulam', places: [
    { name: 'Sompeta', lat: 18.9442, lng: 84.5845 },
    { name: 'Ichchapuram', lat: 19.1139, lng: 84.6872 },
    { name: 'Naupada', lat: 18.9000, lng: 84.5800 },
    { name: 'Kaviti', lat: 19.0114, lng: 84.6904 },
  ]},
  { region: 'Visakhapatnam / Anakapalli', places: [
    { name: 'Bheemunipatnam', lat: 17.8902, lng: 83.4520 },
    { name: 'Pudimadaka', lat: 17.4982, lng: 83.0050 },
    { name: 'Payakaraopeta', lat: 17.3678, lng: 82.5683 },
  ]},
  { region: 'Kakinada', places: [
    { name: 'Kakinada', lat: 16.9604, lng: 82.2381 },
    { name: 'Uppada', lat: 17.0833, lng: 82.3333 },
    { name: 'Tallarevu', lat: 16.9167, lng: 82.2833 },
    { name: 'Tuni', lat: 17.3590, lng: 82.5461 },
  ]},
  { region: 'Konaseema', places: [
    { name: 'Amalapuram', lat: 16.5787, lng: 82.0061 },
    { name: 'Razole', lat: 16.4761, lng: 81.8391 },
    { name: 'Sakhinetipalli', lat: 16.4500, lng: 81.7833 },
    { name: 'Mummidivaram', lat: 16.6440, lng: 82.1074 },
    { name: 'Allavaram', lat: 16.5075, lng: 81.9892 },
  ]},
  { region: 'West Godavari / Eluru', places: [
    { name: 'Bhimavaram', lat: 16.5408, lng: 81.5232 },
    { name: 'Narsapur', lat: 16.4333, lng: 81.7000 },
    { name: 'Palakollu', lat: 16.5167, lng: 81.7300 },
    { name: 'Mogalturu', lat: 16.4836, lng: 81.7833 },
    { name: 'Veeravasaram', lat: 16.5367, lng: 81.6283 },
    { name: 'Kalla', lat: 16.5667, lng: 81.4000 },
    { name: 'Akiveedu', lat: 16.6000, lng: 81.3833 },
    { name: 'Undi', lat: 16.5854, lng: 81.4621 },
  ]},
  { region: 'Kolleru region', places: [
    { name: 'Kaikalur', lat: 16.5515, lng: 81.2140 },
    { name: 'Mudinepalli', lat: 16.4500, lng: 81.2000 },
    { name: 'Kalidindi', lat: 16.5167, lng: 81.2333 },
  ]},
  { region: 'Krishna / Machilipatnam', places: [
    { name: 'Machilipatnam', lat: 16.1875, lng: 81.1389 },
    { name: 'Avanigadda', lat: 16.0215, lng: 80.9181 },
    { name: 'Nagayalanka', lat: 15.9485, lng: 80.9164 },
    { name: 'Bantumilli', lat: 16.3720, lng: 81.2720 },
    { name: 'Gudivada', lat: 16.4355, lng: 80.9955 },
    { name: 'Pamarru', lat: 16.3254, lng: 80.9599 },
    { name: 'Vuyyuru', lat: 16.3631, lng: 80.8441 },
  ]},
  { region: 'Bapatla / Guntur', places: [
    { name: 'Bapatla', lat: 15.9042, lng: 80.4674 },
    { name: 'Repalle', lat: 16.0184, lng: 80.8296 },
    { name: 'Nizampatnam', lat: 15.9049, lng: 80.6686 },
    { name: 'Nagaram', lat: 16.0500, lng: 80.7500 },
  ]},
  { region: 'Prakasam', places: [
    { name: 'Chirala', lat: 15.8239, lng: 80.3522 },
    { name: 'Singarayakonda', lat: 15.2305, lng: 80.0279 },
    { name: 'Ulavapadu', lat: 15.1665, lng: 79.9960 },
    { name: 'Ongole', lat: 15.5036, lng: 80.0445 },
    { name: 'Kothapatnam', lat: 15.4500, lng: 80.1000 },
  ]},
  { region: 'Nellore (SPSR)', places: [
    { name: 'Nellore', lat: 14.4499, lng: 79.9870 },
    { name: 'Kavali', lat: 14.9163, lng: 79.9945 },
    { name: 'Tada', lat: 13.5859, lng: 80.0315 },
    { name: 'Gudur', lat: 14.1509, lng: 79.8521 },
    { name: 'Kota', lat: 14.0500, lng: 80.0000 },
    { name: 'Vakadu', lat: 14.0015, lng: 80.0700 },
    { name: 'Allur', lat: 14.6834, lng: 80.0541 },
    { name: 'Indukurpet', lat: 14.3500, lng: 80.1000 },
    { name: 'Thamminapatnam', lat: 14.4000, lng: 80.1200 },
    { name: 'Naidupeta', lat: 13.9000, lng: 79.8833 },
  ]},
];
const ALL_PLACES: (Place & { region: string })[] =
  REGIONS.flatMap((r) => r.places.map((p) => ({ ...p, region: r.region })));

// WMO weather code → label + icon. https://open-meteo.com/en/docs
function decodeWmo(code: number): { label: string; Icon: typeof Cloud } {
  if (code === 0) return { label: 'clear sky', Icon: Sun };
  if (code <= 2) return { label: 'partly cloudy', Icon: Cloud };
  if (code === 3) return { label: 'overcast', Icon: Cloud };
  if (code <= 48) return { label: 'fog', Icon: CloudFog };
  if (code <= 57) return { label: 'drizzle', Icon: CloudRain };
  if (code <= 67) return { label: 'rain', Icon: CloudRain };
  if (code <= 77) return { label: 'snow', Icon: CloudSnow };
  if (code <= 82) return { label: 'rain showers', Icon: CloudRain };
  if (code <= 86) return { label: 'snow showers', Icon: CloudSnow };
  if (code <= 99) return { label: 'thunderstorm', Icon: Zap };
  return { label: 'unknown', Icon: Cloud };
}

type Forecast = {
  current: { tempC: number; code: number; rainMm: number };
  daily: Array<{
    date: string; max: number; min: number; code: number; rainMm: number;
    windMaxKmh: number; sunrise: string; sunset: string;
  }>;
  hourly: Array<{ time: string; tempC: number }>;
};

async function fetchWeather(lat: number, lng: number): Promise<Forecast | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,weather_code,precipitation` +
    `&hourly=temperature_2m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,` +
    `wind_speed_10m_max,sunrise,sunset` +
    `&timezone=Asia%2FKolkata&forecast_days=7&models=best_match&cell_selection=land`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const j = await res.json();
    return {
      current: {
        tempC:  j.current?.temperature_2m ?? 0,
        code:   j.current?.weather_code ?? 0,
        rainMm: j.current?.precipitation ?? 0,
      },
      daily: (j.daily?.time ?? []).map((d: string, i: number) => ({
        date:       d,
        max:        j.daily.temperature_2m_max[i],
        min:        j.daily.temperature_2m_min[i],
        code:       j.daily.weather_code[i],
        rainMm:     j.daily.precipitation_sum?.[i] ?? 0,
        windMaxKmh: j.daily.wind_speed_10m_max?.[i] ?? 0,
        sunrise:    j.daily.sunrise?.[i] ?? '',
        sunset:     j.daily.sunset?.[i] ?? '',
      })),
      hourly: (j.hourly?.time ?? []).map((t: string, i: number) => ({
        time:  t,
        tempC: j.hourly.temperature_2m?.[i] ?? 0,
      })),
    };
  } catch {
    return null;
  }
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function WeatherTimeWidget() {
  const { t, i18n } = useTranslation();
  const [locationName, setLocationName] = useState(
    () => localStorage.getItem('aquaai-location') || 'Bhimavaram',
  );
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const now = useClock();

  const selected = useMemo(
    () => ALL_PLACES.find((p) => p.name === locationName) ?? ALL_PLACES[0],
    [locationName],
  );

  const load = useCallback(async () => {
    setLoading(true);
    const f = await fetchWeather(selected.lat, selected.lng);
    setForecast(f);
    setLoading(false);
    setLastUpdated(Date.now());
  }, [selected]);

  // Auto-load on open + whenever the location changes.
  useEffect(() => { load(); }, [load]);
  // Silent background refresh every 30 minutes.
  useEffect(() => {
    const id = setInterval(() => load(), 30 * 60 * 1000);
    return () => clearInterval(id);
  }, [load]);

  // Close the location picker on outside click.
  useEffect(() => {
    if (!pickerOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-location-picker]')) setPickerOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [pickerOpen]);

  const selectLocation = (name: string) => {
    localStorage.setItem('aquaai-location', name);
    setLocationName(name);
    setPickerOpen(false);
    setQuery('');
  };

  const intlLocale = ({ en: 'en-IN', te: 'te-IN', ta: 'ta-IN', hi: 'hi-IN', od: 'or-IN', bn: 'bn-IN' } as Record<string, string>)[i18n.language] || 'en-IN';
  const timeStr = now.toLocaleTimeString(intlLocale, { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
  const dateStr = now.toLocaleDateString(intlLocale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' });

  const minsAgo = lastUpdated ? Math.floor((now.getTime() - lastUpdated) / 60000) : null;
  const updatedText = minsAgo == null ? '' : minsAgo < 1 ? 'Last updated: just now' : `Last updated: ${minsAgo} min ago`;

  const current = forecast?.current;
  const today = current ? decodeWmo(current.code) : null;
  const CurrentIcon = today?.Icon ?? Cloud;

  const filtered = REGIONS
    .map((r) => ({
      region: r.region,
      places: r.places.filter(
        (p) => p.name.toLowerCase().includes(query.toLowerCase()) ||
               r.region.toLowerCase().includes(query.toLowerCase()),
      ),
    }))
    .filter((r) => r.places.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-card p-6 md:p-8 backdrop-blur-sm"
    >
      {/* Location picker (searchable, grouped) */}
      <div data-location-picker className="relative mb-6 max-w-sm">
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card hover:border-teal-400/40 transition text-left"
        >
          <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{selected.name}</div>
            <div className="text-[11px] text-foreground/45 truncate">{selected.region}</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-foreground/40 transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {pickerOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute z-30 mt-2 w-full rounded-xl border border-border bg-popover shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
                <Search className="w-4 h-4 text-foreground/40 shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search location…"
                  className="bg-transparent outline-none text-sm text-foreground flex-1 min-w-0 placeholder:text-foreground/35"
                />
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {filtered.length === 0 && (
                  <div className="px-4 py-3 text-sm text-foreground/40">No matches</div>
                )}
                {filtered.map((r) => (
                  <div key={r.region}>
                    <div className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-widest text-teal-300/80">{r.region}</div>
                    {r.places.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => selectLocation(p.name)}
                        className={`w-full text-left px-4 py-2 text-sm transition ${
                          p.name === selected.name
                            ? 'bg-teal-400/10 text-teal-300 font-medium'
                            : 'text-foreground/80 hover:bg-muted'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Time · current weather · last-updated */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <div className="flex items-start gap-3 md:min-w-[200px]">
          <Clock className="w-5 h-5 text-teal-300 mt-1.5 shrink-0" />
          <div>
            <div className="text-3xl md:text-4xl font-bold text-foreground tabular-nums leading-tight">{timeStr}</div>
            <div className="text-sm text-foreground/55 mt-1">{dateStr}</div>
          </div>
        </div>

        <div className="hidden md:block w-px h-16 bg-border" />

        <div className="flex-1 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-teal-400/10 border border-teal-400/30 flex items-center justify-center shrink-0">
            {loading
              ? <Loader2 className="w-6 h-6 text-teal-300 animate-spin" />
              : <CurrentIcon className="w-7 h-7 text-teal-300" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl md:text-4xl font-bold text-foreground tabular-nums">
                {current ? `${Math.round(current.tempC)}°C` : '—'}
              </div>
              <div className="text-base text-foreground/65 capitalize truncate">
                {today?.label ?? t('weather.loading')}
              </div>
            </div>
            <div className="text-xs text-foreground/45 mt-1">{updatedText}</div>
          </div>
        </div>
      </div>

      {/* 7-day strip */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-baseline justify-between mb-4">
          <div className="text-sm uppercase tracking-widest text-teal-300">{t('weather.next7Days')}</div>
          <div className="text-xs text-foreground/40">{selected.name}</div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {(forecast?.daily ?? Array.from({ length: 7 })).slice(0, 7).map((d: Forecast['daily'][number] | undefined, i: number) => {
            if (!d) {
              return (
                <div key={i} className="p-3 rounded-xl border border-border bg-card text-center animate-pulse">
                  <div className="h-3 bg-muted rounded w-2/3 mx-auto mb-2" />
                  <div className="w-6 h-6 bg-muted rounded-full mx-auto mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
                </div>
              );
            }
            const { Icon } = decodeWmo(d.code);
            const date = new Date(d.date + 'T00:00:00');
            const dayLabel = i === 0 ? t('weather.today') : date.toLocaleDateString(intlLocale, { weekday: 'short', timeZone: 'Asia/Kolkata' });
            const dateLabel = date.toLocaleDateString(intlLocale, { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
            return (
              <button
                type="button"
                key={d.date}
                onClick={() => setOpenDay(d.date)}
                className="p-3 rounded-xl border border-border bg-card hover:bg-teal-400/[0.08] hover:border-teal-400/40 text-center transition"
              >
                <div className="text-xs uppercase tracking-widest text-teal-300">{dayLabel}</div>
                <div className="text-[11px] text-foreground/40 mb-2">{dateLabel}</div>
                <Icon className="w-6 h-6 mx-auto text-teal-300 mb-2" />
                <div className="text-base font-bold text-foreground tabular-nums">{Math.round(d.max)}°</div>
                <div className="text-xs text-foreground/45 tabular-nums">{Math.round(d.min)}°</div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {openDay && forecast && (
          <DayChartModal
            day={forecast.daily.find((x) => x.date === openDay)!}
            hourly={forecast.hourly.filter((h) => h.time.startsWith(openDay))}
            place={selected.name}
            intlLocale={intlLocale}
            onClose={() => setOpenDay(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Simple per-day temperature chart + stat cards ──────────────────────────────
function DayChartModal({
  day, hourly, place, intlLocale, onClose,
}: {
  day: Forecast['daily'][number];
  hourly: Forecast['hourly'];
  place: string;
  intlLocale: string;
  onClose: () => void;
}) {
  const data = useMemo(() => hourly.map((h) => {
    const hour = new Date(h.time).getHours();
    return { hour, tempC: Math.round(h.tempC) };
  }), [hourly]);

  const sunriseHour = day.sunrise ? new Date(day.sunrise).getHours() : 6;
  const sunsetHour  = day.sunset  ? new Date(day.sunset).getHours()  : 18;
  const fmtTime = (iso: string) =>
    iso ? new Date(iso).toLocaleTimeString(intlLocale, { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }) : '—';

  const date = new Date(day.date + 'T00:00:00');
  const dateLabel = date.toLocaleDateString(intlLocale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' });

  const stats = [
    { label: 'High', value: `${Math.round(day.max)}°`, Icon: ArrowUp, tint: 'text-rose-400' },
    { label: 'Low', value: `${Math.round(day.min)}°`, Icon: ArrowDown, tint: 'text-sky-400' },
    { label: 'Rainfall', value: `${day.rainMm.toFixed(1)}mm`, Icon: Droplet, tint: 'text-teal-400' },
    { label: 'Wind', value: `${Math.round(day.windMaxKmh)} km/h`, Icon: Wind, tint: 'text-emerald-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 md:p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="text-sm uppercase tracking-widest text-teal-300 mb-1">{place}</div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">{dateLabel}</h3>
            <div className="text-sm text-foreground/55 mt-1 capitalize">{decodeWmo(day.code).label}</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg border border-border hover:bg-muted">
            <X className="w-5 h-5 text-foreground/70" />
          </button>
        </div>

        {/* ONE clean temperature line */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-widest text-teal-300 mb-3">Temperature through the day</div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 12, left: -8, bottom: 4 }}>
                <defs>
                  <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                {/* Subtle night shading only */}
                <ReferenceArea x1={0} x2={sunriseHour} fill="#64748b" fillOpacity={0.07} />
                <ReferenceArea x1={sunsetHour} x2={23} fill="#64748b" fillOpacity={0.07} />
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis
                  dataKey="hour" type="number" domain={[0, 23]}
                  ticks={[0, 6, 12, 18]}
                  tickFormatter={(h) => (h === 0 ? '12am' : h === 6 ? '6am' : h === 12 ? '12pm' : '6pm')}
                  stroke="rgba(148,163,184,0.6)" fontSize={12} tickMargin={8}
                />
                <YAxis stroke="rgba(148,163,184,0.6)" fontSize={12} width={40} tickFormatter={(v) => `${v}°`} />
                <Tooltip
                  contentStyle={{ background: '#0a0e14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, fontSize: 13 }}
                  labelStyle={{ color: '#fff' }}
                  labelFormatter={(h) => `${((h + 11) % 12) + 1}${h < 12 ? 'am' : 'pm'}`}
                  formatter={(v: number | string) => [`${v}°C`, 'Temp']}
                />
                <Area dataKey="tempC" stroke="#2dd4bf" strokeWidth={3} fill="url(#tGrad)" type="monotone" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Big readable stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {stats.map((s) => (
            <div key={s.label} className="p-5 rounded-xl border border-border bg-card text-center">
              <s.Icon className={`w-5 h-5 mx-auto mb-2 ${s.tint}`} />
              <div className="text-2xl font-bold text-foreground tabular-nums leading-none">{s.value}</div>
              <div className="text-xs text-foreground/45 mt-2 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-foreground/35 mt-4 text-center">
          Daylight {fmtTime(day.sunrise)} – {fmtTime(day.sunset)} · Source: Open-Meteo · IST
        </div>
      </motion.div>
    </motion.div>
  );
}
