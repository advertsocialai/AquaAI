import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark, IndianRupee, FileText, ShieldCheck, CheckCircle2,
  AlertTriangle, ArrowRight, ArrowLeft, Sparkles,
} from 'lucide-react';

type Step = 'farm' | 'amount' | 'collateral' | 'review' | 'decision';

const STEPS: { id: Step; label: string }[] = [
  { id: 'farm',       label: 'Farm details' },
  { id: 'amount',     label: 'Loan amount' },
  { id: 'collateral', label: 'Collateral' },
  { id: 'review',     label: 'Review' },
  { id: 'decision',   label: 'AI decision' },
];

function num(s: string) { const n = parseFloat(s); return Number.isFinite(n) ? n : 0; }

function scoreFarm(input: {
  acres: number; qsAvg: number; outbreakRiskPct: number;
  yearsActive: number; pastDefaultsCount: number;
}): { band: 'A' | 'B' | 'C' | 'D'; score: number; maxAdvance: number } {
  let score = 100;
  score -= Math.max(0, (5 - input.qsAvg / 20) * 6);                    // QS impact
  score -= Math.min(40, input.outbreakRiskPct);                         // outbreak proximity
  score -= input.pastDefaultsCount * 18;                                // defaults
  score += Math.min(15, input.yearsActive * 2);                         // tenure bonus
  score = Math.max(10, Math.min(100, Math.round(score)));

  const band: 'A' | 'B' | 'C' | 'D' =
    score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 45 ? 'C' : 'D';

  // Max advance per acre by band.
  const perAcre: Record<typeof band, number> = { A: 250000, B: 150000, C: 80000, D: 0 };
  const maxAdvance = Math.round(perAcre[band] * input.acres);
  return { band, score, maxAdvance };
}

const BAND_COLOR: Record<'A' | 'B' | 'C' | 'D', string> = {
  A: '#34d399', B: '#facc15', C: '#fb923c', D: '#f87171',
};

