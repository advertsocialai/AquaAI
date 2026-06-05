/**
 * On-device inference runtime for the Quick Tools.
 *
 * MOCK-FIRST: today this returns deterministic stub results so the full capture
 * → result → save flow is buildable and works offline before real models ship.
 *
 * To go live: load a quantized model from /public/models/<tool>.onnx with
 * onnxruntime-web (prefer WebGPU, fall back to WASM), warm it up once, and
 * replace the stub bodies with real pre-process → infer → post-process.
 * Every result carries `modelVersion` so older certificates stay interpretable.
 */
import type { DiseaseResult, RiskLevel, SeedResult } from '@/features/quick-tools/types';

const MODEL_VERSION = 'stub-0.1';

/** Stable 0..1 hash of a data URL so stub numbers are deterministic per image. */
function seedFrom(dataUrl: string): number {
  let h = 2166136261;
  for (let i = 0; i < dataUrl.length; i += 7) {
    h ^= dataUrl.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const STAGES: SeedResult['stage'][] = ['Nauplius', 'Zoea', 'Mysis', 'PL'];

export async function inferSeed(
  imageDataUrl: string,
  opts: { dilution?: number; invoiceCount?: number } = {},
): Promise<SeedResult> {
  const s = seedFrom(imageDataUrl);
  const base = Math.round(800 + s * 1600);                 // per-frame count
  const count = Math.round(base * (opts.dilution && opts.dilution > 0 ? opts.dilution : 1));
  const band = Math.round(count * 0.06);
  const livePct = Math.round(90 + s * 9);                  // 90–99%
  const sizeCv = Math.round((8 + s * 10) * 10) / 10;       // 8–18%
  const stage: SeedResult['stage'] = s > 0.5 ? 'PL' : STAGES[Math.floor(s * 3)];
  const plStage = stage === 'PL' ? 8 + Math.floor(s * 8) : undefined;
  const confidence = Math.round((0.82 + s * 0.15) * 100) / 100;

  const result: SeedResult = {
    tool: 'seed',
    count,
    countBand: [count - band, count + band],
    livePct,
    sizeCv,
    stage,
    plStage,
    confidence,
    source: 'device',
    modelVersion: MODEL_VERSION,
  };
  if (opts.invoiceCount && opts.invoiceCount > 0 && count < opts.invoiceCount * 0.95) {
    result.invoiceMismatch = { field: 'count', expected: opts.invoiceCount, got: count };
  }
  return result;
}

export async function inferDisease(imageDataUrl: string): Promise<DiseaseResult> {
  const s = seedFrom(imageDataUrl);
  const whiteFeces = Math.round(s * 100) / 100;
  const discolor = Math.round(((s * 1.7) % 1) * 100) / 100;
  const lesions = Math.round(((s * 2.3) % 1) * 100) / 100;
  const top = Math.max(whiteFeces, discolor, lesions);
  const risk: RiskLevel = top > 0.66 ? 'red' : top > 0.4 ? 'amber' : 'green';
  return {
    tool: 'disease',
    risk,
    signals: [
      { label: 'white_feces', score: whiteFeces },
      { label: 'hp_discoloration', score: discolor },
      { label: 'surface_lesions', score: lesions },
    ].sort((a, b) => b.score - a.score),
    confidence: Math.round((0.7 + s * 0.25) * 100) / 100,
    source: 'device',
    modelVersion: MODEL_VERSION,
  };
}
