import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fish, ArrowRight, ArrowLeft, Check, Mail, Lock,
  Languages, MapPin, BadgeCheck, AlertCircle, Loader2,
} from 'lucide-react';
import { ROLES, type Role } from '@/components/dashboard/RoleSelector';
import { DASHBOARD_ROUTE } from '@/pages/dashboards/configs';
import { supabase } from '@/lib/supabase';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';

const LANGUAGES = ['English', 'తెలుగు (Telugu)', 'ଓଡ଼ିଆ (Odia)', 'বাংলা (Bengali)', 'हिन्दी (Hindi)'];
const STEPS = ['Role', 'Account', 'Details', 'Done'] as const;
type StepId = typeof STEPS[number];

const KYC_FIELDS: Record<Role, { label: string; hint: string }> = {
  farmer:      { label: 'Aadhaar number',        hint: '12-digit, used for e-KYC' },
  vle:         { label: 'Training certificate #',hint: 'NABARD / state issued' },
  hatchery:    { label: 'MPEDA / CAA license',   hint: 'Plus GST will be verified next' },
  transporter: { label: 'Vehicle RC + DL',       hint: 'Cold-chain cert if applicable' },
  supplier:    { label: 'GST + facility license',hint: 'Capacity declaration in next step' },
  trader:      { label: 'MPEDA buyer + IEC',     hint: 'Export code required' },
  bank:        { label: 'Institutional ID + API',hint: 'Onboarding via partnerships team' },
  govt:        { label: 'Govt ID + jurisdiction',hint: 'Officer email domain verified' },
};

export default function SignupPage() {
  useEffect(() => { document.title = 'Get started — Aqua Rudra'; }, []);
  const navigate = useNavigate();

  const [step, setStep] = useState<StepId>('Role');
  const [role, setRole] = useState<Role | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [kyc, setKyc] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idx = STEPS.indexOf(step);
  const next = () => setStep(STEPS[Math.min(idx + 1, STEPS.length - 1)]);
  const prev = () => setStep(STEPS[Math.max(idx - 1, 0)]);

  const phoneValid = /^[6-9]\d{9}$/.test(phone.trim());
  const emailValid = email.trim() === '' || /^\S+@\S+\.\S+$/.test(email.trim());
  const pwOk = password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

  async function createAccount() {
    if (!role) return;
    if (!supabase) { setError('Authentication is not configured.'); return; }
    setBusy(true);
    setError(null);
    // Phone-primary signup; email is optional (kept in metadata).
    const { error: err } = await supabase.auth.signUp({
      phone: `+91${phone.trim()}`,
      password,
      options: {
        data: { name, role, lang, kyc_ref: kyc, location, email: email.trim().toLowerCase() || null },
      },
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      setStep('Account');
      return;
    }
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
            Already have an account?{' '}
            <Link to="/login" className="text-teal-300 hover:text-teal-200 font-semibold underline-offset-4 hover:underline">
              Sign in
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
                  {s}
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
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Which best describes you?</h1>
              <p className="text-sm text-foreground/50 mb-8">Each role unlocks a different dashboard, tools and permissions.</p>
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
                        <div className="text-[11px] text-foreground/40 truncate">{KYC_FIELDS[id].label}</div>
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
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: ACCOUNT (email + password) */}
          {step === 'Account' && (
            <motion.div key="account" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <TypewriterEffect
                words={[
                  { text: 'Create', className: 'text-foreground' },
                  { text: 'your', className: 'text-foreground' },
                  { text: 'account', className: 'text-primary' },
                ]}
                className="text-2xl md:text-3xl text-left mb-2"
              />
              <p className="text-sm text-foreground/50 mb-8">Use your mobile number and a password. Email is optional.</p>

              <div className="space-y-4 max-w-md">
                <div>
                  <span className="text-xs text-foreground/40 uppercase tracking-widest">Mobile number</span>
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
                    placeholder="At least 8 chars · 1 capital · 1 number"
                    className="bg-transparent outline-none text-foreground flex-1 text-sm"
                  />
                </div>
                {password && !pwOk && (
                  <div className="flex items-center gap-2 text-xs text-amber-300">
                    <AlertCircle className="w-3.5 h-3.5" /> Needs 8+ chars, one capital, one digit.
                  </div>
                )}

                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                  <Mail className="w-4 h-4 text-foreground/40" />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email (optional)"
                    className="bg-transparent outline-none text-foreground flex-1 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card">
                  <Languages className="w-4 h-4 text-violet-400" />
                  <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent outline-none text-foreground flex-1 text-sm">
                    {LANGUAGES.map((l) => <option key={l} value={l} className="bg-background">{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-8">
                <button onClick={prev} className="px-5 py-3 rounded-xl border border-border bg-card hover:bg-muted text-sm text-foreground/70 inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={next}
                  disabled={!phoneValid || !pwOk || !emailValid}
                  className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm inline-flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: KYC + DETAILS */}
          {step === 'Details' && role && (
            <motion.div key="details" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">A few last details</h1>
              <p className="text-sm text-foreground/50 mb-8">We tailor your dashboard from here.</p>

              <div className="space-y-4 max-w-md">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-foreground/40">Full name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="As on Aadhaar / official ID"
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground outline-none focus:border-teal-400/40 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-foreground/40">{KYC_FIELDS[role].label}</span>
                  <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                    <BadgeCheck className="w-4 h-4 text-teal-400" />
                    <input
                      value={kyc}
                      onChange={(e) => setKyc(e.target.value)}
                      placeholder={KYC_FIELDS[role].hint}
                      className="bg-transparent outline-none text-foreground flex-1 text-sm"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-foreground/40">Location</span>
                  <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Village, District, State"
                      className="bg-transparent outline-none text-foreground flex-1 text-sm"
                    />
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-2 mt-8">
                <button onClick={prev} className="px-5 py-3 rounded-xl border border-border bg-card hover:bg-muted text-sm text-foreground/70 inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={createAccount}
                  disabled={!name || !kyc || !location || busy}
                  className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm inline-flex items-center gap-2"
                >
                  {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <>Finish <ArrowRight className="w-4 h-4" /></>}
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
              <h1 className="text-3xl font-bold mb-2">Welcome to Aqua Rudra, {name || 'there'}</h1>
              <p className="text-foreground/50 mb-8 max-w-md mx-auto">
                Check your inbox to confirm your email, then open your{' '}
                <span className="text-foreground">{ROLES.find(r => r.id === role)?.label}</span> dashboard.
              </p>
              <button
                onClick={() => navigate(DASHBOARD_ROUTE[role] ?? '/aquaai#dashboard')}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-semibold text-sm inline-flex items-center gap-2"
              >
                Go to dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
