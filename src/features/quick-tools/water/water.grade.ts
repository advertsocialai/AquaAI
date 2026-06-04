import type { RiskLevel, WaterResult } from '@/features/quick-tools/types';
import { WATER_PARAMS, type WaterParam } from './water.config';

function gradeParam(p: WaterParam, v: number): { level: RiskLevel; note: string } {
  if (v >= p.green[0] && v <= p.green[1]) return { level: 'green', note: '' };
  if (v >= p.amber[0] && v <= p.amber[1]) {
    const note = v < p.green[0] ? p.fix.low : p.fix.high;
    return { level: 'amber', note };
  }
  const note = v < p.amber[0] ? p.fix.low : p.fix.high;
  return { level: 'red', note };
}

const ORDER: Record<RiskLevel, number> = { green: 0, amber: 1, red: 2, inconclusive: 3 };

/** Grade entered readings deterministically: overall = worst parameter. */
export function gradeWater(readings: Record<string, number>): WaterResult {
  let worst: RiskLevel = 'green';
  let limiting: string | undefined;
  let guidance = 'All parameters are within the safe range. Keep monitoring daily.';

  for (const p of WATER_PARAMS) {
    const v = readings[p.key];
    if (v == null || Number.isNaN(v)) continue;
    const g = gradeParam(p, v);
    if (ORDER[g.level] > ORDER[worst]) {
      worst = g.level;
      limiting = p.label;
      guidance = g.note || guidance;
    }
  }

  return { tool: 'water', risk: worst, limiting: worst === 'green' ? undefined : limiting, readings, guidance };
}
