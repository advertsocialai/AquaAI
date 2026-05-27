import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram,
  Send, Check, ArrowRight,
} from 'lucide-react';
import atomLogo from '@/assets/atom-logo.svg';

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
  ];

  const PLATFORM_LINKS = [
    { label: t('modules.diagnostics'),  to: '/aquaai' },
    { label: t('modules.pricing'),      to: '/aquaai' },
    { label: t('modules.marketplace'),  to: '/aquaai' },
    { label: t('modules.logistics'),    to: '/aquaai' },
  ];

  const LEGAL_LINKS = [
    { label: t('footer.privacy'),  to: '/privacy' },
    { label: t('footer.terms'),    to: '/terms' },
    { label: t('common.signIn'),   to: '/login' },
    { label: t('common.signUp'),   to: '/signup' },
  ];

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  }

  return (
    <footer className="border-t border-white/10 bg-black">
      {/* Top: newsletter */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-sm uppercase tracking-widest text-cyan-300 mb-2">{t('footer.subscribe')}</div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('footer.tagline')}</h3>
            <p className="text-base text-white/55">{t('footer.subscribeSub')}</p>
          </div>
          <form onSubmit={subscribe} className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40">
              <Mail className="w-4 h-4 text-cyan-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.in"
                className="bg-transparent outline-none text-white text-sm flex-1 placeholder:text-white/30"
              />
            </div>
            <button
              type="submit"
              disabled={subscribed}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black font-semibold text-sm"
            >
              {subscribed ? <><Check className="w-4 h-4" /> Subscribed</> : <><Send className="w-4 h-4" /> Subscribe</>}
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container mx-auto px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand + apps */}
        <div className="col-span-2 md:col-span-2 space-y-4">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={atomLogo} alt="Aqua AI" className="w-9 h-9 object-contain" />
            <span className="text-xl font-bold text-white tracking-wider">AQUA<span className="font-light"> AI</span></span>
          </Link>
          <p className="text-base text-white/65 leading-relaxed max-w-sm">{t('footer.brandLine')}</p>
          <div className="flex items-center gap-2 pt-2">
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
              aria-label="Get it on Google Play"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                <path d="M3 20.5V3.5c0-.4.4-.7.8-.5l13 8.5c.4.2.4.8 0 1l-13 8.5c-.4.2-.8-.1-.8-.5z" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] uppercase text-white/40">Get it on</span>
                <span className="text-xs font-semibold text-white">Google Play</span>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
              aria-label="Download on the App Store"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                <path d="M17.05 12.04c-.03-2.79 2.28-4.13 2.38-4.2-1.3-1.9-3.32-2.16-4.04-2.19-1.72-.17-3.36 1.01-4.23 1.01-.87 0-2.22-.99-3.65-.96-1.88.03-3.61 1.09-4.58 2.77-1.95 3.38-.5 8.39 1.4 11.13.93 1.34 2.04 2.85 3.5 2.8 1.4-.06 1.93-.91 3.63-.91 1.7 0 2.18.91 3.66.88 1.51-.03 2.47-1.37 3.39-2.71 1.07-1.55 1.5-3.05 1.52-3.13-.03-.01-2.93-1.13-2.96-4.49zM14.5 4.07c.78-.94 1.3-2.25 1.16-3.55-1.12.04-2.47.74-3.27 1.68-.72.83-1.35 2.16-1.18 3.42 1.24.1 2.51-.63 3.29-1.55z" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] uppercase text-white/40">Download on</span>
                <span className="text-xs font-semibold text-white">App Store</span>
              </div>
            </a>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" aria-label="LinkedIn" className="text-white/40 hover:text-cyan-300"><Linkedin className="w-4 h-4" /></a>
            <a href="#" aria-label="Twitter"  className="text-white/40 hover:text-cyan-300"><Twitter className="w-4 h-4" /></a>
            <a href="#" aria-label="Facebook" className="text-white/40 hover:text-cyan-300"><Facebook className="w-4 h-4" /></a>
            <a href="#" aria-label="Instagram"className="text-white/40 hover:text-cyan-300"><Instagram className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div className="text-sm uppercase tracking-widest text-cyan-300 mb-5">{t('footer.quickLinks')}</div>
          <ul className="space-y-2">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-base text-white/65 hover:text-white transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Platform */}
        <div>
          <div className="text-sm uppercase tracking-widest text-cyan-300 mb-5">{t('footer.platform')}</div>
          <ul className="space-y-2">
            {PLATFORM_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-base text-white/65 hover:text-white transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get in touch */}
        <div>
          <div className="text-sm uppercase tracking-widest text-cyan-300 mb-5">{t('footer.getInTouch')}</div>
          <ul className="space-y-3 text-base">
            <li className="flex items-start gap-2.5 text-white/65">
              <Phone className="w-4 h-4 mt-1 text-cyan-400 shrink-0" />
              <a href="tel:+919000000000" className="hover:text-white">+91 90000 00000</a>
            </li>
            <li className="flex items-start gap-2.5 text-white/65">
              <Mail className="w-4 h-4 mt-1 text-cyan-400 shrink-0" />
              <a href="mailto:support@aquai.in" className="hover:text-white">support@aquai.in</a>
            </li>
            <li className="flex items-start gap-2.5 text-white/65">
              <MapPin className="w-4 h-4 mt-1 text-cyan-400 shrink-0" />
              <span>Andhra Pradesh, India</span>
            </li>
          </ul>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 mt-5 text-sm text-cyan-400 hover:underline"
          >
            {t('footer.sendMessage')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-3 text-sm text-white/45">
          <div>© {new Date().getFullYear()} {t('footer.copyright')}</div>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="hover:text-white/70 transition">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
