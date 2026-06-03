/**
 * AquaAI service layer.
 *
 * Frontend talks ONLY to these functions — never to a hard-coded backend URL.
 * Real backend wired by default; pass ?stubs in the URL (or set localStorage
 * `aquai-stubs=1`) to force offline mock data for design/dev work.
 *
 * Adapters live here so every UI consumer keeps the same shape regardless of
 * what the API returns.
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api/v1';

function stubsMode(): boolean {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).has('stubs')) return true;
  return window.localStorage?.getItem('aquai-stubs') === '1';
}

async function realGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((r) => setTimeout(() => r(value), ms));
}

// ── Types (the UI's expected shapes) ─────────────────────────────────────────

export type PriceRow = {
  species: string;
  size: string;
  low: number;
  high: number;
  trend: 'up' | 'down' | 'flat';
};

export type Outbreak = {
  district: string;
  state: string;
  species: string;
  disease: string;
  farms: number;
  severity: 'high' | 'medium' | 'low';
};

export type FarmRisk = {
  id: string;
  farmer: string;
  district: string;
  acres: number;
  qsAvg: number;
  outbreakRisk: number;
  band: 'A' | 'B' | 'C' | 'D';
  loanReq: number;
  recommended: number;
};

export type WeatherSnapshot = {
  district: string;
  tempC: number;
  condition: string;
  rainMm: number;
  cycloneAlert: boolean;
};

// ── Pricing — wraps /pricing/{category} and /pricing/history ─────────────────

const PRAWN_PRICES: PriceRow[] = [
  { species: 'L. vannamei',        size: '30 count',    low: 480, high: 550, trend: 'up'   },
  { species: 'L. vannamei',        size: '40 count',    low: 380, high: 450, trend: 'up'   },
  { species: 'L. vannamei',        size: '50 count',    low: 320, high: 380, trend: 'flat' },
  { species: 'L. vannamei',        size: '60 count',    low: 280, high: 330, trend: 'flat' },
  { species: 'L. vannamei',        size: '70 count',    low: 240, high: 290, trend: 'down' },
  { species: 'L. vannamei',        size: '80 count',    low: 210, high: 260, trend: 'down' },
  { species: 'L. vannamei',        size: '100 count',   low: 180, high: 220, trend: 'down' },
  { species: 'P. monodon (Tiger)', size: '20 count',    low: 750, high: 900, trend: 'up'   },
  { species: 'P. monodon (Tiger)', size: '30 count',    low: 600, high: 720, trend: 'up'   },
  { species: 'Scampi',             size: '6-10 count',  low: 550, high: 700, trend: 'up'   },
];

export async function getPrices(
  category: 'prawn' | 'freshwater' | 'marine',
): Promise<PriceRow[]> {
  if (stubsMode()) {
    return delay(category === 'prawn' ? PRAWN_PRICES : []);
  }
  return (await realGet<PriceRow[]>(`/pricing/${category}`)) ?? [];
}

export async function getPriceHistory(
  speciesId: string,
  range: '7d' | '30d' | '90d' | '1y',
): Promise<{ x: string; price: number }[]> {
  if (stubsMode()) return delay([]);

  // Backend returns [{ date, price }]; UI consumes [{ x, price }].
  const points = await realGet<Array<{ date: string; price: number }>>(
    `/pricing/history?species=${encodeURIComponent(speciesId)}&range=${range}`,
  );
  return (points ?? []).map((p) => ({ x: p.date, price: p.price }));
}

// ── Outbreaks ────────────────────────────────────────────────────────────────

const OUTBREAKS: Outbreak[] = [
  { district: 'West Godavari', state: 'AP', species: 'L. vannamei', disease: 'EHP',   farms: 14, severity: 'high'   },
  { district: 'Krishna',       state: 'AP', species: 'L. vannamei', disease: 'WSSV',  farms: 8,  severity: 'high'   },
  { district: 'Nellore',       state: 'AP', species: 'L. vannamei', disease: 'AHPND', farms: 3,  severity: 'medium' },
  { district: 'Surat',         state: 'GJ', species: 'L. vannamei', disease: 'EHP',   farms: 5,  severity: 'medium' },
  { district: 'Bhubaneswar',   state: 'OD', species: 'P. monodon',  disease: 'WSSV',  farms: 2,  severity: 'low'    },
];

export async function getOutbreaks(): Promise<Outbreak[]> {
  if (stubsMode()) return delay(OUTBREAKS);
  return (await realGet<Outbreak[]>('/surveillance/outbreaks')) ?? [];
}

// ── Risk scoring (banks / insurers) ──────────────────────────────────────────

const FARM_RISK: FarmRisk[] = [
  { id: 'F-1142', farmer: 'V. Ramana',     district: 'Bhimavaram', acres: 4.5, qsAvg: 91, outbreakRisk: 12, band: 'A', loanReq:  800000, recommended:  800000 },
  { id: 'F-1187', farmer: 'K. Srinivasan', district: 'Nellore',    acres: 2.0, qsAvg: 84, outbreakRisk: 28, band: 'B', loanReq:  400000, recommended:  350000 },
  { id: 'F-1203', farmer: 'A. Mohanty',    district: 'Paradip',    acres: 1.5, qsAvg: 72, outbreakRisk: 48, band: 'C', loanReq:  300000, recommended:  180000 },
  { id: 'F-1221', farmer: 'S. Banerjee',   district: 'Haldia',     acres: 1.0, qsAvg: 61, outbreakRisk: 64, band: 'D', loanReq:  250000, recommended:       0 },
  { id: 'F-1234', farmer: 'P. Patel',      district: 'Surat',      acres: 6.0, qsAvg: 88, outbreakRisk: 18, band: 'A', loanReq: 1200000, recommended: 1200000 },
];

export async function getFarmRiskBook(): Promise<FarmRisk[]> {
  if (stubsMode()) return delay(FARM_RISK);
  return (await realGet<FarmRisk[]>('/risk/farms')) ?? [];
}

// ── Weather (snake_case → camelCase adapter) ─────────────────────────────────

type WeatherBackend = {
  district: string;
  temp_c: number;
  condition: string;
  rain_mm: number;
  cyclone_alert: boolean;
};

export async function getWeather(district: string): Promise<WeatherSnapshot> {
  const fallback: WeatherSnapshot = {
    district, tempC: 0, condition: 'unknown', rainMm: 0, cycloneAlert: false,
  };
  if (stubsMode()) {
    return delay({
      district, tempC: 29, condition: 'partly cloudy', rainMm: 65, cycloneAlert: false,
    });
  }
  const r = await realGet<WeatherBackend>(
    `/advisory/weather?district=${encodeURIComponent(district)}`,
  );
  if (!r) return fallback;
  return {
    district: r.district,
    tempC: r.temp_c,
    condition: r.condition,
    rainMm: r.rain_mm,
    cycloneAlert: r.cyclone_alert,
  };
}

// ── Auth (stubs until SMS gateway is contracted) ─────────────────────────────

export async function requestOtp(_mobile: string): Promise<{ ok: boolean; otpHint?: string }> {
  return delay({ ok: true, otpHint: '••••42' });
}

export async function verifyOtp(_mobile: string, otp: string): Promise<{ ok: boolean; token?: string }> {
  return delay({ ok: otp.length === 6, token: otp.length === 6 ? 'stub-jwt-token' : undefined });
}

export async function signup(_payload: {
  mobile: string;
  role: string;
  name: string;
  kyc: string;
  location: string;
}): Promise<{ ok: boolean; userId?: string }> {
  return delay({ ok: true, userId: `usr_${Date.now()}` });
}

// ── Assistant (real Claude Opus via /advisory/assistant) ─────────────────────

export async function askAssistant(question: string, lang: string = 'en'): Promise<string> {
  if (stubsMode()) {
    const t = question.toLowerCase();
    if (t.includes('price'))   return 'Vannamei 40-count is ₹420/kg today.';
    if (t.includes('ehp'))     return '2 EHP-confirmed farms within 5 km in 48h.';
    if (t.includes('feed'))    return 'For 500 kg biomass at 4% body weight: 20 kg/day starter feed.';
    if (t.includes('weather')) return 'IMD forecast: 65mm rain tonight.';
    return 'I can help with pricing, disease alerts, feeding and weather.';
  }
  try {
    const res = await fetch(`${API_BASE}/advisory/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, lang }),
    });
    if (!res.ok) return 'Service temporarily unavailable.';
    const data = await res.json();
    return data.reply ?? data.answer ?? data.message ?? '';
  } catch {
    return 'Service temporarily unavailable.';
  }
}

// ── Service-provider requests ────────────────────────────────────────────────

export type ServiceRequestPayload = {
  providerId: string;
  values: Record<string, string>;
  timestamp: string;
};

export type ServiceRequestResult = { ok: boolean; queued?: boolean };

const SR_QUEUE_KEY = 'aquai-service-request-queue';

function queueServiceRequest(req: ServiceRequestPayload): void {
  try {
    const q: ServiceRequestPayload[] = JSON.parse(localStorage.getItem(SR_QUEUE_KEY) || '[]');
    q.push(req);
    localStorage.setItem(SR_QUEUE_KEY, JSON.stringify(q));
  } catch {
    /* storage unavailable — nothing else we can do */
  }
}

