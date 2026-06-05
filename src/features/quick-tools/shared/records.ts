import { supabase } from '@/lib/supabase';
import type { Json } from '@/lib/supabase-types';
import type { ToolId, ToolRecord, ToolResult } from '@/features/quick-tools/types';

/**
 * Records store: writes locally first (works offline), then syncs to Supabase
 * `tool_scans` (owner-RLS). Unsynced rows are the offline queue — flushUnsynced()
 * pushes them when back online.
 */
const KEY = 'aqua-tool-records-v1';

function readAll(): ToolRecord[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') as ToolRecord[]; }
  catch { return []; }
}
function writeAll(rows: ToolRecord[]) { localStorage.setItem(KEY, JSON.stringify(rows)); }

function id(prefix: string): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `${prefix}-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function markSynced(certificateId: string) {
  writeAll(readAll().map((r) => (r.certificateId === certificateId ? { ...r, synced: true } : r)));
}

/** Insert one record into Supabase. Returns true on success. */
async function pushOne(rec: ToolRecord, userId: string): Promise<boolean> {
  if (!supabase || !userId || (typeof navigator !== 'undefined' && !navigator.onLine)) return false;
  const { error } = await supabase.from('tool_scans').insert({
    user_id: userId,
    tool: rec.tool,
    certificate_id: rec.certificateId,
    // ToolResult is a typed union; tool_scans.result is a JSONB column.
    result: rec.result as unknown as Json,
  });
  if (error) return false;
  markSynced(rec.certificateId);
  return true;
}

/** Save a scan locally, then try to sync to Supabase. Always returns the record. */
export async function saveRecord(tool: ToolId, result: ToolResult, userId?: string): Promise<ToolRecord> {
  const certificateId = id(`AR-${tool.toUpperCase().slice(0, 3)}`);
  const rec: ToolRecord = {
    recordId: id('REC'),
    certificateId,
    tool,
    result,
    createdAt: new Date().toISOString(),
    synced: false,
    qrUrl: `${location.origin}/verify/${certificateId}`,
  };
  writeAll([rec, ...readAll()].slice(0, 200));
  if (userId) rec.synced = await pushOne(rec, userId);
  return rec;
}

/** Push any locally-queued (unsynced) records to Supabase. */
export async function flushUnsynced(userId?: string): Promise<void> {
  if (!userId) return;
  for (const rec of readAll().filter((r) => !r.synced)) {
    await pushOne(rec, userId);
  }
}

export function listRecords(tool?: ToolId): ToolRecord[] {
  const all = readAll();
  return tool ? all.filter((r) => r.tool === tool) : all;
}
