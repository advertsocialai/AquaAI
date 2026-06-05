import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fish, ArrowRight, ArrowLeft, Check, Lock,
  Languages, MapPin, AlertCircle, Loader2,
} from 'lucide-react';
import { ROLES, type Role } from '@/components/dashboard/RoleSelector';
import { DASHBOARD_ROUTE } from '@/pages/dashboards/configs';
import { supabase } from '@/lib/supabase';
import { phoneToEmail } from '@/lib/phoneAuth';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';

const LANGUAGES = ['English', 'తెలుగు (Telugu)', 'ଓଡ଼ିଆ (Odia)', 'বাংলা (Bengali)', 'हिन्दी (Hindi)'];
const STEPS = ['Role', 'Account', 'Details', 'Done'] as const;
type StepId = typeof STEPS[number];

const STEP_LABEL_KEY: Record<StepId, string> = {
  Role: 'signupPage.stepRole',
  Account: 'signupPage.stepAccount',
  Details: 'signupPage.stepDetails',
  Done: 'signupPage.stepDone',
};

const KYC_FIELDS: Record<Role, { labelKey: string; hintKey: string }> = {
  farmer:      { labelKey: 'signupPage.kycFarmerLabel',      hintKey: 'signupPage.kycFarmerHint' },
  vle:         { labelKey: 'signupPage.kycVleLabel',         hintKey: 'signupPage.kycVleHint' },
  hatchery:    { labelKey: 'signupPage.kycHatcheryLabel',    hintKey: 'signupPage.kycHatcheryHint' },
  transporter: { labelKey: 'signupPage.kycTransporterLabel', hintKey: 'signupPage.kycTransporterHint' },
  supplier:    { labelKey: 'signupPage.kycSupplierLabel',    hintKey: 'signupPage.kycSupplierHint' },
  trader:      { labelKey: 'signupPage.kycTraderLabel',      hintKey: 'signupPage.kycTraderHint' },
  bank:        { labelKey: 'signupPage.kycBankLabel',        hintKey: 'signupPage.kycBankHint' },
  govt:        { labelKey: 'signupPage.kycGovtLabel',        hintKey: 'signupPage.kycGovtHint' },
};

