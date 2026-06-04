import { useEffect, useMemo, useState } from 'react';
import { ToolShell } from '@/features/quick-tools/ToolShell';
import { ResultCard } from '@/features/quick-tools/shared/ResultCard';
import { SaveBar } from '@/features/quick-tools/shared/SaveBar';
import { useToolFlow } from '@/features/quick-tools/shared/useToolFlow';
import type { WaterResult } from '@/features/quick-tools/types';
import { WATER_PARAMS } from './water.config';
import { gradeWater } from './water.grade';

export default function WaterTool() {
  useEffect(() => { document.title = 'Water Quality — Aqua Rudra'; }, []);
  const { step, setStep, result, setResult, reset } = useToolFlow();
  const [vals, setVals] = useState<Record<string, string>>({});

  const filled = useMemo(() => Object.values(vals).some((v) => v.trim() !== ''), [vals]);

  function grade() {
    const readings: Record<string, number> = {};
    for (const p of WATER_PARAMS) {
      const n = parseFloat(vals[p.key]);
      if (Number.isFinite(n)) readings[p.key] = n;
    }
    setResult(gradeWater(readings));
    setStep('result');
  }

  const water = result as WaterResult | null;
  const speak = water ? `${water.risk === 'green' ? 'Water is good.' : `Caution. ${water.guidance}`}` : 'Enter your water readings to grade them.';

  return (
    <ToolShell title="Water Quality" speakText={speak}>
      {step !== 'result' ? (
        <>
          <p className="text-neutral-600">Enter your pond readings. Leave blank what you haven't measured.</p>
          <div className="space-y-3">
            {WATER_PARAMS.map((p) => (
              <label key={p.key} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                <span className="flex-1 text-neutral-700">{p.label}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={vals[p.key] ?? ''}
                  onChange={(e) => setVals((s) => ({ ...s, [p.key]: e.target.value.replace(/[^0-9.]/g, '') }))}
                  placeholder="—"
                  className="w-24 text-right text-lg font-semibold tabular-nums bg-transparent outline-none"
                />
                <span className="w-12 text-xs text-neutral-400">{p.unit}</span>
              </label>
            ))}
          </div>
          <button
            onClick={grade}
            disabled={!filled}
            className="w-full rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:bg-neutral-300 text-white font-semibold py-4 text-lg active:scale-[0.99] transition"
          >
            Grade water
          </button>
        </>
      ) : water ? (
        <>
          <ResultCard result={water} />
          <SaveBar tool="water" result={water} onReset={reset} />
        </>
      ) : null}
    </ToolShell>
  );
}
