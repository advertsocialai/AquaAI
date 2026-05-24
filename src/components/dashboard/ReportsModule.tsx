import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Search, Calendar, FileCheck, FileBarChart,
  ShieldCheck, Truck, Landmark, Award, Filter,
} from 'lucide-react';
import { QcCertificatePreview } from './QcCertificatePreview';

type ReportKind =
  | 'qc-cert' | 'surveillance' | 'hatchery-perf' | 'export-audit'
  | 'compliance' | 'insurance' | 'annual';

const KINDS: { id: ReportKind; label: string; icon: React.ElementType; accent: string }[] = [
  { id: 'qc-cert',       label: 'QC Certificate Archive',  icon: ShieldCheck,  accent: '#34d399' },
  { id: 'surveillance',  label: 'Disease Surveillance',    icon: FileBarChart, accent: '#f87171' },
  { id: 'hatchery-perf', label: 'Hatchery Performance',    icon: Award,        accent: '#a78bfa' },
  { id: 'export-audit',  label: 'Export Audit Trail',      icon: Truck,        accent: '#fb923c' },
  { id: 'compliance',    label: 'MPEDA Compliance',        icon: FileCheck,    accent: '#facc15' },
  { id: 'insurance',     label: 'Insurance Claims',        icon: Landmark,     accent: '#38bdf8' },
  { id: 'annual',        label: 'Annual Performance',      icon: FileText,     accent: '#60a5fa' },
];

type Row = { id: string; date: string; subject: string; score?: string; status: string; tone: 'ok' | 'warn' | 'crit' | 'info' };

const ROWS: Record<ReportKind, Row[]> = {
  'qc-cert': [
    { id: 'QC-2026-04421', date: '2026-05-22', subject: 'L. vannamei · PL-12 · 5 lakh',  score: '92 · Premium',  status: 'Signed',   tone: 'ok'   },
    { id: 'QC-2026-04420', date: '2026-05-22', subject: 'P. monodon · PL-15 · 1.2 lakh', score: '95 · Premium',  status: 'Signed',   tone: 'ok'   },
    { id: 'QC-2026-04415', date: '2026-05-21', subject: 'L. vannamei · PL-11 · 4 lakh',  score: '67 · Caution',  status: 'Flagged',  tone: 'warn' },
    { id: 'QC-2026-04408', date: '2026-05-21', subject: 'L. vannamei · PL-10 · 3 lakh',  score: '88 · Good',     status: 'Signed',   tone: 'ok'   },
    { id: 'QC-2026-04392', date: '2026-05-20', subject: 'L. vannamei · PL-12 · 2 lakh',  score: '42 · Reject',   status: 'EHP-pos',  tone: 'crit' },
  ],
  surveillance: [
    { id: 'SR-Q1-AP-2026', date: '2026-04-15', subject: 'Q1 — Andhra Pradesh',       status: 'Filed',     tone: 'ok'   },
    { id: 'SR-Q1-TN-2026', date: '2026-04-15', subject: 'Q1 — Tamil Nadu',           status: 'Filed',     tone: 'ok'   },
    { id: 'SR-Q1-OD-2026', date: '2026-04-15', subject: 'Q1 — Odisha',               status: 'Pending',   tone: 'warn' },
    { id: 'SR-W20-WG',     date: '2026-05-19', subject: 'Week 20 — West Godavari EHP cluster', status: 'Filed', tone: 'crit' },
  ],
  'hatchery-perf': [
    { id: 'HP-2026-Q1-AP', date: '2026-04-30', subject: 'Aquaprime Hatcheries — Q1 review',  score: 'Avg QS 94', status: 'A++',   tone: 'ok'   },
    { id: 'HP-2026-Q1-NL', date: '2026-04-30', subject: 'BlueFin SPF Labs — Q1 review',       score: 'Avg QS 92', status: 'A+',    tone: 'ok'   },
    { id: 'HP-2026-Q1-KR', date: '2026-04-30', subject: 'AndhraMarine PLs — Q1 review',       score: 'Avg QS 88', status: 'A',     tone: 'info' },
  ],
  'export-audit': [
    { id: 'EA-2026-1124', date: '2026-05-20', subject: 'Bhimavaram → Vizag · 12 t · IFCO',     status: 'Cleared',  tone: 'ok' },
    { id: 'EA-2026-1119', date: '2026-05-18', subject: 'Nellore → Chennai Air · 4 t · CrustaCo',status: 'Cleared',  tone: 'ok' },
    { id: 'EA-2026-1107', date: '2026-05-14', subject: 'Surat → Pipavav · 18 t · OceanGold',    status: 'Reviewing',tone: 'warn'},
  ],
  compliance: [
    { id: 'MP-LIC-1247', date: '2026-05-12', subject: 'MPEDA license renewal — Hatcheries (AP)', status: 'Up to date', tone: 'ok' },
    { id: 'BAP-2026-AP', date: '2026-04-22', subject: 'BAP certification audit — 12 hatcheries', status: 'Passed',     tone: 'ok' },
    { id: 'ASC-2026-GJ', date: '2026-04-18', subject: 'ASC certification — Surat cluster',       status: 'In progress',tone: 'warn' },
    { id: 'GAP-2026-OD', date: '2026-04-04', subject: 'GlobalGAP audit — Paradip cluster',       status: 'Failed',     tone: 'crit' },
  ],
  insurance: [
    { id: 'INS-2026-0421', date: '2026-05-21', subject: 'EHP crop loss — V. Ramana · ₹3.2L',    status: 'Approved',   tone: 'ok'   },
    { id: 'INS-2026-0418', date: '2026-05-19', subject: 'Cyclone damage — K. Srinivasan · ₹1.8L',status: 'Approved',   tone: 'ok'   },
    { id: 'INS-2026-0414', date: '2026-05-15', subject: 'WSSV outbreak — A. Mohanty · ₹5.4L',    status: 'Field visit',tone: 'warn' },
    { id: 'INS-2026-0411', date: '2026-05-12', subject: 'Power outage — S. Banerjee · ₹0.9L',    status: 'Flagged',    tone: 'crit' },
  ],
  annual: [
    { id: 'AR-2025-FY', date: '2026-04-01', subject: 'FY2025 — full season summary', score: '4.6 t/acre avg', status: 'Generated', tone: 'ok' },
    { id: 'AR-2024-FY', date: '2025-04-01', subject: 'FY2024 — full season summary', score: '4.2 t/acre avg', status: 'Archived',  tone: 'info'},
  ],
};

