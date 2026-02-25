import { motion } from 'framer-motion';

export function Research() {
  return (
    <section id="research" className="relative h-screen flex items-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1920&q=80')`,
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
            Science at the Core
          </h2>
          <p className="text-base md:text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
            Our work is grounded in peer-reviewed research, open benchmarks, and reproducible experiments. Every model we deploy has been rigorously validated.
          </p>
          <a
            href="#"
            className="inline-block border border-white/40 text-white text-xs tracking-[0.25em] font-medium px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 uppercase"
          >
            View Publications
          </a>
        </motion.div>
      </div>
    </section>
  );
}
