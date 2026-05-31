import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail, MapPin, Phone, Facebook, Instagram, Youtube,
  Send, Check, ArrowRight,
} from 'lucide-react';
import atomLogo from '@/assets/atom-logo.svg';
import { supabase } from '@/lib/supabase';

// Placeholder URLs until verified handles exist on each platform.
const SOCIAL = {
  facebook:  'https://facebook.com/aquarudra',
  instagram: 'https://instagram.com/aquarudra',
  youtube:   'https://youtube.com/@aquarudra',
};

const PRIMARY_EMAIL   = 'info@aquarudra.com';
const SUPPORT_EMAIL   = 'aquaai3366@gmail.com';
const PRIMARY_PHONE   = '+91 95532 82325';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=in.aquai.mobile';
const APP_STORE_URL  = 'https://apps.apple.com/in/app/aqua-rudra/id0000000000';

export function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const QUICK_LINKS = [
    { label: t('nav.home'),      to: '/' },
    { label: t('nav.aquaai'),    to: '/aquaai' },
    { label: t('nav.knowledge'), to: '/knowledge' },
    { label: t('nav.about'),     to: '/about' },
    { label: t('nav.careers'),   to: '/careers' },
    { label: t('nav.contact'),   to: '/contact' },
    { label: 'Founders',         to: '/founders' },
  ];

  const ACCOUNT_LINKS = [
    { label: t('common.signIn'), to: '/login' },
    { label: t('common.signUp'), to: '/signup' },
    { label: 'Forgot password',  to: '/forgot-password' },
  ];

  const LEGAL_LINKS = [
    { label: t('footer.privacy'), to: '/privacy' },
    { label: t('footer.terms'),   to: '/terms' },
  ];

  // Matches the DB-level CHECK constraint so client + server agree on validity.
  const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase().slice(0, 254);
    if (clean.length < 5 || !EMAIL_RE.test(clean)) return;

    // Direct insert into Supabase. RLS policy enforces format server-side too,
    // and Prefer: return=minimal (supabase-js default) keeps anon out of SELECT.
    if (supabase) {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: clean, source: 'footer' });
      // 23505 = duplicate; treat as success so the form stays idempotent.
      if (error && error.code !== '23505') {
        console.warn('newsletter subscribe failed', error);
      }
    }
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  }

  return (
    <footer className="border-t border-border bg-background">
      {/* Top: newsletter */}
      <div className="border-b border-border">
        <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8 py-8 md:py-10 grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-teal-300 mb-2">{t('footer.subscribe')}</div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">{t('footer.tagline')}</h3>
            <p className="text-sm sm:text-base text-foreground/70">{t('footer.subscribeSub')}</p>
          </div>
          <form onSubmit={subscribe} className="flex items-center gap-2 w-full md:max-w-md md:ml-auto">
            <div className="flex items-center gap-2 flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-border bg-card focus-within:border-teal-400/40">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.in"
                autoComplete="email"
                spellCheck={false}
                maxLength={254}
                required
                className="bg-transparent outline-none text-foreground text-sm flex-1 min-w-0 placeholder:text-foreground/30"
              />
            </div>
            <button
              type="submit"
              disabled={subscribed}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-60 text-black font-semibold text-sm shrink-0"
            >
              {subscribed ? <><Check className="w-4 h-4" /> Subscribed</> : <><Send className="w-4 h-4" /> Subscribe</>}
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid — 3 columns on lg, 1 on mobile */}
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8 py-10 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-y-10 gap-x-8 md:gap-x-12">
        {/* Brand + apps + social */}
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={atomLogo} alt="Aqua Rudra" className="w-8 h-8 object-contain text-teal-300" />
            <span className="text-lg font-bold text-foreground tracking-wider">AQUA<span className="font-light"> RUDRA</span></span>
          </Link>
          <p className="text-sm text-foreground/70 leading-relaxed max-w-sm">{t('footer.brandLine')}</p>
          <div className="flex items-center gap-2 pt-1">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition"
              aria-label="Get it on Google Play"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-foreground" fill="currentColor">
                <path d="M3 20.5V3.5c0-.4.4-.7.8-.5l13 8.5c.4.2.4.8 0 1l-13 8.5c-.4.2-.8-.1-.8-.5z" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] uppercase text-foreground/60">Get it on</span>
                <span className="text-xs font-semibold text-foreground">Google Play</span>
              </div>
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition"
              aria-label="Download on the App Store"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-foreground" fill="currentColor">
                <path d="M17.05 12.04c-.03-2.79 2.28-4.13 2.38-4.2-1.3-1.9-3.32-2.16-4.04-2.19-1.72-.17-3.36 1.01-4.23 1.01-.87 0-2.22-.99-3.65-.96-1.88.03-3.61 1.09-4.58 2.77-1.95 3.38-.5 8.39 1.4 11.13.93 1.34 2.04 2.85 3.5 2.8 1.4-.06 1.93-.91 3.63-.91 1.7 0 2.18.91 3.66.88 1.51-.03 2.47-1.37 3.39-2.71 1.07-1.55 1.5-3.05 1.52-3.13-.03-.01-2.93-1.13-2.96-4.49zM14.5 4.07c.78-.94 1.3-2.25 1.16-3.55-1.12.04-2.47.74-3.27 1.68-.72.83-1.35 2.16-1.18 3.42 1.24.1 2.51-.63 3.29-1.55z" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] uppercase text-foreground/60">Download on</span>
                <span className="text-xs font-semibold text-foreground">App Store</span>
              </div>
            </a>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <a href={SOCIAL.facebook}  target="_blank" rel="noopener noreferrer" aria-label="Facebook"  className="text-foreground/60 hover:text-teal-300 transition"><Facebook  className="w-4 h-4" /></a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-foreground/60 hover:text-teal-300 transition"><Instagram className="w-4 h-4" /></a>
            <a href={SOCIAL.youtube}   target="_blank" rel="noopener noreferrer" aria-label="YouTube"   className="text-foreground/60 hover:text-teal-300 transition"><Youtube   className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div className="text-xs uppercase tracking-widest text-teal-300 mb-4">{t('footer.quickLinks')}</div>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-foreground/75 hover:text-foreground transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get in touch */}
        <div>
          <div className="text-xs uppercase tracking-widest text-teal-300 mb-4">{t('footer.getInTouch')}</div>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-start gap-2.5 text-foreground/75">
              <Phone className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              <a href={`tel:${PRIMARY_PHONE.replace(/\s/g, '')}`} className="hover:text-foreground transition">{PRIMARY_PHONE}</a>
            </li>
            <li className="flex items-start gap-2.5 text-foreground/75">
              <Mail className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              <a href={`mailto:${PRIMARY_EMAIL}`} className="hover:text-foreground transition break-all">{PRIMARY_EMAIL}</a>
            </li>
            <li className="flex items-start gap-2.5 text-foreground/75">
              <Mail className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-foreground transition break-all">{SUPPORT_EMAIL}</a>
            </li>
            <li className="flex items-start gap-2.5 text-foreground/75">
              <MapPin className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              <span>Andhra Pradesh, India</span>
            </li>
          </ul>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 mt-4 text-sm text-teal-400 hover:underline"
          >
            {t('footer.sendMessage')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-border">
        <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm text-foreground/60">
          <div>© {new Date().getFullYear()} {t('footer.copyright')}</div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {ACCOUNT_LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="hover:text-foreground transition">{l.label}</Link>
            ))}
            <span className="text-foreground/20" aria-hidden>•</span>
            {LEGAL_LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="hover:text-foreground transition">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden machine-readable links so search-engine + screen-reader audits
          confirm every store URL is intentional. */}
      <span data-voice-skip className="sr-only">
        <a href={PLAY_STORE_URL} aria-hidden="true">Google Play</a>
        <a href={APP_STORE_URL}  aria-hidden="true">App Store</a>
      </span>
    </footer>
  );
}