async function postServiceRequest(req: ServiceRequestPayload): Promise<boolean> {
  const res = await fetch(`${API_BASE}/service-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`bad status ${res.status}`);
  return true;
}

/**
 * Submit a service-provider request. Mock-first: returns a stubbed success in
 * stubs mode. Offline-safe: if the network send fails, the request is queued in
 * localStorage and `queued: true` is returned (caller shows "will send later").
 */
export async function submitServiceRequest(req: ServiceRequestPayload): Promise<ServiceRequestResult> {
  if (stubsMode()) {
    return delay({ ok: true }, 400);
  }
  try {
    await postServiceRequest(req);
    return { ok: true };
  } catch {
    queueServiceRequest(req);
    return { ok: false, queued: true };
  }
}

/** Resend any queued requests (call on app load + on the window 'online' event). */
export async function flushServiceRequestQueue(): Promise<void> {
  let q: ServiceRequestPayload[];
  try {
    q = JSON.parse(localStorage.getItem(SR_QUEUE_KEY) || '[]');
  } catch {
    return;
  }
  if (!q.length) return;
  const remaining: ServiceRequestPayload[] = [];
  for (const req of q) {
    try {
      await postServiceRequest(req);
    } catch {
      remaining.push(req);
    }
  }
  try {
    localStorage.setItem(SR_QUEUE_KEY, JSON.stringify(remaining));
  } catch {
    /* ignore */
  }
}

export const __config = { API_BASE };
