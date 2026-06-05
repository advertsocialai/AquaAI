import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { WaterResult } from '@/features/quick-tools/types';

// Mock the Supabase client so we can drive insert success / failure.
const { insertMock } = vi.hoisted(() => ({ insertMock: vi.fn() }));
vi.mock('@/lib/supabase', () => ({
  supabase: { from: () => ({ insert: insertMock }) },
}));

import { saveRecord, flushUnsynced, listRecords } from '@/features/quick-tools/shared/records';

const water: WaterResult = { tool: 'water', risk: 'green', readings: { ph: 8 }, guidance: 'ok' };

function setOnline(v: boolean) {
  Object.defineProperty(window.navigator, 'onLine', { configurable: true, value: v });
}

describe('records sync (mocked Supabase)', () => {
  beforeEach(() => {
    localStorage.clear();
    insertMock.mockReset();
    setOnline(true);
  });

  it('online + user + insert ok → synced, sent with the user id', async () => {
    insertMock.mockResolvedValue({ error: null });
    const rec = await saveRecord('water', water, 'user-1');
    expect(rec.synced).toBe(true);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ user_id: 'user-1', tool: 'water' }));
    expect(listRecords()[0].synced).toBe(true);
  });

  it('insert error → stays unsynced (queued)', async () => {
    insertMock.mockResolvedValue({ error: { message: 'boom' } });
    const rec = await saveRecord('water', water, 'user-1');
    expect(rec.synced).toBe(false);
    expect(listRecords()[0].synced).toBe(false);
  });

  it('offline → never calls Supabase, queues locally', async () => {
    setOnline(false);
    const rec = await saveRecord('water', water, 'user-1');
    expect(insertMock).not.toHaveBeenCalled();
    expect(rec.synced).toBe(false);
  });

  it('flushUnsynced pushes the offline queue when back online', async () => {
    setOnline(false);
    await saveRecord('water', water, 'user-1'); // queued
    expect(listRecords()[0].synced).toBe(false);

    setOnline(true);
    insertMock.mockResolvedValue({ error: null });
    await flushUnsynced('user-1');
    expect(listRecords()[0].synced).toBe(true);
  });

  it('flushUnsynced without a user id is a no-op', async () => {
    setOnline(false);
    await saveRecord('water', water, 'user-1');
    insertMock.mockClear();
    await flushUnsynced(undefined);
    expect(insertMock).not.toHaveBeenCalled();
  });
});
