import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, QrCode, ShieldCheck, BadgeCheck, MapPin,
} from 'lucide-react';
import { generateCertificatePdf, SAMPLE_CERT, type Cert, type Grade } from '@/lib/qcCertificate';

const GRADE_COLOR: Record<Grade, string> = {
  Premium:     '#22c55e',
  Good:        '#38bdf8',
  Conditional: '#facc15',
  Caution:     '#fb923c',
  Reject:      '#f87171',
};

export function QcCertificatePreview({ cert = SAMPLE_CERT }: { cert?: Cert }) {
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    try {
      const doc = await generateCertificatePdf(cert);
      doc.save(`${cert.id}.pdf`);
    } finally {
      setBusy(false);
    }
  }

  async function openPreview() {
    setBusy(true);
    try {
      const doc = await generateCertificatePdf(cert);
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } finally {
      setBusy(false);
    }
  }

  const color = GRADE_COLOR[cert.grade];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-border bg-card space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-card">
          <FileText className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-foreground/30">QC Certificate</div>
          <div className="text-sm font-semibold text-foreground">{cert.id}</div>
        </div>
        <div
          className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border"
          style={{ background: `${color}22`, color, borderColor: `${color}55` }}
        >
          {cert.grade}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-xs">
        <Row k="Hatchery" v={cert.hatcheryName} />
        <Row k="License" v={cert.hatcheryLicense} />
        <Row k="Batch" v={`${cert.batchId} · ${cert.species} ${cert.size}`} />
        <Row k="Count" v={cert.count} />
        <Row k="Composite QS" v={`${cert.qsScore} / 100`} />
        <Row k="Disease" v={cert.diseaseStatus + (cert.diseaseName ? ` · ${cert.diseaseName}` : '')} />
        <Row k="Captured at" v={cert.capturedAt} />
        <Row k="GPS" v={`${cert.gps.lat.toFixed(4)}, ${cert.gps.lng.toFixed(4)}`} />
      </div>

      <div className="flex items-center gap-2 text-[11px] text-foreground/40 pt-3 border-t border-border">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        HMAC-SHA256 signed · tamper-evident
        <span className="text-foreground/20">·</span>
        <QrCode className="w-3.5 h-3.5 text-violet-400" />
        QR verifies at <span className="font-mono text-foreground/60">aquai.in/verify/{cert.id}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={download}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold text-xs"
        >
          <Download className="w-3.5 h-3.5" /> Download PDF
        </button>
        <button
          onClick={openPreview}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground/70 text-xs"
        >
          <FileText className="w-3.5 h-3.5" /> Open in new tab
        </button>
        <div className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-foreground/30">
          <BadgeCheck className="w-3 h-3 text-emerald-400" />
          MPEDA-aligned format
        </div>
      </div>
    </motion.div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5 px-2 rounded-md bg-card">
      <span className="text-foreground/40">{k}</span>
      <span className="text-foreground/90 truncate">{v}</span>
    </div>
  );
}
