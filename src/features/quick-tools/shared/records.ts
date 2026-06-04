import type { ToolId, ToolRecord, ToolResult } from '@/features/quick-tools/types';

/**
 * Local-first records store. Saves to localStorage immediately (works offline);
 * `synced:false` rows are the offline queue to flush to /api/v1/records later.
 * Swap the body of `persist` for a real POST when the backend endpoint is live.
 */
const KEY = 'aqua-tool-records-v1';

function readAll(): ToolRecord[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') as ToolRecord[]; }
  catch { return []; }
}

function writeAll(rows: ToolRecord[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

function id(prefix: string): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `${prefix}-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function saveRecord(tool: ToolId, result: ToolResult): ToolRecord {
  const certificateId = id(`AR-${tool.toUpperCase().slice(0, 3)}`);
  const recordId = id('REC');
  const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const rec: ToolRecord = {
    recordId,
    certificateId,
    tool,
    result,
    createdAt: new Date().toISOString(),
    synced: online,
    qrUrl: `${location.origin}/verify/${certificateId}`,
  };
  writeAll([rec, ...readAll()].slice(0, 200));
  return rec;
}

export function listRecords(tool?: ToolId): ToolRecord[] {
  const all = readAll();
  return tool ? all.filter((r) => r.tool === tool) : all;
}
