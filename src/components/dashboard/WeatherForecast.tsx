import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Cloud, CloudRain, CloudDrizzle, Sun, CloudSun, Wind, Droplets,
  MapPin, Thermometer, Waves, CheckCircle2, AlertTriangle,
} from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  waterTemp: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    rainChance: number;
  }>;
  alert: { message: string } | null;
}

// All mandals / towns of West Godavari district, Andhra Pradesh (scrollable).
const WEST_GODAVARI = [
  "Bhimavaram", "Tadepalligudem", "Tanuku", "Narsapur", "Palakollu", "Akiveedu",
  "Undi", "Veeravasaram", "Kalla", "Achanta", "Penugonda", "Attili", "Iragavaram",
  "Nidadavolu", "Ganapavaram", "Pentapadu", "Unguturu", "Bhimadole", "Pedavegi",
  "Pedapadu", "Denduluru", "Kovvur", "Chagallu", "Tallapudi", "Gopalapuram",
  "Koyyalagudem", "Jangareddygudem", "Polavaram", "Buttayagudem", "Chintalapudi",
  "Kamavarapukota", "Lingapalem", "T. Narasapuram", "Devarapalli", "Nallajerla",
  "Dwarakatirumala", "Mogalturu", "Yelamanchili", "Poduru", "Palacharla",
];

// Pick an icon + colour for a condition string.
function conditionIcon(condition: string) {
  const c = condition.toLowerCase();
  if (c.includes("heavy")) return { Icon: CloudRain, color: "text-blue-500" };
  if (c.includes("rain")) return { Icon: CloudDrizzle, color: "text-sky-500" };
  if (c.includes("cloudy") && c.includes("partly")) return { Icon: CloudSun, color: "text-amber-500" };
  if (c.includes("cloud")) return { Icon: Cloud, color: "text-slate-400" };
  return { Icon: Sun, color: "text-amber-500" };
}

// One plain-language line telling the farmer what today's weather means for ponds.
function pondAdvice(w: WeatherData): { ok: boolean; text: string } {
  const c = w.condition.toLowerCase();
  if (c.includes("heavy")) return { ok: false, text: "Heavy rain — check pond bunds and keep aerators ready." };
  if (w.windSpeed >= 22) return { ok: false, text: "Strong wind — secure aerators and feed trays." };
  if (w.waterTemp >= 32) return { ok: false, text: "Water is warm — feed less and run aerators in the afternoon." };
  if (c.includes("rain")) return { ok: true, text: "Light rain expected — normal pond care is fine." };
  return { ok: true, text: "Good conditions for feeding and pond work today." };
}

export function WeatherForecast() {
  const [location, setLocation] = useState(
    () => localStorage.getItem("aquai-weather-location") || "Bhimavaram",
  );
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    // Deterministic mock based on the location string so the UI is stable.
    const seed = location.length * 7;
    await new Promise((r) => setTimeout(r, 350));
    const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain"];
    setWeather({
      location,
      temperature: 26 + (seed % 8),
      condition: conditions[seed % conditions.length],
      humidity: 65 + (seed % 25),
      windSpeed: 8 + (seed % 18),
      waterTemp: 24 + (seed % 6),
      forecast: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => ({
        day,
        high: 28 + ((seed + i * 3) % 7),
        low: 22 + ((seed + i * 2) % 5),
        condition: conditions[(seed + i) % conditions.length],
        rainChance: (seed + i * 11) % 80,
      })),
      alert:
        seed % 3 === 0
          ? { message: "Strong winds expected this evening. Secure pond aerators." }
          : null,
    });
    setLoading(false);
  }, [location]);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);
  useEffect(() => { localStorage.setItem("aquai-weather-location", location); }, [location]);

  return (
    <div className="space-y-5">
      {/* Location picker — selecting a place updates instantly */}
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-teal-300" />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-teal-400/40 outline-none max-w-[16rem]"
        >
          {WEST_GODAVARI.map((loc) => (
            <option key={loc} value={loc} className="bg-background">{loc}</option>
          ))}
        </select>
        <span className="text-xs text-foreground/40">West Godavari, AP</span>
        {loading && <span className="text-xs text-teal-300 animate-pulse">updating…</span>}
      </div>

      {weather && (
        <>
          {/* Big, clear "today" card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-teal-500/15 to-blue-500/10 border border-teal-400/20 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-foreground/45 mb-1">Today in {weather.location}</div>
                <div className="text-5xl font-bold text-foreground leading-none">{weather.temperature}°C</div>
                <div className="text-sm text-foreground/60 mt-2">{weather.condition}</div>
              </div>
              {(() => { const { Icon, color } = conditionIcon(weather.condition); return <Icon className={`w-16 h-16 ${color}`} />; })()}
            </div>

            {/* Plain-language pond advice */}
            {(() => {
              const a = pondAdvice(weather);
              return (
                <div className={`mt-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${
                  a.ok ? "bg-emerald-400/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-400/10 text-amber-700 dark:text-amber-300"
                }`}>
                  {a.ok ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span>{a.text}</span>
                </div>
              );
            })()}
          </motion.div>

          {/* Three essentials farmers act on */}
          <div className="grid grid-cols-3 gap-3">
            <Stat icon={Waves} label="Water temp" value={`${weather.waterTemp}°C`} />
            <Stat icon={Wind} label="Wind" value={`${weather.windSpeed} km/h`} />
            <Stat icon={Droplets} label="Humidity" value={`${weather.humidity}%`} />
          </div>

          {/* Simple 5-day outlook — just day, sky, temps, and chance of rain */}
          <div>
            <div className="text-sm font-semibold text-foreground mb-2">Next 5 days</div>
            <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
              {weather.forecast.map((day, i) => {
                const { Icon, color } = conditionIcon(day.condition);
                const rainy = day.rainChance >= 50;
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 text-sm font-semibold text-foreground shrink-0">{day.day}</div>
                    <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                    <div className="flex-1 text-sm text-foreground/60 truncate">{day.condition}</div>
                    <div className={`w-16 text-right text-xs font-medium shrink-0 ${rainy ? "text-sky-600" : "text-foreground/40"}`}>
                      {day.rainChance}% rain
                    </div>
                    <div className="w-16 text-right text-sm shrink-0">
                      <span className="font-semibold text-foreground">{day.high}°</span>
                      <span className="text-foreground/40"> / {day.low}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Single clear alert when present */}
          {weather.alert && (
            <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-sm text-foreground/80">{weather.alert.message}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-card border border-border text-center">
      <Icon className="w-5 h-5 text-teal-300 mx-auto mb-1.5" />
      <div className="text-base font-bold text-foreground">{value}</div>
      <div className="text-[11px] text-foreground/55 mt-0.5">{label}</div>
    </div>
  );
}
