import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:8000/api/v1';

interface Box {
  cx: number;
  cy: number;
  w: number;
  h: number;
  class_name: string;
  confidence: number;
  length_mm: number | null;
}

interface ScanResult {
  live_count: number;
  dead_count: number;
  debris_count: number;
  total_count: number;
  survival_rate_pct: number;
  mean_length_mm: number | null;
  cv_pct: number | null;
  model_used: string;
  boxes: Box[];
}

const CLASS_COLORS: Record<string, string> = {
  'pl-alive': '#22c55e',
  'pl-dead': '#ef4444',
  'debris': '#f59e0b',
};

/**
 * Camera scanner for shrimp seed counting.
 * Captures a webcam frame (or uploaded file), sends it to the backend
 * /seed-counter/scan endpoint, and overlays numbered bounding boxes
 * over each detected seed with a live count.
 */
export function SeedScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startCamera = async () => {
    setError(null);
    setResult(null);
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch {
      setError('Camera access denied or unavailable. Use "Upload Image" instead.');
    }
  };

  const analyzeBlob = async (blob: Blob, previewUrl: string) => {
    setCapturedImage(previewUrl);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append('file', blob, 'scan.jpg');
      const res = await fetch(`${API_BASE}/seed-counter/scan`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error(`Scan failed (${res.status})`);
      const data: ScanResult = await res.json();
      setResult(data);
    } catch (e) {
      setError(
        'Could not reach the backend scanner. Ensure the API is running on localhost:8000.'
      );
    } finally {
      setLoading(false);
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 240);
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) analyzeBlob(blob, canvas.toDataURL('image/jpeg'));
      },
      'image/jpeg',
      0.92
    );
    stopCamera();
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyzeBlob(file, URL.createObjectURL(file));
  };

  // Draw the captured image + bounding boxes on the result canvas
  useEffect(() => {
    if (!capturedImage || !result || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      result.boxes.forEach((b, i) => {
        const x = (b.cx - b.w / 2) * canvas.width;
        const y = (b.cy - b.h / 2) * canvas.height;
        const w = b.w * canvas.width;
        const h = b.h * canvas.height;
        const color = CLASS_COLORS[b.class_name] || '#0ea5e9';

        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(2, canvas.width / 400);
        ctx.strokeRect(x, y, w, h);

        // Number label
        const label = String(i + 1);
        ctx.font = `bold ${Math.max(11, canvas.width / 60)}px sans-serif`;
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = color;
        ctx.fillRect(x, y - 16, tw + 8, 16);
        ctx.fillStyle = '#fff';
        ctx.fillText(label, x + 4, y - 4);
      });
    };
    img.src = capturedImage;
  }, [capturedImage, result]);

  const reset = () => {
    setResult(null);
    setCapturedImage(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Seed Counter Scanner</h3>
            <p className="text-xs text-foreground/50">
              Point your camera at a counting tray — AI counts every PL
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-sky-500/20 text-sky-300">
            M1 · F01
          </span>
        </div>

        {/* Viewport */}
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
          {cameraOn && (
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          )}

          {/* Framing guide overlay */}
          {cameraOn && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-[12%] border border-dashed border-border rounded-lg">
                {/* corner brackets */}
                {[
                  'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
                  'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
                  'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
                  'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
                ].map((c) => (
                  <span key={c} className={`absolute w-6 h-6 border-sky-400 ${c}`} />
                ))}
              </div>
              <div className="absolute top-3 left-0 right-0 text-center">
                <span className="text-[11px] text-foreground/70 bg-black/50 px-2 py-1 rounded">
                  Align the counting tray within the frame
                </span>
              </div>
            </div>
          )}

          {/* Shutter flash */}
          <AnimatePresence>
            {flash && (
              <motion.div
                className="absolute inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24 }}
              />
            )}
          </AnimatePresence>

          {!cameraOn && capturedImage && (
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          )}

          {!cameraOn && !capturedImage && (
            <div className="text-center text-foreground/40 px-6">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm">Start the camera or upload a tray image</p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-foreground/70 text-sm mt-3">Counting seeds…</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mt-4">
          {!cameraOn && !capturedImage && (
            <>
              <button
                onClick={startCamera}
                className="flex-1 min-w-[140px] px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition"
              >
                Start Camera
              </button>
              <label className="flex-1 min-w-[140px] px-4 py-2.5 rounded-lg border border-border hover:bg-muted text-foreground text-sm font-semibold text-center cursor-pointer transition">
                Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={onFileSelected} />
              </label>
            </>
          )}

          {cameraOn && (
            <>
              <button
                onClick={captureFrame}
                className="flex-1 px-4 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-white text-sm font-semibold transition"
              >
                Capture &amp; Count
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2.5 rounded-lg border border-border hover:bg-muted text-foreground text-sm transition"
              >
                Cancel
              </button>
            </>
          )}

          {capturedImage && !loading && (
            <button
              onClick={reset}
              className="flex-1 px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition"
            >
              Scan Again
            </button>
          )}
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Stat label="Live PL" value={result.live_count} color="text-green-400" />
                <Stat label="Dead PL" value={result.dead_count} color="text-red-400" />
                <Stat label="Debris" value={result.debris_count} color="text-amber-400" />
                <Stat label="Survival" value={`${result.survival_rate_pct}%`} color="text-sky-400" />
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-foreground/50">
                <span>
                  Total counted: <strong className="text-foreground">{result.total_count}</strong>
                  {result.mean_length_mm != null && ` · avg ${result.mean_length_mm}mm`}
                  {result.cv_pct != null && ` · CV ${result.cv_pct}%`}
                </span>
                <span className="px-2 py-0.5 rounded bg-card">{result.model_used}</span>
              </div>
              <div className="flex gap-3 mt-2 text-[10px] text-foreground/40">
                <Legend color="#22c55e" label="Live" />
                <Legend color="#ef4444" label="Dead" />
                <Legend color="#f59e0b" label="Debris" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="rounded-lg bg-card px-3 py-2.5 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-foreground/40">{label}</div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
