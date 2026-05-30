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
        scrolled ? 'bg-black/70 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={atomLogo} alt="Aqua Rudra" className="w-11 h-11 object-contain brightness-125 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
            <span className="text-xl font-bold text-white tracking-wider drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]">
              AQUA<span className="font-light"> AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="text-sm font-medium text-white/90 hover:text-cyan-300 transition-colors tracking-[0.18em]"
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
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-cyan-300 border border-cyan-400/40 bg-cyan-400/[0.06] hover:bg-cyan-400/[0.12] tracking-[0.12em]"
            >
              <Download className="w-4 h-4" /> {t('common.downloadApp')}
            </button>
            <div data-getstarted className="relative">
              <button
                type="button"
                onClick={() => setStartOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-black bg-cyan-400 hover:bg-cyan-300 tracking-[0.12em]"
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
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-black/95 backdrop-blur-sm overflow-hidden shadow-2xl"
                  >
                    <Link
                      to="/signup"
                      onClick={() => setStartOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-cyan-400/10 transition border-b border-white/5"
                    >
                      <UserPlus className="w-4 h-4 text-cyan-300" />
                      <div>
                        <div className="font-semibold">{t('common.signUp')}</div>
                        <div className="text-xs text-white/45">New to Aqua Rudra</div>
                      </div>
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setStartOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-cyan-400/10 transition"
                    >
                      <LogIn className="w-4 h-4 text-cyan-300" />
                      <div>
                        <div className="font-semibold">{t('common.signIn')}</div>
                        <div className="text-xs text-white/45">Returning user</div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white"
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
              className="md:hidden overflow-hidden bg-black/95 backdrop-blur-sm"
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
                      className="text-sm font-medium text-white/80 hover:text-cyan-300 tracking-[0.2em]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </motion.div>
                ))}
                <button
                  type="button"
                  onClick={goDownload}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg text-sm font-medium text-cyan-300 border border-cyan-400/40 bg-cyan-400/[0.06]"
                >
                  <Download className="w-4 h-4" /> {t('common.downloadApp')}
                </button>
                <div className="text-xs uppercase tracking-widest text-cyan-300 mt-2 mb-1">
                  {t('common.getStarted')}
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg text-sm font-semibold text-black bg-cyan-400"
                  >
                    <UserPlus className="w-4 h-4" /> {t('common.signUp')}
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg text-sm text-white border border-white/10"
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
