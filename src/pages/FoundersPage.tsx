import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import founderOneImg from '@/assets/founder-one.jpg';
import founderTwoImg from '@/assets/founder-two.jpg';

const founders = [
  {
    name: "Founder One",
    role: "Co-Founder",
    bio: "Visionary leader with a background in computational biology and AI. Passionate about using technology to extend healthy human lifespan.",
    image: founderOneImg,
  },
  {
    name: "Founder Two",
    role: "Co-Founder",
    bio: "Deep learning researcher and engineer with expertise in multi-omics data integration and scalable AI infrastructure.",
    image: founderTwoImg,
  },
];

const FoundersPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <section className="relative h-screen flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80')`,
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
              Our Founders
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-lg leading-relaxed">
              The team behind BhorX.ai — researchers, engineers, and visionaries on a mission to decode aging.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-black">
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
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-1">
                  {founder.name}
                </h3>
                <p className="text-xs text-white/50 uppercase tracking-[0.2em] mb-4">
                  {founder.role}
                </p>
                <p className="text-sm text-white/60 leading-relaxed">
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
