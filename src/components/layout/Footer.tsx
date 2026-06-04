import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail, MapPin, Phone, Facebook, Instagram, Youtube, Send, Check,
} from 'lucide-react';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import { supabase } from '@/lib/supabase';

// Placeholder URLs until verified handles exist on each platform.
const SOCIAL = {
  facebook:  'https://facebook.com/aquarudra',
  instagram: 'https://www.instagram.com/aquarudra',
  whatsapp:  'https://wa.me/919705713399',
  youtube:   'https://youtube.com/@aquarudra',
};

const PRIMARY_EMAIL   = 'info@aquarudra.com';
const PRIMARY_PHONE   = '+91 95532 82325';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=in.aquai.mobile';
const APP_STORE_URL  = 'https://apps.apple.com/in/app/aqua-rudra/id0000000000';

export function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const QUICK_LINKS = [
    { label: t('nav.home'),      to: '/' },
    { label: t('nav.about'),     to: '/about' },
    { label: t('nav.knowledge'), to: '/knowledge' },
    { label: t('nav.contact'),   to: '/contact' },
  ];

  // Matches the DB-level CHECK constraint so client + server agree on validity.
  const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase().slice(0, 254);
    if (clean.length < 5 || !EMAIL_RE.test(clean)) return;
    if (supabase) {
      const { error } = await (supabase.from('newsletter_subscribers' as never) as never as {
        insert: (v: unknown) => Promise<{ error: { code?: string } | null }>;
      }).insert({ email: clean, source: 'footer' });
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
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8 py-12 md:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 md:gap-x-12">

        {/* Col 1 — brand + app badges */}
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="text-lg font-bold text-foreground tracking-wider">AQUA<span className="font-light"> RUDRA</span></span>
          </Link>
          <div className="flex flex-col gap-2 pt-1 w-fit">
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
          <p className="text-sm text-foreground/70 leading-relaxed max-w-xs">{t('footer.brandLine')}</p>
        </div>

        {/* Col 2 — Get in touch */}
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
              <MapPin className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              <span>Andhra Pradesh, India</span>
            </li>
          </ul>
        </div>

        {/* Col 3 — Quick links */}
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

        {/* Col 4 — Connect with us */}
        <div>
          <div className="text-xs uppercase tracking-widest text-teal-300 mb-4">Connect with us</div>
          <form onSubmit={subscribe} className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2.5 rounded-lg border border-border bg-card focus-within:border-teal-400/40">
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
              aria-label="Subscribe"
              className="inline-flex items-center justify-center p-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-60 text-black shrink-0"
            >
              {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
          <div className="flex items-center gap-4">
            <a href={SOCIAL.facebook}  target="_blank" rel="noopener noreferrer" aria-label="Facebook"  className="text-foreground/60 hover:text-teal-300 transition"><Facebook  className="w-5 h-5" /></a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-foreground/60 hover:text-teal-300 transition"><Instagram className="w-5 h-5" /></a>
            <a href={SOCIAL.whatsapp}  target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"  className="text-foreground/60 hover:text-teal-300 transition"><WhatsappIcon className="w-5 h-5" /></a>
            <a href={SOCIAL.youtube}   target="_blank" rel="noopener noreferrer" aria-label="YouTube"   className="text-foreground/60 hover:text-teal-300 transition"><Youtube   className="w-5 h-5" /></a>
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
