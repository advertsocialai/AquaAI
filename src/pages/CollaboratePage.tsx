import { motion } from 'framer-motion';
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const CollaboratePage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <section className="relative h-screen flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')`,
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
              Collaborate With Us
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-lg leading-relaxed">
              Whether you're a researcher, institution, or investor — we're looking for partners who share our vision.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-black">
        <div className="container mx-auto px-6 lg:px-8 max-w-xl">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4">
                Thank You
              </h2>
              <p className="text-white/60">
                We'll be in touch soon.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-[0.2em] mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-transparent border-b border-white/20 text-white py-3 text-sm focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-[0.2em] mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-transparent border-b border-white/20 text-white py-3 text-sm focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-[0.2em] mb-2">Organization</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-white/20 text-white py-3 text-sm focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-[0.2em] mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 text-white py-3 text-sm focus:outline-none focus:border-white/60 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="border border-white/40 text-white text-xs tracking-[0.25em] font-medium px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 uppercase"
              >
                Send Message
              </button>
            </motion.form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CollaboratePage;
