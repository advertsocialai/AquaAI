import { useEffect, useRef, useState } from 'react';
import { Camera, ImageUp } from 'lucide-react';
import type { CaptureQuality } from '@/features/quick-tools/types';

/**
 * Live camera framing with a per-frame quality gate. Computes focus (sharpness),
 * brightness and (for seed) density on a downscaled grayscale frame, shows a
 * guidance chip, and only enables capture once quality passes. Falls back to a
 * file picker when the camera isn't available.
 */
export function CaptureGuide({
  checkDensity = false, onCapture,
}: { checkDensity?: boolean; onCapture: (dataUrl: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const probeRef = useRef<HTMLCanvasElement>(null);
  const [quality, setQuality] = useState<CaptureQuality>({ focus: 0, brightness: 0, density: 'ok', passes: false });
  const [camError, setCamError] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let raf = 0;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const loop = () => { setQuality(measure(videoRef.current, probeRef.current, checkDensity)); raf = requestAnimationFrame(loop); };
        raf = requestAnimationFrame(loop);
      } catch {
        setCamError(true);
      }
    })();
    return () => {
      cancelAnimationFrame(raf);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [checkDensity]);

  function capture() {
    const v = videoRef.current;
    if (!v) return;
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d')?.drawImage(v, 0, 0);
    onCapture(c.toDataURL('image/jpeg', 0.85));
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => onCapture(reader.result as string);
    reader.readAsDataURL(f);
  }

  if (camError) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center">
        <p className="text-neutral-600">Camera unavailable. Upload a photo instead.</p>
        <label className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-rose-600 text-white font-semibold px-6 py-3 cursor-pointer">
          <ImageUp className="w-5 h-5" /> Choose photo
          <input type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />
        </label>
      </div>
    );
  }

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4]">
        <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
        <div className={`pointer-events-none absolute inset-3 rounded-xl border-2 ${quality.passes ? 'border-emerald-400' : 'border-white/70'}`} />
        {quality.hint && (
          <div className="absolute bottom-3 inset-x-3 text-center">
            <span className="inline-block rounded-full bg-black/70 text-white text-sm px-4 py-1.5">{quality.hint}</span>
          </div>
        )}
      </div>
      <canvas ref={probeRef} width={64} height={64} className="hidden" />

      <button
        onClick={capture}
        disabled={!quality.passes}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:bg-neutral-300 text-white font-semibold py-4 text-lg active:scale-[0.99] transition"
      >
        <Camera className="w-5 h-5" /> {quality.passes ? 'Capture' : 'Line up the shot…'}
      </button>
    </div>
  );
}

/* Downscale to 64×64 grayscale, then estimate brightness, sharpness, density. */
function measure(v: HTMLVideoElement | null, c: HTMLCanvasElement | null, checkDensity: boolean): CaptureQuality {
  if (!v || !c || !v.videoWidth) return { focus: 0, brightness: 0, density: 'ok', passes: false, hint: 'Starting camera…' };
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { focus: 0, brightness: 0, density: 'ok', passes: false };
  ctx.drawImage(v, 0, 0, 64, 64);
  const { data } = ctx.getImageData(0, 0, 64, 64);
  const g = new Float64Array(64 * 64);
  let sum = 0;
  for (let i = 0; i < 64 * 64; i++) {
    const lum = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    g[i] = lum; sum += lum;
  }
  const brightness = sum / (64 * 64) / 255;

  // Sharpness ≈ variance of a 4-neighbour Laplacian.
  let lapSum = 0, lapSq = 0, n = 0, edges = 0;
  for (let y = 1; y < 63; y++) {
    for (let x = 1; x < 63; x++) {
      const idx = y * 64 + x;
      const lap = 4 * g[idx] - g[idx - 1] - g[idx + 1] - g[idx - 64] - g[idx + 64];
      lapSum += lap; lapSq += lap * lap; n++;
      if (Math.abs(lap) > 24) edges++;
    }
  }
  const variance = lapSq / n - (lapSum / n) ** 2;
  const focus = Math.min(1, variance / 600);
  const edgeRatio = edges / n;
  const density: CaptureQuality['density'] = !checkDensity ? 'ok' : edgeRatio > 0.28 ? 'too_dense' : edgeRatio < 0.02 ? 'too_sparse' : 'ok';

  let hint: string | undefined;
  if (brightness < 0.22) hint = 'Too dark — raise the light';
  else if (brightness > 0.92) hint = 'Too bright — reduce glare';
  else if (focus < 0.45) hint = 'Out of focus — hold steady';
  else if (density === 'too_dense') hint = 'Too dense — dilute the sample';
  else if (density === 'too_sparse') hint = 'Too sparse — add more sample';

  const passes = !hint;
  return { focus, brightness, density, passes, hint: hint ?? 'Looks good — capture now' };
}
