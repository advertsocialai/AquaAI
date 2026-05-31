import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';

type Msg = { role: 'user' | 'bot'; text: string };

const QUICK = [
  'Today\'s vannamei 40-count price?',
  'Is there an EHP outbreak near me?',
  'How much feed for 500 kg biomass?',
  'How to verify a QC certificate?',
];

function answer(q: string): string {
  const t = q.toLowerCase();
  if (t.includes('price') || t.includes('vannamei')) return 'Vannamei 40-count is ₹420/kg today in your district (mandi avg ₹408). Check the Pricing tab for live updates.';
  if (t.includes('ehp') || t.includes('outbreak')) return 'There are 2 EHP-confirmed farms within 5 km in the last 48h. Run a QC scan now and consider 30% water exchange.';
  if (t.includes('feed') || t.includes('biomass')) return 'For 500 kg biomass at 4% body weight: 20 kg/day starter feed. Use the Calculators tab for FCR-adjusted estimates.';
  if (t.includes('qc') || t.includes('certif')) return 'Open the Reports tab → QC Certificate Archive. Every certificate has a QR you can scan to verify the HMAC signature.';
  if (t.includes('weather') || t.includes('cyclone')) return 'IMD forecast: 65mm rain tonight. Pond overflow risk medium. Lower water level by 4 inches.';
  if (t.includes('hello') || t.includes('hi ')) return 'Hi! I\'m your Aqua Rudra assistant. Ask about prices, diseases, water quality, feeding, or any farming question.';
  return 'I can help with pricing, disease alerts, calculators, QC certificates, weather, and government schemes. Try one of the quick options.';
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'bot', text: 'Hi! I\'m AquaI assistant. How can I help your farm today?' },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, open]);

  function send(text: string) {
    if (!text.trim()) return;
    const reply = answer(text);
    setMsgs((m) => [...m, { role: 'user', text }, { role: 'bot', text: reply }]);
    setInput('');
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-violet-500 shadow-lg shadow-teal-500/30 flex items-center justify-center text-white"
        aria-label="Open chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-3rem))] h-[520px] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-border bg-gradient-to-r from-teal-500/10 to-violet-500/10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-violet-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground">AquaI Assistant</div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online · multilingual
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-foreground/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-teal-500/20 text-teal-100 rounded-br-sm'
                        : 'bg-card text-foreground/90 rounded-bl-sm'
                    }`}
                  >
                    {m.role === 'bot' && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3 h-3 text-teal-400" />
                        <span className="text-[10px] uppercase tracking-widest text-teal-400">AquaI</span>
                      </div>
                    )}
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {msgs.length <= 2 && (
              <div className="px-4 pb-2">
                <div className="text-[10px] uppercase tracking-widest text-foreground/30 mb-2">Quick questions</div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-card hover:bg-muted text-foreground/70 text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-3 border-t border-border flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm outline-none focus:border-teal-400/40 placeholder:text-foreground/30"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-black transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
