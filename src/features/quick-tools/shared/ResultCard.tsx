import { Sparkles } from 'lucide-react';
import type { ToolResult } from '@/features/quick-tools/types';
import { RiskLight } from './RiskLight';

/* Fixed screening copy for the disease tool — never the word "diagnosis". */
const DISEASE_LINE: Record<string, string> = {
  green: 'No visible signs screened. Keep monitoring.',
  amber: 'Screened risk — confirm with a PCR/RPA lab before acting.',
  red: 'High screened risk — send a sample to a PCR/RPA lab now.',
  inconclusive: 'Inconclusive — please retake the photo.',
};

export function ResultCard({ result }: { result: ToolResult }) {
  if (result.tool === 'seed') {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">Estimated count</div>
          {result.source === 'server' && (
            <span className="inline-flex items-center gap-1 text-xs text-teal-600"><Sparkles className="w-3.5 h-3.5" /> refined</span>
          )}
        </div>
        <div className="mt-1 text-5xl font-bold tabular-nums text-neutral-900">{result.count.toLocaleString('en-IN')}</div>
        <div className="text-sm text-neutral-500">± {(result.countBand[1] - result.count).toLocaleString('en-IN')} · {Math.round(result.confidence * 100)}% confidence</div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <Stat label="Live" value={`${result.livePct}%`} />
          <Stat label="Uniformity (CV)" value={`${result.sizeCv}%`} />
          <Stat label="Stage" value={result.plStage ? `PL${result.plStage}` : result.stage} />
        </div>
        {result.invoiceMismatch && (
          <div className="mt-4 rounded-xl bg-rose-50 ring-1 ring-rose-200 text-rose-700 text-sm px-4 py-3">
            Invoice mismatch: counted {result.invoiceMismatch.got.toLocaleString('en-IN')} vs invoiced {result.invoiceMismatch.expected.toLocaleString('en-IN')}.
          </div>
        )}
      </div>
    );
  }

  if (result.tool === 'disease') {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-neutral-500">Screening result</div>
          <RiskLight risk={result.risk} />
        </div>
        <p className="mt-3 text-lg font-semibold text-neutral-900 leading-snug">{DISEASE_LINE[result.risk]}</p>
        <div className="mt-4 space-y-2">
          {result.signals.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-36 shrink-0 text-sm text-neutral-600 capitalize">{s.label.replace(/_/g, ' ')}</span>
              <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-2 rounded-full bg-rose-500/70" style={{ width: `${Math.round(s.score * 100)}%` }} />
              </div>
              <span className="w-10 text-right text-xs text-neutral-500 tabular-nums">{Math.round(s.score * 100)}%</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-neutral-400">
          Screening only — not a diagnosis. {Math.round(result.confidence * 100)}% confidence.
        </p>
      </div>
    );
  }

  // water
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-neutral-500">Water grade</div>
        <RiskLight risk={result.risk} />
      </div>
      {result.limiting && (
        <p className="mt-3 text-lg font-semibold text-neutral-900">Limiting factor: <span className="capitalize">{result.limiting}</span></p>
      )}
      <p className="mt-1 text-neutral-600">{result.guidance}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 py-3">
      <div className="text-lg font-bold text-neutral-900">{value}</div>
      <div className="text-[11px] text-neutral-500">{label}</div>
    </div>
  );
}
