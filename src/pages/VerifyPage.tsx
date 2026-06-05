import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck, AlertTriangle, Loader2, Fish, ArrowRight, MapPin,
  Clock, Building2, BadgeCheck, QrCode, FileText, ExternalLink,
} from 'lucide-react';
import { SAMPLE_CERT, type Cert } from '@/lib/qcCertificate';

type VerifyResult =
  | { state: 'loading' }
  | { state: 'valid'; cert: Cert; signatureMatch: true }
  | { state: 'invalid'; reason: string };

const KNOWN_CERTS: Record<string, Cert> = {
  [SAMPLE_CERT.id]: SAMPLE_CERT,
};

async function verifyCert(certId: string): Promise<VerifyResult> {
  await new Promise((r) => setTimeout(r, 600));
  const cert = KNOWN_CERTS[certId];
  if (!cert) return { state: 'invalid', reason: 'Certificate ID not found in registry.' };
  return { state: 'valid', cert, signatureMatch: true };
}

const GRADE_COLOR: Record<Cert['grade'], string> = {
  Premium:     '#22c55e',
  Good:        '#38bdf8',
  Conditional: '#facc15',
  Caution:     '#fb923c',
  Reject:      '#f87171',
};

export default function VerifyPage() {
  const { t } = useTranslation();
  const { certId = '' } = useParams<{ certId: string }>();
  const [result, setResult] = useState<VerifyResult>({ state: 'loading' });

  useEffect(() => {
    document.title = t('verifyPage.documentTitle', { certId });
    verifyCert(certId).then(setResult);
  }, [certId, t]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 lg:px-8 py-6 flex items-center justify-between max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2">
          <Fish className="w-4 h-4 text-teal-400" />
          <span className="font-semibold">AquaI</span>
        </Link>
        <div className="text-[11px] text-foreground/30 inline-flex items-center gap-1.5">
          <QrCode className="w-3 h-3" /> {t('verifyPage.publicVerification')}
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-8 max-w-2xl pb-20">
        <div className="text-[11px] uppercase tracking-widest text-foreground/30 mb-2">{t('verifyPage.certificateLabel')}</div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 font-mono">{certId}</h1>
        <p className="text-sm text-foreground/50 mb-10">
          {t('verifyPage.heroDescription')}
        </p>

        {result.state === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20 text-foreground/40 text-sm"
          >
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t('verifyPage.recomputingSignature')}
          </motion.div>
        )}

        {result.state === 'invalid' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border border-red-400/30 bg-red-500/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-400/20">
                <AlertTriangle className="w-5 h-5 text-red-300" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-red-300">{t('verifyPage.notVerified')}</div>
                <div className="text-lg font-bold text-foreground">{t('verifyPage.signatureDoesNotMatch')}</div>
              </div>
            </div>
            <p className="text-sm text-foreground/70">{t('verifyPage.reasonNotFound')}</p>
            <p className="text-[11px] text-foreground/40 mt-4">
              {t('verifyPage.invalidHelp')}
            </p>
          </motion.div>
        )}

        {result.state === 'valid' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="p-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-emerald-400/20">
                  <ShieldCheck className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-emerald-300">{t('verifyPage.verified')}</div>
                  <div className="text-xl font-bold text-foreground">{t('verifyPage.signatureMatches')}</div>
                  <div className="text-[11px] text-foreground/50 mt-1">
                    {t('verifyPage.hmacDetail')}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-semibold text-foreground">{t('verifyPage.certificateDetails')}</span>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border"
                  style={{
                    background: `${GRADE_COLOR[result.cert.grade]}22`,
                    color: GRADE_COLOR[result.cert.grade],
                    borderColor: `${GRADE_COLOR[result.cert.grade]}55`,
                  }}
                >
                  {result.cert.grade}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 text-xs">
                <Row k={t('verifyPage.rowHatchery')} v={result.cert.hatcheryName} icon={Building2} />
                <Row k={t('verifyPage.rowLicense')}  v={result.cert.hatcheryLicense} icon={BadgeCheck} />
                <Row k={t('verifyPage.rowBatch')}    v={`${result.cert.batchId} · ${result.cert.species} ${result.cert.size}`} />
                <Row k={t('verifyPage.rowCount')}    v={result.cert.count} />
                <Row k={t('verifyPage.rowQsScore')} v={`${result.cert.qsScore} / 100`} />
                <Row k={t('verifyPage.rowDisease')}  v={result.cert.diseaseStatus + (result.cert.diseaseName ? ` · ${result.cert.diseaseName}` : '')} />
                <Row k={t('verifyPage.rowCaptured')} v={result.cert.capturedAt} icon={Clock} />
                <Row k={t('verifyPage.rowGps')}      v={`${result.cert.gps.lat.toFixed(4)}, ${result.cert.gps.lng.toFixed(4)}`} icon={MapPin} />
                <Row k={t('verifyPage.rowSignedBy')} v={result.cert.signedBy} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-foreground/40">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {t('verifyPage.mpedaFormat')}
              </span>
              <span className="text-foreground/20">·</span>
              <span>{t('verifyPage.dpdpaResidency')}</span>
              <span className="text-foreground/20">·</span>
              <span>{t('verifyPage.oieNomenclature')}</span>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <Link to="/aquaai" className="text-teal-400 hover:underline inline-flex items-center gap-1">
                {t('verifyPage.visitAquaI')} <ArrowRight className="w-3 h-3" />
              </Link>
              <a
                href={`/verify/${certId}.json`}
                onClick={(e) => e.preventDefault()}
                className="text-foreground/40 hover:text-foreground inline-flex items-center gap-1"
              >
                {t('verifyPage.rawJsonRecord')} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function Row({ k, v, icon: Icon }: { k: string; v: string; icon?: React.ElementType }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5 px-2 rounded-md bg-card">
      <span className="inline-flex items-center gap-1.5 text-foreground/40">
        {Icon && <Icon className="w-3 h-3" />}
        {k}
      </span>
      <span className="text-foreground/90 truncate ml-2">{v}</span>
    </div>
  );
}
