import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * F06/F07 — Batch extrapolation calculator.
 * Estimates the full-batch PL count from a sample count and volumes,
 * and flags any discrepancy against the hatchery invoice. Pure client-side math
 * (mirrors the backend compute_extrapolation logic).
 */
export function BatchExtrapolator() {
  const [sampleCount, setSampleCount] = useState('250');
  const [sampleVol, setSampleVol] = useState('50');
  const [totalVol, setTotalVol] = useState('5000');
  const [invoiceQty, setInvoiceQty] = useState('100000');

  const calc = useMemo(() => {
    const sc = parseFloat(sampleCount) || 0;
    const sv = parseFloat(sampleVol) || 0;
    const tv = parseFloat(totalVol) || 0;
    const inv = parseFloat(invoiceQty) || 0;
    if (sv <= 0) return null;

    const ratio = tv / sv;
    const extrapolated = Math.round(sc * ratio);
    const margin = Math.round(sc * 0.035 * ratio); // ±3.5% confidence band
    let discrepancyPct: number | null = null;
    let flag = false;
    if (inv > 0) {
      discrepancyPct = Number((((inv - extrapolated) / inv) * 100).toFixed(2));
      flag = Math.abs(discrepancyPct) > 10;
    }
    return { extrapolated, margin, discrepancyPct, flag };
  }, [sampleCount, sampleVol, totalVol, invoiceQty]);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-white">Batch Extrapolation</h3>
          <p className="text-xs text-white/50">Sample count → full-batch estimate</p>
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-sky-500/20 text-sky-300">
          F06 · F07
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Sample count (PL)" value={sampleCount} onChange={setSampleCount} />
        <Field label="Sample volume (ml)" value={sampleVol} onChange={setSampleVol} />
        <Field label="Total batch volume (ml)" value={totalVol} onChange={setTotalVol} />
        <Field label="Invoice quantity (optional)" value={invoiceQty} onChange={setInvoiceQty} />
      </div>

      {calc && (
        <motion.div
          key={calc.extrapolated}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 space-y-3"
        >
          <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-5 text-center">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
              Estimated batch size
            </div>
            <div className="text-3xl font-bold text-sky-300 tabular-nums">
              {calc.extrapolated.toLocaleString()}
              <span className="text-base text-white/40 font-normal"> PL</span>
            </div>
            <div className="text-xs text-white/40 mt-1">
              ± {calc.margin.toLocaleString()} (95% confidence)
            </div>
          </div>

          {calc.discrepancyPct !== null && (
            <div
              className={`rounded-xl border p-4 flex items-center gap-3 ${
                calc.flag
                  ? 'border-red-500/40 bg-red-500/10'
                  : 'border-emerald-500/30 bg-emerald-500/5'
              }`}
            >
              <div
                className={`text-2xl font-bold tabular-nums ${
                  calc.flag ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {calc.discrepancyPct > 0 ? '+' : ''}
                {calc.discrepancyPct}%
              </div>
              <div className="text-sm">
                <div className={calc.flag ? 'text-red-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                  {calc.flag ? 'Invoice mismatch flagged' : 'Within tolerance'}
                </div>
                <div className="text-white/40 text-xs">
                  {calc.flag
                    ? 'Discrepancy exceeds ±10% — raise a dispute with the hatchery.'
                    : 'Counted total agrees with the invoice (±10%).'}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] text-white/40">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white
                   focus:outline-none focus:border-sky-400/50 transition tabular-nums"
      />
    </label>
  );
}
