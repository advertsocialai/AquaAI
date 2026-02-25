import { motion, useScroll } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-white/80 z-[100] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
