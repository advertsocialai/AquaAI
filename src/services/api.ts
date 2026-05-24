/**
 * AquaI service layer. Frontend talks ONLY to these functions — never to
 * a hard-coded backend URL. To swap mocks for real data, change
 * USE_STUBS to false and implement the real-backend branches.
 */

const USE_STUBS = true;
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api/v1';

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

// ── Types ──────────────────────────────────────────────────────────────────────

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

// ── Pricing ────────────────────────────────────────────────────────────────────

const PRAWN_PRICES: PriceRow[] = [
  { species: 'L. vannamei',          size: '30 count',    low: 480, high: 550, trend: 'up' },
  { species: 'L. vannamei',          size: '40 count',    low: 380, high: 450, trend: 'up' },
  { species: 'L. vannamei',          size: '50 count',    low: 320, high: 380, trend: 'flat' },
  { species: 'L. vannamei',          size: '60 count',    low: 280, high: 330, trend: 'flat' },
  { species: 'L. vannamei',          size: '70 count',    low: 240, high: 290, trend: 'down' },
  { species: 'L. vannamei',          size: '80 count',    low: 210, high: 260, trend: 'down' },
  { species: 'L. vannamei',          size: '100 count',   low: 180, high: 220, trend: 'down' },
  { species: 'P. monodon (Tiger)',   size: '20 count',    low: 750, high: 900, trend: 'up' },
  { species: 'P. monodon (Tiger)',   size: '30 count',    low: 600, high: 720, trend: 'up' },
  { species: 'Scampi',               size: '6-10 count',  low: 550, high: 700, trend: 'up' },
];

export async function getPrices(category: 'prawn' | 'freshwater' | 'marine'): Promise<PriceRow[]> {
  if (USE_STUBS) {
    if (category === 'prawn') return delay(PRAWN_PRICES);
    if (category === 'freshwater') return delay([] as PriceRow[]);
    return delay([] as PriceRow[]);
  }
  return (await realGet<PriceRow[]>(`/pricing/${category}`)) ?? [];
}

export async function getPriceHistory(speciesId: string, range: '7d' | '30d' | '90d' | '1y'): Promise<{ x: string; price: number }[]> {
  if (USE_STUBS) {
    // History is generated client-side in PriceHistoryChart; service exists so it can be swapped later.
    return delay([]);
  }
  return (await realGet(`/pricing/history?species=${speciesId}&range=${range}`)) ?? [];
}

// ── Outbreaks & Surveillance ───────────────────────────────────────────────────

const OUTBREAKS: Outbreak[] = [
  { district: 'West Godavari', state: 'AP', species: 'L. vannamei', disease: 'EHP',   farms: 14, severity: 'high'   },
  { district: 'Krishna',       state: 'AP', species: 'L. vannamei', disease: 'WSSV',  farms: 8,  severity: 'high'   },
  { district: 'Nellore',       state: 'AP', species: 'L. vannamei', disease: 'AHPND', farms: 3,  severity: 'medium' },
  { district: 'Surat',         state: 'GJ', species: 'L. vannamei', disease: 'EHP',   farms: 5,  severity: 'medium' },
  { district: 'Bhubaneswar',   state: 'OD', species: 'P. monodon',  disease: 'WSSV',  farms: 2,  severity: 'low'    },
];

export async function getOutbreaks(): Promise<Outbreak[]> {
  if (USE_STUBS) return delay(OUTBREAKS);
  return (await realGet<Outbreak[]>('/surveillance/outbreaks')) ?? [];
}

// ── Risk scoring (for banks/insurers) ──────────────────────────────────────────

const FARM_RISK: FarmRisk[] = [
  { id: 'F-1142', farmer: 'V. Ramana',     district: 'Bhimavaram', acres: 4.5, qsAvg: 91, outbreakRisk: 12, band: 'A', loanReq:  800000, recommended:  800000 },
  { id: 'F-1187', farmer: 'K. Srinivasan', district: 'Nellore',    acres: 2.0, qsAvg: 84, outbreakRisk: 28, band: 'B', loanReq:  400000, recommended:  350000 },
  { id: 'F-1203', farmer: 'A. Mohanty',    district: 'Paradip',    acres: 1.5, qsAvg: 72, outbreakRisk: 48, band: 'C', loanReq:  300000, recommended:  180000 },
  { id: 'F-1221', farmer: 'S. Banerjee',   district: 'Haldia',     acres: 1.0, qsAvg: 61, outbreakRisk: 64, band: 'D', loanReq:  250000, recommended:       0 },
  { id: 'F-1234', farmer: 'P. Patel',      district: 'Surat',      acres: 6.0, qsAvg: 88, outbreakRisk: 18, band: 'A', loanReq: 1200000, recommended: 1200000 },
];

export async function getFarmRiskBook(): Promise<FarmRisk[]> {
  if (USE_STUBS) return delay(FARM_RISK);
  return (await realGet<FarmRisk[]>('/risk/farms')) ?? [];
}

// ── Weather ────────────────────────────────────────────────────────────────────

export async function getWeather(district: string): Promise<WeatherSnapshot> {
  if (USE_STUBS) {
    return delay({ district, tempC: 29, condition: 'partly cloudy', rainMm: 65, cycloneAlert: false });
  }
  const r = await realGet<WeatherSnapshot>(`/weather?district=${encodeURIComponent(district)}`);
  return r ?? { district, tempC: 0, condition: 'unknown', rainMm: 0, cycloneAlert: false };
}

// ── Auth (stubs only — real auth via Firebase / Supabase / Aadhaar e-KYC) ──────

export async function requestOtp(_mobile: string): Promise<{ ok: boolean; otpHint?: string }> {
  return delay({ ok: true, otpHint: '••••42' });
}

export async function verifyOtp(_mobile: string, otp: string): Promise<{ ok: boolean; token?: string }> {
  return delay({ ok: otp.length === 6, token: otp.length === 6 ? 'stub-jwt-token' : undefined });
}

export async function signup(payload: {
  mobile: string;
  role: string;
  name: string;
  kyc: string;
  location: string;
}): Promise<{ ok: boolean; userId?: string }> {
  return delay({ ok: true, userId: `usr_${Date.now()}` });
}

// ── Chat (stub — wire to Claude API or Anthropic SDK later) ────────────────────

export async function askAssistant(question: string, lang: string = 'en'): Promise<string> {
  if (USE_STUBS) {
    // Mirrors ChatBot rules so the surface is identical.
    const t = question.toLowerCase();
    if (t.includes('price'))     return 'Vannamei 40-count is ₹420/kg today.';
    if (t.includes('ehp'))       return '2 EHP-confirmed farms within 5 km in 48h.';
    if (t.includes('feed'))      return 'For 500 kg biomass at 4% body weight: 20 kg/day starter feed.';
    if (t.includes('weather'))   return 'IMD forecast: 65mm rain tonight.';
    return 'I can help with pricing, disease alerts, feeding and weather.';
  }
  const res = await fetch(`${API_BASE}/assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, lang }),
  });
  const data = await res.json();
  return data.reply ?? '';
}

export const __config = { USE_STUBS, API_BASE };
