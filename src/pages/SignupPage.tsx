import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fish, ArrowRight, ArrowLeft, Check, Smartphone, KeyRound,
  Languages, MapPin, BadgeCheck,
} from 'lucide-react';
import { ROLES, type Role } from '@/components/dashboard/RoleSelector';

const LANGUAGES = ['English', 'తెలుగు (Telugu)', 'தமிழ் (Tamil)', 'ଓଡ଼ିଆ (Odia)', 'বাংলা (Bengali)', 'हिन्दी (Hindi)'];
const STEPS = ['Role', 'Mobile', 'OTP', 'Details', 'Done'] as const;
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
  useEffect(() => { document.title = 'Get started — AquaRudra'; }, []);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [step, setStep] = useState<StepId>('Role');
  const [role, setRole] = useState<Role | null>(null);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [kyc, setKyc] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');

  const idx = STEPS.indexOf(step);
  const next = () => setStep(STEPS[Math.min(idx + 1, STEPS.length - 1)]);
  const prev = () => setStep(STEPS[Math.max(idx - 1, 0)]);

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="container mx-auto px-6 lg:px-8 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8 gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white">
            <Fish className="w-5 h-5 text-cyan-400" />
            <span className="font-semibold text-base">AquaRudra</span>
          </Link>
          <div className="text-sm text-white/55">
            {t('common.alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-cyan-300 hover:text-cyan-200 font-semibold underline-offset-4 hover:underline">
              {t('common.signIn')}
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
                    : active ? 'bg-cyan-400 text-black border-cyan-400'
                    : 'bg-white/[0.03] text-white/40 border-white/10'
                  }`}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <div className={`text-[11px] uppercase tracking-widest ${active ? 'text-white' : done ? 'text-white/50' : 'text-white/30'}`}>
                  {s}
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px ${done ? 'bg-emerald-400/40' : 'bg-white/10'}`} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: ROLE */}
          {step === 'Role' && (
            <motion.div key="role" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Which best describes you?</h1>
              <p className="text-sm text-white/50 mb-8">Each role unlocks a different dashboard, tools and permissions.</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {ROLES.map(({ id, label, icon: Icon, accent }) => {
                  const selected = role === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setRole(id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition text-left ${
                        selected ? 'border-cyan-400/50 bg-cyan-400/5' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="p-3 rounded-xl shrink-0" style={{ background: `${accent}22` }}>
                        <Icon className="w-5 h-5" style={{ color: accent }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">{label}</div>
                        <div className="text-[11px] text-white/40 truncate">{KYC_FIELDS[id].label}</div>
                      </div>
                      {selected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={next}
                disabled={!role}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm transition inline-flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: MOBILE */}
          {step === 'Mobile' && (
            <motion.div key="mobile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Your mobile number</h1>
              <p className="text-sm text-white/50 mb-8">We'll send you a 6-digit code to confirm.</p>

              <div className="space-y-4 max-w-md">
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span className="text-white/40 text-sm">+91</span>
                  <input
                    autoFocus
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="bg-transparent outline-none text-white flex-1 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <Languages className="w-4 h-4 text-violet-400" />
                  <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent outline-none text-white flex-1 text-sm">
                    {LANGUAGES.map((l) => <option key={l} value={l} className="bg-black">{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-8">
                <button onClick={prev} className="px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-sm text-white/70 inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={next}
                  disabled={mobile.length < 10}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm inline-flex items-center gap-2"
                >
                  Send OTP <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: OTP */}
          {step === 'OTP' && (
            <motion.div key="otp" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Enter the 6-digit code</h1>
              <p className="text-sm text-white/50 mb-8">Sent to <span className="font-mono text-white">+91 {mobile}</span></p>

              <div className="max-w-md">
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <input
                    autoFocus
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="bg-transparent outline-none text-white flex-1 tracking-[0.5em] font-mono text-lg"
                  />
                </div>
                <button className="text-xs text-white/40 hover:text-white mt-3">Resend in 30s</button>
              </div>

              <div className="flex items-center gap-2 mt-8">
                <button onClick={prev} className="px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-sm text-white/70 inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={next}
                  disabled={otp.length !== 6}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm inline-flex items-center gap-2"
                >
                  Verify <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: KYC + DETAILS */}
          {step === 'Details' && role && (
            <motion.div key="details" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">A few last details</h1>
              <p className="text-sm text-white/50 mb-8">We tailor your dashboard from here.</p>

              <div className="space-y-4 max-w-md">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-white/40">Full name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="As on Aadhaar / official ID"
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:border-cyan-400/40 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-white/40">{KYC_FIELDS[role].label}</span>
                  <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40">
                    <BadgeCheck className="w-4 h-4 text-cyan-400" />
                    <input
                      value={kyc}
                      onChange={(e) => setKyc(e.target.value)}
                      placeholder={KYC_FIELDS[role].hint}
                      className="bg-transparent outline-none text-white flex-1 text-sm"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-white/40">Location</span>
                  <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Village, District, State"
                      className="bg-transparent outline-none text-white flex-1 text-sm"
                    />
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-2 mt-8">
                <button onClick={prev} className="px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-sm text-white/70 inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={next}
                  disabled={!name || !kyc || !location}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm inline-flex items-center gap-2"
                >
                  Finish <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: DONE */}
          {step === 'Done' && role && (
            <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/30 mb-6">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Welcome to AquaI, {name || 'there'}</h1>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                We're loading your <span className="text-white">{ROLES.find(r => r.id === role)?.label}</span> dashboard. KYC review usually takes under 24 hours.
              </p>
              <button
                onClick={() => navigate('/aquaai#dashboard')}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm inline-flex items-center gap-2"
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
