import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Download, Rocket, LogIn, UserPlus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import atomLogo from '@/assets/atom-logo.svg';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const NAV = [
  { key: 'aquaai',    to: '/aquaai' },
  { key: 'farmer',    to: '/farmer' },
  { key: 'knowledge', to: '/knowledge' },
  { key: 'about',     to: '/about' },
  { key: 'careers',   to: '/careers' },
  { key: 'contact',   to: '/contact' },
];

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!startOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-getstarted]')) setStartOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [startOpen]);

  const goDownload = () => {
    setMobileMenuOpen(false);
    const scrollToIt = () => {
      const el = document.getElementById('download-app');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (location.pathname === '/') {
      scrollToIt();
    } else {
      navigate('/');
      setTimeout(scrollToIt, 100);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-ocean/95 backdrop-blur-md shadow-lg shadow-ocean/20' : 'bg-ocean'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={atomLogo} alt="Aqua Rudra" className="w-9 h-9 object-contain brightness-125 drop-shadow-[0_0_8px_rgba(18,165,148,0.5)]" />
            <span className="text-lg font-bold text-white tracking-wider">
              AQUA<span className="font-light"> RUDRA</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="text-sm font-medium text-white/85 hover:text-primary transition-colors tracking-[0.18em]"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              type="button"
              onClick={goDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-white border border-primary bg-primary/90 hover:bg-primary tracking-[0.12em]"
            >
              <Download className="w-4 h-4" /> {t('common.downloadApp')}
            </button>
            <div data-getstarted className="relative">
              <button
                type="button"
                onClick={() => setStartOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-coral-foreground bg-coral hover:bg-coral-hover tracking-[0.12em]"
              >
                <Rocket className="w-4 h-4" /> {t('common.getStarted')}
                <ChevronDown className={`w-4 h-4 transition-transform ${startOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {startOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover/95 backdrop-blur-sm overflow-hidden shadow-2xl"
                  >
                    <Link
                      to="/signup"
                      onClick={() => setStartOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-teal-400/10 transition border-b border-border"
                    >
                      <UserPlus className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-semibold">{t('common.signUp')}</div>
                        <div className="text-xs text-foreground/45">New to Aqua Rudra</div>
                      </div>
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setStartOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-teal-400/10 transition"
                    >
                      <LogIn className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-semibold">{t('common.signIn')}</div>
                        <div className="text-xs text-foreground/45">Returning user</div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground/70 hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden bg-popover/95 backdrop-blur-sm"
            >
              <nav className="flex flex-col gap-5 py-6">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={item.to}
                      className="text-sm font-medium text-foreground/80 hover:text-primary tracking-[0.2em]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </motion.div>
                ))}
                <button
                  type="button"
                  onClick={goDownload}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg text-sm font-medium text-primary border border-primary/40 bg-primary/[0.06]"
                >
                  <Download className="w-4 h-4" /> {t('common.downloadApp')}
                </button>
                <div className="text-xs uppercase tracking-widest text-primary mt-2 mb-1">
                  {t('common.getStarted')}
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg text-sm font-semibold text-coral-foreground bg-coral"
                  >
                    <UserPlus className="w-4 h-4" /> {t('common.signUp')}
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg text-sm text-foreground border border-border"
                  >
                    <LogIn className="w-4 h-4" /> {t('common.signIn')}
                  </Link>
                </div>
                <div className="pt-2"><LanguageSwitcher /></div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
