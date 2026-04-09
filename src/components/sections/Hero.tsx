import { motion } from "framer-motion";
import { TextReveal } from "@/components/ui/text-reveal";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] md:h-screen flex items-end overflow-hidden md:snap-start">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pb-24">
        <div className="max-w-2xl">
          <TextReveal
            text="Decoding the Science of Longevity"
            as="h1"
            className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tight leading-[1.05] mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-lg text-white/70 mb-8 max-w-lg leading-relaxed"
          >
            AI-powered tools that turn complex biological data into actionable insights—advancing healthspan research and personalized medicine.
          </motion.p>
          <motion.a
            href="#technology"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="inline-block border border-white/40 text-white text-xs tracking-[0.25em] font-medium px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 uppercase"
          >
            Explore
          </motion.a>
        </div>
      </div>
    </section>
  );
}
