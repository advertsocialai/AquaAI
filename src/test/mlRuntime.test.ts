import { describe, it, expect } from 'vitest';
import { inferSeed, inferDisease } from '@/ml/runtime';

const IMG_A = 'data:image/jpeg;base64,AAAABBBBCCCCDDDD';
const IMG_B = 'data:image/jpeg;base64,ZZZZYYYYXXXXWWWW';

describe('inferSeed — edge cases', () => {
  it('is deterministic for the same image', async () => {
    const a = await inferSeed(IMG_A);
    const b = await inferSeed(IMG_A);
    expect(a).toEqual(b);
  });

  it('differs across different images', async () => {
    const a = await inferSeed(IMG_A);
    const b = await inferSeed(IMG_B);
    expect(a.count).not.toBe(b.count);
  });

  it('count band brackets the count and stays in valid ranges', async () => {
    const r = await inferSeed(IMG_A);
    expect(r.countBand[0]).toBeLessThanOrEqual(r.count);
    expect(r.countBand[1]).toBeGreaterThanOrEqual(r.count);
    expect(r.livePct).toBeGreaterThanOrEqual(90);
    expect(r.livePct).toBeLessThanOrEqual(99);
    expect(r.sizeCv).toBeGreaterThanOrEqual(8);
    expect(r.confidence).toBeGreaterThan(0.8);
    expect(r.confidence).toBeLessThanOrEqual(1);
    expect(['Nauplius', 'Zoea', 'Mysis', 'PL']).toContain(r.stage);
    expect(r.source).toBe('device');
    expect(r.modelVersion).toBeTruthy();
  });

  it('dilution scales the count linearly', async () => {
    const base = await inferSeed(IMG_A, { dilution: 1 });
    const x2 = await inferSeed(IMG_A, { dilution: 2 });
    expect(x2.count).toBe(base.count * 2);
  });

  it('flags an invoice mismatch when counted is well below invoiced', async () => {
    const r = await inferSeed(IMG_A, { invoiceCount: 1_000_000 });
    expect(r.invoiceMismatch).toBeDefined();
    expect(r.invoiceMismatch?.expected).toBe(1_000_000);
  });

  it('does not flag a mismatch when count meets the invoice', async () => {
    const r = await inferSeed(IMG_A, { invoiceCount: 1 });
    expect(r.invoiceMismatch).toBeUndefined();
  });
});

describe('inferDisease — edge cases', () => {
  it('is deterministic and screening-only (never a diagnosis)', async () => {
    const a = await inferDisease(IMG_A);
    const b = await inferDisease(IMG_A);
    expect(a).toEqual(b);
    expect(JSON.stringify(a).toLowerCase()).not.toContain('diagnos');
  });

  it('risk is a valid level and signals are sorted descending', async () => {
    const r = await inferDisease(IMG_B);
    expect(['green', 'amber', 'red', 'inconclusive']).toContain(r.risk);
    for (let i = 1; i < r.signals.length; i++) {
      expect(r.signals[i - 1].score).toBeGreaterThanOrEqual(r.signals[i].score);
    }
    expect(r.confidence).toBeGreaterThan(0);
    expect(r.confidence).toBeLessThanOrEqual(1);
    expect(r.source).toBe('device');
  });
});