function StatusBadge({ status, tone }: { status: string; tone: Row['tone'] }) {
  const map = {
    ok:   'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
    warn: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
    crit: 'text-red-300 bg-red-400/10 border-red-400/20',
    info: 'text-sky-300 bg-sky-400/10 border-sky-400/20',
  } as const;
  return <span className={`px-2 py-0.5 rounded-full text-[10px] border ${map[tone]}`}>{status}</span>;
}

export function ReportsModule() {
  const [kind, setKind] = useState<ReportKind>('qc-cert');
  const [query, setQuery] = useState('');
  const active = KINDS.find((k) => k.id === kind)!;
  const rows = ROWS[kind].filter(
    (r) =>
      !query ||
      r.subject.toLowerCase().includes(query.toLowerCase()) ||
      r.id.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {KINDS.map(({ id, label, icon: Icon, accent }) => {
          const sel = id === kind;
          return (
            <button
              key={id}
              onClick={() => setKind(id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition ${
                sel ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 bg-white/[0.03] text-white/50 hover:text-white/80'
              }`}
              style={sel ? { boxShadow: `0 0 24px ${accent}22` } : undefined}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: sel ? accent : undefined }} />
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID or subject…"
            className="bg-transparent outline-none text-sm text-white placeholder:text-white/30 flex-1"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white/60 hover:text-white">
          <Calendar className="w-3.5 h-3.5 text-violet-400" /> Date range
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white/60 hover:text-white">
          <Filter className="w-3.5 h-3.5 text-amber-400" /> Filters
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-xs text-cyan-300 hover:bg-cyan-500/30">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <motion.div
        key={kind}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-x-auto rounded-2xl border border-white/10"
      >
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <active.icon className="w-4 h-4" style={{ color: active.accent }} />
            <span className="text-sm font-semibold text-white">{active.label}</span>
            <span className="text-[11px] text-white/30">— {rows.length} record{rows.length === 1 ? '' : 's'}</span>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {['Report ID', 'Date', 'Subject', 'Score / Detail', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-4 py-3 font-mono text-xs text-violet-300">{r.id}</td>
                <td className="px-4 py-3 text-white/50 text-xs">{r.date}</td>
                <td className="px-4 py-3 text-white/90">{r.subject}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{r.score ?? '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} tone={r.tone} /></td>
                <td className="px-4 py-3">
                  <button className="text-xs text-white/40 hover:text-white inline-flex items-center gap-1">
                    <Download className="w-3 h-3" /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {kind === 'qc-cert' && (
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Sample certificate preview</div>
          <QcCertificatePreview />
        </div>
      )}

      <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.03]">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-xs text-white/50">
          Every report is HMAC-signed · MPEDA-compliant format · DPDPA-compliant data residency in Mumbai
        </span>
      </div>
    </div>
  );
}
