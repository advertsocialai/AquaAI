import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TextReveal } from '@/components/ui/text-reveal';

const sections = [
  {
    num: "01",
    title: "What Is Biological Age?",
    body: "Unlike chronological age, biological age reflects the true state of your body's systems. Two people born the same year can have vastly different biological ages based on lifestyle, genetics, and environmental factors.",
  },
  {
    num: "02",
    title: "How We Measure It",
    body: "Our AI models analyze blood biomarkers, epigenetic data, and clinical measurements to compute a precise biological age score. This score is validated against longitudinal health outcomes.",
  },
  {
    num: "03",
    title: "Why It Matters",
    body: "Knowing your biological age enables personalized interventions — from lifestyle changes to targeted therapies — that can slow or even reverse aspects of aging. It's the foundation of precision longevity.",
  },
];

const BioAgePage = () => {
  useEffect(() => { document.title = "Biological Age — BohrX.ai"; }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative h-screen flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 pb-24">
          <div className="max-w-2xl">
            <TextReveal
              text="Biological Age"
              as="h1"
              className="text-5xl md:text-7xl font-bold text-foreground uppercase tracking-tight leading-[1.05] mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-base md:text-lg text-foreground/70 max-w-lg leading-relaxed"
            >
              Your biological age is the truest measure of your health. Our AI decodes the signals hidden in your biology.
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

export default BioAgePage;
