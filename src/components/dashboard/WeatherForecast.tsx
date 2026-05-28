import { useEffect, useState, useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { AlertTriangle, CloudRain, MapPin, RefreshCw, Sun, CloudLightning, Cloud } from "lucide-react";

type WeatherDay = {
  date: string;
  temp_min_c: number;
  temp_max_c: number;
  rain_mm: number;
  condition: string;
};

type WeatherPayload = {
  district: string;
  lat: number;
  lng: number;
  today: WeatherDay;
  forecast: WeatherDay[];
  rain_alert: boolean;
  cyclone_alert: boolean;
};

type District = { name: string; locations: string[] };

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "http://localhost:8000/api/v1";

function conditionIcon(cond: string) {
  if (cond === "thunderstorm") return <CloudLightning className="w-4 h-4 text-amber-500" />;
  if (cond === "rain" || cond === "drizzle") return <CloudRain className="w-4 h-4 text-sky-500" />;
  if (cond === "sunny") return <Sun className="w-4 h-4 text-amber-500" />;
  return <Cloud className="w-4 h-4 text-slate-400" />;
}

export function WeatherForecast() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [location, setLocation] = useState<string>(() =>
    localStorage.getItem("aquai-weather-location") || "Bhimavaram",
  );
  const [data, setData] = useState<WeatherPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Locations list (one fetch, cached forever in component lifecycle)
  useEffect(() => {
    fetch(`${API_BASE}/advisory/locations`)
      .then((r) => r.json())
      .then((d) => setDistricts(d.districts ?? []))
      .catch(() => {});
  }, []);

  // Weather fetch — re-run on location change + every 30 min
  const fetchWeather = () => {
    setLoading(true);
    setErr(null);
    fetch(`${API_BASE}/advisory/weather?location=${encodeURIComponent(location)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    localStorage.setItem("aquai-weather-location", location);
    fetchWeather();
    const id = setInterval(fetchWeather, 30 * 60 * 1000);   // 30 min
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return [data.today, ...data.forecast].map((d) => ({
      day: new Date(d.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
      date: d.date,
      rain: Number(d.rain_mm.toFixed(1)),
      min: Number(d.temp_min_c.toFixed(1)),
      max: Number(d.temp_max_c.toFixed(1)),
      condition: d.condition,
    }));
  }, [data]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-sky-600" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground">7-day weather</h3>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-sm rounded-md border border-input bg-background px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {districts.map((d) => (
              <optgroup key={d.name} label={d.name}>
                {d.locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            onClick={fetchWeather}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
            aria-label="Refresh weather"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Rain alarm banner */}
      {data?.rain_alert && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-900">Heavy rain / thunderstorm alert</p>
            <p className="text-amber-800/80">
              IMD-grade alert active for {data.district} in the next 3 days. Secure aeration backup,
              raise pond bunds, and review pH/DO twice daily.
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-64 w-full">
        {loading && !data && (
          <div className="h-full grid place-items-center text-sm text-muted-foreground">Loading forecast...</div>
        )}
        {err && !data && (
          <div className="h-full grid place-items-center text-sm text-destructive">Weather unavailable: {err}</div>
        )}
        {data && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rain" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} label={{ value: "mm", position: "insideTopLeft", offset: -5, fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis yAxisId="temp" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} label={{ value: "°C", position: "insideTopRight", offset: -5, fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(value: number, name: string) => {
                  if (name === "rain") return [`${value} mm`, "Rain"];
                  if (name === "min")  return [`${value}°C`, "Min temp"];
                  if (name === "max")  return [`${value}°C`, "Max temp"];
                  return [value, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="rain" dataKey="rain" name="Rain (mm)" fill="hsl(200, 90%, 60%)" radius={[4, 4, 0, 0]} />
              <Line yAxisId="temp" type="monotone" dataKey="max" name="Max °C" stroke="hsl(20, 80%, 55%)" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="temp" type="monotone" dataKey="min" name="Min °C" stroke="hsl(220, 70%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Per-day row */}
      {data && (
        <div className="grid grid-cols-7 gap-2 mt-4 text-center text-xs">
          {[data.today, ...data.forecast].map((d, i) => (
            <div key={d.date} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary/50">
              <div className="font-medium text-foreground">
                {i === 0 ? "Today" : new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" })}
              </div>
              {conditionIcon(d.condition)}
              <div className="font-semibold tabular-nums">{Math.round(d.temp_max_c)}°</div>
              <div className="text-muted-foreground tabular-nums">{Math.round(d.temp_min_c)}°</div>
              <div className="text-sky-600 tabular-nums text-[10px]">{d.rain_mm.toFixed(1)}mm</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
