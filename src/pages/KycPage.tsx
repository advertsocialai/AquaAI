import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, BadgeCheck, Smartphone, Building2, Landmark,
  Check, X, Loader2, KeyRound, ArrowRight, Lock, Fish,
} from 'lucide-react';

type Step = 'aadhaar' | 'aadhaar-otp' | 'pan' | 'gst' | 'bank' | 'done';

const STEPS: { id: Step; labelKey: string; icon: React.ElementType }[] = [
  { id: 'aadhaar',      labelKey: 'kycPage.stepAadhaar',  icon: ShieldCheck },
  { id: 'aadhaar-otp',  labelKey: 'kycPage.stepOtp',      icon: KeyRound },
  { id: 'pan',          labelKey: 'kycPage.stepPan',      icon: BadgeCheck },
  { id: 'gst',          labelKey: 'kycPage.stepGst',      icon: Building2 },
  { id: 'bank',         labelKey: 'kycPage.stepBank',     icon: Landmark },
  { id: 'done',         labelKey: 'kycPage.stepDone',     icon: Check },
];

function maskAadhaar(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 12);
  if (d.length <= 8) return d.replace(/(.{4})/g, '$1 ').trim();
  return `XXXX XXXX ${d.slice(8)}`;
}

function Pending() {
  return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
}

function VerifiedBadge({ value }: { value: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-sm">
      <Check className="w-4 h-4" /> {t('kycPage.verified')} · {value}
    </div>
  );
}

