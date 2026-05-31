import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fish, Mail, KeyRound, Lock, ArrowRight, Check, AlertCircle, Loader2,
} from 'lucide-react';

type Step = 'email' | 'otp' | 'reset' | 'done';

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:8000/api/v1';

export default function ForgotPasswordPage() {
  useEffect(() => { document.title = 'Reset password — AquaI'; }, []);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = /^\S+@\S+\.\S+$/.test(email.trim());
  const pwOk = pw.length >= 8 && /[A-Z]/.test(pw) && /\d/.test(pw);
  const pwMatch = pw === pw2;

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    if (!emailValid) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setStep('otp');
    } catch (err) {
      setError('Could not send code. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    if (!pwOk || !pwMatch) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp,
          new_password: pw,
        }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(typeof data.detail === 'string' ? data.detail : `HTTP ${r.status}`);
      }
      setStep('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset failed';
      // Bounce back to OTP step so the user can re-enter — common case.
      if (/invalid code|no active reset/i.test(msg)) {
        setError('That code didn\'t work. Re-check your email.');
        setStep('otp');
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-6 lg:px-8 py-6 flex items-center justify-between max-w-md mx-auto w-full">
        <Link to="/" className="inline-flex items-center gap-2">
          <Fish className="w-4 h-4 text-teal-400" />
          <span className="font-semibold">AquaI</span>
        </Link>
        <Link to="/login" className="text-xs text-foreground/50 hover:text-foreground">Back to sign in</Link>
      </header>

      <main className="container mx-auto px-6 lg:px-8 max-w-md flex-1 flex flex-col justify-center pb-20">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Reset your password</h1>
        <p className="text-sm text-foreground/60 mb-8">We'll email a 6-digit code to the address you used to sign up.</p>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg border border-red-400/30 bg-red-400/10 text-red-200 text-xs inline-flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.form
              key="m"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onSubmit={requestCode}
              className="space-y-4"
            >
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-foreground/60">Email address</span>
                <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                  <Mail className="w-4 h-4 text-teal-400" />
                  <input
                    autoFocus
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-transparent outline-none text-foreground flex-1 text-sm"
                  />
                </div>
              </label>
              <button
                type="submit"
                disabled={!emailValid || busy}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 text-black font-semibold text-sm inline-flex items-center justify-center gap-2"
              >
                {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <>Send code <ArrowRight className="w-4 h-4" /></>}
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
              <div className="text-sm text-foreground/70">
                Code sent to <span className="font-mono text-foreground">{email}</span>{' '}
                <button type="button" onClick={() => setStep('email')} className="text-teal-400 hover:underline ml-2">change</button>
              </div>
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-foreground/40">6-digit code</span>
                <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                  <KeyRound className="w-4 h-4 text-teal-400" />
                  <input
                    autoFocus
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="bg-transparent outline-none text-foreground flex-1 tracking-[0.5em] font-mono text-lg"
                  />
                </div>
              </label>
              <button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 text-black font-semibold text-sm inline-flex items-center justify-center gap-2"
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
              onSubmit={submitReset}
              className="space-y-4"
            >
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-foreground/60">New password</span>
                <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                  <Lock className="w-4 h-4 text-teal-400" />
                  <input
                    autoFocus
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="At least 8 chars · 1 capital · 1 number"
                    className="bg-transparent outline-none text-foreground flex-1 text-sm"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-foreground/40">Confirm</span>
                <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                  <Lock className="w-4 h-4 text-teal-400" />
                  <input
                    type="password"
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    placeholder="Re-enter"
                    className="bg-transparent outline-none text-foreground flex-1 text-sm"
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
                disabled={!pwOk || !pwMatch || busy}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 text-black font-semibold text-sm inline-flex items-center justify-center gap-2"
              >
                {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting…</> : <>Reset password <ArrowRight className="w-4 h-4" /></>}
              </button>
            </motion.form>
          )}

          {step === 'done' && (
            <motion.div key="d" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/30 mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Password reset</h2>
              <p className="text-foreground/50 mb-6 text-sm">You can now sign in with your new password.</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-semibold text-sm"
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
