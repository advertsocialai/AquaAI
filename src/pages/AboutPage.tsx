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
  { icon: Leaf,       text: 'Farming that protects the water and the coast for the long term.' },
  { icon: Lightbulb,  text: 'AI disease checks right at the pond — results in seconds, even offline.' },
  { icon: BarChart3,  text: 'Live market prices, so you sell at the right time for the best value.' },
  { icon: Heart,      text: 'Farmers come first — the app is built around what you actually need.' },
  { icon: Wrench,     text: 'Help through the whole crop cycle, in your own language.' },
  { icon: MessageCircleQuestion, text: 'Learn as you go — simple guides, videos and expert answers.' },
];

const CHALLENGES = [
  {
    challenge: 'Hard to get good inputs',
    challengeBody: 'Quality seed, feed and supplies are often hard to find and hard to trust.',
    solution: 'Reliable supply',
    solutionBody: 'Aqua Rudra connects you to checked suppliers, so you get quality seed, feed and inputs you can rely on.',
  },
  {
    challenge: 'Disease can wipe out a crop',
    challengeBody: 'Diseases like EHP, white spot and white gut can destroy a pond and your income.',
    solution: 'Catch disease early',
    solutionBody: 'Snap a photo and Aqua Rudra flags the disease risk in seconds — so you can act before it spreads.',
  },
  {
    challenge: 'Harm to the environment',
    challengeBody: 'Poor practices pollute the water and damage the coast.',
    solution: 'Farm sustainably',
    solutionBody: 'Aqua Rudra helps you use water and inputs wisely and follow safe, recognised standards.',
  },
  {
    challenge: 'Little technical help',
    challengeBody: 'Many farmers do not have easy access to expert guidance.',
    solution: 'Guidance in your language',
    solutionBody: 'Get plain advice, technical support and simple learning — so you can farm with confidence.',
  },
];

export default function AboutPage() {
  useEffect(() => { document.title = 'About — Aqua Rudra'; }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-background to-violet-500/10" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-300 text-xs tracking-widest uppercase mb-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          >
            Our Story
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Empowering farmers,<br />transforming aquaculture</h1>
          <p className="text-base text-foreground/60 max-w-3xl mx-auto leading-relaxed">
            AI-powered disease detection, live market prices, a verified marketplace, and logistics
            support — backed by expert guidance and official outbreak alerts.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <p className="text-base text-foreground/70 leading-relaxed mb-4">
            Aqua Rudra is more than an app — it's a community. We work closely with farmers,
            technicians and partners to make aquaculture stronger, together.
          </p>
          <p className="text-base text-foreground/70 leading-relaxed">
            Join us across India's coastal states, in 6 Indian languages, as we help make
            farming safer, fairer and more profitable.
          </p>
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-20 border-t border-border bg-card">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-xs text-teal-300 uppercase tracking-widest mb-3">Our Impact</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Driving progress in aquaculture</h2>
            <p className="text-sm text-foreground/60 max-w-2xl mx-auto">
              Aqua Rudra changes how farmers work — clearer decisions, fewer losses, and support
              in your own language. Here's the difference it makes:
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
                className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card"
              >
                <div className="p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20 shrink-0">
                  <Icon className="w-5 h-5 text-emerald-300" />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-xs text-teal-300 uppercase tracking-widest mb-3">What we solve</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Real problems, simple solutions</h2>
            <p className="text-sm text-foreground/60 max-w-2xl mx-auto">
              The everyday problems farmers face — and how Aqua Rudra helps with each one.
            </p>
          </div>

          <div className="relative">
            {/* center spine */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-card -translate-x-1/2" />
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
                    <div className="text-lg font-bold text-foreground mb-2">{c.challenge}</div>
                    <p className="text-sm text-foreground/60 leading-relaxed">{c.challengeBody}</p>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-400 ring-4 ring-teal-400/20" />
                  <div className="md:pl-6">
                    <div className="text-[11px] uppercase tracking-widest text-emerald-300 mb-2">Aqua Rudra's Solution</div>
                    <div className="text-lg font-bold text-foreground mb-2">{c.solution}</div>
                    <p className="text-sm text-foreground/60 leading-relaxed">{c.solutionBody}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Breaking Barriers — multilingual */}
      <section className="py-20 border-t border-border bg-card">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <div className="text-xs text-teal-300 uppercase tracking-widest mb-3">
            Embracing Challenges, Strengthening Ties
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for every Indian farmer</h2>
          <p className="text-base text-foreground/70 leading-relaxed mb-4">
            India speaks many languages, and every farmer deserves tools they can actually
            understand. So we removed the language barrier.
          </p>
          <p className="text-base text-foreground/70 leading-relaxed mb-8">
            Aqua Rudra works in 6 Indian languages, so farmers in every coastal state can use
            the knowledge, tools and support they need — in their own language.
          </p>
          <div className="inline-flex flex-wrap items-center gap-2 justify-center">
            {['English', 'తెలుగు', 'தமிழ்', 'हिन्दी', 'ଓଡ଼ିଆ', 'বাংলা'].map((lang) => (
              <span key={lang} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-sm text-foreground/80">
                <Languages className="w-3 h-3 text-teal-400" /> {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Get started with Aqua Rudra</h2>
          <p className="text-foreground/60 mb-8">
            Join farmers and traders across coastal India. Free to try — sign up in a few minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-semibold text-sm"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground/80 hover:bg-muted text-sm"
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
