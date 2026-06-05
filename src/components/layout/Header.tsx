import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Download, Rocket, LogIn, UserPlus, ChevronDown, LayoutDashboard, LogOut, LayoutDashboard as DashIcon, Settings, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ROLES } from '@/components/dashboard/RoleSelector';
import { DASHBOARD_ROUTE } from '@/pages/dashboards/configs';
import { useAuth } from '@/lib/auth';

const NAV = [
  { key: 'aquaai',    to: '/aquaai' },
  { key: 'knowledge', to: '/knowledge' },
  { key: 'about',     to: '/about' },
  { key: 'contact',   to: '/contact' },
];

export function Header() {
  const { t, i18n } = useTranslation();
  const isIndic = ['te', 'hi', 'bn', 'od'].includes(i18n.language);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const { session, user, role, signOut } = useAuth();

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

  useEffect(() => {
    if (!dashOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dashboards]')) setDashOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [dashOpen]);

  useEffect(() => {
    if (!acctOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-account]')) setAcctOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [acctOpen]);

  const handleSignOut = async () => {
    setAcctOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    navigate('/');
  };

  const displayName = (user?.user_metadata?.name as string | undefined) || user?.email || 'Account';
  const myDashboard = role ? DASHBOARD_ROUTE[role] : null;

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
            <span className="text-lg font-bold text-white tracking-wider">
              {isIndic ? t('brand.wordmark') : <>AQUA<span className="font-light"> RUDRA</span></>}
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
            <div
              data-dashboards
              className="relative"
              onMouseEnter={() => setDashOpen(true)}
              onMouseLeave={() => setDashOpen(false)}
            >
              <button
                type="button"
                onClick={() => setDashOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white/85 hover:text-primary transition-colors tracking-[0.18em]"
              >
                DASHBOARDS
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dashOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {dashOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-3 w-64 rounded-xl border border-border bg-popover/95 backdrop-blur-sm overflow-hidden shadow-2xl p-1.5 grid grid-cols-1 gap-0.5"
                  >
                    {ROLES.filter((r) => r.id === 'farmer' || r.id === 'trader').map(({ id, label, icon: Icon, accent }) => (
                      <Link
                        key={id}
                        to={DASHBOARD_ROUTE[id]}
                        onClick={() => setDashOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition"
                      >
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accent}22` }}>
                          <Icon className="w-4 h-4" style={{ color: accent }} />
                        </span>
                        <span className="font-medium">{label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
            {session ? (
              <div
                data-account
                className="relative"
                onMouseEnter={() => setAcctOpen(true)}
                onMouseLeave={() => setAcctOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setAcctOpen((v) => !v)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15"
                >
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold uppercase">
                    {displayName.charAt(0)}
                  </span>
                  <span className="max-w-[10rem] truncate">{displayName}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${acctOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {acctOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-60 rounded-xl border border-border bg-popover/95 backdrop-blur-sm overflow-hidden shadow-2xl"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <div className="text-sm font-semibold text-foreground truncate">{displayName}</div>
                        {user?.email && <div className="text-xs text-foreground/45 truncate">{user.email}</div>}
                      </div>
                      {myDashboard && (
                        <Link
                          to={myDashboard}
                          onClick={() => setAcctOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-teal-400/10 transition"
                        >
                          <DashIcon className="w-4 h-4 text-primary" /> My dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setAcctOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-teal-400/10 transition"
                      >
                        <UserIcon className="w-4 h-4 text-primary" /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setAcctOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-teal-400/10 transition"
                      >
                        <Settings className="w-4 h-4 text-primary" /> Settings
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-teal-400/10 transition border-t border-border"
                      >
                        <LogOut className="w-4 h-4 text-primary" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
            <div
              data-getstarted
              className="relative"
              onMouseEnter={() => setStartOpen(true)}
              onMouseLeave={() => setStartOpen(false)}
            >
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
            )}
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
              <nav className="flex flex-col gap-5 py-6 px-3">
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

                <div className="text-xs uppercase tracking-widest text-primary mt-2 mb-1 inline-flex items-center gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboards
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.filter((r) => r.id === 'farmer' || r.id === 'trader').map(({ id, label, icon: Icon, accent }) => (
                    <Link
                      key={id}
                      to={DASHBOARD_ROUTE[id]}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground/80 hover:bg-muted transition"
                    >
                      <Icon className="w-4 h-4 shrink-0" style={{ color: accent }} />
                      <span className="truncate">{label}</span>
                    </Link>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={goDownload}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg text-sm font-medium text-primary border border-primary/40 bg-primary/[0.06]"
                >
                  <Download className="w-4 h-4" /> {t('common.downloadApp')}
                </button>
                {session ? (
                  <>
                    <div className="flex items-center gap-3 mt-2 px-1">
                      <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold uppercase shrink-0">
                        {displayName.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{displayName}</div>
                        {user?.email && <div className="text-xs text-foreground/45 truncate">{user.email}</div>}
                      </div>
                    </div>
                    {myDashboard && (
                      <Link
                        to={myDashboard}
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-foreground border border-border"
                      >
                        <DashIcon className="w-4 h-4 text-primary" /> My dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-foreground border border-border"
                    >
                      <UserIcon className="w-4 h-4 text-primary" /> Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg text-sm font-semibold text-foreground border border-border"
                    >
                      <LogOut className="w-4 h-4 text-primary" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
                <div className="pt-2"><LanguageSwitcher /></div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
