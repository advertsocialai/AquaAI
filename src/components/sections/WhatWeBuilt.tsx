import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TextReveal } from '@/components/ui/text-reveal';

const ticker = ['DEEP LEARNING', 'TRANSFORMER MODELS', 'MULTI-OMICS', 'NEURAL NETWORKS', 'DATA PIPELINES', 'REAL-TIME INFERENCE', 'CONTINUOUS LEARNING'];

export function WhatWeBuilt() {
  return (
    <section id="technology" className="relative h-screen flex items-end overflow-hidden snap-start">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* Horizontal scrolling ticker */}
      <div className="absolute bottom-44 left-0 right-0 z-10 overflow-hidden border-y border-white/10 py-4">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} className="text-xs text-white/30 tracking-[0.3em] font-medium">
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pb-24">
        {/* Right-aligned layout — breaks the pattern */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-2xl ml-auto text-right"
        >
          <TextReveal
            text="Revolutionizing Longevity Science"
            as="h2"
            className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tight leading-[1.05] mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-white/70 mb-8 max-w-lg ml-auto leading-relaxed"
          >
            From research-grade prediction models to production systems, we build the full stack of longevity AI infrastructure.
          </motion.p>
          <Link
            to="/technology"
            className="inline-block border border-white/40 text-white text-xs tracking-[0.25em] font-medium px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 uppercase"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
