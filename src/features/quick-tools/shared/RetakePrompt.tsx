import { RotateCcw, AlertTriangle } from 'lucide-react';

/** Shown when the quality gate fails or model confidence is too low. Never a result. */
export function RetakePrompt({ reason, onRetake }: { reason?: string; onRetake: () => void }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 grid place-items-center">
        <AlertTriangle className="w-6 h-6 text-amber-600" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-neutral-900">Inconclusive — please retake</h3>
      <p className="mt-1 text-sm text-neutral-600">{reason ?? 'The capture was not clear enough for a reliable result.'}</p>
      <button
        onClick={onRetake}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold px-6 py-3 active:scale-[0.99] transition"
      >
        <RotateCcw className="w-4 h-4" /> Retake
      </button>
    </div>
  );
}