export default function SignupPage() {
  const { t } = useTranslation();
  useEffect(() => { document.title = t('signupPage.docTitle'); }, [t]);
  const navigate = useNavigate();

  const [step, setStep] = useState<StepId>('Role');
  const [role, setRole] = useState<Role | null>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idx = STEPS.indexOf(step);
  const next = () => setStep(STEPS[Math.min(idx + 1, STEPS.length - 1)]);
  const prev = () => setStep(STEPS[Math.max(idx - 1, 0)]);

  const phoneValid = /^[6-9]\d{9}$/.test(phone.trim());
  const pwOk = password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

  async function createAccount() {
    if (!role) return;
    if (!supabase) { setError(t('signupPage.errorAuthNotConfigured')); return; }
    setBusy(true);
    setError(null);
    // Mobile + password signup via the email/password provider (no SMS gateway
    // needed). The mobile number is the identity; the real email is optional.
    const loginEmail = phoneToEmail(phone);
    const { data, error: err } = await supabase.auth.signUp({
      email: loginEmail,
      password,
      options: {
        data: { name, role, lang, phone: `+91${phone.trim()}`, location },
      },
    });
    if (err) {
      setBusy(false);
      setError(err.message);
      setStep('Account');
      return;
    }
    // If the project still requires email confirmation, signUp returns no
    // session — sign in with the password to establish one immediately.
    if (!data.session) {
      await supabase.auth.signInWithPassword({ email: loginEmail, password });
    }
    setBusy(false);
    setStep('Done');
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 lg:px-8 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8 gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-foreground">
            <Fish className="w-5 h-5 text-teal-400" />
            <span className="font-semibold text-base">Aqua Rudra</span>
          </Link>
          <div className="text-sm text-foreground/55">
            {t('signupPage.alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-teal-300 hover:text-teal-200 font-semibold underline-offset-4 hover:underline">
              {t('signupPage.signIn')}
            </Link>
          </div>
        </div>

        {/* progress */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => {
            const done = i < idx;
            const active = i === idx;
            return (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border transition ${
                    done ? 'bg-emerald-400 text-black border-emerald-400'
                    : active ? 'bg-teal-400 text-black border-teal-400'
                    : 'bg-card text-foreground/40 border-border'
                  }`}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <div className={`text-[11px] uppercase tracking-widest ${active ? 'text-foreground' : done ? 'text-foreground/50' : 'text-foreground/30'}`}>
                  {t(STEP_LABEL_KEY[s])}
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px ${done ? 'bg-emerald-400/40' : 'bg-card'}`} />}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mb-6 px-4 py-2.5 rounded-lg border border-red-400/30 bg-red-400/10 text-red-300 text-xs inline-flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: ROLE */}
          {step === 'Role' && (
            <motion.div key="role" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('signupPage.roleHeading')}</h1>
              <p className="text-sm text-foreground/50 mb-8">{t('signupPage.roleSubtitle')}</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {ROLES.filter((r) => r.id === 'farmer' || r.id === 'trader').map(({ id, label, icon: Icon, accent }) => {
                  const selected = role === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setRole(id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition text-left ${
                        selected ? 'border-teal-400/50 bg-teal-400/5' : 'border-border bg-card hover:bg-muted'
                      }`}
                    >
                      <div className="p-3 rounded-xl shrink-0" style={{ background: `${accent}22` }}>
                        <Icon className="w-5 h-5" style={{ color: accent }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground">{label}</div>
                        <div className="text-[11px] text-foreground/40 truncate">{t(KYC_FIELDS[id].labelKey)}</div>
                      </div>
                      {selected && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={next}
                disabled={!role}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm transition inline-flex items-center justify-center gap-2"
              >
                {t('signupPage.continue')} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: ACCOUNT (email + password) */}
          {step === 'Account' && (
            <motion.div key="account" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <TypewriterEffect
                words={[
                  { text: t('signupPage.accountWord1'), className: 'text-foreground' },
                  { text: t('signupPage.accountWord2'), className: 'text-foreground' },
                  { text: t('signupPage.accountWord3'), className: 'text-primary' },
                ]}
                className="text-2xl md:text-3xl text-left mb-2"
              />
              <p className="text-sm text-foreground/50 mb-8">{t('signupPage.accountSubtitle')}</p>

              <div className="space-y-4 max-w-md">
                <div>
                  <span className="text-xs text-foreground/40 uppercase tracking-widest">{t('signupPage.mobileNumberLabel')}</span>
                  <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                    <span className="text-sm text-foreground/70 font-medium select-none">+91</span>
                    <input
                      autoFocus
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="bg-transparent outline-none text-foreground flex-1 text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                  <Lock className="w-4 h-4 text-teal-400" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('signupPage.passwordPlaceholder')}
                    className="bg-transparent outline-none text-foreground flex-1 text-sm"
                  />
                </div>
                {password && !pwOk && (
                  <div className="flex items-center gap-2 text-xs text-amber-300">
                    <AlertCircle className="w-3.5 h-3.5" /> {t('signupPage.passwordHint')}
                  </div>
                )}

                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card">
                  <Languages className="w-4 h-4 text-violet-400" />
                  <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent outline-none text-foreground flex-1 text-sm">
                    {LANGUAGES.map((l) => <option key={l} value={l} className="bg-background">{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-8">
                <button onClick={prev} className="px-5 py-3 rounded-xl border border-border bg-card hover:bg-muted text-sm text-foreground/70 inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> {t('signupPage.back')}
                </button>
                <button
                  onClick={next}
                  disabled={!phoneValid || !pwOk}
                  className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm inline-flex items-center gap-2"
                >
                  {t('signupPage.continue')} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: KYC + DETAILS */}
          {step === 'Details' && role && (
            <motion.div key="details" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('signupPage.detailsHeading')}</h1>
              <p className="text-sm text-foreground/50 mb-8">{t('signupPage.detailsSubtitle')}</p>

              <div className="space-y-4 max-w-md">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-foreground/40">{t('signupPage.fullNameLabel')}</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('signupPage.fullNamePlaceholder')}
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground outline-none focus:border-teal-400/40 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-foreground/40">{t('signupPage.locationLabel')}</span>
                  <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t('signupPage.locationPlaceholder')}
                      className="bg-transparent outline-none text-foreground flex-1 text-sm"
                    />
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-2 mt-8">
                <button onClick={prev} className="px-5 py-3 rounded-xl border border-border bg-card hover:bg-muted text-sm text-foreground/70 inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> {t('signupPage.back')}
                </button>
                <button
                  onClick={createAccount}
                  disabled={!name || !location || busy}
                  className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm inline-flex items-center gap-2"
                >
                  {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('signupPage.creating')}</> : <>{t('signupPage.finish')} <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DONE */}
          {step === 'Done' && role && (
            <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/30 mb-6">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2">{t('signupPage.welcomeTitle', { name: name || t('signupPage.welcomeFallbackName') })}</h1>
              <p className="text-foreground/50 mb-8 max-w-md mx-auto">
                {t('signupPage.welcomeBodyPrefix')}{' '}
                <span className="text-foreground">{ROLES.find(r => r.id === role)?.label}</span> {t('signupPage.welcomeBodySuffix')}
              </p>
              <button
                onClick={() => navigate(DASHBOARD_ROUTE[role] ?? '/aquaai#dashboard')}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-semibold text-sm inline-flex items-center gap-2"
              >
                {t('signupPage.goToDashboard')} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
