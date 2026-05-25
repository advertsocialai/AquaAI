import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fish, Smartphone, KeyRound, Lock, ArrowRight, Check, AlertCircle,
} from 'lucide-react';

type Step = 'mobile' | 'otp' | 'reset' | 'done';

export default function ForgotPasswordPage() {
  useEffect(() => { document.title = 'Reset password — AquaI'; }, []);
  const [step, setStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');

  const pwOk = pw.length >= 8 && /[A-Z]/.test(pw) && /\d/.test(pw);
  const pwMatch = pw === pw2;

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <header className="px-6 lg:px-8 py-6 flex items-center justify-between max-w-md mx-auto w-full">
        <Link to="/" className="inline-flex items-center gap-2">
          <Fish className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">AquaI</span>
        </Link>
        <Link to="/login" className="text-xs text-white/50 hover:text-white">Back to sign in</Link>
      </header>

      <main className="container mx-auto px-6 lg:px-8 max-w-md flex-1 flex flex-col justify-center pb-20">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Reset your password</h1>
        <p className="text-sm text-white/50 mb-8">We'll send a code to your registered mobile.</p>

        <AnimatePresence mode="wait">
          {step === 'mobile' && (
            <motion.form
              key="m"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onSubmit={(e) => { e.preventDefault(); if (mobile.length === 10) setStep('otp'); }}
              className="space-y-4"
            >
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-white/40">Mobile number</span>
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
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-black font-semibold text-sm inline-flex items-center justify-center gap-2"
              >
                Send code <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === 'otp' && (
            <motion.form
              key="o"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onSubmit={(e) => { e.preventDefault(); if (otp.length === 6) setStep('reset'); }}
              className="space-y-4"
            >
              <div className="text-sm text-white/60">
                Code sent to <span className="font-mono text-white">+91 {mobile}</span>{' '}
                <button type="button" onClick={() => setStep('mobile')} className="text-cyan-400 hover:underline ml-2">change</button>
              </div>
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-white/40">6-digit code</span>
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
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-black font-semibold text-sm inline-flex items-center justify-center gap-2"
              >
                Verify <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === 'reset' && (
            <motion.form
              key="r"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onSubmit={(e) => { e.preventDefault(); if (pwOk && pwMatch) setStep('done'); }}
              className="space-y-4"
            >
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-white/40">New password</span>
                <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <input
                    autoFocus
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="At least 8 chars · 1 capital · 1 number"
                    className="bg-transparent outline-none text-white flex-1 text-sm"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-white/40">Confirm</span>
                <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <input
                    type="password"
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    placeholder="Re-enter"
                    className="bg-transparent outline-none text-white flex-1 text-sm"
                  />
                </div>
              </label>
              {pw && !pwOk && (
                <div className="flex items-center gap-2 text-xs text-amber-300">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Needs at least 8 chars, one capital letter, one digit.
                </div>
              )}
              {pw2 && !pwMatch && (
                <div className="flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-3.5 h-3.5" /> Passwords don't match.
                </div>
              )}
              <button
                type="submit"
                disabled={!pwOk || !pwMatch}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-black font-semibold text-sm inline-flex items-center justify-center gap-2"
              >
                Reset password <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === 'done' && (
            <motion.div key="d" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/30 mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Password reset</h2>
              <p className="text-white/50 mb-6 text-sm">You can now sign in with your new password.</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm"
              >
                Go to sign in <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
