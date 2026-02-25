import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const BioAgePage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <section className="relative h-screen flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1920&q=80')`,
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
              Biological Age
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-lg leading-relaxed">
              Your biological age is the truest measure of your health. Our AI decodes the signals hidden in your biology.
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
                What Is Biological Age?
              </h2>
              <p className="text-white/60 leading-relaxed">
                Unlike chronological age, biological age reflects the true state of your body's systems. Two people born the same year can have vastly different biological ages based on lifestyle, genetics, and environmental factors.
              </p>
            </div>
            <div className="border-t border-white/10" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-4">
                How We Measure It
              </h2>
              <p className="text-white/60 leading-relaxed">
                Our AI models analyze blood biomarkers, epigenetic data, and clinical measurements to compute a precise biological age score. This score is validated against longitudinal health outcomes.
              </p>
            </div>
            <div className="border-t border-white/10" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-4">
                Why It Matters
              </h2>
              <p className="text-white/60 leading-relaxed">
                Knowing your biological age enables personalized interventions — from lifestyle changes to targeted therapies — that can slow or even reverse aspects of aging. It's the foundation of precision longevity.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BioAgePage;
