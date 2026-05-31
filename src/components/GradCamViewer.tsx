import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Eye } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api/v1';

interface GradCamResult {
  ehp_positive_prob: number;
  ehp_healthy_prob: number;
  risk_level: string;
  original_url: string | null;
  gradcam_url: string | null;
  model_used: string;
}

/**
 * F14 — Grad-CAM explainability viewer.
 * Uploads an HP smear and shows the AI attention heatmap: which tissue regions
 * drove the EHP prediction. A slider wipes between the original and the heatmap.
 */
export function GradCamViewer() {
  const [result, setResult] = useState<GradCamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wipe, setWipe] = useState(60); // 0 = original, 100 = full heatmap

  const analyze = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append('file', file, file.name);
      const res = await fetch(`${API_BASE}/disease/gradcam`, { method: 'POST', body: form });
      if (!res.ok) throw new Error();
      setResult(await res.json());
      setWipe(60);
    } catch {
      setError('Could not generate the heatmap. Ensure the backend is running on localhost:8000.');
    } finally {
      setLoading(false);
    }
  };

  const riskColor =
    result?.risk_level === 'red'
      ? '#f87171'
      : result?.risk_level === 'yellow'
      ? '#fbbf24'
      : result?.risk_level === 'green'
      ? '#34d399'
      : '#94a3b8';

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Grad-CAM Explainability</h3>
          <p className="text-xs text-foreground/50">See where the AI is looking</p>
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-orange-500/20 text-orange-300">
          F14
        </span>
      </div>

      {/* Viewport */}
      <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
        {!result && !loading && (
          <div className="text-center text-foreground/40 px-6">
            <Flame className="w-12 h-12 mx-auto mb-2 text-orange-400/40" />
            <p className="text-sm">Upload an HP smear to generate an attention heatmap</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="w-9 h-9 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-foreground/70 text-sm mt-3">Computing attention map…</p>
          </div>
        )}

        {result && (
          <div className="relative w-full h-full">
            {result.original_url && (
              <img
                src={result.original_url}
                alt="original"
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
            {result.gradcam_url && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - wipe}% 0 0)` }}
              >
                <img
                  src={result.gradcam_url}
                  alt="heatmap"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            {/* wipe handle line */}
            {result.gradcam_url && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-orange-400 pointer-events-none"
                style={{ left: `${wipe}%` }}
              />
            )}
            <div className="absolute top-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-foreground/70">
              <Eye className="w-3 h-3 inline mr-1" />
              Original
            </div>
            <div className="absolute top-2 right-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-orange-300">
              <Flame className="w-3 h-3 inline mr-1" />
              Heatmap
            </div>
          </div>
        )}
      </div>

      {/* Wipe slider */}
      {result?.gradcam_url && (
        <input
          type="range"
          min={0}
          max={100}
          value={wipe}
          onChange={(e) => setWipe(Number(e.target.value))}
          className="w-full mt-3 accent-orange-400"
        />
      )}

      {/* Controls */}
      <div className="flex gap-2 mt-4">
        <label className="flex-1 px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold text-center cursor-pointer transition">
          {result ? 'Try Another Image' : 'Upload HP Smear'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && analyze(e.target.files[0])}
          />
        </label>
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Result readout */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 grid grid-cols-3 gap-3"
          >
            <div className="rounded-lg bg-card px-3 py-2.5 text-center">
              <div className="text-xl font-bold text-red-400 tabular-nums">
                {Math.round(result.ehp_positive_prob * 100)}%
              </div>
              <div className="text-[10px] text-foreground/40">EHP probability</div>
            </div>
            <div className="rounded-lg bg-card px-3 py-2.5 text-center">
              <div className="text-xl font-bold uppercase" style={{ color: riskColor }}>
                {result.risk_level}
              </div>
              <div className="text-[10px] text-foreground/40">Risk level</div>
            </div>
            <div className="rounded-lg bg-card px-3 py-2.5 text-center">
              <div className="text-sm font-bold text-foreground/80 mt-1.5 truncate">
                {result.model_used}
              </div>
              <div className="text-[10px] text-foreground/40">Engine</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-3 text-[10px] text-foreground/30">
        Warm regions (red/yellow) show the tissue areas that most influenced the
        AI's EHP decision — drag the slider to compare against the original.
      </p>
    </div>
  );
}
