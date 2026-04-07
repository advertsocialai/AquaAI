import { Link } from 'react-router-dom';
import { TextReveal } from '@/components/ui/text-reveal';
import { motion } from 'framer-motion';

export function Alzheimers() {
  return (
    <section className="relative min-h-[100svh] md:h-screen flex items-end overflow-hidden md:snap-start">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pb-24">
        <div className="max-w-2xl">
          <TextReveal
            text="Detecting Alzheimer's Through EEG Signals"
            as="h2"
            className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tight leading-[1.05] mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-white/70 mb-8 max-w-lg leading-relaxed"
          >
            Using AI to analyze brainwave patterns for early detection of Alzheimer's disease — enabling intervention before symptoms appear.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/alzheimers"
              className="inline-block border border-white/40 text-white text-xs tracking-[0.25em] font-medium px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 uppercase"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
