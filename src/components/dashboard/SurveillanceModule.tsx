import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, FileText, MapPin, TrendingUp, Activity, Eye,
} from 'lucide-react';
import { OutbreakHeatmap } from './OutbreakHeatmap';

const OUTBREAKS = [
  { district: 'West Godavari', state: 'AP', species: 'L. vannamei', disease: 'EHP',   farms: 14, severity: 'high'   },
  { district: 'Krishna',       state: 'AP', species: 'L. vannamei', disease: 'WSSV',  farms: 8,  severity: 'high'   },
  { district: 'Nellore',       state: 'AP', species: 'L. vannamei', disease: 'AHPND', farms: 3,  severity: 'medium' },
  { district: 'Surat',         state: 'GJ', species: 'L. vannamei', disease: 'EHP',   farms: 5,  severity: 'medium' },
  { district: 'Bhubaneswar',   state: 'OD', species: 'P. monodon',  disease: 'WSSV',  farms: 2,  severity: 'low'    },
  { district: 'Kakdwip',       state: 'WB', species: 'P. monodon',  disease: 'BGD',   farms: 1,  severity: 'low'    },
];

const COMPLIANCE = [
  { metric: 'MPEDA-licensed hatcheries',  value: '1,247', delta: '+18 this quarter' },
  { metric: 'Active surveillance farms',  value: '8,432', delta: '+612 vs Q1'       },
  { metric: 'NSPAAD reports filed',       value: '342',   delta: '+24 this week'    },
  { metric: 'Critical alerts (30d)',      value: '47',    delta: '+12 vs prev 30d'  },
];

function SeverityChip({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    high:   'text-red-300 bg-red-400/10 border-red-400/30',
    medium: 'text-amber-300 bg-amber-400/10 border-amber-400/30',
    low:    'text-emerald-300 bg-emerald-400/10 border-emerald-400/30',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] border uppercase tracking-wide ${map[severity]}`}>{severity}</span>;
}

export function SurveillanceModule() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {COMPLIANCE.map((c) => (
          <div key={c.metric} className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
            <Shield className="w-4 h-4 mb-2 text-red-400" />
            <div className="text-2xl font-bold text-white tabular-nums">{c.value}</div>
            <div className="text-xs text-white/40">{c.metric}</div>
            <div className="text-[10px] text-emerald-400 mt-1">{c.delta}</div>
          </div>
        ))}
      </div>

      <OutbreakHeatmap />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-[11px] uppercase tracking-widest text-white/30">Active outbreak clusters</span>
          <span className="ml-auto text-[10px] text-white/30">Last 14 days · NSPAAD sync</span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {['District', 'State', 'Species', 'Disease', 'Farms', 'Severity', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OUTBREAKS.map((o, i) => (
                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/90 flex items-center gap-2"><MapPin className="w-3 h-3 text-red-400" /> {o.district}</td>
                  <td className="px-4 py-3 text-white/50 text-xs">{o.state}</td>
                  <td className="px-4 py-3 text-white/70 text-xs">{o.species}</td>
                  <td className="px-4 py-3 font-mono text-xs text-red-300">{o.disease}</td>
                  <td className="px-4 py-3 text-white/90 tabular-nums">{o.farms}</td>
                  <td className="px-4 py-3"><SeverityChip severity={o.severity} /></td>
                  <td className="px-4 py-3"><button className="text-xs text-white/40 hover:text-white inline-flex items-center gap-1"><Eye className="w-3 h-3" /> View</button></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">Compliance Reports</span>
          </div>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Q1 2026 — Andhra Pradesh',   status: 'Filed',   tone: 'text-emerald-400' },
              { label: 'Q1 2026 — Tamil Nadu',       status: 'Filed',   tone: 'text-emerald-400' },
              { label: 'Q1 2026 — Odisha',           status: 'Pending', tone: 'text-amber-400'   },
              { label: 'EHP eradication — WG dist.', status: 'Active',  tone: 'text-sky-400'     },
            ].map((r) => (
              <li key={r.label} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                <span className="text-white/80 text-xs">{r.label}</span>
                <span className={`text-[11px] font-bold ${r.tone}`}>{r.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white">PMMSY Scheme Reach</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span className="text-white/70">Beneficiaries onboarded</span><span className="font-bold text-white tabular-nums">42,108</span></div>
            <div className="flex items-center justify-between"><span className="text-white/70">Subsidies disbursed</span><span className="font-bold text-emerald-400">₹187.3 Cr</span></div>
            <div className="flex items-center justify-between"><span className="text-white/70">Aerator subsidy claims</span><span className="font-bold text-white tabular-nums">3,891</span></div>
            <div className="flex items-center justify-between"><span className="text-white/70">Pond construction grants</span><span className="font-bold text-white tabular-nums">612</span></div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] flex items-center gap-3">
        <Activity className="w-4 h-4 text-red-400" />
        <span className="text-xs text-white/60">
          OIE/WOAH-aligned · NSPAAD auto-sync · 5km radius alerts to farmers · jurisdiction-locked access
        </span>
      </div>
    </div>
  );
}
