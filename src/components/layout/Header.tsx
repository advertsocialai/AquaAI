import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import atomLogo from '@/assets/atom-logo.svg';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const navItems = [
  { label: 'AQUA AI',       to: '/aquaai' },
  { label: 'KNOWLEDGE',     to: '/knowledge' },
  { label: 'ABOUT',         to: '/about' },
  { label: 'CAREERS',       to: '/careers' },
  { label: 'CONTACT',       to: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/70 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={atomLogo} alt="Aqua AI" className="w-10 h-10 object-contain brightness-125 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
            <span className="text-lg font-bold text-white tracking-wider drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]">
              AQUA<span className="font-light"> AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-xs font-medium text-white/90 hover:text-cyan-300 transition-colors tracking-[0.2em]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white/90 hover:bg-white/[0.06] tracking-[0.15em] border border-white/10"
            >
              <LogIn className="w-3.5 h-3.5" /> SIGN IN
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-black bg-cyan-400 hover:bg-cyan-300 tracking-[0.15em]"
            >
              <UserPlus className="w-3.5 h-3.5" /> SIGN UP
            </Link>
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
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={item.to}
                      className="text-sm font-medium text-white/80 hover:text-cyan-300 tracking-[0.2em]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs text-white border border-white/10"
                  >
                    <LogIn className="w-3.5 h-3.5" /> SIGN IN
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-black bg-cyan-400"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> SIGN UP
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
