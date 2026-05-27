import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      // pb-28 reserves ~112px below every page so the fixed ChatBot + Voice
      // FABs (bottom-6, ~56px) don't overlap the page's last CTA on mobile.
      // sm:pb-12 trims it back on larger viewports where the FAB sits in
      // an empty margin.
      className="pb-28 sm:pb-12"
    >
      {children}
    </motion.div>
  );
}
