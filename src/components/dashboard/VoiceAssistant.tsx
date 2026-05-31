import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Languages, Sparkles } from 'lucide-react';

const VOICE_LANGS = [
  { code: 'te-IN', label: 'తెలుగు', short: 'TE' },
  { code: 'ta-IN', label: 'தமிழ்',  short: 'TA' },
  { code: 'hi-IN', label: 'हिन्दी',  short: 'HI' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ',   short: 'OD' },
  { code: 'bn-IN', label: 'বাংলা',  short: 'BN' },
  { code: 'en-IN', label: 'English',short: 'EN' },
];

const SAMPLES: Record<string, { user: string; reply: string }[]> = {
  'te-IN': [
    { user: 'నేటి వన్నామేయ్ ధర ఎంత?',           reply: 'నేడు వన్నామేయ్ 40-కౌంట్ ₹420/కిలో. మండి కంటే ₹12 ఎక్కువ.' },
    { user: 'నా చెరువు DO తక్కువగా ఉంది, ఏం చేయాలి?', reply: 'వెంటనే ఎరేటర్ ఆన్ చేయండి. 30% నీటిని మార్చండి. ప్రోబయోటిక్ వాడండి.' },
    { user: 'EHP నివారణ ఎలా?',                  reply: 'CaO 50kg/ఎకరం. pH 12 వరకు పెంచండి. 7 రోజులు పొడి ఉంచండి.' },
  ],
  'ta-IN': [
    { user: 'இன்றைய இறால் விலை?', reply: 'வண்ணாமி 40-கவுன்ட் ₹420/கிலோ. மண்டியை விட ₹12 அதிகம்.' },
  ],
  'hi-IN': [
    { user: 'आज की वन्नामी कीमत?', reply: 'वन्नामी 40-काउंट ₹420/किलो। मंडी से ₹12 ज्यादा।' },
  ],
  'en-IN': [
    { user: 'What\'s vannamei 40-count today?',  reply: 'Vannamei 40-count ₹420/kg today. ₹12 over mandi average.' },
    { user: 'My pond DO is low — what do I do?', reply: 'Turn on all aerators. Exchange 30% water. Add probiotic.' },
  ],
};

export function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('te-IN');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  function speak(text: string, langCode: string) {
    const synth = synthRef.current;
    if (!synth) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);

    const voices = synth.getVoices();
    const match = voices.find((v) => v.lang.startsWith(langCode.split('-')[0]));
    if (match) utter.voice = match;

    synth.speak(utter);
  }

  function trigger() {
    const samples = SAMPLES[lang] ?? SAMPLES['en-IN'];
    const pick = samples[history.length % samples.length];
    setHistory((h) => [...h, { role: 'user', text: pick.user }, { role: 'assistant', text: pick.reply }]);
    setListening(true);
    setTimeout(() => {
      setListening(false);
      speak(pick.reply, lang);
    }, 800);
  }

  function stopSpeak() {
    synthRef.current?.cancel();
    setSpeaking(false);
  }

  return (
    <div className="p-6 rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-violet-400/10">
          <Mic className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Voice Assistant</div>
          <div className="text-[11px] text-foreground/40">Speak to Aqua Rudra in your language</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Languages className="w-3.5 h-3.5 text-foreground/40" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
          >
            {VOICE_LANGS.map((l) => <option key={l.code} value={l.code} className="bg-background">{l.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={trigger}
          disabled={listening}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center transition ${
            listening ? 'bg-red-500/30 border-red-400/50' : 'bg-violet-500/20 border-violet-400/40 hover:bg-violet-500/30'
          } border-2`}
        >
          {listening && (
            <span className="absolute inset-0 rounded-full animate-ping bg-red-500/30" />
          )}
          {listening ? <MicOff className="w-5 h-5 text-red-300" /> : <Mic className="w-5 h-5 text-violet-300" />}
        </button>
        <div className="flex-1 text-xs text-foreground/50">
          {listening ? 'Listening…' : speaking ? 'Speaking…' : 'Tap to talk · responses spoken back via Web Speech API'}
        </div>
        {speaking && (
          <button onClick={stopSpeak} className="p-2 rounded-lg bg-card hover:bg-muted text-foreground/70">
            <VolumeX className="w-4 h-4" />
          </button>
        )}
        {!speaking && history.length > 0 && (
          <button
            onClick={() => speak(history[history.length - 1].text, lang)}
            className="p-2 rounded-lg bg-card hover:bg-muted text-foreground/70"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 max-h-64 overflow-y-auto"
          >
            {history.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    m.role === 'user'
                      ? 'bg-violet-500/20 text-violet-100 rounded-br-sm'
                      : 'bg-card text-foreground/90 rounded-bl-sm flex items-start gap-2'
                  }`}
                >
                  {m.role === 'assistant' && <Sparkles className="w-3 h-3 text-teal-400 shrink-0 mt-1" />}
                  <span>{m.text}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {history.length === 0 && (
        <div className="text-[11px] text-foreground/30 mt-2 leading-relaxed">
          Tip: try "నేటి వన్నామేయ్ ధర ఎంత?" in Telugu, or any farming question in your language.
          Voice synthesis uses your browser's built-in speech engine.
        </div>
      )}
    </div>
  );
}
