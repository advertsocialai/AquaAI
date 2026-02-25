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

const keyFindings = [
  { stat: '89%', unit: 'sensitivity', label: 'Detection of early-stage Alzheimer\'s from 5-minute EEG recordings' },
  { stat: '5', unit: 'minutes', label: 'Recording time needed for a single diagnostic assessment' },
  { stat: '<$50', unit: 'per test', label: 'Estimated cost compared to $3,000+ for PET scans' },
];

const methodology = [
  { step: '01', title: 'Signal Acquisition', description: 'Standard 19-channel EEG recordings captured in clinical or at-home settings.' },
  { step: '02', title: 'Preprocessing', description: 'Artifact removal, bandpass filtering, and epoch segmentation of raw EEG signals.' },
  { step: '03', title: 'Feature Extraction', description: 'Spectral, temporal, and connectivity features extracted using signal processing algorithms.' },
  { step: '04', title: 'Classification', description: 'CNN-attention hybrid models classify signals as healthy, MCI, or early Alzheimer\'s.' },
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

      {/* Key Findings */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-4 text-center"
          >
            Key Findings
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
            {keyFindings.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-1">
                  {f.stat}
                </div>
                <div className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-3">{f.unit}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-4 text-center"
          >
            Methodology
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight text-center mb-16"
          >
            Our Approach
          </motion.h2>
          <div className="space-y-12">
            {methodology.map((m, i) => (
              <motion.div
                key={m.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex gap-6"
              >
                <span className="text-3xl font-bold text-foreground/10 font-mono shrink-0">{m.step}</span>
                <div>
                  <h3 className="text-lg font-bold text-foreground uppercase tracking-wider mb-2">{m.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AlzheimersPage;