export default function KycPage() {
  const { t } = useTranslation();
  useEffect(() => { document.title = t('kycPage.docTitle'); }, [t]);
  const [step, setStep] = useState<Step>('aadhaar');
  const idx = STEPS.findIndex((s) => s.id === step);

  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const [pan, setPan] = useState('');
  const [panVerified, setPanVerified] = useState(false);

  const [gst, setGst] = useState('');
  const [gstVerified, setGstVerified] = useState(false);
  const [gstName, setGstName] = useState('');

  const [accountNo, setAccountNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [pennyDrop, setPennyDrop] = useState<'idle' | 'running' | 'ok' | 'fail'>('idle');
  const [accountHolder, setAccountHolder] = useState('');

  function submitAadhaar(e: React.FormEvent) {
    e.preventDefault();
    if (aadhaar.replace(/\D/g, '').length !== 12) return;
    setOtpRequested(true);
    setStep('aadhaar-otp');
  }

  function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return;
    setOtpVerifying(true);
    setTimeout(() => {
      setOtpVerifying(false);
      setAadhaarVerified(true);
      setStep('pan');
    }, 700);
  }

  function submitPan(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return;
    setPanVerified(true);
    setStep('gst');
  }

  function submitGst(e: React.FormEvent) {
    e.preventDefault();
    if (gst.length < 15) return;
    setGstVerified(true);
    setGstName('Aquaprime Hatcheries Pvt Ltd');
    setStep('bank');
  }

  function runPennyDrop(e: React.FormEvent) {
    e.preventDefault();
    if (accountNo.length < 8 || ifsc.length !== 11) return;
    setPennyDrop('running');
    setTimeout(() => {
      setPennyDrop('ok');
      setAccountHolder('V. Ramana');
      setStep('done');
    }, 900);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 lg:px-8 py-6 flex items-center justify-between max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2">
          <Fish className="w-4 h-4 text-teal-400" />
          <span className="font-semibold">AquaI</span>
        </Link>
        <div className="text-[11px] text-foreground/30 inline-flex items-center gap-1.5">
          <Lock className="w-3 h-3" /> {t('kycPage.complianceTag')}
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-8 max-w-3xl pb-16">
        <div className="text-[11px] uppercase tracking-widest text-foreground/30 mb-2">{t('kycPage.eyebrow')}</div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('kycPage.heroTitle')}</h1>
        <p className="text-sm text-foreground/50 mb-8 max-w-xl">
          {t('kycPage.heroDesc')}
        </p>

        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => {
            const done = i < idx;
            const active = i === idx;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border ${
                    done ? 'bg-emerald-400 text-black border-emerald-400'
                    : active ? 'bg-teal-400 text-black border-teal-400'
                    : 'bg-card text-foreground/40 border-border'
                  }`}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <div className={`text-[10px] uppercase tracking-widest ${active ? 'text-foreground' : done ? 'text-foreground/50' : 'text-foreground/30'}`}>
                  {t(s.labelKey)}
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px ${done ? 'bg-emerald-400/40' : 'bg-card'}`} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 'aadhaar' && (
            <motion.form
              key="aadhaar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={submitAadhaar}
              className="space-y-4"
            >
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-foreground/40">{t('kycPage.aadhaarLabel')}</span>
                <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <input
                    autoFocus
                    inputMode="numeric"
                    value={maskAadhaar(aadhaar)}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    placeholder="XXXX XXXX XXXX"
                    className="bg-transparent outline-none text-foreground flex-1 tracking-wider"
                  />
                </div>
                <div className="text-[11px] text-foreground/30 mt-1">
                  {t('kycPage.aadhaarHelp')}
                </div>
              </label>
              <button
                type="submit"
                disabled={aadhaar.length !== 12}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 text-black font-semibold text-sm inline-flex items-center gap-2"
              >
                {t('kycPage.sendOtpBtn')} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === 'aadhaar-otp' && (
            <motion.form
              key="aadhaar-otp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={submitOtp}
              className="space-y-4"
            >
              <div className="text-sm text-foreground/70">
                {t('kycPage.otpSent')}{' '}
                <button type="button" onClick={() => setStep('aadhaar')} className="text-teal-400 hover:underline">{t('kycPage.changeLink')}</button>
              </div>
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-foreground/40">{t('kycPage.otpLabel')}</span>
                <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                  <KeyRound className="w-4 h-4 text-teal-400" />
                  <input
                    autoFocus
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="bg-transparent outline-none text-foreground flex-1 tracking-[0.5em] font-mono text-lg"
                  />
                  {otpVerifying && <Pending />}
                </div>
              </label>
              <button
                type="submit"
                disabled={otp.length !== 6 || otpVerifying}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 text-black font-semibold text-sm inline-flex items-center gap-2"
              >
                {t('kycPage.verifyBtn')} <Check className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === 'pan' && (
            <motion.div
              key="pan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <VerifiedBadge value={`Aadhaar XXXX ${aadhaar.slice(-4)}`} />
              <form onSubmit={submitPan} className="space-y-4">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-foreground/40">{t('kycPage.panLabel')}</span>
                  <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                    <BadgeCheck className="w-4 h-4 text-violet-400" />
                    <input
                      autoFocus
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))}
                      placeholder="ABCDE1234F"
                      className="bg-transparent outline-none text-foreground flex-1 font-mono tracking-widest"
                    />
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)}
                  className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 text-black font-semibold text-sm inline-flex items-center gap-2"
                >
                  {t('kycPage.verifyPanBtn')} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {step === 'gst' && (
            <motion.div
              key="gst"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <VerifiedBadge value={`Aadhaar XXXX ${aadhaar.slice(-4)}`} />
              <VerifiedBadge value={`PAN ${pan}`} />
              <form onSubmit={submitGst} className="space-y-4">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-foreground/40">{t('kycPage.gstLabel')}</span>
                  <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <input
                      autoFocus
                      value={gst}
                      onChange={(e) => setGst(e.target.value.toUpperCase().slice(0, 15))}
                      placeholder="22AAAAA0000A1Z5"
                      className="bg-transparent outline-none text-foreground flex-1 font-mono tracking-wider"
                    />
                  </div>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={gst.length < 15}
                    className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 text-black font-semibold text-sm inline-flex items-center gap-2"
                  >
                    {t('kycPage.verifyGstBtn')} <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('bank')}
                    className="text-sm text-foreground/40 hover:text-foreground"
                  >
                    {t('kycPage.skipIndividual')}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'bank' && (
            <motion.div
              key="bank"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <VerifiedBadge value={`Aadhaar XXXX ${aadhaar.slice(-4)}`} />
              <VerifiedBadge value={`PAN ${pan}`} />
              {gstVerified && <VerifiedBadge value={`GST ${gst} · ${gstName}`} />}
              <form onSubmit={runPennyDrop} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-widest text-foreground/40">{t('kycPage.accountLabel')}</span>
                    <div className="mt-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                      <input
                        value={accountNo}
                        onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, '').slice(0, 18))}
                        placeholder="0000 0000 0000 00"
                        className="w-full bg-transparent outline-none text-foreground text-sm font-mono"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-widest text-foreground/40">{t('kycPage.ifscLabel')}</span>
                    <div className="mt-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                      <input
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value.toUpperCase().slice(0, 11))}
                        placeholder="SBIN0001234"
                        className="w-full bg-transparent outline-none text-foreground text-sm font-mono"
                      />
                    </div>
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={accountNo.length < 8 || ifsc.length !== 11 || pennyDrop === 'running'}
                  className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 text-black font-semibold text-sm inline-flex items-center gap-2"
                >
                  {pennyDrop === 'running' ? <Pending /> : <Smartphone className="w-4 h-4" />}
                  {t('kycPage.pennyDropBtn')}
                </button>
                {pennyDrop === 'fail' && (
                  <div className="flex items-center gap-2 text-sm text-red-300">
                    <X className="w-4 h-4" /> {t('kycPage.pennyDropFail')}
                  </div>
                )}
              </form>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/30 mb-6">
                <ShieldCheck className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t('kycPage.doneTitle')}</h2>
              <p className="text-foreground/50 mb-6 max-w-md mx-auto">
                {t('kycPage.accountHolderPrefix')} <span className="text-foreground">{accountHolder}</span>.
                {' '}{t('kycPage.kycLinked')}
              </p>
              <div className="grid sm:grid-cols-2 gap-3 max-w-md mx-auto text-left mb-8">
                <VerifiedBadge value={`Aadhaar XXXX ${aadhaar.slice(-4)}`} />
                <VerifiedBadge value={`PAN ${pan}`} />
                {gstVerified && <VerifiedBadge value="GST" />}
                <VerifiedBadge value={t('kycPage.bankBadge')} />
              </div>
              <Link
                to="/aquaai#dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-semibold text-sm"
              >
                {t('kycPage.continueDashboard')} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
