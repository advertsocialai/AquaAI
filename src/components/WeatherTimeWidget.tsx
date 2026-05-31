import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Cloud, CloudRain, Sun, CloudSnow, CloudFog, Zap, MapPin, Clock, Loader2, X, Droplet, Wind, Thermometer } from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  ReferenceArea,
} from 'recharts';

// Indian aquaculture locations mapped to lat/lng for Open-Meteo lookup.
// Open-Meteo is free, keyless, and accurate down to a few km — perfect for India.
// West Godavari mandals are listed individually because that's where the heaviest
// vannamei farming density in India sits — farmers pick their exact taluk.
const DISTRICTS: Record<string, { lat: number; lng: number; region?: string }> = {
  // ── West Godavari district (Andhra Pradesh) — aquaculture heartland ─────────
  'Bhimavaram':       { lat: 16.5449, lng: 81.5212, region: 'West Godavari' },
  'Palakollu':        { lat: 16.5167, lng: 81.7333, region: 'West Godavari' },
  'Narsapur':         { lat: 16.4333, lng: 81.7000, region: 'West Godavari' },
  'Mogalturu':        { lat: 16.4836, lng: 81.7833, region: 'West Godavari' },
  'Achanta':          { lat: 16.5658, lng: 81.7464, region: 'West Godavari' },
  'Tanuku':           { lat: 16.7553, lng: 81.6822, region: 'West Godavari' },
  'Tadepalligudem':   { lat: 16.8167, lng: 81.5333, region: 'West Godavari' },
  'Nidadavole':       { lat: 16.9106, lng: 81.6669, region: 'West Godavari' },
  'Akividu':          { lat: 16.6000, lng: 81.3833, region: 'West Godavari' },
  'Kalla':            { lat: 16.5667, lng: 81.4000, region: 'West Godavari' },
  'Penugonda':        { lat: 16.6500, lng: 81.7500, region: 'West Godavari' },
  'Undi':             { lat: 16.6500, lng: 81.4500, region: 'West Godavari' },
  'Veeravasaram':     { lat: 16.5500, lng: 81.6000, region: 'West Godavari' },
  'Iragavaram':       { lat: 16.6833, lng: 81.6000, region: 'West Godavari' },
  'Attili':           { lat: 16.7167, lng: 81.6167, region: 'West Godavari' },
  'Kovvur':           { lat: 17.0167, lng: 81.7333, region: 'West Godavari' },
  'Polavaram':        { lat: 17.2500, lng: 81.6500, region: 'West Godavari' },
  'Bhimadole':        { lat: 16.8500, lng: 81.2667, region: 'West Godavari' },
  'Pentapadu':        { lat: 16.8333, lng: 81.5167, region: 'West Godavari' },
  'Yelamanchili':     { lat: 16.6833, lng: 81.5500, region: 'West Godavari' },
  'Pippara':          { lat: 16.6833, lng: 81.5500, region: 'West Godavari' },
  'Dwaraka Tirumala': { lat: 17.0167, lng: 81.4333, region: 'West Godavari' },
  'Kovvuru Mandal':   { lat: 17.0167, lng: 81.7333, region: 'West Godavari' },
  'Eluru':            { lat: 16.7107, lng: 81.1037, region: 'West Godavari' },

  // ── Other major aquaculture districts ──────────────────────────────────────
  'Nellore':       { lat: 14.4426, lng: 79.9865 },
  'Krishna':       { lat: 16.1755, lng: 81.1389 },
  'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
  'Surat':         { lat: 21.1702, lng: 72.8311 },
  'Paradip':       { lat: 20.3163, lng: 86.6111 },
  'Haldia':        { lat: 22.0667, lng: 88.0698 },
  'Chennai':       { lat: 13.0827, lng: 80.2707 },
  'Mumbai':        { lat: 19.0760, lng: 72.8777 },
  'Kolkata':       { lat: 22.5726, lng: 88.3639 },
  'Kochi':         { lat: 9.9312,  lng: 76.2673 },
};

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
  current: { tempC: number; code: number; rainMm: number; humidity: number; windKmh: number };
  daily: Array<{
    date: string; max: number; min: number; code: number; rainMm: number;
    rainHours: number; windMaxKmh: number; rainProb: number;
    sunrise: string; sunset: string;
  }>;
  hourly: Array<{
    time: string; tempC: number; rainMm: number; humidity: number;
    windKmh: number; rainProb: number; code: number;
  }>;
};

