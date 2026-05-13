import { motion } from 'framer-motion';

const milestones = [
  { year: '2023', title: 'Founded', description: 'BohrX.ai incorporated with a vision to decode biological aging using AI.', upcoming: false },
  { year: '2023', title: 'First AI Model', description: 'Developed initial deep learning models for biological age prediction from blood biomarkers.', upcoming: false },
  { year: '2024', title: 'Bio-Age Platform', description: 'Released production-grade biological age scoring platform for research partners.', upcoming: false },
  { year: '2025', title: 'Clinical Validation', description: 'Partnering with clinical institutions to validate models in real-world settings.', upcoming: true },
  { year: '2026', title: 'Clinical Trials', description: 'Initiating clinical trials for AI-driven early intervention protocols.', upcoming: true },
];

export function Timeline() {
  return (
    <section className="py-32 bg-background relative">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-4 text-center"
        >
          Roadmap
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight text-center mb-20"
        >
          Our Journey
        </motion.h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          <div className="space-y-16">
            {milestones.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start gap-8 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className={`absolute left-4 md:left-1/2 w-3 h-3 border ${
                  m.upcoming ? 'border-dashed border-muted-foreground' : 'border-foreground bg-foreground'
                } -translate-x-1/2 mt-1 z-10`} />

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${
                  i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'
                } ${m.upcoming ? 'opacity-50' : ''}`}>
                  <span className="text-xs text-muted-foreground tracking-[0.3em] font-mono">{m.year}</span>
                  <h3 className={`text-lg font-bold text-foreground uppercase tracking-wider mt-1 mb-2 ${
                    m.upcoming ? 'border-b border-dashed border-border inline-block pb-1' : ''
                  }`}>
                    {m.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>
                  {m.upcoming && (
                    <span className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase mt-2 inline-block">
                      Upcoming
                    </span>
                  )}
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
