import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TextReveal } from '@/components/ui/text-reveal';

export function BioAge() {
  return (
    <section id="bioage" className="relative min-h-[100svh] md:h-screen flex items-center overflow-hidden md:snap-start">
      {/* Split layout: image left, text right */}
      <div className="absolute inset-0 grid md:grid-cols-2">
        <div
          className="bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1920&q=80')`,
          }}
        />
        <div className="bg-black" />
      </div>
      {/* Gradient seam */}
      <div className="absolute inset-0 md:bg-gradient-to-r from-transparent via-black/60 to-black" />
      <div className="absolute inset-0 bg-black/40 md:bg-transparent" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="md:ml-[55%] max-w-lg">
          <TextReveal
            text="Understanding Biological Age"
            as="h2"
            className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tight leading-[1.05] mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-white/70 mb-8 leading-relaxed"
          >
            Biological age is the truest measure of your health and longevity potential. Our AI decodes the signals hidden in your biology.
          </motion.p>
          <Link
            to="/bioage"
            className="inline-block border border-white/40 text-white text-xs tracking-[0.25em] font-medium px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 uppercase"
          >
            Explore
          </Link>
        </div>
      </div>
    </section>
  );
}
