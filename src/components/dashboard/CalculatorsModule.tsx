import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator, Fish, Fan, Droplets, Beaker, Layers, IndianRupee, HeartPulse, ChevronLeft,
} from 'lucide-react';

type CalcId = 'survival' | 'feed' | 'count' | 'aeration' | 'lime' | 'volume' | 'pnl';

const CALCS: { id: CalcId; label: string; icon: React.ElementType; accent: string; desc: string }[] = [
  { id: 'survival', label: 'Survival Calculator', icon: HeartPulse,  accent: '#e11d48', desc: 'Estimate pond survival %' },
  { id: 'feed',     label: 'Feed Calculator',     icon: Layers,      accent: '#e11d48', desc: 'Daily feed quantity' },
  { id: 'count',    label: 'Shrimp Count',        icon: Fish,        accent: '#38bdf8', desc: 'Sample-to-pond extrapolation' },
  { id: 'aeration', label: 'Aeration HP',         icon: Fan,         accent: '#a78bfa', desc: 'Per acre, stocking, DO target' },
  { id: 'lime',     label: 'Liming Requirement',  icon: Beaker,      accent: '#34d399', desc: 'Soil pH delta × area' },
  { id: 'volume',   label: 'Pond Volume',         icon: Droplets,    accent: '#60a5fa', desc: 'Area × depth' },
  { id: 'pnl',      label: 'Profit / Loss',       icon: IndianRupee, accent: '#fb923c', desc: 'Crop value at risk vs cost' },
];

/* DOC → average body weight → feeding % reference (industry standard). */
const FEED_REFERENCE: [string, string, string][] = [
  ['1 – 7', '0.02 – 0.05', '35.0'], ['8 – 14', '0.05 – 1.0', '10.0'],
  ['15 – 21', '1.0 – 2.0', '7.0'], ['22 – 28', '2.0 – 3.5', '6.5'],
  ['29 – 35', '3.5 – 5.0', '6.0'], ['36 – 42', '5.0 – 6.5', '5.0'],
  ['43 – 49', '6.5 – 8.0', '4.2'], ['50 – 56', '8.0 – 10', '3.4'],
  ['57 – 63', '10 – 12', '3.2'], ['64 – 70', '12 – 14', '3.1'],
  ['71 – 77', '14 – 16', '3.0'], ['78 – 84', '16 – 18', '2.9'],
  ['85 – 91', '18 – 20', '2.8'], ['92 – 98', '20 – 22.5', '2.7'],
  ['99 – 106', '22.5 – 25', '2.6'], ['107 – 112', '25 – 27.5', '2.5'],
  ['113 – 119', '27.5 – 30', '2.2'], ['120 – 126', '30 – 33', '2.0'],
];

