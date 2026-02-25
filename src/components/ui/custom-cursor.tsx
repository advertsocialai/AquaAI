import { useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringX = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const ringY = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const ringScale = useSpring(1, { stiffness: 300, damping: 20 });

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.documentElement.style.cursor = 'none';

    const move = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
      ringX.set(e.clientX - 16);
      ringY.set(e.clientY - 16);
    };

    const grow = () => ringScale.set(1.8);
    const shrink = () => ringScale.set(1);

    window.addEventListener('mousemove', move);

    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach(el => {
        el.addEventListener('mouseenter', grow);
        el.addEventListener('mouseleave', shrink);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    // Initial pass
    document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', move);
      observer.disconnect();
    };
  }, [ringX, ringY, ringScale]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white z-[9999] pointer-events-none mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: ringX, y: ringY, scale: ringScale, willChange: 'transform' }}
      />
    </>
  );
}
