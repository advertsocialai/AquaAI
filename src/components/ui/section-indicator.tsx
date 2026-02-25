import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionIndicatorProps {
  totalSections: number;
  containerSelector?: string;
}

export function SectionIndicator({ totalSections, containerSelector }: SectionIndicatorProps) {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const container = containerSelector
      ? document.querySelector(containerSelector)
      : null;

    const sections = document.querySelectorAll('[data-section]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-section'));
            if (idx) setCurrent(idx);
          }
        });
      },
      {
        root: container,
        threshold: 0.3,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [containerSelector]);

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs font-mono text-muted-foreground tracking-[0.2em]"
        >
          {String(current).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
      <span className="text-xs text-muted-foreground/40 font-mono">/</span>
      <span className="text-xs font-mono text-muted-foreground/40 tracking-[0.2em]">
        {String(totalSections).padStart(2, '0')}
      </span>
    </motion.div>
  );
}
