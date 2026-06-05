import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Activity, IndianRupee,
  BadgeCheck, ArrowRight, Fish, AlertCircle, Loader2, Lock, Smartphone,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { phoneToEmail } from '@/lib/phoneAuth';
import { DASHBOARD_ROUTE } from '@/pages/dashboards/configs';
import type { Role } from '@/components/dashboard/RoleSelector';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';

// Indian 10-digit mobile (starts 6-9). We prepend +91 when sending.
const PHONE_RE = /^[6-9]\d{9}$/;

const VALUE_PROPS = [
  { icon: Activity,      titleKey: 'prop1Title',  descKey: 'prop1Desc' },
  { icon: IndianRupee,   titleKey: 'prop2Title',  descKey: 'prop2Desc' },
  { icon: BadgeCheck,    titleKey: 'prop3Title',  descKey: 'prop3Desc' },
];

export default function LoginPage() {
  const { t } = useTranslation();
  useEffect(() => { document.title = 'Sign in — Aqua Rudra'; }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propIdx, setPropIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPropIdx((i) => (i + 1) % VALUE_PROPS.length), 4000);
    return () => clearInterval(id);
  }, []);

  const prop = VALUE_PROPS[propIdx];
  const PropIcon = prop.icon;
  const phoneValid = PHONE_RE.test(phone.trim());

  function goToDashboard(user: { user_metadata?: Record<string, unknown> } | null) {
    const role = (user?.user_metadata?.role as Role | undefined) ?? null;
    navigate(from ?? (role ? DASHBOARD_ROUTE[role] : '/aquaai#dashboard'), { replace: true });
  }

  // Mobile + password sign-in (via the email/password provider, no SMS).
  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (!phoneValid || password.length < 1) return;
    if (!supabase) { setError(t('loginPage.errAuthNotConfigured')); return; }
    setBusy(true);
    setError(null);
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: phoneToEmail(phone),
      password,
    });
    setBusy(false);
    if (err) {
      setError(
        /invalid login credentials/i.test(err.message)
          ? t('loginPage.errInvalidCredentials', 'Wrong mobile number or password.')
          : err.message,
      );
      return;
    }
    goToDashboard(data.user);
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
            {t('loginPage.tagline')}
          </div>

          <motion.div
            key={propIdx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-teal-400/10 border border-teal-400/20">
                <PropIcon className="w-6 h-6 text-teal-300" />
              </div>
              <div className="text-3xl md:text-4xl font-bold">{t(`loginPage.${prop.titleKey}`)}</div>
            </div>
            <p className="text-lg text-foreground/60 leading-relaxed">{t(`loginPage.${prop.descKey}`)}</p>
          </motion.div>

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
          <TypewriterEffect
            words={[
              { text: t('loginPage.welcomeWord1'), className: 'text-foreground' },
              { text: t('loginPage.welcomeWord2'), className: 'text-primary' },
            ]}
            className="text-3xl text-left mb-2"
          />
          <p className="text-sm text-foreground/50 mb-8">{t('loginPage.signInSubtitle')}</p>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg border border-red-400/30 bg-red-400/10 text-red-300 text-xs inline-flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={signIn}
            className="space-y-4"
          >
            <label className="block">
              <span className="text-xs text-foreground/40 uppercase tracking-widest">{t('loginPage.mobileNumberLabel')}</span>
              <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                <Smartphone className="w-4 h-4 text-teal-400" />
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
            </label>

            <label className="block">
              <span className="text-xs text-foreground/40 uppercase tracking-widest">{t('loginPage.passwordLabel', 'Password')}</span>
              <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
                <Lock className="w-4 h-4 text-teal-400" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('loginPage.passwordPlaceholder', 'Your password')}
                  className="bg-transparent outline-none text-foreground flex-1 text-sm"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={!phoneValid || password.length < 1 || busy}
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('loginPage.verifying')}</> : <>{t('loginPage.verifyAndSignIn')} <ShieldCheck className="w-4 h-4" /></>}
            </button>
            <p className="text-[11px] text-foreground/40 text-center">
              {t('loginPage.signInWithPasswordHelper', 'Sign in with the mobile number and password you registered.')}
            </p>
          </motion.form>

          <div className="mt-10 pt-6 border-t border-border text-sm text-foreground/50">
            {t('loginPage.newToBrand')}{' '}
            <Link to="/signup" className="text-teal-400 hover:underline font-medium">{t('loginPage.createAccount')}</Link>
          </div>

          <div className="mt-4 text-[11px] text-foreground/30 leading-relaxed">
            {t('loginPage.agreePrefix')} <Link to="/terms" className="underline hover:text-foreground/60">{t('loginPage.termsLink')}</Link> {t('loginPage.agreeAnd')}{' '}
            <Link to="/privacy" className="underline hover:text-foreground/60">{t('loginPage.privacyLink')}</Link>{t('loginPage.agreeSuffix')}
          </div>
        </div>
      </div>
    </div>
  );
}
