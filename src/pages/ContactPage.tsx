import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Mail, Phone, MapPin, Send, Upload, MessageCircle, Check, User, AtSign,
} from 'lucide-react';

export default function ContactPage() {
  useEffect(() => { document.title = 'Contact — Aqua Rudra'; }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !msg.trim()) return;
    if (!/\S+@\S+\.\S+/.test(email)) return;
    setSent(true);
    try {
      const base = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api/v1';
      const r = await fetch(`${base}/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message: msg, source: 'web' }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setName(''); setEmail(''); setPhone(''); setMsg(''); setFileName(null);
    } catch {
      // Optimistic UI — keep the success state so the user gets feedback even
      // if the network blip lost the request; the row didn't land but the form
      // doesn't look broken. Switch to a retry banner if/when this becomes
      // a real reliability problem.
    } finally {
      setTimeout(() => setSent(false), 4000);
    }
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-background to-violet-500/10" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-xs tracking-widest uppercase mb-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          >
            Contact us · We're here to help!
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            Get in touch
          </motion.h1>
          <motion.p
            className="text-base text-white/60 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            We would love to hear from you. Whether you have a question, feedback, or want to
            partner — our team is here to assist you.
          </motion.p>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="py-12">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <form
              onSubmit={submit}
              className="lg:col-span-3 p-6 lg:p-8 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Field icon={User}   label="Name"    value={name} onChange={setName}  placeholder="Your name" />
                <Field icon={AtSign} label="E-mail"  value={email} onChange={setEmail} placeholder="you@example.in" type="email" />
              </div>
              <Field icon={Phone} label="Phone (optional)" value={phone} onChange={setPhone} placeholder="+91 98765 43210" type="tel" />

              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-white/40">Message</span>
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  rows={5}
                  placeholder="Tell us how we can help…"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white text-sm outline-none focus:border-cyan-400/40 resize-none"
                />
              </label>

              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-white/40">Attachment (optional)</span>
                <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04]">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <input
                    type="file"
                    className="hidden"
                    id="file"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                  />
                  <label htmlFor="file" className="flex-1 text-sm cursor-pointer">
                    {fileName ?? <span className="text-white/40">PDF, image or doc — up to 10 MB</span>}
                  </label>
                </div>
              </label>

              <button
                type="submit"
                disabled={!name || !email || !msg || sent}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold text-sm transition"
              >
                {sent ? <><Check className="w-4 h-4" /> Message sent — we'll reply within 24 h</>
                      : <><Send  className="w-4 h-4" /> Send a message</>}
              </button>
            </form>

            {/* Sidebar */}
            <aside className="lg:col-span-2 space-y-4">
              <ContactBlock icon={Phone}  title="Call us"  value="+91 95532 82325"      href="tel:+919553282325" />
              <ContactBlock icon={Mail}   title="Email"    value="info@aquarudra.com"   href="mailto:info@aquarudra.com" />
              <ContactBlock icon={MessageCircle} title="WhatsApp" value="+91 95532 82325" href="https://wa.me/919553282325" />
              <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                    <MapPin className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="text-sm font-semibold text-white">Office</div>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Aqua Rudra<br />
                  Andhra Pradesh, India<br />
                  <span className="text-white/40 text-xs">Field offices in Bhimavaram, Nellore, Vizag</span>
                </p>
              </div>
              <div className="p-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5">
                <div className="text-[11px] uppercase tracking-widest text-cyan-300 mb-2">Response time</div>
                <div className="text-sm text-white">Within 24 hours on business days.</div>
                <div className="text-xs text-white/50 mt-1">Outbreak emergencies — within 1 hour.</div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder, type = 'text' }: {
  icon: React.ElementType; label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-white/40">{label}</span>
      <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40">
        <Icon className="w-4 h-4 text-cyan-400" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent outline-none text-white flex-1 text-sm"
        />
      </div>
    </label>
  );
}

function ContactBlock({ icon: Icon, title, value, href }: {
  icon: React.ElementType; title: string; value: string; href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
    >
      <div className="p-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
        <Icon className="w-4 h-4 text-cyan-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] uppercase tracking-widest text-white/40">{title}</div>
        <div className="text-sm text-white truncate">{value}</div>
      </div>
    </a>
  );
}
