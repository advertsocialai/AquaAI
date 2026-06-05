import { describe, it, expect } from 'vitest';
import { gradeWater } from '@/features/quick-tools/water/water.grade';

describe('gradeWater — edge cases', () => {
  it('all-green readings → green, no limiting factor', () => {
    const r = gradeWater({ ph: 8.0, do: 6, temp: 30, salinity: 18, ammonia: 0.2, nitrite: 0.3, alkalinity: 120 });
    expect(r.risk).toBe('green');
    expect(r.limiting).toBeUndefined();
  });

  it('empty readings → green default', () => {
    const r = gradeWater({});
    expect(r.risk).toBe('green');
    expect(r.guidance).toMatch(/safe range/i);
  });

  it('green upper boundary is inclusive', () => {
    expect(gradeWater({ ph: 8.3 }).risk).toBe('green'); // green [7.5,8.3]
  });

  it('inside amber but outside green → amber', () => {
    const r = gradeWater({ ph: 8.6 }); // amber [7.0,8.8]
    expect(r.risk).toBe('amber');
    expect(r.limiting).toBe('pH');
  });

  it('amber upper boundary inclusive, just beyond → red', () => {
    expect(gradeWater({ ph: 8.8 }).risk).toBe('amber');
    expect(gradeWater({ ph: 8.81 }).risk).toBe('red');
  });

  it('low dissolved oxygen → red with guidance', () => {
    const r = gradeWater({ do: 3 }); // amber [4,12]
    expect(r.risk).toBe('red');
    expect(r.limiting).toBe('Dissolved O₂');
    expect(r.guidance).toMatch(/aerator/i);
  });

  it('returns the worst parameter when several are off', () => {
    const r = gradeWater({ ph: 8.6 /* amber */, ammonia: 2.0 /* red */ });
    expect(r.risk).toBe('red');
    expect(r.limiting).toBe('Total ammonia');
  });

  it('ignores NaN / missing values', () => {
    const r = gradeWater({ ph: Number.NaN, do: 6 });
    expect(r.risk).toBe('green');
  });

  it('echoes the readings back', () => {
    const r = gradeWater({ ph: 7.9, temp: 31 });
    expect(r.readings).toEqual({ ph: 7.9, temp: 31 });
    expect(r.tool).toBe('water');
  });
});
