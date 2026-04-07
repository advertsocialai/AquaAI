import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const stats = [
  { value: '3400+', label: 'Biomarkers Analyzed' },
  { value: '12M+', label: 'Data Points Processed' },
  { value: '0.94', label: 'Model Accuracy (AUC)' },
  { value: '47', label: 'Research Partners' },
];

export function Stats() {
  return (
    <section className="min-h-[100svh] md:h-screen flex items-center md:snap-start bg-black relative overflow-hidden">
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-xs text-white/40 uppercase tracking-[0.3em] mb-16 text-center"
        >
          By the Numbers
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="text-center md:border-r md:last:border-r-0 border-white/10 px-4"
            >
              <AnimatedCounter
                value={stat.value}
                className="text-4xl md:text-6xl font-bold text-white tracking-tight block mb-3"
              />
              <span className="text-xs text-white/40 uppercase tracking-[0.2em]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
