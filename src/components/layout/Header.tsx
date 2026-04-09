import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import atomLogo from '@/assets/atom-logo.svg';

const navItems = [
  { label: "TECHNOLOGY", to: "/technology" },
  { label: "BIO-AGE", to: "/bioage" },
  { label: "ALZHEIMER'S", to: "/alzheimers" },
  { label: "FOUNDERS", to: "/founders" },
  { label: "COLLABORATE", to: "/collaborate" },
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
        scrolled ? 'bg-black/60 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={atomLogo} alt="BohrX.ai Logo" className="w-10 h-10 object-contain brightness-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            <span className="text-lg font-bold text-white tracking-wider drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]">
              BOHRX<span className="font-light">.AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-xs font-medium text-white/90 hover:text-white transition-colors tracking-[0.2em] drop-shadow-[0_0_4px_rgba(255,255,255,0.15)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link to="/collaborate" className="text-xs font-medium text-white/90 hover:text-white transition-colors tracking-[0.2em] drop-shadow-[0_0_4px_rgba(255,255,255,0.15)]">
              CONTACT
            </Link>
          </div>
          {/* Mobile nav links also boosted */}

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
              <nav className="flex flex-col gap-6 py-8">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={item.to}
                      className="text-sm font-medium text-white/70 hover:text-white transition-colors tracking-[0.2em]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
