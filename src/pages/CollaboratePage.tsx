import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TextReveal } from '@/components/ui/text-reveal';

const CollaboratePage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', organization: '', message: '' });

  useEffect(() => { document.title = "Collaborate — Aqua Rudra"; }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Collaboration Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nOrganization: ${formData.organization}\n\nMessage:\n${formData.message}`
    );
    window.open(`mailto:support@aquai.in?subject=${subject}&body=${body}`, '_self');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative h-screen flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 pb-24">
          <div className="max-w-2xl">
            <TextReveal
              text="Collaborate With Us"
              as="h1"
              className="text-5xl md:text-7xl font-bold text-foreground uppercase tracking-tight leading-[1.05] mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-base md:text-lg text-foreground/70 max-w-lg leading-relaxed"
            >
              Whether you're a researcher, institution, or investor — we're looking for partners who share our vision.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-xl text-center space-y-4">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">Get In Touch</p>
          <a href="mailto:support@aquai.in" className="block text-sm text-foreground hover:text-foreground/70 transition-colors tracking-wider">
            support@aquai.in
          </a>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <a href="tel:+916304071465" className="hover:text-foreground transition-colors">+91 6304071465</a>
            <span className="hidden sm:inline text-border">|</span>
            <a href="tel:+16194399675" className="hover:text-foreground transition-colors">+1 (619) 439-9675</a>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-8 max-w-xl">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight mb-4">
                Thank You
              </h2>
              <p className="text-muted-foreground">
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
                <label className="block text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-border text-foreground py-3 text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-border text-foreground py-3 text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">Organization</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full bg-transparent border-b border-border text-foreground py-3 text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-b border-border text-foreground py-3 text-sm focus:outline-none focus:border-foreground/60 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="border border-foreground/40 text-foreground text-xs tracking-[0.25em] font-medium px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300 uppercase"
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
