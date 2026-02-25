import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TextReveal } from '@/components/ui/text-reveal';
import { Brain, Cpu, Cloud, Zap, Dna, Database } from 'lucide-react';

const sections = [
  {
    num: "01",
    title: "AI-First Architecture",
    body: "Our platform is built from the ground up with AI at its core. We leverage deep learning, transformer architectures, and proprietary datasets to build models that understand the complex biology of aging.",
  },
  {
    num: "02",
    title: "Multi-Omics Integration",
    body: "We combine genomics, proteomics, metabolomics, and clinical data into unified models that capture the full picture of biological aging — not just individual biomarkers.",
  },
  {
    num: "03",
    title: "Production-Ready Systems",
    body: "Every model we develop is designed for deployment. Our infrastructure handles real-time inference, continuous learning, and scalable data pipelines for clinical and research partners.",
  },
];

const techStack = [
  { icon: Brain, label: 'Deep Learning', description: 'Custom neural architectures for biomarker analysis' },
  { icon: Cpu, label: 'Transformers', description: 'Attention-based models for sequential health data' },
  { icon: Cloud, label: 'Cloud Infrastructure', description: 'Scalable compute for training and inference' },
  { icon: Zap, label: 'Real-time Inference', description: 'Sub-second predictions at clinical scale' },
  { icon: Dna, label: 'Multi-Omics', description: 'Unified processing across biological modalities' },
  { icon: Database, label: 'Data Pipelines', description: 'Automated ETL for research and clinical data' },
];

const howItWorks = [
  { step: '01', title: 'Ingest', description: 'Raw biological data flows into our secure processing pipeline from clinical partners.' },
  { step: '02', title: 'Process', description: 'Multi-omics data is cleaned, normalized, and integrated into unified feature spaces.' },
  { step: '03', title: 'Predict', description: 'AI models generate biological age scores, risk profiles, and actionable insights.' },
];

const TechnologyPage = () => {
  useEffect(() => { document.title = "Technology — BohrX.ai"; }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative h-screen flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 pb-24">
          <div className="max-w-2xl">
            <TextReveal
              text="Our Technology"
              as="h1"
              className="text-5xl md:text-7xl font-bold text-foreground uppercase tracking-tight leading-[1.05] mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-base md:text-lg text-foreground/70 max-w-lg leading-relaxed"
            >
              The full stack of longevity AI infrastructure — from research-grade prediction models to production systems.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl space-y-16">
          {sections.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <span className="text-xs text-muted-foreground tracking-[0.3em] font-mono">{s.num}</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight mb-4 mt-2">
                {s.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
              {i < sections.length - 1 && <div className="border-t border-border mt-16" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-4 text-center"
          >
            Tech Stack
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight text-center mb-16"
          >
            Built for Scale
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {techStack.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border border-border p-8 text-center"
              >
                <t.icon className="w-8 h-8 text-foreground/60 mx-auto mb-4" strokeWidth={1} />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">{t.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-4 text-center"
          >
            Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight text-center mb-16"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center"
              >
                <span className="text-4xl font-bold text-foreground/10 font-mono block mb-4">{step.step}</span>
                <h3 className="text-lg font-bold text-foreground uppercase tracking-wider mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TechnologyPage;
