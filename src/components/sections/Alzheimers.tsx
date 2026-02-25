import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Alzheimers() {
  return (
    <section className="relative h-screen flex items-end overflow-hidden snap-start">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tight leading-[1.05] mb-6">
            Detecting Alzheimer's Through EEG Signals
          </h2>
          <p className="text-base md:text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
            Using AI to analyze brainwave patterns for early detection of Alzheimer's disease — enabling intervention before symptoms appear.
          </p>
          <Link
            to="/alzheimers"
            className="inline-block border border-white/40 text-white text-xs tracking-[0.25em] font-medium px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 uppercase"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
