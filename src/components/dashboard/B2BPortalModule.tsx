import { motion } from 'framer-motion';
import {
  Package, Truck, Star, TrendingUp, FileCheck, CheckCircle2, AlertCircle,
} from 'lucide-react';

const BATCHES = [
  { id: 'HB-3401', species: 'L. vannamei', size: 'PL-12', count: '5 lakh',  qs: 92, status: 'Ready',   buyer: '—'              },
  { id: 'HB-3402', species: 'L. vannamei', size: 'PL-10', count: '3 lakh',  qs: 88, status: 'Reserved', buyer: 'Krishna Farms'  },
  { id: 'HB-3403', species: 'P. monodon',  size: 'PL-15', count: '1.2 lakh',qs: 95, status: 'In QC',    buyer: '—'              },
  { id: 'HB-3404', species: 'L. vannamei', size: 'PL-11', count: '4 lakh',  qs: 67, status: 'Rejected', buyer: '—'              },
];

const BUYERS = [
  { name: 'Krishna Farms',     district: 'Krishna, AP',      orders: 14, rating: 4.7, ltv: '₹18.4 L' },
  { name: 'Bhimavaram Cluster',district: 'West Godavari, AP',orders: 22, rating: 4.9, ltv: '₹42.1 L' },
  { name: 'Nellore Agg.',      district: 'Nellore, AP',      orders: 9,  rating: 4.5, ltv: '₹11.2 L' },
  { name: 'Surat Hatch Co.',   district: 'Surat, GJ',        orders: 5,  rating: 4.2, ltv: '₹6.8 L'  },
];

function QSBar({ value }: { value: number }) {
  const color = value >= 90 ? '#34d399' : value >= 80 ? '#facc15' : value >= 70 ? '#fb923c' : '#f87171';
  return (
    <div className="flex items-center gap-2 w-24">
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Ready:     'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
    Reserved:  'text-sky-300 bg-sky-400/10 border-sky-400/20',
    'In QC':   'text-amber-300 bg-amber-400/10 border-amber-400/20',
    Rejected:  'text-red-300 bg-red-400/10 border-red-400/20',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] border ${map[status] ?? ''}`}>{status}</span>;
}

export function B2BPortalModule() {
  const total = BATCHES.length;
  const ready = BATCHES.filter((b) => b.status === 'Ready').length;
  const avgQS = Math.round(BATCHES.reduce((a, b) => a + b.qs, 0) / total);
  const rejected = BATCHES.filter((b) => b.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Batches',  value: total,      icon: Package,    color: '#a78bfa' },
          { label: 'Ready to Ship',  value: ready,      icon: Truck,      color: '#34d399' },
          { label: 'Avg QS Score',   value: `${avgQS}`, icon: TrendingUp, color: '#38bdf8' },
          { label: 'Rejected (QC)',  value: rejected,   icon: AlertCircle,color: '#f87171' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
            <Icon className="w-4 h-4 mb-2" style={{ color }} />
            <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
            <div className="text-xs text-white/40">{label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Active PL Batches</div>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {['Batch', 'Species · Stage', 'Count', 'QS', 'Status', 'Reserved For'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BATCHES.map((b) => (
                <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-4 py-3 font-mono text-xs text-violet-300">{b.id}</td>
                  <td className="px-4 py-3 text-white/90">{b.species} · <span className="text-white/40">{b.size}</span></td>
                  <td className="px-4 py-3 text-white/70 tabular-nums">{b.count}</td>
                  <td className="px-4 py-3"><QSBar value={b.qs} /></td>
                  <td className="px-4 py-3"><StatusPill status={b.status} /></td>
                  <td className="px-4 py-3 text-xs text-white/50">{b.buyer}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Top Buyers</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BUYERS.map((b) => (
            <div key={b.name} className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-white truncate">{b.name}</div>
                <div className="flex items-center gap-1 text-xs text-amber-300">
                  <Star className="w-3 h-3 fill-amber-300" /> {b.rating}
                </div>
              </div>
              <div className="text-[11px] text-white/40 mb-3">{b.district}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">{b.orders} orders</span>
                <span className="font-bold text-emerald-400">{b.ltv}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] flex items-start gap-3">
        <FileCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <div className="text-white font-semibold mb-1">Auto-generated invoices + QC certs</div>
          <div className="text-white/50 text-xs flex items-center gap-2 flex-wrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> MPEDA license linked
            <span className="text-white/20">·</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> GST e-invoice
            <span className="text-white/20">·</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> HMAC-signed QC PDF + QR
          </div>
        </div>
      </div>
    </div>
  );
}
