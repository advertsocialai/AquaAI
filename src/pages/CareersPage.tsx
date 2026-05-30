import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Clock, Wallet, TrendingUp, Smile, Heart, Lightbulb, MapPin,
  Sparkles, Target, Users, BookOpen, ArrowRight, Upload,
} from 'lucide-react';

const PERKS = [
  { icon: Clock,     title: 'Flexible Hours',       desc: 'AquaRudra offers flexible hours, empowering employees to tailor their work schedules for optimal work-life balance, making it easier to manage personal and professional commitments.' },
  { icon: Wallet,    title: 'Competitive Salaries', desc: 'AquaRudra values its employees by providing competitive salaries, recognizing their contributions and ensuring fair compensation within the aquaculture sector — supporting financial well-being and job satisfaction.' },
  { icon: TrendingUp,title: 'Career Growth',        desc: 'At AquaRudra, we foster career growth through continuous learning, mentoring and opportunities for advancement, enabling our team to achieve their professional aspirations within the dynamic aquaculture industry.' },
  { icon: Smile,     title: 'Fun Environment',      desc: 'AquaRudra cultivates a dynamic and enjoyable workplace culture, encouraging a sense of unity and providing enjoyable experiences that boost job satisfaction and employee well-being.' },
  { icon: Heart,     title: 'Meaningful Projects',  desc: 'AquaRudra offers employees the chance to engage in meaningful projects that impact the aquaculture industry, fostering a sense of purpose and contribution to sustainable farming practices.' },
  { icon: Lightbulb, title: 'Innovative Culture',   desc: 'AquaRudra nurtures an innovative culture that fuels creative thinking and encourages the development of cutting-edge solutions, fostering a dynamic environment that drives progress within aquaculture.' },
  { icon: MapPin,    title: 'Easy Location',        desc: 'We provide the flexibility to work remotely, whether it be from the convenience of your home or a location of your preference. Our remote work policy promotes a harmonious work-life equilibrium.' },
];

const WHY = [
  { icon: Sparkles, title: 'Innovation',  body: 'Join a team at the forefront of innovation in aquaculture technology. We are constantly exploring new ways to empower shrimp farmers with cutting-edge solutions — PCR-validated AI diagnostics, live mandi pricing, verified marketplaces.' },
  { icon: Target,   title: 'Impact',      body: "At AquaRudra, your work directly contributes to the growth and success of shrimp and fish farmers across India. We're not just building a company — we're building a brighter future for an entire industry." },
  { icon: Users,    title: 'Collaboration',body: 'Work alongside a diverse and passionate team dedicated to making a difference. AquaRudra fosters a culture of collaboration and learning, where your ideas and contributions are valued.' },
  { icon: BookOpen, title: 'Learning',    body: 'AquaRudra is dedicated to fostering a culture of perpetual learning and advancement. We offer extensive avenues for professional development, comprehensive training initiatives and direct access to leading industry authorities.' },
];

const OPENINGS = [
  { role: 'ML Engineer — Diagnostics',  location: 'Hyderabad / Remote', type: 'Full-time' },
  { role: 'Flutter Mobile Engineer',    location: 'Hyderabad / Remote', type: 'Full-time' },
  { role: 'Backend Engineer — FastAPI', location: 'Hyderabad / Remote', type: 'Full-time' },
  { role: 'Field Operations Lead',      location: 'Bhimavaram, AP',     type: 'Full-time' },
  { role: 'VLE Trainer — Telugu',       location: 'Andhra Pradesh',     type: 'Contract'  },
  { role: 'BD / Partnerships',          location: 'Vizag / Chennai',    type: 'Full-time' },
];

export default function CareersPage() {
  useEffect(() => { document.title = 'Careers — AquaRudra'; }, []);

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-black to-violet-500/10" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-xs tracking-widest uppercase mb-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          >
            Careers · We're hiring
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            Build the operating system<br />for Indian aquaculture
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-white/60 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            Join a small, focused team building AI diagnostics, live pricing, marketplace and
            logistics for 50,000+ farmers across five coastal states.
          </motion.p>
        </div>
      </section>

      {/* Career Perks */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="text-xs text-cyan-300 uppercase tracking-widest mb-3">Our Work Culture</div>
            <h2 className="text-3xl md:text-4xl font-bold">Career Perks</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PERKS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-cyan-300" />
                </div>
                <div className="text-base font-semibold text-white mb-2">{title}</div>
                <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AquaRudra */}
      <section className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-xs text-cyan-300 uppercase tracking-widest mb-3">AquaRudra Kingship</div>
            <h2 className="text-3xl md:text-4xl font-bold">Why AquaRudra?</h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto text-sm">
              At AquaRudra we are driven by innovation, collaboration and the pursuit of excellence.
              When you join our team, you become an integral part of an organisation dedicated to
              supporting shrimp and fish farmers and ensuring their success.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {WHY.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-violet-400/10 border border-violet-400/20">
                    <Icon className="w-5 h-5 text-violet-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <div className="mb-10">
            <div className="text-xs text-cyan-300 uppercase tracking-widest mb-3">Open Roles</div>
            <h2 className="text-3xl md:text-4xl font-bold">Current openings</h2>
          </div>
          <div className="space-y-3">
            {OPENINGS.map((o) => (
              <motion.div
                key={o.role}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition group"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-white">{o.role}</div>
                  <div className="text-xs text-white/40 mt-0.5">{o.location} · {o.type}</div>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/10 text-xs text-white/80 group-hover:text-cyan-300 transition"
                >
                  Apply <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join us in transforming India's aquaculture industry
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            If you're passionate about making a meaningful impact on India's aquaculture industry
            and want to be part of a team shaping the future of farming, AquaRudra is the place
            for you. Your career at AquaRudra begins here.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm"
          >
            <Upload className="w-4 h-4" /> Post your resume
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
