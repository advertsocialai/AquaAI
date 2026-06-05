import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Loader2, ShieldCheck, FlaskConical, RotateCcw, ArrowRight, Microscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CaptureGuide } from '@/features/quick-tools/shared/CaptureGuide';
import { screenShrimp, type ScreenResult } from '@/services/scanApi';
import type { RiskLevel } from '@/features/quick-tools/types';

type Phase = 'idle' | 'capture' | 'analyzing' | 'retake' | 'result';

const RISK_STYLES: Record<RiskLevel, { dot: string; chip: string; ring: string }> = {
  green:        { dot: 'bg-emerald-500', chip: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/30', ring: 'ring-emerald-500/30' },
  amber:        { dot: 'bg-amber-500',   chip: 'bg-amber-500/12 text-amber-300 border-amber-500/30',     ring: 'ring-amber-500/30' },
  red:          { dot: 'bg-rose-500',    chip: 'bg-rose-500/12 text-rose-300 border-rose-500/30',        ring: 'ring-rose-500/30' },
  inconclusive: { dot: 'bg-slate-400',   chip: 'bg-slate-500/12 text-slate-300 border-slate-500/30',     ring: 'ring-slate-500/30' },
};

/**
 * Scan & Screen — home/dashboard section.
 * SCREENING for visible signs only: no disease names, no drug/dose advice,
 * management guidance + "confirm with a lab", disclaimer under every result.
 * Backend-ready (screenShrimp) with on-device fallback so it works today.
 */
export function ScanScreen({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<ScreenResult | null>(null);

  async function onCapture(dataUrl: string) {
    setPhase('analyzing');
    const r = await screenShrimp(dataUrl);
    if (!r.usable) { setPhase('retake'); return; }
    setResult(r);
    setPhase('result');
  }

  function reset() { setResult(null); setPhase('idle'); }

  const risk = result?.risk ?? 'inconclusive';
  const rs = RISK_STYLES[risk];
  // Server text when present; otherwise a translated summary/steps by risk for the on-device path.
  const summary = result?.summary || t(`scanScreen.summary.${risk}`);
  const steps = (result && result.nextSteps.length > 0)
    ? result.nextSteps
    : (t(`scanScreen.steps.${risk}`, { returnObjects: true }) as unknown as string[]);
  const stepList = Array.isArray(steps) ? steps : [];

  return (
    <section id="scan-screen" className={compact ? '' : 'py-16 md:py-20 border-t border-border'}>
      <div className={compact ? '' : 'container mx-auto px-6 lg:px-8 max-w-5xl'}>
        {!compact && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-sm text-teal-300 uppercase tracking-widest mb-3">
              <Microscope className="w-4 h-4" /> {t('scanScreen.eyebrow')}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">{t('scanScreen.title')}</h2>
            <p className="text-base md:text-lg text-foreground/65 max-w-2xl mx-auto mt-4 leading-relaxed">
              {t('scanScreen.subtitle')}
            </p>
          </div>
        )}

        <div className={`rounded-3xl border border-border bg-card overflow-hidden ${compact ? '' : 'shadow-sm'}`}>
          {/* IDLE */}
          {phase === 'idle' && (
            <div className="p-6 md:p-10 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/12 border border-teal-500/30 flex items-center justify-center">
                <Camera className="w-8 h-8 text-teal-300" />
              </div>
              {compact && <h3 className="text-xl font-bold">{t('scanScreen.title')}</h3>}
              <p className="text-foreground/70 max-w-md leading-relaxed">{t('scanScreen.idleHint')}</p>
              <button
                onClick={() => setPhase('capture')}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-coral hover:bg-coral-hover text-coral-foreground font-semibold transition"
              >
                <Camera className="w-5 h-5" /> {t('scanScreen.start')}
              </button>
              <p className="text-xs text-foreground/45 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> {t('scanScreen.screeningNote')}
              </p>
            </div>
          )}

          {/* CAPTURE */}
          {phase === 'capture' && (
            <div className="p-4 md:p-6">
              <CaptureGuide onCapture={onCapture} />
              <button onClick={reset} className="mt-3 text-sm text-foreground/55 hover:text-foreground transition">
                {t('scanScreen.cancel')}
              </button>
            </div>
          )}

          {/* ANALYZING */}
          {phase === 'analyzing' && (
            <div className="p-10 flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-teal-300" />
              <p className="text-foreground/70">{t('scanScreen.analyzing')}</p>
              <div className="flex items-center gap-2 text-xs text-foreground/45">
                <span className="text-emerald-300">✓ {t('scanScreen.stepCapture')}</span>
                <span>·</span>
                <span className="text-teal-300 animate-pulse">{t('scanScreen.stepAnalyze')}</span>
                <span>·</span>
                <span>{t('scanScreen.stepResult')}</span>
              </div>
            </div>
          )}

          {/* RETAKE */}
          {phase === 'retake' && (
            <div className="p-8 md:p-10 flex flex-col items-center text-center gap-4">
              <p className="text-foreground/75 max-w-md">{t('scanScreen.retake')}</p>
              <button
                onClick={() => setPhase('capture')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-semibold transition"
              >
                <RotateCcw className="w-4 h-4" /> {t('scanScreen.retakeBtn')}
              </button>
            </div>
          )}

          {/* RESULT */}
          {phase === 'result' && result && (
            <div className="p-6 md:p-8">
              <div className={`rounded-2xl border p-5 ring-1 ${rs.chip} ${rs.ring}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${rs.dot}`} />
                  <span className="font-semibold uppercase tracking-wide text-sm">{t(`scanScreen.risk.${risk}`)}</span>
                  <span className="ml-auto text-xs opacity-70">
                    {t('scanScreen.confidence', { pct: Math.round(result.confidence * 100) })}
                  </span>
                </div>
                <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{summary}</p>
              </div>

              {/* observed signs */}
              {result.signs.length > 0 && (
                <div className="mt-5">
                  <div className="text-xs uppercase tracking-widest text-foreground/50 mb-2">{t('scanScreen.observedSigns')}</div>
                  <div className="flex flex-wrap gap-2">
                    {result.signs.map((s) => (
                      <span key={s} className="px-3 py-1.5 rounded-lg bg-muted text-foreground/80 text-sm border border-border">
                        {t(`scanScreen.signs.${s}`, { defaultValue: s })}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* management next steps (no drugs/doses) */}
              {stepList.length > 0 && (
                <div className="mt-5">
                  <div className="text-xs uppercase tracking-widest text-foreground/50 mb-2">{t('scanScreen.nextSteps')}</div>
                  <ul className="space-y-2">
                    {stepList.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed">
                        <span className="text-teal-300 mt-0.5">•</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(risk === 'amber' || risk === 'red') && (
                <Link
                  to="/expert"
                  className="mt-5 flex items-center justify-center gap-2 w-full rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3.5 transition"
                >
                  <FlaskConical className="w-5 h-5" /> {t('scanScreen.toLab')}
                </Link>
              )}

              <div className="mt-5 flex items-center gap-3">
                <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-foreground/85 text-sm font-medium transition">
                  <RotateCcw className="w-4 h-4" /> {t('scanScreen.scanAgain')}
                </button>
                <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-teal-300 hover:text-teal-200 transition">
                  {t('scanScreen.moreTools')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="mt-5 text-xs text-foreground/45 leading-relaxed border-t border-border pt-4">
                {t('scanScreen.disclaimer')}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ScanScreen;
