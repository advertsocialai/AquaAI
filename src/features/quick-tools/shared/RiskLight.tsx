import type { RiskLevel } from '@/features/quick-tools/types';

const STYLE: Record<RiskLevel, { dot: string; pill: string; label: string }> = {
  green:        { dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200', label: 'Good' },
  amber:        { dot: 'bg-amber-500',   pill: 'bg-amber-50 text-amber-700 ring-amber-200',       label: 'Caution' },
  red:          { dot: 'bg-rose-600',    pill: 'bg-rose-50 text-rose-700 ring-rose-200',          label: 'Risk' },
  inconclusive: { dot: 'bg-neutral-400', pill: 'bg-neutral-100 text-neutral-600 ring-neutral-200', label: 'Inconclusive' },
};

export function RiskLight({ risk, label }: { risk: RiskLevel; label?: string }) {
  const s = STYLE[risk];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ring-1 ${s.pill}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
      {label ?? s.label}
    </span>
  );
}