function ReferenceTable() {
  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold text-foreground">Reference Table</h4>
      <p className="text-sm text-foreground/60 mt-1 mb-3">
        The feeding percentage should be based on the reference table
      </p>
      <div className="overflow-hidden rounded-xl ring-1 ring-border">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-rose-600 text-white">
              <th className="px-3 py-3 font-semibold border border-rose-500/40">Doc</th>
              <th className="px-3 py-3 font-semibold border border-rose-500/40">Average body Weight (ABW)</th>
              <th className="px-3 py-3 font-semibold border border-rose-500/40">Feeding % of Body Weight</th>
            </tr>
          </thead>
          <tbody className="text-center text-foreground/80">
            {FEED_REFERENCE.map((r) => (
              <tr key={r[0]}>
                <td className="px-3 py-2.5 border border-border">{r[0]}</td>
                <td className="px-3 py-2.5 border border-border">{r[1]}</td>
                <td className="px-3 py-2.5 border border-border">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FarmerDocNote() {
  return (
    <div className="mt-8">
      <h4 className="text-base font-semibold text-foreground">FARMER DOC</h4>
      <p className="text-sm text-foreground/60 mt-1">
        Survival rate will be calculated based on farmer DOC. Enter DOC of your preferred pond.
      </p>
    </div>
  );
}

function CalcNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h4 className="text-base font-semibold text-foreground">Note:</h4>
      <p className="text-sm text-foreground/60 mt-1 leading-relaxed">{children}</p>
    </div>
  );
}

/* Full-width labelled-placeholder input with an optional unit hint on the right. */
function BigInput({ label, value, onChange, unit }: {
  label: string; value: string; onChange: (v: string) => void; unit?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3.5 focus-within:border-rose-400/50">
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
        placeholder={label}
        className="flex-1 min-w-0 bg-transparent text-foreground outline-none placeholder:text-foreground/50"
      />
      {unit && <span className="shrink-0 text-sm text-foreground/45">{unit}</span>}
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-5 p-5 rounded-xl bg-rose-600/10 ring-1 ring-rose-600/20 text-center">
      <div className="text-sm text-foreground/60">{label}</div>
      <div className="mt-1 text-3xl font-bold text-rose-600 tabular-nums">{value}</div>
    </div>
  );
}

function FieldRow({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="flex items-baseline justify-between py-1.5 text-sm">
      <span className="text-foreground/60">{label}</span>
      <span className="font-bold text-foreground tabular-nums">
        {value} {unit && <span className="text-xs font-normal text-foreground/40">{unit}</span>}
      </span>
    </div>
  );
}

function NumberInput({ label, value, onChange, unit, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-foreground/40">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder={placeholder}
          className="bg-transparent outline-none text-foreground text-sm flex-1 tabular-nums"
        />
        {unit && <span className="text-xs text-foreground/40">{unit}</span>}
      </div>
    </label>
  );
}

function num(s: string) { const n = parseFloat(s); return Number.isFinite(n) ? n : 0; }

// ── Shrimp Count ───────────────────────────────────────────────────────────────
function CountCalc() {
  const [sample, setSample] = useState('25');
  const [sampleVol, setSampleVol] = useState('1');
  const [pondVol, setPondVol] = useState('200');
  const sv = num(sampleVol);
  const extrapolated = sv > 0 ? Math.round((num(sample) / sv) * num(pondVol)) : 0;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumberInput label="Shrimp in sample" value={sample} onChange={setSample} unit="count" />
        <NumberInput label="Sample volume" value={sampleVol} onChange={setSampleVol} unit="L" />
        <NumberInput label="Total pond volume" value={pondVol} onChange={setPondVol} unit="m³" />
      </div>
      <div className="p-5 rounded-2xl border border-border bg-card">
        <div className="text-[11px] uppercase tracking-widest text-foreground/40 mb-3">Estimated pond population</div>
        <div className="text-4xl font-bold text-teal-400 tabular-nums mb-2">{extrapolated.toLocaleString('en-IN')}</div>
        <div className="text-xs text-foreground/40">Assumes uniform distribution. For ponds with current/aeration, take 3 samples and average.</div>
      </div>
    </div>
  );
}

// ── Survival Calculator ──────────────────────────────────────────────────────
function SurvivalCalc() {
  const [stocking, setStocking] = useState('');
  const [feedPerDay, setFeedPerDay] = useState('');
  const [count, setCount] = useState('');
  const [abw, setAbw] = useState('');
  const [feedPct, setFeedPct] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function calculate() {
    const N = num(stocking), F = num(feedPerDay), c = num(count), w = num(abw), f = num(feedPct);
    if (N <= 0 || F <= 0 || f <= 0) { setResult(null); return; }
    const biomassKg = (F * 100) / f;                  // current biomass implied by feed
    const perKg = c > 0 ? c : (w > 0 ? 1000 / w : 0);  // shrimp per kg
    const liveCount = biomassKg * perKg;
    const survival = N > 0 ? Math.min(100, (liveCount / N) * 100) : 0;
    setResult(`${survival.toFixed(1)} %`);
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground">About Survival Calculator</h3>
      <p className="text-sm text-foreground/60 mt-1 leading-relaxed">
        The net profitability of shrimp culture depends on the growth and survival of animals in the
        pond. Monitoring the biomass on a timely basis gives a better picture of the pond dynamics,
        allowing farmers to manage feed better and improve their FCRs. The survival calculator is a
        simple yet powerful tool to estimate current biomass and survival regularly.
      </p>

      <p className="mt-6 mb-3 text-sm font-medium text-foreground/70">Enter details to get survival rate</p>
      <div className="space-y-3 max-w-xl">
        <BigInput label="Initial number of stocking" value={stocking} onChange={setStocking} />
        <BigInput label="Total Feed per day" value={feedPerDay} onChange={setFeedPerDay} unit="(in kg)" />
        <BigInput label="Average Shrimp count" value={count} onChange={setCount} unit="(per/Kg)" />
        <BigInput label="Average Body Weight" value={abw} onChange={setAbw} unit="(gm/piece)" />
        <BigInput label="Feed Percentage" value={feedPct} onChange={setFeedPct} unit="(%)" />
        <button
          onClick={calculate}
          className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3.5 transition"
        >
          Calculate Survival Rate
        </button>
        {result && <ResultCard label="Estimated Survival Rate" value={result} />}
      </div>

      <FarmerDocNote />
      <ReferenceTable />
      <CalcNote>
        The survival calculator provides a basic understanding to the farmer and not to replace an
        aquaculture expert. This tool allows farmers to closely estimate the survival rate of shrimp
        in the pond, allowing them to manage feed better and reduce feed wastage. When put in proper
        use, a farmer can gauge the current biomass in the pond and the total shrimp available for
        harvest.
      </CalcNote>
    </div>
  );
}

// ── Feed Calculator ──────────────────────────────────────────────────────────
function FeedCalc() {
  const [stocking, setStocking] = useState('');
  const [count, setCount] = useState('');
  const [abw, setAbw] = useState('');
  const [feedPct, setFeedPct] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function calculate() {
    const N = num(stocking), c = num(count), w = num(abw), f = num(feedPct);
    if (f <= 0) { setResult(null); return; }
    const biomassKg = w > 0 ? (N * w) / 1000 : (c > 0 ? N / c : 0); // from ABW, else count/kg
    const daily = biomassKg * (f / 100);
    if (daily <= 0) { setResult(null); return; }
    setResult(`${daily.toFixed(1)} kg/day`);
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground">About Feeding Calculator</h3>
      <p className="text-sm text-foreground/60 mt-1 leading-relaxed">
        Over 60% of the production costs in shrimp farming goes to feed. Along with input costs, feed
        is also the primary source of ammonia, the most important pollutant of pond bottom. Our
        feeding calculator helps farmers correctly estimate the daily pond feed requirement, without
        polluting the bottom and ensuring sufficient growth.
      </p>

      <p className="mt-6 mb-3 text-sm font-medium text-foreground/70">Enter details to get feed quantity</p>
      <div className="space-y-3 max-w-xl">
        <BigInput label="Initial number of stocking" value={stocking} onChange={setStocking} />
        <BigInput label="Average Shrimp count" value={count} onChange={setCount} unit="(per/Kg)" />
        <BigInput label="Average Body Weight" value={abw} onChange={setAbw} unit="(gm/piece)" />
        <BigInput label="Feed Percentage" value={feedPct} onChange={setFeedPct} unit="(%)" />
        <button
          onClick={calculate}
          className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3.5 transition"
        >
          Calculate Feed quantity
        </button>
        {result && <ResultCard label="Daily Feed Quantity" value={result} />}
      </div>

      <FarmerDocNote />
      <ReferenceTable />
      <CalcNote>
        The feeding calculator provides a basic understanding to the farmer and not to replace an
        aquaculture expert. This tool allows farmers to closely estimate the daily feed requirements
        of shrimp in the pond, allowing them to manage feed better and reduce feed wastage. When put
        in proper use, a farmer can reduce feed wastage, save on input costs and improve the FCRs of
        their crop by using the feeding calculator on a regular basis.
      </CalcNote>
    </div>
  );
}

// ── Aeration HP ────────────────────────────────────────────────────────────────
function AerationCalc() {
  const [acres, setAcres] = useState('2');
  const [density, setDensity] = useState('40');
  const [doTarget, setDoTarget] = useState('5');
  const baseHpPerAcre = 1 + Math.max(0, (num(density) - 20) / 10) + Math.max(0, (num(doTarget) - 4) * 0.4);
  const totalHp = baseHpPerAcre * num(acres);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumberInput label="Pond area" value={acres} onChange={setAcres} unit="acres" />
        <NumberInput label="Stocking density" value={density} onChange={setDensity} unit="PL/m²" />
        <NumberInput label="Min DO target" value={doTarget} onChange={setDoTarget} unit="mg/L" />
      </div>
      <div className="p-5 rounded-2xl border border-border bg-card">
        <FieldRow label="HP per acre" value={baseHpPerAcre.toFixed(1)} unit="HP" />
        <FieldRow label="Total HP" value={totalHp.toFixed(1)} unit="HP" />
        <FieldRow label="≈ Paddle wheels (1HP each)" value={Math.ceil(totalHp).toString()} />
        <div className="text-[11px] text-foreground/30 mt-3">Add 20-30% margin for monsoon DO crashes. PSA O₂ recommended above 60 PL/m².</div>
      </div>
    </div>
  );
}

