import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TextReveal } from '@/components/ui/text-reveal';

const sections = [
  {
    num: "01",
    title: "The Problem",
    body: "Alzheimer's disease affects over 55 million people worldwide. Current diagnostic methods are expensive, invasive, and often detect the disease too late for effective intervention. By the time symptoms are apparent, significant neurodegeneration has already occurred.",
  },
  {
    num: "02",
    title: "Our EEG Approach",
    body: "Electroencephalography (EEG) captures the brain's electrical activity non-invasively and affordably. We use advanced signal processing and deep learning to detect subtle patterns in EEG data that correlate with early-stage Alzheimer's — patterns invisible to the human eye.",
  },
  {
    num: "03",
    title: "AI Methodology",
    body: "Our models combine convolutional neural networks with attention mechanisms to process raw EEG signals. Trained on large-scale clinical datasets, they identify biomarkers of cognitive decline with high sensitivity and specificity.",
  },
  {
    num: "04",
    title: "Early Results",
    body: "Our preliminary research shows promising results in distinguishing healthy controls from early-stage Alzheimer's patients using only 5-minute EEG recordings. We are actively working with clinical partners to validate and expand these findings.",
  },
];

const AlzheimersPage = () => {
  useEffect(() => { document.title = "Alzheimer's Detection — BohrX.ai"; }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative h-screen flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 pb-24">
          <div className="max-w-2xl">
            <TextReveal
              text="Alzheimer's Detection via EEG"
              as="h1"
              className="text-5xl md:text-7xl font-bold text-foreground uppercase tracking-tight leading-[1.05] mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-base md:text-lg text-foreground/70 max-w-lg leading-relaxed"
            >
              Harnessing AI to analyze brainwave patterns for early, non-invasive detection of Alzheimer's disease.
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

export default AlzheimersPage;
