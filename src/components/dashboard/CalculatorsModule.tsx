import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator, Fish, Fan, Droplets, Beaker, Layers, IndianRupee,
} from 'lucide-react';

type CalcId = 'count' | 'feed' | 'aeration' | 'lime' | 'volume' | 'pnl';

const CALCS: { id: CalcId; label: string; icon: React.ElementType; accent: string; desc: string }[] = [
  { id: 'count',    label: 'Shrimp Count',      icon: Fish,        accent: '#38bdf8', desc: 'Sample-to-pond extrapolation' },
  { id: 'feed',     label: 'Daily Feed',        icon: Layers,      accent: '#facc15', desc: 'Biomass × rate × FCR' },
  { id: 'aeration', label: 'Aeration HP',       icon: Fan,         accent: '#a78bfa', desc: 'Per acre, stocking, DO target' },
  { id: 'lime',     label: 'Liming Requirement',icon: Beaker,      accent: '#34d399', desc: 'Soil pH delta × area' },
  { id: 'volume',   label: 'Pond Volume',       icon: Droplets,    accent: '#60a5fa', desc: 'Area × depth' },
  { id: 'pnl',      label: 'Profit / Loss',     icon: IndianRupee, accent: '#fb923c', desc: 'Crop value at risk vs cost' },
];

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
  const extrapolated = Math.round((num(sample) / num(sampleVol)) * num(pondVol));
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

// ── Daily Feed ─────────────────────────────────────────────────────────────────
function FeedCalc() {
  const [biomass, setBiomass] = useState('500');
  const [rate, setRate] = useState('4');
  const [fcr, setFcr] = useState('1.4');
  const daily = (num(biomass) * num(rate)) / 100;
  const cycleFeed = daily * 30 * num(fcr);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumberInput label="Total biomass" value={biomass} onChange={setBiomass} unit="kg" />
        <NumberInput label="Feeding rate (% body wt)" value={rate} onChange={setRate} unit="%" />
        <NumberInput label="Target FCR" value={fcr} onChange={setFcr} />
      </div>
      <div className="p-5 rounded-2xl border border-border bg-card">
        <FieldRow label="Daily feed" value={daily.toFixed(1)} unit="kg/day" />
        <FieldRow label="Weekly feed" value={(daily * 7).toFixed(1)} unit="kg/wk" />
        <FieldRow label="Est. 30-day feed (× FCR)" value={cycleFeed.toFixed(0)} unit="kg" />
        <div className="text-[11px] text-foreground/30 mt-3">PL stage: lower rate to 6-8%. Mid grow: 3-4%. Harvest: 1.5-2%.</div>
      </div>
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
  const [active, setActive] = useState<CalcId>('count');
  const activeMeta = CALCS.find((c) => c.id === active)!;

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="space-y-2">
          {CALCS.map(({ id, label, icon: Icon, accent, desc }) => {
            const sel = id === active;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition ${
                  sel ? 'border-border bg-card' : 'border-border bg-card hover:bg-muted'
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

      {/* Active calculator */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-3 p-6 rounded-2xl border border-border bg-card"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg" style={{ background: `${activeMeta.accent}22` }}>
            <Calculator className="w-4 h-4" style={{ color: activeMeta.accent }} />
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">{activeMeta.label}</div>
            <div className="text-xs text-foreground/40">{activeMeta.desc}</div>
          </div>
        </div>

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
