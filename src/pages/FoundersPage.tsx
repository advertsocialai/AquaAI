import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TextReveal } from '@/components/ui/text-reveal';
import founderOneImg from '@/assets/founder-one.jpg';

const founders = [
  {
    name: "Chaitanya Gowtham",
    role: "Founder",
    bio: "Architect of scalable AI platforms enabling secure, cloud-native deployment of advanced machine learning and generative AI systems.\nExpert in building production-grade AI infrastructure that powers biomedical research, large-scale data processing, and intelligent automation.",
    image: founderOneImg,
    linkedin: "https://www.linkedin.com/in/chaitanya-gowtham/",
  },
];

const FoundersPage = () => {
  useEffect(() => { document.title = "Founders — AquaRudra"; }, []);

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
              text="Our Founders"
              as="h1"
              className="text-5xl md:text-7xl font-bold text-foreground uppercase tracking-tight leading-[1.05] mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-base md:text-lg text-foreground/70 max-w-lg leading-relaxed"
            >
              The team behind AquaRudra — engineers and researchers on a mission to decode aquaculture for India's farmers, hatcheries and government bodies.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Vision Quote */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight leading-[1.2] mb-6"
          >
            "We started AquaRudra because the biggest problems in Indian aquaculture won't be solved by incremental progress — they need a fundamentally different approach."
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs text-muted-foreground tracking-[0.3em] uppercase"
          >
            — The Founders
          </motion.p>
        </div>
      </section>

      {/* Founder Cards */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-16 max-w-2xl mx-auto">
            {founders.map((founder, i) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="text-center"
              >
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-6 grayscale"
                />
                <h3 className="text-lg font-bold text-foreground uppercase tracking-wider mb-1">
                  {founder.name}
                </h3>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4">
                  {founder.role}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {founder.bio}
                </p>
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider uppercase"
                >
                  <Linkedin className="w-4 h-4" strokeWidth={1.5} />
                  LinkedIn
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FoundersPage;
