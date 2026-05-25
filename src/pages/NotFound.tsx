import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "404 — Aqua AI";
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <h1 className="mb-4 text-8xl font-bold text-foreground tracking-tight">404</h1>
        <p className="mb-8 text-sm text-muted-foreground uppercase tracking-[0.25em]">
          Page not found
        </p>
        <Link
          to="/"
          className="inline-block border border-foreground/40 text-foreground text-xs tracking-[0.25em] font-medium px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300 uppercase"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