export function LoanApplication() {
  const [step, setStep] = useState<Step>('farm');
  const idx = STEPS.findIndex((s) => s.id === step);

  // Farm details
  const [farmer, setFarmer] = useState('V. Ramana');
  const [district, setDistrict] = useState('Bhimavaram');
  const [acres, setAcres] = useState('4.5');
  const [qsAvg, setQsAvg] = useState('86');
  const [yearsActive, setYearsActive] = useState('5');
  const [outbreakRisk, setOutbreakRisk] = useState('18');
  const [pastDefaults, setPastDefaults] = useState('0');

  // Amount + collateral
  const [requested, setRequested] = useState('500000');
  const [tenureMonths, setTenureMonths] = useState('12');
  const [purpose, setPurpose] = useState('Working capital — feed + aerators');
  const [collateralType, setCollateralType] = useState('Pond title');
  const [collateralValue, setCollateralValue] = useState('1200000');

  const decision = useMemo(
    () =>
      scoreFarm({
        acres: num(acres),
        qsAvg: num(qsAvg),
        outbreakRiskPct: num(outbreakRisk),
        yearsActive: num(yearsActive),
        pastDefaultsCount: num(pastDefaults),
      }),
    [acres, qsAvg, outbreakRisk, yearsActive, pastDefaults],
  );

  const reqAmount = num(requested);
  const recommended = Math.min(reqAmount, decision.maxAdvance);
  const ratio = reqAmount > 0 ? recommended / reqAmount : 0;

  const next = () => setStep(STEPS[Math.min(idx + 1, STEPS.length - 1)].id);
  const prev = () => setStep(STEPS[Math.max(idx - 1, 0)].id);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div
                className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                  done ? 'bg-emerald-400 text-black border-emerald-400'
                  : active ? 'bg-cyan-400 text-black border-cyan-400'
                  : 'bg-white/[0.03] text-white/40 border-white/10'
                }`}
              >
                {done ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
              </div>
              <div className={`text-[10px] uppercase tracking-widest ${active ? 'text-white' : done ? 'text-white/50' : 'text-white/30'}`}>
                {s.label}
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${done ? 'bg-emerald-400/40' : 'bg-white/10'}`} />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-5 rounded-xl border border-white/10 bg-white/[0.03]"
        >
          {step === 'farm' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Farmer name"  value={farmer} onChange={setFarmer} />
              <Field label="District"     value={district} onChange={setDistrict} />
              <Field label="Acres"        value={acres} onChange={setAcres} unit="acres" />
              <Field label="Avg QS (5 cycles)" value={qsAvg} onChange={setQsAvg} unit="/100" />
              <Field label="Years active" value={yearsActive} onChange={setYearsActive} unit="yrs" />
              <Field label="Outbreak risk (5km, 30d)" value={outbreakRisk} onChange={setOutbreakRisk} unit="%" />
              <Field label="Past defaults" value={pastDefaults} onChange={setPastDefaults} />
            </div>
          )}

          {step === 'amount' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Requested amount" value={requested} onChange={setRequested} unit="₹" />
              <Field label="Tenure"           value={tenureMonths} onChange={setTenureMonths} unit="months" />
              <div className="sm:col-span-2">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-white/40">Purpose</span>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                    className="mt-1.5 w-full px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-white text-sm outline-none focus:border-cyan-400/40"
                  />
                </label>
              </div>
            </div>
          )}

          {step === 'collateral' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Collateral type" value={collateralType} onChange={setCollateralType} />
              <Field label="Collateral value" value={collateralValue} onChange={setCollateralValue} unit="₹" />
              <div className="sm:col-span-2 p-3 rounded-lg bg-white/[0.03] text-xs text-white/50">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5 text-emerald-400" />
                Collateral is verified via partner valuator. AquaI QC history + farm risk band weigh equally
                with collateral for the final decision.
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Row k="Farmer"            v={farmer} />
              <Row k="District"          v={district} />
              <Row k="Acres"             v={`${acres} acres`} />
              <Row k="Avg QS"            v={qsAvg} />
              <Row k="Years active"      v={yearsActive} />
              <Row k="Outbreak risk"     v={`${outbreakRisk}%`} />
              <Row k="Past defaults"     v={pastDefaults} />
              <Row k="Requested"         v={`₹${reqAmount.toLocaleString('en-IN')}`} />
              <Row k="Tenure"            v={`${tenureMonths} months`} />
              <Row k="Collateral"        v={`${collateralType} · ₹${num(collateralValue).toLocaleString('en-IN')}`} />
              <div className="sm:col-span-2"><Row k="Purpose" v={purpose} /></div>
            </div>
          )}

          {step === 'decision' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold"
                  style={{ background: `${BAND_COLOR[decision.band]}22`, color: BAND_COLOR[decision.band] }}
                >
                  {decision.band}
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest text-white/30">AI risk band</div>
                  <div className="text-2xl font-bold text-white">{decision.score} / 100</div>
                  <div className="text-xs text-white/50">
                    Inputs: QS history (40%) · outbreak proximity (25%) · yield consistency (20%) · tenure (10%) · water quality (5%)
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <Stat label="Requested"      value={`₹${(reqAmount / 100000).toFixed(1)} L`} color="#94a3b8" />
                <Stat label="Max advance"    value={`₹${(decision.maxAdvance / 100000).toFixed(1)} L`} color="#a78bfa" />
                <Stat label="Recommended"    value={`₹${(recommended / 100000).toFixed(1)} L`} color={BAND_COLOR[decision.band]} />
              </div>

              <div className="p-3 rounded-lg bg-white/[0.03] flex items-start gap-2 text-xs">
                {decision.band === 'D' ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-white/70">
                      Decline recommended. Outbreak risk + default history outweigh collateral. Re-apply after one clean cycle.
                    </span>
                  </>
                ) : ratio < 1 ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-white/70">
                      Approved at {(ratio * 100).toFixed(0)}% of requested. To raise the cap, demonstrate one more clean QC cycle or add collateral.
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-white/70">
                      Approved at full requested amount. Disbursement once collateral and KYC are verified.
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={prev}
              disabled={idx === 0}
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.03] disabled:opacity-30 disabled:cursor-not-allowed text-sm text-white/70 inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-white/30">
              <FileText className="w-3 h-3" /> RBI-aligned · GST e-invoice generated on disbursement
            </div>
            <button
              onClick={next}
              disabled={idx === STEPS.length - 1}
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-sm text-black font-semibold inline-flex items-center gap-1.5"
            >
              {idx === STEPS.length - 2 ? 'Run AI decision' : 'Next'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── helpers ────────────────────────────────────────────────────────────────────

function Field({ label, value, onChange, unit }: {
  label: string; value: string; onChange: (v: string) => void; unit?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-white/40">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none text-white text-sm flex-1"
        />
        {unit && <span className="text-xs text-white/40">{unit}</span>}
      </div>
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between py-1 px-2 rounded-lg bg-white/[0.02]">
      <span className="text-white/50 text-xs">{k}</span>
      <span className="text-white font-medium tabular-nums truncate ml-2">{v}</span>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-3 rounded-lg border border-white/10 bg-white/[0.03]">
      <div className="text-[10px] uppercase tracking-widest text-white/30">{label}</div>
      <div className="text-2xl font-bold tabular-nums" style={{ color }}>{value}</div>
    </div>
  );
}