// ── Lime ───────────────────────────────────────────────────────────────────────
function LimeCalc() {
  const [acres, setAcres] = useState('1');
  const [phDelta, setPhDelta] = useState('1');
  const [soilType, setSoilType] = useState('clay');
  const multiplier = soilType === 'sandy' ? 60 : soilType === 'loam' ? 90 : 140;
  const kgPerAcre = num(phDelta) * multiplier;
  const total = kgPerAcre * num(acres);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumberInput label="Pond area" value={acres} onChange={setAcres} unit="acres" />
        <NumberInput label="Target pH increase" value={phDelta} onChange={setPhDelta} unit="ΔpH" />
        <label className="block">
          <span className="text-[11px] uppercase tracking-widest text-foreground/40">Soil type</span>
          <div className="mt-1.5 px-3 py-2.5 rounded-xl border border-border bg-card">
            <select value={soilType} onChange={(e) => setSoilType(e.target.value)} className="w-full bg-transparent text-foreground outline-none text-sm">
              <option value="sandy" className="bg-background">Sandy</option>
              <option value="loam" className="bg-background">Loam</option>
              <option value="clay" className="bg-background">Clay</option>
            </select>
          </div>
        </label>
      </div>
      <div className="p-5 rounded-2xl border border-border bg-card">
        <FieldRow label="Ag lime per acre" value={kgPerAcre.toFixed(0)} unit="kg" />
        <FieldRow label="Total ag lime" value={total.toFixed(0)} unit="kg" />
        <FieldRow label="Est. cost (₹12/kg)" value={`₹${(total * 12).toLocaleString('en-IN')}`} />
        <div className="text-[11px] text-foreground/30 mt-3">For EHP eradication, switch to quicklime (CaO) and target pH &gt; 12.</div>
      </div>
    </div>
  );
}

