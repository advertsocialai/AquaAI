import { describe, it, expect } from 'vitest';
import { gradeWater } from '@/features/quick-tools/water/water.grade';
import { inferSeed } from '@/ml/runtime';

/** Performance budgets for hot pure logic — catch accidental slowdowns. */
describe('performance budgets', () => {
  it('gradeWater: 50k evaluations under 250ms', () => {
    const t0 = performance.now();
    for (let i = 0; i < 50_000; i++) {
      gradeWater({ ph: 7 + (i % 30) / 10, do: 5, ammonia: (i % 10) / 10, temp: 30 });
    }
    expect(performance.now() - t0).toBeLessThan(250);
  });

  it('inferSeed (on-device stub): 500 scans under 750ms', async () => {
    const t0 = performance.now();
    for (let i = 0; i < 500; i++) {
      await inferSeed(`data:image/jpeg;base64,SCAN${i}PAYLOAD`);
    }
    expect(performance.now() - t0).toBeLessThan(750);
  });
});
