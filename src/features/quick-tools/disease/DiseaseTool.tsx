import { useEffect } from 'react';
import { Loader2, FlaskConical } from 'lucide-react';
import { ToolShell } from '@/features/quick-tools/ToolShell';
import { CaptureGuide } from '@/features/quick-tools/shared/CaptureGuide';
import { ResultCard } from '@/features/quick-tools/shared/ResultCard';
import { RetakePrompt } from '@/features/quick-tools/shared/RetakePrompt';
import { SaveBar } from '@/features/quick-tools/shared/SaveBar';
import { useToolFlow } from '@/features/quick-tools/shared/useToolFlow';
import { inferDisease } from '@/ml/runtime';
import type { DiseaseResult } from '@/features/quick-tools/types';

export default function DiseaseTool() {
  useEffect(() => { document.title = 'Disease Detector — Aqua Rudra'; }, []);
  const { step, setStep, result, setResult, reset } = useToolFlow();

  async function onCapture(dataUrl: string) {
    setStep('processing');
    const r = await inferDisease(dataUrl);
    if (r.confidence < 0.6) { setStep('retake'); return; }
    setResult(r);
    setStep('result');
  }

  const dz = result as DiseaseResult | null;
  const speak = dz
    ? (dz.risk === 'green' ? 'No visible signs screened.' : 'Screened risk. Please confirm with a lab.')
    : 'Take a clear, close photo of the shrimp or sample to screen for visible signs.';

  return (
    <ToolShell title="Disease Detector" speakText={speak}>
      {(step === 'idle' || step === 'capturing') && (
        <>
          <p className="text-neutral-600">
            This is a <strong>screening</strong> tool for visible signs — not a diagnosis. Take a clear, close photo.
          </p>
          <CaptureGuide onCapture={onCapture} />
        </>
      )}

      {step === 'processing' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 flex flex-col items-center">
          <Loader2 className="w-7 h-7 animate-spin text-rose-600" />
          <p className="mt-3 text-neutral-600">Screening on your device…</p>
        </div>
      )}

      {step === 'retake' && (
        <RetakePrompt reason="Image was unclear — a confident screening needs a sharp, well-lit photo." onRetake={() => setStep('capturing')} />
      )}

      {step === 'result' && dz && (
        <>
          <ResultCard result={dz} />
          {(dz.risk === 'amber' || dz.risk === 'red') && (
            <a
              href="/expert"
              className="flex items-center justify-center gap-2 w-full rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold py-4 text-lg active:scale-[0.99] transition"
            >
              <FlaskConical className="w-5 h-5" /> Send to PCR/RPA lab
            </a>
          )}
          <SaveBar tool="disease" result={dz} onReset={reset} />
        </>
      )}
    </ToolShell>
  );
}
