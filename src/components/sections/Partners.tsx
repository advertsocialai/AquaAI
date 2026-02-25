import { motion } from 'framer-motion';

const partners = [
  'Stanford Medicine', 'MIT CSAIL', 'NIH', 'Mayo Clinic', 'DeepMind Health',
  'Harvard Medical', 'Johns Hopkins', 'Broad Institute', 'UCSF', 'Max Planck',
];

export function Partners() {
  const doubled = [...partners, ...partners];

  return (
    <section className="py-20 bg-background border-t border-b border-border overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 mb-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-muted-foreground tracking-[0.3em] uppercase text-center"
        >
          Research Collaborators & Institutions
        </motion.p>
      </div>

      <div className="relative">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {doubled.map((name, i) => (
            <span
              key={i}
              className="text-lg md:text-xl font-bold text-foreground/10 uppercase tracking-[0.15em] mx-8 md:mx-12 shrink-0"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
