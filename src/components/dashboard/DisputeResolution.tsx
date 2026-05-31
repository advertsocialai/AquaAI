import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertOctagon, MessageSquareWarning, FileText, Send, Check, X,
  Clock, Image as ImageIcon, Scale,
} from 'lucide-react';

type DisputeStatus = 'open' | 'investigating' | 'resolved' | 'rejected';

type Dispute = {
  id: string;
  buyer: string;
  batch: string;
  raised: string;
  reason: string;
  amount: number;
  status: DisputeStatus;
  evidence: number;
  messages: { from: string; at: string; text: string }[];
};

const DISPUTES: Dispute[] = [
  {
    id: 'DSP-2026-0421',
    buyer: 'Krishna Farms',
    batch: 'HB-3402 (3 lakh PL-10)',
    raised: '2026-05-22',
    reason: 'Invoice quantity mismatch — short by 18,000 PLs',
    amount: 7200,
    status: 'investigating',
    evidence: 4,
    messages: [
      { from: 'Buyer',    at: '2026-05-22 14:02', text: 'Counted 282k, invoice says 300k. Photos attached.' },
      { from: 'Hatchery', at: '2026-05-22 16:18', text: 'Sending verification team tomorrow morning.' },
      { from: 'AquaI',    at: '2026-05-23 09:30', text: 'AI count from buyer\'s tray images: 283,400 ±2%.' },
    ],
  },
  {
    id: 'DSP-2026-0414',
    buyer: 'Bhimavaram Cluster',
    batch: 'HB-3397 (5 lakh PL-12)',
    raised: '2026-05-18',
    reason: 'EHP detected on DOC-9 — claims pre-existing infection',
    amount: 45000,
    status: 'open',
    evidence: 7,
    messages: [
      { from: 'Buyer',    at: '2026-05-18 09:11', text: 'Day 9 sample tested EHP positive at lab. QC cert says clear.' },
      { from: 'Hatchery', at: '2026-05-18 11:40', text: 'PCR at our facility was negative on dispatch day.' },
    ],
  },
  {
    id: 'DSP-2026-0397',
    buyer: 'Nellore Agg.',
    batch: 'HB-3388 (2 lakh PL-11)',
    raised: '2026-05-10',
    reason: 'Late delivery — buyer claims compensation',
    amount: 12500,
    status: 'resolved',
    evidence: 2,
    messages: [],
  },
];

function StatusBadge({ status }: { status: DisputeStatus }) {
  const map: Record<DisputeStatus, { label: string; tone: string }> = {
    open:          { label: 'Open',          tone: 'text-red-300 bg-red-400/10 border-red-400/30' },
    investigating: { label: 'Investigating', tone: 'text-amber-300 bg-amber-400/10 border-amber-400/30' },
    resolved:      { label: 'Resolved',      tone: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30' },
    rejected:      { label: 'Rejected',      tone: 'text-foreground/40 bg-card border-border' },
  };
  const m = map[status];
  return <span className={`px-2 py-0.5 rounded-full text-[10px] border ${m.tone}`}>{m.label}</span>;
}

export function DisputeResolution() {
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const active = DISPUTES.find((d) => d.id === selected);

  const stats = {
    total: DISPUTES.length,
    open: DISPUTES.filter((d) => d.status === 'open').length,
    investigating: DISPUTES.filter((d) => d.status === 'investigating').length,
    resolved: DISPUTES.filter((d) => d.status === 'resolved').length,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total disputes',   value: stats.total,         icon: Scale,             color: '#a78bfa' },
          { label: 'Open',             value: stats.open,          icon: AlertOctagon,      color: '#f87171' },
          { label: 'Investigating',    value: stats.investigating, icon: MessageSquareWarning, color: '#fb923c' },
          { label: 'Resolved (30d)',   value: stats.resolved,      icon: Check,             color: '#34d399' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-3 rounded-xl border border-border bg-card">
            <Icon className="w-3.5 h-3.5 mb-2" style={{ color }} />
            <div className="text-xl font-bold text-foreground tabular-nums">{value}</div>
            <div className="text-[11px] text-foreground/40">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 space-y-2">
          {DISPUTES.map((d) => (
            <motion.button
              key={d.id}
              whileHover={{ x: 2 }}
              onClick={() => setSelected(d.id)}
              className={`w-full text-left p-3 rounded-xl border transition ${
                selected === d.id
                  ? 'border-teal-400/40 bg-teal-400/5'
                  : 'border-border bg-card hover:bg-muted'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-violet-300">{d.id}</span>
                <StatusBadge status={d.status} />
              </div>
              <div className="text-sm text-foreground/90 line-clamp-1">{d.reason}</div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-foreground/40">
                <span>{d.buyer}</span>
                <span className="text-emerald-400 font-bold">₹{d.amount.toLocaleString('en-IN')}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-5 rounded-xl border border-border bg-card space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs text-violet-300 mb-1">{active.id}</div>
                    <div className="text-sm font-semibold text-foreground">{active.reason}</div>
                    <div className="text-[11px] text-foreground/40 mt-1">
                      {active.buyer} · {active.batch} · raised {active.raised}
                    </div>
                  </div>
                  <StatusBadge status={active.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-card">
                    <div className="text-foreground/40 text-[10px] uppercase tracking-widest">Amount in dispute</div>
                    <div className="text-emerald-400 font-bold mt-0.5">₹{active.amount.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-card">
                    <div className="text-foreground/40 text-[10px] uppercase tracking-widest">Evidence files</div>
                    <div className="inline-flex items-center gap-1 text-foreground/80 mt-0.5">
                      <ImageIcon className="w-3 h-3" /> {active.evidence} attachments
                    </div>
                  </div>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {active.messages.map((m, i) => {
                    const tone =
                      m.from === 'AquaI'    ? 'border-teal-400/30 bg-teal-400/5'
                      : m.from === 'Buyer'  ? 'border-amber-400/30 bg-amber-400/5'
                      :                       'border-border bg-card';
                    return (
                      <div key={i} className={`p-2.5 rounded-lg border ${tone} text-xs`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-foreground/90">{m.from}</span>
                          <span className="text-foreground/30 inline-flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {m.at}
                          </span>
                        </div>
                        <div className="text-foreground/70">{m.text}</div>
                      </div>
                    );
                  })}
                </div>

                <form
                  onSubmit={(e) => { e.preventDefault(); setReply(''); }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Reply to buyer or escalate to AquaI mediator…"
                    className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm outline-none focus:border-teal-400/40 placeholder:text-foreground/30"
                  />
                  <button
                    type="submit"
                    disabled={!reply.trim()}
                    className="p-2 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-30 text-black"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 text-xs hover:bg-emerald-400/20">
                    <Check className="w-3.5 h-3.5" /> Accept settlement
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs hover:bg-amber-400/20">
                    <FileText className="w-3.5 h-3.5" /> Escalate to AquaI mediator
                  </button>
                  <button className="inline-flex items-center justify-center p-2 rounded-lg border border-border bg-card text-foreground/50 hover:bg-muted">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 rounded-xl border border-dashed border-border bg-card text-sm text-foreground/30">
                Select a dispute on the left to view conversation, evidence and settlement options.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
