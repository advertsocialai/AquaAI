import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TextReveal } from '@/components/ui/text-reveal';
import founderOneImg from '@/assets/founder-one.jpg';
import founderTwoImg from '@/assets/founder-two.jpg';

const founders = [
  {
    name: "Chaitanya Gowtham Raju",
    role: "Co-Founder",
    bio: "Architect of scalable AI platforms enabling secure, cloud-native deployment of advanced machine learning and generative AI systems.\nExpert in building production-grade AI infrastructure that powers biomedical research, large-scale data processing, and intelligent automation.",
    image: founderOneImg,
  },
  {
    name: "Sridhara Syam Sharma",
    role: "Co-Founder",
    bio: "AI researcher and builder focused on healthcare intelligence and scalable ML systems. Worked on EEG-based diagnostics, quantum-ML frameworks, and real-world AI deployment.\nDriven by building systems that move from research to measurable impact.",
    image: founderTwoImg,
  },
];

const FoundersPage = () => {
  useEffect(() => { document.title = "Founders — BohrX.ai"; }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative h-screen flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80')`,
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
              The team behind BohrX.ai — researchers, engineers, and visionaries on a mission to decode aging.
            </motion.p>
          </div>
        </div>
      </section>

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
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {founder.bio}
                </p>
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
