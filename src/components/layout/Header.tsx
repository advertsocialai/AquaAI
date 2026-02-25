import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import bhorxLogo from '@/assets/bhorx-logo.png';

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
            <img src={bhorxLogo} alt="BohrX.ai Logo" className="w-10 h-10 object-contain" />
            <span className="text-lg font-bold text-white tracking-wider">
              BOHRX<span className="font-light">.AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-xs font-medium text-white/70 hover:text-white transition-colors tracking-[0.2em]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link to="/collaborate" className="text-xs font-medium text-white/70 hover:text-white transition-colors tracking-[0.2em]">
              CONTACT
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-8 bg-black/95 backdrop-blur-sm">
            <nav className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors tracking-[0.2em]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
