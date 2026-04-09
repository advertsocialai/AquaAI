import { motion, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-white/80 z-[100] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
