import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, ShieldCheck, Lock, Activity, IndianRupee,
  BadgeCheck, ArrowRight, Fish, AlertCircle, Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DASHBOARD_ROUTE } from '@/pages/dashboards/configs';
import type { Role } from '@/components/dashboard/RoleSelector';

const VALUE_PROPS = [
  { icon: Activity,      title: 'Live AI Diagnostics',  desc: 'PCR-validated detection in 30 seconds' },
  { icon: IndianRupee,   title: 'Best Prices',          desc: 'Live mandi + export rates, 31+ species' },
  { icon: BadgeCheck,    title: 'Verified Marketplace', desc: 'KYC-checked suppliers, escrow payments' },
];

export default function LoginPage() {
  useEffect(() => { document.title = 'Sign in — Aqua Rudra'; }, []);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propIdx, setPropIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPropIdx((i) => (i + 1) % VALUE_PROPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const prop = VALUE_PROPS[propIdx];
  const PropIcon = prop.icon;
  const emailValid = /^\S+@\S+\.\S+$/.test(email.trim());

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailValid || !password) return;
    if (!supabase) { setError('Authentication is not configured.'); return; }
    setBusy(true);
    setError(null);
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setBusy(false);
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'Wrong email or password.' : err.message);
      return;
    }
    const role = (data.user?.user_metadata?.role as Role | undefined) ?? null;
    navigate(role ? DASHBOARD_ROUTE[role] : '/aquaai#dashboard');
  }

  return (
    <div className="min-h-screen bg-background text-foreground grid lg:grid-cols-5">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:col-span-3 relative overflow-hidden p-12 flex-col">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-background to-violet-500/10" />
        </div>

        <Link to="/" className="relative z-10 inline-flex items-center gap-2 text-foreground/80 hover:text-foreground text-sm">
          <Fish className="w-4 h-4 text-teal-400" />
          <span className="font-semibold">Aqua Rudra</span>
        </Link>

        <div className="relative z-10 mt-auto max-w-xl">
          <div className="text-[11px] uppercase tracking-widest text-teal-300/70 mb-6">
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
                <div className="p-3 rounded-xl bg-teal-400/10 border border-teal-400/20">
                  <PropIcon className="w-6 h-6 text-teal-300" />
                </div>
                <div className="text-3xl md:text-4xl font-bold">{prop.title}</div>
              </div>
              <p className="text-lg text-foreground/60 leading-relaxed">{prop.desc}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 mt-10">
            {VALUE_PROPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setPropIdx(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === propIdx ? 'w-10 bg-teal-400' : 'w-3 bg-card hover:bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-foreground/30 mt-10">
          MPEDA · NSPAAD · ICAR-CIBA validated · DPDPA-compliant · India-hosted
        </div>
      </div>

      {/* Right form panel */}
      <div className="lg:col-span-2 flex flex-col p-6 lg:p-10 max-w-xl w-full mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-foreground text-sm">
            <Fish className="w-4 h-4 text-teal-400" /><span className="font-semibold">Aqua Rudra</span>
          </Link>
        </div>

        <div className="my-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-sm text-foreground/50 mb-8">Sign in with your email and password</p>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg border border-red-400/30 bg-red-400/10 text-red-300 text-xs inline-flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submit}
            className="space-y-4"
          >
            <label className="block">
              <span className="text-xs text-foreground/40 uppercase tracking-widest">Email</span>
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

            <label className="block">
              <span className="text-xs text-foreground/40 uppercase tracking-widest">Password</span>
              <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                <Lock className="w-4 h-4 text-teal-400" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="bg-transparent outline-none text-foreground flex-1 text-sm"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={!emailValid || !password || busy}
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : <>Sign in <ShieldCheck className="w-4 h-4" /></>}
            </button>

            <div className="text-right text-xs">
              <Link to="/forgot-password" className="text-teal-400 hover:underline">Forgot password?</Link>
            </div>
          </motion.form>

          <div className="mt-10 pt-6 border-t border-border text-sm text-foreground/50">
            New to Aqua Rudra?{' '}
            <Link to="/signup" className="text-teal-400 hover:underline font-medium">Create an account</Link>
          </div>

          <div className="mt-4 text-[11px] text-foreground/30 leading-relaxed">
            By signing in you agree to our <Link to="/terms" className="underline hover:text-foreground/60">Terms</Link> and{' '}
            <Link to="/privacy" className="underline hover:text-foreground/60">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
