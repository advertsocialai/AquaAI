import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TextReveal } from '@/components/ui/text-reveal';

const ticker = ['RESEARCHERS', 'INSTITUTIONS', 'INVESTORS', 'CLINICIANS', 'BIOTECH', 'PHARMA', 'UNIVERSITIES', 'HOSPITALS'];

export function Collaboration() {
  return (
    <section id="collaborate" className="relative h-screen flex items-center justify-center overflow-hidden snap-start">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Centered typographic treatment */}
      <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-xs text-white/40 uppercase tracking-[0.4em] mb-8"
        >
          Partner With Us
        </motion.p>

        <TextReveal
          text="Join Our Mission"
          as="h2"
          className="text-5xl md:text-8xl font-bold text-white uppercase tracking-tight leading-[1.05] mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg text-white/60 mb-12 max-w-xl mx-auto leading-relaxed"
        >
          Whether you're a researcher, institution, or investor—we're looking for partners who share our vision of extending healthy human lifespan through AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            to="/collaborate"
            className="inline-block border border-white/40 text-white text-xs tracking-[0.25em] font-medium px-10 py-5 hover:bg-white hover:text-black transition-all duration-300 uppercase"
          >
            Get in Touch
          </Link>
        </motion.div>

        {/* Reverse-scrolling ticker */}
        <div className="overflow-hidden border-y border-white/10 py-4 mt-16">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            {[...ticker, ...ticker].map((item, i) => (
              <span key={i} className="text-xs text-white/30 tracking-[0.3em] font-medium">
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
