import { describe, it, expect, beforeEach } from 'vitest';
import { saveRecord, listRecords } from '@/features/quick-tools/shared/records';
import type { WaterResult } from '@/features/quick-tools/types';

const water: WaterResult = { tool: 'water', risk: 'green', readings: { ph: 8 }, guidance: 'ok' };

describe('records store — edge cases', () => {
  beforeEach(() => localStorage.clear());

  it('saves locally (no userId) and returns a certificate + qr', async () => {
    const rec = await saveRecord('water', water);
    expect(rec.tool).toBe('water');
    expect(rec.certificateId).toMatch(/^AR-WAT-\d{8}-\d{4}$/);
    expect(rec.qrUrl).toContain(rec.certificateId);
    expect(rec.synced).toBe(false); // no user → stays in offline queue
  });

  it('persists and lists newest-first, filterable by tool', async () => {
    await saveRecord('water', water);
    await saveRecord('seed', { ...(water as object) } as never);
    const all = listRecords();
    expect(all.length).toBe(2);
    expect(all[0].tool).toBe('seed'); // newest first
    expect(listRecords('water').length).toBe(1);
  });

  it('caps history at 200 entries', async () => {
    for (let i = 0; i < 205; i++) await saveRecord('water', water);
    expect(listRecords().length).toBeLessThanOrEqual(200);
  });
});
