import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Cloud, CloudRain, CloudDrizzle, Sun, CloudSun, Wind, Droplets, Eye,
  MapPin, Umbrella, Thermometer,
} from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  waterTemp: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    rainfall: number;
  }>;
  alerts: Array<{
    type: string;
    message: string;
    severity: "low" | "medium" | "high";
  }>;
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
      visibility: 6 + (seed % 5),
      pressure: 1008 + (seed % 12),
      waterTemp: 24 + (seed % 6),
      forecast: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
        day,
        high: 28 + ((seed + i * 3) % 7),
        low: 22 + ((seed + i * 2) % 5),
        condition: conditions[(seed + i) % conditions.length],
        rainfall: (seed + i * 11) % 80,
      })),
      alerts:
        seed % 3 === 0
          ? [{ type: "Storm", message: "Strong winds expected this evening. Secure pond aerators.", severity: "high" }]
          : [],
    });
    setLoading(false);
  }, [location]);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);
  useEffect(() => { localStorage.setItem("aquai-weather-location", location); }, [location]);

  // Scale rainfall bars relative to the wettest day for clearer comparison.
  const maxRain = weather ? Math.max(10, ...weather.forecast.map((d) => d.rainfall)) : 100;

  return (
    <div className="space-y-6">
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
          {/* Current conditions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-2 md:col-span-1 p-4 rounded-xl bg-gradient-to-br from-teal-500/15 to-blue-500/10 border border-teal-400/20"
            >
              <div className="flex items-center gap-2">
                {(() => { const { Icon, color } = conditionIcon(weather.condition); return <Icon className={`w-7 h-7 ${color}`} />; })()}
                <div className="text-3xl font-bold text-foreground">{weather.temperature}°C</div>
              </div>
              <div className="text-sm text-foreground/60 mt-1">{weather.condition}</div>
              <div className="text-xs text-foreground/45 mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {weather.location}
              </div>
            </motion.div>

            <Stat icon={Droplets} label="Humidity" value={`${weather.humidity}%`} />
            <Stat icon={Wind} label="Wind" value={`${weather.windSpeed} km/h`} />
            <Stat icon={Eye} label="Visibility" value={`${weather.visibility} km`} />
          </div>

          {/* 7-day forecast — clearer: icon + temps + a rain-chance bar per day */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-foreground">7-day forecast</div>
              <div className="flex items-center gap-4 text-[11px] text-foreground/50">
                <span className="inline-flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-rose-400" /> High / Low °C</span>
                <span className="inline-flex items-center gap-1"><Umbrella className="w-3.5 h-3.5 text-sky-500" /> Rain chance</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
              {weather.forecast.map((day, i) => {
                const { Icon, color } = conditionIcon(day.condition);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    {/* Day */}
                    <div className="w-10 text-sm font-semibold text-foreground shrink-0">{day.day}</div>
                    {/* Condition icon */}
                    <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                    {/* Temps */}
                    <div className="w-20 shrink-0 text-sm">
                      <span className="font-semibold text-foreground">{day.high}°</span>
                      <span className="text-foreground/40"> / {day.low}°</span>
                    </div>
                    {/* Rain bar */}
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sky-500"
                          style={{ width: `${Math.round((day.rainfall / maxRain) * 100)}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-medium text-sky-600 shrink-0">{day.rainfall}%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Alerts */}
          {weather.alerts.length > 0 && (
            <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 p-4 flex items-start gap-3">
              <CloudRain className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-foreground">{weather.alerts[0].type} warning</div>
                <div className="text-xs text-foreground/60 mt-0.5">{weather.alerts[0].message}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-teal-300" />
        <span className="text-xs text-foreground/60">{label}</span>
      </div>
      <div className="text-lg font-bold text-foreground">{value}</div>
    </div>
  );
}
