import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, ShieldCheck, KeyRound, Activity, IndianRupee,
  BadgeCheck, Languages, ArrowRight, Fish,
} from 'lucide-react';

const VALUE_PROPS = [
  { icon: Activity,      title: 'Live AI Diagnostics',  desc: 'PCR-validated detection in 30 seconds' },
  { icon: IndianRupee,   title: 'Best Prices',          desc: 'Live mandi + export rates, 31+ species' },
  { icon: BadgeCheck,    title: 'Verified Marketplace', desc: 'KYC-checked suppliers, escrow payments' },
];

const LANGUAGES = ['English', 'తెలుగు', 'தமிழ்', 'ଓଡ଼ିଆ', 'বাংলা', 'हिन्दी'];

export default function LoginPage() {
  useEffect(() => { document.title = 'Sign in — AquaI'; }, []);
  const navigate = useNavigate();
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [lang, setLang] = useState('English');
  const [propIdx, setPropIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPropIdx((i) => (i + 1) % VALUE_PROPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const prop = VALUE_PROPS[propIdx];
  const PropIcon = prop.icon;

  function submitMobile(e: React.FormEvent) {
    e.preventDefault();
    if (mobile.length >= 10) setStep('otp');
  }

  function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length === 6) navigate('/aquaai#dashboard');
  }

  return (
    <div className="min-h-screen bg-background text-white grid lg:grid-cols-5">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:col-span-3 relative overflow-hidden p-12 flex-col">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-black to-violet-500/10" />
        </div>

        <Link to="/" className="relative z-10 inline-flex items-center gap-2 text-white/80 hover:text-white text-sm">
          <Fish className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">AquaI</span>
        </Link>

        <div className="relative z-10 mt-auto max-w-xl">
          <div className="text-[11px] uppercase tracking-widest text-cyan-300/70 mb-6">
            Decoding aquaculture, one pond at a time
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={propIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/20">
                  <PropIcon className="w-6 h-6 text-cyan-300" />
                </div>
                <div className="text-3xl md:text-4xl font-bold">{prop.title}</div>
              </div>
              <p className="text-lg text-white/60 leading-relaxed">{prop.desc}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 mt-10">
            {VALUE_PROPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setPropIdx(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === propIdx ? 'w-10 bg-cyan-400' : 'w-3 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-white/30 mt-10">
          MPEDA · NSPAAD · ICAR-CIBA validated · DPDPA-compliant · India-hosted
        </div>
      </div>

      {/* Right form panel */}
      <div className="lg:col-span-2 flex flex-col p-6 lg:p-10 max-w-xl w-full mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-white text-sm">
            <Fish className="w-4 h-4 text-cyan-400" /><span className="font-semibold">AquaI</span>
          </Link>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <Languages className="w-3.5 h-3.5 text-white/40" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-white/70 outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => <option key={l} value={l} className="bg-black">{l}</option>)}
            </select>
          </div>
        </div>

        <div className="my-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-sm text-white/50 mb-8">Sign in with your mobile number</p>

          {step === 'mobile' && (
            <motion.form
              key="mobile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={submitMobile}
              className="space-y-4"
            >
              <label className="block">
                <span className="text-xs text-white/40 uppercase tracking-widest">Mobile number</span>
                <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40">
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
              </label>

              <button
                type="submit"
                disabled={mobile.length < 10}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                Send OTP <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === 'otp' && (
            <motion.form
              key="otp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={submitOtp}
              className="space-y-4"
            >
              <div className="text-sm text-white/60">
                OTP sent to <span className="font-mono text-white">+91 {mobile}</span>{' '}
                <button type="button" onClick={() => setStep('mobile')} className="text-cyan-400 hover:underline ml-2">change</button>
              </div>

              <label className="block">
                <span className="text-xs text-white/40 uppercase tracking-widest">6-digit OTP</span>
                <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40">
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
              </label>

              <button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                Sign in <ShieldCheck className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs">
                <button type="button" className="text-white/40 hover:text-white">
                  Didn't get the code? Resend in 30s
                </button>
                <Link to="/forgot-password" className="text-cyan-400 hover:underline">Forgot password</Link>
              </div>
            </motion.form>
          )}

          <div className="mt-10 pt-6 border-t border-white/5 text-sm text-white/50">
            New to AquaI?{' '}
            <Link to="/signup" className="text-cyan-400 hover:underline font-medium">Create an account</Link>
          </div>

          <div className="mt-4 text-[11px] text-white/30 leading-relaxed">
            By signing in you agree to our <Link to="/terms" className="underline hover:text-white/60">Terms</Link> and{' '}
            <Link to="/privacy" className="underline hover:text-white/60">Privacy Policy</Link>. Aadhaar e-KYC handled per DPDPA 2023.
          </div>
        </div>
      </div>
    </div>
  );
}
