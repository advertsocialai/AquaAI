import { useEffect, useState } from 'react';
import { Check, Save, QrCode, WifiOff, RotateCcw, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import type { ToolId, ToolRecord, ToolResult } from '@/features/quick-tools/types';
import { saveRecord, flushUnsynced } from './records';

/** Save → certificate + QR, stored in Supabase (tool_scans). Queues offline. */
export function SaveBar({ tool, result, onReset }: { tool: ToolId; result: ToolResult; onReset: () => void }) {
  const { user } = useAuth();
  const [rec, setRec] = useState<ToolRecord | null>(null);
  const [busy, setBusy] = useState(false);

  // Flush any offline-queued scans when this view opens.
  useEffect(() => { void flushUnsynced(user?.id); }, [user]);

  async function save() {
    setBusy(true);
    setRec(await saveRecord(tool, result, user?.id));
    setBusy(false);
  }

  if (rec) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold">
          <Check className="w-5 h-5" /> Saved to your records
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-white ring-1 ring-emerald-200 grid place-items-center shrink-0">
            <QrCode className="w-9 h-9 text-neutral-700" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-neutral-800">Certificate {rec.certificateId}</div>
            <a href={rec.qrUrl} className="text-xs text-teal-600 break-all hover:underline">{rec.qrUrl}</a>
            {!rec.synced && (
              <div className="mt-1 inline-flex items-center gap-1 text-xs text-amber-600">
                <WifiOff className="w-3.5 h-3.5" /> will sync when online
              </div>
            )}
          </div>
        </div>
        <button onClick={onReset} className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
          <RotateCcw className="w-4 h-4" /> New scan
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={save}
        disabled={busy}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white font-semibold py-4 text-lg active:scale-[0.99] transition"
      >
        {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save
      </button>
      <button
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 text-neutral-700 font-semibold px-5 py-4 active:scale-[0.99] transition"
      >
        <RotateCcw className="w-5 h-5" />
      </button>
    </div>
  );
}