// ── Pond Volume ────────────────────────────────────────────────────────────────
function VolumeCalc() {
  const [length, setLength] = useState('60');
  const [width, setWidth] = useState('40');
  const [depth, setDepth] = useState('1.5');
  const areaSqm = num(length) * num(width);
  const volume = areaSqm * num(depth);
  const acres = areaSqm / 4047;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumberInput label="Length" value={length} onChange={setLength} unit="m" />
        <NumberInput label="Width" value={width} onChange={setWidth} unit="m" />
        <NumberInput label="Avg depth" value={depth} onChange={setDepth} unit="m" />
      </div>
      <div className="p-5 rounded-2xl border border-border bg-card">
        <FieldRow label="Area" value={areaSqm.toFixed(0)} unit="m²" />
        <FieldRow label="Area" value={acres.toFixed(3)} unit="acres" />
        <FieldRow label="Volume" value={volume.toFixed(0)} unit="m³" />
        <FieldRow label="Volume" value={(volume * 1000).toLocaleString('en-IN')} unit="L" />
      </div>
    </div>
  );
}

// ── P&L ────────────────────────────────────────────────────────────────────────
function PnLCalc() {
  const [biomass, setBiomass] = useState('5000');
  const [price, setPrice] = useState('320');
  const [seedCost, setSeedCost] = useState('150000');
  const [feedCost, setFeedCost] = useState('550000');
  const [otherCost, setOtherCost] = useState('120000');
  const revenue = num(biomass) * num(price);
  const totalCost = num(seedCost) + num(feedCost) + num(otherCost);
  const profit = revenue - totalCost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumberInput label="Expected harvest" value={biomass} onChange={setBiomass} unit="kg" />
        <NumberInput label="Price per kg" value={price} onChange={setPrice} unit="₹/kg" />
        <NumberInput label="Seed cost" value={seedCost} onChange={setSeedCost} unit="₹" />
        <NumberInput label="Feed cost" value={feedCost} onChange={setFeedCost} unit="₹" />
        <NumberInput label="Other costs" value={otherCost} onChange={setOtherCost} unit="₹" />
      </div>
      <div className="p-5 rounded-2xl border border-border bg-card">
        <FieldRow label="Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} />
        <FieldRow label="Total cost" value={`₹${totalCost.toLocaleString('en-IN')}`} />
        <div className="border-t border-border mt-2 pt-2">
          <div className="flex items-baseline justify-between py-1.5 text-sm">
            <span className="text-foreground/60">Profit</span>
            <span className={`text-2xl font-bold tabular-nums ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ₹{profit.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-baseline justify-between py-1 text-sm">
            <span className="text-foreground/60">Margin</span>
            <span className={`font-bold tabular-nums ${margin >= 25 ? 'text-emerald-400' : margin >= 10 ? 'text-amber-400' : 'text-red-400'}`}>
              {margin.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CalculatorsModule() {
  const [active, setActive] = useState<CalcId>('survival');
  const [mobileOpen, setMobileOpen] = useState(false); // master→detail on small screens
  const activeMeta = CALCS.find((c) => c.id === active)!;

  return (
    <div className="lg:grid lg:grid-cols-4 lg:gap-6">
      {/* Sidebar list — full width on mobile (hidden once a calc is opened) */}
      <div className={`lg:col-span-1 lg:block ${mobileOpen ? 'hidden' : 'block'}`}>
        <div className="space-y-2">
          {CALCS.map(({ id, label, icon: Icon, accent, desc }) => {
            const sel = id === active;
            return (
              <button
                key={id}
                onClick={() => { setActive(id); setMobileOpen(true); }}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition ${
                  sel ? 'border-border bg-card lg:bg-muted' : 'border-border bg-card hover:bg-muted'
                }`}
              >
                <div className="p-2 rounded-lg shrink-0" style={{ background: `${accent}22` }}>
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{label}</div>
                  <div className="text-[11px] text-foreground/40 truncate">{desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active calculator — opens in place on mobile, side-by-side on desktop */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`lg:col-span-3 p-5 md:p-6 rounded-2xl border border-border bg-card mt-4 lg:mt-0 ${
          mobileOpen ? 'block' : 'hidden'
        } lg:block`}
      >
        {/* Mobile-only back to the calculator list */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> All calculators
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg" style={{ background: `${activeMeta.accent}22` }}>
            <Calculator className="w-4 h-4" style={{ color: activeMeta.accent }} />
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">{activeMeta.label}</div>
            <div className="text-xs text-foreground/40">{activeMeta.desc}</div>
          </div>
        </div>

        {active === 'survival' && <SurvivalCalc />}
        {active === 'count'    && <CountCalc />}
        {active === 'feed'     && <FeedCalc />}
        {active === 'aeration' && <AerationCalc />}
        {active === 'lime'     && <LimeCalc />}
        {active === 'volume'   && <VolumeCalc />}
        {active === 'pnl'      && <PnLCalc />}
      </motion.div>
    </div>
  );
}
