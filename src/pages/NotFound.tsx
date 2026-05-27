import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Home, Compass, BookOpen, Mail, Fish, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "404 — Aqua AI";
    // Help the team diagnose dead inbound links without crashing the browser.
    console.error("404 — non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-white overflow-hidden">
      {/* Same hero ambience as the homepage */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/15 via-black to-[#a78bfa]/15" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-xl px-6 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-xs tracking-widest uppercase mb-8">
          <Fish className="w-3.5 h-3.5" />
          Aqua AI
        </div>

        <h1 className="text-7xl md:text-9xl font-bold tracking-tight mb-4 bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-base md:text-lg text-white/70 mb-2">This page slipped past the net.</p>
        <p className="text-xs text-white/35 font-mono mb-10 break-all">
          {location.pathname}
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-sm transition mb-10"
        >
          <Home className="w-4 h-4" /> {t("common.home") || "Back to home"}
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-4">
          Or try one of these
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          <SuggestLink to="/aquaai"    icon={Compass}   label="Aqua AI" />
          <SuggestLink to="/knowledge" icon={BookOpen}  label="Knowledge" />
          <SuggestLink to="/contact"   icon={Mail}      label="Contact" />
        </div>
      </motion.div>
    </div>
  );
};

function SuggestLink({ to, icon: Icon, label }: {
  to: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1 p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-cyan-400/30 transition text-xs text-white/75"
    >
      <Icon className="w-4 h-4 text-cyan-300" />
      {label}
    </Link>
  );
}

export default NotFound;
