import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const AlzheimersPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <section className="relative h-screen flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tight leading-[1.05] mb-6">
              Alzheimer's Detection via EEG
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-lg leading-relaxed">
              Harnessing AI to analyze brainwave patterns for early, non-invasive detection of Alzheimer's disease.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-black">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-4">
                The Problem
              </h2>
              <p className="text-white/60 leading-relaxed">
                Alzheimer's disease affects over 55 million people worldwide. Current diagnostic methods are expensive, invasive, and often detect the disease too late for effective intervention. By the time symptoms are apparent, significant neurodegeneration has already occurred.
              </p>
            </div>
            <div className="border-t border-white/10" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-4">
                Our EEG Approach
              </h2>
              <p className="text-white/60 leading-relaxed">
                Electroencephalography (EEG) captures the brain's electrical activity non-invasively and affordably. We use advanced signal processing and deep learning to detect subtle patterns in EEG data that correlate with early-stage Alzheimer's — patterns invisible to the human eye.
              </p>
            </div>
            <div className="border-t border-white/10" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-4">
                AI Methodology
              </h2>
              <p className="text-white/60 leading-relaxed">
                Our models combine convolutional neural networks with attention mechanisms to process raw EEG signals. Trained on large-scale clinical datasets, they identify biomarkers of cognitive decline with high sensitivity and specificity.
              </p>
            </div>
            <div className="border-t border-white/10" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-4">
                Early Results
              </h2>
              <p className="text-white/60 leading-relaxed">
                Our preliminary research shows promising results in distinguishing healthy controls from early-stage Alzheimer's patients using only 5-minute EEG recordings. We are actively working with clinical partners to validate and expand these findings.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AlzheimersPage;
