import { motion } from 'framer-motion';
import { TextReveal } from '@/components/ui/text-reveal';

const ticker = ['EPIGENETICS', 'PROTEOMICS', 'METABOLOMICS', 'GENOMICS', 'TRANSCRIPTOMICS', 'MICROBIOME', 'TELOMERE ANALYSIS'];

export function Research() {
  return (
    <section id="research" className="relative h-screen flex flex-col justify-end overflow-hidden snap-start">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* Horizontal scrolling ticker */}
      <div className="relative z-10 overflow-hidden border-y border-white/10 py-4 mb-12">
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
        <div className="max-w-2xl">
          <TextReveal
            text="Science at the Core"
            as="h2"
            className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tight leading-[1.05] mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-white/70 mb-8 max-w-lg leading-relaxed"
          >
            Our work is grounded in peer-reviewed research, open benchmarks, and reproducible experiments. Every model we deploy has been rigorously validated.
          </motion.p>
          <span className="inline-block border border-white/20 text-white/40 text-xs tracking-[0.25em] font-medium px-8 py-4 uppercase cursor-default">
            Publications Coming Soon
          </span>
        </div>
      </div>
    </section>
  );
}
