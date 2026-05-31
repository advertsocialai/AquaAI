import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:8000/api/v1';

interface DiseaseResult {
  ehp_healthy_prob: number;
  ehp_suspected_prob: number;
  ehp_positive_prob: number;
  spore_detected: boolean;
  spore_count: number;
  wssv_positive: boolean;
  ahpnd_prob: number;
  is_hard_fail: boolean;
  hard_fail_disease: string | null;
  risk_level: string;
  risk_action: string;
  fused_risk_score: number;
  model_used: string;
}

interface QualityResult {
  visual_health_score: number;
  disease_score: number;
  size_uniformity_score: number;
  stage_score: number;
  activity_score: number;
  composite_score: number;
  grade: string;
  detected_pl_stage: string;
  stocking_recommendation: string;
}

interface ScanResponse {
  image_url: string;
  disease?: DiseaseResult;
  quality?: QualityResult;
}

const RISK_THEME: Record<string, { bg: string; border: string; text: string; label: string }> = {
  red:       { bg: 'bg-red-500/10',     border: 'border-red-500/40',     text: 'text-red-400',     label: 'HIGH RISK' },
  yellow:    { bg: 'bg-amber-500/10',   border: 'border-amber-500/40',   text: 'text-amber-400',   label: 'CAUTION' },
  green:     { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400', label: 'SAFE' },
  grey:      { bg: 'bg-slate-500/10',   border: 'border-slate-500/40',   text: 'text-slate-300',   label: 'INCONCLUSIVE' },
  hard_fail: { bg: 'bg-red-600/15',     border: 'border-red-600/50',     text: 'text-red-500',     label: 'REJECT' },
};

const GRADE_COLOR: Record<string, string> = {
  PREMIUM: '#34d399', GOOD: '#38bdf8', CONDITIONAL: '#fbbf24',
  CAUTION: '#fb923c', REJECT: '#f87171',
};

/**
 * Interactive disease + quality diagnosis demo.
 * Upload or capture an HP smear image — the backend runs the full AI pipeline
 * and this renders a realistic clinical-style result: traffic-light risk,
 * an animated composite-quality gauge, and the 5-parameter score breakdown.
 */
export function DiagnosisDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState('');

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startCamera = async () => {
    setError(null);
    setResult(null);
    setPreview(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch {
      setError('Camera unavailable — use "Upload Image" instead.');
    }
  };

  const analyze = async (blob: Blob, previewUrl: string) => {
    setPreview(previewUrl);
    setResult(null);
    setError(null);
    setLoading(true);

    // Staged progress messaging — mirrors the real pipeline
    const steps = [
      'Pre-processing image (CLAHE + Y-channel)…',
      'Running EHP classifier…',
      'Screening for WSSV / AHPND…',
      'Computing composite quality score…',
    ];
    let si = 0;
    setStage(steps[0]);
    const stepTimer = setInterval(() => {
      si = Math.min(si + 1, steps.length - 1);
      setStage(steps[si]);
    }, 700);

    try {
      const form = new FormData();
      form.append('file', blob, 'smear.jpg');
      const res = await fetch(`${API_BASE}/disease/scan`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(String(res.status));
      const data: ScanResponse = await res.json();
      setResult(data);
    } catch {
      setError('Could not reach the diagnosis service. Ensure the backend is running on localhost:8000.');
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
      setStage('');
    }
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob((b) => b && analyze(b, canvas.toDataURL('image/jpeg')), 'image/jpeg', 0.92);
    stopCamera();
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) analyze(f, URL.createObjectURL(f));
  };

  const reset = () => {
    setResult(null);
    setPreview(null);
    setError(null);
  };

  const disease = result?.disease;
  const quality = result?.quality;
  const riskKey = disease?.is_hard_fail ? 'hard_fail' : disease?.risk_level || 'grey';
  const theme = RISK_THEME[riskKey] || RISK_THEME.grey;

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">AI Diagnosis</h3>
          <p className="text-xs text-foreground/50">
            Upload an HP smear image — full disease + quality analysis
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-violet-500/20 text-violet-300">
          M2 + M3
        </span>
      </div>

      {/* Capture viewport */}
      <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
        {cameraOn && (
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
        )}
        {!cameraOn && preview && (
          <img src={preview} alt="sample" className="w-full h-full object-contain" />
        )}
        {!cameraOn && !preview && (
          <div className="text-center text-foreground/40 px-6">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
            <p className="text-sm">Provide a hepatopancreas smear image</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center px-6">
            <div className="w-9 h-9 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-foreground/80 text-sm mt-4 text-center">{stage}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mt-4">
        {!cameraOn && !preview && (
          <>
            <button onClick={startCamera}
              className="flex-1 min-w-[140px] px-4 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition">
              Start Camera
            </button>
            <label className="flex-1 min-w-[140px] px-4 py-2.5 rounded-lg border border-border hover:bg-muted text-foreground text-sm font-semibold text-center cursor-pointer transition">
              Upload Image
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
          </>
        )}
        {cameraOn && (
          <>
            <button onClick={capture}
              className="flex-1 px-4 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition">
              Capture &amp; Diagnose
            </button>
            <button onClick={stopCamera}
              className="px-4 py-2.5 rounded-lg border border-border hover:bg-muted text-foreground text-sm transition">
              Cancel
            </button>
          </>
        )}
        {preview && !loading && (
          <button onClick={reset}
            className="flex-1 px-4 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition">
            New Diagnosis
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && disease && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 space-y-4"
          >
            {/* Traffic-light risk card */}
            <div className={`rounded-xl border ${theme.border} ${theme.bg} p-5`}>
              <div className="flex items-center gap-3">
                <TrafficLight active={riskKey} />
                <div>
                  <div className={`text-xl font-bold ${theme.text}`}>{theme.label}</div>
                  <div className="text-xs text-foreground/40">
                    {disease.is_hard_fail
                      ? `Hard-fail — ${disease.hard_fail_disease} detected`
                      : `Risk level: ${disease.risk_level}`}
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{disease.risk_action}</p>
            </div>

            {/* EHP probabilities */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-xs text-foreground/40 uppercase tracking-wider mb-3">
                EHP Classification
              </div>
              <ProbBar label="Healthy"      value={disease.ehp_healthy_prob}   color="#34d399" />
              <ProbBar label="Suspected"    value={disease.ehp_suspected_prob} color="#fbbf24" />
              <ProbBar label="EHP Positive" value={disease.ehp_positive_prob}  color="#f87171" />
              <div className="flex flex-wrap gap-2 mt-3">
                <DiseaseChip label="WSSV" positive={disease.wssv_positive} />
                <DiseaseChip label="AHPND" positive={disease.ahpnd_prob > 0.5} prob={disease.ahpnd_prob} />
                <DiseaseChip label="Spores" positive={disease.spore_detected} count={disease.spore_count} />
              </div>
            </div>

            {/* Composite quality gauge + breakdown */}
            {quality && (
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-5">
                  <QSGauge score={quality.composite_score} grade={quality.grade} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-foreground/40 uppercase tracking-wider mb-2">
                      Quality Breakdown
                    </div>
                    <ScoreBar label="Visual Health"   value={quality.visual_health_score}   max={30} />
                    <ScoreBar label="Disease"         value={quality.disease_score}         max={25} />
                    <ScoreBar label="Size Uniformity" value={quality.size_uniformity_score} max={20} />
                    <ScoreBar label="Stage"           value={quality.stage_score}           max={15} />
                    <ScoreBar label="Activity"        value={quality.activity_score}        max={10} />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-start gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-foreground/30 mt-0.5">
                    Stage {quality.detected_pl_stage}
                  </span>
                  <p className="text-xs text-foreground/60 flex-1">{quality.stocking_recommendation}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-foreground/30">
              <span>Engine: {disease.model_used}</span>
              <span>Fused risk score: {(disease.fused_risk_score * 100).toFixed(0)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function TrafficLight({ active }: { active: string }) {
  const lit = {
    red: active === 'red' || active === 'hard_fail',
    yellow: active === 'yellow',
    green: active === 'green',
  };
  return (
    <div className="flex flex-col gap-1 p-1.5 rounded-md bg-black/40">
      <Dot on={lit.red} color="#f87171" />
      <Dot on={lit.yellow} color="#fbbf24" />
      <Dot on={lit.green} color="#34d399" />
    </div>
  );
}

function Dot({ on, color }: { on: boolean; color: string }) {
  return (
    <span
      className="w-3 h-3 rounded-full transition-all"
      style={{
        background: on ? color : '#ffffff10',
        boxShadow: on ? `0 0 8px ${color}` : 'none',
      }}
    />
  );
}

function ProbBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.round((value || 0) * 100);
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-foreground/60">{label}</span>
        <span className="text-foreground/80 tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-card overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, Math.round(((value || 0) / max) * 100));
  return (
    <div className="mb-1.5 last:mb-0">
      <div className="flex justify-between text-[10px] mb-0.5">
        <span className="text-foreground/50">{label}</span>
        <span className="text-foreground/70 tabular-nums">{(value ?? 0).toFixed(1)}/{max}</span>
      </div>
      <div className="h-1 rounded-full bg-card overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-sky-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function DiseaseChip({ label, positive, prob, count }: {
  label: string; positive: boolean; prob?: number; count?: number;
}) {
  return (
    <span
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] border ${
        positive
          ? 'border-red-500/40 bg-red-500/10 text-red-400'
          : 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400/80'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
      {label}
      {count != null && positive ? ` ·${count}` : ''}
      {prob != null ? ` ${Math.round(prob * 100)}%` : ''}
    </span>
  );
}

function QSGauge({ score, grade }: { score: number; grade: string }) {
  const [shown, setShown] = useState(0);
  const color = GRADE_COLOR[grade] || '#38bdf8';
  const R = 34;
  const C = 2 * Math.PI * R;

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setShown(Math.round(score * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="relative w-[88px] h-[88px] shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={R} fill="none" stroke="#ffffff14" strokeWidth="7" />
        <circle
          cx="40" cy="40" r={R} fill="none" stroke={color} strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - (C * shown) / 100}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-foreground tabular-nums">{shown}</span>
        <span className="text-[8px] uppercase tracking-wider" style={{ color }}>
          {grade}
        </span>
      </div>
    </div>
  );
}
