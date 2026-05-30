import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Leaf, Lightbulb, BarChart3, Heart, Wrench, MessageCircleQuestion,
  Layers, ShieldCheck, Sparkles, ArrowRight, Languages, MapPin,
} from 'lucide-react';

const IMPACT = [
  { icon: Leaf,       text: 'Dedicated to environmentally friendly practices for a sustainable future.' },
  { icon: Lightbulb,  text: 'Leading with cutting-edge AI solutions — PCR-validated diagnostics, on-device inference.' },
  { icon: BarChart3,  text: 'Providing farmers with timely market data for strategic crop sales.' },
  { icon: Heart,      text: 'Prioritising aqua farmers at the core of our approach — VLEs and farmers earn first.' },
  { icon: Wrench,     text: 'Providing technical assistance throughout the farming cycle, in 6 languages.' },
  { icon: MessageCircleQuestion, text: 'Knowledge sharing — articles, videos, courses, expert Q&A.' },
];

const CHALLENGES = [
  {
    challenge: 'Limited Input Access',
    challengeBody: 'Farmers face challenges in accessing quality inputs for aquaculture production.',
    solution: 'Streamlined Input Chain',
    solutionBody: 'Aqua Rudra builds an integrated supply chain for reliable access to quality feed, seed and other inputs from MPEDA-certified hatcheries.',
  },
  {
    challenge: 'Disease Outbreaks & Management',
    challengeBody: 'Disease outbreaks (EHP / WSSV / AHPND) in ponds can lead to significant losses for farmers, impacting their livelihoods.',
    solution: 'Effective Disease Management',
    solutionBody: 'Aqua Rudra implements disease surveillance, diagnosis tools and effective treatments with early warnings and management systems — PCR-grade AI in 30 seconds.',
  },
  {
    challenge: 'Environmental Sustainability',
    challengeBody: 'Unsustainable farming practices harm the environment through water pollution and habitat degradation.',
    solution: 'Sustainable Farming Practices',
    solutionBody: 'Aqua Rudra supports sustainable farming with efficient resource utilisation, water management, and OIE/WOAH-aligned disease standards.',
  },
  {
    challenge: 'Limited Technical Expertise',
    challengeBody: 'Many farmers lack technical expertise to adopt modern aquaculture practices.',
    solution: 'Technical and Knowledge Sharing',
    solutionBody: 'Aqua Rudra shares expertise, offers technical support and fosters skill development, empowering farmers to excel in aquaculture practices.',
  },
];

export default function AboutPage() {
  useEffect(() => { document.title = 'About — Aqua Rudra'; }, []);

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-black to-violet-500/10" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-xs tracking-widest uppercase mb-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          >
            Our Story
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Empowering farmers,<br />transforming aquaculture</h1>
          <p className="text-base text-white/60 max-w-3xl mx-auto leading-relaxed">
            Aqua Rudra's journey is rooted in our unwavering commitment to aquaculture excellence.
            Through rigorous research and AI engineering, we've crafted solutions tailored to
            address farmers' unique challenges — from PCR-validated AI diagnostics to live mandi
            pricing to a verified marketplace.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <p className="text-base text-white/70 leading-relaxed mb-4">
            Our story transcends technology — it's about fostering a robust community and
            meaningful connections. We believe in the power of collaboration and partnerships
            to shape a brighter future for aquaculture.
          </p>
          <p className="text-base text-white/70 leading-relaxed">
            Join us on this transformative journey, where together we're making a lasting
            impact in the world of farming, across 5 coastal states and 6 Indian languages.
          </p>
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-xs text-cyan-300 uppercase tracking-widest mb-3">Our Impact</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Driving progress in aquaculture</h2>
            <p className="text-sm text-white/60 max-w-2xl mx-auto">
              Over time, Aqua Rudra has made a measurable impact in aquaculture — helping farmers
              and changing the way they work. We operate in many languages, breaking barriers
              and transforming aquaculture nationwide. Here are some pivotal milestones:
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {IMPACT.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <div className="p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20 shrink-0">
                  <Icon className="w-5 h-5 text-emerald-300" />
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-xs text-cyan-300 uppercase tracking-widest mb-3">Our Change in Industry</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Aquaculture challenges & Aqua Rudra's solutions</h2>
            <p className="text-sm text-white/60 max-w-2xl mx-auto">
              Tackling obstacles — our journey of incremental solutions.
            </p>
          </div>

          <div className="relative">
            {/* center spine */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
            <div className="space-y-10">
              {CHALLENGES.map((c, i) => (
                <motion.div
                  key={c.challenge}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="grid md:grid-cols-2 gap-6 items-center relative"
                >
                  <div className="md:text-right">
                    <div className="text-[11px] uppercase tracking-widest text-red-300 mb-2">Challenge</div>
                    <div className="text-lg font-bold text-white mb-2">{c.challenge}</div>
                    <p className="text-sm text-white/60 leading-relaxed">{c.challengeBody}</p>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-cyan-400/20" />
                  <div className="md:pl-6">
                    <div className="text-[11px] uppercase tracking-widest text-emerald-300 mb-2">Aqua Rudra's Solution</div>
                    <div className="text-lg font-bold text-white mb-2">{c.solution}</div>
                    <p className="text-sm text-white/60 leading-relaxed">{c.solutionBody}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Breaking Barriers — multilingual */}
      <section className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <div className="text-xs text-cyan-300 uppercase tracking-widest mb-3">
            Embracing Challenges, Strengthening Ties
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Breaking barriers, connecting communities</h2>
          <p className="text-base text-white/70 leading-relaxed mb-4">
            At Aqua Rudra, we are dismantling language barriers and empowering Indian farmers
            through our multilingual platform. India's diversity boasts a vibrant tapestry of
            languages and we recognise the significance of offering accessible resources to
            farmers from various linguistic backgrounds.
          </p>
          <p className="text-base text-white/70 leading-relaxed mb-8">
            Our platform is thoughtfully designed to cater to multiple Indian languages,
            ensuring that farmers from different states and regions can effortlessly access
            the knowledge, tools and support required for thriving in aquaculture.
          </p>
          <div className="inline-flex flex-wrap items-center gap-2 justify-center">
            {['English', 'తెలుగు', 'தமிழ்', 'हिन्दी', 'ଓଡ଼ିଆ', 'বাংলা'].map((lang) => (
              <span key={lang} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-sm text-white/80">
                <Languages className="w-3 h-3 text-cyan-400" /> {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Be part of the journey</h2>
          <p className="text-white/60 mb-8">
            Join 50,000+ farmers, hatcheries, transporters, banks and government bodies on Aqua Rudra.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-white/80 hover:bg-white/[0.06] text-sm"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
