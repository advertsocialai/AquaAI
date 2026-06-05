/**
 * Scan & Screen service.
 *
 * SCREENING, not diagnosis. A phone photo reports *visible signs* only — it can
 * never confirm a disease (EHP/WSSV need PCR/RPA lab work) and never recommends
 * drugs or doses. The UI and this layer both hold that line.
 *
 * Backend-ready with on-device fallback:
 *   1. POST the image to OUR backend (VITE_API_BASE + /scan/disease). The API
 *      key stays server-side — never in the browser. The server runs the real
 *      vision model and returns the contract below.
 *   2. If the backend is unreachable/offline/not deployed yet, fall back to the
 *      on-device screening (src/ml/runtime.ts) so the feature still works today.
 *
 * To go live with the real model: deploy the /scan/disease endpoint (FastAPI or
 * a Supabase Edge Function) that returns ScreenResponse — no frontend change.
 */
import { inferDisease } from '@/ml/runtime';
import type { RiskLevel } from '@/features/quick-tools/types';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api/v1';

/** Unified result the UI renders, regardless of where the screening ran. */
export interface ScreenResult {
  usable: boolean;
  risk: RiskLevel;
  confidence: number;          // 0..1
  signs: string[];             // sign keys/labels surfaced (highest first)
  summary: string;             // server plain-language text, or '' (UI fills by risk)
  nextSteps: string[];         // server guidance, or [] (UI fills by risk)
  source: 'device' | 'server';
  modelVersion: string;
}

/** Raw shape our backend returns (mirrors the screening contract). */
interface ScreenResponse {
  usable?: boolean;
  risk?: RiskLevel;
  confidence?: number | 'low' | 'moderate' | 'high';
  observed_signs?: string[];
  summary?: string;
  next_steps?: string[];
  model_version?: string;
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(',');
  const mime = /data:([^;]+)/.exec(head)?.[1] ?? 'image/jpeg';
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function confToNumber(c: ScreenResponse['confidence']): number {
  if (typeof c === 'number') return c;
  if (c === 'high') return 0.85;
  if (c === 'moderate') return 0.65;
  if (c === 'low') return 0.4;
  return 0.6;
}

const VALID_RISK: RiskLevel[] = ['green', 'amber', 'red', 'inconclusive'];

/** Try the backend; returns null on any failure so the caller can fall back. */
async function screenViaBackend(dataUrl: string): Promise<ScreenResult | null> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return null;
  try {
    const form = new FormData();
    form.append('image', dataUrlToBlob(dataUrl), 'scan.jpg');
    const res = await fetch(`${API_BASE}/scan/disease`, { method: 'POST', body: form });
    if (!res.ok) return null;
    const j = (await res.json()) as ScreenResponse;
    const risk = VALID_RISK.includes(j.risk as RiskLevel) ? (j.risk as RiskLevel) : 'inconclusive';
    return {
      usable: j.usable !== false,
      risk,
      confidence: confToNumber(j.confidence),
      signs: Array.isArray(j.observed_signs) ? j.observed_signs : [],
      summary: typeof j.summary === 'string' ? j.summary : '',
      nextSteps: Array.isArray(j.next_steps) ? j.next_steps : [],
      source: 'server',
      modelVersion: j.model_version ?? 'server',
    };
  } catch {
    return null;
  }
}

/** On-device screening (always available, offline). Sign labels stay as keys so the UI can translate them. */
async function screenOnDevice(dataUrl: string): Promise<ScreenResult> {
  const r = await inferDisease(dataUrl);
  const signs = r.signals.filter((s) => s.score > 0.4).map((s) => s.label);
  return {
    usable: r.confidence >= 0.6,
    risk: r.risk,
    confidence: r.confidence,
    signs,
    summary: '',        // UI fills a translated summary by risk for the device path
    nextSteps: [],      // UI fills translated management guidance by risk
    source: 'device',
    modelVersion: r.modelVersion,
  };
}

/**
 * Screen a captured shrimp/sample photo. Backend first, on-device fallback.
 * Always resolves — never throws — so the UI flow can't dead-end.
 */
export async function screenShrimp(imageDataUrl: string): Promise<ScreenResult> {
  const viaBackend = await screenViaBackend(imageDataUrl);
  return viaBackend ?? screenOnDevice(imageDataUrl);
}
