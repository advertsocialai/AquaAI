import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ToolShell } from '@/features/quick-tools/ToolShell';
import { CaptureGuide } from '@/features/quick-tools/shared/CaptureGuide';
import { ResultCard } from '@/features/quick-tools/shared/ResultCard';
import { RetakePrompt } from '@/features/quick-tools/shared/RetakePrompt';
import { SaveBar } from '@/features/quick-tools/shared/SaveBar';
import { useToolFlow } from '@/features/quick-tools/shared/useToolFlow';
import { inferSeed } from '@/ml/runtime';
import type { SeedResult } from '@/features/quick-tools/types';

export default function SeedTool() {
  useEffect(() => { document.title = 'Seed Counter — Aqua Rudra'; }, []);
  const { step, setStep, result, setResult, reset } = useToolFlow();
  const [dilution, setDilution] = useState('');
  const [invoice, setInvoice] = useState('');

  async function onCapture(dataUrl: string) {
    setStep('processing');
    const r = await inferSeed(dataUrl, {
      dilution: parseFloat(dilution) || undefined,
      invoiceCount: parseFloat(invoice) || undefined,
    });
    if (r.confidence < 0.8) { setStep('retake'); return; }
    setResult(r);
    setStep('result');
  }

  const seed = result as SeedResult | null;
  const speak = seed ? `Estimated count ${seed.count}, ${seed.livePct} percent live.` : 'Hold the tray steady and fill the frame to count the seed.';

  return (
    <ToolShell title="Seed Counter" speakText={speak}>
      {(step === 'idle' || step === 'capturing') && (
        <>
          <p className="text-neutral-600">Place the counting tray flat, fill the frame, and keep the light even.</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Dilution ×" value={dilution} onChange={setDilution} placeholder="1" />
            <Field label="Invoice count" value={invoice} onChange={setInvoice} placeholder="optional" />
          </div>
          <CaptureGuide checkDensity onCapture={onCapture} />
        </>
      )}

      {step === 'processing' && <Processing />}

      {step === 'retake' && (
        <RetakePrompt reason="Sample was too dense or unclear for a reliable count." onRetake={() => setStep('capturing')} />
      )}

      {step === 'result' && seed && (
        <>
          <ResultCard result={seed} />
          <SaveBar tool="seed" result={seed} onReset={reset} />
        </>
      )}
    </ToolShell>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs text-neutral-500">{label}</span>
      <input
        type="text" inputMode="decimal" value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 outline-none focus:border-rose-400/50"
      />
    </label>
  );
}

function Processing() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-10 flex flex-col items-center">
      <Loader2 className="w-7 h-7 animate-spin text-rose-600" />
      <p className="mt-3 text-neutral-600">Counting on your device…</p>
    </div>
  );
}
