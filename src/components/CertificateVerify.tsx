import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, QrCode, Search, BadgeCheck, XCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api/v1';

/**
 * F23/F26 — QC Certificate showcase + public verification portal.
 * Left: a styled representation of an HMAC-signed QC certificate.
 * Right: enter a certificate ID to verify it against the public /verify endpoint.
 */
export function CertificateVerify() {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState<{
    ok: boolean;
    code?: number;
    notFound?: boolean;
    data?: Record<string, string | number | null | undefined>;
  } | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const verify = async () => {
    if (!certId.trim()) return;
    setStatus('loading');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/verify/${encodeURIComponent(certId.trim())}`);
      if (!res.ok) {
        setResult({ ok: false, code: res.status });
      } else {
        const data = await res.json();
        // The endpoint returns 200 with a status field — interpret it.
        const certStatus = String(data.status || '').toLowerCase();
        const valid = certStatus === 'valid' || certStatus === 'active';
        setResult({ ok: valid, notFound: certStatus === 'notfound', data });
      }
    } catch {
      setResult({ ok: false, code: 0 });
    } finally {
      setStatus('done');
    }
  };

  return (
    <div className="w-full grid lg:grid-cols-2 gap-6">
      {/* Sample certificate */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-white/8 to-white/3 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] uppercase tracking-widest text-foreground/40">
            Aqua Rudra · QC Certificate
          </span>
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2.5">
            <CertRow label="Certificate ID" value="AQ-QC-2026-04821" mono />
            <CertRow label="Batch" value="BTH-T1 · PL10" />
            <CertRow label="Hatchery" value="Coastal Aqua Hatchery" />
            <CertRow label="Composite Score" value="86 / 100 · PREMIUM" />
            <CertRow label="Disease Screen" value="EHP negative · WSSV clear" />
            <CertRow label="Issued" value="2026-05-20 · valid 90 days" />
          </div>
          <div className="shrink-0 text-center">
            <div className="w-24 h-24 rounded-lg bg-white p-2 grid grid-cols-7 gap-px">
              {Array.from({ length: 49 }).map((_, i) => (
                <span
                  key={i}
                  className="rounded-[1px]"
                  style={{
                    background:
                      // deterministic pseudo-QR pattern
                      (i * 7 + ((i * i) % 5)) % 3 === 0 ? '#0a0a0a' : 'transparent',
                  }}
                />
              ))}
            </div>
            <div className="text-[9px] text-foreground/40 mt-1 flex items-center justify-center gap-1">
              <QrCode className="w-3 h-3" /> Scan to verify
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] text-foreground/40">
            HMAC-SHA256 signed · tamper-evident · third-party verifiable
          </span>
        </div>
      </div>

      {/* Verification portal */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Verify a Certificate</h3>
            <p className="text-xs text-foreground/50">Public verification — no login needed</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">
            F26
          </span>
        </div>

        <div className="flex gap-2">
          <input
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && verify()}
            placeholder="Enter certificate ID…"
            className="flex-1 rounded-lg bg-card border border-border px-3 py-2 text-sm text-foreground
                       placeholder:text-foreground/30 focus:outline-none focus:border-emerald-400/50 transition"
          />
          <button
            onClick={verify}
            disabled={status === 'loading'}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50
                       text-foreground text-sm font-semibold transition flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            Verify
          </button>
        </div>

        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.p
              key="l"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm text-foreground/40"
            >
              Checking signature…
            </motion.p>
          )}

          {status === 'done' && result && (
            <motion.div
              key="r"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              {result.ok ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BadgeCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-400">
                      Certificate verified — {result.data.status}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <CertRow label="Certificate ID" value={result.data.certificate_id} mono />
                    <CertRow label="Type" value={result.data.session_type ?? '—'} />
                    <CertRow label="Farm" value={result.data.farm_name ?? '—'} />
                    <CertRow label="Hatchery" value={result.data.hatchery_name ?? '—'} />
                    <CertRow
                      label="Grade / Score"
                      value={
                        result.data.grade
                          ? `${result.data.grade} · ${result.data.composite_score ?? '—'}/100`
                          : '—'
                      }
                    />
                    <CertRow
                      label="Hard fail"
                      value={result.data.is_hard_fail ? 'YES' : 'No'}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-red-400">
                      {result.notFound
                        ? 'Certificate not found'
                        : result.code === 0
                        ? 'Backend unreachable'
                        : result.data?.status
                        ? `Certificate ${result.data.status}`
                        : 'Verification failed'}
                    </div>
                    <div className="text-xs text-foreground/40">
                      {result.code === 0
                        ? 'Start the backend on localhost:8000 and try again.'
                        : result.notFound
                        ? 'No certificate matches that ID — check the code and retry.'
                        : 'This certificate is no longer valid (expired or revoked).'}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-4 text-[10px] text-foreground/30">
          Every QC certificate carries an HMAC-SHA256 signature. Insurers, buyers and
          auditors can confirm authenticity instantly by ID or QR scan — no account required.
        </p>
      </div>
    </div>
  );
}

function CertRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-foreground/35">{label}</span>
      <span className={`text-foreground/85 text-right ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  );
}
