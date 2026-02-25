import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TextReveal } from '@/components/ui/text-reveal';

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
      <Footer />
    </div>
  );
};

export default TechnologyPage;
