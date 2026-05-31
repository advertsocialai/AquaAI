import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Square, Pause, Play } from 'lucide-react';

// Maps the app's i18n code → BCP-47 locale used by SpeechSynthesisVoice.lang
const LANG_MAP: Record<string, string> = {
  en: 'en-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
  od: 'or-IN',
  bn: 'bn-IN',
};

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  // Exact BCP-47 match first, then language-prefix match, then English fallback.
  return (
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith(lang.split('-')[0])) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0] ||
    null
  );
}

// Pull readable text from the current page — skip the floating widget itself,
// hidden elements, and script/style nodes.
function extractPageText(): string {
  const main = document.querySelector('main') || document.body;
  const ignore = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG']);
  const parts: string[] = [];
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest('[data-voice-skip]')) return NodeFilter.FILTER_REJECT;
      if (ignore.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      const style = window.getComputedStyle(parent);
      if (style.display === 'none' || style.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
      const text = node.textContent?.trim();
      if (!text) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const t = n.textContent?.trim();
    if (t && t.length > 1) parts.push(t);
  }
  return parts.join('. ');
}

export function VoiceReader() {
  const { i18n, t } = useTranslation();
  const [state, setState] = useState<'idle' | 'speaking' | 'paused'>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Trigger voice list load (Chrome quirk — voices aren't ready until 'voiceschanged' fires).
  useEffect(() => {
    if (!supported) return;
    const ping = () => window.speechSynthesis.getVoices();
    ping();
    window.speechSynthesis.addEventListener?.('voiceschanged', ping);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', ping);
  }, [supported]);

  // Stop any speech on unmount or language change.
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  const start = () => {
    if (!supported) return;
    const text = extractPageText();
    if (!text) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    const lang = LANG_MAP[i18n.language] || 'en-IN';
    u.lang = lang;
    const voice = pickVoice(lang);
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.pitch = 1;
    u.onend = () => setState('idle');
    u.onerror = () => setState('idle');
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
    setState('speaking');
  };

  const stop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setState('idle');
  };

  const togglePause = () => {
    if (!supported) return;
    if (state === 'speaking') {
      window.speechSynthesis.pause();
      setState('paused');
    } else if (state === 'paused') {
      window.speechSynthesis.resume();
      setState('speaking');
    }
  };

  if (!supported) return null;

  return (
    <div
      data-voice-skip
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2"
    >
      {state === 'idle' ? (
        <button
          onClick={start}
          aria-label={t('voice.readPage')}
          className="group inline-flex items-center gap-2 px-4 py-3 rounded-full bg-teal-400 hover:bg-teal-300 text-black font-semibold text-sm shadow-2xl shadow-teal-500/30 transition"
        >
          <Mic className="w-4 h-4" />
          <span className="hidden md:inline">{t('voice.readPage')}</span>
        </button>
      ) : (
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-teal-400 text-black shadow-2xl shadow-teal-500/30">
          <button
            onClick={togglePause}
            aria-label={state === 'paused' ? t('voice.resume') : t('voice.pause')}
            className="p-1.5 rounded-full hover:bg-black/10"
          >
            {state === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={stop}
            aria-label={t('voice.stop')}
            className="p-1.5 rounded-full hover:bg-black/10"
          >
            <Square className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold pr-2">
            {state === 'paused' ? t('voice.paused') : t('voice.reading')}
          </span>
        </div>
      )}
    </div>
  );
}
