import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Check } from 'lucide-react';
import { LANGUAGES } from '@/lib/i18n';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 ${
          compact
            ? 'px-2 py-1.5 text-xs text-foreground/70 hover:text-foreground'
            : 'px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-sm text-foreground/80'
        }`}
        aria-label="Change language"
      >
        <Languages className="w-3.5 h-3.5" />
        <span>{current.native}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 z-50 rounded-xl border border-border bg-popover/95 backdrop-blur-xl p-1 shadow-2xl"
          >
            {LANGUAGES.map((l) => {
              const selected = l.code === i18n.resolvedLanguage;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    i18n.changeLanguage(l.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                    selected ? 'bg-card text-foreground' : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{l.native}</span>
                    <span className="text-[10px] text-foreground/40">{l.name}</span>
                  </div>
                  {selected && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
