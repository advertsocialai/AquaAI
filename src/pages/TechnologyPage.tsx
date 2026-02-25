import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const TechnologyPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <section className="relative h-screen flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1920&q=80')`,
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
              Our Technology
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-lg leading-relaxed">
              The full stack of longevity AI infrastructure — from research-grade prediction models to production systems.
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
                AI-First Architecture
              </h2>
              <p className="text-white/60 leading-relaxed">
                Our platform is built from the ground up with AI at its core. We leverage deep learning, transformer architectures, and proprietary datasets to build models that understand the complex biology of aging.
              </p>
            </div>
            <div className="border-t border-white/10" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-4">
                Multi-Omics Integration
              </h2>
              <p className="text-white/60 leading-relaxed">
                We combine genomics, proteomics, metabolomics, and clinical data into unified models that capture the full picture of biological aging — not just individual biomarkers.
              </p>
            </div>
            <div className="border-t border-white/10" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-4">
                Production-Ready Systems
              </h2>
              <p className="text-white/60 leading-relaxed">
                Every model we develop is designed for deployment. Our infrastructure handles real-time inference, continuous learning, and scalable data pipelines for clinical and research partners.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TechnologyPage;
