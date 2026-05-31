import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fish, Mail, Lock, ArrowRight, Check, AlertCircle, Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Step = 'email' | 'sent' | 'reset' | 'done';

export default function ForgotPasswordPage() {
  useEffect(() => { document.title = 'Reset password — Aqua Rudra'; }, []);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = /^\S+@\S+\.\S+$/.test(email.trim());
  const pwOk = pw.length >= 8 && /[A-Z]/.test(pw) && /\d/.test(pw);
  const pwMatch = pw === pw2;

  // When the user clicks the email link, Supabase puts them back here with a
  // recovery session — switch straight to the "set new password" step.
  useEffect(() => {
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStep('reset');
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function requestLink(e: React.FormEvent) {
    e.preventDefault();
    if (!emailValid) return;
    if (!supabase) { setError('Authentication is not configured.'); return; }
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/forgot-password`,
    });
    setBusy(false);
    if (err) { setError(err.message); return; }
    setStep('sent');
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    if (!pwOk || !pwMatch) return;
    if (!supabase) { setError('Authentication is not configured.'); return; }
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (err) { setError(err.message); return; }
    setStep('done');
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-6 lg:px-8 py-6 flex items-center justify-between max-w-md mx-auto w-full">
        <Link to="/" className="inline-flex items-center gap-2">
          <Fish className="w-4 h-4 text-teal-400" />
          <span className="font-semibold">Aqua Rudra</span>
        </Link>
        <Link to="/login" className="text-xs text-foreground/50 hover:text-foreground">Back to sign in</Link>
      </header>

      <main className="container mx-auto px-6 lg:px-8 max-w-md flex-1 flex flex-col justify-center pb-20">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Reset your password</h1>
        <p className="text-sm text-foreground/60 mb-8">We'll email you a secure link to set a new password.</p>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg border border-red-400/30 bg-red-400/10 text-red-300 text-xs inline-flex items-center gap-2">
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
              onSubmit={requestLink}
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
                {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <>Send reset link <ArrowRight className="w-4 h-4" /></>}
              </button>
            </motion.form>
          )}

          {step === 'sent' && (
            <motion.div key="s" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/30 mb-4">
                <Mail className="w-8 h-8 text-teal-300" />
              </div>
              <h2 className="text-xl font-bold mb-2">Check your email</h2>
              <p className="text-foreground/50 text-sm">
                We sent a reset link to <span className="text-foreground font-medium">{email}</span>.
                Open it on this device to set a new password.
              </p>
            </motion.div>
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
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
