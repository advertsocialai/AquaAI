import { useEffect } from 'react';
import report from '@/data/coverageReport.json';

/** Internal test-coverage dashboard — % per framework + per module, from the
 *  merged Vitest + pytest coverage report (scripts/collect-coverage.mjs). */
type Metric = { statements: number; branches: number; functions: number; lines: number };
type Framework = { name: string; tool: string; totals: Metric; files: { name: string; pct: number }[] };

function tone(pct: number) {
  if (pct >= 80) return 'bg-emerald-500';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
}
function textTone(pct: number) {
  if (pct >= 80) return 'text-emerald-600';
  if (pct >= 50) return 'text-amber-600';
  return 'text-rose-600';
}

function Ring({ pct }: { pct: number }) {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90">
      <circle cx="40" cy="40" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
      <circle
        cx="40" cy="40" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
        className={pct >= 80 ? 'stroke-emerald-500' : pct >= 50 ? 'stroke-amber-500' : 'stroke-rose-500'}
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
      />
      <text x="40" y="40" transform="rotate(90 40 40)" textAnchor="middle" dominantBaseline="central"
        className="fill-foreground font-bold text-[18px]">{Math.round(pct)}%</text>
    </svg>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-64 shrink-0 truncate text-sm text-foreground/70" title={label}>{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-2.5 rounded-full ${tone(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`w-12 text-right text-sm font-semibold tabular-nums ${textTone(pct)}`}>{pct}%</span>
    </div>
  );
}

export default function CoverageDashboardPage() {
  useEffect(() => { document.title = 'Test Coverage — Aqua Rudra'; }, []);
  const data = report as { generatedAt: string; frameworks: Framework[] };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 max-w-4xl py-10">
        <h1 className="text-3xl font-bold">Test Coverage</h1>
        <p className="text-sm text-foreground/50 mt-1">
          Generated {new Date(data.generatedAt).toLocaleString('en-IN')} · re-run via{' '}
          <code className="text-foreground/70">node scripts/collect-coverage.mjs</code>
        </p>

        <div className="mt-8 space-y-10">
          {data.frameworks.map((fw) => (
            <section key={fw.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-6">
                <Ring pct={fw.totals.lines} />
                <div>
                  <h2 className="text-xl font-bold">{fw.name}</h2>
                  <div className="text-sm text-foreground/50">{fw.tool}</div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['statements', 'branches', 'functions', 'lines'] as const).map((k) => (
                      <div key={k}>
                        <div className={`text-lg font-bold ${textTone(fw.totals[k])}`}>{fw.totals[k]}%</div>
                        <div className="text-[11px] uppercase tracking-widest text-foreground/40">{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {fw.files.length > 0 && (
                <div className="mt-6 space-y-2.5">
                  <div className="text-xs uppercase tracking-widest text-foreground/40 mb-1">By module (lowest first)</div>
                  {fw.files.map((f) => <Bar key={f.name} label={f.name} pct={f.pct} />)}
                </div>
              )}
            </section>
          ))}
        </div>

        <p className="mt-8 text-xs text-foreground/40">
          Green ≥ 80% · Amber ≥ 50% · Red &lt; 50%. Security/business-critical modules
          (auth, schemas, water grading, ML runtime, records) are at or near 100%.
        </p>
      </div>
    </div>
  );
}
