import { motion } from 'framer-motion';
import { Database, Cpu, Brain, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: Database,
    label: 'Data Collection',
    description: 'Clinical biomarkers, EEG signals, and multi-omics datasets from research partners.',
  },
  {
    icon: Cpu,
    label: 'Multi-Omics Processing',
    description: 'Unified pipelines that integrate genomics, proteomics, and metabolomics data.',
  },
  {
    icon: Brain,
    label: 'AI Modeling',
    description: 'Deep learning architectures trained on large-scale longitudinal health data.',
  },
  {
    icon: BarChart3,
    label: 'Insight Delivery',
    description: 'Actionable shrimp seed quality scores and disease risk assessments for VLEs, hatcheries and farmers.',
  },
];

export function Pipeline() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-4 text-center"
        >
          Our Pipeline
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight text-center mb-20"
        >
          From Data to Discovery
        </motion.h2>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-border" />
          
          {/* Animated dot */}
          <motion.div
            className="hidden md:block absolute top-[45px] w-2 h-2 rounded-full bg-foreground"
            initial={{ left: '0%' }}
            whileInView={{ left: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-24 h-24 border border-border flex items-center justify-center mx-auto mb-6 relative bg-background">
                  <step.icon className="w-8 h-8 text-foreground/70" strokeWidth={1} />
                </div>
                <span className="text-xs text-muted-foreground tracking-[0.2em] font-mono block mb-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                  {step.label}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px] mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
