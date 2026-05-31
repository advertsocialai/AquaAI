/**
 * Live weather via Open-Meteo (https://open-meteo.com) — free, no API key,
 * CORS-enabled so the browser can call it directly. We map WMO weather codes
 * to the simple condition strings the dashboard already understands.
 *
 * Coordinates are for West Godavari district towns (Andhra Pradesh). Unknown
 * towns fall back to Bhimavaram, the district's aquaculture hub.
 */

export interface LiveWeather {
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

// Lat/long for West Godavari towns. Centroid-ish coordinates are fine for
// district-scale weather; precision beyond ~town level doesn't change the
// forecast meaningfully.
export const TOWN_COORDS: Record<string, { lat: number; lon: number }> = {
  Bhimavaram: { lat: 16.544, lon: 81.521 },
  Tadepalligudem: { lat: 16.815, lon: 81.527 },
  Tanuku: { lat: 16.754, lon: 81.682 },
  Narsapur: { lat: 16.434, lon: 81.703 },
  Palakollu: { lat: 16.516, lon: 81.731 },
  Akiveedu: { lat: 16.587, lon: 81.378 },
  Undi: { lat: 16.609, lon: 81.451 },
  Veeravasaram: { lat: 16.555, lon: 81.610 },
  Kalla: { lat: 16.640, lon: 81.555 },
  Achanta: { lat: 16.585, lon: 81.745 },
  Penugonda: { lat: 16.654, lon: 81.745 },
  Attili: { lat: 16.700, lon: 81.610 },
  Iragavaram: { lat: 16.760, lon: 81.610 },
  Nidadavolu: { lat: 16.910, lon: 81.672 },
  Ganapavaram: { lat: 16.700, lon: 81.460 },
  Pentapadu: { lat: 16.820, lon: 81.560 },
  Unguturu: { lat: 16.760, lon: 81.400 },
  Bhimadole: { lat: 16.840, lon: 81.350 },
  Pedavegi: { lat: 16.840, lon: 81.180 },
  Pedapadu: { lat: 16.780, lon: 81.230 },
  Denduluru: { lat: 16.790, lon: 81.150 },
  Kovvur: { lat: 17.013, lon: 81.730 },
  Chagallu: { lat: 16.960, lon: 81.700 },
  Tallapudi: { lat: 17.040, lon: 81.610 },
  Gopalapuram: { lat: 16.980, lon: 81.470 },
  Koyyalagudem: { lat: 17.010, lon: 81.250 },
  Jangareddygudem: { lat: 17.123, lon: 81.295 },
  Polavaram: { lat: 17.247, lon: 81.645 },
  Buttayagudem: { lat: 17.190, lon: 81.270 },
  Chintalapudi: { lat: 17.070, lon: 80.970 },
  Kamavarapukota: { lat: 16.980, lon: 81.060 },
  Lingapalem: { lat: 16.920, lon: 81.030 },
  "T. Narasapuram": { lat: 17.060, lon: 81.130 },
  Devarapalli: { lat: 17.080, lon: 81.560 },
  Nallajerla: { lat: 16.940, lon: 81.450 },
  Dwarakatirumala: { lat: 16.900, lon: 81.380 },
  Mogalturu: { lat: 16.460, lon: 81.650 },
  Yelamanchili: { lat: 16.520, lon: 81.600 },
  Poduru: { lat: 16.600, lon: 81.560 },
  Palacharla: { lat: 16.820, lon: 81.640 },
};

// WMO weather interpretation codes → our simple condition strings.
function wmoToCondition(code: number): string {
  if (code === 0) return "Sunny";
  if (code === 1 || code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Cloudy"; // fog
  if (code >= 51 && code <= 57) return "Light Rain"; // drizzle
  if (code >= 61 && code <= 65) return code >= 65 ? "Heavy Rain" : "Light Rain";
  if (code >= 66 && code <= 67) return "Light Rain"; // freezing rain (rare here)
  if (code >= 80 && code <= 82) return code === 82 ? "Heavy Rain" : "Light Rain"; // showers
  if (code >= 95) return "Heavy Rain"; // thunderstorm
  return "Cloudy";
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
  };
}

/**
 * Fetch live weather for a West Godavari town. Throws on network/HTTP error
 * so the caller can fall back to its offline mock.
 */
export async function fetchLiveWeather(town: string, signal?: AbortSignal): Promise<LiveWeather> {
  const { lat, lon } = TOWN_COORDS[town] ?? TOWN_COORDS.Bhimavaram;

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "Asia/Kolkata",
    forecast_days: "5",
    wind_speed_unit: "kmh",
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const data = (await res.json()) as OpenMeteoResponse;

  const cur = data.current ?? {};
  const temperature = Math.round(cur.temperature_2m ?? 28);
  const condition = wmoToCondition(cur.weather_code ?? 1);
  const humidity = Math.round(cur.relative_humidity_2m ?? 70);
  const windSpeed = Math.round(cur.wind_speed_10m ?? 10);

  // Pond water sits a few degrees cooler than peak air temp in this region.
  const waterTemp = Math.max(20, Math.round(temperature - 2));

  const daily = data.daily ?? {};
  const times = daily.time ?? [];
  const forecast = times.map((iso, i) => {
    const d = new Date(iso + "T00:00:00");
    return {
      day: DAY_LABELS[d.getDay()],
      high: Math.round(daily.temperature_2m_max?.[i] ?? temperature + 2),
      low: Math.round(daily.temperature_2m_min?.[i] ?? temperature - 4),
      condition: wmoToCondition(daily.weather_code?.[i] ?? 1),
      rainChance: Math.round(daily.precipitation_probability_max?.[i] ?? 0),
    };
  });

  // Auto-raise a clear alert from the live data when conditions warrant it.
  let alert: { message: string } | null = null;
  if (condition.includes("Heavy") || (forecast[0]?.rainChance ?? 0) >= 80) {
    alert = { message: "Heavy rain likely today. Check pond bunds and keep aerators ready." };
  } else if (windSpeed >= 28) {
    alert = { message: "Strong winds today. Secure pond aerators and feed trays." };
  }

  return { location: town, temperature, condition, humidity, windSpeed, waterTemp, forecast, alert };
}
