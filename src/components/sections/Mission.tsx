import { motion } from 'framer-motion';

export function Mission() {
  return (
    <section className="py-32 md:py-48 bg-background relative">
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
        {/* Top rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-border mb-20 origin-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-12"
        >
          Our Mission
        </motion.p>

        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground uppercase tracking-tight leading-[1.1] mb-12"
        >
          We believe aging is a solvable problem.
        </motion.blockquote>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto"
        >
          At BohrX.ai, we are building the infrastructure to understand, measure, and ultimately reverse biological aging. 
          Not through speculation — through rigorous science, massive datasets, and AI systems designed to find what humans cannot.
        </motion.p>

        {/* Bottom rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-border mt-20 origin-center"
        />
      </div>
    </section>
  );
}
