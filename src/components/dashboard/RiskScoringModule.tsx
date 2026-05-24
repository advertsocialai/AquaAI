import { motion } from 'framer-motion';
import {
  Landmark, BadgeCheck, AlertTriangle, FileSpreadsheet,
  TrendingUp, ShieldCheck, IndianRupee,
} from 'lucide-react';

type Farm = {
  id: string;
  farmer: string;
  district: string;
  acres: number;
  qsAvg: number;
  outbreakRisk: number;
  riskBand: 'A' | 'B' | 'C' | 'D';
  loanReq: number;
  recommended: number;
};

const FARMS: Farm[] = [
  { id: 'F-1142', farmer: 'V. Ramana',     district: 'Bhimavaram', acres: 4.5, qsAvg: 91, outbreakRisk: 12, riskBand: 'A', loanReq: 800000,  recommended: 800000 },
  { id: 'F-1187', farmer: 'K. Srinivasan', district: 'Nellore',    acres: 2.0, qsAvg: 84, outbreakRisk: 28, riskBand: 'B', loanReq: 400000,  recommended: 350000 },
  { id: 'F-1203', farmer: 'A. Mohanty',    district: 'Paradip',    acres: 1.5, qsAvg: 72, outbreakRisk: 48, riskBand: 'C', loanReq: 300000,  recommended: 180000 },
  { id: 'F-1221', farmer: 'S. Banerjee',   district: 'Haldia',     acres: 1.0, qsAvg: 61, outbreakRisk: 64, riskBand: 'D', loanReq: 250000,  recommended: 0      },
  { id: 'F-1234', farmer: 'P. Patel',      district: 'Surat',      acres: 6.0, qsAvg: 88, outbreakRisk: 18, riskBand: 'A', loanReq: 1200000, recommended: 1200000 },
];

const BAND_COLORS: Record<Farm['riskBand'], string> = {
  A: '#34d399', B: '#facc15', C: '#fb923c', D: '#f87171',
};

function formatINR(n: number) {
  if (n === 0) return '—';
  if (n < 100000) return `₹${(n / 1000).toFixed(0)}K`;
  if (n < 10000000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${(n / 10000000).toFixed(2)} Cr`;
}

function RiskBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function RiskScoringModule() {
  const total = FARMS.length;
  const a = FARMS.filter((f) => f.riskBand === 'A').length;
  const d = FARMS.filter((f) => f.riskBand === 'D').length;
  const sanctioned = FARMS.reduce((acc, f) => acc + f.recommended, 0);
  const requested = FARMS.reduce((acc, f) => acc + f.loanReq, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Farms in book',       value: total,                icon: Landmark,      color: '#facc15' },
          { label: 'Band A (low risk)',   value: a,                    icon: BadgeCheck,    color: '#34d399' },
          { label: 'Band D (decline)',    value: d,                    icon: AlertTriangle, color: '#f87171' },
          { label: 'Sanctioned / requested', value: `${formatINR(sanctioned)} / ${formatINR(requested)}`, icon: IndianRupee, color: '#38bdf8' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
            <Icon className="w-4 h-4 mb-2" style={{ color }} />
            <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
            <div className="text-xs text-white/40">{label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] uppercase tracking-widest text-white/30">Farm Risk Book</div>
          <button className="text-xs text-white/40 hover:text-white inline-flex items-center gap-1">
            <FileSpreadsheet className="w-3 h-3" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {['Farm', 'Farmer', 'District', 'Acres', 'QS avg', 'Outbreak risk', 'Band', 'Requested', 'Recommended'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FARMS.map((f) => {
                const color = BAND_COLORS[f.riskBand];
                return (
                  <motion.tr key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-xs text-amber-300">{f.id}</td>
                    <td className="px-4 py-3 text-white/90">{f.farmer}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{f.district}</td>
                    <td className="px-4 py-3 text-white/70 tabular-nums">{f.acres}</td>
                    <td className="px-4 py-3 text-white/90 tabular-nums">{f.qsAvg}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <RiskBar pct={f.outbreakRisk} color={color} />
                        <span className="text-xs tabular-nums text-white/60">{f.outbreakRisk}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs" style={{ background: `${color}22`, color }}>
                        {f.riskBand}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/70 tabular-nums">{formatINR(f.loanReq)}</td>
                    <td className="px-4 py-3 font-bold tabular-nums" style={{ color: f.recommended === 0 ? '#f87171' : '#34d399' }}>
                      {formatINR(f.recommended)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white">Scoring Model Inputs</span>
          </div>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex justify-between"><span>QC Score history (5 cycles)</span><span className="text-white/40">40%</span></li>
            <li className="flex justify-between"><span>Outbreak proximity (5km, 30d)</span><span className="text-white/40">25%</span></li>
            <li className="flex justify-between"><span>Cycle yield consistency</span><span className="text-white/40">20%</span></li>
            <li className="flex justify-between"><span>Hatchery source quality</span><span className="text-white/40">10%</span></li>
            <li className="flex justify-between"><span>Water quality compliance</span><span className="text-white/40">5%</span></li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-white">Insurance Claims (this cycle)</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span className="text-white/70">Claims filed</span><span className="font-bold text-white tabular-nums">24</span></div>
            <div className="flex items-center justify-between"><span className="text-white/70">Auto-verified (HMAC certs)</span><span className="font-bold text-emerald-400 tabular-nums">19</span></div>
            <div className="flex items-center justify-between"><span className="text-white/70">Pending field visit</span><span className="font-bold text-amber-400 tabular-nums">4</span></div>
            <div className="flex items-center justify-between"><span className="text-white/70">Fraud flagged</span><span className="font-bold text-red-400 tabular-nums">1</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