async function fetchWeather(district: string): Promise<Forecast | null> {
  const loc = DISTRICTS[district] ?? DISTRICTS['Bhimavaram'];
  // `best_match` auto-picks the most accurate model per region; ECMWF wins for South Asia.
  // `cell_selection=land` snaps coastal coords to the nearest land grid cell so coastal
  // aquaculture mandals don't get sea-surface fudged temperatures.
  // `best_match` auto-picks the most accurate model per region (ECMWF wins for South Asia).
  // `cell_selection=land` snaps coastal coords to the nearest land grid cell so coastal
  // aquaculture mandals don't get sea-surface fudged temperatures.
  // Hourly = 168 points over 7 days, used for the per-day climate graph drilldown.
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}` +
    `&current=temperature_2m,weather_code,precipitation,relative_humidity_2m,wind_speed_10m` +
    `&hourly=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m,` +
    `precipitation_probability,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,` +
    `precipitation_hours,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset` +
    `&timezone=Asia%2FKolkata&forecast_days=7&models=best_match&cell_selection=land`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const j = await res.json();
    return {
      current: {
        tempC:    j.current?.temperature_2m ?? 0,
        code:     j.current?.weather_code ?? 0,
        rainMm:   j.current?.precipitation ?? 0,
        humidity: j.current?.relative_humidity_2m ?? 0,
        windKmh:  j.current?.wind_speed_10m ?? 0,
      },
      daily: (j.daily?.time ?? []).map((d: string, i: number) => ({
        date:       d,
        max:        j.daily.temperature_2m_max[i],
        min:        j.daily.temperature_2m_min[i],
        code:       j.daily.weather_code[i],
        rainMm:     j.daily.precipitation_sum[i] ?? 0,
        rainHours:  j.daily.precipitation_hours?.[i] ?? 0,
        windMaxKmh: j.daily.wind_speed_10m_max?.[i] ?? 0,
        rainProb:   j.daily.precipitation_probability_max?.[i] ?? 0,
        sunrise:    j.daily.sunrise?.[i] ?? '',
        sunset:     j.daily.sunset?.[i] ?? '',
      })),
      hourly: (j.hourly?.time ?? []).map((t: string, i: number) => ({
        time:     t,
        tempC:    j.hourly.temperature_2m?.[i] ?? 0,
        rainMm:   j.hourly.precipitation?.[i] ?? 0,
        humidity: j.hourly.relative_humidity_2m?.[i] ?? 0,
        windKmh:  j.hourly.wind_speed_10m?.[i] ?? 0,
        rainProb: j.hourly.precipitation_probability?.[i] ?? 0,
        code:     j.hourly.weather_code?.[i] ?? 0,
      })),
    };
  } catch {
    return null;
  }
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function WeatherTimeWidget() {
  const { t, i18n } = useTranslation();
  const [district, setDistrict] = useState(
    () => localStorage.getItem('aquaai-district') || 'Bhimavaram',
  );
  const [draft, setDraft] = useState(district);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const now = useClock();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchWeather(district)
      .then((f) => { if (!cancelled) setForecast(f); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [district]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = draft.trim();
    if (!next) return;
    localStorage.setItem('aquaai-district', next);
    setDistrict(next);
  };

  const localeMap: Record<string, string> = { en: 'en-IN', te: 'te-IN', ta: 'ta-IN', hi: 'hi-IN', od: 'or-IN', bn: 'bn-IN' };
  const intlLocale = localeMap[i18n.language] || 'en-IN';
  const timeStr = now.toLocaleTimeString(intlLocale, {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  });
  const dateStr = now.toLocaleDateString(intlLocale, {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata',
  });

  const current = forecast?.current;
  const today = current ? decodeWmo(current.code) : null;
  const CurrentIcon = today?.Icon ?? Cloud;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-card p-6 md:p-8 backdrop-blur-sm"
    >
      {/* Top row — time · current weather · district input */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <div className="flex items-start gap-3 md:min-w-[200px]">
          <Clock className="w-5 h-5 text-teal-300 mt-1.5 shrink-0" />
          <div>
            <div className="text-3xl md:text-4xl font-bold text-foreground tabular-nums leading-tight">{timeStr}</div>
            <div className="text-sm text-foreground/55 mt-1">{dateStr}</div>
          </div>
        </div>

        <div className="hidden md:block w-px h-16 bg-card" />

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
            <div className="text-sm text-foreground/55 mt-1">
              {t('weather.rain')} {current ? `${current.rainMm}mm` : '—'} · {district}
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="flex items-center gap-2 md:min-w-[260px]">
          <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border border-border bg-card">
            <MapPin className="w-4 h-4 text-foreground/40 shrink-0" />
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t('weather.districtPlaceholder')}
              list="aquaai-districts"
              className="bg-transparent outline-none text-sm text-foreground placeholder:text-foreground/35 flex-1 min-w-0"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-black text-sm font-semibold transition"
          >
            {t('weather.update')}
          </button>
          <datalist id="aquaai-districts">
            {Object.keys(DISTRICTS).map((d) => <option key={d} value={d} />)}
          </datalist>
        </form>
      </div>

      {/* 7-day forecast — always visible (skeleton while loading) */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-baseline justify-between mb-4">
          <div className="text-sm uppercase tracking-widest text-teal-300">
            {t('weather.next7Days')}
          </div>
          <div className="text-xs text-foreground/40">Open-Meteo · {district}</div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {(forecast?.daily ?? Array.from({ length: 7 })).slice(0, 7).map((d: any, i: number) => {
            if (!d) {
              return (
                <div key={i} className="p-3 rounded-xl border border-border bg-card text-center animate-pulse">
                  <div className="h-3 bg-card rounded w-2/3 mx-auto mb-2" />
                  <div className="h-2 bg-card rounded w-1/2 mx-auto mb-3" />
                  <div className="w-6 h-6 bg-card rounded-full mx-auto mb-2" />
                  <div className="h-3 bg-card rounded w-1/2 mx-auto mb-1" />
                  <div className="h-2 bg-card rounded w-1/3 mx-auto" />
                </div>
              );
            }
            const { Icon, label } = decodeWmo(d.code);
            const date = new Date(d.date + 'T00:00:00');
            const dayLabel = i === 0
              ? t('weather.today')
              : date.toLocaleDateString(intlLocale, { weekday: 'short', timeZone: 'Asia/Kolkata' });
            const dateLabel = date.toLocaleDateString(intlLocale, { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
            return (
              <button
                type="button"
                key={d.date}
                onClick={() => setOpenDay(d.date)}
                className="p-3 rounded-xl border border-border bg-card hover:bg-teal-400/[0.08] hover:border-teal-400/40 text-center transition cursor-pointer"
                title={`${label} · ${Math.round(d.windMaxKmh)} km/h wind · ${d.rainProb}% rain prob — click for hourly chart`}
              >
                <div className="text-xs uppercase tracking-widest text-teal-300">{dayLabel}</div>
                <div className="text-[11px] text-foreground/40 mb-2">{dateLabel}</div>
                <Icon className="w-6 h-6 mx-auto text-teal-300 mb-2" />
                <div className="text-base font-bold text-foreground tabular-nums">{Math.round(d.max)}°</div>
                <div className="text-xs text-foreground/45 tabular-nums">{Math.round(d.min)}°</div>
                {d.rainMm > 0 && (
                  <div className="text-[10px] text-teal-400 mt-1 tabular-nums">
                    {d.rainMm.toFixed(1)}mm · {d.rainProb}%
                  </div>
                )}
                {d.rainMm === 0 && d.windMaxKmh > 30 && (
                  <div className="text-[10px] text-amber-300 mt-1 tabular-nums">
                    {Math.round(d.windMaxKmh)} km/h
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hourly climate graph modal */}
      <AnimatePresence>
        {openDay && forecast && (
          <DayClimateModal
            day={forecast.daily.find((x) => x.date === openDay)!}
            hourly={forecast.hourly.filter((h) => h.time.startsWith(openDay))}
            district={district}
            intlLocale={intlLocale}
            onClose={() => setOpenDay(null)}
            t={t}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Hourly climate chart modal ────────────────────────────────────────────────

function DayClimateModal({
  day, hourly, district, intlLocale, onClose, t,
}: {
  day: Forecast['daily'][number];
  hourly: Forecast['hourly'];
  district: string;
  intlLocale: string;
  onClose: () => void;
  t: (k: string, o?: any) => string;
}) {
  const data = useMemo(() => hourly.map((h) => {
    const d = new Date(h.time);
    const hour = d.getHours();
    return {
      hour,
      label: `${hour.toString().padStart(2, '0')}:00`,
      tempC: Math.round(h.tempC * 10) / 10,
      rainMm: Math.round(h.rainMm * 100) / 100,
      windKmh: Math.round(h.windKmh),
      rainProb: h.rainProb,
      code: h.code,
    };
  }), [hourly]);

  // Convert sunrise/sunset ISO strings into hours-of-day for the day band.
  const sunriseHour = day.sunrise ? new Date(day.sunrise).getHours() + new Date(day.sunrise).getMinutes() / 60 : 6;
  const sunsetHour  = day.sunset  ? new Date(day.sunset).getHours()  + new Date(day.sunset).getMinutes()  / 60 : 18;
  const fmtTime = (iso: string) =>
    iso ? new Date(iso).toLocaleTimeString(intlLocale, { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }) : '—';

  const date = new Date(day.date + 'T00:00:00');
  const dateLabel = date.toLocaleDateString(intlLocale, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
  });

  const peakWind = Math.max(...data.map((d) => d.windKmh), 0);
  const totalRain = data.reduce((s, d) => s + d.rainMm, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl rounded-2xl border border-border bg-card p-6 md:p-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="text-sm uppercase tracking-widest text-teal-300 mb-1">{district}</div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">{dateLabel}</h3>
            <div className="text-sm text-foreground/55 mt-1 capitalize">
              {decodeWmo(day.code).label} · {Math.round(day.min)}° – {Math.round(day.max)}°C
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-lg border border-border hover:bg-muted"
          >
            <X className="w-5 h-5 text-foreground/70" />
          </button>
        </div>

        {/* Quick stats — sunrise · sunset · rain · wind */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-xl border border-amber-300/20 bg-amber-300/[0.04]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300">
              <Sun className="w-3.5 h-3.5" /> Sunrise
            </div>
            <div className="text-xl font-bold text-foreground tabular-nums mt-1">{fmtTime(day.sunrise)}</div>
          </div>
          <div className="p-4 rounded-xl border border-violet-300/20 bg-violet-300/[0.04]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-violet-300">
              <Sun className="w-3.5 h-3.5" /> Sunset
            </div>
            <div className="text-xl font-bold text-foreground tabular-nums mt-1">{fmtTime(day.sunset)}</div>
          </div>
          <div className="p-4 rounded-xl border border-blue-400/20 bg-blue-400/[0.04]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-blue-300">
              <Droplet className="w-3.5 h-3.5" /> {t('weather.rain')}
            </div>
            <div className="text-xl font-bold text-foreground tabular-nums mt-1">{totalRain.toFixed(1)}mm</div>
            <div className="text-[11px] text-foreground/45">peak {day.rainProb}%</div>
          </div>
          <div className="p-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-300">
              <Wind className="w-3.5 h-3.5" /> Wind
            </div>
            <div className="text-xl font-bold text-foreground tabular-nums mt-1">{Math.round(peakWind)} km/h</div>
            <div className="text-[11px] text-foreground/45">peak gust</div>
          </div>
        </div>

        {/* ONE combined chart — temperature line, rain bars, wind line, day/night background */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-3 text-xs">
            <span className="inline-flex items-center gap-1.5 text-foreground/55">
              <span className="inline-block w-3 h-3 rounded-sm bg-amber-300/30 border border-amber-300/40" /> Daylight
            </span>
            <span className="inline-flex items-center gap-1.5 text-foreground/55">
              <span className="inline-block w-3 h-3 rounded-sm bg-slate-700/40 border border-slate-600/40" /> Night
            </span>
            <span className="inline-flex items-center gap-1.5 text-teal-300">
              <Thermometer className="w-3 h-3" /> Temperature
            </span>
            <span className="inline-flex items-center gap-1.5 text-blue-300">
              <Droplet className="w-3 h-3" /> Rain
            </span>
            <span className="inline-flex items-center gap-1.5 text-violet-300">
              <Wind className="w-3 h-3" /> Wind
            </span>
          </div>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="#22d3ee" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                {/* Day/night bands — night until sunrise, day until sunset, night after */}
                <ReferenceArea x1={0}  x2={sunriseHour} yAxisId="temp" fill="#1e293b" fillOpacity={0.35} />
                <ReferenceArea x1={sunriseHour} x2={sunsetHour} yAxisId="temp" fill="#fbbf24" fillOpacity={0.06} />
                <ReferenceArea x1={sunsetHour}  x2={23} yAxisId="temp" fill="#1e293b" fillOpacity={0.35} />

                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="hour"
                  type="number"
                  domain={[0, 23]}
                  ticks={[0, 3, 6, 9, 12, 15, 18, 21]}
                  tickFormatter={(h) => `${h}:00`}
                  stroke="rgba(255,255,255,0.45)"
                  fontSize={11}
                />
                <YAxis yAxisId="temp" stroke="#22d3ee" fontSize={11} tickFormatter={(v) => `${v}°`} width={42} />
                <YAxis yAxisId="rain" orientation="right" stroke="#60a5fa" fontSize={11} tickFormatter={(v) => `${v}mm`} width={48} />
                <Tooltip
                  contentStyle={{ background: '#0a0e14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#fff' }}
                  labelFormatter={(h) => `${h}:00`}
                  formatter={(value: any, name: string) => {
                    if (name === 'Temperature') return [`${value}°C`, name];
                    if (name === 'Rain')        return [`${value} mm`, name];
                    if (name === 'Wind')        return [`${value} km/h`, name];
                    return [value, name];
                  }}
                />

                <Bar  yAxisId="rain" dataKey="rainMm"  name="Rain"        fill="#60a5fa" opacity={0.65} barSize={14} />
                <Line yAxisId="temp" dataKey="tempC"   name="Temperature" stroke="#22d3ee" strokeWidth={3} dot={false} type="monotone" fill="url(#tempGrad)" />
                <Line yAxisId="rain" dataKey="windKmh" name="Wind"        stroke="#a78bfa" strokeWidth={2} strokeDasharray="4 3" dot={false} type="monotone" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-foreground/35 mt-3">
            Amber tint = daylight ({fmtTime(day.sunrise)} – {fmtTime(day.sunset)}) · slate tint = night ·
            cyan line = °C · blue bars = rain · dashed violet = wind speed
          </div>
        </div>

        <div className="text-xs text-foreground/35 mt-4 text-center">
          Source: Open-Meteo (ECMWF) · 1 km land-grid · sunrise/sunset for {district} in IST
        </div>
      </motion.div>
    </motion.div>
  );
}
